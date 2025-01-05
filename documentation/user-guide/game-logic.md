---
layout: documentation
title: Game Logic
---

# Game Logic

## Update

Most likely, any game will run inside an infinite loop that starts after some previous initialization and that only breaks when the program is going to finish. VUEngine games work the same, but the loop where the actual game’s logic runs (not to confuse it with the loop that the engine’s core runs in as part of the cycle that loops over the engine’s subsystems like physics simulations, rendering, etc.) is implemented as an iterative call to the VUEngine instance’s current `GameState`’s execute method.

The `GameState`’s implementation of the execute method calls `Stage::update` on its `Stage`’s instance, which in turn forwards that call to its children’s implementation.

You have to provide to the engine at least one instance of class deriving from `GameState`. And most likely than not, it will override the execute method to implement the game’s specific logic.

```cpp
void ActorsState::execute(void* owner __attribute__((unused)))
{
    Base::execute(this, owner);

    if(!isDeleted(this->leaderPunk))
    {
        ActorsState::movePunks(this);
        ActorsState::printPunkName(this, this->leaderPunk, 25);
    }

    if(this->showAdditionalDetails)
    {
        ActorsState::showAdditionalDetails(this);
    }
}
```

By overriding the execute method, the `ActorsState::execute` method in the above example will be called once per game frame once the `VUEngine` instance’s `StateMachine` enters that state. And by forwarding the call to the base’s implementation, any class deriving from `Actor` that overrides its update method will be called once per frame too:

```cpp
void CogWheel::update()
{
    Rotation localRotation = this->localTransformation.rotation;
    localRotation.z += __I_TO_FIXED(1);

    CogWheel::setLocalRotation(this, &localRotation);
}
```

## Actor initialization

The instantiation and initialization of instance of `Actor` comprises, among other phases, the attachment of `Component`s to them. To save on performance, that doesn't happen immediately during construction. In many circumstances, it is necessary to execute some processes when an `Actor` is ready after initialization but before it starts to being updated. The engine calls the virtual method `Actor::ready` when the initialization is complete. Client code can override that method to performe custom procedures. The method's signature to override it is:

```cpp
	/// Make the localized actor ready to start operating once it has been completely intialized.
	/// @param recursive: If true, the ready call is propagated to its children, grand children, etc.
	override void ready(bool recursive);
```

The override must always call the base's implementation.