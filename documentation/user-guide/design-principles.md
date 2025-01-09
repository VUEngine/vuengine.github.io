---
layout: documentation
parents: Documentation > User Guide
title: Design Principles
---

# Design Principles

The engine has evolved over the years to implement the following patterns:

## Object Oriented Paradigm

Since the beginning of its development, VUEngine has implemented mechanisms to support the following 3 basic features that Object Oriented Programming proposes:

- Inheritance
- Encapsulation
- Polymorphism

Under the hood, these are implemented through a set of C macros that create the necessary boilerplate code. But in
order expose those features in a more friendly manner, we implemented a transpiler that converts, before compilation, code writen in a syntax close to that of C++'s, into standard C. We call our custom language Virtual C.

## State Machines

The core of the engine is the VUEngine singleton class. It represents the program as a whole and its state is managed through a `StateMachine` whose states must inherit from the `GameState` class.

Any VUEngine based program must provide a `GameState` for the VUEngine instance’s `StateMachine` to enter to in the game’s starting function:

```cpp
int32 game(void)
{
    // Start the game
    return VUEngine::start
    (
        GameState::safeCast(PrecautionScreenState::getInstance())
    );
}
```

In the state machine pattern implemented by the engine, the life cycle of any `State` consists of the following events:

```cpp
/// Prepares the object to enter this state.
/// @param owner: Object that is entering in this state
virtual void enter(void* owner);

/// Updates the object in this state.
/// @param owner: Object that is in this state
virtual void execute(void* owner);

/// Prepares the object to exit this state.
/// @param owner: Object that is exiting this state
virtual void exit(void* owner);

/// Prepares the object to become inactive in this state.
/// @param owner: Object that is in this state
virtual void suspend(void* owner);

/// Prepares the object to become active in this state.
/// @param owner: Object that is in this state
virtual void resume(void* owner);
```

Through the life of a program, the `VUEngine` instance will enter different `GameState`s, each representing a screen that is presented to the user for him to interact with.

`StateMachine`s can be used by other classes, they are not exclusive to the `VUEngine` class. `Actor`s, which are used to implement enemies, vehicles, etc., can use `StateMachine`s to define the logic that drives their behavior with custom states that inherit from the generic `State` class.

## Components

Lately, we have been changing the engine to fully embrace composition over inheritance as much as possible. It now provides a generic class, `Entity`, that represents a spatial transformation (position, rotation and scale) to which an arbitrary number of `Component`s can be attached. The following is the complete list of the kind of `Component`s that the engine currently supports:

```cpp
/// Component types
/// @memberof Component
enum ComponentTypes
{
	kSpriteComponent = 0,
	kColliderComponent,
	kPhysicsComponent,
	kWireframeComponent,
	kBehaviorComponent,

    // Limmiter
    kComponentTypes,
};
```

Each `Component` keeps a reference to the object that it attaches to and takes care of updating its internal state in order to always stay in sync with the state of the relevant properties of its owner. A `Sprite`, for example, computes its position on the screen during the rendering subprocess according to the transformation of its owner.

## Parenting

In all possible scenarios, the `VUEngine` instance will enter a `GameState` that must present something to the user to perceive. At the bare minimum, it will be either a visual or an audio object. Such objects are constructed and managed by a `GameState` through an instance of the `Stage` class. All the objects that belong to a `Stage` have to be instances of the `Actor` class. And both, it and the `Stage` class, inherit from the `Container` class, which is a special type of `Entity` that keeps a local transformation relative to that of another `Container` that acts as its parent.

Parenting allows easy transformation of whole sets of `Actor`s in a `Stage` by manipulating the parent of all of them. Think of a movable pop up with a couple of buttons in it: when the pop up moves, the buttons remain in their positions relative to it, which act as their parent, and this happens without having to manually keep track of the buttons’ absolute or global positions.

## Decoupling

Some of the earliest requirements and goals of the engine were to provide mechanisms that enable the developer to avoid tightly coupled game logic. Instead of requiring the implementation of bespoke methods that a class exposes to tackle specific requests or to poll for the status of certain conditions in other classes’ instances, the engine provides a `ListenerObject` class that can send and receive messages in the form of enums or strings, and can listen for or trigger events encoded in enums.

Messages can be sent directly to another `ListenerObject` when the target is known, or they can be propagated through the `Stage`’s children list.

A special kind of message, called command, can be propagated to the `Component`s attached to a `Entity`.

## Separation of concerns

At the core of the engine’s principles lies the idea of separating audiovisual data from gaming logic, and both from hardware management logic. Management of the Virtual Boy’s hardware is something that all programs, games or not, require in order to do something meaningful with the platform. And it boils down, in all cases, to the manipulation of the same registers, memory addresses and what not, with the appropriate values to achieve a specific result among all the possible ones.

The following sample code, that uses libgccvb, mangles the logic of the game with implicit knowledge of its data and of the hardware’s state:

```cpp
vbSetWorld(31, WRLD_ON, 0, 0, 0, 0, 0, 0, 384, 224); // Background
vbSetWorld(30, WRLD_ON, 384, 0, 0, 0, 0, 0, 384, 224); // Background
vbSetWorld(29, WRLD_ON, -1, 0, -1, 0, 0, 0, 0, 0); // blank
vbSetWorld(28, WRLD_ON, 40, -1, 0, 32, 0, 0, 335, 32); // Password
```

From those arguments, some are about what to present (from coordinates in BGMAP memory space) while others are about where to present that (which WORLD to use and at which screen coordinates). The first is a data concern; the later is a mixture of hardware management and game logic concerns. Neither data related nor hardware related concerns are genuine concerns for the role that the developer adopts when solving a gaming problem. In the above example, the developer is working triple duties: hardware administrator, game programmer and artist / UI or screen designer.

VUEngine’s architectural philosophy is obsessed with the separation of these concerns neatly: the hardware manager role is played by the VUEngine’s core, who fulfills its duties transparently from the point of view of the game developer; and the designer duties are restricted to the creation, elsewhere, far away from the game programmer’s code, of the data structures that specify what must be presented to the end use. The latter is achieved by the declaration and instantiation of structs that are used as recipes by the engine to instantiate objects of different classes and to initialize them according to the values specified in the struct’ attributes. We call these structs **Spec**s, as a short for “specification”:

The following exemplifies a **Spec** that specifies what to display (a `Texture` to be created and configured according to the provided **TextureSpec**) and how to display it (as a BGMAP WORLD):

```cpp
BgmapSpriteROMSpec SomeSpriteSpec =
{
    {
        // Component
        {
            // Allocator
            __TYPE(BgmapSprite),

            // Component type
            kSpriteComponent
        },

        // Spec for the texture to display
        (TextureSpec*)&SomeTextureSpec,

        // Transparency mode (__TRANSPARENCY_NONE, __TRANSPARENCY_EVEN or __TRANSPARENCY_ODD)
        __TRANSPARENCY_NONE,

        // Displacement added to the sprite's position
        {0, 0, 2, 0},
    },

    // The display mode (__WORLD_BGMAP, __WORLD_AFFINE, __WORLD_OBJECT or __WORLD_HBIAS)
    __WORLD_BGMAP,

    // Pointer to affine/hbias manipulation function
    NULL,

    // Flag to indicate in which display to show the texture (__WORLD_ON, __WORLD_LON or __WORLD_RON)
    __WORLD_ON,
};
```

Then, the game programer uses the **Spec** to instantiate an `Sprite` that he can move around, rotate, hide, etc., without having to write code that crosses the line over to the field of hardware management tasks, nor has to go to the assets creator’s land:

```cpp
extern SpriteSpec SomeSpriteSpec;

Sprite sprite = SpriteManager::createSprite(NULL, &SomeSpriteSpec);

if(!isDeleted(sprite))
{
    PixelVector spritePosition =
    {
        __SCREEN_WIDTH / 2, __SCREEN_HEIGHT / 2, 0, 0
    };

    Sprite::setPosition(sprite, &spritePosition);
}
```

Internally, the VUEngine’s core will figure out dynamically where to display what the programmer has requested to be displayed, while that which has to be displayed has already been defined elsewhere, not by the game programmer, but by the game designer or artist.

As another mechanism to facilitate the separation of concerns principle, the engine provides a custom facility for dynamic memory allocation that doesn’t rely on enabling the program’s heap. This, again, helps to avoid hardcoding data within the game’s logic by avoiding the need to know in advance how many objects of any given type are required in any given context.

## Performance

While a game running on VUEngine could never aspire to run as fast as a feature-by-feature equivalent one written in pure assembler, or C for that matter; the complexity of an equivalent program written in these would quickly become unmanageable. In any case, VUEngine aims at good performance, but as any modern generic engine out there, to extract the most of it requires enough knowledge about what it does and specially the flexibility to rewrite parts of it to restrict its range of applicability to specific use cases, in order to gain back the performance loss that generality entails.

Some of the strategies that it uses to compensate for the heaviest of its features, like dynamic dispatching of function calls to support polymorphism, the calling cost of hot functions, or the lack of a dedicated arithmetic unit in the Virtual Boy’s CPU, are:

- Explicit non virtual calls on objects whose class doesn’t override a virtual method
- Support for friend classes to access protected members (breaking encapsulation and tightly coupling some classes together)
- Fixed point math, preferably -but configurable- on 16 bit data types to prevent the promotion to 64 bit types when multiplying and dividing 32 bit data types

## Safety

To implement some of its OOP features, VUEngine makes extensive use of pointers and casts them aggresively through the code base. This inevitably runs the risk of using invalid pointers. To mitigate that pitfal, the engine provides a few tools and strategies.

### Safe casting

The engine provides methods with the form `Classname::safeCast` to safely cast objects and returns `NULL` in case that the object is invalid, deleted or isn't an instance of a class that derives from the one performing the call.

`Classname::safeCast` decays into a plain, unsafe C cast under non debug build modes. When building in debug mode, the method `Classname::safeCast` performs a full blown RTTI, returning `NULL` if it fails or the same pointer casted to the desired class.

When building in beta mode or below, the transpiler adds checks for the validity of the object pointer (`this`) passed to all methods. A call to `Classname::safeCast` is performed too to help track code paths that cause invalid pointers being passed to the wrong methods. This is a very costly check and can easily overflow the stack, particularly if multiplexed VIP interrupts are enabled.

### Checking pointers

Another tool provided to combat invalid pointers usage is the macro `isDeleted(objectPointer)`. It is advisable to always perform this check before calling any method on any object pointer.
