---
layout: documentation
parents: Documentation > Tutorial
title: Pong Disk
---

# Disk

Now, lets make the disk to move. The process is the same as for the paddles: add a [Body](/documentation/api/class-body/) with the following values in the *Disk.actor* editor:

<a href="/documentation/images/tutorial/disk-body.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Disk body"><img src="/documentation/images/tutorial/disk-body.png" /></a>

And then add a [Mutator](/documentation/api/class-mutator/) with `Disk` as the mutation class:

<a href="/documentation/images/tutorial/disk-mutator.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Disk mutator"><img src="/documentation/images/tutorial/disk-mutator.png" /></a>


## Disk mutation class

We have to create the `Disk` class. Lets add the folder *source/Actors/Disk* and, in it, a header and an implementation file: *Disk.h* and *Disk.c*.

In *Paddle.h* lets add the following to declare the new class:

```cpp
#include <Actor.h>

mutation class Disk : Actor
{
    /// Make the animated actor ready to starts operating once it has been completely intialized.
    /// @param recursive: If true, the ready call is propagated to its children, grand children, etc.
    override void ready(bool recursive);
}
```

[Actors](/documentation/api/class-actor/) are not necessarily ready to be manipulated immediately after they are instantiated since whether or not the have, by that point in time, all their [Components](/documentation/api/class-component/) attached to them depends on whether the [Stage](/documentation/api/class-stage/) is configure to defer their initialization over time or not. [VUEngine](https://github.com/VUEngine/VUEngine-Core) supports deferred initialization in order to reduce the chances of hicups during gameplay due to the load on the CPU when creating [Actors](/documentation/api/class-actor/) with many [Components](/documentation/api/class-component/) attached to them.

So, the way in which the engine tells the game that an [Actor](/documentation/api/class-actor/) has been completely configured and can be manipulated is through the call to the [Container::ready](/documentation/api/class-container/) virtual method.

Therefore, to make the disk to move, we override thet `ready` method and implement the necessary logic there, making the direction of the movement random each time the disk is ready:

```cpp
void Disk::ready(bool recursive)
{
    static uint32 _randomSeed = 0;

    int16 angle = 0;

    if(0 == _randomSeed)
    {
        _randomSeed = 7;
    }

    _randomSeed ^= _randomSeed << 13;
    _randomSeed ^= _randomSeed >> 17;
    _randomSeed ^= _randomSeed << 5;

    angle = Math::random(Math::randomSeed() + _randomSeed, 64) - 32;

    Vector3D velocity = 
    {
        __FIXED_MULT(Body::getMaximumSpeed(this->body), __FIX7_9_TO_FIXED(__COS(angle))),
        __FIXED_MULT(Body::getMaximumSpeed(this->body), __FIX7_9_TO_FIXED(__SIN(angle))),
        0
    };

    if(50 > Math::random(Math::randomSeed() + _randomSeed, 100))
    {
        velocity.x = -velocity.x;
    }

    Disk::setVelocity(this, &velocity, false);
}
```

When building and running the game, not only the paddles will be movable, but the disk will start to move by itself.