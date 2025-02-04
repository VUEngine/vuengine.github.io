---
layout: documentation
parents: Documentation > Tutorial
title: Pong Paddles
---

# Paddles

Lets make the paddles move by pressing the controller's direction pads. This can be done in various ways using [VUEngine](https://github.com/VUEngine/VUEngine-Core), like directly manipulating the paddles in the `PongState`, or creating instances of a `Paddle` class that inherits from [Actor](/documentation/api/class-actor/) instead of instantiating the base class, or even using plain [Sprites](/documentation/api/class-sprite/) and mainpulating their positions directly, but we are going to use a special kind of [Component](/documentation/api/class-component/) called [Mutators](/documentation/api/class-mutator/), which are possible thanks to [Virtual C](../../language/introduction)'s mutation feature. 

## Processing the user input

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

Now, we need to somehow catch the message with the paddle actors. Enter [Mutators](/documentation/api/class-mutator/).

## Mutation classes

With [mutation classes](/documentation/language/custom-features/#mutation-classes), we can add functionality to classes by means of abstract classes that don't allow instantiation, that is without having to go the full blown inheritance route. In the case of mutations of the [Actor](/documentation/api/class-actor/) class, they spare us the need to define another **Spec** and worry about implementing a constructor and destructor. They are useful as long as we don't need to persist any additional data to implement the logic of the class. They are not restricted to inherit from [Actor](/documentation/api/class-actor/), mutation classes can be created for any non abstract class in [VUEngine](https://github.com/VUEngine/VUEngine-Core). Lets see how to use them.

## Mutators

The [Mutator](/documentation/api/class-mutator/) class is a kind of [Component](/documentation/api/class-component/) that performs the [mutation](/documentation/language/custom-features/#mutation-classes) on [Actors](/documentation/api/class-actor/) without having to do it manually by means of directly calling `SomeClass::mutateTo(someClassObject, MutationClass::getClass())`. 

To add a [Mutator](/documentation/api/class-mutator/) to the paddles, open the *Paddle.actor* editor and add a [Mutator](/documentation/api/class-mutator/) component to it. These components have a single configuration value through which we can specify the mutation class that the component will apply to the instance of the [Actor](/documentation/api/class-actor/), which is created with the auto generated **PaddleActorSpec** (see *assets/Actors/Paddle/Converted/PaddleActorSpec.c*).

When a [Mutator](/documentation/api/class-mutator/) is attached to an [Actor](/documentation/api/class-actor/), it will convert the instance object into an instance of the mutation class, specified in the [Mutator](/documentation/api/class-mutator/)'s configuration.

Since we want this instance to behave like a Pong paddle, we will specify `Paddle` as the target mutation class of the [Mutator](/documentation/api/class-mutator/):

<a href="/documentation/images/tutorial/paddle-mutator.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Paddle mutator"><img src="/documentation/images/tutorial/paddle-mutator.png" /></a>

The editor will update **PaddleActorSpec** and render a **PaddleMutator1MutatorSpec** in `PaddleComponentSpecs`:

```cpp
MutatorROMSpec PaddleMutator1MutatorSpec =
{
    {
        // Allocator
        __TYPE(Mutator),

        // Component type
        kMutatorComponent
    },

    // Mutation target class
    class(Paddle),

    // Enabled
    true
};

ComponentSpec* const PaddleComponentSpecs[] = 
{
    (ComponentSpec*)&PaddleSprite1SpriteSpec,
    (ComponentSpec*)&PaddleMutator1MutatorSpec,
    NULL
};
```

Now, we have to create the `Paddle` class. Since it is a mutation target, it has to be a mutation class. 

To create the `Paddle` mutation class, lets create the folder *source/Actors/Paddle* and, in it, a header and an implementation file: *Paddle.h* and *Paddle.c*.

In *Paddle.h* lets add the following to declare the new class:

```cpp
#include <Actor.h>

mutation class Paddle : Actor
{
    /// Default interger message handler for propagateMessage
    /// @param message: Propagated integer message
    /// @return True if the propagation must stop; false if the propagation must reach other containers
    override bool handlePropagatedMessage(int32 message);
}
```

As you can see, it is very minimal, and we only had to override the [Container::handlePropagatedMessage](/documentation/api/class-container/) to process the message propagated by the `PongState`:

```cpp
[...]

bool Paddle::handlePropagatedMessage(int32 message)
{
    return false;
}
```

Notice that the method returns `false`. This allows the propagation to continue. Since there are two paddles, neither must stop the message.

`Paddle::handlePropagatedMessage` is still empty, we haven't really done anything with the input yet. We have various options here again: directly manipulate the `Paddle`'s transformation or use physic simulations to give the paddles some weight and inertia. Lets do the latter.

## Adding physic simulations

Another type of [Component](/documentation/api/class-component/) that can be easily added throught **ActorEditor** is the [Body](/documentation/api/class-body/), which allows to apply forces to an [Actor](/documentation/api/class-actor/) or set its velocity and it will take care of the computation of the movement. Input the following values:

<a href="/documentation/images/tutorial/paddle-body.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Paddle body"><img src="/documentation/images/tutorial/paddle-body.png" /></a>

Finally, we are able to move the paddles. In the iplementation of `Paddle::handlePropagatedMessage`, add the following:

```cpp
[...]

#include <KeypadManager.h>
#include <Messages.h>

[...]

bool Paddle::handlePropagatedMessage(int32 message)
{
    switch(message)
    {
        case kMessageKeypadHoldDown:
        {
            NormalizedDirection normalizedDirection = {0, 0, 0};

            UserInput userInput = KeypadManager::getUserInput();

            if(this->transformation.position.x < 0)
            {
                if(0 != (K_LU & userInput.holdKey))
                {
                    normalizedDirection.y = __UP;
                }
                else if(0 != (K_LD & userInput.holdKey))
                {
                    normalizedDirection.y = __DOWN;
                } 
            }
            else
            {
                if(0 != (K_RU & userInput.holdKey))
                {
                    normalizedDirection.y = __UP;
                }
                else if(0 != (K_RU & userInput.holdKey))
                {
                    normalizedDirection.y = __DOWN;
                } 
            }

            if(0 != normalizedDirection.y)
            {
                Paddle::moveTowards(this, normalizedDirection);
            }

            break;
        }
    }

    return false;
}

void Paddle::moveTowards(NormalizedDirection normalizedDirection)
{
    if(isDeleted(this->body))
    {
        return;
    }

    Vector3D force = 
    {
        0,
        __FIX10_6_MULT
        (
            __FIXED_MULT
            (
                Body::getMass(this->body), Body::getMaximumSpeed(this->body)
            ),
            __I_TO_FIX10_6(normalizedDirection.y)
        ),
        0
    };

    Paddle::applyForce(this, &force, true);
}
```

If everything went right, once the game is built and run, both paddles will move when the user presses UP or DOWN in the directional pads.
