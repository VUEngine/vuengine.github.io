---
layout: documentation
parents: Documentation > Tutorial
title: Pong Manager
---

# Pong Manager

It is time track the score of the game. To do so, we are going to implement a class that will serve to separate the actual game's logic from the `PongState`, since the [GameState](/documentation/api/class-game-state/) is more of a proxy between the game and the [VUEngine](https://github.com/VUEngine/VUEngine-Core).

Lets add a `PongManager` class that will handle the game's logic. At minimum, it requires to know when the disk goes out of the screen. And to know about the disk, it has to get a reference to it somehow. The way to do it is to retrieve it from the [Stage](/documentation/api/class-stage/), and since the later belongs to the `PongState`, it makes sense to make the `PongManager` an attribute of it. And since the `PongState` persist through the whole life cycle of the game by being a `singleton` class, it is better to create the `PongManager` when the engine enters the state and destroys it when it exists. So, override the `enter` and `exit` methods:

```cpp
#include <PongManager.h>
#include <Printer.h>

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
```

And the instantion of the `PongManager` should look like below:

```cpp
[...]

void PongState::enter(void* owner __attribute__((unused)))
{
    [...]

    // Create the Pong game controller
    this->pongManager = new PongManager(this->stage);
}
```

While we destroy it upon exiting the state:

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

The `PongManager` class will be very simple. Appart from receiving in its constructor the `PongState`'s [Stage](/documentation/api/class-stage/) instance so it can retrieve the disk, to know when it gets out of the screen, it will have a couple of attributes to keep track of the score:

```cpp
#include <KeypadManager.h>
#include <ListenerObject.h>
#include <Stage.h>

/// Class PongManager
///
/// Inherits from ListenerObject
///
/// Implements the logic of a simple pong game.
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

In the constructor's implementation, it will retrieve the the disk by calling [Stage::getChildByName](/documentation/api/class-stage/) and passing to it the names of the [Actor](/documentation/api/class-actor/) that we are interested in

```cpp
#include "PongManager.h"

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

[...]

void PongManager::printScore()
{
	Printer::int32(this->leftScore, 24 - 3, 0, NULL);
	Printer::int32(this->rightScore, 24 + 3, 0, NULL);
}
```

But the [Actors](/documentation/api/class-actor/) have not been named yet. To do so, lets head back to the *PongStageSpec.c* file and name the [ActorSpecs](/documentation/api/struct-actor-spec/):

```cpp
PositionedActorROMSpec PongStageActors[] =
{
    {&DiskActorSpec,                {0, 0, 0},      {0, 0, 0}, {1, 1, 1}, 0, "Disk", NULL, NULL, false},
    {&PaddleActorSpec,              {-180, 0, 0},   {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&PaddleActorSpec,              {180, 0, 0},    {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&LowPowerIndicatorActorSpec,   {-184, 108, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},

    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};
```

## Streaming

You would have already noticed that the disk moves back to the center of the screen after it has left the screen. This is the engine's streaming kicking in. This happens because the [Stage](/documentation/api/class-stage/) is constantly checking which [Actors](/documentation/api/class-actor/) are out of bounds -within a tolerance margin configurable in the [StageSpec](/documentation/api/struct-stage-spec/)- to remove and destroy those that are beyond them, and is continually testing the entries in the **PongStageActors** array too, in order to instantiate those [Actors](/documentation/api/class-actor/) that are within the screen bounds. This behavior can be modified by setting to `true` the flag in the entries of the **PongStageActors** array, but we will leave it as it is to avoid the need of writing code to detect when the disk abandons the screen and to move it back to the center of it. 

Since we know that the disk is being continually destroyed and created, we could exploit that to keep track of the score, we just need to know about both events. The way to do that is to add event listeners for two events: `kEventActorDeleted` and `kEventActorCreated`. 

To listen for the event when the disk is deleted, a listener has to be added on it. That is easy enough for the first instance of `Disk` that can be retrieved from the [Stage](/documentation/api/class-stage/) passed to the `PongManager`'s constructor. But it is not so easy to know about new instances since a listener cannot be added to instances of `Disk` that have not been created yet. So, we have to instruct the [Stage](/documentation/api/class-stage/) to add the listener when the instance is ready by calling [Stage::addActorLoadingListener](/documentation/api/class-stage/), which will take care of adding the listener when the [Actor](/documentation/api/class-actor/) has been created:

```cpp
void PongManager::constructor(Stage stage)
{
    // Always explicitly call the base's constructor
    Base::constructor();

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

And in its implementation, it has to process both events as follows:

```cpp
bool PongManager::onEvent(ListenerObject eventFirer __attribute__((unused)), uint16 eventCode)
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
            if(__GET_CAST(Actor, eventFirer))
            {
                if(0 == strcmp("Disk", Actor::getName(eventFirer)))
                {
                    Actor::addEventListener(eventFirer, ListenerObject::safeCast(this), kEventActorDeleted);
                }
            }

            return true;
        }
    }

    return Base::onEvent(this, eventFirer, eventCode);
}
```

When processing the `kEventActorDeleted` event, we check if the object that fired the event's name is "Disk" and, if so, proceed to decide to which side assign the point by checkings its X position.

The processing of `kEventActorCreated` involves downcasting the firer of the event to check the class which it is an instance of and checking its name to assign it to the proper pointer. And the event listener for the `kEventActorDeleted` has to be added to the new instance too, so the `PongManager` knows when this new instance is destroyed.

## Scoring 

We already put in place the code to pring the score by implementing `PongManager::pringScore`. But the first time that either side scores a point, you will have probably noticed that the wrong score values show in the screen. It is because the [CharSet](/documentation/api/class-char-set/) that is used for printing is loaded after the disk's [CharSet](/documentation/api/class-char-set/) and when the later is destroyed for the first time, CHAR memory gets defragmented by the [CharSetManager](/documentation/api/class-char-set-manager/), causing the printing [CharSet](/documentation/api/class-char-set/) to be defragmented, which requires the re-print any text.

The [Printer](/documentation/api/class-printer/) fires the `kEventFontRewritten` when its [CharSets](/documentation/api/class-char-set/) get defragmented. So, we just need to listen for it and react appropriately:

```cpp
void PongManager::constructor(Stage stage)
{
    [...]

    Printer::addEventListener(Printer::getInstance(), ListenerObject::safeCast(this), kEventFontRewritten);
}

[...]

bool PongManager::onEvent(ListenerObject eventFirer __attribute__((unused)), uint16 eventCode)
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