---
layout: documentation
parents: Documentation > Tutorial
title: Pong Game State
---

# Pong Game State

The main purpose of a [GameState](/documentation/api/class-game-state/) is to serve as the point of contact between the [VUEngine](https://github.com/VUEngine/VUEngine-Core) and the actual game. While it is possible to implement a whole game that runs solely in the `execute` method, the flexibility of the engine shines when using [Stages](/documentation/api/class-stage/). They are [Containers](/documentation/api/class-container/) that has [Actors](/documentation/api/class-actor/) as children.

[GameStates](/documentation/api/class-game-state/) have a life cycle defined by the following interface:

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

When the engine's [StateMachine](/documentation/api/class-state-machine/) enters a new [GameStates](/documentation/api/class-game-state/), it will call [GameState::enter](/documentation/api/class-game-state/), where the state can be initialized.

## Exiting the Title Screen

At the moment, the `TitleScreenState::enter` method does a few things, like enabling the keypad and loading the [Stage](/documentation/api/class-stage/) with the [Actor](/documentation/api/class-actor/) that displays the logo:

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
        kFadeTo,	   // effect type
        0,			   // initial delay (in ms)
        NULL,		   // target brightness
        __FADE_DELAY,  // delay between fading steps (in ms)
        NULL		   // callback scope
    );
}
```

But we need to move beyond this state to start implementing the actual game. To do so, we need to detect the user input and change the engine's current state when the START button is pressed. That is done in the [GameState::processUserInput](/documentation/api/class-game-state/) method, which the state provided in the template project already overrides:

```cpp
dynamic_singleton class TitleScreenState : GameState
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

So, to detect if the user pressed the START button, the `pressedKey` attribute of the [UserInput](/documentation/api/struct-user-input/) struct has to be tested against [K_STA](https://github.com/VUEngine/VUEngine-Core/blob/master/source/Hardware/KeypadManager.h) and if successful, make the engine to change its current state to the [GameState](/documentation/api/class-game-state/) in which the actual gameplay will run:

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

We need to create the `PongState` in order to being able to transition to it. To do so, create the folder *source/States/PongState* and two files: *source/States/PongState/PongState.h* and *source/States/PongState/PongState.c*. The new state needs to override the `enter` method make the screen to fade in since the previous state left it dark:

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

And in the implementation, a fade in effect has to be applied:

```cpp
void PongState::enter(void* owner __attribute__((unused)))
{
    Base::enter(this, owner);

    // Start fade in effect
	Camera::startEffect(Camera::getInstance(), kHide);
    Camera::startEffect
    (
        Camera::getInstance(),
        kFadeTo,	   // effect type
        0,			   // initial delay (in ms)
        NULL,		   // target brightness
        __FADE_DELAY,  // delay between fading steps (in ms)
        NULL		   // callback scope
    );
}
```

But the `PongState` will remain empty if we don't add actors to it. The consists of a disk and 2 paddles so, lets create them in *assets/Actors/Disk/* and *assets/Actors/Paddle/* with the "Actor" file as it was done before to create the logo in the title screen:

<a href="/documentation/images/tutorial/disk-and-paddle-actors.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Disk and Paddle Actor Spec"><img src="/documentation/images/tutorial/disk-and-paddle-actors.png" /></a>

Now, we need a [StageSpec](/documentation/api/struct-stage-spec/) for the `PongState`. Simply copy the *TitleScreenStageSpec.c* file, name it as *PongStageSpec.c* and rename all the variables in it from `TitleScreen*` as `Pong*`. Finally, add the [ActorSpecs](/documentation/api/struct-actor-spec/) for the disk and the paddle as we added the **LogoActorSpec** to the title screen:

```cpp
[...]

extern ActorSpec PaddleActorSpec;

[...]

PositionedActorROMSpec PongStageActors[] =
{	
    {&DiskActorSpec, 				{0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&PaddleActorSpec, 				{-180, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&PaddleActorSpec, 				{180, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&LowPowerIndicatorActorSpec, 	{-192 + 8, 112 - 4, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},

    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};
```

Now that the [StageSpec](/documentation/api/struct-stage-spec/) is ready, it has to be passed to `PongState::configureStage`(/documentation/api/class-game-state/):

```cpp
void PongState::enter(void* owner __attribute__((unused)))
{
	Base::enter(this, owner);

	// Load stage
	PongState::configureStage(this, (StageSpec*)&PongStageSpec, NULL);

	// Start fade in effect
	Camera::startEffect(Camera::getInstance(), kHide);
	Camera::startEffect
	(
		Camera::getInstance(),
		kFadeTo,	   // effect type
		0,			   // initial delay (in ms)
		NULL,		   // target brightness
		__FADE_DELAY,  // delay between fading steps (in ms)
		NULL		   // callback scope
	);
}
```

When the game is built and run, pressing START in the title screen will show a fade out and fade in into the `PongState`, which will show the following:

<a href="/documentation/images/tutorial/Disk-and-paddle-actors.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Disk and Paddle Actor Spec"><img src="/documentation/images/tutorial/pong-state.png" /></a>

While the engine remains in the same state, it will call [GameState::execute](/documentation/api/class-game-state/) once per game frame. So far, the `PongState` doesn't override the method, nor does it override the `exit` method, which is called when the engine's [StateMachine](/documentation/api/class-state-machine/) changes to another [GameState](/documentation/api/class-game-state/).

Additionally, the [GameState](/documentation/api/class-game-state/) defines the `suspend` and `resume` methods, which are intented to give the current [GameState](/documentation/api/class-game-state/) the opportunity to perform optional tasks for suspending and resuming it, like when pausing and unpausing the game.
