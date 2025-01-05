---
layout: documentation
title: Graphics
---

# Graphics

VUEngine now supports three kinds of visual elements that can display something on the Virtual Boy’s screens: `Sprite`s, `Wireframe`s and `Printing`.

`Sprite`s are the means by which the engine displays 2D images, while `Wireframe`s are used to display non textured 3D geometry shapes.

They are components that can be attached to an `Entity`. But they can be instantiated on demand and controlled directly without the need to attach them to any `Entity`. Both are created by the respective managers: the `SpriteManager` and the `WireframeManager`.

## Sprites

`Sprite`s work as a sort of logical window that peaks into graphical memory, either into BGMAP space or directly into CHAR space, and draws what is seen through that window by means of a WORLD or an OBJECT or group of OBJECTs.

CHAR, BGMAP, OBJECT and WORLD are all hardware concepts of the Virtual Boy’s architecture. The engine provides classes that correspond to each one of these for their management.

A `CharSet` represents one or more CHARs and treats them as a single unit. These hold the indexes of color data that underlies the graphics that the Virtual Boy’s Visual Image Processor (VIP) displays. Each CHAR is an 8×8 pixel matrix, or tile, from which complex images can be composed. `CharSet`s are constructed by providing a **CharSetSpec** that specifies its properties

Take the following image as an example from which a **CharSetSpec** will be defined:

<img src="/documentation/images/user-guide/working-with-graphics/punk-chars.png" width="300" />

The above image’s size is 32×48 pixels, which translates to 4×6 tiles. The **Spec** that defines it is the following:

```cpp
CharSetROMSpec PunkCharsetSpec =
{
	// Number of chars in function of the number of frames to load at the same time
	4 * 6,

	// Whether it is shared or not
	true,

	// Whether the tiles are optimized or not
	false,

	// Tiles array
	PunkTiles,

	// Frame offsets array
	NULL,
};
```

`CharSet`s can have a unique usage or they can be shared to display more than one copy of the same image without increasing the memory footprint in the CHAR memory space. In the above example, the __PunkTiles__ is a reference to the array that actually holds the pixel data.

CHAR memory is arranged as a unidimensional array. Visually, it would look like this:

<img src="/documentation/images/user-guide/working-with-graphics/punk-char-memory.png" />

In such an arrangement, the CHARs or tiles of this `CharSet` cannot be directly drawn to reconstruct the original image. For that, it is necessary to define a specific bidimensional arrangement of the CHARs relative to each order. Array maps that are interpreted as 2D matrices, where each point references a tile in the `CharSet`, are used to provide such bidimensional order. In the engine these are encapsulated in a Texture class.

Textures need their own **TextureSpec** to be instantiated and properly initialized. The following corresponds to the Spec for the texture that reconstruct the original image:

```cpp
TextureROMSpec PunkTextureSpec =
{
	(CharSetSpec*)&PunkCharsetSpec,

	// Pointer to the map array that defines how to use the tiles from the char set
	PunkMap,

	// Horizontal size in tiles of the texture (max. 64)
	4,

	// Vertical size in tiles of the texture (max. 64)
	6,

	// Padding added to the size for affine/hbias transformations (cols, rows)
	{1, 1},

	// Number of frames that the texture supports
	1,

	// Palette index to use by the graphical data (0 - 3)
	0,

	// Flag to recyble the texture with a different map
	false,

	// Flag to vertically flip the image
	false,

	// Flag to horizontally flip the image
	false,
};
```

A `Texture`’s map has to be loaded in BGMAP memory when it is displayed by a `BgmapSprite`. But graphical memory allocation isn’t required when the graphical data is displayed using an `ObjectSprite` since it only requires the map array to reference from OBJECT memory the CHARs from the `CharSet` in the right bidimensional order.

Finally, `Texture`s are displayed by `Sprite`s, either from BGMAP memory through a single WORLD, or by rendering each CHAR into OBJECT memory. The following **SpriteSpec** exemplifies the former in reference to the **TextureSpec** above:

```cpp
BgmapSpriteROMSpec PunkSpriteSpec =
{
	{
		// Component
		{
			// Allocator
			__TYPE(BgmapAnimatedSprite),

			// Component type
			kSpriteComponent
		},

		// Spec for the texture to display
		(TextureSpec*)&PunkTextureSpec,

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

With these **Specs** defined, the original image can be displayed by instantiating a `Sprite` and positioning it appropriately:

```cpp
[...]
```

`CharSet`s and `Texture`s are reusable, which means that multiple `Texture`s can share the same `CharSet` and that more than one `Sprite` can display the same `Texture`. The intricacies of how these relationships are worked out by the engine depend on the allocation type of the `CharSet`, which in turn depends on animations.

## Wireframes

The other kind of visual component are `Wireframe`s. These are non solid 3D shapes that draw 1 pixel wide lines or circles. They leverage the ability of writing directly to the video frame buffers after the VIP has finished its drawing procedures during the current game frame. Accessing video memory with the CPU is slow and even more so when reading back from it, which is unavoidable when drawing single pixels.

`Wireframe` creation and configuration is done with a **WireframeSpec**, which look like the following:

```cpp
MeshROMSpec PyramidWireframeSpec =
{
	{
		// Component
		{
			// Allocator
			__TYPE(Mesh),

			// Component type
			kWireframeComponent
		},

		{0, 0, 0},

		// Wireframe's lines' color
		__COLOR_BLACK,

		// Transparency mode (__TRANSPARENCY_NONE, __TRANSPARENCY_EVEN or __TRANSPARENCY_ODD)
		__TRANSPARENCY_NONE,

		// Flag to render the wireframe in interlaced mode
		false,
	},

	// Segments that compose the mesh
	(PixelVector(*)[2])PyramidMeshesSegments
};
```

The engine provides a few kinds of Wireframes: `Mesh`, `Line`, `Sphere` and `Asterisk`. Depending on the specific class, its corresponding **Spec** will add specific attributes. In the case of a **MeshSpec**, it requires an array of segments:

```cpp
const PixelVector PyramidMeshesSegments[][2]=
{
	// base
	{ {-64, 64, -64, 0}, { 64, 64, -64, 0} },
	{ {-64, 64,  64, 0}, { 64, 64,  64, 0} },
	{ {-64, 64, -64, 0}, {-64, 64,  64, 0} },
	{ { 64, 64, -64, 0}, { 64, 64,  64, 0} },

	// vertex
	{ {0, -64, 0, 0}, {-64, 64, -64, 0} },
	{ {0, -64, 0, 0}, {-64, 64,  64, 0} },
	{ {0, -64, 0, 0}, { 64, 64, -64, 0} },
	{ {0, -64, 0, 0}, { 64, 64,  64, 0} },

	// limiter
	{ {0, 0, 0, 0}, {0, 0, 0, 0} },
};
```

Then, as it was the case with `Sprite`s, a `Wireframe` can be instantiated by calling the corresponding manager:

```cpp
[...]
```

## Printing

VUEngine uses a special `Sprite` to provide a printing facility, both for UI and gaming purposes, as for helping debugging. The following are the available methods to print different primitive data types:

```cpp
[...]
```

Printing is used as follows:

```cpp
[...]
```

To erase all printing, use:

```cpp
[...]
```

VUEngine comes with a default font for writing to the printing Layer, but you can replace it with any number of custom fonts.

## Animations

Only `Sprite`s support animations. There are basically 2 ways to allocate the graphical data for animations in the system’s video memory:

- To load all the CHARs for all the frames of animation at once
- To load only the CHARs that correspond to a single frame of animation at any given time

The first approach puts stress on video memory since depending on the size of each frame and the number of animation frames, it can quickly deplete CHAR memory. The second alternative puts the stress on the CPU since it has to rewrite the pixel data when the frame of animation changes. Using one of the other depends on the memory and performance requirements of the game.

`CharSet`s can be shared by multiple `Texture`s. Whether this is the case or not, is determined by the shared flag of the **CharSetSpec**:

```cpp
[...]
```

When requesting a `CharSet` by providing a shared **CharSetSpec**, the engine will only allocate a `CharSet` once, and any subsequent request will be served with the previously created instance. This saves both work and graphics memory, as well as CPU performance.

The overshoot of a shared **CharSetSpec** that only allocates a single frame at any give moment is that any `Sprite` that uses a `Texture` which references that `CharSet` will show a change of animation if any of them changes the frame and that all instances will be in sync:

**[IMAGE]**

Since it would be overkill to play animations on all `Sprite`s underlyed by a shared `CharSet`, the engine runs the animations only on the first Sprite.

On the other hand, when using a non-shared **CharSetSpec** to create a `CharSet`, each request will be served with a new `CharSet` instance. This permits to having different sprites with the same graphics but displaying different frames of animation:

**[IMAGE]**

To load the complete pixel data of all the animation frames of an animation, the **CharSetSpec** must specify the total amount of CHARs used by all of the:

```cpp
[...]
```

Allocating all frames of animation has a meaning in regards to `Texture`s too. `Texture`s define how to organize the CHARs or tiles of a `CharSet` into a bidimensional plane. This order can be applied directly when displaying the image using OBJECTs through instances of `ObjectSprite`s. But when using BGMAPs with `BgmapSprite`s, the `Texture`’s map has to be allocated in BGMAP memory to be displayed by means of a WORLD. In this case, there is an analogous difference between allocating all the frames of the animation at once or only one.

To load all the maps for all the animation frames of an animation in BGMAP memory, the **TextureSpec** must specify the total number of frames:

In this scenario, each `Sprite` that uses the same `Texture` can display a different frame of the animation.
