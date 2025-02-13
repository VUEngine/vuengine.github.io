---
layout: documentation
parents: Documentation > User Guide
title: Decoupling
---

# Decoupling

The engine implements the following mechanisms to avoid the implementation of bespoke methods for interaction between instances of different classes that would couple them tightly.

## Messages

Messages can be `enums` or strings that are sent between objects or propagated through hierarchies of [Actors](/documentation/api/class-actor/) or lists of [Components](/documentation/api/class-component/).

The [ListenerObject](/documentation/api/class-listener-object/) class implements various helper methods to send messages around:

```cpp
/// Send a message to another object.
/// @param receiver: ListenerObject that is the target of the message
/// @param message: The message's code
/// @param delay: Milliseconds to wait before sending the message
/// @param randomDelay: Range of a random delay in milliseconds to wait before sending the message
void sendMessageTo(ListenerObject receiver, uint32 message, uint32 delay, uint32 randomDelay);

/// Send a message to itself.
/// @param message: The message's code
/// @param delay: Milliseconds to wait before sending the message
/// @param randomDelay: Range of a random delay in milliseconds to wait before sending the message
void sendMessageToSelf(uint32 message, uint32 delay, uint32 randomDelay);
```

These are useful when, for example, an [Actor](/documentation/api/class-actor/) processing a collision needs to inform the colliding [Entity](/documentation/api/class-entity/) about it.

In the following example, when an [Actor](/documentation/api/class-actor/) hits an [Entity](/documentation/api/class-entity/) of type `kTypeSomeEntityType`, instead of calling a bespoke method on the colliding object that would depend on its class and would require the inclusion of the header file where it is declared, it can send a message to it:

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
                    SomeActor::sendMessageTo(this, ListenerObject::safeCast(collidingEntity), kMessageTouchedBySomeActor, 0, 0);
                }
                break;
        }
    }

    return false;
}
```

And the colliding object can still have an specific reaction to the collision by processing the message sent to it:

```cpp
bool SomeOtherActor::handleMessage(Telegram telegram)
{
    switch(Telegram::getMessage(telegram))
    {
        case kMessageTouchedBySomeActor:
        {
            // Do interesting stuff
            break;
        }
    }

    return Base::handleMessage(this, telegram);
}
```

Messages can be propagated too, instead of being specifically directed to a known [ListenerObject](/documentation/api/class-listener-object/). Usually, the propagation starts at the [Stage](/documentation/api/class-stage/)’s level and is done through the [GameState](/documentation/api/class-game-state/)’s interface:

```cpp
    SomeGameState::propagateMessage(this, kMessageSomeMessage);
```

And any interested [Entity](/documentation/api/class-entity/) can process the message and let it be forwarded to other instance of [Entity](/documentation/api/class-entity/), by returning false, or they can stop the propagation by returning true -or acknowledging the processing of the message-:

```cpp
bool SomeClass::handlePropagatedMessage(int32 message)
{
    switch(message)
    {
        case kMessageSomeMessage:
        {
            // Do interesting stuff
            break;
        }
    }

    return false;
}
```

Messages that acts as commands can be propagated to the components attaching to an [Entity](/documentation/api/class-entity/):

```cpp
void Entity::hide()
{
    ComponentManager::propagateCommand(cVisualComponentCommandHide, this, kSpriteComponent);
}
```

## Events

[ListenerObjects](/documentation/api/class-listener-object/) can listen for events or fire them. This permits the implementation of event driven behavior where it makes sense to, for example, avoid the need of constantly polling for some condition to happen.

To listen for events, add an event listener to a [ListenerObject](/documentation/api/class-listener-object/):

```cpp
SomeClass::addEventListener
(
    someObject, ListenerObject::safeCast(someOtherObject), kEventInteresting
);
```

Events are catched and processed by overriding the [ListenerObject](/documentation/api/class-listener-object/)'s `onEvent` method:

```cpp
bool SomeClass::onEvent(ListenerObject eventFirer, uint16 eventCode)
{
    switch(eventCode)
    {
        case kEventInteresting1:
        {
            // Do interesting stuff
            [...]

            // By returning true, the listener is kept
            return true;
        }

        case kEventInteresting2:
        {
            // Do interesting stuff
            [...]

            // By returning false, the listener is dropped
            return false;
        }
    }

    return Base::onEvent(this, eventFirer, eventCode);
}
```

If the `onEvent` method returns `false`, it is removed from the eventFirer’s list of listeners; to retain the listener, the method must return `true`.

An event is fired by calling `fireEvent` on an instance of [ListenerObject](/documentation/api/class-listener-object/):

```cpp
SomeClass::fireEvent(this, kEventInteresting);
```
