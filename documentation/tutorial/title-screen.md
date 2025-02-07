---
layout: documentation
parents: Documentation > Tutorial
title: First Steps
---

# Title Screen

The game we are developing should at least have a minimal title screen, so let's go ahead and rename `MyGameState` to `TitleScreenState`.

First, rename the files _source/States/MyGameState/MyGameState.h_ and _source/States/MyGameState/MyGameState.h_, as well as the folder.

<figure>
    <a href="/documentation/images/tutorial/my-game-state-folders.png" data-toggle="lightbox" data-gallery="gallery" data-caption="MyGameState folder">
        <img src="/documentation/images/tutorial/my-game-state-folders.png" />
    </a>
    <figcaption>
        MyGameState folder
    </figcaption>
</figure>

Then, in the mentioned files, all occurences of `MyGameState` must be replaced by `TitleScreenState`.

```cpp
singleton class TitleScreenState : GameState
{
    [...]

    /// Method to GameSaveDataManager the singleton instance
    /// @return AnimationSchemesState singleton
    static TitleScreenState getInstance();

    [...]
}
```

```cpp
#include <TitleScreenState.h>

[...]

void TitleScreenState::enter(void* owner __attribute__((unused)))
{
    Base::enter(this, owner);

    [...]
}

[...]
```

Also change the references to `MaGameState` in _source/Game.c_.

```cpp
[...]
#include <TitleScreenState.h>

GameState game(void)
{
    [...]

    // Return the first GameState
    return GameState::safeCast(TitleScreenState::getInstance());
}
```

Finally, we will change the message printed to the screen by modifying the method `TitleScreenState::print`.

```cpp
void TitleScreenState::print()
{
    Printer::text("A Pong Clone", (__SCREEN_WIDTH_IN_CHARS >> 1) - 6, 12, NULL);
}
```

If a font name is not provided to the [Printer::text](/documentation/api/class-printer/) function by passig it `NULL` as the last argument, a configurable default one will be used by the engine.

The output when the game is rebuilt will be:

<a href="/documentation/images/tutorial/a-pong-clone.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Game Title"><img src="/documentation/images/tutorial/a-pong-clone.png"/></a>

But we can do better and replace that simple text with a nice image instead. To do that, we need to add an [Actor](/documentation/api/class-actor/) to the [Stage](/documentation/api/class-stage/) and attach to it a [Sprite](/documentation/api/class-sprite/). Let's see how to do that.

## Stage

At this moment, the `TitleScreenState` initializes its [Stage](/documentation/api/class-stage/) with the **MyGameStageSpec**. It is defined in the file _assets/Stages/MyGameStageSpec.c_. We will rename both to **TitleScreenStageSpec** and _assets/Stages/TitleScreenStageSpec.c_, respectively.

### StageSpec

The [Stages](/documentation/api/class-stage/) are created by passing a [StageSpec](/documentation/api/struct-stage-spec/) pointer to [GameState::configureStage](/documentation/api/class-game-state/). A [StageSpec](/documentation/api/struct-stage-spec/) holds all the configuration details to instatiante a [Stage](/documentation/api/class-stage/) and populate it with
game [Actors](/documentation/api/class-actor/).

Almost at the end of it, two arrays are referenced, `TitleScreenStageUiActors` and `TitleScreenStageActors`. These have entries that reference the **ActorSpecs** to use to instantiate and initialize the [Actors](/documentation/api/class-actor/) that will populate the [Stage](/documentation/api/class-stage/):

```cpp
StageROMSpec TitleScreenStageSpec =
{
    // Class allocator
    __TYPE(Stage),

    [...]

    // Actors
    {
        // UI configuration
        {
            (PositionedActor*)TitleScreenStageUiActors,
            __TYPE(UIContainer),
        },

        // Stage's children actors
        (PositionedActor*)TitleScreenStageActors,
    },

    // Post processing effects
    (PostProcessingEffect*)NULL,
};
```

Those arrays are very simple right now:

```cpp
PositionedActorROMSpec TitleScreenStageActors[] =
{
    {&LowPowerIndicatorActorSpec, {0, 12, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},

    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};

PositionedActorROMSpec TitleScreenStageUiActors[] =
{
    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};
```

When [TitleScreenState::configureStage](/documentation/api/class-game-state/) is called with **TitleScreenStageSpec** as one of its arguments, an [Actor](/documentation/api/class-actor/) will be created with the **LowPowerIndicatorActorSpec**:

```cpp
void PongState::enter(void* owner __attribute__((unused)))
{
    Base::enter(this, owner);

    // Reset last button inputs
    TitleScreenState::resetLastInputs(this);

    // Load stage
    TitleScreenState::configureStage(this, (StageSpec*)&TitleScreenStageSpec, NULL);

    // Start clocks to start animations
    TitleScreenState::startClocks(this);

    // Enable user input
    KeypadManager::enable();

    // Start fade in effect
    Camera::startEffect(Camera::getInstance(), kHide);

    Camera::startEffect
    (
        Camera::getInstance(),
        kFadeTo,        // effect type
        0,              // initial delay (in ms)
        NULL,           // target brightness
        __FADE_DELAY,   // delay between fading steps (in ms)
        NULL            // callback scope
    );
}
```

The `LowPowerIndicatorActor` is provided by the Low Power Indicator plugin. Although it is not explicitly added to the template project, it is implicitly so by the Adjustment Screen plugin, which is included in it:

<a href="/documentation/images/tutorial/low-power-indicator-inclusion.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Low Power Indicator"><img src="/documentation/images/tutorial/low-power-indicator-inclusion.png" /></a>

The `LowPowerIndicatorActor` only shows when the battery's power is low, but this can be simulated in the built-in emulator by pressing Q:

<a href="/documentation/images/tutorial/low-power-indicator.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Low Power Indicator"><img src="/documentation/images/tutorial/low-power-indicator.png" /></a>

The entry for the low power indicator in the `TitleScreenStageActors` array not only references the **LowPowerIndicatorActorSpec**, but specifies a transformation: position, rotation and scale. The center of the screen is at the coordinates (0, 0, 0), so, since the Virtual Boy's screen is 384 pixels wide and 224 pixels tall, to make the indicator to show at the left-bottom corner, we can modify the coordinates to (-192, 112, 0):

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

The dimensions of the indicator's image is in an instance of the [TextureSpec](/documentation/api/struct-texture-spec/) **specification** structure called **LowPowerIndicatorTextureSpec**. Let's find where it is and what it looks like.

We can now follow the example of the low power indicator to add an image of our own to replace the title on display.

## Actor

We will use the following image to replace the text:

<a href="/documentation/images/tutorial/pong-logo.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Pong Logo"><img src="/documentation/images/tutorial/pong-logo.png" /></a>

To do so, create the folder _assets/Actor/Logo_ and add an _.actor_ file in it by right clicking the _Logo_ folder and selecting "New File". Enter "Logo" as the file name and select the Type "Actor" on the right hand side dropdown.

<a href="/documentation/images/tutorial/new-actor-file.png" data-toggle="lightbox" data-gallery="gallery" data-caption="New Actor file"><img src="/documentation/images/tutorial/new-actor-file.png" /></a>

Our newly created file, _Logo.actor_ will automatically be opened and you will see an empty editor with a single button that reads "Add Component". Click it and select "Sprite" from the drop down menu. The newly added "Sprite" component will automatically be selected and an editor panel for that component shown on the right hand side.

<a href="/documentation/images/tutorial/new-sprite-component.png" data-toggle="lightbox" data-gallery="gallery" data-caption="New Sprite Component"><img src="/documentation/images/tutorial/new-sprite-component.png" /></a>

In that panel, an image can be added by clicking the "Source Image" box at the top. Once a file has been selected, a preview of the Sprite will be visible in the editor.

<a href="/documentation/images/tutorial/pong-sprite.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Pong Sprite"><img src="/documentation/images/tutorial/pong-sprite.png" /></a>

Behind the scenes, [VUEngine Studio](https://www.vuengine.dev/) will generate the file _Converted/LogoActorSpec.c_ next to our _Logo.actor_ file, containing the necessary **Spec**(s) to add our logo [Actor](/documentation/api/class-actor/) to the [Stage](/documentation/api/class-stage/).

<a href="/documentation/images/tutorial/logo-actor-spec.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Logo Actor Spec"><img src="/documentation/images/tutorial/logo-actor-spec.png" /></a>

We are finally ready to replace the text with a nice image. To do so, **LogoActorSpec** has to be added to the `TitleScreenStageActors` array in the file _assets/Stages/MyGameStageSpec.c_.

```cpp
[...]
extern ActorSpec LogoActorSpec;

PositionedActorROMSpec TitleScreenStageActors[] =
{
    {&LogoActorSpec,                {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&LowPowerIndicatorActorSpec,   {-192 + 8, 112 - 4, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},

    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};

[...]
```

Finally, remove the call to `TitleScreenState::print` from the `TitleScreenState::enter` method. After another round of build and run, the image will show up in the emulator.

<a href="/documentation/images/tutorial/title-screen.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Title Screen"><img src="/documentation/images/tutorial/title-screen.png" /></a>

We can now [add another custom GameState](/documentation/tutorial/pong-game-state/) <i class="fa fa-arrow-right"></i>, this time one that will hold the actual Pong game.
