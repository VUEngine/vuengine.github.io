---
layout: documentation
parents: Documentation > Tutorial
title: Pong Disk
---

# Disk

Lets make the disk to move. This can be done in various ways using [VUEngine](https://github.com/VUEngine/VUEngine-Core), like directly manipulating the disk in the `PongState`, or creating an instance of a `Disk` class that inherits from [Actor](/documentation/api/class-actor/) instead of instantiating the base class, or even using plain [Sprites](/documentation/api/class-sprite/) and mainpulating their positions directly, but we are going to use a special kind of [Component](/documentation/api/class-component/) called [Mutators](/documentation/api/class-mutator/), which are possible thanks to [Virtual C](../../language/introduction)'s mutation feature.

To make the disk to move we have various options: directly manipulate the its transformation or use physic simulations to give it some weight and inertia. Lets do the latter.

## Adding physic simulations

Another type of [Component](/documentation/api/class-component/) that can be easily added throught **ActorEditor** is the [Body](/documentation/api/class-body/), which allows to apply forces to an [Actor](/documentation/api/class-actor/) or set its velocity and it will take care of the computation of the movement. Input the following values:

<a href="/documentation/images/tutorial/disk-body.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Disk body"><img src="/documentation/images/tutorial/disk-body.png" /></a>

But to move a [Body](/documentation/api/class-body/), it is necessary to either set its velocity or to apply a force to it. Which means that we need to have access to the disk instance somehow to manipulate it. Enter [mutation classes](/documentation/language/custom-features/#mutation-classes).

## Mutation classes

With [mutation classes](/documentation/language/custom-features/#mutation-classes), we can add functionality to classes by means of abstract classes that don't allow instantiation, that is without having to go the full blown inheritance route. In the case of mutations of the [Actor](/documentation/api/class-actor/) class, they spare us the need to define another **Spec** and worry about implementing a constructor and destructor. They are useful as long as we don't need to persist any additional data to implement the logic of the class. They are not restricted to inherit from [Actor](/documentation/api/class-actor/), mutation classes can be created for any non abstract class in [VUEngine](https://github.com/VUEngine/VUEngine-Core). Lets see how to use them.

## Mutators

The [Mutator](/documentation/api/class-mutator/) class is a kind of [Component](/documentation/api/class-component/) that performs the [mutation](/documentation/language/custom-features/#mutation-classes) on [Actors](/documentation/api/class-actor/) without having to do it manually by means of directly calling `SomeClass::mutateTo(someClassObject, MutationClass::getClass())`.

To add a [Mutator](/documentation/api/class-mutator/) to the disk, open the _Disk.actor_ editor and add a [Mutator](/documentation/api/class-mutator/) component to it. These components have a single configuration value through which we can specify the mutation class that the component will apply to the instance of the [Actor](/documentation/api/class-actor/), which is created with the auto-generated **DiskActorSpec** (see _assets/Actors/Disk/Converted/DiskActorSpec.c_).

When a [Mutator](/documentation/api/class-mutator/) is attached to an [Actor](/documentation/api/class-actor/), it will convert the instance object into an instance of the mutation class, specified in the [Mutator](/documentation/api/class-mutator/)'s configuration.

Since we want this instance to behave like a Pong disk, we will specify `Disk` as the target mutation class of the [Mutator](/documentation/api/class-mutator/):

<a href="/documentation/images/tutorial/disk-mutator.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Disk mutator"><img src="/documentation/images/tutorial/disk-mutator.png" /></a>

The editor will update **DiskActorSpec** and render a **DiskMutator1MutatorSpec** in `DiskComponentSpecs`:

```cpp
MutatorROMSpec DiskMutator1MutatorSpec =
{
    {
        // Allocator
        __TYPE(Mutator),

        // Component type
        kMutatorComponent
    },

    // Mutation target class
    class(Disk),

    // Enabled
    true
};

ComponentSpec* const DiskComponentSpecs[] =
{
    (ComponentSpec*)&DiskSprite1SpriteSpec,
    (ComponentSpec*)&DiskMutator1MutatorSpec,
    NULL
};
```

Now, we have to create the `Disk` class. Since it is a mutation target, it has to be a mutation class.

To create the `Disk` mutation class, add the folder _source/Actors/Disk_ and, in it, a header and an implementation file: _Disk.h_ and _Disk.c_.

In _Disk.h_ lets add the following to declare the new class:

```cpp
#include <Actor.h>

[...]

mutation class Disk : Actor
{
}
```

[Actors](/documentation/api/class-actor/) are not necessarily ready to be manipulated immediately after they are instantiated since whether or not the have, by that point in time, all their [Components](/documentation/api/class-component/) attached to them depends on whether the [Stage](/documentation/api/class-stage/) is configured to defer their initialization over time or not. [VUEngine](https://github.com/VUEngine/VUEngine-Core) supports deferred initialization in order to reduce hiccups during gameplay due to the load on the CPU when creating [Actors](/documentation/api/class-actor/) with many [Components](/documentation/api/class-component/) attached to them.

So, the way in which the engine tells the game that an [Actor](/documentation/api/class-actor/) has been completely configured and can be manipulated is through the call to the [Container::ready](/documentation/api/class-container/) virtual method.

Therefore, to make the disk to move, we override the `ready` method and implement the necessary logic there, making the direction of the movement random each time the disk is ready:

```cpp
#include <Actor.h>

[...]

mutation class Disk : Actor
{
    /// Make the animated actor ready to starts operating once it has been completely intialized.
    /// @param recursive: If true, the ready call is propagated to its children, grand children, etc.
    override void ready(bool recursive);
}
```

Finally, in the implementation of the method, set the velocity of the `Disk` instance as shown below:

```cpp
void Disk::ready(bool recursive)
{
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

When building and running the game, the disk will start to move by itself.
