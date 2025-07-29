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

To handle communications between two Virtual Boy systems, VUEngine provides the singleton [CommunicationManager](<(/documentation/api/class-communication-manager/)>). The first thing to do is to enable communications at the end of `PongManager::constructor`. 

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

    // Enable comms    
    CommunicationManager::enableCommunications(CommunicationManager::getInstance(), ListenerObject::safeCast(this));
}
```

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

The [CommunicationManager](<(/documentation/api/class-communication-manager/)>) will fire an event on the object provided as its scope once the handshake procedure with another system has succeeded.

In `PongManager::onEvent`, add the case to handle the `kEventCommunicationsConnected` message. We are going to send a delayed message, `kEventCommunicationsConnected`, to the `PongManager` itself to setup up the versus mode. This in necessary to be sure that the sequence that takes place in `PongManager::startVersusMode` happens at the right moment. This is not warranted during the call to `onEvent` due to it being asychronously called by the `CommunicationManager`:

```cpp
bool PongState::onEvent(ListenerObject eventFirer, uint16 eventCode)
{
    switch(eventCode)
    {
        case kEventCommunicationsConnected:
        {
            // Disable the gameplay for a few cycles
            KeypadManager::disable();

            // Delay the start of the versus mode
            PongManager::sendMessageToSelf(this, kMessageStartVersusMode, 250, 0);
            return false;
        }

        [...]
    }

    return Base::onEvent(this, eventFirer, eventCode);
}
```

Add the message `Start Versus Mode` to the **Messages** file inside the _config_ folder. 

Override the `handleMessage` method in `PongManager`:

```cpp
class PongManager : ListenerObject
{
    [...]

    override bool handleMessage(Telegram telegram);
}
```

And implement it as follows:

```cpp
bool PongManager::handleMessage(Telegram telegram)
{
    switch(Telegram::getMessage(telegram))
    {
        case kMessageStartVersusMode:
        {
            PongManager::startVersusMode(this);
            break;
        }
    }

    return true;
}
```

We are going to use the system's state during the intial handshake to decide which system corresponds to player 1:

```cpp
void PongManager::startVersusMode(bool isPlayerOne)
{
    // Reprint the score
    this->leftScore = 0;
    this->rightScore = 0;

    PongManager::printScore(this);

    // Reset random seed in multiplayer mode so both machines are completely in sync
    Math::resetRandomSeed();

    bool isPlayerOne = CommunicationManager::isMaster(CommunicationManager::getInstance());

    // Propagate the message about the versus mode player assigned to the local system
    Stage::propagateMessage(this->stage, Container::onPropagatedMessage, isPlayerOne ? kMessageVersusModePlayer1 : kMessageVersusModePlayer2);

    // Since we are using the method processUserInput to sync both system, 
    // we must make sure that it is called regardless of local input
    KeypadManager::enableDummyKey();
    KeypadManager::enable();
}
```

Add the messages `Versus Mode Player 1` and `Versus Mode Player 2` to the **Messages** file inside the _config_ folder. 

The call to `KeypadManager::enableDummyKey` is necessary to force the engine calling `processUserInput` on the current [GameState](/documentation/api/class-game-state/) regardless of the input. Which is to prevent the other system to get stuck waiting for the other player to press any key. In addition, change `PongState::processUserInput` to not check for any key, since we are going to synchronize the relevant [Actors](/documentation/api/class-actor/) across systems in their handling of user inputs:

```cpp
void PongState::processUserInput(const UserInput* userInput)
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

In `RemotePaddle::transmitData`, we check that communications are enabled and then proceed to send a message, `kMessageVersusModeSendInput` plus the local hold key to the remote system. The loop will force both systems to synchronize by waiting the other to reach the same transmission point. This is achieved by checking the received message:

```cpp
void RemotePaddle::transmitData(uint16 holdKey)
{
    if(!CommunicationManager::isConnected(CommunicationManager::getInstance()))
    {
        return;
    }

    uint32 receivedMessage = kMessageVersusModeDummy;
    uint16 receivedHoldKey = __KEY_NONE;

    /*
     * Data will be sent sychroniously. This means that if the cable is disconnected during
     * transmission, the behavior is undefined.
     */
    do
    {
        /*
         * Data transmission can fail if there was already a request to send data.
         */
        if(!CommunicationManager::sendAndReceiveData(CommunicationManager::getInstance(), kMessageVersusModeSendInput, &(BYTE*)holdKey, sizeof(holdKey)))
        {
            /*
             * In this case, simply cancel all communications and try again. This supposes
             * that there are no other calls that could cause a race condition.
             */
            CommunicationManager::cancelCommunications(CommunicationManager::getInstance());
        }

        /*
         * Every transmission sends a control message and then the data itself.
         */
        receivedMessage = CommunicationManager::getReceivedMessage(CommunicationManager::getInstance());
        receivedHoldKey = *(const uint16*)CommunicationManager::getReceivedData(CommunicationManager::getInstance());
    }
    /*
     * Keep sending the data until the received message matches the sent one
     */
    while(kMessageVersusModeSendInput != receivedMessage);
    
    RemotePaddle::move(this, receivedHoldKey);
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

First, override the `handlePropagatedMessage`:

```cpp
mutation class Disk : Actor
{
    [...]

    override bool handlePropagatedMessage(int32 message);

    [...]
}
```

Then, in `Disk.c`, create `Disk::handlePropagatedMessage` as follows. First, we need to reset the `Disk`'s position when the messages about versus mode arrive, and then we must make it to start moving.

And when the `kMessageKeypadHoldDown` message arrives, we are going to synchronize the `Disks`:

```cpp
bool Disk::handlePropagatedMessage(int32 message)
{
    switch(message)
    {
        case kMessageVersusModePlayer1:
        case kMessageVersusModePlayer2:
        {
            Disk::resetPosition(this);
            Disk::startMoving(this);
            return false;
        }

        case kMessageKeypadHoldDown:
        {
            Disk::sychronize(this);
            return false;
        }
    }

    return false;
}
```

The synchronization of the `Disks` follows a similar pattern to the paddles, but we are going to send different data. In this case, we are going to send both the `Disk`'s [Body](/documentation/api/class-body/)'s position and velocity. And we are going to override both in the two systems with the average between them.

It is possible to disable the [Body](/documentation/api/class-body/) in one of the `Disks`,  for example the player 2's, and syncing this one to the player 1's. 

```cpp
void Disk::sychronize()
{
    if(!CommunicationManager::isConnected(CommunicationManager::getInstance()))
    {
        return;
    }

    typedef struct RemoteDiskData
    {
        Vector3D position;
        Vector3D velocity;

    } RemoteDiskData;

    uint32 receivedMessage = kMessageVersusModeDummy;
    RemoteDiskData remoteDiskData = 
    {
        *Body::getPosition(this->body),
        *Body::getVelocity(this->body)
    };

    do
    {
        if(!CommunicationManager::sendAndReceiveData(CommunicationManager::getInstance(), kMessageVersusModeSendInput, (BYTE*)&remoteDiskData, sizeof(remoteDiskData)))
        {
            CommunicationManager::cancelCommunications(CommunicationManager::getInstance());
        }

        receivedMessage = CommunicationManager::getReceivedMessage(CommunicationManager::getInstance());
        remoteDiskData = *(const RemoteDiskData*)CommunicationManager::getReceivedData(CommunicationManager::getInstance());
    }
    while(kMessageVersusModeSendInput != receivedMessage);

    Vector3D averageBodyPosition = Vector3D::intermediate(*Body::getPosition(this->body), remoteDiskData.position);
    Vector3D averageBodyVelocity = Vector3D::intermediate(*Body::getVelocity(this->body), remoteDiskData.velocity);

    Body::setPosition(this->body, &averageBodyPosition, Entity::safeCast(this));
    Body::setVelocity(this->body, &averageBodyVelocity);
}
```

## Some fixes

You will notice that the game can get stuck if it is first played for a while in one of the systems and then entering versus mode. This is due to the implicit supposition that the paddles and the `Disk` occupy always the same relative positions to each other in the [Stage](/documentation/api/struct-stage-spec/)'s children list.

The more robust approach would be to centralize the synchronization of the game in the `PongManager`, but that would complicate the code quite a bit. Besides, that approach is already exemplified in the [VUEngine Showcase](https://github.com/VUEngine/VUEngine-Showcase) template project.

So, for an easy workaround, to make sure that the `Disk` is always loaded after the paddles in the [StageSpec](/documentation/api/struct-stage-spec/):

```cpp
PositionedActorROMSpec PongStageActors[] =
{    
    {&PlayerPaddleActorSpec,         {-180, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&AIPaddleActorSpec,             {180, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&WallActorSpec,                 {0, -120, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&WallActorSpec,                 {0, 120, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&LowPowerIndicatorActorSpec,     {-192 + 8, 112 - 4, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&DiskActorSpec,                 {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, DISK_NAME, NULL, NULL, false},

    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};
```

## That's all

Once compiled and run, when two Virtual Boys are connected and both enter the game, it will detect each other when entering the Pong arena and each player will be in control of a paddle at the opposite side of the screen.
