---
layout: documentation
title: Introduction
---

# Introduction

VUEngine Studio is build around VUEngine, a versatile, object oriented Nintendo Virtual Boy game engine.

VUEngine is an attempt to provide other indie developers the base functionality to facilitate the creation of content for the Nintendo Virtual Boy by taking care of most hardware management tasks to create 3D games with 2D graphics.

## Features

- General features:
  - Automatic frame rate control
  - Generic clocks based on hardware interrupts
  - Memory Pool to allocate memory dynamically
  - Generic state machines
  - Generic parenting system
  - Generic messaging system
  - Generic event listening/firing system
  - Easy to use printing functions to facilitate debug
  - User data saving support
  - Program's memory layout management
    - Use DRAM as WRAM
    - Use SRAM as WRAM
    - Variables' in-program-section allocation control
- Object Oriented support through the use of Metaprogramming (C MACROS):
  - Simple inheritance
  - Polymorphism
  - Encapsulation
  - Friend classes support
  - Runtime type checking
- Rendering:
  - Automatic CHAR memory allocation
  - Real time CHAR memory defragmentation
  - Automatic BGMAP memory allocation
  - Automatic OBJECT memory allocation
  - Automatic WORLD layer assignment based on the objects' z position
  - Texture preloading & recycling
  - Scaling/rotation effects
  - Transparency
  - Automatic projection/parallax/scale calculations and rendering
  - Customizable perspective/deep effects in real time
  - Automatic memory allocation for param tables (used in affine and h-bias modes)
- Animation:
  - Multiple memory allocation schemas to improve efficiency
  - Frame based animation system with callback support
- Sound:
  - Sound reproduction of one BGM and up to two FX sounds simultaneous.
- Physics:
  - Basic accelerated/uniform movement
  - Gravity
  - Friction
  - Bouncing
  - Automatic collision detection and notification
- Particles:
  - Physically based particles
  - Recyclable particles
- Stages:
  - 3D stages
  - Level streaming
- Debugging / Development:
  - Memory usage
  - Profiling data
  - Streaming status
  - Hardware registers' usage
  - Real time tools to check:
    - CHAR memory status
    - BGMAP memory status
    - WORLD layer status
  - Collision boxes
  - Real time stage editor
  - Real time animation inspector
- Useful classes to speed up the content creation process:
  - Container: for transformation propagation (translation/rotation/scaling)
  - Entity: a container with a list of sprites (a "visual object")
  - AnimatedEntity: an entity with animated sprites
  - Actor: animated entity that has a physical body and can resolve collisions
