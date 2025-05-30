---
layout: documentation
parents: Documentation > User Guide
title: Post-Processing Effects
---

# Post-Processing Effects

The engine supports post-processing effects that allow the direct manipulation of the pixels drawn by the VIP before the current game frame is shown in the Virtual Boy’s displays. All registered post-processing effects are removed when the engine changes state. And it is possible to apply several post processes at once and thus combine their effects.

## Usage

Once the image frame has been fully processed and written to the current frame buffers at the moment post-processing kicks in, you are free to manipulate the image in any way you like. You can thus use post-processing to achieve visual effects which would not be possible by other means on the Virtual Boy.

To apply a post-processing effect, register it using the following call with a appropriate post processing function:

```cpp
VUEngine::pushBackPostProcessingEffect
(
    PostProcessingWobble::wobble,
    NULL
);
```

To remove a previously registered post-processing effect use the following code:

```cpp
VUEngine::removePostProcessingEffect
(
    PostProcessingWobble::wobble,
    NULL
);
```

A post processing effect function is one with a signature as the one shown below:

```cpp
/// Apply the post processing effect.
/// @param currentDrawingFrameBufferSet: The framebuffer set that's currently being accessed
/// @param entity: Post-processing effect function's scope
static void wobble(uint32 currentDrawingFrameBufferSet, Entity entity);
```

It is possible to pass an [Entity](/documentation/api/class-entity/) to the post processing effect so the processed region of the screen can be relative to that object.

<figure>
    <a href="/documentation/images/user-guide/post-processing-effects/wobble.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Example of a post-processing effect that adds a full-screen wobble">
        <img src="/documentation/images/user-guide/post-processing-effects/wobble.png" width="500"/>
    </a>
    <figcaption>
        Example of a post-processing effect that adds a full-screen wobble
    </figcaption>
</figure>

## Performance

Depending on the effect, some might not be feasible for use on real hardware, since reading back from the frame buffers is very slow. The problem is that, for each framebuffer access, the hardware has to wait a certain amount of CPU cycles: 1 to write and 3(!) for read access. Therefore, it is advised to use post-processing effects carefully and to manipulate only small areas of the screen. If possible, only write to, but not read from, the frame buffers.
