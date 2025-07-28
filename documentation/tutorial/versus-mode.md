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

To handle communications between two Virtual Boy systems, VUEngine provides the singleton [CommunicationManager](<(/documentation/api/class-communication-manager/)>). The first thing to do is to enable communications at the end of `PongState::enter`:

```cpp
#include <CommunicationManager.h>

[...]

void PongState::enter(void* owner __attribute__((unused)))
{
    Base::enter(this, owner);

    [...]

    // Enable comms    
    CommunicationManager::enableCommunications(CommunicationManager::getInstance(), ListenerObject::safeCast(this));
}
```

The [CommunicationManager](<(/documentation/api/class-communication-manager/)>) will fire an event on the object provided as its scope once the handshake procedure with another system has succeeded.

Let's add the corresponding listener. First, override the `onEvent` method in the header file, `PongState.h`:

```cpp
singleton class PongState : GameState
{
    [...]

    override bool onEvent(ListenerObject eventFirer, uint16 eventCode);

    [...]
}
```

And in `PongState.c`, define the method to handle the `kEventCommunicationsConnected` message. We are going to call a new method, `PongManager::startVersusMode`, and send to it the master state of the system during the intial handshake to decide which system corresponds to player 1:

```cpp
bool PongState::onEvent(ListenerObject eventFirer, uint16 eventCode)
{
    switch(eventCode)
    {
        case kEventCommunicationsConnected:
        {
            if(!isDeleted(this->pongManager))
            {
                PongManager::startVersusMode(this->pongManager, CommunicationManager::isMaster(CommunicationManager::getInstance()));
            }

            return false;
        }
    }

return Base::onEvent(this, eventFirer, eventCode);
}
```

In the `PongManager` class' header file, declare the new method as follows and add member attribute to cache the [Stage](/documentation/api/struct-stage-spec/):

```cpp
class PongManager : ListenerObject
{
    /// @privatesection
    [...]

    //// Cache of the stage
    Stage stage;

    [...]

    /// Start versus mode.
    /// @param isPlayerOne: If true, this system is player one (left)
    void startVersusMode(bool isPlayerOne);
}
```

In the implementation file for the `PongManager`, cache [Stage](/documentation/api/struct-stage-spec/) passed to its constructor for later use. And create the `startVersusMode` method as follows:

```cpp
#include <KeypadManager.h>
#include <Messages.h>
[...]

void PongManager::constructor(Stage stage)
{
    // Always explicitly call the base's constructor
    Base::constructor();

    [...]

    this->stage = stage;
}

[...]

void PongManager::startVersusMode(bool isPlayerOne)
{
    // Reprint the score
    this->leftScore = 0;
    this->rightScore = 0;

    PongManager::printScore(this);

    // Reset random seed in multiplayer mode so both machines are completely in sync
    Math::resetRandomSeed();

    // Propagate the message about the versus mode player assigned to the local system
    Stage::propagateMessage(this->stage, Container::onPropagatedMessage, isPlayerOne ? kMessageVersusModePlayer1 : kMessageVersusModePlayer2);

    // Since we are using the method processUserInput to sync both system, 
    // we must make sure that it is called regardless of local input
    KeypadManager::enableDummyKey();
}
```

Add the messages `Versus Mode Player 1` and `Versus Mode Player 2` in the **Messages** file inside the _config_ folder. 

The call to `KeypadManager::enableDummyKey` is necessary to force the engine calling `processUserInput` on the current [GameState](/documentation/api/class-game-state/) regardless of the input. Which is necessary prevent the other system to get stuck waiting for the other player to press any key. To complete this, change `PongState::processUserInput` to check for the `dummyKey` instead:

```cpp
void PongState::processUserInput(const UserInput* userInput)
{
    if(0 != userInput->dummyKey)
    {
        PongState::propagateMessage(this, kMessageKeypadHoldDown);
    }
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

## Disk

We need to sychronize the `Disk` in both systems too. To do so, we will process the messages propagated by the `PongManager`.
Override the `handlePropagateMessage` in the `Disk.h`:

```cpp
mutation class Disk : Actor
{
    [...]

    override bool handlePropagatedMessage(int32 message);

    [...]
}
```

Then, in `Disk.c`, create `Disk::handlePropagatedMessage` as follows, as well as adding `Disk::resetPosition` and updating `Disk::ready` as shown below:

```cpp
bool Disk::handlePropagatedMessage(int32 message)
{
    switch(message)
    {
        case kMessageVersusModePlayer1:
        case kMessageVersusModePlayer2:
        {
            Disk::resetPosition(this);
            return false;
        }
    }

    return false;
}

[...]

void Disk::ready(bool recursive)
{
    Base::ready(this, recursive);

    Disk::resetPosition(this);
}

void Disk::resetPosition()
{
    Disk::stopMovement(this, __ALL_AXIS);
    Vector3D localPosition = this->localTransformation.position;
    localPosition.x = 0;
    localPosition.y = 0;
    Disk::setLocalPosition(this, &localPosition);

    int16 angle = Math::random(Math::randomSeed(), 64) - 32;

    Vector3D velocity = 
    {
        __FIXED_MULT(Body::getMaximumSpeed(this->body), __FIX7_9_TO_FIXED(__COS(angle))),
        __FIXED_MULT(Body::getMaximumSpeed(this->body), __FIX7_9_TO_FIXED(__SIN(angle))),
        0
    };

    if(50 > Math::random(Math::randomSeed(), 100))
    {
        velocity.x = -velocity.x;
    }

    Disk::setVelocity(this, &velocity, false);
}
```

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
            if(!isDeleted(this->body))
            {
                UserInput userInput = KeypadManager::getUserInput();

                RemotePaddle::syncWithRemote(this, &userInput);
            }

            return false;
        }
    }

    return false;
}
```

In `RemotePaddle::syncWithRemote`, we check that communications are enabled and then proceed to encapsulate the data to be sent to the other system. This data will be the key hold by the local player plus a constant value that will serve as a sort of CRC, we call it `command`:

```cpp
typedef struct RemotePlayerData
{
    uint32 command;

    // Hold key(s)
    uint16 holdKey;

} RemotePlayerData;

[...]

void RemotePaddle::syncWithRemote(const UserInput* userInput)
{
    /*
        * This call will sync both systems. The approach in this example is to get both
        * systems to follow the same code paths and only transmit the user input. So,
        * both are at the end of each frame in the same state. It is possible to run
        * the game in one and send the data to the other so this only shows it.
        */
    if(CommunicationManager::isConnected(CommunicationManager::getInstance()))
    {
        /*
        * A command is used to verify that the received message and the data
        * are valid.
        */
        uint8 command = RemotePaddle::getCommunicationCommand(this, kMessageVersusModeSendInput);

        /*
        * This is the struct that we are going to send down the link port.
        */
        RemotePlayerData remotePlayerData;

        remotePlayerData.command = command;
        remotePlayerData.holdKey = userInput->holdKey;

        RemotePaddle::transmitData(this, kMessageVersusModeSendInput, (BYTE*)&remotePlayerData, sizeof(remotePlayerData));
    }    
}
```

`RemotePaddle::transmitData` handles the data transmission. It uses `CommunicationManager::sendAndReceiveData` to send the data synchronously. It receives an enum to act as a message, or control parameter, and a stream of bytes. In this case, we will use the message `kMessageVersusModeSendInput`, that must be added to the **Messages** file inside the _config_ folder as `Versus Mode Send Input`.

We will keep sending the message until `RemotePaddle::isMessageValid` returns `true`. This method checks the `command` attribute of the `RemotePlayerData` struct:

```cpp
#include <CommunicationManager.h>

[...]

#define REMOTE_NO_COMMAND                     0x00
#define REMOTE_SEND_USER_INPUT                 0xAB

[...]

uint32 RemotePaddle::getCommunicationCommand(uint32 message)
{
    switch(message)
    {
        case kMessageVersusModeSendInput:

            return REMOTE_SEND_USER_INPUT;
    }

    return REMOTE_NO_COMMAND;
}

bool RemotePaddle::isMessageValid(uint32 message, uint8 command)
{
    return RemotePaddle::getCommunicationCommand(this, message) == command;
}

void RemotePaddle::transmitData(uint32 messageForRemote, BYTE* data, uint32 dataBytes)
{
    uint32 receivedMessage = kMessageVersusModeDummy;
    const RemotePlayerData* remotePlayerData = NULL;

    /*
     * Data will be sent sychroniously. This means that if the cable is disconnected during
     * transmission, the mutator is undefined.
     */
    do
    {
        /*
         * Data transmission can fail if there was already a request to send data.
         */
        if(!CommunicationManager::sendAndReceiveData(CommunicationManager::getInstance(), messageForRemote, data, dataBytes))
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
        remotePlayerData = (const RemotePlayerData*)CommunicationManager::getReceivedData(CommunicationManager::getInstance());
    }
    /*
     * The validity of the message is based on the command that was received
     */
    while(!RemotePaddle::isMessageValid(this, receivedMessage, remotePlayerData->command));

    RemotePaddle::processReceivedMessage(this, messageForRemote, receivedMessage, remotePlayerData);
}
```

Once the message is verified, the transmited data is processed in `RemotePaddle::processReceivedMessage`. Here, if the received message is `kMessageVersusModeSendInput`, the remote hold key is applied to move the paddle:

```cpp
#include <Body.h>

void RemotePaddle::processReceivedMessage(uint32 messageForRemote, uint32 receivedMessage, const RemotePlayerData* remotePlayerData)
{
    /*
     * When both systems send the same message, they are in sync. If the received
     * message differs from what I've sent, then update appropriately the message
     * that I will send in the next cycle.
     */
    switch(receivedMessage)
    {
        case kMessageVersusModeSendInput:

            if(kMessageVersusModeSendInput == messageForRemote)
            {
                fixed_t forceMagnitude = 0;
                
                if(0 != (K_LU & remotePlayerData->holdKey))
                {
                    forceMagnitude = -__FIXED_MULT(Body::getMass(this->body), Body::getMaximumSpeed(this->body));
                }
                else if(0 != (K_LD & remotePlayerData->holdKey))
                {
                    forceMagnitude = __FIXED_MULT(Body::getMass(this->body), Body::getMaximumSpeed(this->body));
                }

                Vector3D force = {0, forceMagnitude, 0};

                RemotePaddle::applyForce(this, &force, true);
            }

            break;
    }
}
```

Once compiled and run, when two Virtual Boys are connected and both enter the game, will detect each other when entering the Pong arena and each player will be in control of a paddle at the opposite side of the screen, while the other paddle doesn't move.
