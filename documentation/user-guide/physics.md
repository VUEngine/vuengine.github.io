---
layout: documentation
parents: Documentation > User Guide
title: Physics
---

# Physics

The engine provides basic physics simulations by means of the [Body](/documentation/api/class-body/) [Component](/documentation/api/class-component/) and collisions through various classes of [Colliders](/documentation/api/class-collider/).

## Body

A [Body](/documentation/api/class-body/) is a [Component](/documentation/api/class-component/) that attaches to an [Entity](/documentation/api/class-entity/). It has basic properties like mass, friction, bounciness, maximum speed and maximum velocity, etc. A [BodySpec](/documentation/api/struct-body-spec/) determines how to initialize these properties when instantiating a [Body](/documentation/api/class-body/):

```cpp
BodyROMSpec SomeActorBodySpec =
{
    // Component
    {
        // Allocator
        __TYPE(Body),

        // Component type
        kPhysicsComponent
    },

    // Create body
    true,

    // Mass
    __F_TO_FIXED(0.5f),

    // Friction
    __F_TO_FIXED(0.1f),

    // Bounciness
    __F_TO_FIXED(0),

    // Maximum velocity
    {__I_TO_FIXED(0), __I_TO_FIXED(0), __I_TO_FIXED(0)},

    // Maximum speed
    __F_TO_FIXED(3),

    // Axises on which the body is subject to gravity
    __NO_AXIS,

    // Axises around which to rotate the owner when syncronizing with body
    __NO_AXIS
    };
```

An [Entity](/documentation/api/class-entity/) with a [Body](/documentation/api/class-body/) attached to it will react to forces applied to it:

```cpp
    Vector3D force =
    {
        Body::getMass(SomeActor::getBody(actor)), 0, 0

    };

    // If the object has a collider attached to it, the last argument
    // forces to check if the movement in the force's direction won't
    // result immediately in a collision
    Actor::applyForce(actor, &force, true);
```

## Collider

A [Collider](/documentation/api/class-collider/) is a [Component](/documentation/api/class-component/) that attaches to an [Entity](/documentation/api/class-entity/) too, and is capable of sensing collisions with other [Colliders](/documentation/api/class-collider/) and informing its owner about these events.

The engine provides a few kinds of [Collider](/documentation/api/class-collider/): [Balls](/documentation/api/class-ball/), [Boxes](/documentation/api/class-box/), [LineFields](/documentation/api/class-linefield/).

The typical [ColliderSpec](/documentation/api/class-collider-spec/) looks like the following:

```cpp
ColliderROMSpec SomeActorColliderSpec =
{
    // Component
    {
        // Allocator
        __TYPE(Box),

        // Component type
        kColliderComponent
    },

    // Size (x, y, z)
    {16, 38, 24},

    // Displacement (x, y, z, p)
    {0, 1, 0, 0},

    // Rotation (x, y, z)
    {0, 0, 0},

    // Scale (x, y, z)
    {0, 0, 0},

    // If true this collider checks for collisions against other colliders
    true,

    // Layers in which I live
    kLayerActor,

    // Layers to ignore when checking for collisions
    ~(kLayerSolid | kLayerDangers),
};
```

In order to reduce the number of collision checks as much as possible, the [Collider](/documentation/api/class-collider/) can be configured to be passive: it doesn’t check for collisions itself, but others can still check for collisions against it. Another property used to improve performance is the layers in which a [Collider](/documentation/api/class-collider/) logically exists. This, in conjunction with the property that defines layers to ignore when checking for collisions, helps to reduce the number of tests per game cycle. For example, A [Particle](/documentation/api/class-particle/) might need to bounce when colliding with the floor, but it doesn’t need to test if it collides with an item; in this case, the item’s [Collider](/documentation/api/class-collider/) may be set to live in a collider layer that the [Particle](/documentation/api/class-particle/)’s collider ignores.

Besides memory and performance, there are no other limitations with regards to how many [Colliders](/documentation/api/class-collider/) can be added to the same [Entity](/documentation/api/class-entity/).

Collision are processed by overriding the following [Entity](/documentation/api/class-entity/)'s methods:

```cpp
    /// Process a newly detected collision by one of the component colliders.
    /// @param collisionInformation: Information struct about the collision to resolve
    /// @return True if the collider must keep track of the collision to detect if it persists and when it ends; false otherwise
    virtual bool collisionStarts(const CollisionInformation* collisionInformation);

    /// Process a going on collision detected by one of the component colliders.
    /// @param collisionInformation: Information struct about the collision to resolve
    virtual void collisionPersists(const CollisionInformation* collisionInformation);

    /// Process when a previously detected collision by one of the component colliders stops.
    /// @param collisionInformation: Information struct about the collision to resolve
    virtual void collisionEnds(const CollisionInformation* collisionInformation);
```

The [CollisionInformation](/documentation/api/struct-collision-information/) struct holds information about the colliding [Entity](/documentation/api/class-entity/), the collision vector, and the [Colliders](/documentation/api/class-collider/) involved in the collision event:

```cpp
bool SomeActor::collisionStarts(const CollisionInformation* collisionInformation __attribute__ ((unused)))
{
    Entity collidingEntity = Collider::getOwner(collisionInformation->otherCollider);

    if(!isDeleted(collidingEntity))
    {
        switch(Entity::getInGameType(collidingEntity))
        {
            case kTypeSomeEntityType:
                {
                    SomeActor::sendMessageTo
                    (
                        0, ListenerObject::safeCast(this), ListenerObject::safeCast(collidingEntity),
                        kMessageTouchedBySomeActor, NULL
                    );
                }
                break;
        }
    }

    return false;
}
```
