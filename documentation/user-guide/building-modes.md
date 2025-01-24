---
layout: documentation
parents: Documentation > User Guide
title: Configuration
---

# Building Modes

[VUEngine](https://github.com/VUEngine/VUEngine-Core) can target three different building modes:

- Debug
- Tools
- Beta
- Release

## Debug

In this mode, the produced ROM will contain all the safety checks that the engine implements with the aim to prevent undefined behavior caused by passing around invalid pointers.

The calls to `SomeClass::safeCast` will be internally converted into a call to `Object::getCast`, which will perform a RTTI check on the provided pointer to ensure that it is an instance of the intended class.

The same check will be performed at the start of each class method on the `this` pointer.

There is a heavy performance hit in this mode and the amount of calls to `Object::getCast` can easily overflow the stack if not careful. Because of this, the engine halves the configured target frame rate to mitigate that scenario from happening.

Debug mode enables the [Developer Tools](/documentation/user-guide/development-tools/).

## Tools

This mode removes some of the checks that debug mode enables, letting the games to run at the intended frame rate target, but enables access to the [Developer Tools](/documentation/user-guide/development-tools/).

## Beta

This is the recommended building mode for development and comes as the default in [VUEngine Studio](https://www.vuengine.dev/). It disables the [Developer Tools](/documentation/user-guide/development-tools/) and removes of the injected safety checks added by the transpiler in debug and tools modes, but leaves in the checks performend through the `NM_ASSERT` macro.

Although it still entails a significative performance hit that makes ROMs compiled in this mode generally too slow to be tested on hardware.

## Release

This is the mode intended to produce ROMs that should perform well on the Virtual Boy. To acomplish that, it removes almost all but the most critical safety checks that are only removed by defining the `__SHIPPING` macro through the `EngineConfig` editor.

It is strongly adviced to not use this mode through development, but only for testing on hardware.