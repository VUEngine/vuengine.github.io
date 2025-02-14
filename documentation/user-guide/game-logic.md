---
layout: documentation
parents: Documentation > User Guide
title: Game Logic
---

# Game Logic

## Update

Most likely, any game will run inside an infinite loop that starts after some previous initialization and that only breaks when the program is going to finish. [VUEngine](https://github.com/VUEngine/VUEngine-Core) games work the same, but the loop where the actual game’s logic runs (not to confuse it with the loop that the engine’s core runs in as part of the cycle that loops over the engine’s subsystems like physics simulations, rendering, etc.) is implemented as an iterative call to the [VUEngine](/documentation/api/class-v-u-engine/) instance’s current [GameState](/documentation/api/class-game-state/)’s update method, which in turn calls [GameState::execute](/documentation/api/class-game-state/) for the game to implement custom logic that gets processed in each game cycle.

The [GameState::update](/documentation/api/class-game-state/) method calls `Stage::update` on its [Stage](/documentation/api/class-stage/)’s instance, which in turn forwards that call to its children’s implementation of that method:

```cpp
void SomeActor::update()
{
    Rotation localRotation = this->localTransformation.rotation;
    localRotation.z += __I_TO_FIXED(1);

    SomeActor::setLocalRotation(this, &localRotation);
}
```

You have to provide to the engine at least one instance of a class deriving from [GameState](/documentation/api/class-game-state/). And most likely than not, it will override the execute method to implement the game’s specific logic.

```cpp
void SomeGameState::execute(void* owner __attribute__((unused)))
{
    Base::execute(this, owner);

    // Do interesting stuff
    [...]
}
```

By overriding the execute method, the `SomeGameState::execute` method in the above example will be called once per game frame from the moment that the [VUEngine](/documentation/api/class-v-u-engine/) instance’s [StateMachine](/documentation/api/class-state-machine/) enters that state. 

## Actor initialization

The instantiation and initialization of [Actor](/documentation/api/class-actor/) instances comprises, among other phases, the attachment of [Components](/documentation/api/class-component/) to them. To prevent CPU usage spikes during the instantiation of complex [Actors](/documentation/api/class-actor/), [Stages](/documentation/api/class-stage/) can be configured to defer the attachment of [Components](/documentation/api/class-component/) over time, therefore, [Actors](/documentation/api/class-actor/) are not necesarilly ready to be manipulated after their construction. But in many circumstances, it is necessary to execute some processes when an [Actor](/documentation/api/class-actor/) is ready after initialization and before it starts to be updated. The engine calls the virtual method `Actor::ready` when the initialization is complete so the client code can perform custom procedures on it. The method's signature to override it is:

```cpp
/// Make the localized actor ready to start operating once it has been completely intialized.
/// @param recursive: If true, the ready call is propagated to its children, grand children, etc.
override void ready(bool recursive);
```

The override must always call the base's implementation.
