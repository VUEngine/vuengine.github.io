---
layout: documentation
title: Custom Features
---

# Custom Features

Virtual C adds a couple features of its own, thanks to the fact that it makes direct manipulation of virtual tables.

## Class modifiers

There are a few optional class modifiers that can be added to a class declaration:

```cpp
[modifier] class ClassName: Object
{};
```

The class modifiers are:

- `abstract`
- `singleton`
- `singleton!`
- `dynamic_singleton`
- `static`
- `extension`

### Abstract classes

The `abstract` class modifier prevents the creation of class instances through the `new` keyword, without the requirement of there being at least one pure virtual method.

### Singleton classes

The language implements support to declare classes that can only have a single instance and adds automatically the necessary code to support it and to prevent more than one instantiation.

The singleton classes' instances are allocated in the stack.

The `singleton!` modifier makes the class instance inaccessible from the outside by making the `getInstance` method's linkage non global. 

### Dynamic Singleton classes

These kind of singletons are dynamically allocated, hence not in the stack. Their destruction is optional, but they are usually manually deleted when not necessary to save on memory.

### Static classes

Static classes cannot have instances. All their methods are static.

## Class extensions

Classes can be extended through the use of the `extension` keyword. They provided a mechanism to achieve runtime method overloading on virtual methods.

Give some class:

```cpp
class SomeClass : BaseClass
{
    uint32 someAttribute;

    [...]

    void someMethod();
    virtual bool someVirtualMethod();
};
```

The syntax to declare an extension for it is the following:

```cpp
extension class SomeClass : BaseClass
{
    bool someVirtualMethodOverride();

    [...]

};
```

## Class Mutation

Virtual C allows the modification in real time of a class' virtual table ny changing the pointers to the virtual methods. This enables the possibility to change the behavior of all the class' instances simultaneously.

Having a class that declares a `virtual` method or overrides one:

```cpp
class CustomSprite : Sprite
{
    .
    .
    .
	/// Render the sprite by configuring the DRAM assigned to it by means of the provided index.
	/// @param index: Determines the region of DRAM that this sprite is allowed to configure
	/// @return The index that determines the region of DRAM that this sprite manages
	override int16 doRender(int16 index) = 0;
    .
    .
    .
}
```

It is possible to change at runtime the implementation of `handlePropagatedMessage` that is called on all the class instances by writing the following call to `mutateMethod` to another implemntation wih the same signature:

```cpp
void CustomSprite::changeDoRenderImplementation()
{
    CustomSprite::mutateMethod(doRender, CustomSprite::doRenderCustomImplementation);
}

//——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

int16 CustomSprite::doRenderCustomImplementation(int16 index)
{
    // Do stuff
}
```

## Instance mutation

It is possible to modify the behavior of individual instances by means of the `mutateTo` method call. This effectively provides a language-level mechanism for state machines.

Objects can only evolve to classes that either inherint from the object's original class or to those from which the object's original class inherits.

Classes that are meant to be mutation targets must be abstract and cannot add additional attributes to its instances.

Given the following class:

```cpp
class Punk : Actor
{
    /// @param punkSpec: Specification that determines how to configure the paddle
    /// @param internalId: ID to keep track internally of the new instance
    /// @param name: Name to assign to the new instance
    void constructor(PunkSpec* punkSpec, int16 internalId, const char* const name);

    /// Default interger message handler for propagateMessage
    /// @param message: Propagated integer message
    /// @return True if the propagation must stop; false if the propagation must reach other containers
    override bool handlePropagatedMessage(int32 message);
    .
    .
    .
}
```

A valid mutation for it is:

```cpp
abstract class PunkStopping : Punk
{
    /// Process a newly detected collision by one of the component colliders.
    /// @param collisionInformation: Information struct about the collision to resolve
    /// @return True if the collider must keep track of the collision to detect if it persists and when it
    /// ends; false otherwise
    override bool collisionStarts(const CollisionInformation* collisionInformation);

    /// Receive and process a Telegram.
    /// @param telegram: Received telegram to process
    /// @return True if the telegram was processed
    override bool handleMessage(Telegram telegram);

    /// Update this instance's logic.
    override void update();
}
```

The mutation of a class instance is done as follows:

```cpp
Punk::mutateTo(punk, PunkStopping::getClass());
```
