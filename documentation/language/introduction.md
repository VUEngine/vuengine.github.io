---
layout: documentation
parents: Documentation > Language
title: Introduction
---

# Virtual C

Virtual C is the name of a custom C++-like syntax that we developed to support some Object Oriented Programming features in [VUEngine](https://github.com/VUEngine/VUEngine-Core).

It consist of a set of scripts that act together as a transpiler that converts code writen in Virtual C to standard C.

## Features

Virtual C supports the following usual OOP features:

- [Classes](../syntax/)
- [Inheritance](../features/#Inheritance)
- [Encapsulation](../features/#encapsulation)
- [Polymorphism](../features/#polymorphism)

And adds a few features of its own:

- [Abstract classes](../custom-features/#abstract-classes)
- [Singleton classes](../custom-features/#singleton-classes)
- [Static classes](../custom-features/#static-classes)
- [Class extensions](../custom-features/#class-extensions)
- [Class mutation](../custom-features/#class-mutation)
- [Instance mutation](../custom-features/#instance-mutation)

## Limitations

Virtual C doesn't support all of the common OOP concepts or common features of full blown OOP languages. Among those unsupported are:

- Multiple inheritance
- Public or private attributes
- Protected methods
- Stack allocated class instances
- Method/operator overloading

In Virtual C, all attributes are protected; while all methods are either public or private.

Another limitation is that all class instances have to be dynamically allocated, there can no be instances allocated in the stack.
