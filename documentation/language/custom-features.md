---
layout: documentation
title: Custom Features
---

# Virtual C's Custom Features

Virtual C adds a couple features of its own, thanks to the fact that it makes direct manipulation of virtual tables.

## Class modifiers

There are a few optional class modifiers that can be added to a class declaration:

```cpp
    [modifier] class ClassName: Object
    {};
```

The class modifiers are:

* `abstract`
* `singleton`
* `dynamic_singleton`
* `static`
* `extension`

### Abstract classes

The `abstract` class modifier prevents the creation of class instances through the `new` keyword.

### Singleton classes

The language implements support to declare classes that can only have a single instance and adds automatically the necessary code to support it and to prevent more than one instantiation.

The singleton classes' instances are allocated in the stack.

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
    .
    .
    .
    void someMethod();
    virtual bool someVirtualMethod();
};
```

The syntax to declare an extension for it is the following:

```cpp
extension class SomeClass : BaseClass
{
    bool someVirtualMethodOverride();
    .
    .
    .
};
```

## Class Mutation

Virtual C allows the modification in real time of a class' virtual table ny changing the pointers to the virtual methods. This enables the possibility to change the behavior of all the class' instances simultaneously.

The following shows how to mutate a class' method:

```cpp
    SomeClass::mutateMethod(someVirtualMethod, SomeClass::someVirtualMethodOverride);
```

## Instance evolution

It is possible to modify the behavior of individual instances by means of the `evolveTo` method call. This effectively provides a language-level mechanism for state machines.

Objects can only evolve to classes that either inherint from the object's original class or to those from which the object's original class inherits.

Classes that are meant to be evolutionary targets must be abstract and cannot add additional attributes to its instances.

The evolution of a class instance is done as follows:

```cpp
    SomeClass::evolveTo(someClassObject, SomeInheringClass::getClass());
```