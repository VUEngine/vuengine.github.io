---
layout: documentation
title: Stages
---

# Stages

`Sprite`s already help to avoid mixing data with game logic with hardware management, but they are still somehow “low level” objects. Games are not composed of `Sprite`s, but of game objects, some of which have a visual representation, some of which don’t (a trigger, for example).

VUEngine implements `Stage`s as collections of a specific type of `Entity`: `Actor`s.

## Entity

A `Entity` is a `ListenerObject`, so it can send and receive messages and it can listen for and fire events. It adds to it a 3D transformation, which describes a position, a rotation (euclidean only) and a scale in 3D space, and declares and implements some methods that operate on that transformation. Finally, it supports the attachment of `Component`s to it. `Component`s can be visual components, like `Sprite`s and `Wireframe`s; behavioral components, like steering behaviors; physical components or collision components.

The `Entity` class is abstract, therefore there can not be pure instances of it.


## Container

`Container`s are a special type of `Entity` that implement parenting by adding a local transformation relative to that of a parent `Container`. They are the means by which the engine implements the composite pattern.

`Container`s can have children `Container`s, grandchildren `Container`s, grand-grandchildren `Container`s, etc.

The engine takes care of keeping up to date the `Container`s’ transformation by concatenating their local transformations to their reference environment, which is the global transformation of the parent `Container`.

`Container`s can forward or block the flow of logic towards their children. They can propagate messages to them too.

`Container`s are abstract too. So they are not used nor instantiated directly.


## Stage

At the root of the hierarchy of `Container`s, sits an instance of the `Stage` class. A `Stage` is the first type of `Container` and `Entity` that can be instantiated. It only allows instances of another specific type of Container as children: `Actor`s. The `Stage` implements the logic to stream in and out `Actor`s and is the proxy through which the `GameState` accesses the `Actor`s in a game level.

Being instantiable, the `Stage` has its own **StageSpec** to initialize it. Among a lot of other things, it has an option array of **ActorSpecs** that define the `Actor`s that will populate the `Stage`:

```cpp
PositionedActorROMSpec StageActorsSpecs[] =
{
    {&PunkActorSpec,        {0, 64, 0}, {0, 0, 0}, {1, 1, 1},  0, NULL, NULL, NULL, false},
    {&BoxActorSpec,         {150, 64, 0}, {0, 0, 0}, {1, 1, 1},  0, NULL, NULL, NULL, false},
    {&CogWheelActorSpec,    {-150, 64, 0}, {0, 0, 0}, {1, 1, 1},  0, NULL, NULL, NULL, false},
	
    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};
```

```cpp
StageROMSpec StatefulActorsStageSpec =
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
		(FontSpec**)StatefulActorsStageFondSpecs ,

		// CharSets to preload
		(CharSetSpec**)NULL,

		// Textures to preload
		(TextureSpec**)NULL,

		// Sounds to load
		(SoundSpec**)StatefulActorsStageSoundSpecs,
	},

	// Actors
	{
		// UI configuration
		{
			(PositionedActor*)StatefulActorsStageUIActorsSpecs,
			__TYPE(UIContainer),
		},

		// Stage's children actors
		(PositionedActor*)StatefulActorsStageActorsSpecs,
	},

	// Post processing effects
	(PostProcessingEffect*)NULL,
};
```

## Actor

`Actor`s are the basic unit of game logic in VUEngine projects. They are special `Container`s that can be streamed in and out of `Stage`s automatically or manually. They are configured by providing an **ActorSpec** that specifies, among other things, which components to attach to it when instantiated:

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

`Actor`s can be instantiated and added to the `Stage` programmatically, that is to say that it is not mandatory to provide their specs in advance as part of the list of **ActorSpecs** defined in the **StageSpec**.

To add `Actor`s to the `Stage` programmatically, the following method can be used:

```cpp
    extern ActorSpec PunkActorSpec;
	
    PositionedActor positionedActor = 
    {
        &PunkActorSpec, {0, 64, 16}, {0, 0, 0}, {1, 1, 1},  0, "Moe", NULL, NULL, false
    };

    /*
    * This is how we add actors to the Stage. Notice that we don't creates Sprites nor animate them
    * directly anymore. Now, the engine takes care of all that by reading the ActorSpec.
    */
    Stage::spawnChildActor(this->stage, (const PositionedActor* const)&positionedActor, false);
```

`Actor`s can be added dynamically to other `Actor`s too:

```cpp
    extern ActorSpec PunkActorSpec;

    PositionedActor positionedActor = 
    {
        &PunkActorSpec,
        {0, 0, 0},
        {0, 0, 0},
        {1, 1, 1},
        0,
        childPunkName,
        NULL,
        NULL,
        false
    };

    Actor::spawnChildActor(this->leaderPunk, &positionedActor);
```

Just as `Actor`s are not instantiated directly, but through the shown methods, they cannot be destroyed directly either. Instead, a special method that is safe has to be used:

```cpp
    if(NULL != childPunk)
    {
        Actor::deleteMyself(childPunk);
    }
```

The game logic should always manipulate `Actor`s and not `Sprite`s, `Texture`s or `CharSets`. There are applications for those, like implementing special effects or managing a global image, maybe to save on performance. But in general, `Actor`s are the main citizens in VUEngine based games.

You acquire a direct reference to a newly spawned `Actor` when using the above methods:

```cpp
    /*
    * This is how we add actors to the Stage. Notice that we don't creates Sprites nor animate them
    * directly anymore. Now, the engine takes care of all that by reading the ActorSpec.
    */
    this->leaderPunk = 
        Actor::safeCast
        (
            Stage::spawnChildActor(this->stage, (const PositionedActor* const)&positionedActor, false)
        );
```

Or you acquire it indirectly if the `Actor` is being added automatically by the `Stage`’s streaming as specified in the **StageSpec**:

```cpp
    /*
    * Let's see if the punk already has a child with the selected name.
    * If not, then create and add it as a child.
    */
    Actor childPunk = Actor::safeCast(Actor::getChildByName(this->leaderPunk, childPunkName, false));
```

Then you can move around the `Actor`, rotate it, etc., and all its components will take care of keeping their states in sync with the `Actor`.

```cpp
    if(!isDeleted(this->leaderPunk))
    {
        Vector3D translation = Vector3D::zero();
        Rotation localRotation = *Actor::getLocalRotation(this->leaderPunk);

        translation.x = __PIXELS_TO_METERS(1);
        translation.z++;
        localRotation.y = __I_TO_FIX10_6(255);

        // Add a translation to the leader punk
        Actor::translate(this->leaderPunk, &translation);

        // Make it to face left or right by rotating it around its Y axis
        Actor::setLocalRotation(this->leaderPunk, &localRotation);
    }
```

The `Actor` has helper methods to propagate calls related to animations, like play, pause, stop, etc., to the attached `VisualComponent`s. This class basically facades the interactions to control `Sprite`s’ animations.

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

When you have an `Actor` with a `Body` attached to it, you can apply forces to it to move it using physics simulations:

```cpp
    Vector3D force = Vector3D::zero();
            
    force.x = Body::getMass(Punk::getBody(punk)) << 1;

    Punk::applyForce(punk, &force, true);
```

## StatefulActor

A `StatefulActor` adds to the `Actor` an optional `StateMachine`. This is done to avoid having a superfluous call to `Actor::update` on `Actor`s that don’t require a `StateMachine`.

The **StatefulActorSpec** adds to the **ActorSpec** some fields of its own:

```cpp
StatefulActorROMSpec PunkStatefulActorSpec =
{
    {
        // Class allocator
        __TYPE(StatefulActor),

        // Component specs
        (ComponentSpec**)PunkStatefulActorComponentSpecs,

        // Children specs
        NULL,

        // Extra info
        NULL,

        // Size
        // If 0, it is computed from the visual components if any
        {0, 0, 0},

        // Actor's in-game type
        kTypePunk,

        // Pointer to animation functions array
        (const AnimationFunction**)&PunkStatefulActorAnimationSpecs,

        // Animation to play automatically
        "Move"
    },
};
```

This exemplifies how **Specs** are chained together for derived classes by having at the top the **Spec** of the base class and adding new fields, relevant to the derived class, to its Spec.

## ParticleSystem

`ParticleSystem`s are a specific kind of `Actor` whose purpose is to instantiate a peculiar kind of `Entity`: `Particles`.

As any other `Actor`, components can be attached to `ParticleSystem`s and they have their own Spec that adds a few attributes to control how `Particle`s are generated:

```cpp
ParticleSystemROMSpec StarsParticleSystemNormalSpec =
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
    (const ComponentSpec**)StarSpriteSpecs,

    // array of physics component specs
    (const ComponentSpec**)NULL,

    // array of collider component specs
    (const ComponentSpec**)NULL,

    // auto start
    false,

    // particle spec
    (ParticleSpec*)&StarParticleNormalSpec,

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

`Particle`s are a kind of lightweight, reusable `Entity`, that are instantiated by `ParticleSystem`s. They don’t exist in the `Stage` as childs of it, although they can interact with other `Actor`s by means of collisions.

`Particle`s manage their components in a more specific and constrained way than `Actor`s in order to be as performant as possible, to reduce their memory footprint and to make it possible their reutilization to reduce the overhead of constantly creating and destroying them.

```cpp
ParticleROMSpec StarParticleSpec =
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
	(const AnimationFunction**)&StarAnimationSpecs,

	// Animation to play automatically
	"Vanish",

	// animation to play upon collision
	NULL,

	// object's in-game type
	kTypeParticle,
};
```

`Particle`s can have physics applied to them and they can even collide with other instances of `Entity` in a `Stage`.
