---
layout: documentation
parents: Documentation > Tutorial
title: Collisions
---

# Collisions

The only piece of functionality that still needs to be added to the game, before we can confidently call it Pong, is collisions. And that's exactly what we will be doing next.

[Colliders](/documentation/api/class-collider/) are the missing [Components](/documentation/api/class-component/) in our [Actors](/documentation/api/class-actor/) so they can interact with each other. But before adding them, we need to understand In-Game Types and Collider Layers.

## In-Game Types

An In-Game Type is an [Actor](/documentation/api/class-component/) enum attribute that can be used to identify the type of game object that one is interacting with without having to rely on RTTI (which is kind of expensive). So, let's create an _InGameTypes_ file and add to it two entries - "Disk" and "Paddle".

<a href="/documentation/images/tutorial/in-game-types.png" data-toggle="lightbox" data-gallery="gallery" data-caption="In-Game Types "><img src="/documentation/images/tutorial/in-game-types.png" /></a>

## Collider Layers

A Collider Layer is an enum that is useful to cull off uncessary collision checks between [Colliders](/documentation/api/class-collider/) that belong to [Actors](/documentation/api/class-component/) that don't need to interact with each other. For example, a paddle doesn't need to check collisions against the other. So, their [Colliders](/documentation/api/class-collider/) should mutually ignore each other. To do so, each [Collider](/documentation/api/class-collider/) has a property that flags on which Collider Layers it "exists" and another that signals which Collider Layers to ignore when checking for collisions. With this idea in mind, the paddles' [Colliders](/documentation/api/class-collider/) should live in the "Paddle" layer and they should ignore the "Paddle" layer too. In contrast, the disk's [Collider](/documentation/api/class-collider/) should not ignore the "Paddle" Collider layer.

So, let's create the Collider Layers by adding a _ColliderLayers_ file in the _config_ folder and add the following to it:

<a href="/documentation/images/tutorial/collider-layers.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Collider Layers"><img src="/documentation/images/tutorial/collider-layers.png" /></a>

## Adding Colliders

Now we are ready to add [Colliders](/documentation/api/class-collider/) to the paddles and disk. Just open their respective _.actor_ files and the corresponding component to them.

The Disk's [Collider](/documentation/api/class-collider/) configuration should look like this:

<a href="/documentation/images/tutorial/disk-collider.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Disk collider"><img src="/documentation/images/tutorial/disk-collider.png" /></a>

And the paddles' should be configured as follows:

<a href="/documentation/images/tutorial/paddle-collider.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Paddle collider"><img src="/documentation/images/tutorial/paddle-collider.png" /></a>

Notice that the toggle for collision checking in the paddle's [Collider](/documentation/api/class-collider/) configuration is disabled. This is because there is no reason to waste performance by performing the test for collisions against the disk when the latter will already be doing checks for itself.

## Adding Walls

Almost there! We are just missing walls for the disk to not go out through the screen's top or bottom sides. Let's first add a "Wall" In-Game Type in the _config/InGameTypes_ file and a "Wall" Collider Layer in the _config/ColliderLayers_ file:

<figure style="width: 48%">
    <a href="/documentation/images/tutorial/wall-in-game-type.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Wall In-Game Type">
        <img src="/documentation/images/tutorial/wall-in-game-type.png" />
    </a>
    <figcaption>
        Wall In-Game Type
    </figcaption>
</figure>
<figure style="width: 48%">
    <a href="/documentation/images/tutorial/wall-collider-layer.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Wall Collider Layer">
        <img src="/documentation/images/tutorial/wall-collider-layer.png" />
    </a>
    <figcaption>
        Wall Collider Layer
    </figcaption>
</figure>

We can now create a _Wall.actor_ in _assets/Actor/Wall_ and add a [Collider](/documentation/api/class-collider/) that lives in the "Wall" layer to it.

<a href="/documentation/images/tutorial/wall-actor.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Wall Actor"><img src="/documentation/images/tutorial/wall-actor.png" /></a>

Also make sure that the Disk's [Collider](/documentation/api/class-collider/) checks collisions against others in the "Wall" Collider Layer.

<a href="/documentation/images/tutorial/disk-collider-wall.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Disk Wall Collider Layer"><img src="/documentation/images/tutorial/disk-collider-wall.png" /></a>

Finally, we'll place the walls at the top and bottom of the screen in the [Stage](/documentation/api/struct-stage-spec/)'s **PongStageActors** array.

```cpp
[...]
extern ActorSpec WallActorSpec;

PositionedActorROMSpec PongStageActors[] =
{
    {&DiskActorSpec,                {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&PlayerPaddleActorSpec,        {-180, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&AIPaddleActorSpec,            {180, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&WallActorSpec,                {0, -120, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&WallActorSpec,                {0, 120, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
    {&LowPowerIndicatorActorSpec,   {-192 + 8, 112 - 4, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},

    {NULL, {0, 0, 0}, {0, 0, 0}, {1, 1, 1}, 0, NULL, NULL, NULL, false},
};
```

If you don't like that the paddles get out of the screen, enable the collision checks in their [Collider](/documentation/api/class-collider/) and add the "Wall" Collider Layer to the layers that it checks.

We now have a basic Pong clone!

## Improving the disk's behavior

The Pong's disk reaction is not very interesting at the moment. We can improve it by artificially modifying its vertical speed in function of the collision point in relation go the paddle. To do so, in the `Disk` class, override the [Entity::collisionStarts](/documentation/api/class-entity/):

```cpp
mutation class Disk : Actor
{
    /// Process a newly detected collision by one of the component colliders.
    /// @param collisionInformation: Information struct about the collision to resolve
    /// @return True if the collider must keep track of the collision to detect if it persists and when it
    /// ends; false otherwise
    override bool collisionStarts(const CollisionInformation* collisionInformation);

    [...]
}
```

```cpp
#include <InGameTypes.h>

[...]

bool Disk::collisionStarts(const CollisionInformation* collisionInformation)
{
    bool returnValue = Base::collisionStarts(this, collisionInformation);

    Entity collidingEntity = Collider::getOwner(collisionInformation->otherCollider);

    switch(Entity::getInGameType(collidingEntity))
    {
        case kTypePaddle:
        {
            Vector3D velocity = *Body::getVelocity(this->body);

            fixed_t yDisplacement = this->transformation.position.y - Entity::getPosition(collidingEntity)->y;

            velocity.y += yDisplacement;

            Body::setVelocity(this->body, &velocity);
        }

        break;
    }

    return returnValue;
}
```

We now have a basic but fully functional Pong game. But it would be more interesting if it displayed scores, right? Let's add that [in the next step](/documentation/tutorial/pong-manager/) <i class="fa fa-arrow-right"></i>.
