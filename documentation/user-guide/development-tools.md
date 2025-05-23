---
layout: documentation
parents: Documentation > User Guide
title: Development Tools
---

# Development Tools

[VUEngine](https://github.com/VUEngine/VUEngine-Core) provides a couple of tools that aim to help to understand how the hardware resources are being used at any moment, to provide a lead on where to look to improve the game’s performance.

In order to make some of them available, the build target must be either “tools” or “debug”.
Each one is opened by pressing a key combination.

## Debug Inspector

_Key combination_: Hold <span class="keys">Select + Right Trigger</span> and press <span class="keys">Up</span> on the right D-Pad.

The Debug Inspector shows pages with information about WRAM usage, video memory usage (WORLDs, BGMAPs, OBJECTs and CHARs), the [Stage](/documentation/api/class-stage/)’s status, collisions information, hardware registers, SRAM space, etc.

Cycle through the different modes with the <span class="keys">Left D-Pad</span>.

<figure>
    <a href="/documentation/images/user-guide/development-tools/debug-wram-inspector.png" data-toggle="lightbox" data-gallery="gallery" data-caption="WRAM Inspector">
        <img src="/documentation/images/user-guide/development-tools/debug-wram-inspector.png" width="500" />
    </a>
    <figcaption>
    WRAM Inspector
</figcaption>
</figure>

<figure>
    <a href="/documentation/images/user-guide/development-tools/debug-sprite-inspector.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Sprites Inspector">
        <img src="/documentation/images/user-guide/development-tools/debug-sprite-inspector.png" width="500" />
    </a>
    <figcaption>
    Sprites Inspector
</figcaption>
</figure>

<figure>
    <a href="/documentation/images/user-guide/development-tools/debug-char-inspector.png" data-toggle="lightbox" data-gallery="gallery" data-caption="CHAR Memory Inspector">
        <img src="/documentation/images/user-guide/development-tools/debug-char-inspector.png" width="500" />
    </a>
    <figcaption>
    CHAR Memory Inspector
</figcaption>
</figure>

<figure>
    <a href="/documentation/images/user-guide/development-tools/debug-sram-inspector.png" data-toggle="lightbox" data-gallery="gallery" data-caption="SRAM Inspector">
        <img src="/documentation/images/user-guide/development-tools/debug-sram-inspector.png" width="500" />
    </a>
    <figcaption>
    SRAM Inspector
</figcaption>
</figure>

## Animation Inspector

_Key combination_: Hold <span class="keys">Select + Right Trigger</span> and press <span class="keys">Right</span> on the right D-Pad.

The Animation Inspector shows a preview of the animations available through [SpriteSpec](/documentation/api/struct-sprite-spec/) listed in the global `_userAnimatedActors`:

```cpp
const UserActor _userAnimatedActors[] =
{
    {&ActorSpec, "Actor"},
    {NULL, ""},
};
```

It allows to modify at runtime the frames of animation and the duration of each:

<figure>
    <a href="/documentation/images/user-guide/development-tools/debug-animation-inspector.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Animation Inspector">
        <img src="/documentation/images/user-guide/development-tools/debug-animation-inspector.png" width="500"
        /></a>
        <figcaption>
    Animation Inspector
</figcaption>
</figure>

## Stage Inspector

_Key combination_: Hold <span class="keys">Select + Right Trigger</span> and press <span class="keys">Left</span> on the right D-Pad.

The Stage Inspector allows to modify the [Stage](/documentation/api/class-stage/)’s optical settings, or to move around [Actors](/documentation/api/class-actor/) in the current [Stage](/documentation/api/class-stage/) and even to add new ones through the [ActorSpecs](/documentation/api/struct-actor-spec/) listed in the global `_userObjects`.

Cycle through the different modes with the <span class="keys">Select</span> button.

<figure>
    <a href="/documentation/images/user-guide/development-tools/debug-stage-editor.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Stage Editor">
        <img src="/documentation/images/user-guide/development-tools/debug-stage-editor.png" width="500" />
    </a>
    <figcaption>
    Stage Editor
</figcaption>
</figure>

## Sound Test

_Key combination_: Hold <span class="keys">Select + Right Trigger</span> and press <span class="keys">Down</span> on the right D-Pad.

The Sound Test allows to play sounds through the [SoundSpecs](/documentation/api/struct-sound-spec/) listed in the global `_userSounds` and to modify at runtime the timer settings to test how the sound tolerates changes to the timer interrupt's frequency.

<figure>
    <a href="/documentation/images/user-guide/development-tools/debug-sound-test.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Sound Test">
        <img src="/documentation/images/user-guide/development-tools/debug-sound-test.png" width="500" /></a>
    <figcaption>
    Sound Test
</figcaption>
</figure>

## Profiler

The [Profiler](/documentation/api/class-profiler/) can be used to help spot and solve performance bottlenecks by displaying the approximate time in milliseconds that each of the engine's subprocesses take to complete.

To enable the profiler, the `__ENABLE_PROFILER` macro must be defined in the game's _Config.h_ header file:

```cpp
#define __ENABLE_PROFILER
```

Then, call the following at the point where profiling must start:

```cpp
VUEngine::startProfiling();
```

Then, the profiler will show the following output:

<figure>
    <a href="/documentation/images/user-guide/development-tools/profiler.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Profiler's output">
        <img src="/documentation/images/user-guide/development-tools/profiler.png" width="500" />
    </a>
    <figcaption>
        Profiler's output
    </figcaption>
</figure>
