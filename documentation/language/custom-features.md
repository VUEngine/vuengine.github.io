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
- `mutation`

### Abstract classes

The `abstract` class modifier prevents the creation of class instances through the `new` keyword, without the requirement of there being at least one pure virtual method.

### Singleton classes

The language support the declaration of classes that can only have a single instance and adds automatically the necessary code to prevent more than one instantiation.

The singleton classes' instances are allocated in the stack.

Since singletons are globally accesible, they put at risk the stability of the program by being modifiable from anywhere. So, it is important to have some mechanism to help preventing as much as possible such modifications.

The transpiler adds the `secure` keyword to decorate non static methods of singleton classes that should not be called but by specific classes.

```cpp
secure void SomeSingletonClass::someMethod()
{
    [...]
}
```

Then, to restrict from were it is legal to call such method, an array of classes must be defined globally in non volatitle memory:

```cpp
const ClassPointer SomSingletonClassAuthorizedClasses[] =
{
    typeofclass(SomeOtherClassA),
    typeofclass(SomeOtherClassB),
    NULL
};
```

Finally, the following method must be called where appropriate:

```cpp
SomeSingletonClass::secure(&SomSingletonClassAuthorizedClasses);
```

After `SomeSingletonClass::secure` has been called with a non empty array of classes, if any other class besides those listed in the array tries to call `SomeSingletonClass::someMethod`, an exception like the following will be triggered:

<a href="/documentation/images/language/custom-features/singleton-security.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Illegal method access"><img src="/documentation/images/language/custom-features/singleton-security.png" width="500" /></a><br/>
_Illegal access to secure method_

There are some limitations due to the fact that globality cannot really be so easily defeated. And this contraption doesn't pretend to achieve that. Instead, it is a tool to help preventing potentially dangerous code paths when developing programs using Virtual C.

### Dynamic Singleton classes

These kind of singletons are dynamically allocated, hence not in the stack. Their destruction is optional, but they are usually manually deleted when not necessary to save on memory. In every other aspect, they are just like normal singletons.

### Static classes

Static classes cannot have instances. All their methods are static.

### Extensions classes

Classes can be extended through the use of the `extension` keyword. They provided a mechanism to achieve something like runtime method re-implementation on specific virtual methods. Extension classes don't have to, and cannot, provide a constructor and destructor.

Given some class:

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
extension class SomeClassExtension : SomeBaseClass
{
    [...]

    bool someVirtualMethodOverride();

    [...]
};
```

Entensions classes are meant to provide a mechanism to change at runtime the implementation of a virtual method affecting all the instances of the original class immediately. 

To mutate a virtual method, use the following syntax:

```cpp
    SomeClass::mutateMethod(someVirtualMethod, SomeClassExtension::someVirtualMethodOverride);
```

### Mutation classes

Virtual C implements polymorphism by adding a virtual table pointer to each object, which means that it can be manipulated in real time. Mutation classes permit to override or to extend a class' functionality by allowing an object's virtual table pointer to change its target in runtime, making the instance subject to different implementations of virtual methods or capable of reacting to new methods provided by the mutation class. These classes have the following constraints:

- They have to inherit from a non abstract class
- They have to be data-invariant with respect to the base class (ie: they cannot add attributes of their own)
- They cannot provide a constructor or destructor
- They cannot be directly instantiated

Mutation classes are declared as shown below:

```cpp
#include <SomeClass.h>

mutation class AMutationOfSomeClass : SomeClass
{
    [...]

    override void someMethod();

    void someNewMethod();
}
```

Their implementation must contain the following:

```cpp
#include <AMutationOfSomeClass.h>

mutation class AMutationOfSomeClass;

void AMutationOfSomeClass::someMethod()
{
    [...]
}

void AMutationOfSomeClass::someNewMethod()
{
    [...]
}
```

The mutation of an instance of a class is done as follows:

```cpp
    SomeClass::mutateTo(someClassObject, AMutationOfSomeClass::getClass());
```
