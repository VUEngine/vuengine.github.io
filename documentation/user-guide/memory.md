---
layout: documentation
parents: Documentation > User Guide
title: Memory
---

# Memory

To be able to efficiently allocate memory for dynamically created objects, VUEngine makes use of a [MemoryPool](/documentation/api/class-memorypool/) construct rather than working with WRAM directly.

Basically, what the engine does is to divide the available WRAM into a number of configurable sized pools to fill in objects based on the number of bytes that they occupy plus 4 bytes used as a header.

To optimally suit the game’s needs, developers can and should configure memory pools in a number of ways:

- The total number of pools: there can be as many as needed
- The block size of each pool
- The number of objects that each pool can hold

Under the best possible scenario, that is, when the classes’ virtual tables are allocated in DRAM, the required memory by VUEngine to show an empty [Stage](/documentation/api/class-stage/) without any [Actors](/documentation/api/class-actor/) or preloaded [Textures](/documentation/api/class-texture/) is about 4 KB of the Virtual Boy’s 64 KB of WRAM.
A minimum of 2 KB are needed for the program’s stack. Therefore, the absolute maximum amount of WRAM that can be reserved for the [MemoryPool](/documentation/api/class-memorypool/) before overflowing the stack is about 62 KB. However, the more the game’s [Stages](/documentation/api/class-stage/) are populated, the more memory will be required by the stack and the lower the [MemoryPool](/documentation/api/class-memorypool/)’s maximum size.
It is strongly recommended to configure the [MemoryPool](/documentation/api/class-memorypool/) to suit the game’s specific needs as accurately as possible to not waste memory. During the development of any game, the need will arise to constantly refine the [MemoryPool](/documentation/api/class-memorypool/)’s configuration, to account for changes in the memory requirements of the game’s objects.

To check in realtime the 'MemoryPool's usage, use the following call in a suitable place:

```cpp
    MemoryPool::printDetailedUsage(1, 1);
```
