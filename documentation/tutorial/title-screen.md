---
layout: documentation
parents: Documentation > Tutorial
title: First Steps
---

# Title Screen

We should start off with something simple, instead of getting into the more complicated actual game state just yet. Hey, the game we are developing should at least have a minimal title screen, right? So let's go ahead and transform `MyGameState` into `TitleScreenState`.

## State

First, rename the files _source/States/MyGameState/MyGameState.c_ and _source/States/MyGameState/MyGameState.h_, as well as the folder.

<figure>
    <a href="/documentation/images/tutorial/my-game-state-folders.png" data-toggle="lightbox" data-gallery="gallery" data-caption="MyGameState folder">
        <img src="/documentation/images/tutorial/my-game-state-folders.png" />
    </a>
    <figcaption>
        MyGameState folder
    </figcaption>
</figure>

Then, in the aforementioned files, all occurences of `MyGameState` must be replaced by `TitleScreenState`.

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

Also change the references to `MyGameState` in _source/Game.c_.

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

But we can do better and replace that simple text with a nice image. To do that, we need to create an [Actor](/documentation/api/class-actor/), attach a [Sprite](/documentation/api/class-sprite/) component to it and finally add the [Actor](/documentation/api/class-actor/) to the title screen's [Stage](/documentation/api/class-stage/).

## Actor

We want to replace the text with the following image, _pong-logo.png_.

<a href="/documentation/images/tutorial/pong-logo.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Pong Logo"><img src="/documentation/images/tutorial/pong-logo.png" /></a>

First of all, create the folder _assets/Actor/Logo_ and add an _.actor_ file in it by right clicking the _Logo_ folder and selecting "New File". Enter "Logo" as the file name and select the Type "Actor" in the dropdown on the right hand side.

<a href="/documentation/images/tutorial/new-actor-file.png" data-toggle="lightbox" data-gallery="gallery" data-caption="New Actor file"><img src="/documentation/images/tutorial/new-actor-file.png" /></a>

Our newly created file, _Logo.actor_ will automatically be opened and you will see an empty editor with a single button that reads "Add Component". Click it and select "Sprite" from the drop down menu. The newly added [Sprite](/documentation/api/class-sprite/) component will automatically be selected and an editor panel for that component shown on the right hand side.

<a href="/documentation/images/tutorial/new-sprite-component.png" data-toggle="lightbox" data-gallery="gallery" data-caption="New Sprite Component"><img src="/documentation/images/tutorial/new-sprite-component.png" /></a>

In that panel, an image can be added by clicking the "Source Image" box at the top. Once a file has been selected, a preview of the Sprite will be visible in the editor.

<a href="/documentation/images/tutorial/pong-sprite.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Pong Sprite"><img src="/documentation/images/tutorial/pong-sprite.png" /></a>

Behind the scenes, [VUEngine Studio](https://www.vuengine.dev/) will generate the file _Converted/LogoActorSpec.c_ next to our _Logo.actor_ file, containing the necessary **Spec**(s) to add our logo [Actor](/documentation/api/class-actor/) to the [Stage](/documentation/api/class-stage/).

<a href="/documentation/images/tutorial/logo-actor-spec.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Logo Actor Spec"><img src="/documentation/images/tutorial/logo-actor-spec.png" /></a>

## Stage

Internally, [Stages](/documentation/api/class-stage/) are created by the engine by passing a [StageSpec](/documentation/api/struct-stage-spec/) pointer to [GameState::configureStage](/documentation/api/class-game-state/). A [StageSpec](/documentation/api/struct-stage-spec/) holds all the configuration details to instantiante a [Stage](/documentation/api/class-stage/) and populate it with
game [Actors](/documentation/api/class-actor/).

At this moment, `TitleScreenState` initializes its [Stage](/documentation/api/class-stage/) with the **MyGameStageSpec**, which is defined in the file _assets/Stage/MyGameStageSpec.c_. Rename the file to _assets/Stage/TitleScreenStageSpec.c_ and in it, change all occurences of "MyGameStateStage" to "TitleScreenStage".

At the beginning of the file, you will find two arrays - `TitleScreenStageUiActors` and `TitleScreenStageActors`. These have entries that reference the **ActorSpecs** to use to instantiate and initialize the [Actors](/documentation/api/class-actor/) that will populate the [Stage](/documentation/api/class-stage/).

The arrays are very simple right now, containing only **LowPowerIndicatorActorSpec**, which is provided by the "Low Power Actor" plugin.

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

When [TitleScreenState::configureStage](/documentation/api/class-game-state/) is called with **TitleScreenStageSpec** as one of its arguments in the `TitleScreenState::enter` function, an [Actor](/documentation/api/class-actor/) will be created according to the **LowPowerIndicatorActorSpec**.

```cpp
void TitleScreenState::enter(void* owner __attribute__((unused)))
{
    [...]

    // Load stage
    TitleScreenState::configureStage(this, (StageSpec*)&TitleScreenStageSpec, NULL);

    [...]
}
```

The entry for the low power indicator in the `TitleScreenStageActors` array not only references the **LowPowerIndicatorActorSpec**, but also specifies a transformation: position, rotation and scale. We can neglect the latter two, but should have a look at the position.

The coordinate system used by the engine has the X axis going from left to right and the Y axis top to bottom. The center of the screen is at the coordinates {0, 0, 0}. So, since the Virtual Boy's screen is 384 pixels wide and 224 pixels tall, to get the indicator to show at the left-bottom corner, we can modify the coordinates to {-192, 112, 0}:

```cpp
{&LowPowerIndicatorActorSpec, {-192, 112, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
```

But, as seen in the screenshot below, this doesn't look quite right. Since the indicator's _center_ will be at the given point, it is not fully visible.

> **Note**: The Low Power Actor will only show when the Virtual Boy's battery power is low, but this can be simulated in the built-in emulator by pressing <span class="keys">W</span>.

<a href="/documentation/images/tutorial/low-power-indicator-wrong.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Low Power Indicator"><img src="/documentation/images/tutorial/low-power-indicator-wrong.png" /></a>

We have to account for the indicator's image size and subtract half of its width and height from the X and Y coordinates, respectively.

```cpp
{&LowPowerIndicatorActorSpec, {-192 + 8, 112 - 4, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
```

Now, the indicator will be properly shown:

<a href="/documentation/images/tutorial/low-power-indicator-right.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Low Power Indicator"><img src="/documentation/images/tutorial/low-power-indicator-right.png" /></a>

With this new knowledge, we can now follow the example of the low power indicator to add our previously created Logo [Actor](/documentation/api/class-actor/) to replace the simple text title. We want the logo to display in the center of the screen, so {0, 0, 0} are the coordinates to use.

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

> **Note**: Never remove the final entry, `{NULL, {0, 0, 0}, [...]`, or bad things will happen. This is a delimiter, used by the engine to know when it is done reading **ActorSpecs**.

Finally, to get right of the text title, remove the call to `TitleScreenState::print` from the `TitleScreenState::enter` method. After another round of build and run, the image will show up in the emulator.

<a href="/documentation/images/tutorial/title-screen.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Title Screen"><img src="/documentation/images/tutorial/title-screen.png" /></a>

Isn't it a beauty? We are now ready to [add another custom GameState](/documentation/tutorial/pong-game-state/) <i class="fa fa-arrow-right"></i>, this time one that will hold the actual Pong game.
