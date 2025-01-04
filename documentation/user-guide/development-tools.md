---
layout: documentation
title: Development Tools
---

# Development Tools

VUEngine provides a couple of tools that aim to help to understand how the hardware resources are being used at any moment to provide a guide on where to look to improve the game’s performance.
In order to make some of them available, the build target must be either “tools” or “debug”.
Each one is opened through the pressing of a key combination.

Debug Inspector
Key combination: Hold Select + Right Trigger and press Up on the right direction pad
It shows pages with information about WRAM usage, video memory usage (WORLDs, BGMAPs, OBJECTs and CHARs), Stage’ status, collisions information, hardware registers, SRAM space:








Animation Inspector
Key combination: Hold Select + Right Trigger and press Right on the right direction pad
It shows a preview of the animations available through SpriteSpecs listed in the global _userAnimatedActors:

It allows to modify on at runtime the frames and the duration of each:


Stage Inspector
Key combination: Hold Select + Right Trigger and press Left on the right direction pad
It allows to move around Actors in the current Stage or even add new ones through the ActorSpecs listed in the global _userObjects and to modify the Stage’s optical settings:



Sound Test
Key combination: Hold Select + Right Trigger and press Down on the right direction pad
It allows to play sounds through the SoundSpecs listed in the global _userSounds:


It allows to modify at runtime the timer settings to test how the sound tolerates changes to the timer interrupts’ frequency.
