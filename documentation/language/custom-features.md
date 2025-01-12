---
layout: documentation
parents: Documentation > Language
title: Custom Features
---

# Custom Features

Virtual C adds a couple features of its own, thanks to the fact that it manipulates virtual tables directly.

## Class modifiers

There are a few optional class modifiers that can be added to a class declaration:

```cpp
[modifier] class ClassName: Object
{};
```

The class modifiers are:

- `abstract`
- `singleton`
- `dynamic_singleton`
- `static`
- `extension`

### Abstract classes

The `abstract` class modifier prevents the creation of class instances through the `new` keyword, without the requirement of there being at least one pure virtual method.

### Singleton classes

The language implements support to declare classes that can only have a single instance and adds automatically the necessary code to support it and to prevent more than one instantiation.

The singleton classes' instances are allocated in the stack.

Since singletons are globally accesible, they put at risk the stability of the program by being modifiable from anywhere. So, it is important to have some mechanism to help preventing such modifications if where possible.

The transpiler adds the `secure` keyword to decorate non static methods of singleton classes that should not be called but by specific classes.

```cpp
secure void SomeSingletonClass::someMethod()
{
    [...]
}
```

Then, to restrict from were it is legal to call such method, the array must be defined globally in non volatitle memory:

```cpp
const ClassPointer SomSingletonClassAuthorizedClasses[] =
{
    typeofclass(SomeOtherClassA),
    typeofclass(SomeOtherClassB),
    NULL
};
```

And then, the following method must be called where appropriate:

```cpp
	SomeSingletonClass::secure(&SomSingletonClassAuthorizedClasses);
```

If any other class besides those listed in `SomSingletonClassAuthorizedClasses` tries to call `SomeSingletonClass::someMethod`, an exception like the following will be triggered:

         /documentation/images/language/custom-features/singleton-security.png
<a href="/documentation/images/language/custom-features/singleton-security.png" data-toggle="lightbox" data-gallery="gallery" data-caption="CHAR Inspector"><img src="/documentation/images/language/custom-features/singleton-security.png" width="500" /></a><br/>
_Illegal access to secure method_

### Dynamic Singleton classes

These kind of singletons are dynamically allocated, hence not in the stack. Their destruction is optional, but they are usually manually deleted when not necessary to save on memory.

### Static classes

Static classes cannot have instances. All their methods are static.

## Class extensions

Classes can be extended through the use of the `extension` keyword. They provided a mechanism to achieve runtime method overloading on virtual methods.

Give some class:

```cpp
class SomeClass : SomeBaseClass
{
    [...]

    void someMethod();

    virtual bool someVirtualMethod();

    [...]
};
```

The syntax to declare an extension for it is the following:

```cpp
extension class SomeClass : SomeBaseClass
{
    [...]

    bool someVirtualMethodOverride();

    [...]
};
```

## Class Mutation

Virtual C allows the modification in real time of a class' virtual table by changing the pointers to the virtual methods. This enables the possibility to change the behavior of all the class' instances simultaneously.

Having a class that declares a `virtual` method or overrides one:

```cpp
class SomeClass : SomeBaseClass
{
    [...]

    virtual void someVirtualMethod();

    [...]
}
```

It is possible to change at runtime the implementation of a virtual method that is called on all the class instances, by writing the following call to `mutateMethod` with another implementation of the same signature:

```cpp
void SomeClass::changeDoRenderImplementation()
{
    SomeClass::mutateMethod(someVirtualMethod, SomeClass::someVirtualMethodOverride);
}

//——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

void SomeClass::someVirtualMethodOverride()
{
    // Do stuff differently
}
```

## Instance mutation

It is possible to modify the behavior of individual instances by means of the `mutateTo` method call. This effectively provides a language-level mechanism for state machines.

Objects can only evolve to classes that either inherint from the object's original class or to those from which the object's original class inherits.

Classes that are meant to be mutation targets must be abstract and cannot add additional attributes to its instances.

Given the following class:

```cpp
class SomeClass : SomeBaseClass
{
    [...]

    virtual void someVirtualMethod();

    [...]
}
```

A valid mutation for it is:

```cpp
abstract class SomeClassMutation : SomeClass
{
    [...]

    override void someVirtualMethod();

    [...]
}
```

The mutation of a class instance is done as follows:

```cpp
SomeClass::mutateTo(object, SomeClassMutation::getClass());
```
