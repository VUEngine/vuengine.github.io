---
layout: documentation
parents: Documentation > User Guide
title: Stages
---

# Stages

[Sprites](/documentation/api/class-sprite/) already help to avoid mixing data with game logic with hardware management, but they are still somehow “low level” objects. Games are not composed of [Sprites](/documentation/api/class-sprite/), but of game objects, some of which have a visual representation, some of which don’t (a trigger, for example).

VUEngine implements [Stages](/documentation/api/class-stage/) as collections of a specific type of [Entity](/documentation/api/class-entity/): [Actors](/documentation/api/class-actor/).

## Entity

A [Entity](/documentation/api/class-entity/) is a [ListenerObject](/documentation/api/class-listener-object/), so it can send and receive messages and it can listen for and fire events. It adds to it a 3D [Transformation](/documentation/api/struct-transformations/), which describes a position, a rotation (euclidean only) and a scale in 3D space, and declares and implements some methods that operate on that [Transformation](/documentation/api/struct-transformations/). Finally, it supports the attachment of [Components](/documentation/api/class-component/) to it. [Components](/documentation/api/class-component/) can be visual components, like [Sprites](/documentation/api/class-sprite/) and [Wireframes](/documentation/api/class-wireframe/); behavioral components, like steering behaviors; physical components or collision components.

The [Entity](/documentation/api/class-entity/) class is abstract, therefore there can not be pure instances of it.

## Container

[Containers](/documentation/api/class-container/) are a special type of [Entity](/documentation/api/class-entity/) that implement parenting by adding a local [Transformation](/documentation/api/struct-transformations/) relative to that of a parent [Container](/documentation/api/class-container/). They are the means by which the engine implements the composite pattern.

[Containers](/documentation/api/class-container/) can have children [Containers](/documentation/api/class-container/), grandchildren [Containers](/documentation/api/class-container/), grand-grandchildren [Containers](/documentation/api/class-container/), etc.

The engine takes care of keeping up to date the [Containers](/documentation/api/class-container/)’ [Transformation](/documentation/api/struct-transformations/) by concatenating their local [Transformation](/documentation/api/struct-transformations/) to their reference environment, which is the global [Transformation](/documentation/api/struct-transformations/) of the parent [Container](/documentation/api/class-container/).

[Containers](/documentation/api/class-container/) can forward or block the flow of logic towards their children. They can propagate messages to them too.

[Containers](/documentation/api/class-container/) are abstract too. So they are not used nor instantiated directly.

## Stage

At the root of the hierarchy of [Containers](/documentation/api/class-container/), sits an instance of the [Stage](/documentation/api/class-stage/) class. A [Stage](/documentation/api/class-stage/) is the first type of [Container](/documentation/api/class-container/) and [Entity](/documentation/api/class-entity/) that can be instantiated. It only allows instances of another specific type of Container as children: [Actors](/documentation/api/class-actor/). The [Stage](/documentation/api/class-stage/) implements the logic to stream in and out [Actors](/documentation/api/class-actor/) and is the proxy through which the [GameState](/documentation/api/class-game-state/) accesses the [Actors](/documentation/api/class-actor/) in a game level.

The [Stage](/documentation/api/class-stage/) take a [StageSpec](/documentation/api/struct-stage-spec/) in its constructor to initialize itself. Among a lot of other things, it has an array of **ActorSpecs** that determine the [Actors](/documentation/api/class-actor/) that will populate the [Stage](/documentation/api/class-stage/):

```cpp
PositionedActorROMSpec StageActorsSpecs[] =
{
    {&ActorSpec,            {0, 64, 0}, {0, 0, 0}, {1, 1, 1},  0, NULL, NULL, NULL, false},
    {&BoxActorSpec,         {150, 64, 0}, {0, 0, 0}, {1, 1, 1},  0, NULL, NULL, NULL, false},
    {&CogWheelActorSpec,    {-150, 64, 0}, {0, 0, 0}, {1, 1, 1},  0, NULL, NULL, NULL, false},

    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};
```

```cpp
StageROMSpec ActorsStageSpec =
{
    // Class allocator
    __TYPE(Stage),

    // Timer config
    {...},

    // Sound config
    {...},

    // General stage's attributes
    {
        // Stage's size in pixels
        {
            // x, y, z
            8191, __SCREEN_HEIGHT, 8191,
        },

        // Camera's initial position inside the stage
        {
            // x, y, z, p
            0, 0, 0, 0
        },

        // Camera's frustum
        {
            // x0, y0, z0
            0, 0, -10,
            // x1, y1, z1
            __SCREEN_WIDTH, __SCREEN_HEIGHT, 4096
        }
    },

    // Streaming
    {...},

    // Rendering
    {...},

    // Physical world's properties
    {...},

    // Assets
    {
        // Fonts to preload
        (FontSpec**)ActorsStageFondSpecs ,

        // CharSets to preload
        (CharSetSpec**)NULL,

        // Textures to preload
        (TextureSpec**)NULL,

        // Sounds to load
        (SoundSpec**)ActorsStageSoundSpecs,
    },

    // Actors
    {
        // UI configuration
        {
            (PositionedActor*)ActorsStageUIActorsSpecs,
            __TYPE(UIContainer),
        },

        // Stage's children actors
        (PositionedActor*)ActorsStageActorsSpecs,
    },

    // Post processing effects
    (PostProcessingEffect*)NULL,
};
```

## Actor

[Actors](/documentation/api/class-actor/) are the basic unit of game logic in VUEngine projects. They are special [Containers](/documentation/api/class-container/) that can be streamed in and out of [Stages](/documentation/api/class-stage/) automatically or manually. They are configured by providing an [ActorSpec](/documentation/api/struct-actor-spec/) that specifies, among other things, which components to attach to them when instantiated:

```cpp
ComponentSpec* const BoxActorComponentSpecs[] =
{
    (ComponentSpec*)&BoxSpriteSpec,
    (ComponentSpec*)&BoxColliderSpec1,
    NULL
};

ActorROMSpec BoxActorSpec =
{
    // Class allocator
    __TYPE(Actor),

    // Component specs
    (ComponentSpec**)BoxActorComponentSpecs,

    // Children specs
    NULL,

    // Extra info
    NULL,

    // Size
    // If 0, it is computed from the visual components if any
    {0, 0, 0},

    // Actor's in-game type
    kTypeSolidObject,

    // Pointer to animation functions array
    NULL,

    // Animation to play automatically
    NULL
};
```

[Actors](/documentation/api/class-actor/) can be instantiated and added to the [Stage](/documentation/api/class-stage/) programmatically, that is to say that it is not mandatory to provide their specs in advance as part of the list of **ActorSpecs** defined in the [StageSpec](/documentation/api/struct-stage-spec/).

To add [Actors](/documentation/api/class-actor/) to the [Stage](/documentation/api/class-stage/) programmatically, the following method can be used:

```cpp
extern ActorSpec ActorSpec;

PositionedActor positionedActor =
{
    &ActorSpec, {0, 64, 16}, {0, 0, 0}, {1, 1, 1},  0, "Moe", NULL, NULL, false
};

/*
* This is how we add actors to the Stage. Notice that we don't creates Sprites nor animate them
* directly anymore. Now, the engine takes care of all that by reading the ActorSpec.
*/
Stage::spawnChildActor(this->stage, (const PositionedActor* const)&positionedActor, false);
```

[Actors](/documentation/api/class-actor/) can be added dynamically to other [Actors](/documentation/api/class-actor/) too:

```cpp
extern ActorSpec ActorSpec;

PositionedActor positionedActor =
{
    &ActorSpec,
    {0, 0, 0},
    {0, 0, 0},
    {1, 1, 1},
    0,
    childActorName,
    NULL,
    NULL,
    false
};

Actor::spawnChildActor(actor, &positionedActor);
```

Just as [Actors](/documentation/api/class-actor/) are not instantiated directly, but through the shown methods, they cannot be destroyed directly either. Instead, a special method that is safe has to be used:

```cpp
if(NULL != childActor)
{
    Actor::deleteMyself(childActor);
}
```

The game logic should always manipulate [Actors](/documentation/api/class-actor/) and not [Sprites](/documentation/api/class-sprite/), [Textures](/documentation/api/class-texture/) or [CharSets](/documentation/api/class-charsets/). There are applications for those, like implementing special effects or managing a global image, maybe to save on performance. But in general, [Actors](/documentation/api/class-actor/) are the main citizens in VUEngine based games.

You acquire a direct reference to a newly spawned [Actor](/documentation/api/class-actor/) when using the above methods:

```cpp
/*
* This is how we add actors to the Stage. Notice that we don't creates Sprites nor animate them
* directly anymore. Now, the engine takes care of all that by reading the ActorSpec.
*/
Actor actor =
Actor::safeCast
(
    Stage::spawnChildActor(this->stage, (const PositionedActor* const)&positionedActor, false)
);
```

Or you acquire it indirectly if the [Actor](/documentation/api/class-actor/) is being added automatically by the [Stage](/documentation/api/class-stage/)’s streaming as specified in the [StageSpec](/documentation/api/struct-stage-spec/):

```cpp
Actor childActor = Actor::safeCast(Actor::getChildByName(actor, childActorName, false));
```

Then you can move around the [Actor](/documentation/api/class-actor/), rotate it, etc., and all its components will take care of keeping their states in sync with the [Actor](/documentation/api/class-actor/).

```cpp
if(!isDeleted(actor))
{
    Vector3D translation = Vector3D::zero();
    Rotation localRotation = *Actor::getLocalRotation(actor);

    translation.x = __PIXELS_TO_METERS(1);
    translation.z++;
    localRotation.y = __I_TO_FIX10_6(255);

    // Add a translation to the leader actor
    Actor::translate(actor, &translation);

    // Make it to face left or right by rotating it around its Y axis
    Actor::setLocalRotation(actor, &localRotation);
}
```

The [Actor](/documentation/api/class-actor/) has helper methods to propagate calls related to animations, like play, pause, stop, etc., to the attached [VisualComponents](/documentation/api/class-visualcomponent/). This class basically facades the interactions to control [Sprites](/documentation/api/class-sprite/)’ animations.

```cpp
/// Play the animation with the provided name.
/// @param animationName: Name of the animation to play
void playAnimation(const char* animationName);

/// Pause or unpause the currently playing animation if any.
/// @param pause: Flag that signals if the animation must be paused or unpaused
void pauseAnimation(bool pause);

/// Stop any playing animation if any.
void stopAnimation();

/// Check if an animation is playing.
/// @return True if an animation is playing; false otherwise
bool isPlaying();

/// Check if the animation whose name is provided is playing.
/// @param animationName: Name of the animation to check
/// @return True if an animation is playing; false otherwise
bool isPlayingAnimation(char* animationName);

/// Retrieve the animation function's name currently playing if any
/// @return Animation function's name currently playing if any
const char* getPlayingAnimationName();

/// Skip the currently playing animation to the provided frame.
/// @param frame: The frame of the playing animation to skip to
/// @return True if the actual frame was changed; false otherwise
void setActualFrame(int16 frame);

/// Skip the currently playing animation to the next frame.
void nextFrame();

/// Rewind the currently playing animation to the previous frame.
void previousFrame();

/// Retrieve the actual frame of the playing animation if any.
/// @return Actual frame of the playing animation if any
int16 getActualFrame();

/// Retrieve the number of frames in the currently playing animation if any.
/// @return The numer of frames if an animation is playing; o otherwise
int32 getNumberOfFrames();
```

When you have an [Actor](/documentation/api/class-actor/) with a [Body](/documentation/api/class-body/) attached to it, you can apply forces to it to move it using physics simulations:

```cpp
Vector3D force = Vector3D::zero();

force.x = Body::getMass(Actor::getBody(actor)) << 1;

Actor::applyForce(actor, &force, true);
```

## ParticleSystem

[ParticleSystems](/documentation/api/class-particlesystem/) are a specific kind of [Actor](/documentation/api/class-actor/) whose purpose is to instantiate a peculiar kind of [Entity](/documentation/api/class-entity/): [Particles](/documentation/api/class-particles/).

As any other [Actor](/documentation/api/class-actor/), components can be attached to [ParticleSystems](/documentation/api/class-particlesystem/) and they have their own **Spec** that adds a few attributes to control how [Particles](/documentation/api/class-particle/) are generated:

```cpp
ParticleSystemROMSpec SomeParticleSystemNormalSpec =
{
    // EntitySpec
    {...
    }

    // reuse expired particles?
    true,

    // minimum generation delay in milliseconds
    5 * 8 * 20 / 8,

    // maximum generation delay in milliseconds
    5 * 8 * 20 / 6,

    // maximum number of alive particles
    12,

    // maximum number of particles to spawn in each cycle
    1,

    // array of visual component specs
    (const ComponentSpec**)SomeSpriteSpecs,

    // array of physics component specs
    (const ComponentSpec**)NULL,

    // array of collider component specs
    (const ComponentSpec**)NULL,

    // auto start
    false,

    // particle spec
    (ParticleSpec*)&SomeParticleNormalSpec,

    // minimum relative spawn position (x, y, z)
    {__PIXELS_TO_METERS(-20), __PIXELS_TO_METERS(-16), __PIXELS_TO_METERS(0)},

    // maximum relative spawn position (x, y, z)
    {__PIXELS_TO_METERS(20), __PIXELS_TO_METERS(16), __PIXELS_TO_METERS(16)},

    // minimum force to apply (x, y, z)
    // (use int values in the spec to avoid overflow)
    {__F_TO_FIXED(0), __F_TO_FIXED(0), 0},

    // maximum force to apply (x, y, z)
    // (use int values in the spec to avoid overflow)
    {__F_TO_FIXED(0), __F_TO_FIXED(0), 0},

    // movement type (__UNIFORM_MOVEMENT or __ACCELERATED_MOVEMENT)
    __NO_MOVEMENT
};
```

## Particle

[Particles](/documentation/api/class-particle/) are a kind of lightweight, reusable [Entity](/documentation/api/class-entity/), that are instantiated by [ParticleSystems](/documentation/api/class-particlesystem/). They don’t exist in the [Stage](/documentation/api/class-stage/) as childs of it, although they can interact with other [Actors](/documentation/api/class-actor/) by means of collisions.

[Particles](/documentation/api/class-particle/) manage their components in a more specific and constrained way than [Actors](/documentation/api/class-actor/) in order to be as performant as possible, to reduce their memory footprint and to make it possible their reutilization to reduce the overhead of constantly creating and destroying them.

```cpp
ParticleROMSpec SomeParticleSpec =
{
    // Class allocator
    __TYPE(Particle),

    // Minimum life span in milliseconds
    5 * 8 * 20,

    // Life span delta in milliseconds
    100,

    // Function pointer to control particle's behavior
    NULL,

    // Array of available animations
    (const AnimationFunction**)&SomeAnimationSpecs,

    // Animation to play automatically
    "Vanish",

    // animation to play upon collision
    NULL,

    // object's in-game type
    kTypeParticle,
};
```

[Particles](/documentation/api/class-particle/) can have physics applied to them and they can even collide with other instances of [Entity](/documentation/api/class-entity/) in a [Stage](/documentation/api/class-stage/).
