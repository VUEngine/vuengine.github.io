---
layout: documentation
parents: Documentation > User Guide
title: Coordinate System
---

# Coordinates

The engine uses 2 coordinate systems that are transformed into one another constantly during the life cycle of any program running on it. The first one is in meters and is used by the [Entity](/documentation/api/class-entity/)’s transformation. The second coordinate system is in pixels and is used both by all the [Sprites](/documentation/api/class-sprite/) and to make it easier to build [Stages](/documentation/api/class-stage/) using screen coordinates rather than meters.

It is easier to think in pixels since their range is only a subset of the integers, but they are not good for physics simulations. That’s why meters are used for transformations. Meters allow fractional values in order to more accurately simulate Newtonian movement, but working with floats is prohibitively expensive in a platform like the Virtual Boy since its CPU lacks a dedicated arithmetic processing unit. Hence, the engine uses what are called fixed point data types.

By default, the engine uses a fixed type, fixed_t, of size 16 (bits) where the first 10 are for the integral part of the number to be stored, while the remaining lower 6 bits represent the fractional part of it. This implies that the integral range that can be represented is -512 to 512 meters, or 1024 meters in total. This imposes a hard limit on the size that the [Stages](/documentation/api/class-stage/ can have: 1024 x 1024 x 1024 meters, and each meter equals 16 pixels, therefore 16384 x 16384 x 16384 pixels. Meanwhile, the fractional part can represent 64 values between 0 and 100 (1.5625, 3.125, 4.6875,..., 100).

Sum and substraction work the same with fixed point data types, but multiplication and division require some extra operations. The following uses the macros that help to save some time when writing the latter mathematical functions:

```cpp
static inline Vector3D Vector3D::scalarProduct(Vector3D vector, fixed_t scalar)
{
    return (Vector3D)
    {
        __FIXED_MULT(vector.x, scalar),
        __FIXED_MULT(vector.y, scalar),
        __FIXED_MULT(vector.z, scalar)
    };
}

static inline Vector3D Vector3D::scalarDivision(Vector3D vector, fixed_t scalar)
{
    if(0 == scalar)
    {
        return Vector3D::zero();
    }

    return (Vector3D)
    {
        __FIXED_DIV(vector.x, scalar),
        __FIXED_DIV(vector.y, scalar),
        __FIXED_DIV(vector.z, scalar)
    };
}
```

[Transformations](/documentation/api/struct-transformation/) and its attributes are declared as follows:

```cpp
// A spatial description
typedef struct Transformation
{
    // spatial position
    Vector3D position;

    // spatial rotation
    Rotation rotation;

    // spatial scale
    Scale scale;

    // validity flag
    uint8 invalid;

} Transformation;

// 3D Spatial position
typedef struct Vector3D
{
    fixed_t x;
    fixed_t y;
    fixed_t z;

} Vector3D;

// 3D Spatial rotation (subject to gimbal lock)
typedef struct Rotation
{
    // rotation around x axis
    fixed_t x;

    // rotation around y axis
    fixed_t y;

    // rotation around z axis
    fixed_t z;

} Rotation;

// 3D scale
typedef struct Scale
{
    fix7_9 x;
    fix7_9 y;
    fix7_9 z;

} Scale;
```

[Vector3D](/documentation/api/class-vector3-d/)’s and [Rotation](/documentation/api/class-rotation/)’s components use fixed_t (10.6) data type to represent meters and degrees; while [Scale](/documentation/api/class-scale/)’s components use a fixed type with a bigger fractional precision (7.9).

Since a great deal of game logic has to do with moving [Actors](/documentation/api/class-actor/) around, but working on meters represented by 10.6 fixed point data type is not really intuitive, there are some macros and structs that help working with pixels instead and to convert to the data types that the engine uses internally:

```cpp
#define __PIXELS_TO_METERS(pixels) (fixed_t)((pixels) << (__FIXED_TO_I_BITS - __PIXELS_PER_METER_2_POWER))
#define __METERS_TO_PIXELS(meters) (((fixed_ext_t)(meters)) >> (__FIXED_TO_I_BITS - __PIXELS_PER_METER_2_POWER))
```

```cpp
Vector3D position = Vector3D::getFromPixelVector((PixelVector){0, 64, 0, 0});

Actor::setLocalPosition(this, &position);
```

When the [Camera](/documentation/api/class-camera/) is located at coordinate [0, 0, 0] in 3D space, that is in meters, with no rotation around any axis, the corresponding physical pixel on the screen is [192, 112, 0]. It means that in screen coordinates, the top left corner of the screen is at [-192, -112, 0], while the bottom right one is at [192, 112, 0]. In other words, if an [ActorSpec](/documentation/api/struct-actor-spec/) is loaded at the screen coordinate [0, 0, 0], it will show up at the center of the screen when the [Camera](/documentation/api/class-camera/) hasn’t been moved or rotated.
