---
layout: documentation
parents: Documentation > Tutorial
title: Scores
---

# Scores

It is time to track the score of the game. To do so, we are going to implement a class that will serve to separate the actual game's logic from the `PongState`, since the [GameState](/documentation/api/class-game-state/) is more of a proxy between the game and [VUEngine](https://github.com/VUEngine/VUEngine-Core).

## Pong Manager

Let's add a `PongManager` class that will handle the game's logic. At minimum, it needs to know when the disk goes out of the screen. And to know about the disk, it has to get a reference to it somehow. The way to do it is to retrieve it from the [Stage](/documentation/api/class-stage/), and given that the later belongs to the `PongState`, it makes sense to make the `PongManager` an attribute of `PongState`. But because the `PongState` persists throughout the whole life cycle of the game by being a `singleton` class, it is better to create the `PongManager` when the engine enters the state and destroy it when it exists. So, override the `enter` and `exit` methods of `PongState`.

```cpp
#ifndef PONG_STATE_H_
#define PONG_STATE_H_

[...]

#include <PongManager.h>

[...]

singleton class PongState : GameState
{
    /// @protectedsection

    /// Manager for the pong game's logic
    PongManager pongManager;

    /// @publicsection

    /// Method to GameSaveDataManager the singleton instance
    /// @return AnimationSchemesState singleton
    static PongState getInstance();

    /// Prepares the object to enter this state.
    /// @param owner: Object that is entering in this state
    override void enter(void* owner);

    /// Prepares the object to exit this state.
    /// @param owner: Object that is exiting this state
    override void exit(void* owner);

    /// Process the provided user input.
    /// @param userInput: Struct with the current user input information
    override void processUserInput(const UserInput* userInput);
}

[...]

#endif
```

<div class="codecaption">
    <span class="filepath">
        source/States/PongState/PongState.h
    </span>
</div>

> **Note**: _PongManager.h_ will end up being included multiple times in the same compilation unit by the transpiler since it has to have access to the contents in _PongManager.c_ and in _PongState.h_. This will cause redefining errors during the link stage of the building process. To prevent such errors, a common technique is to embed all declarations in all header files inside the following preprocessor directives:

```cpp
#ifndef SOME_CLASS_H_
#define SOME_CLASS_H_

[...]

#endif
```

The instantion of the `PongManager` should happen in `PongState::enter`:

```cpp
[...]

void PongState::enter(void* owner __attribute__((unused)))
{
    [...]

    // Create the Pong game controller
    this->pongManager = new PongManager(this->stage);
}
```

<div class="codecaption">
    <span class="filepath">
        source/States/PongState/PongState.c
    </span>
</div>

While its destruction should happen in `PongState::exit`:

```cpp
void PongState::exit(void* owner __attribute__((unused)))
{
    if(!isDeleted(this->pongManager))
    {
        delete this->pongManager;
    }

    this->pongManager = NULL;

    [...]

    Base::exit(this, owner);
}

[...]

void PongState::constructor()
{
    // Always explicitly call the base's constructor
    Base::constructor();

    this->pongManager = NULL;
}
```

<div class="codecaption">
    <span class="filepath">
        source/States/PongState/PongState.c
    </span>
</div>

The `PongManager` class will be very simple. Apart from receiving in its constructor the `PongState`'s [Stage](/documentation/api/class-stage/) instance so it can retrieve the disk to know when it gets out of the screen, it will have a couple of attributes to keep track of the score. Create the files _PongManager.h_ and _PongManager.c_ in _source/Managers/PongManager/_.

```cpp
#include <ListenerObject.h>
#include <Stage.h>

class PongManager : ListenerObject
{
	/// @privatesection

	/// Scoring
	uint32 leftScore;
	uint32 rightScore;

	/// @publicsection

	/// Class' constructor
	void constructor(Stage stage);

	/// Class' destructor
	void destructor();
}
```

<div class="codecaption">
    <span class="filepath">
        source/Managers/PongManager/PongManager.h
    </span>
</div>

In the constructor's implementation, initialize the variables for the score:

```cpp
#include "PongManager.h"

void PongManager::constructor(Stage stage)
{
    // Always explicitly call the base's constructor
    Base::constructor();

    this->leftScore = 0;
    this->rightScore = 0;

    PongManager::printScore(this);
}

void PongManager::destructor()
{
    // Always explicitly call the base's destructor
    Base::destructor();
}

[...]

void PongManager::printScore()
{
	Printer::int32(this->leftScore, 24 - 3, 0, NULL);
	Printer::int32(this->rightScore, 24 + 3, 0, NULL);
}
```

<div class="codecaption">
    <span class="filepath">
        source/Managers/PongManager/PongManager.c
    </span>
</div>

## Event Listeners

You should have already noticed that the disk moves back to the center of the screen after it has left it. This is the engine's streaming kicking in, which is implemented by the [Stage](/documentation/api/class-stage/) class. It is constantly checking which [Actors](/documentation/api/class-actor/) are out of bounds -within a tolerance margin configurable in the [StageSpec](/documentation/api/struct-stage-spec/)- to remove and destroy those that are beyond them, and is continually testing the entries in the **PongStageActors** array too, in order to instantiate those [Actors](/documentation/api/class-actor/) that are within the screen bounds. This behavior can be modified by setting to `true` the flag in the entries of the **PongStageActors** array, but we will leave it as it is to avoid the need of writing code to detect when the disk abandons the screen and to move it back to the center of it.

Since we know that the disk is being continually destroyed and created, we could exploit that to keep track of the score, we just need to know about both events. The way to do that is to add event listeners for them: `kEventActorDeleted` and `kEventActorCreated`.

To listen for the event when the disk is deleted, a listener has to be added on it. That is easy enough for the first instance of `Disk` that can be retrieved from the [Stage](/documentation/api/class-stage/) passed to the `PongManager`'s constructor. But it is not so easy to know about when a new instance is spawned because a listener cannot be added to instances of `Disk` that have not been created yet. So, we have to instruct the [Stage](/documentation/api/class-stage/) to add the listener for us when the instance is ready by calling [Stage::addActorLoadingListener](/documentation/api/class-stage/), which will take care of adding the listener to the [Actor](/documentation/api/class-actor/) that has been created:

```cpp
#include <string.h>

[...]

void PongManager::constructor(Stage stage)
{
    // Always explicitly call the base's constructor
    Base::constructor();

    this->leftScore = 0;
    this->rightScore = 0;

    PongManager::printScore(this);

    if(!isDeleted(stage))
    {
        Actor disk = Actor::safeCast(Stage::getChildByName(stage, (char*)"Disk", false));

        if(!isDeleted(disk))
        {
            Actor::addEventListener(disk, ListenerObject::safeCast(this), kEventActorDeleted);
        }

        Stage::addActorLoadingListener(stage, ListenerObject::safeCast(this));
    }
}
```

<div class="codecaption">
    <span class="filepath">
        source/Managers/PongManager/PongManager.c
    </span>
</div>

The next step is to process the events that the manager is listening for. To do so, the `PongManager` has to override the [ListenerObject::onEvent](/documentation/api/class-stage/) method:

```cpp
class PongManager : ListenerObject
{
    [...]

    /// Process an event that the instance is listen for.
    /// @param eventFirer: ListenerObject that signals the event
    /// @param eventCode: Code of the firing event
    /// @return False if the listener has to be removed; true to keep it
    override bool onEvent(ListenerObject eventFirer, uint16 eventCode);

    [...]
}
```

<div class="codecaption">
    <span class="filepath">
        source/Managers/PongManager/PongManager.h
    </span>
</div>

And in its implementation, it has to process both events as follows:

```cpp
bool PongManager::onEvent(ListenerObject eventFirer, uint16 eventCode)
{
    switch(eventCode)
    {
        case kEventActorDeleted:
        {
            if(0 == strcmp("Disk", Actor::getName(eventFirer)))
            {
                if(0 < Actor::getPosition(eventFirer)->x)
                {
                    this->leftScore++;
                }
                else
                {
                    this->rightScore++;
                }

                PongManager::printScore(this);
            }

            return false;
        }

        case kEventActorCreated:
        {
            if(0 == strcmp("Disk", Actor::getName(eventFirer)))
            {
                Actor::addEventListener(eventFirer, ListenerObject::safeCast(this), kEventActorDeleted);
            }

            return true;
        }
    }

    return Base::onEvent(this, eventFirer, eventCode);
}
```

<div class="codecaption">
    <span class="filepath">
        source/Managers/PongManager/PongManager.c
    </span>
</div>

When processing the `kEventActorDeleted` event, we check if the object that fired the event's name is "Disk" and, if so, proceed to decide to which side assign the point by checkings its X position.

The processing of `kEventActorCreated` involves checking the firer of the event's name to make sure that we are going to listen for the destruction of the new disk.

The method `onEvent` has to return a boolean value. When it returns `true` the listener will be kept; otherwise, if it returns `false`, the listener will be removed after the method returns.

## Printing

We already put in place the code to print the score by implementing `PongManager::printScore`. But the first time that either side scores a point, you will have probably noticed that the wrong score values are shown on the screen. This happens because the [CharSet](/documentation/api/class-char-set/) that is used for printing is loaded after the disk's [CharSet](/documentation/api/class-char-set/) and, when the latter is destroyed for the first time, CHAR memory gets defragmented by the [CharSetManager](/documentation/api/class-char-set-manager/), causing the [Printer](/documentation/api/class-printer/)'s [CharSet](/documentation/api/class-char-set/) to be moved in CHAR memory and this requires that any text that used it to be printed again.

The [Printer](/documentation/api/class-printer/) fires the `kEventFontRewritten` when its [CharSets](/documentation/api/class-char-set/) get defragmented. So, we just need to listen for it and react appropriately:

```cpp
#include <Printer.h>

[...]

void PongManager::constructor(Stage stage)
{
    [...]

    Printer::addEventListener(Printer::getInstance(), ListenerObject::safeCast(this), kEventFontRewritten);
}

[...]

bool PongManager::onEvent(ListenerObject eventFirer, uint16 eventCode)
{
    switch(eventCode)
    {
        [...]

        case kEventFontRewritten:
        {
            PongManager::printScore(this);

            return true;
        }

    [...]
}
```

<div class="codecaption">
    <span class="filepath">
        source/Managers/PongManager/PongManager.c
    </span>
</div>

This problem could have been solved by preloading the font by listing it in the [StageSpec](/documentation/api/struct-stage-spec/)'s fonts array, which would have ensured that the font's [CharSets](/documentation/api/class-char-set/) is loaded at the begining of CHAR memory space so it is not defragmented. But because we are not specifying a font for the score printing, there is nothing to preload and the engine falls back to load a default one on demand.

In the next and final step of this tutorial, let's round things off by adding some [sound and rumble effects](/documentation/tutorial/sound-and-rumble/) <i class="fa fa-arrow-right"></i>.
