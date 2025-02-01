---
layout: documentation
parents: Documentation > Tutorial
title: Stage
---

# Stage

At this moment, the `PongState` initializes its [Stage](/documentation/api/class-stage/) with the **MyGameStageSpec**. It is defined in the file *assets/Stages/MyGameStageSpec.c*. We will rename both to **PongStageSpec** and *assets/Stages/PongStageSpec.c* respectively.

## StageSpec

The [Stages](/documentation/api/class-stage/) are created by passing a [StageSpec](/documentation/api/struct-stage-spec/) pointer to [GameState::configureStage](/documentation/api/class-game-state/). A [StageSpec](/documentation/api/struct-stage-spec/) holds all the configuration details to instatiante a [Stage](/documentation/api/class-stage/) and populate it with 
game [Actors](/documentation/api/class-actor/).

Almost at the end of it, two arrays are referenced, `PongStageUiActors` and `PongStageActors`. These have entries that reference the **ActorSpecs** to use to instantiate and initialize the [Actors](/documentation/api/class-actor/) that will populate the [Stage](/documentation/api/class-stage/):

```cpp
StageROMSpec PongStageSpec =
{
    // Class allocator
    __TYPE(Stage),

    [...]

    // Actors
    {
        // UI configuration
        {
            (PositionedActor*)PongStageUiActors,
            __TYPE(UIContainer),
        },

        // Stage's children actors
        (PositionedActor*)PongStageActors,
    },

    // Post processing effects
    (PostProcessingEffect*)NULL,
};
```

Those arrays are very simple right now:

```cpp
PositionedActorROMSpec PongStageActors[] =
{
    {&LowPowerIndicatorActorSpec, {0, 12, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},

    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};

PositionedActorROMSpec PongStageUiActors[] =
{
    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};
```

When [PongState::configureStage](/documentation/api/class-game-state/) is called with **PongStageSpec** as one of its arguments, an [Actor](/documentation/api/class-actor/) will be created with the **LowPowerIndicatorActorSpec**.

The `LowPowerIndicatorActor` is provided by the Low Power Indicator plugin. Although it is not explicitly added to the template project, it is implicitly so by the Adjustment Screen plugin, which is included in it:

<a href="/documentation/images/tutorial/low-power-indicator-inclusion.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Low Power Indicator"><img src="/documentation/images/tutorial/low-power-indicator-inclusion.png" /></a>

The `LowPowerIndicatorActor` only shows when the battery's power is low, but this can be simulated in the built-in emulator by pressing Q:

<a href="/documentation/images/tutorial/low-power-indicator.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Low Power Indicator"><img src="/documentation/images/tutorial/low-power-indicator.png" /></a>

The entry for the low power indicator in the `PongStageActors` array not only references the **LowPowerIndicatorActorSpec**, but specifies a transformation: position, rotation and scale. The center of the screen is at the coordinates (0, 0, 0), so, since the Virtual Boy's screen is 384 pixels wide and 224 pixels tall, to make the indicator to show at the left-bottom corner, we can modify the coordinates to (-192, 112, 0):

```cpp
    {&LowPowerIndicatorActorSpec, {-192, 112, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
```

But the indicator's center will be at that point, so it wont be fully visible:

<a href="/documentation/images/tutorial/low-power-indicator-wrong.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Low Power Indicator"><img src="/documentation/images/tutorial/low-power-indicator-wrong.png" /></a>

We have to account of the indicator's image's size by moving it to:

```cpp
    {&LowPowerIndicatorActorSpec, {-192 + 8, 112 - 4, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
```

And now the indicator will be properly shown:

<a href="/documentation/images/tutorial/low-power-indicator-right.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Low Power Indicator"><img src="/documentation/images/tutorial/low-power-indicator-right.png" /></a>

The dimensions of the indicator's image is in an instance of the [TextureSpec](/documentation/api/struct-texture-spec/) **specification** structure called **LowPowerIndicatorTextureSpec**. Lets find where it is and what it looks like.
