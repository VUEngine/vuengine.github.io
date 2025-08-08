---
layout: documentation
parents: Documentation > Tutorial
title: Paddles
---

# Paddles

There need to be two paddles that behave differently. One is controlled by the player while the other is controlled by the program itself. There is, again, great flexibility on how to achieve this using [VUEngine](https://github.com/VUEngine/VUEngine-Core). But we want a clean implementation that doesn't couple any class to another if it is not absolutely necessary. So, we are going to create two different mutation classes for the paddles: `PlayerPaddle` and `AIPaddle`.

## Player Paddle

Delete the previous _Paddle.actor_ file and replace it with a new one called _PlayerPaddle.actor_ under _assets/Actor/Paddle/PlayerPaddle/_. Then, attach and configure a [Sprite](/documentation/api/class-sprite/) as we already did before.

Now, add a [Mutator](/documentation/api/class-mutator/) to it and name its [mutation class](/documentation/language/custom-features/#mutation-classes) as `PlayerPaddle`:

<figure>
    <a href="/documentation/images/tutorial/paddle-mutator.png" data-toggle="lightbox" data-gallery="gallery" data-caption="A Mutator component in the actor editor">
        <img src="/documentation/images/tutorial/paddle-mutator.png" />
    </a>
    <figcaption>
        A Mutator component in the actor editor
        <span class="filepath">
            assets/Actor/Paddle/PlayerPaddle/PlayerPaddle.actor
        </span>
    </figcaption>
</figure>

Since we deleted the previous **PaddleActorSpec**, we need to update the **PongStageSpec**'s **PongStageActors** array:

```cpp
[...]

extern ActorSpec PlayerPaddleActorSpec;

[...]

PositionedActorROMSpec PongStageActors[] =
{
    {&DiskActorSpec,                {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&PlayerPaddleActorSpec,        {-180, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&PlayerPaddleActorSpec,        {180, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&LowPowerIndicatorActorSpec,   {-192 + 8, 112 - 4, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},

    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};
```

<div class="codecaption">
    <span class="filepath">
        assets/Stage/PongStageSpec.c
    </span>
</div>

Then, we have to create the `PlayerPaddle` mutation class. Let's create the folder _source/Actors/Paddle/PlayerPaddle_ and, in it, a header and an implementation file: _PlayerPaddle.h_ and _PlayerPaddle.c_.

In _PlayerPaddle.h_, add the following to declare the new class:

```cpp
#include <Actor.h>

mutation class PlayerPaddle : Actor
{
}
```

<div class="codecaption">
    <span class="filepath">
        source/Actors/Paddle/PlayerPaddle/PlayerPaddle.h
    </span>
</div>

Since it has to be controller by the player, it has to receive the keypad's inputs to modify its position.

### Processing the user input

The [Actors](/documentation/api/class-actor/) that belong to the [Stage](/documentation/api/class-stage/) can receive messages that propagate through all its children. This allows to decouple the `PongState` and the [Actors](/documentation/api/class-actor/) that need to react to the user input from each other.

First, we'll create the messages. To do that, right click the _config_ folder and create a new **Messages** file and add a message called "Keypad Hold Down" to it:

<figure>
    <a href="/documentation/images/tutorial/messages.png" data-toggle="lightbox" data-gallery="gallery" data-caption="The Messages editor">
        <img src="/documentation/images/tutorial/messages.png" />
    </a>
    <figcaption>
        The Messages editor
        <span class="filepath">
            config/Messages
        </span>
    </figcaption>
</figure>

In the `PongState`'s declaration, override the `processUserInput` method:

```cpp
singleton class PongState : GameState
{
    /// @publicsection

    /// Method to GameSaveDataManager the singleton instance
    /// @return AnimationSchemesState singleton
    static PongState getInstance();

    [...]

    /// Process the provided user input.
    /// @param userInput: Struct with the current user input information
    override void processUserInput(const UserInput* userInput);
}
```

<div class="codecaption">
    <span class="filepath">
        source/States/PongState/PongState.h
    </span>
</div>

And propagate the appropriate message according to the user input:

```cpp
#include <Messages.h>

[...]

void PongState::processUserInput(const UserInput* userInput)
{
    if(0 != userInput->holdKey)
    {
        PongState::propagateMessage(this, kMessageKeypadHoldDown);
    }
}
```

<div class="codecaption">
    <span class="filepath">
        source/States/PongState/PongState.c
    </span>
</div>

In the `PlayerPaddle` class, override the [Container::handlePropagatedMessage](/documentation/api/class-container/) to process the message propagated by the `PongState`:

```cpp
#include <Actor.h>

mutation class PlayerPaddle : Actor
{
    /// Default interger message handler for propagateMessage
    /// @param message: Propagated integer message
    /// @return True if the propagation must stop; false if the propagation must reach other containers
    override bool handlePropagatedMessage(int32 message);
}
```

<div class="codecaption">
    <span class="filepath">
        source/Actors/Paddle/PlayerPaddle/PlayerPaddle.h
    </span>
</div>

A minimal implementation of that method should look like this:

```cpp
[...]

bool PlayerPaddle::handlePropagatedMessage(int32 message)
{
    return false;
}
```

<div class="codecaption">
    <span class="filepath">
        source/Actors/Paddle/PlayerPaddle/PlayerPaddle.c
    </span>
</div>

`PlayerPaddle::handlePropagatedMessage` is still empty, we haven't really done anything with the input yet. There are various options here again on how to proceed: directly manipulate the `Paddle`'s transformation or use physic simulations to give the paddles some weight and inertia. Let's add a [Body](/documentation/api/class-body/) to the _PlayerPaddle.actor_ as we did for the _Disk.actor_:

<figure>
    <a href="/documentation/images/tutorial/paddle-body.png" data-toggle="lightbox" data-gallery="gallery" data-caption="A Body component in the actor editor">
        <img src="/documentation/images/tutorial/paddle-body.png" />
    </a>
    <figcaption>
        A Body component in the actor editor
        <span class="filepath">
            assets/Actor/Paddle/PlayerPaddle/PlayerPaddle.actor
        </span>
    </figcaption>
</figure>

Now, we are able to implement the logic to move the paddle. To do so, in the implementation of `PlayerPaddle::handlePropagatedMessage`, add the following:

```cpp
[...]

#include <KeypadManager.h>
#include <Messages.h>

[...]

bool PlayerPaddle::handlePropagatedMessage(int32 message)
{
    switch(message)
    {
        case kMessageKeypadHoldDown:
        {
            if(!isDeleted(this->body))
            {
                UserInput userInput = KeypadManager::getUserInput();

                fixed_t forceMagnitude = 0;

                if(0 != (K_LU & userInput.holdKey))
                {
                    forceMagnitude = -__FIXED_MULT(Body::getMass(this->body), Body::getMaximumSpeed(this->body));
                }
                else if(0 != (K_LD & userInput.holdKey))
                {
                    forceMagnitude = __FIXED_MULT(Body::getMass(this->body), Body::getMaximumSpeed(this->body));
                }

                Vector3D force = {0, forceMagnitude, 0};

                PlayerPaddle::applyForce(this, &force, true);
            }

            return true;
        }
    }

    return false;
}
```

<div class="codecaption">
    <span class="filepath">
        source/Actors/Paddle/PlayerPaddle/PlayerPaddle.c
    </span>
</div>

Notice that the method returns either `true` or `false`. If a `handlePropagatedMessage` implementation returns `true`, the propagation of the message is halted, preventing other [Actors](/documentation/api/class-actor/) from reacting to it. Since only one of the paddles must be controlled by the player, we halt the propagation of the `kMessageKeypadHoldDown` message, but allow other messages to continue to be propagated by returning `false`. So, only the first instance of `Paddle` will move.

Since we disabled the user input when changing the state in `TitleScreenState::processUserInput`, it is necessary to enable it again by calling `KeypadManager::enable` when the engine enters in the `PongState` :

```cpp
void PongState::enter(void* owner __attribute__((unused)))
{
	Base::enter(this, owner);

	// Load stage
	PongState::configureStage(this, (StageSpec*)&PongStageSpec, NULL);

	// Create the Pong game controller
	this->pongManager = new PongManager(this->stage);

	// Start clocks to start animations
	PongState::startClocks(this);

	// Enable user input
	KeypadManager::enable();
}
```

<div class="codecaption">
    <span class="filepath">
        source/States/PongState/PongState.c
    </span>
</div>

If everything went right, once the game is built and run, the first paddle will move when the user presses <span class="keys">UP</span> or <span class="keys">DOWN</span> on the left directional pad.

Since only one of the paddles reacts to the user input, we'll need some AI-control for the other.

## AI Paddle

Repeat the steps above to create an _AIPaddle.actor_ file in its respective folder, _assets/Actor/Paddle/AIPaddle/_. Then, attach and configure a [Sprite](/documentation/api/class-sprite/), a [Body](/documentation/api/class-body/) and a [Mutator](/documentation/api/class-mutator/) as we already did for the _PlayerPaddle.actor_, and create in a similar manner an `AIPaddle` mutation class.

Don't forget to update the **PongStageSpec**'s **PongStageActors** array:

```cpp
[...]

extern ActorSpec AIPaddleActorSpec;

[...]

PositionedActorROMSpec PongStageActors[] =
{
    {&DiskActorSpec,                {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&PlayerPaddleActorSpec,        {-180, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&AIPaddleActorSpec,            {180, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&LowPowerIndicatorActorSpec,   {-192 + 8, 112 - 4, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},

    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};
```

<div class="codecaption">
    <span class="filepath">
        assets/Stage/PongStageSpec.c
    </span>
</div>

Since this paddle doesn't react to the user inputs but to the `Disk`'s position, its logic will be a little bit different from that of the `PlayerPaddle`.

The [Container](/documentation/api/class-container/) class has an `update` method that is called on all the instances inside a [Stage](/documentation/api/class-stage/) every game cycle. So, override it to implement the AI's logic in it:

```cpp
#include <Actor.h>

[...]

mutation class AIPaddle : Actor
{
    /// Update this instance's logic.
    override void update();
}
```

<div class="codecaption">
    <span class="filepath">
        source/Actors/Paddle/AIPaddle/AIPaddle.h
    </span>
</div>

The implementation will be very simple: retrieve a reference to the `Disk` instance through the [Stage](/documentation/api/class-stage/) by calling `AIPaddle::getRelativeByName`, check the disk's position over the Y axis and apply a force to the `AIPaddle` to catch up with it:

```cpp
#include <string.h>

#include <Body.h>

#include "AIPaddle.h"

[...]

mutation class AIPaddle;

void AIPaddle::update()
{
    Actor disk = Actor::safeCast(AIPaddle::getRelativeByName(this, "Disk"));

    if(!isDeleted(disk))
    {
        fixed_t forceMagnitude = 0;

        fixed_t diskYPosition = Actor::getPosition(disk)->y;

        if(__PIXELS_TO_METERS(2) < __ABS(diskYPosition - this->transformation.position.y))
        {
            if(diskYPosition < this->transformation.position.y)
            {
                forceMagnitude = -__FIXED_MULT(Body::getMass(this->body), Body::getMaximumSpeed(this->body));
            }
            else
            {
                forceMagnitude = __FIXED_MULT(Body::getMass(this->body), Body::getMaximumSpeed(this->body));
            }

            Vector3D force = {0, forceMagnitude, 0};

            AIPaddle::applyForce(this, &force, true);
        }
    }
}
```

<div class="codecaption">
    <span class="filepath">
        source/Actors/Paddle/AIPaddle/AIPaddle.c
    </span>
</div>

Because the Disk [Actor](/documentation/api/class-actor/) has not been named yet, `AIPaddle::getRelativeByName` will find nothing. Let's head back to the _PongStageSpec.c_ file and assign a name to `DiskActorSpec` to change that.

```cpp
PositionedActorROMSpec PongStageActors[] =
{
    {&DiskActorSpec,                {0, 0, 0},    {0, 0, 0}, {1, 1, 1}, 0, "Disk", NULL, NULL, false},
    {&PlayerPaddleActorSpec,        {-180, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&AIPaddleActorSpec,            {180, 0, 0},  {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&LowPowerIndicatorActorSpec,   {-192 + 8, 112 - 4, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},

    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};
```

<div class="codecaption">
    <span class="filepath">
        assets/Stage/PongStageSpec.c
    </span>
</div>

When running the game, both paddles will now work as you'd expect.

Blimey! But you will notice that the paddles can not yet interact with the Disk. We will need to add some [Colliders](/documentation/tutorial/collisions/) <i class="fa fa-arrow-right"></i>.
