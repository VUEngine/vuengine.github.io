---
layout: documentation
parents: Documentation > User Guide
title: Development Tools
---

# Development Tools

VUEngine provides a couple of tools that aim to help to understand how the hardware resources are being used at any moment to provide a guide on where to look to improve the game’s performance.

In order to make some of them available, the build target must be either “tools” or “debug”.
Each one is opened through the pressing of a key combination.

## Debug Inspector

Key combination: Hold Select + Right Trigger and press Up on the right direction pad

It shows pages with information about WRAM usage, video memory usage (WORLDs, BGMAPs, OBJECTs and CHARs), Stage’ status, collisions information, hardware registers, SRAM space:

<a href="/documentation/images/user-guide/development-tools/debug-wram-inspector.png" data-toggle="lightbox" data-gallery="gallery" data-caption="WRAM Inspector"><img src="/documentation/images/user-guide/development-tools/debug-wram-inspector.png" width="500" /></a><br/>
_WRAM Inspector_

<a href="/documentation/images/user-guide/development-tools/debug-sprite-inspector.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Sprite Inspector"><img src="/documentation/images/user-guide/development-tools/debug-sprite-inspector.png" width="500" /></a><br/>
_Sprite Inspector_

<a href="/documentation/images/user-guide/development-tools/debug-char-inspector.png" data-toggle="lightbox" data-gallery="gallery" data-caption="CHAR Inspector"><img src="/documentation/images/user-guide/development-tools/debug-char-inspector.png" width="500" /></a><br/>
_CHAR Inspector_

<a href="/documentation/images/user-guide/development-tools/debug-sram-inspector.png" data-toggle="lightbox" data-gallery="gallery" data-caption="SRAM Inspector"><img src="/documentation/images/user-guide/development-tools/debug-sram-inspector.png" width="500" /></a><br/>
_SRAM Inspector_

## Animation Inspector

Key combination: Hold Select + Right Trigger and press Right on the right direction pad

It shows a preview of the animations available through SpriteSpecs listed in the global \_userAnimatedActors:

```cpp
const UserActor _userAnimatedActors[] =
{
    {&ActorSpec, "Actor"},
    {NULL, ""},
};
```

It allows to modify on at runtime the frames and the duration of each:

<a href="/documentation/images/user-guide/development-tools/debug-animation-inspector.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Animation Inspector"><img src="/documentation/images/user-guide/development-tools/debug-animation-inspector.png" width="500" /></a><br/>
_Animation Inspector_

## Stage Inspector

Key combination: Hold Select + Right Trigger and press Left on the right direction pad

It allows to move around Actors in the current Stage or even add new ones through the ActorSpecs listed in the global \_userObjects and to modify the Stage’s optical settings:

<a href="/documentation/images/user-guide/development-tools/debug-stage-editor.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Stage Editor"><img src="/documentation/images/user-guide/development-tools/debug-stage-editor.png" width="500" /></a><br/>
_Stage Editor_

## Sound Test

Key combination: Hold Select + Right Trigger and press Down on the right direction pad

It allows to play sounds through the SoundSpecs listed in the global \_userSounds:

It allows to modify at runtime the timer settings to test how the sound tolerates changes to the timer interrupts’ frequency.

<a href="/documentation/images/user-guide/development-tools/debug-sound-test.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Sound Test"><img src="/documentation/images/user-guide/development-tools/debug-sound-test.png" width="500" /></a><br/>
_Sound Test_

## Profiler

A [Profiler](/documentation/api/class-profiler/) can be used to help to spot and solve performance bottlenecks by displaying the approximate time in milliseconds that each of the engine's subprocesses take to complete.

To enable the profiler, the `__ENABLE_PROFILER` macro must be defined in the game's _Config.h_ header file:

```cpp
#define __ENABLE_PROFILER
```

Then, call the following at the point where profiling must start:

```cpp
VUEngine::startProfiling();
```

Then, the profiler will show the following output:

<a href="/documentation/images/user-guide/development-tools/profiler.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Profiler's output"><img src="/documentation/images/user-guide/development-tools/profiler.png" width="500" /></a><br/>
_Profiler's output_
