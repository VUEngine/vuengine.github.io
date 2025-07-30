---
layout: documentation
parents: Documentation > Tutorial
title: Versus Mode
---

# Versus Mode

Including multiplayer in any game can be a bit involved. We are going to try to extend this simple Pong clone as little as possible to handle 2 player matches.

There are various approaches in game development to handle net code. Here, we are going to use the simplest, which consist in simply running the same game twice relying on the deterministic nature of programs produced for the Virtual Boy and the fact that the game is simple enough to not require much in the way of sofisticated recovery mechanism.

We are going to modify the game to detect when another Virtual Boy system is connected through the EXT port and change to versus mode automatically. 

## Starting communications

To handle communications between two Virtual Boy systems, VUEngine provides the singleton [CommunicationManager](<(/documentation/api/class-communication-manager/)>). The first thing to do is to enable communications at the end of `TitleScreenState::enter`.

We need firt to override the `TitleScreenState::onEvent` method:

```
singleton class TitleScreenState : GameState
{
    [...]

    override bool onEvent(ListenerObject eventFirer, uint16 eventCode);

    [...]
}
```

Let's enable the communications now. The [CommunicationManager](<(/documentation/api/class-communication-manager/)>) will fire an event, `kEventCommunicationsConnected`, on the object provided as its scope once the handshake procedure with another system has succeeded.


```cpp
#include <CommunicationManager.h>
[...]

void TitleScreenState::enter(void* owner __attribute__((unused)))
{
    [...]

    CommunicationManager::enableCommunications(CommunicationManager::getInstance(), ListenerObject::safeCast(this));
}
```

And we are going to print a message to notify the players when the connection is successful:

```cpp
bool TitleScreenState::onEvent(ListenerObject eventFirer, uint16 eventCode)
{
    switch(eventCode)
    {
        case kEventCommunicationsConnected:
        {
            Printer::text("Connected", 24 - 4, 27, NULL);
            return false;
        }
    }

    return Base::onEvent(this, eventFirer, eventCode);
}
```

In `PongManager::constructor`, we are going to change the game to delay the moving of the `Disk` by 1 second, will disable the user inputs until it starts to move, and if another system is present, we are going to use the system's state during the intial handshake to decide which system corresponds to player 1.

```cpp
#include <CommunicationManager.h>

[...]

void PongManager::constructor(Stage stage)
{
    // Always explicitly call the base's constructor
    Base::constructor();

    [...]
    // Cache the Stage for later usage
    this->stage = stage;

    // Delay the starting of the game
    PongManager::sendMessageToSelf(this, kMessageStartGame, 1000, 0);

    // Disable the gameplay for a few cycles
    KeypadManager::disable();

    if(CommunicationManager::isConnected(CommunicationManager::getInstance()))
    {
        // Propagate the message about the versus mode player assigned to the local system
        Stage::propagateMessage
        (
            this->stage, Container::onPropagatedMessage, 
            CommunicationManager::isMaster(CommunicationManager::getInstance()) ? kMessageVersusModePlayer1 : kMessageVersusModePlayer2
        );

        Printer::text("Waiting", 24 - 3, 27, NULL);
    }
}
```

Add the messages `Star tGame`, `Versus Mode Player 1` and `Versus Mode Player 2` to the **Messages** file inside the _config_ folder. 

Don't forget to add a [Stage](/documentation/api/struct-stage-spec/) attribute to the `PongManager`:

```cpp
class PongManager : ListenerObject
{
    /// @privatesection

    [...]

    //// Cache of the stage
    Stage stage;

    [...]
};
```

Override the `handleMessage` method in `PongManager`:

```cpp
class PongManager : ListenerObject
{
    [...]

    override bool handleMessage(Telegram telegram);
}
```

And implement it as follows to process the `kMessageStartGame` message:

```cpp
#include <Telegram.h>

[...]

bool PongManager::handleMessage(Telegram telegram)
{
    switch(Telegram::getMessage(telegram))
    {
        case kMessageStartGame:
        {
            if(CommunicationManager::isConnected(CommunicationManager::getInstance()))
            {
                // Must make sure that both systems are in sync before starting the game
                CommunicationManager::startSyncCycle(CommunicationManager::getInstance());

                Printer::text("        ", 24 - 3, 27, NULL);
            }

            // Propagate the message to start the game
            Stage::propagateMessage(this->stage, Container::onPropagatedMessage, kMessageStartGame);

            // Since we are using the method processUserInput to sync both system, 
            // we must make sure that it is called regardless of local input
            KeypadManager::enableDummyKey();
            KeypadManager::enable();

            break;
        }
    }

    return true;
}
```


Since we want to always delay the initial movement of the `Disk` after each point too, modify the processing of the event `kEventActorCreated` as follows:

```cpp
bool PongManager::onEvent(ListenerObject eventFirer, uint16 eventCode)
{
    switch(eventCode)
    {
        [...]

        case kEventActorCreated:
        {
            if(0 == strcmp(DISK_NAME, Actor::getName(eventFirer)))
            {
                Actor::addEventListener(eventFirer, ListenerObject::safeCast(this), kEventActorDeleted);

                KeypadManager::disable();

                PongManager::sendMessageToSelf(this, kMessageStartGame, 100, 0);
            }

            return true;
        }
    }

    return Base::onEvent(this, eventFirer, eventCode);
}
```

The call to `KeypadManager::enableDummyKey` is necessary to force the engine calling `processUserInput` on the current [GameState](/documentation/api/class-game-state/) regardless of the input. Which is to prevent the other system to get stuck waiting for the other player to press any key. In addition, change `PongState::processUserInput` to not check for any key, since we are going to synchronize the relevant [Actors](/documentation/api/class-actor/) across systems in their handling of user inputs:

```cpp
void PongState::processUserInput(const UserInput* userInput __attribute__((unused)))
{
    PongState::propagateMessage(this, kMessageKeypadHoldDown);
}
```

## Mutating the AIPaddle

Since each player will control one paddle, there is no need for the `AIPaddle` instance. But since this class is a mutation class, we can simply mutate the underlying [Actor](/documentation/api/class-actor/) to make it an instance of either `PlayerPaddle` for the second player, who will cotrol the padde on the right side of the screen; or to make it an instance of a class that can sync itself with the remote player's paddle.

First, override the `onEvent` method in `AIPaddle.h`:

```cpp
mutation class AIPaddle : Actor
{
    [...]

    override bool handlePropagatedMessage(int32 message);

    [...]
}
```

In the implementation file, `AIPaddle.c`, we need to implement the logic to mutate the paddle depending on which number of player the system has been assigned. 

In the case that the system is player 1, the `AIPaddle`'s instance will be synched with the remote player's paddle. To do that, we are going to mutate it to a new class, `RemotePladdle`.
If this system is player 2, we can simply mutate the `AIPaddle` to `PlayerPaddle` since that class already handles the local player's inputs.

We need to reset the position of the paddle too.


```cpp
#include <Messages.h>
#include <PlayerPaddle.h>
#include <RemotePaddle.h>
[...]

bool AIPaddle::handlePropagatedMessage(int32 message)
{
    switch(message)
    {
        case kMessageVersusModePlayer1:
        {
            AIPaddle::mutateTo(this, RemotePaddle::getClass());
            AIPaddle::resetPosition(this);
            return false;
        }

        case kMessageVersusModePlayer2:
        {
            AIPaddle::mutateTo(this, PlayerPaddle::getClass());
            AIPaddle::resetPosition(this);
            return false;
        }
    }

    return false;
}

[...]

void AIPaddle::resetPosition()
{
    AIPaddle::stopMovement(this, __ALL_AXIS);
    Vector3D localPosition = this->localTransformation.position;
    localPosition.y = 0;
    AIPaddle::setLocalPosition(this, &localPosition);
}
```

## Mutating the PlayerPaddle

In the case that the local system is player 2, the paddle on the left side of the screen has to be in sync with the remote player's paddle. To do that, we mutate the current instance of `PlayerPaddle` to `RemotePaddle`:

```cpp
[...]

#include <RemotePaddle.h>

[...]

bool PlayerPaddle::handlePropagatedMessage(int32 message)
{
    switch(message)
    {
        case kMessageVersusModePlayer1:
        {
            PlayerPaddle::resetPosition(this);
            return false;
        }

        case kMessageVersusModePlayer2:
        {
            PlayerPaddle::mutateTo(this, RemotePaddle::getClass());
            PlayerPaddle::resetPosition(this);
            return false;
        }

        [...]

        case kMessageKeypadHoldDown:
        {
            [...]

            return false;
        }
    }

    [...]
}

[...]

void PlayerPaddle::resetPosition()
{
    PlayerPaddle::stopMovement(this, __ALL_AXIS);
    Vector3D localPosition = this->localTransformation.position;
    localPosition.y = 0;
    PlayerPaddle::setLocalPosition(this, &localPosition);
}
```

Do not forget to reset the paddle's position in both cases. And make sure that `handlePropagatedMessage` doesn't return `true` for message `kMessageKeypadHoldDown` in order to allow the message to propagate to other [Actors](/documentation/api/class-actor/), since we want to process it in the `RemotePaddle` class.


## RemotePaddle

Inside the folder _source_/_Actors_/_Paddle_, create a folder called _RemotePaddle_ and add `RemotePaddle.h` and `RemotePaddle.c` files with the following contents:

```cpp
#ifndef REMOTE_PADDLE_H_
#define REMOTE_PADDLE_H_

#include <Actor.h>

mutation class RemotePaddle : Actor
{
    override bool handlePropagatedMessage(int32 message);
}

#endif

```

The implementation of the `RemotePaddle` will handle all the communications with the remote Virtual Boy system.

Let's start by implementing the `handlePropagateMessage`, where we will intercept the `kMessageKeyHoldDown` message to send it to the other system:

```cpp
#include <KeypadManager.h>
#include <Messages.h>

#include "RemotePaddle.h"

[...]

mutation class RemotePaddle;

[...]

bool RemotePaddle::handlePropagatedMessage(int32 message)
{
    switch(message)
    {
        case kMessageKeypadHoldDown:
        {
            UserInput userInput = KeypadManager::getUserInput();

            RemotePaddle::transmitData(this, userInput.holdKey);

            return false;
        }
    }

    return false;
}
```

In `RemotePaddle::transmitData`, we check that communications are enabled and then proceed to send a message with the value returned by `RemotePaddle::getClass()`. We could use a message too, but we can take advantage of the uniqueness of return value of get `getClass` method. We use it to check if the received data was sent by the `RemotePaddle`'s instance from the other system:

```cpp
void RemotePaddle::transmitData(uint16 holdKey)
{
    CommunicationManager communicationManager = CommunicationManager::getInstance();

    if(CommunicationManager::isConnected(communicationManager))
    {
        if(
            CommunicationManager::sendAndReceiveData
            (
                communicationManager, (uint32)RemotePaddle::getClass(), (BYTE*)&holdKey, sizeof(holdKey)
            )
        )
        {
            if((uint32)RemotePaddle::getClass() == CommunicationManager::getReceivedMessage(communicationManager))
            {
                RemotePaddle::move(this, *(const uint16*)CommunicationManager::getReceivedData(communicationManager));
            }
        }
    }
}
```

Then, we simply apply a force to the `RemotePaddle` according to the input received from the other system:

```cpp
void RemotePaddle::move(uint16 holdKey)
{
    fixed_t forceMagnitude = 0;
    
    if(0 != (K_LU & holdKey))
    {
        forceMagnitude = -__FIXED_MULT(Body::getMass(this->body), Body::getMaximumSpeed(this->body));
    }
    else if(0 != (K_LD & holdKey))
    {
        forceMagnitude = __FIXED_MULT(Body::getMass(this->body), Body::getMaximumSpeed(this->body));
    }

    Vector3D force = {0, forceMagnitude, 0};

    RemotePaddle::applyForce(this, &force, true);
}
```

## Disk

We need to sychronize the `Disk` in both systems too. Otherwise, they will get out of sync pretty soon. There are various possible approaches. One could have been to centralize the sychronization of the systems in the `PongManager`, but since sending the data between paddles was very straight forward and required no new state variables, we are going to sync the `Disks` in a similar manner.

The first thing to notice, though, is that syncing the `Disks` at any other place than during the processing of the user input will hardly work due to the need to spin wait for the other system to catch up to the same point in the code. Thus, we are going to sychronize the `Disks` during the same sub-process.

First, override the `handlePropagatedMessage`. Remove the override of the `ready` method, since we are now going to start the `Disk`'s movement when it receives the `kMessageStartGame` message. And declare a new virtual method called `synchronizeWithRemote` as follows:

```cpp
mutation class Disk : Actor
{
    [...]

    override bool handlePropagatedMessage(int32 message);

    [...]

    override void update();

    virtual bool mustSychronize();
}
```

Then, in `Disk.c`, create `Disk::handlePropagatedMessage` as follows. First, we need to reset the `Disk`'s position when the messages about versus mode arrive, and then we must make it to start moving when the message `kMessageStartGame` arrives.

In particular, we are going to mutate the `mustSychronize` when the local system corresponds to player 1, so it doesn't override its position when synchronizing with the other system:

```cpp
bool Disk::handlePropagatedMessage(int32 message)
{
    switch(message)
    {
        case kMessageStartGame:
        {
            Disk::resetPosition(this);
            Disk::startMoving(this);
            return false;
        }

        case kMessageVersusModePlayer1:
        {
            Disk::mutateMethod(mustSychronize, Disk::dontSychronizeWithRemote);
            Disk::resetPosition(this);
            return false;
        }

        case kMessageVersusModePlayer2:
        {
            Disk::resetPosition(this);
            return false;
        }
    }

    return false;
}
```

Here is the implementation for `mustSychronize` and `mustNotSychronize`:

```cpp
bool Disk::mustSychronize()
{
    return true;
}

bool Disk::mustNotSychronize()
{
    return false;
}
```

We will implement synchronization of the `Disks` in `Disk::update`. In this case, we are going to send both the `Disk`'s position. But we are only going to synchronize the `Disk` corresponding to the system of player 2.

```cpp
void Disk::update()
{
    CommunicationManager communicationManager = CommunicationManager::getInstance();

    if(CommunicationManager::isConnected(communicationManager))
    {
        if
        (
            CommunicationManager::sendAndReceiveData
            (
                communicationManager, (uint32)Disk::getClass(), 
                (BYTE*)&this->transformation.position, sizeof(this->transformation.position)
            )
        )
        {
            if((uint32)Disk::getClass() == CommunicationManager::getReceivedMessage(communicationManager))
            {
                if(Disk::mustSychronize(this))
                {
                    Disk::stopMovement(this, __ALL_AXIS);

                    Disk::setPosition(this, (const Vector3D*)CommunicationManager::getReceivedData(communicationManager));
                }
            }
        }
    }
}
```

## Some caveats

Both systems must be connected before turning them on. For the connection to be recognized, both systems must reach the titel screen before continuing to the gameplay arena.

There are a few workarounds. A better approach would be to enable the communications as soon as the system boots. But since this demo uses the splash screens plugin, doing so would require implementing a custom adjustment screen, which is out of the scope of this tutorial, and we wanted to showcase the asynchronous nature of the `kEventCommunicationsConnected` event.

## That's all

Once compiled and run, when two Virtual Boys are connected and both enter the game, it will detect each other when entering the Pong arena and each player will be in control of a paddle at the opposite side of the screen.
