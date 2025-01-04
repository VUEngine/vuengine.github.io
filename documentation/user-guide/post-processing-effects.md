---
layout: documentation
title: Post-Processing Effects
---

# Post-Processing Effects

The engine supports post-processing effects that allow the direct manipulation of the pixels drawn by the VIP before the current game frame is shown in the Virtual Boy’s displays. All registered post-processing effects are removed when the engine changes state. And it is possible to apply several post processes at once and thus combine their effects.

Since the image frame has been fully processed and written to the frame buffer at the moment post-processing kicks in, you are free to manipulate the image in any way you like. You can thus use post-processing to achieve visual effects which would not be possible by other means on the Virtual Boy.
To apply a post-processing effect register it using the following call with a appropriate post processing function:

```cpp
VUEngine::pushBackPostProcessingEffect(VUEngine::getInstance(), PostProcessingWobble::wobble, NULL);
```

To remove a previously registered post-processing effect use the following code:

```cpp
VUEngine::removePostProcessingEffect(VUEngine::getInstance(), PostProcessingWobble::wobble, NULL);
```

A post processing effect function is one with a signature exemplified as follows:

```cpp
    /// Apply the post processing effect.
    /// @param currentDrawingFrameBufferSet: The framebuffer set that's currently being accessed
    /// @param entity: Post-processing effect function's scope
    static void wobble(uint32 currentDrawingFrameBufferSet, Entity entity);
```

It is possible to pass a Entity to the post processing effect so the processed region of the screen can be relative to that object.
Depending on the effect, some might not be feasible for use on real hardware, since reading back from the framebuffers is very slow. The problem is that, for each framebuffer access, the hardware has to wait a certain amount of CPU cycles. 1 to write and 3(!) for read access. Therefore, it is advised to use post-processing effects carefully and try to manipulate only small areas of the screen. If possible, only write to, but not read from, the framebuffers.
