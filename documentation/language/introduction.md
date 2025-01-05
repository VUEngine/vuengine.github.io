---
layout: documentation
title: Introduction
---

# Virtual C

Virtual C is the name of a custom C++-like syntax that we developed to support some Object Oriented Programming features in VUEngine.

It consist of a set of scripts that act together as a transpiler that converts code writen in Virtual C to standard C.

## Features

Virtual C supports the following usual OOP features:

* Classes
* Inheritance
* Encapsulation
* Polymorphism

It adds a few features of its own:

* Abstract classes
* Singleton classes
* Static classes
* Class extensions
* Class mutation
* Instance evolving

## Limitations

Virtual C doesn't support all of the common OOP concepts or common features of full blown OOP languages. Among those unsupported are:

* Multiple inheritance
* Public or private attributes
* Protected methods
* Stack allocated class instances
* Method/operator overloading

In Virtual C, all attributes are protected; while all methods are either public or private.

Another limitation is that all class instances have to be dynamically allocated, there can no be instances allocated in the stack.