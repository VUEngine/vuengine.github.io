---
layout: documentation
parents: Documentation > User Guide
title: Graphics
---

# Graphics

[VUEngine](https://github.com/VUEngine/VUEngine-Core) now supports three kinds of visual elements that can display something on the Virtual Boy’s screens: [Sprites](/documentation/api/class-sprite/), [Wireframes](/documentation/api/class-wireframe/) and a [Printer](/documentation/api/class-printer/) to output text on the screen..

[Sprites](/documentation/api/class-sprite/) are the means by which the engine displays 2D images, while [Wireframes](/documentation/api/class-wireframe/) are used to display non textured 3D geometry shapes.

They are components that can be attached to an [Entity](/documentation/api/class-entity/). But they can be instantiated on demand and controlled directly without the need to attach them to any [Entity](/documentation/api/class-entity/). Both are created by the [ComponentManager](/documentation/api/class-component-manager/) class.

## Sprites

[Sprites](/documentation/api/class-sprite/) work as a sort of logical window that peaks into graphical memory, either into BGMAP space or directly into CHAR space, and draw what is seen through that window by means of a WORLD or an OBJECT or group of OBJECTs.

CHAR, BGMAP, OBJECT and WORLD are all hardware concepts of the Virtual Boy’s architecture. The engine provides classes that correspond to each one of these for their management.

A [CharSet](/documentation/api/class-char-set/) represents one or more CHARs and treats them as a single unit. These hold the indexes of color data that underlie the graphics that the Virtual Boy’s Visual Image Processor (VIP) displays. Each CHAR is an 8×8 pixel matrix, or tile, from which complex images can be composed. [CharSets](/documentation/api/class-char-set/) are constructed by providing a [CharSetSpec](/documentation/api/struct-char-set-spec/) that specifies its properties

Take the following image as an example from which a [CharSetSpec](/documentation/api/struct-char-set-spec/) will be defined:

<a href="/documentation/images/user-guide/graphics/punk.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/user-guide/graphics/punk.png" width="200" /></a> <a href="/documentation/images/user-guide/graphics/punk-chars.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/user-guide/graphics/punk-chars.png" width="200" /></a>

The above image’s size is 32×48 pixels, which translates to 4×6 tiles. The **Spec** that defines it is the following:

```cpp
CharSetROMSpec ActorCharsetSpec =
{
    // Number of chars in function of the number of frames to load at the same time
    4 * 6,

    // Whether it is shared or not
    true,

    // Whether the tiles are optimized or not
    false,

    // Tiles array
    ActorTiles,

    // Frame offsets array
    NULL,
};
```

[CharSets](/documentation/api/class-char-set/) can have a unique usage or they can be shared to display more than one copy of the same image without increasing the memory footprint in the CHAR memory space. In the above example, the **ActorTiles** is a reference to the array that actually holds the pixel data.

CHAR memory is arranged as a unidimensional array. Visually, it would look like this:

<a href="/documentation/images/user-guide/graphics/punk-char-memory.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/user-guide/graphics/punk-char-memory.png" /></a>

In such arrangement, the CHARs or tiles of this [CharSet](/documentation/api/class-char-set/) cannot be directly drawn to reconstruct the original image. For that, it is necessary to define a specific bidimensional arrangement of the CHARs relative to each order. Array maps that are interpreted as 2D matrices, where each point references a tile in the [CharSet](/documentation/api/class-char-set/), are used to provide such bidimensional order. In the engine these are encapsulated in a [Texture](/documentation/api/class-texture/) class.

[Textures](/documentation/api/class-texture/) need their own [TextureSpec](/documentation/api/struct-texture-spec/) to be instantiated and properly initialized. The following corresponds to the **Spec** for the texture that reconstruct the original image:

```cpp
TextureROMSpec ActorTextureSpec =
{
    (CharSetSpec*)&ActorCharsetSpec,

    // Pointer to the map array that defines how to use the tiles from the char set
    ActorMap,

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

    // Flag to recycle the texture with a different map
    false,

    // Flag to vertically flip the image
    false,

    // Flag to horizontally flip the image
    false,
};
```

A [Texture](/documentation/api/class-texture/)’s map has to be loaded in BGMAP memory when it is displayed by a [BgmapSprite](/documentation/api/class-bgmap-sprite/). But graphical memory allocation isn’t required when the graphical data is displayed using an [ObjectSprite](/documentation/api/class-object-sprite/) since it only requires the map array to reference from OBJECT memory the CHARs from the [CharSet](/documentation/api/class-char-set/) in the right bidimensional order.

Finally, [Textures](/documentation/api/class-texture/) are displayed by [Sprites](/documentation/api/class-sprite/), either from BGMAP memory through a single WORLD, or by rendering each CHAR into OBJECT memory. The following [SpriteSpec](/documentation/api/struct-sprite-spec/) exemplifies the former in reference to the [TextureSpec](/documentation/api/struct-texture-spec/) above:

```cpp
BgmapSpriteROMSpec ActorSpriteSpec =
{
    // Sprite
    {
        // VisualComponent
        {
            // Component
            {
                // Allocator
                __TYPE(BgmapSprite),

                // Component type
                kSpriteComponent
            },

            // Array of function animations
            NULL
        },

        // Spec for the texture to display
        (TextureSpec*)&ActorTextureSpec,

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

This shows how **Specs** are chained together for derived classes by having at the top the **Spec** of the base class and adding new fields, relevant to the derived class, to its Spec. In this case, the [BgmapSpriteSpec](/documentation/api/struct-bgmap-sprite-spec/) adds the last 3 attributes to the [SpriteSpec](/documentation/api/struct-sprite-spec/).

With these **Specs** defined, the original image can be displayed by instantiating a [Sprite](/documentation/api/class-sprite/) and positioning it appropriately:

```cpp
extern SpriteSpec ActorSpriteSpec;

Sprite sprite = Sprite::safeCast(ComponentManager::createComponent(NULL, (ComponentSpec*)&ActorSpriteSpec));

if(!isDeleted(sprite))
{
    PixelVector spritePosition =
    {
        __SCREEN_WIDTH / 2, __SCREEN_HEIGHT / 2, 0, 0
    };

    Sprite::setPosition(sprite, &spritePosition);
}
```

[CharSets](/documentation/api/class-char-set/) and [Textures](/documentation/api/class-texture/) are reusable, which means that multiple [Textures](/documentation/api/class-texture/) can share the same [CharSet](/documentation/api/class-cha-set/) and that more than one [Sprite](/documentation/api/class-sprite/) can display the same [Texture](/documentation/api/class-texture/). The intricacies of how these relationships are worked out by the engine depend on the allocation type of the [CharSet](/documentation/api/class-char-set/), which in turn depends on animations.

### BGMAP Sprites

The [Sprite](/documentation/api/class-sprite/) class cannot be directly instantiated since it is `abstract`. The first instantiable [Sprite](/documentation/api/class-sprite/) is the [BgmapSprite](/documentation/api/class-bgmap-sprite/). These use a whole VIP's WORLD to display a region of BGMAP memory.

These kind of [Sprites](/documentation/api/class-sprite/) support 3 display modes in function of the underlying hardware's capabilities:

- BGMAP
- AFFINE
- H-BIAS

#### Affine transformations

Affine transformation effects are supported both in hardware and by [VUEngine](https://github.com/VUEngine/VUEngine-Core). The effect to apply to a given [Sprite](/documentation/api/class-sprite/) is determined by the corresponding pointer in the [BgmapSpriteSpec](/documentation/api/struct-bgmap-sprite-spec/). If NULL, the engine applies a default full transformation by calling [Affine::transform](/documentation/api/class-affine/#aa3e91a2a23e8c48c56074f284c7317ff); otherwise, the provided affine function is applied.

An affine function must have the following signature:

```cpp
static int16 BgmapSprite::someAffineEffect(BgmapSprite bgmapSprite);
```

The engine reserves a region of the param tables space for any [BgmapSprite](/documentation/api/class-bgmap-sprite/) initialized with a [BgmapSpriteSpec](/documentation/api/struct-bgmap-sprite-spec/) that sets its display mode as `__WORLD_AFFINE`. The manipulation of that space is done through the `param` attribute. Refer to the official Virtual Boy's documentation for the meaning of the param table for affine effects.

#### H-Bias effects

These kind of effects apply a horizontal displacement on a per-line basis to a [Texture](/documentation/api/class-texture/) that lives in BGMAP memory. This allows to achieve horizontal waving effects.

```cpp
static int16 BgmapSprite::someHBiasEffect(BgmapSprite bgmapSprite);
```

The engine reserves a region of the param tables space for any [BgmapSprite](/documentation/api/class-bgmap-sprite/) initialized with a [BgmapSpriteSpec](/documentation/api/struct-bgmap-sprite-spec/) that sets its display mode as `__WORLD_HBIAS`. The manipulation of that space is done through the `param` attribute. Refer to the official Virtual Boy's documentation for the meaning of the param table for h-bias effects.

#### Frame blending

It is possible to go beyond the Virtual Boy's 4 color palette, black plus 3 shades of red, with a technique called "frame blending" (also often referred to as "HiColor"). If one pixel shows one color in one game frame, but another in the next, through the effects of persistence of vision, the pixel's color actually _appears_ to be in-between those two _frame blended_ colors.

The appearance of frame blended colors is very stable on an original Virtual Boy, especially if used sparingly. The larger an area of a frame blended color becomes, the more it flickers. Note that on emulators, due to the Virtual Boy's refresh rate of 50Hz usually not matching the refresh rate of the screen the emulator image is being viewed on, there's a much heavier flickering visible on frame blended colors.

Factoring in all possible combinations, with this technique it would theoretically be possible to achieve up to 10 different colors. However, mixing adjacent colors, e.g. medium red and bright red, yields the most pleasant to the eye, as in most stable, least flickering, results, while combinations of colors with larger distances, e.g. black and bright red, so flicker more and also do not differ much from those mixes of adjacent colors, not adding substantially to the palette of available colors. Thus, we have settled to work with a palette of 7 colors, containing only combinations of adjacent colors.

<a href="/documentation/images/user-guide/graphics/7-color-palette.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/user-guide/graphics/7-color-palette.png"/></a>

[VUEngine](https://github.com/VUEngine/VUEngine-Core) includes a special [Sprite](/documentation/api/class-sprite/), [FrameBlendBgmapSprite](/documentation/api/class-frame-blend-bgmap-sprite/), that supports frame blending out of the box. It takes a [Texture](/documentation/api/class-texture/) that is basically a vertical spritesheet containing two frames of the same image that differ only in pixels that should be blended. Each game frame, the [FrameBlendBgmapSprite](/documentation/api/class-frame-blend-bgmap-sprite/) toggles between displaying the upper or the lower half of the [Texture](/documentation/api/class-texture/) to the user.

This way, a higher visual fidelity can be achieved on a per-[Sprite](/documentation/api/class-sprite/) basis, at the cost of higher CHAR and BGMAP memory requirements.

The following shows an example of a frame blending [Texture](/documentation/api/class-texture/) and how the resulting 7 color image would appear to the player.

<a href="/documentation/images/user-guide/graphics/frame-blending-sfc-split.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/user-guide/graphics/frame-blending-sfc-split.png" width="272"/></a> → <a href="/documentation/images/user-guide/graphics/frame-blending-sfc-7-color.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/user-guide/graphics/frame-blending-sfc-7-color.png" width="272"/></a>

### OBJECT Sprites

The [ObjectSprite](/documentation/api/class-object-sprite/) uses OBJECTs to render CHARs in one of the 4 posible WORLDS in OBJECT display mode. As all the [Sprites](/documentation/api/class-sprite/), they use a [Texture](/documentation/api/class-texture/), but its map is used directly by the [ObjectSprite](/documentation/api/class-object-sprite/) to configure the OBJECTs. They are more flexible than [BgmapSprites](/documentation/api/class-bgmap-sprite/), but use more memory and are heavier to process, both by the CPU and the VIP.

## Wireframes

The other kind of visual component are [Wireframes](/documentation/api/class-wireframe/). These are non solid 3D shapes that draw 1 pixel wide lines or circles. They leverage the ability of writing directly to the video frame buffers after the VIP has finished its drawing procedures during the current game frame. Accessing video memory with the CPU is slow and even more so when reading back from it, which is unavoidable when drawing single pixels.

<figure>
    <a href="/documentation/images/user-guide/graphics/wireframe-pyramid.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Example of a Wireframe Mesh">
        <img src="/documentation/images/user-guide/graphics/wireframe-pyramid.png" width="256"/>
    </a>
    <figcaption>
        Example of a Wireframe Mesh
    </figcaption>
</figure>

[Wireframe](/documentation/api/class-wireframe/) creation and configuration is done with a [WireframeSpec](/documentation/api/struct-wireframe-spec/), which look like the following:

```cpp
MeshROMSpec ActorMeshSpec =
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
    (PixelVector(*)[2])ActorMeshSegments
};
```

The engine provides a few kinds of Wireframes: [Mesh](/documentation/api/class-mesh), [Line](/documentation/api/class-line), [Sphere](/documentation/api/class-sphere) and [Asterisk](/documentation/api/class-asterisk). Depending on the specific class, its corresponding **Spec** will add specific attributes. In the case of a [MeshSpec](/documentation/api/struct-mesh-spec/), it requires an array of segments:

```cpp
const PixelVector ActorMeshSegments[][2]=
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

Then, as it was the case with [Sprites](/documentation/api/class-sprite/), a [Wireframe](/documentation/api/class-wireframe/) can be instantiated by calling the corresponding manager:

```cpp
extern WireframeSpec ActorMeshSpec;

Wireframe wireframe = Wireframe::safeCast(ComponentManager::createComponent(NULL, (ComponentSpec*)&ActorMeshSpec));

if(!isDeleted(wireframe))
{
    Vector3D wireframePosition =
    {
        -__PIXELS_TO_METERS(__SCREEN_WIDTH / 2), __PIXELS_TO_METERS(__SCREEN_HEIGHT / 2), 0, 0
    };

    Wireframe::setPosition(wireframe, &wireframePosition);
}

```

## Printing

[VUEngine](https://github.com/VUEngine/VUEngine-Core) uses a special [Entity](/documentation/api/class-entity/) to provide a printing facility, both for UI and gaming purposes, as for helping debugging. The following are the available methods to print different primitive data types:

```cpp
    /// Print a string.
    /// @param string: String to print
    /// @param x: Column to start printing at
    /// @param y: Row to start printing at
    /// @param font: Name of font to use for printing
    void text(const char* string, int32 x, int32 y, const char* font);

    /// Print an integer value.
    /// @param value: Integer to print
    /// @param x: Column to start printing at
    /// @param y: Row to start printing at
    /// @param font: Name of font to use for printing
    void int32(int32 value, uint8 x, uint8 y, const char* font);

    /// Print a hex value.
    /// @param value: Hex value to print
    /// @param x: Column to start printing at
    /// @param y: Row to start printing at
    /// @param length: Digits to print
    /// @param font: Name of font to use for printing
    void hex(WORD value, uint8 x, uint8 y, uint8 length, const char* font);

    /// Print a float value.
    /// @param value: Float value to print
    /// @param x: Column to start printing at
    /// @param y: Row to start printing at
    /// @param precision: How many decimals to print
    /// @param font: Name of font to use for printing
    void float(float value, uint8 x, uint8 y, int32 precision, const char* font);
```

The [Printer](/documentation/api/class-printer/) is used as follows:

```cpp
Printer::text
(
    "Hello World",
    0,
    0,
    "Default"
);
```

To erase all printing, use:

```cpp
Printer::clear();
```

[VUEngine](https://github.com/VUEngine/VUEngine-Core) comes with a default font for writing to the printing Layer, but you can replace it with any number of custom fonts.

## Animations

Only [Sprites](/documentation/api/class-sprite/) support animations. There are basically 2 ways to allocate the graphical data for animations in the system’s video memory:

- To load all the CHARs for all the frames of animation at once
- To load only the CHARs that correspond to a single frame of animation at any given time

The first approach puts stress on video memory since depending on the size of each frame and the number of animation frames, it can quickly deplete CHAR memory. The second alternative puts the stress on the CPU because it has to rewrite the pixel data when the frame of animation changes. Using one or the other depends on the memory and performance requirements of the game.

[CharSets](/documentation/api/class-char-set/) can be shared by multiple [Textures](/documentation/api/class-texture/). Whether this is the case or not, is determined by the shared flag of the [CharSetSpec](/documentation/api/struct-char-set-spec/):

```cpp
CharSetROMSpec ActorCharsetSpec =
{
    // Number of chars in function of the number of frames to load at the same time
    4 * 6,

    // Whether it is shared or not
    true,

    // Whether the tiles are optimized or not
    false,

    // Tiles array
    ActorTiles,

    // Frame offsets array
    NULL,
};
```

When requesting a [CharSet](/documentation/api/class-char-set/) by providing a shared [CharSetSpec](/documentation/api/struct-char-set-spec/), the engine will only allocate a [CharSet](/documentation/api/class-cha-set/) once, and any subsequent request will be served with the previously created instance. This saves both work and graphics memory, as well as CPU time.

The overshoot of a shared [CharSetSpec](/documentation/api/struct-char-set-spec/) that only allocates a single frame at any given moment is that any [Sprite](/documentation/api/class-sprite/) that uses a [Texture](/documentation/api/class-texture/) which reference that [CharSet](/documentation/api/class-char-set/) will show a change of animation if any of them changes the frame, making all instances to be in sync:

<a href="/documentation/images/user-guide/graphics/punk-chars-shared.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/user-guide/graphics/punk-chars-shared.png" width="500" /></a>

Since it would be overkill to play animations on all [Sprites](/documentation/api/class-sprite/) underlied by a shared [CharSet](/documentation/api/class-char-set/), the engine runs the animations only on the first Sprite.

On th other hand, when using a non-shared [CharSetSpec](/documentation/api/struct-char-set-spec/) to create a [CharSet](/documentation/api/class-char-set/), each request will be served with a new [CharSet](/documentation/ap/class-char-set/) instance. This permits to have different sprites with the same graphics but displaying different frames of animation:

<a href="/documentation/images/user-guide/graphics/punk-chars-nonshared.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/user-guide/graphics/punk-chars-nonshared.png" width="500" /></a>

To load the complete pixel data of all the animation frames of an animation, the [CharSetSpec](/documentation/api/struct-char-set-spec/) must specify the total amount of CHARs used by all of the:

```cpp
CharSetROMSpec ActorMultiframeCharsetSpec =
{
    // Number of chars in function of the number of frames to load at the same time
    4 * 6 * 12,

    // Whether it is shared or not
    true,

    // Whether the tiles are optimized or not
    false,

    // Tiles array
    ActorTiles,

    // Frame offsets array
    NULL,
};
```

Allocating all frames of animation has a meaning in regards to [Textures](/documentation/api/class-texture/) too. [Textures](/documentation/api/class-texture/) define how to organize the CHARs or tiles of a [CharSet](/documentation/api/class-cha-set/) into a bidimensional plane. This order can be applied directly when displaying the image using OBJECTs through instances of [ObjectSprite](/documentation/api/class-object-sprite/). But when using BGMAPs with [BgmapSprites](/documentation/api/class-bgmap-sprite/), the [Texture](/documentation/api/class-texture/)’s map has to be allocated in BGMAP memory to be displayed by means of a WORLD. In this case, there is an analogous difference between allocating all the frames of the animation at once or only one.

To load all the maps for all the animation frames of an animation in BGMAP memory, the [TextureSpec](/documentation/api/struct-texture-spec/) must specify the total number of frames:

```cpp
TextureROMSpec ActorMultiframeTextureSpec =
{
    (CharSetSpec*)&ActorMultiframeCharsetSpec,

    // Pointer to the map array that defines how to use the tiles from the char set
    Map,

    // Horizontal size in tiles of the texture (max. 64)
    4,

    // Vertical size in tiles of the texture (max. 64)
    6,

    // Padding added to the size for affine/hbias transformations (cols, rows)
    {0, 0},

    // Number of frames that the texture supports
    12,

    // Palette index to use by the graphical data (0 - 3)
    0,

    // Flag to recycle the texture with a different map
    false,

    // Flag to vertically flip the image
    false,

    // Flag to horizontally flip the image
    false,
};
```

In this scenario, each [Sprite](/documentation/api/class-sprite/) that uses the same [Texture](/documentation/api/class-texture/) can display a different frame of the animation.
