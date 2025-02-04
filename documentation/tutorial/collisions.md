---
layout: documentation
parents: Documentation > Tutorial
title: Collisions
---

# Collisions

The only left piece of functionality to add to the game before we can call it Pong are collisions.

## In Game Types and Collider Layers

[Colliders](/documentation/api/class-collider/) are the missing [Components](/documentation/api/class-component/) in our [Actors](/documentation/api/class-actor/) so they interact with each other. But before adding them, we need to understand In Game Type and Collider Layers.

An In Game Type is an [Actor](/documentation/api/class-component/) enum attribute that can is used to identify the type of game object that one is interacting with without having to rely on RTTI -which is kind of expensive-. So, lets create an *InGameType.* and add to it two entries: Disk and Paddle:

<a href="/documentation/images/tutorial/in-game-types.png" data-toggle="lightbox" data-gallery="gallery" data-caption="In Game Types "><img src="/documentation/images/tutorial/in-game-types.png" /></a>

A Collision Layer is an enum that is useful to cull off uncessary collision checks between [Colliders](/documentation/api/class-collider/) that belong to [Actors](/documentation/api/class-component/) that don't need to interact with each other. For example, the paddles don't need to check collisions against one another since they will never move against each other so, their [Colliders](/documentation/api/class-collider/) should ignore the other's. To do so, each [Collider](/documentation/api/class-collider/) has a property that flags on which Collision Layers it "exists" and which "Collision Layers" to ignore when checking for collisions. So, the paddles' [Colliders](/documentation/api/class-collider/) should live in the "Paddle" layer and they should ignore the "Paddle" layer too. In contrast, the disk's [Collider](/documentation/api/class-collider/) should not ignore the "Paddle" layer.

So, lets create the Collision Layers by adding a *ColliderLayers* file in the *config* folder and add the following to it:

<a href="/documentation/images/tutorial/collider-layers.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Collider Layers"><img src="/documentation/images/tutorial/collider-layers.png" /></a>

## Colliders

Now we are ready to add [Colliders](/documentation/api/class-collider/) to the paddles and disk. Just open their respective *.actor* files and the corresponding component to them.

The disk's [Collider](/documentation/api/class-collider/)'s configuration should look like this:

<a href="/documentation/images/tutorial/disk-collider.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Disk collider"><img src="/documentation/images/tutorial/disk-collider.png" /></a>

And the paddle's should be configured as follows:

<a href="/documentation/images/tutorial/paddle-collider.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Paddle collider"><img src="/documentation/images/tutorial/paddle-collider.png" /></a>

Notice that the toogle for collision checking in the paddle's [Collider](/documentation/api/class-collider/)'s configuration is disabled. This is because there is no reason to loose performance by making the test for collisions against the disk when the latter will already be doing checks for itself.

Finally, we should have a barebone Pong clone!