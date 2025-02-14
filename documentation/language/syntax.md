---
layout: documentation
parents: Documentation > Language
title: Syntax
---

# Syntax

## Class declaration

New classes are declared in header files (.h) and they follow a syntax similar to C++':

```cpp
/// Class NewClass
///
/// Inherits from Object
///
/// Sample class.
[modifier] class NewClass : Object
{
    /// @protectedsection

    /// Custom attribute
    uint32 someAttribute;

    /// @publicsection

    /// Class' constructor
    void constructor();

    /// Class' destructor
    void destructor();

    /// Some sample method
    void someMethod();
};
```

## Instantiation

Class are instances through the use of the `new` keyboard. Memory management is the responsibility of the code that allocates the object:

```cpp
SomeClass someClassObject = new SomeClass();

[...]

delete someClassObject;
```

Structs can be dynamically allocated too:

```cpp
typedef SomeStruct
{
    uint32 someAttribute;

} SomeStruct;

SomeStruct someStruct = new SomeStruct;
```

## Virtual Methods

Virtual and pure virtual methods are declared as follows:

```cpp
virtual void normalVirtualMethod();

virtual void pureVirtualMethod() = 0;
```

## Method invocation

Method invocation differs from C++ in the sense that there is no support for the syntax `object.method()` nor `object->method`. Instead, they follow a mashup between C' and C++' syntax, in which the first argument for non static methods is always the pointer to the instance of the class:

```cpp
SomeClass::method(someClassInstance, argument1, argument2, ...);
```

## Method implementation

Non static methods implicitly declare a `this` pointer to the object passed as the first argument the method's invocation:

```cpp
void SomeClass::method(uint32 argument1, uint32 argument2, ...)
{
    this->attribute1 = argument1;
}
```

There is no support for implicit referring to class attributes without the usage of the `this->attribute` expression.
