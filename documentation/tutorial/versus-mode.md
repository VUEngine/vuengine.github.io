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

	/// Process an event that the instance is listen for.
	/// @param eventFirer: ListenerObject that signals the event
	/// @param eventCode: Code of the firing event
	/// @return False if the listener has to be removed; true to keep it
	override bool onEvent(ListenerObject eventFirer, uint16 eventCode);

    [...]
}
```

And in `PongState.c`, define the method to handle the `kEventCommunicationsConnected` message. We are going to propagete a message depending on whether the system is the master or remote in the initial handshake, which we will use to determine the side for each player:

```cpp
bool PongState::onEvent(ListenerObject eventFirer, uint16 eventCode)
{
	switch(eventCode)
	{
		case kEventCommunicationsConnected:
		{
			if(CommunicationManager::isMaster(CommunicationManager::getInstance()))
			{
				PongState::propagateMessage(this, kMessageVersusModePlayer1);
			}
			else
			{

				PongState::propagateMessage(this, kMessageVersusModePlayer2);
			}

            return false;
		}
	}

	return Base::onEvent(this, eventFirer, eventCode);
}
```

Add the messages `Versus Mode Player 1` and `Versus Mode Player 2` in the **Messages** file inside the _config_ folder. 


## Mutating the AIPaddle

Since each player will control one paddle, there is no need for the `AIPaddle` instance. But since this class is a mutation class, we can simply mutate the underlying [Actor](/documentation/api/class-actor/) to make it an instance of either `PlayerPaddle` for the second player, who will cotrol the padde on the right side of the screen; or to make it an instance of a class that can sync itself with the remote player's paddle.

First, override the `onEvent` method in `AIPaddle.h`:

```cpp
mutation class AIPaddle : Actor
{
    [...]

/// Default interger message handler for propagateMessage
	/// @param message: Propagated integer message
	/// @return True if the propagation must stop; false if the propagation must reach other containers
	override bool handlePropagatedMessage(int32 message);

    [...]
}
```

In the implementation file, `AIPaddle.c`, we need to implement the logic to mutate the paddle depending on which number of player the system has been assigned. 

In the case that the system is player 1, the `AIPaddle`'s instance will be synched with the remote player's paddle. To do that, we are going to mutate it to a new class, `RemotePladdle`.
If this system is player 2, we can simply mutate the `AIPaddle` to `PlayerPaddle` since that class already handles the local player's inputs.


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
			return false;
		}

		case kMessageVersusModePlayer2:
		{
			AIPaddle::mutateTo(this, PlayerPaddle::getClass());
			return false;
		}
	}

	return false;
}
```

## Mutating the PlayerPaddle

In the case that the local system is player 2, the paddle on the left side of the screen has to by in sync with the remote player's paddle. To do that, we mutate the current instance of `PlayerPaddle` to `RemotePaddle`:

```cpp
[...]

#include <RemotePaddle.h>

[...]

bool PlayerPaddle::handlePropagatedMessage(int32 message)
{
	switch(message)
	{
		case kMessageVersusModePlayer2:
		{
			PlayerPaddle::mutateTo(this, RemotePaddle::getClass());
			return false;
		}

        [...]
    }

    [...]
}
```

There is nothing to do here in the case that the message is `kMessageVersusModePlayer1`.

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

```cpp

#include "RemotePaddle.h"

mutation class RemotePaddle;


bool RemotePaddle::handlePropagatedMessage(int32 message)
{
	return false;
}

```

Once compiled and run, when two Virtual Boys are connected and both enter the game, will detect each other when entering the Pong arena and each player will be in control of a paddle at the opposite side of the screen, while the other paddle doesn't move.