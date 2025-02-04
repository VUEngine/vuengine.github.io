---
layout: documentation
parents: Documentation > Tutorial
title: Pong Paddles
---

# Paddles

There need to be two paddles that behave differently: one is controller by the player while the other is controller by the program itself. There is, again, great flexibility on how to achieve this using [VUEngine](https://github.com/VUEngine/VUEngine-Core). But we want a clean implementation that doesn't couple any class to another if it is not absolutely necessary. So, we are going to create two different mutation classes for the paddles: `PlayerPaddle` and `AIPaddle`.

## Player Paddle

Delete the previous *Paddle.actor* file and create the folders and create a new one called *PlayerPaddle.actor* under *assets/Actors/Paddle/PlayerPaddle/*. Then, attach and configure a [Sprite](/documentation/api/class-sprite/) as we already did before.

Now, add a [Mutator](/documentation/api/class-mutator/) to it and call `PlayerPaddle` its [mutation class](/documentation/language/custom-features/#mutation-classes):

<a href="/documentation/images/tutorial/paddle-mutator.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Paddle mutator"><img src="/documentation/images/tutorial/paddle-mutator.png" /></a>

Since we deleted the previous **PaddleActorSpec**, we need to update the [StageSpec](/documentation/api/struct-stage-spec/) **PongStageSpec**'s **PongStageActors** array:

```cpp
[...]

extern ActorSpec PlayerPaddleActorSpec;

[...]

PositionedActorROMSpec PongStageActors[] =
{	
    {&DiskActorSpec,                {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, "Disk", NULL, NULL, false},
    {&PlayerPaddleActorSpec,        {-180, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&PlayerPaddleActorSpec,        {180, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&LowPowerIndicatorActorSpec,   {-192 + 8, 112 - 4, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},

    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};
```

Now, we have to create the `PlayerPaddle` class. Since it is a mutation target, it has to be a mutation class. 

To create the `PlayerPaddle` mutation class, lets create the folder *source/Actors/Paddle/PlayerPaddle* and, in it, a header and an implementation file: *PlayerPaddle.h* and *PlayerPaddle.c*.

In *PlayerPaddle.h* lets add the following to declare the new class:

```cpp
#include <Actor.h>

mutation class PlayerPaddle : Actor
{
}
```

Since it has to be controller by the player, it has to receive the keypad's inputs to modify its position.

### Processing the user input

The [Actors](/documentation/api/class-actor/) that belong to the [Stage](/documentation/api/class-stage/) can receive messages that propagate through all its children. This allows to decouple the `PongState` and from the [Actors](/documentation/api/class-actor/) that need to react to the user input.

First, lets create the messages. To do that, right click the *config* folder and create a new **Messages** file and add the following messages to it:

<a href="/documentation/images/tutorial/messages.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Paddle mutator"><img src="/documentation/images/tutorial/messages.png" /></a>


In the `PongState`'s declaration, override the `processUserInput` method:

```cpp
[...]

#include <PongManager.h>

[...]

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

And propagate the appropriate message according to the user input:

```cpp
void PongState::processUserInput(const UserInput* userInput)
{
    if(0 != userInput->holdKey)
    {
        PongState::propagateMessage(this, kMessageKeypadHoldDown);
    }
}
```

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

A minimal implementation of that method should look like this:

```cpp
[...]

bool PlayerPaddle::handlePropagatedMessage(int32 message)
{
    return false;
}
```

Notice that the method returns `false`. This allows the propagation to continue to other [Actors](/documentation/api/class-actor/).

`PlayerPaddle::handlePropagatedMessage` is still empty, we haven't really done anything with the input yet. We have various options here again: directly manipulate the `Paddle`'s transformation or use physic simulations to give the paddles some weight and inertia. Lets add a [Body](/documentation/api/class-body/) to the *PlayerPaddle.actor* as we did for the *Disk.actor*:

<a href="/documentation/images/tutorial/paddle-body.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Paddle body"><img src="/documentation/images/tutorial/paddle-body.png" /></a>


Finally, we are able to move the paddle. In the implementation of `PlayerPaddle::handlePropagatedMessage`, add the following:

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

Notice that the method returns either `true` or `false`. If a `handlePropagatedMessage` returns `true`, the propagation of the message is halted, preventing other [Actors](/documentation/api/class-actor/) reacting to it. Since only one of the paddles must be controlled by the player, the method halts the propagation of the `kMessageKeypadHoldDown` message, but allows other messages to continue to be propagated by returning `true`.

If everything went right, once the game is built and run, both paddles will move when the user presses UP or DOWN in the left directional pad.

But we don't want the player to control both paddles.

## AI Paddle

Repeat the steps above to create an *AIPaddle.actor* file in its respective folder, *assets/Actors/Paddle/AIPaddle/*. Then, attach and configure a [Sprite](/documentation/api/class-sprite/), a [Body](/documentation/api/class-body/) and a [Mutator](/documentation/api/class-mutator/) as we already did for the *PlayerPaddle.actor*, and create in a similar manner a `AIPaddle` mutation class.

Don't forget to update the [StageSpec](/documentation/api/struct-stage-spec/) **PongStageSpec**'s **PongStageActors** array:

```cpp
[...]

extern ActorSpec AIPaddleActorSpec;

[...]

PositionedActorROMSpec PongStageActors[] =
{	
    {&DiskActorSpec,                {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, "Disk", NULL, NULL, false},
    {&PlayerPaddleActorSpec,        {-180, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&AIPaddleActorSpec,            {180, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&WallActorSpec,                {0, -120, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&WallActorSpec,                {0, 120, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&LowPowerIndicatorActorSpec,   {-192 + 8, 112 - 4, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},

    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};
```

Since this paddle doesn't react to the user inputs but to the `Disk` instance, its logic will be a little bit different than that of the `PlayerPaddle`.

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

The implementation will be very simple. Retrieve a reference to the `Disk` instance through the whole [Stage](/documentation/api/class-stage/) by calling `AIPaddle::getRelativeByName`, and checking the disk's position over the Y axis and apply a force to the `AIPaddle` to catch up with it:

```cpp
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

When running the game, both paddles will work as they should.