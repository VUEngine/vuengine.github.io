---
layout: documentation
parents: Documentation > Tutorial
title: Pong Manager
---

# Pong Manager

It is time to make the paddles controllable by the player. To do so, we are going to implement a class that will manage the paddles and the disk to separate the actual game's logic from the `PongState`, since the [GameState](/documentation/api/class-game-state/) is more a proxy between the former and the [VUEngine](https://github.com/VUEngine/VUEngine-Core).

The `PongManager` class will be very simple at first. It will have attributes to reference the disk and the paddles; and will receive in its constructor the `PongState`'s [Stage](/documentation/api/class-stage/) instance so we can retrieve their pointers:

```cpp
#include <Actor.h>
#include <ListenerObject.h>
#include <Stage.h>

class PongManager : ListenerObject
{
    /// @privatesection

    /// The pong disk
    Actor disk;

    /// Paddles
    Actor leftPaddle;
    Actor rightPaddle;

    /// @publicsection

    /// Class' constructor
    void constructor(Stage stage);

    /// Class' destructor
    void destructor();
}
```

In the constructor's implementation, we will retrieve the 3 elements by calling [Stage::getChildByName](/documentation/api/class-stage/) and passing to it the names of the [Actors](/documentation/api/class-actor/) that we are interested in:

```cpp
#include "PongManager.h"

void PongManager::constructor(Stage stage)
{
    // Always explicitly call the base's constructor
    Base::constructor();

    if(!isDeleted(stage))
    {
        this->disk = Disk::safeCast(Stage::getChildByName(stage, (char*)"Disk", false));
        this->leftPaddle = Paddle::safeCast(Stage::getChildByName(stage, (char*)"PadL", true));
        this->rightPaddle = Paddle::safeCast(Stage::getChildByName(stage, (char*)"PadR", true));
    }
    else
    {
        this->disk = NULL;
        this->leftPaddle = NULL;
        this->rightPaddle = NULL;
    }
}
```

But the [Actors](/documentation/api/class-actor/) have not been named yet. To do so, lets head back to the *PongStageSpec.c* file and name the [ActorSpecs](/documentation/api/struct-actor-spec/):

```cpp
PositionedActorROMSpec PongStageActors[] =
{	
    {&DiskActorSpec,                {0, 0, 0},      {0, 0, 0}, {1, 1, 1}, 0, "Disk", NULL, NULL, false},
    {&PaddleActorSpec,              {-180, 0, 0},   {0, 0, 0}, {1, 1, 1}, 0, "PadL", NULL, NULL, false},
    {&PaddleActorSpec,              {180, 0, 0},    {0, 0, 0}, {1, 1, 1}, 0, "PadR", NULL, NULL, false},
    {&LowPowerIndicatorActorSpec,   {-184, 108, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},

    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};
```

Now that he have references to the disk and the paddles, it is time to make them move.
