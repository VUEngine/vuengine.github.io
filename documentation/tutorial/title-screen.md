---
layout: documentation
parents: Documentation > Tutorial
title: First Steps
---

# Title Screen

We should start off with something simple, instead of getting into the more complicated actual game state just yet. Hey, the game we are developing should at least have a minimal title screen, right? So let's go ahead and transform `MyGameState` into `TitleScreenState`.

## State

First, rename the files _source/States/MyGameState/MyGameState.c_ and _source/States/MyGameState/MyGameState.h_, as well as the folder, to _source/States/TitleScreenState/TitleScreenState.c_ and _source/States/TitleScreenState/TitleScreenState.h_ respectively.

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

<div class="codecaption">
    <span class="filepath">
        source/States/TitleScreenState/TitleScreenState.h
    </span>
</div>

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

<div class="codecaption">
    <span class="filepath">
        source/States/TitleScreenState/TitleScreenState.c
    </span>
</div>

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

<div class="codecaption">
    <span class="filepath">
        source/Game.c
    </span>
</div>

Finally, we will change the message printed to the screen by modifying the method `TitleScreenState::print` to look as follows:

```cpp
void TitleScreenState::print()
{
    Printer::text("A Pong Clone", (__SCREEN_WIDTH_IN_CHARS >> 1) - 6, 12, NULL);
}
```

<div class="codecaption">
    <span class="filepath">
        source/States/TitleScreenState/TitleScreenState.c
    </span>
</div>

If a font name is not provided to the [Printer::text](/documentation/api/class-printer/) function by passig it `NULL` as the last argument, a configurable default one will be used by the engine.

The output when the game is rebuilt will be:

<figure>
    <a href="/documentation/images/tutorial/a-pong-clone.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Minimalistic title screen">
        <img src="/documentation/images/tutorial/a-pong-clone.png" />
    </a>
    <figcaption>
        Minimalistic title screen
    </figcaption>
</figure>

But we can do better and replace that simple text with a nice image. To do that, we need to create an [Actor](/documentation/api/class-actor/), attach a [Sprite](/documentation/api/class-sprite/) component to it and finally add the [Actor](/documentation/api/class-actor/) to the title screen's [Stage](/documentation/api/class-stage/).

## Actor

We want to replace the text with the following image. Click it to download.

<figure>
    <a href="/documentation/images/tutorial/pong-logo.png" download><img src="/documentation/images/tutorial/pong-logo.png" width="288" height="64" /></a>
    <figcaption>
        pong-logo.png
    </figcaption>
</figure>

First of all, create the folder _assets/Actor/Logo_ and add an _.actor_ file in it by right clicking the _Logo_ folder and selecting "New File". Enter "Logo" as the file name and select the Type "Actor" in the dropdown on the right hand side.

<figure>
    <a href="/documentation/images/tutorial/new-actor-file.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Creating an actor through the New File dialog">
        <img src="/documentation/images/tutorial/new-actor-file.png" />
    </a>
    <figcaption>
        Creating an actor through the "New File" dialog
    </figcaption>
</figure>

Our newly created file, _Logo.actor_ will automatically be opened and you will see an empty editor with a single button that reads "Add Component". Click it and select "Sprite" from the drop down menu. The newly added [Sprite](/documentation/api/class-sprite/) component will automatically be selected and an editor panel for that component will be shown on the right hand side.

<figure>
    <a href="/documentation/images/tutorial/new-sprite-component.png" data-toggle="lightbox" data-gallery="gallery" data-caption="A new Sprite component in the actor editor">
        <img src="/documentation/images/tutorial/new-sprite-component.png" />
    </a>
    <figcaption>
        A new Sprite component in the actor editor
        <span class="filepath">
            assets/Actor/Logo/Logo.actor
        </span>
    </figcaption>
</figure>

In that panel, an image can be added by clicking the "Source Image" box at the top. Once a file has been selected, a preview of the Sprite will be visible in the editor.

<figure>
    <a href="/documentation/images/tutorial/pong-sprite.png" data-toggle="lightbox" data-gallery="gallery" data-caption="PONG logo Sprite component in the actor editor">
        <img src="/documentation/images/tutorial/pong-sprite.png" />
    </a>
    <figcaption>
        PONG logo Sprite component in the actor editor
        <span class="filepath">
            assets/Actor/Logo/Logo.actor
        </span>
    </figcaption>
</figure>

Behind the scenes, [VUEngine Studio](https://www.vuengine.dev/) will generate the file _Converted/LogoActorSpec.c_ next to our _Logo.actor_ file, it will contain the necessary **Spec**(s) to add our logo [Actor](/documentation/api/class-actor/) to the [Stage](/documentation/api/class-stage/).

<figure>
    <a href="/documentation/images/tutorial/logo-actor-spec.png" data-toggle="lightbox" data-gallery="gallery" data-caption="The generated Logo Actor Spec">
        <img src="/documentation/images/tutorial/logo-actor-spec.png" />
    </a>
    <figcaption>
        The generated Logo Actor Spec
        <span class="filepath">
            assets/Actor/Logo/Converted/LogoActorSpec.c
        </span>
    </figcaption>
</figure>

> **Attention**: The current version of the actor editor has a bug that prevents it from detecting any changes when adding a sprite component, or after adding an image source to it. As a workaround for the time being, you will have to do another change, e.g. setting the palette to 1 and back to 0, before the sprite component gets detected and can be saved.

## Stage

Internally, [Stages](/documentation/api/class-stage/) are created by the engine by passing a [StageSpec](/documentation/api/struct-stage-spec/) pointer to [GameState::configureStage](/documentation/api/class-game-state/). A [StageSpec](/documentation/api/struct-stage-spec/) holds all the configuration details to instantiate a [Stage](/documentation/api/class-stage/) and populate it with
game [Actors](/documentation/api/class-actor/).

At this moment, `TitleScreenState` initializes its [Stage](/documentation/api/class-stage/) with the **MyGameStageSpec**, which is defined in the file _assets/Stage/MyGameStageSpec.c_. Rename the file to _assets/Stage/TitleScreenStageSpec.c_ and, in it, change all occurences of "MyGameStage*" to "TitleScreenStage*".

At the beginning of the file, you will find two arrays - `TitleScreenStageUiActors` and `TitleScreenStageActors`. These have entries that reference the **ActorSpecs** to use to instantiate and initialize the [Actors](/documentation/api/class-actor/) that will populate the [Stage](/documentation/api/class-stage/).

The arrays are very simple right now, containing only **LowPowerIndicatorActorSpec**, which is provided by the "Low Power Actor" plugin:

```cpp
PositionedActorROMSpec TitleScreenStageActors[] =
{
    {&LowPowerIndicatorActorSpec, {__PLUGIN_LOW_POWER_ACTOR_X_POSITION, __PLUGIN_LOW_POWER_ACTOR_Y_POSITION, __PLUGIN_LOW_POWER_ACTOR_Z_POSITION}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},

    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};

PositionedActorROMSpec TitleScreenStageUiActors[] =
{
    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};
```

<div class="codecaption">
    <span class="filepath">
        assets/Stage/TitleScreenStageSpec.c
    </span>
</div>

When **TitleScreenStageSpec** is passed to [TitleScreenState::configureStage](/documentation/api/class-game-state/) from the `TitleScreenState::enter` function, as shown below, an [Actor](/documentation/api/class-actor/) will be created according to the **LowPowerIndicatorActorSpec**:

```cpp
void TitleScreenState::enter(void* owner __attribute__((unused)))
{
    [...]

    // Load stage
    TitleScreenState::configureStage(this, (StageSpec*)&TitleScreenStageSpec, NULL);

    [...]
}
```

<div class="codecaption">
    <span class="filepath">
        source/States/TitleScreenState/TitleScreenState.c
    </span>
</div>

The entry for the low power indicator in the `TitleScreenStageActors` array not only references the **LowPowerIndicatorActorSpec**, but also specifies a transformation: position, rotation and scale. We can neglect the latter two, but should have a look at the position.

The coordinate system used by the engine has the X axis going from left to right and the Y axis top to bottom. The center of the screen is at the coordinates {0, 0, 0}. So, since the Virtual Boy's screen is 384 pixels wide and 224 pixels tall, to get the indicator to show at the left-bottom corner, we can modify the coordinates to {-192, 112, 0}:

```cpp
{&LowPowerIndicatorActorSpec, {-192, 112, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
```

<div class="codecaption">
    <span class="filepath">
        assets/Stage/TitleScreenStageSpec.c
    </span>
</div>

But, as seen in the screenshot below, this doesn't look quite right. Since the indicator's _center_ will be at the given point, it is not fully visible.

> **Note**: The Low Power Actor will only show when the Virtual Boy's battery power is low, but this can be simulated in the built-in emulator by pressing <span class="keys">W</span>.

<figure>
    <a href="/documentation/images/tutorial/low-power-indicator-wrong.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Now this looks off...">
        <img src="/documentation/images/tutorial/low-power-indicator-wrong.png" />
    </a>
    <figcaption>
        Now this looks off...
    </figcaption>
</figure>

We have to account for the indicator's image size and subtract half of its width and height from the X and Y coordinates, respectively.

```cpp
{&LowPowerIndicatorActorSpec, {-192 + 8, 112 - 4, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
```

<div class="codecaption">
    <span class="filepath">
        assets/Stage/TitleScreenStageSpec.c
    </span>
</div>

Now, the indicator will be properly shown:

<figure>
    <a href="/documentation/images/tutorial/low-power-indicator-right.png" data-toggle="lightbox" data-gallery="gallery" data-caption="This is better!">
        <img src="/documentation/images/tutorial/low-power-indicator-right.png" />
    </a>
    <figcaption>
        This is better!
    </figcaption>
</figure>

With this new knowledge, we can now follow the example of the low power indicator to add our previously created Logo [Actor](/documentation/api/class-actor/) to replace the simple text title. We want the logo to display in the center of the screen, so {0, 0, 0} are the coordinates to use. Don't for get to also declare _LogoActorSpec_ above with the line "extern ActorSpec LogoActorSpec;".

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

<div class="codecaption">
    <span class="filepath">
        assets/Stage/TitleScreenStageSpec.c
    </span>
</div>

> **Note**: Never remove the final entry, `{NULL, {0, 0, 0}, [...]`, or bad things will happen. This is a delimiter, used by the engine to know when it is done reading **ActorSpecs**.

Finally, to get rid of the text title, remove all calls to `TitleScreenState::print` from the `TitleScreenState::enter` and `TitleScreenState::resume` methods, as well as the method itself. After another round of build and run, the image will show up in the emulator.

<figure>
    <a href="/documentation/images/tutorial/title-screen.png" data-toggle="lightbox" data-gallery="gallery" data-caption="The finished title screen">
        <img src="/documentation/images/tutorial/title-screen.png" />
    </a>
    <figcaption>
        The finished title screen
    </figcaption>
</figure>

Isn't it a beauty? We are now ready to [add another custom GameState](/documentation/tutorial/pong-game-state/) <i class="fa fa-arrow-right"></i>, this time one that will hold the actual Pong game.
