---
layout: documentation
title: Development Tools
---

# Development Tools

VUEngine provides a couple of tools that aim to help to understand how the hardware resources are being used at any moment to provide a guide on where to look to improve the game’s performance.

In order to make some of them available, the build target must be either “tools” or “debug”.
Each one is opened through the pressing of a key combination.

## Debug Inspector

Key combination: Hold Select + Right Trigger and press Up on the right direction pad

It shows pages with information about WRAM usage, video memory usage (WORLDs, BGMAPs, OBJECTs and CHARs), Stage’ status, collisions information, hardware registers, SRAM space:

<img src="/documentation/images/user-guide/development-tools/debug-wram-inspector.png" width="500" />
_WRAM Inspector_

<img src="/documentation/images/user-guide/development-tools/debug-sprite-inspector.png" width="500" />
_Sprite Inspector_

<img src="/documentation/images/user-guide/development-tools/debug-char-inspector.png" width="500" />
_CHAR Inspector_

<img src="/documentation/images/user-guide/development-tools/debug-sram-inspector.png" width="500" />
_SRAM Inspector_

## Animation Inspector

Key combination: Hold Select + Right Trigger and press Right on the right direction pad

It shows a preview of the animations available through SpriteSpecs listed in the global \_userAnimatedActors:

```cpp
const UserActor _userAnimatedActors[] =
{
    {&PunkActorSpec, "Punk"},
    {NULL, ""},
};
```

It allows to modify on at runtime the frames and the duration of each:

<img src="/documentation/images/user-guide/development-tools/debug-animation-inspector.png" width="500" />
*Animation Inspector*

## Stage Inspector

Key combination: Hold Select + Right Trigger and press Left on the right direction pad

It allows to move around Actors in the current Stage or even add new ones through the ActorSpecs listed in the global \_userObjects and to modify the Stage’s optical settings:

<img src="/documentation/images/user-guide/development-tools/debug-stage-editor.png" width="500" />
_Stage Editor_

## Sound Test

Key combination: Hold Select + Right Trigger and press Down on the right direction pad

It allows to play sounds through the SoundSpecs listed in the global \_userSounds:

It allows to modify at runtime the timer settings to test how the sound tolerates changes to the timer interrupts’ frequency.

<img src="/documentation/images/user-guide/development-tools/debug-sound-test.png" width="500" />
_Sound Test_
