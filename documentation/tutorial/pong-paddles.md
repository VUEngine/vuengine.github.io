---
layout: documentation
parents: Documentation > Tutorial
title: Pong Paddles
---

# Paddles

Lets make the paddles move by pressing the keypad. This can be done in various ways using [VUEngine](https://github.com/VUEngine/VUEngine-Core), like directly manipulating the paddles in the `PongState`, or creating instances of a `Paddle` class that inherits from [Actor](/documentation/api/class-actor/) instead of instantiating the base class, or even using plain [Sprites](/documentation/api/class-sprite/) and mainpulating their positions directly, but we are going to use a special kind of [Component](/documentation/api/class-component/) called [Mutators](/documentation/api/class-mutator/), which are possible thanks to [Virtual C](../../language/introduction)'s mutation feature. 


## Mutators

The [Mutator](/documentation/api/class-mutator/) class, which is a kind of [Component](/documentation/api/class-component/) that performs the [mutation](/documentation/language/custom-features/#mutation-classes) on [Actors](/documentation/api/class-actor/) without having to do it manually by means of directly calling `SomeClass::mutateTo(someClassObject, MutationClass::getClass())`. 

To add a [Mutator](/documentation/api/class-mutator/) to the paddles, lets open the *Paddle.actor* editor and add a [Mutator](/documentation/api/class-mutator/) component to it. These components have a single configuration value through which we can specify the mutation class that the component will apply to the instance of the [Actor](/documentation/api/class-actor/), which is created with the auto generated **PaddleActorSpec** (see *assets/Actors/Paddle/Converted/PaddleActorSpec.c*).

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
    void moveTowards(NormalizedDirection direction);
}
```

As you can see, it is very minimal, and we have declared a single method that takes a [NormalizedDirection](/documentation/api/struct-normalized-direction/) struct.

The implementation file shoudl contain the following:

```cpp
#include "Paddle.h"

mutation class Paddle;

void Paddle::moveTowards(NormalizedDirection direction)
{
}

```

With mutation classes, with don't need to define another **Spec** and worry about construction and destruction. They are useful as long as we don't need to persist any additional data to implement the logic of the class. They are not restricted to inherit from [Actor](/documentation/api/class-actor/), mutation classes can be created for any non abstract class in [VUEngine](https://github.com/VUEngine/VUEngine-Core).

## Processing the user input

We have a place to implement the logic for moving the paddles and we have a reference to them in the `PongManager`, so, we just need to process the user input. We already did it in the `TitleScreenState` so, lets override the `processUserInput` in the `PongState` to forward the user input up to the `Paddle`.

Lets add a member that will point to a `PongManager` instance and override the `processUserInput` method in the `PongState`. We need too to override the `enter` and `exit` methods to create and destroy the manager:

```cpp
[...]

#include <PongManager.h>

[...]

singleton class PongState : GameState
    {
    /// @protectedsection

    /// Manager for the pong game's logic
    PongManager pongManager;

    /// @publicsection

    /// Method to GameSaveDataManager the singleton instance
    /// @return AnimationSchemesState singleton
    static PongState getInstance();

    /// Prepares the object to enter this state.
    /// @param owner: Object that is entering in this state
    override void enter(void* owner);

    /// Prepares the object to exit this state.
    /// @param owner: Object that is exiting this state
    override void exit(void* owner);

    /// Process the provided user input.
    /// @param userInput: Struct with the current user input information
    override void processUserInput(const UserInput* userInput);
}
```

Now, instantiate the `PongManager`:

```cpp
[...]

void PongState::enter(void* owner __attribute__((unused)))
{
    [...]

    // Create the Pong game controller
    this->pongManager = new PongManager(this->stage);
}

[...]

void PongState::constructor()
{
    // Always explicitly call the base's constructor
    Base::constructor();

    this->pongManager = NULL;
}
```

And don't forget to destroy it:

```cpp
void PongState::exit(void* owner __attribute__((unused)))
{
    if(!isDeleted(this->pongManager))
    {
        delete this->pongManager;
    }	

    this->pongManager = NULL;

    [...]

    Base::exit(this, owner);
}
```

Finally, we can safely forward the user input to it:

```cpp
void PongState::processUserInput(const UserInput* userInput)
{
    if(!isDeleted(this->pongManager))
    {
        PongManager::processUserInput(this->pongManager, userInput);
    }
}

[...]
```

In `PongManager::processUserInput`, we will manipulate the data to prepare it to be used by the `Paddle`:

```cpp
class PongManager : ListenerObject
{
    [...]

    void processUserInput(const UserInput* userInput);
}
```

```cpp
void PongManager::processUserInput(const UserInput* userInput)
{
    if(0 != userInput->holdKey)
    {
        NormalizedDirection normalizedDirection = {0, 0, 0};

        if((K_LU | K_RU) & holdKey)
        {
            normalizedDirection.y = __UP;
        }
        else if((K_LD | K_RD) & holdKey)
        {
            normalizedDirection.y = __DOWN;
        }

        if(NULL != this->leftPaddle)
        {
            Paddle::moveTowards(this->leftPaddle, normalizedDirection);
        }

        if(NULL != this->rightPaddle)
        {
            Paddle::moveTowards(this->rightPaddle, normalizedDirection);
        }
    }
}
```

We are not done yet. `Paddle::moveTowards` is still empty. We have various options here, again: directly manipulate the `Paddle`'s transformation or use physic simulations to give the paddles some weight and inertia. Lets do the latter.

## Adding physic simulations

Another type of [Component](/documentation/api/class-component/) that can be easily added throught **ActorEditor** is the [Body](/documentation/api/class-body/), which allows to apply forces to an [Actor](/documentation/api/class-actor/) or set its velocity and it will take care of the computation of the movement. Input the following values:

<a href="/documentation/images/tutorial/paddle-body.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Paddle body"><img src="/documentation/images/tutorial/paddle-body.png" /></a>

Finally, we are able to move the paddles. In the iplementation of `Paddle::moveTowards`, add the following:

```cpp
#define VERTICAL_FORCE	 	__I_TO_FIX10_6(3)

[...]

void Paddle::moveTowards(NormalizedDirection direction)
{
    Vector3D force = 
    {
        0,
        __FIX10_6_MULT(VERTICAL_FORCE, __I_TO_FIX10_6(direction.y)),
        0
    };

    Paddle::applyForce(this, &force, true);
}
```

If everything went right, once the game is built and run, both paddles will move when the user presses UP or DOWN in the directional pads.