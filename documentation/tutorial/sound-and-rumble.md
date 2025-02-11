---
layout: documentation
parents: Documentation > Tutorial
title: Sound and Rumble
---

# Sound and Rumble

Our game is almost done. We just want to round things off by adding some sound and rumble effects to make things more pleasing to the ears and hands.

## Sound Effects

Let's add a sound effect when the disk hits something and one when either side scores a point. Download the effects from [here](https://github.com/VUEngine/Pong/tree/main/assets/Sound/FX) and place them in _assets/Sound/FX_. Also download the header from [here](https://github.com/VUEngine/Pong/blob/main/headers/Sounds.h) and place it in the _headers/_ folder.

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

To play a sound effect when the disk hits a paddle or a wall, the code should be like the following:

```cpp
#include <SoundManager.h>
#include <Sounds.h>

#include "Disk.h"

[...]

bool Disk::collisionStarts(const CollisionInformation* collisionInformation)
{
    [...]

    switch(Entity::getInGameType(collidingEntity))
    {
        case kTypePaddle:
        {
            Vector3D velocity = *Body::getVelocity(this->body);

            fixed_t yDisplacement = this->transformation.position.y - Entity::getPosition(collidingEntity)->y;

            velocity.y += yDisplacement;

            Body::setVelocity(this->body, &velocity);
        }
        // Intended fall through

        case kTypeWall:
        {
            SoundManager::playSound(&BounceSoundSpec,  NULL, kSoundPlaybackNormal, NULL);
        }
        break;
    }
}
```

## Rumble Effects

Rumble effects are supported thanks to [RetroOnyx](https://www.retroonyx.com/product-page/virtual-boy-rumble-pack)'s RumblePak. To add these effects, create the _assets/RumbleEffect/Bounce_ and _assets/RumbleEffect/Point_ folders. And create a rumble effect file in each:

<a href="/documentation/images/tutorial/new-rumble-effect.png" data-toggle="lightbox" data-gallery="gallery" data-caption="New Rumble Effect"><img src="/documentation/images/tutorial/new-rumble-effect.png" /></a>

<a href="/documentation/images/tutorial/bounce-rumble-effect.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Bounce Rumble Effect"><img src="/documentation/images/tutorial/bounce-rumble-effect.png" /></a>

Then, to send the effect to the [Rumble Pak](https://www.retroonyx.com/product-page/virtual-boy-rumble-pack) when a point is scored, call [RumbleManager::startEffect](<(/documentation/api/class-rumble-manager/)>):

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

    switch(Entity::getInGameType(collidingEntity))
    {
        case kTypePaddle:
        [...]
        // Intended fall through

        case kTypeWall:
        {
            SoundManager::playSound(&BounceSoundSpec,  NULL, kSoundPlaybackNormal, NULL);
            RumbleManager::startEffect(&BounceRumbleEffectSpec);
        }
        break;
    }
}
```

## Et voilà!

And... we are done. Congratulations! If you followed through, you have just created your first Virtual Boy game with VUEngine Studio. 🥳

As your next steps, you might want to have a look at the [User Guide](/documentation/user-guide/introduction/) and perhaps dig into the code of the [VUEngine Showcase](https://github.com/VUEngine/VUEngine-Showcase) project to learn more about the engine's concepts and capabilities. Various sample states will expose you to key aspects of the engine step by step through cleanly written and properly commented code.
