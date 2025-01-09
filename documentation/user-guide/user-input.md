---
layout: documentation
parents: Documentation > User Guide
title: User Input
---

# User Input

User input is read by the `KeypadManager` class’ instance and the engine takes on the duty of notifying the current `GameState` about changes to the user input by calling `GameState::processUserInput`.

In order to react to the actions of the user, the `GameState`s that implement the logic of the specific game must provide a custom implementation of the `processUserInput` method.

```cpp
void SomeGameState::processUserInput(const UserInput* userInput)
{
    [...]

    Base::processUserInput(this, userInput);
}
```

The `UserInput` struct, passed as a pointer to the `GameState`, has the following members:

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
