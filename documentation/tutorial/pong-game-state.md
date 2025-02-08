---
layout: documentation
parents: Documentation > Tutorial
title: Pong Game State
---

# Pong Game State

The main purpose of a [GameState](/documentation/api/class-game-state/) is to serve as the point of contact between the [VUEngine](https://github.com/VUEngine/VUEngine-Core) and the actual game. [GameStates](/documentation/api/class-game-state/) have a life cycle defined by the following interface:

```cpp
    /// Prepares the object to enter this state.
    /// @param owner: Object that is entering in this state
    virtual void enter(void* owner);

    /// Updates the object in this state.
    /// @param owner: Object that is in this state
    virtual void execute(void* owner);

    /// Prepares the object to exit this state.
    /// @param owner: Object that is exiting this state
    virtual void exit(void* owner);

    /// Prepares the object to become inactive in this state.
    /// @param owner: Object that is in this state
    virtual void suspend(void* owner);

    /// Prepares the object to become active in this state.
    /// @param owner: Object that is in this state
    virtual void resume(void* owner);
```

While it is possible to implement a whole game that runs solely in the `execute` method, the flexibility of the engine shines when using [Stages](/documentation/api/class-stage/), which are [Containers](/documentation/api/class-container/) that have [Actors](/documentation/api/class-actor/) as children.

When the engine's [StateMachine](/documentation/api/class-state-machine/) enters a new [GameStates](/documentation/api/class-game-state/), it will call [GameState::enter](/documentation/api/class-game-state/), where the state can be initialized.

## Exiting the Title Screen

We need to move beyond the `TitleScreenState` to start implementing the actual game. To do so, we need to detect the user input and change the engine's current state when the START button is pressed. That is done in the [GameState::processUserInput](/documentation/api/class-game-state/) method, which the state provided in the template project already overrides:

```cpp
singleton class TitleScreenState : GameState
{
    [...]

    /// Process the provided user input.
    /// @param userInput: Struct with the current user input information
    override void processUserInput(const UserInput* userInput);
}
```

That method receives a pointer to a struct called [UserInput](/documentation/api/struct-user-input/) that has the user input that was registered during the last game frame:

```cpp
/// User's input
/// @memberof KeypadManager
typedef struct UserInput
{
    /// All pressed key(s)
    uint16 allKeys;

    /// Pressed key(s) just in the last cycle
    uint16 pressedKey;

    /// Released key(s) just in the last cycle
    uint16 releasedKey;

    /// Held key(s)
    uint16 holdKey;

    /// How long the key(s) have been held (in game frames)
    uint32 holdKeyDuration;

    /// Previously pressed key(s)
    uint16 previousKey;

    /// Low power flag
    uint16 powerFlag;

    /// Dummy input to force user input processing even if
    /// there is not a real one
    uint16 dummyKey;

} UserInput;
```

So, to detect if the user pressed the START button, the `pressedKey` attribute of the [UserInput](/documentation/api/struct-user-input/) struct has to be tested against [K_STA](https://github.com/VUEngine/VUEngine-Core/blob/master/source/Hardware/KeypadManager.h) and, if successful, make the engine to change its current state to the [GameState](/documentation/api/class-game-state/) in which the actual gameplay will run:

```cpp
void TitleScreenState::processUserInput(const UserInput* userInput)
{
    [...]

    if(0 != (K_STA & userInput->pressedKey))
    {
        // Disable the keypad to prevent processing of more inputs
        KeypadManager::disable();

        // Tell the VUEngine to change the current state
        VUEngine::changeState(GameState::safeCast(PongState::getInstance()));
    }
}
```

## Entering the Pong State

We need to create the `PongState` in order to being able to transition to it. To do so, create the folder _source/States/PongState_ and two files: _source/States/PongState/PongState.h_ and _source/States/PongState/PongState.c_.

```cpp
singleton class PongState : GameState
{
    /// @protectedsection

    /// @publicsection

    /// Method to GameSaveDataManager the singleton instance
    /// @return AnimationSchemesState singleton
    static PongState getInstance();
}
```

But the `PongState` will remain empty if we don't add actors to it. They consists of a disk and 2 paddles so, let's create them in _assets/Actor/Disk/_ and _assets/Actor/Paddle/_ with the _.actor_ file as it was done before to create the logo in the title screen:

<a href="/documentation/images/tutorial/disk-and-paddle-actors.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Disk and Paddle Actor Spec"><img src="/documentation/images/tutorial/disk-and-paddle-actors.png" /></a>

Now, we need a [StageSpec](/documentation/api/struct-stage-spec/) for the `PongState`. Simply copy the _TitleScreenStageSpec.c_ file, name it as _PongStageSpec.c_ and rename all the variables in it from `TitleScreen*` as `Pong*`. Finally, add the [ActorSpecs](/documentation/api/struct-actor-spec/) for the disk and the paddle as we added the **LogoActorSpec** to the title screen:

```cpp
[...]

extern ActorSpec DiskActorSpec;
extern ActorSpec PaddleActorSpec;

[...]

PositionedActorROMSpec PongStageActors[] =
{
    {&DiskActorSpec,                {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&PaddleActorSpec,              {-180, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&PaddleActorSpec,              {180, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&LowPowerIndicatorActorSpec,   {-192 + 8, 112 - 4, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},

    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};
```

Since the [StageSpec](/documentation/api/struct-stage-spec/) is ready, it can be passed to [PongState::configureStage](/documentation/api/class-game-state/):

```cpp
void PongState::enter(void* owner __attribute__((unused)))
{
    Base::enter(this, owner);

    // Load stage
    PongState::configureStage(this, (StageSpec*)&PongStageSpec, NULL);

    PongState::startClocks(this);

    KeypadManager::enable();
}
```

Don't forget to override the method in the header file:

```cpp
singleton class PongState : GameState
{
    /// @protectedsection

    /// @publicsection

    /// Method to GameSaveDataManager the singleton instance
    /// @return AnimationSchemesState singleton
    static PongState getInstance();

    /// Prepares the object to enter this state.
    /// @param owner: Object that is entering in this state
    override void enter(void* owner);
}
```

and to add a constructor and destructor to the `PongState`'s implementation:

```cpp
void PongState::constructor()
{
    // Always explicitly call the base's constructor
    Base::constructor();
}

void PongState::destructor()
{
    // Always explicitly call the base's destructor
    Base::destructor();
}
```

When the game is built and run, pressing START on the title screen will transition to the `PongState`, which will show the following.

<a href="/documentation/images/tutorial/pong-state.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/tutorial/pong-state.png" /></a>

While the engine remains in the same state, it will call [GameState::execute](/documentation/api/class-game-state/) once per game frame. So far, the `PongState` doesn't override the method, nor does it override the `exit` method, which is called when the engine's [StateMachine](/documentation/api/class-state-machine/) changes to another [GameState](/documentation/api/class-game-state/).

Additionally, the [GameState](/documentation/api/class-game-state/) defines the `suspend` and `resume` methods, which are intented to give the current [GameState](/documentation/api/class-game-state/) the opportunity to perform optional tasks for suspending and resuming it, like when pausing and unpausing the game.

To bring some life into our game, let's [make the Disk move](/documentation/tutorial/pong-disk/) <i class="fa fa-arrow-right"></i> next!
