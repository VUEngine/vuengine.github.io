---
layout: documentation
parents: Documentation > Tutorial
title: Stage
---

# Stage

The main purpose of a [GameState](/documentation/api/class-game-state/) is to serve as the point of contact between the [VUEngine](https://github.com/VUEngine/VUEngine-Core) and the actual game. While it is possible to implement a whole game that runs solely in the `execute` method, the flexibility of the engine shines when using [Stage](/documentation/api/class-stage/). They are [Containers](/documentation/api/class-container/) that has [Actors](/documentation/api/class-actor/) as children.

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

When [PongState::configureStage](/documentation/api/class-game-state/) is called with **PongStageSpec** as one of its arguments, an [Actor](/documentation/api/class-actor/) will be instantiated and initialized with to be **LowPowerIndicatorActorSpec**.

The `LowPowerIndicatorActor` is provided by the Low Power Indicator plugin. Although it is not explicitly added to the template project, it is implicitly so by the Adjustment Screen plugin, which is included in it:

<a href="/documentation/images/tutorial/low-power-indicator-inclusion.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Low Power Indicator"><img src="/documentation/images/tutorial/low-power-indicator-inclusion.png" /></a>

The `LowPowerIndicatorActor` only shows when the battery's power is low, but this can be simulated in the built-in emulator by pressing Q:

<a href="/documentation/images/tutorial/low-power-indicator.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Low Power Indicator"><img src="/documentation/images/tutorial/low-power-indicator.png" /></a>

The entry for the low power indicator in the `PongStageActors` array not only references the **LowPowerIndicatorActorSpec**, but specifies a transformation: position, rotation and scale. The center of the screen is at the coordinate (0, 0, 0), so, to make the indicator to show at the left-bottom corner, we can modify it to (-192, 112, 0):

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


## ActorSpec

[ActorSpecs](/documentation/api/struct-actor-spec/) are the heart of the [VUEngine](https://github.com/VUEngine/VUEngine-Core). They define the data used to populate the levels of games developed with it.

```cpp
typedef struct ActorSpec
{
    /// Class allocator
    AllocatorPointer allocator;

    /// Component specs
    ComponentSpec** componentSpecs;

    /// Children specs
    struct PositionedActor* childrenSpecs;

    /// Extra info
    void* extraInfo;

    // Size
    // If 0, it is computed from the visual components if any
    PixelSize pixelSize;

    // Actor's in-game type
    uint8 inGameType;

    /// Array of function animations
    const AnimationFunction** animationFunctions;

    /// Animation to play automatically
    char* initialAnimation;

} ActorSpec;
```

[Actors](/documentation/api/class-actor/) are [Entites](/documentation/api/class-enity/) in [VUEngine](https://github.com/VUEngine/VUEngine-Core), and [Entites](/documentation/api/class-enity/) support [compositionality](/documentation/user-guide/design-principles/#components/) through [Components](/documentation/api/class-component/).

[Components](/documentation/api/class-component/) can be:

- Behaviors
- Body
- Colliders
- Sprites
- Wireframes

The **LowPowerIndicatorActorSpec** is a derivation of the [ActorSpec](/documentation/api/struct-actor-spec/):

```cpp
LowPowerActorROMSpec LowPowerIndicatorActorSpec =
{
    // Animated actor
    {
        // actor
        // Class allocator
        __TYPE(LowPowerActor),

        // Component specs
        (ComponentSpec**)LowPowerIndicatorActorComponentSpecs,

        // Children specs
        NULL,

        // Extra info
        NULL,

        // Size
        // If 0, it is computed from the visual components if any
        {0, 0, 0},

        // Actor's in-game type
        kTypeNone,

        // Pointer to animation functions array
        (const AnimationFunction**)LowPowerIndicatorAnimationSpecs,

        // Animation to play automatically
        "Hide",
    }
};
```

It specifies that the engine must attach to the `LowPowerIndicator` instance [Components](/documentation/api/class-component/) initialized with the [ComponentSpecs](/documentation/api/struct-component-spec/) listed in **LowPowerIndicatorActorComponentSpecs**:

```cpp
ComponentSpec* const LowPowerIndicatorActorComponentSpecs[] = 
{
    (ComponentSpec*)&LowPowerIndicatorSpriteSpec,
    NULL
};
```

It should be obvious by this point that it is **Specs** all the way through. The **LowPowerIndicatorSpriteSpec** specifies to create a [BgmapSprite](/documentation/api/class-bgmap-sprite/), which in turn uses the **LowPowerIndicatorTextureSpec** to initialize a [Texture](/documentation/api/class-texture/):

```cpp
BgmapSpriteROMSpec LowPowerIndicatorSpriteSpec =
{
    [...]

        // Spec for the texture to display
        (TextureSpec*)&LowPowerIndicatorTextureSpec,

    [...]
};
```

And, finally, **LowPowerIndicatorTextureSpec** uses **LowPowerIndicatorCharsetSpec** to create and initialize a [CharSet](/documentation/api/class-char-set/), which holds the reference to the pixel data. For more details, check [here](/documentation/user-guide/graphics/) the graphics section in the [user guide](/documentation/user-guide/).

```cpp
TextureROMSpec LowPowerIndicatorTextureSpec =
{
    // Pointer to the char spec that the texture uses
    (CharSetSpec*)&LowPowerIndicatorCharsetSpec,

    [...]
};
```

```cpp
CharSetROMSpec LowPowerIndicatorCharsetSpec =
{
    [...]

    // Tiles array
    LowPowerIndicatorTiles,

    [...]
};
```