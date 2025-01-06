---
layout: documentation
title: Introduction
---

# Virtual C

Virtual C is the name of a custom C++-like syntax that we developed to support some Object Oriented Programming features in VUEngine.

It consist of a set of scripts that act together as a transpiler that converts code writen in Virtual C to standard C.

## Features

Virtual C supports the following usual OOP features:

- <a href="../syntax/">Classes</a>
- <a href="../features/#Inheritance">Inheritance</a>
- <a href="../features/#encapsulation">Encapsulation</a>
- <a href="../features/#polymorphism">Polymorphism</a>

And adds a few features of its own:

- <a href="../custom-features/#abstract-classes">Abstract classes</a>
- <a href="../custom-features/#singleton-classes">Singleton classes</a>
- <a href="../custom-features/#static-classes">Static classes</a>
- <a href="../custom-features/#class-extensions">Class extensions</a>
- <a href="../custom-features/#class-mutation">Class mutation</a>
- <a href="../custom-features/#instance-evolving">Instance evolution</a>

## Limitations

Virtual C doesn't support all of the common OOP concepts or common features of full blown OOP languages. Among those unsupported are:

- Multiple inheritance
- Public or private attributes
- Protected methods
- Stack allocated class instances
- Method/operator overloading

In Virtual C, all attributes are protected; while all methods are either public or private.

Another limitation is that all class instances have to be dynamically allocated, there can no be instances allocated in the stack.
