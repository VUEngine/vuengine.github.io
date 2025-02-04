---
layout: documentation
parents: Documentation > Tutorial
title: Sound and Rumble
---

# Sound Effects

Lets add a sound effect when the disk hits something and one when either side scores a point. Download the effects from [here](https://github.com/VUEngine/Pong/tree/main/assets/Sounds/FX) and place them in *assets/Sounds/FX*. And download the header here from [here](https://github.com/VUEngine/Pong/blob/main/headers/Sounds.h) and place it in the *headers/* folder.

To play the sound effect when a point is scored, add the following to the `PongManager::onEvent` method:

```cpp
#include <SoundManager.h>
#include <Sounds.h>

[...]

bool PongManager::onEvent(ListenerObject eventFirer __attribute__((unused)), uint16 eventCode)
{
    switch(eventCode)
    {
        [...]

        case kEventActorDeleted:
        {
            if(0 == strcmp("Disk", Actor::getName(eventFirer)))
            {
                SoundManager::playSound(&PointSoundSpec,  NULL, kSoundPlaybackNormal, NULL);

    [...]
}
```

To play a sound effect when the disk hits a paddle or a wall, the `Disk` class has to override the [Entity::collisionStarts](/documentation/api/class-entity/):

```cpp
mutation class Disk : Actor
{
    /// Process a newly detected collision by one of the component colliders.
    /// @param collisionInformation: Information struct about the collision to resolve
    /// @return True if the collider must keep track of the collision to detect if it persists and when it
    /// ends; false otherwise
    override bool collisionStarts(const CollisionInformation* collisionInformation);

    [...]
}
```

And the implementation should be like the following:

```cpp
#include <SoundManager.h>
#include <Sounds.h>

#include "Disk.h"

[...]

bool Disk::collisionStarts(const CollisionInformation* collisionInformation)
{
    Entity collidingEntity = Collider::getOwner(collisionInformation->otherCollider);

    switch(Entity::getInGameType(collidingEntity))
    {
        case kTypePaddle:
        case kTypeWall:
        {
            SoundManager::playSound(&BounceSoundSpec,  NULL, kSoundPlaybackNormal, NULL);
        }
        break;
    }

    return Base::collisionStarts(this, collisionInformation);
}
```

# Rumble Effects

Rumble effects are supported thanks to [RetroOnyx](https://www.retroonyx.com/product-page/virtual-boy-rumble-pack)'s RumblePak. To add the these effects, create the *assets/Rumble/Bounce* and *assets/Rumble/Point* folders. And create a rumble effect file in each:

<a href="/documentation/images/tutorial/new-rumble-effect.png" data-toggle="lightbox" data-gallery="gallery" data-caption="New Rumble Effect"><img src="/documentation/images/tutorial/new-rumble-effect.png" /></a>

<a href="/documentation/images/tutorial/bounce-rumble-effect.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Bounce Rumble Effect"><img src="/documentation/images/tutorial/bounce-rumble-effect.png" /></a>

Then, to send the effect to the [Rumble Pak](https://www.retroonyx.com/product-page/virtual-boy-rumble-pack) when a point is scored, call [RumbleManager::startEffect]((/documentation/api/class-rumble-manager/)):

```cpp
#include <RumbleEffects.h>
#include <RumbleManager.h>

[...]

bool PongManager::onEvent(ListenerObject eventFirer __attribute__((unused)), uint16 eventCode)
{
    switch(eventCode)
    {
        [...]

        case kEventActorDeleted:
        {
            if(0 == strcmp("Disk", Actor::getName(eventFirer)))
            {
                SoundManager::playSound(&PointSoundSpec,  NULL, kSoundPlaybackNormal, NULL);
                RumbleManager::startEffect(&PointRumbleEffectSpec);

    [...]
}
```

And to start a the rumble effect when the disk detects a collision:

```cpp
[...]

#include <RumbleEffects.h>
#include <RumbleManager.h>

[...]

bool Disk::collisionStarts(const CollisionInformation* collisionInformation)
{
    [...]

    Entity collidingEntity = Collider::getOwner(collisionInformation->otherCollider);

    switch(Entity::getInGameType(collidingEntity))
    {
        case kTypePaddle:
        case kTypeWall:
        {
            SoundManager::playSound(&BounceSoundSpec,  NULL, kSoundPlaybackNormal, NULL);
            RumbleManager::startEffect(&BounceRumbleEffectSpec);
        }
        break;

    [...]
}
```