---
layout: documentation
parents: Documentation > Language
title: Features
---

# Features

## Inheritance

The base class of Virtual C is called [Object](/documentation/api/class-object/), which declares and implements a minimal interface:

```cpp
/// Class Object
///
/// Inherits from Object
///
/// Serves as the base class for all other classes in the engine.
abstract class Object : Object
{
    /// @protectedsection
    // The unusual order of the attributes in the rest of the classes
    // aims to optimize data packing as much as possible.

    /// Pointer to the class's virtual table
    void* vTable;

    /// @publicsection

    /// Cast an object at runtime to a give class.
    /// @param object: Object to cast
    /// @param targetClassGetClassMethod: pointer to the target class' identifier method
    /// @param baseClassGetClassMethod: pointer to the object's base class' identifier method
    /// @return Pointer to the object if the cast succeeds, NULL otherwhise.
    static Object getCast(void* object, ClassPointer targetClassGetClassMethod, ClassPointer baseClassGetClassMethod);

    /// Class' constructor
    void constructor();

    /// Retrieve the object's virtual table pointer
    /// @return Pointer to the object's virtual table pointer
    const void* getVTable();

    /// Converts the object into an instance of the target class if object's class is in the hierarchy of the target class.
    /// @param targetClass: pointer to the target class' virtual table
    /// @return True if successful
    bool mutateTo(const void* targetClass);
}
```

[Object](/documentation/api/class-object/) is abstract, so it cannot be instantiated. And it inherits from itself. It supports RTTI by means of its `getCast` method, which allows to perform safe up and down castings at runtime.

Any new class must always inherit from the [Object](/documentation/api/class-object/) class or from another class that ultimately inherits from it.

## Encapsulation

Encapsulation support is implicitly implemented and fixed, in other words, there are no keywords to modify the access to attributes or methods. It is restricted to the following constraints:

- Methods are either public or private, there are no protected methods.
- Attributes are always protected, there are not public or private attributes.

## Polymorphism

Dynamic or late dispatching is achieved by the custom implementation of virtual tables that are configurable at runtime.

Methods that support late dispatching must be declared as `virtual` and they can optionally be pure, which is achieved following C++ conventions.
