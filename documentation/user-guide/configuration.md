---
layout: documentation
parents: Documentation > User Guide
title: Configuration
---

# Configuration

## Behavior configuration

[VUEngine](https://github.com/VUEngine/VUEngine-Core) uses a header file called _Config.h_ where different aspects of its behavior are defined.

The engine provides its own configuartion file, but each game should provide its own to override the engine’s default behavoir.

For a description of the configuration parameters check the default _Config.h_ file.

## Compilation options

The engine supports various options for its compilation. These options are provided by each game in a file called _config.make_.

Among those options are:

- Optimization option passed to the compiler

- Warning option flag passed to the compiler

- Control over the usage of the frame pointer in the output code

- Control over the usage of prolog functions in the output code

- Control over the usage of the program’s sections:

  - SRAM can be use as WRAM. It adds, theoretically, 16MB of WRAM where all non initialized variables can be allocated. This feature is experimental and only works properly on emulators. Since only 8KB of SRAM is available on real carts, more than that will only work on emulators.

  - DRAM can be used as WRAM too, you must edit the linker script vb.ld to accommodate this taking into account that the Param Table’s last address normally is 0x0003D800, where the WORLD attributes start.

  - Allocation section for some of the game’s global variables (data, sdata, bss, sbss, etc.)

To make effective any change to these options, the whole project needs to be fully recompiled.

## Game entry point

Each game has to provide as its main entry point a global function called `game`. By convention, this is provided in a file called **Game.c** in the game's source folder. The function has to return the instance of the `GameState` that the engine will enter as its first state:

```cpp
GameState game(void)
{
    // Initialize stuff
    [...]

    // Return the instance of the intial GameState
    return GameState::safeCast(InitialGameState::getInstance());
}
```
