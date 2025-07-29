---
layout: documentation
parents: Documentation > User Guide
title: Introduction
---

# Introduction

So, you want to create some awesome game or application for the Nintendo Virtual Boy, or you just want to display stereoscopic graphics or even only to play music or sound effects on it. If you have already downloaded [VUEngine Studio](https://www.vuengine.dev/) (VES for short) for any of that, it is most likely because you are not planning on writing assembly code, but C, and might already be wondering if [VUEngine](https://github.com/VUEngine/VUEngine-Core) is the right tool to use to achieve your goals.

VES can be used with other libraries, and [Team VUEngine](https://www.vuengine.dev/) even provides a ready to be used version of libgccvb, a basic set of functions that give access to the hardware features if you want to manage all the low level stuff yourself. With it, you will be controlling down to the hardware’s registers and the system's memory, most likely mixing data within the code that implements the logic of the game to do basic stuff like displaying some graphics, keeping track of mapping screen coordinates to video memory coordinates, among other things:

```cpp
copymem ((void*) CharSeg0, (void*)chPass, 512*16);
copymem ((void*) BGMap(0), (void*)bgPass, 512*16);
copymem ((void*) BGMap(1), (void*)bgPassbg, 512*16);

vbSetWorld(31, WRLD_ON, 0, 0, 0, 0, 0, 0, 384, 224); // Background
vbSetWorld(30, WRLD_ON, 384, 0, 0, 0, 0, 0, 384, 224); // Background
vbSetWorld(29, WRLD_ON, -1, 0, -1, 0, 0, 0, 0, 0); // blank
vbSetWorld(28, WRLD_ON, 40, -1, 0, 32, 0, 0, 335, 32); // Password
vbSetWorld(27, WRLD_ON, 44, -2, 88, 72, 0, 64, 32, 56); // Field Arrows
vbSetWorld(26, WRLD_ON, 84, -2, 96, 112, 0, 72, 152, 40); // [] [] [] []
vbSetWorld(25, WRLD_ON, 92, -2, 104, 16, 0, 200, 16, 24); // 1st number
vbSetWorld(24, WRLD_ON, 132, -2, 104, 16, 0, 200, 16, 24); // 2nd number
vbSetWorld(23, WRLD_ON, 172, -2, 104, 16, 0, 200, 16, 24); // 3rd number
vbSetWorld(22, WRLD_ON, 212, -2, 104, 16, 0, 200, 16, 24); // 4th number
vbSetWorld(21, WRLD_ON, -1, 0, -1, 0, 0, 0, 0, 0); // Invalid Password / Password Accepted
vbSetWorld(20, WRLD_ON, 40, -2, 200,  48, 0, 176, 224, 23); // +:Select A:Confirm B:Back
vbSetWorld(19, WRLD_ON, 0, -1, 0, 0, 0, 32, 32, 32); // Block 1
vbSetWorld(18, WRLD_ON, 0, -2, 32, 0, 0, 32, 32, 32); // Block 2
vbSetWorld(17, WRLD_ON, 0, -1, 64, 0, 0, 32, 32, 32); // Block 3
vbSetWorld(16, WRLD_ON, 0, -2, 96, 0, 0, 32, 32, 32); // Block 4
vbSetWorld(15, WRLD_ON, 0, -1, 128, 0, 0, 32, 32, 32); // Block 5
vbSetWorld(14, WRLD_ON, 0, -2, 160, 0, 0, 32, 32, 32); // Block 6
vbSetWorld(13, WRLD_ON, 0, -1, 192, 0, 0, 32, 32, 32); // Block 7
vbSetWorld(12, WRLD_ON, 40, -1, 48, 32, 0, 136, 192, 8); // Enter A Password:
vbSetWorld(11, WRLD_END, 0, 0, 0, 0, 0, 0, 0, 0); // Blank world and END bit set
```

If, on the other hand, your main concern is on creating content without mengling hardware management duties as part of it, [VUEngine](https://github.com/VUEngine/VUEngine-Core) can make development move much faster once you get familiar with the general design principles that it follows. It can do that by letting you handle the development from a higher level of abstraction and working with sprites, sound effects, game objects, etc., instead of dealing with streams of bytes that you have to figure out when and where to write to. By using [VUEngine](https://github.com/VUEngine/VUEngine-Core), instead of your program dealing with the allocation of hardware resources, it will declare structures that specify what game objects and components are to be created and how they are to be configured:

```cpp
PositionedActorROMSpec WireframesStageActorSpecs[] =
{
    {&HouseBigActorSpec,   {-192, -8,  896},  {0, 0, 0},  {1, 1, 1},  0,  NULL,  NULL,  NULL,  false},
    {&TunnelActorSpec,     {   0, 56, 1728},  {0, 0, 0},  {1, 1, 1},  0,  NULL,  NULL,  NULL,  false},
    {&HouseActorSpec,      { 192, -8,  896},  {0, 0, 0},  {1, 1, 1},  0,  NULL,  NULL,  NULL,  false},
    {&StreetActorSpec,     {   0, 56,  832},  {0, 0, 0},  {1, 1, 1},  0,  NULL,  NULL,  NULL,  false},
    {&HouseActorSpec,      {-192, -8,  640},  {0, 0, 0},  {1, 1, 1},  0,  NULL,  NULL,  NULL,  false},
    {&BusStopActorSpec,    { 192, -8,  640},  {0, 0, 0},  {1, 1, 1},  0,  NULL,  NULL,  NULL,  false},
    {&BillboardActorSpec,  {-160, -8,  450},  {0, 0, 0},  {1, 1, 1},  0,  NULL,  NULL,  NULL,  false},
    {&LampActorSpec,       { 192, -8,  512},  {0, 0, 0},  {1, 1, 1},  0,  NULL,  NULL,  NULL,  false},
    {&LampActorSpec,       { 192, -8, 1152},  {0, 0, 0},  {1, 1, 1},  0,  NULL,  NULL,  NULL,  false},
    {&CurveLeftActorSpec,  {   0, 56, 2112},  {0, 0, 0},  {1, 1, 1},  0,  NULL,  NULL,  NULL,  false},

    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};
```

Then it will have to pass their references to the engine, which will manage and keep track of how your objects are assigned and use the hardware resources:

```cpp
void ShowcaseState::enter(void* owner __attribute__ ((unused)))
{
    Base::enter(this, owner);

    if(NULL != this->stageSpec)
    {
        ShowcaseState::configureStage(this, this->stageSpec, NULL);
    }

    [...]
}
```

## Overview

[VUEngine](https://github.com/VUEngine/VUEngine-Core) is a high-level, object oriented game engine for the Nintendo Virtual Boy. It is written in [Virtual C](../../language/introduction), a custom C-dialect that resembles some of C++’ syntax that is converted by our custom transpiler to plain C with macros.

[VUEngine](https://github.com/VUEngine/VUEngine-Core) aims to facilitate the creation of games for the Virtual Boy without having to worry about nor master its underlying hardware unless you want to. Instead, it provides higher level abstractions that are relevant for general game development.

## Features

- General:

  - Object Oriented
  - Composite and composition architecture
  - Decoupling through message sending and propagation, and event firing
  - State machines
  - Separation of concers through _Spec_ recipes to instantiate
    game actors
  - Restricted singletons
  - Dinaymic memory allocation through custom memory pools
  - Runtime debugging tools
  - User data saving support
  - Assets preloading

- Stages:

  - 3D stages
  - Automatic streaming
  - Parenting

- Components:

  - Mutators
  - Physics
  - Colliders
  - Sprites
  - Wireframes

- Particles:

  - Physically capable
  - Recyclable

- Rendering:

  - CHAR memory management
  - BGAMP memory management
  - OBJECT memory management
  - WORLD memory management
  - Direct frame buffer manipulation
  - Affine/H-Bias effects
  - Transparency
  - Event driven frame based animation

- Physics:

  - Basic accelerated/uniform movement
  - Gravity
  - Friction
  - Bouncing
  - Collision detection and notification

- Sound:

  - Fully flexible VSU-native soundtrack format
  - PCM playback

- Development tools:
  - Debug
    - Memory usage
    - Profiling data
    - Streaming
    - Hardware registers' usage
    - VIP inspector:
      - CHAR memory
      - BGMAP memory
      - OBJECT memory
      - WORLD memory
    - Colliders
  - Stage editor
  - Animations inspector
  - Sound test
