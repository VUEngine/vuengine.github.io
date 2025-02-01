---
layout: documentation
parents: Documentation > Tutorial
title: Game State
---

# Game State

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

At the moment, the `PongState` does a few things, like printing the message displayed on the screen, enabling the keypad, loading a [Stage](/documentation/api/class-stage/) and starting a fade in effect:


```cpp
void PongState::enter(void* owner __attribute__((unused)))
{
    Base::enter(this, owner);

    // Reset last button inputs
    PongState::resetLastInputs(this);

    // Load stage
    PongState::configureStage(this, (StageSpec*)&MyGameStageSpec, NULL);

    // Start clocks to start animations
    PongState::startClocks(this);

    // Print text
    PongState::print(this);

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

While the engine remains in the same state, it will call [GameState::execute](/documentation/api/class-game-state/) once per game frame. So far, the `PongState` does override the `execute` method. Nor does it override the `exit` method, which is called when the engine's [StateMachine](/documentation/api/class-state-machine/) changes to another [GameState](/documentation/api/class-game-state/).

Additionally, the [GameState](/documentation/api/class-game-state/) defines the `suspend` and `resume` methods, which intented to give the current [GameState](/documentation/api/class-game-state/) the opportunity to perform optional tasks for suspending and resuming it, like when pausing and unpausing the game.
