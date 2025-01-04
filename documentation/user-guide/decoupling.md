---
layout: documentation
title: Decoupling
---

# Decoupled Interactions
The engine implements the following mechanisms to avoid the implementation of bespoke methods for interaction between instances of different classes that tightly couple them.

Messages

Messages can be enums or strings that are sent between objects or propagated through hierarchies of Actors or lists of Components.

The ListenerObject class implements various helper methods to send messages around:

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

These are useful when, for example, an Actor processing a collision needs to inform the colliding Entity about it.

In the following example, when a Projectile hits a Entity of type kTypeEnemy, instead of calling a bespoke method on the colliding object that would depend on its class and would require the including of the header file where it is declared, it can send a message to it:

```cpp
bool Projectile::collisionStarts(const CollisionInformation* collisionInformation __attribute__ ((unused)))
{
    Entity collidingEntity = Collider::getOwner(collisionInformation->otherCollider);

    if(!isDeleted(collidingEntity))
    {
        switch(Entity::getInGameType(collidingEntity))
        {
            case kTypeEnemy:
                {
                    Projectile::sendMessageTo
                    (
                        0, ListenerObject::safeCast(this), ListenerObject::safeCast(collidingEntity), 
                        kMessageProjectileHitYou, NULL
                    );
                }
                break;
        }
    }

    return false;
}
```

And the colliding object can still have an specific reaction to the collision by processing the message sent to it:

```cpp
bool Enemy::handleMessage(Telegram telegram)
{
    switch(Telegram::getMessage(telegram))
    {
        case kMessageProjectileHitYou:
            {                
                Enemy::hitByProjectile(this);
            }
            break;
    }

    return Base::handleMessage(this, telegram);
}
```

Messages can be propagated too, instead of being specifically directed to a known ListenerObject. Usually, the propagation starts at the Stage’s level and is done through the GameState’s interface:

```cpp
bool PongState::onRemoteGoneAway(ListenerObject eventFirer __attribute__((unused)))
{
	CommunicationManager::disableCommunications(CommunicationManager::getInstance());

	PongState::propagateMessage(this, kMessagePongResetPositions);

	return false;
}
```

And any interested Entity can process the message and let it be forwarded to other Entitys, but returning false, or they can stop the propagation by returning true -or acknowledging the processing of the message-: 

```cpp
bool PongBall::handlePropagatedMessage(int32 message)
{
	switch(message)
	{
		case kMessagePongResetPositions:

			PongBall::prepareToMove(this);
			break;
	}

	return false;
}
```

Messages that acts as commands can be propagated to the components attaching to a Entity:

```cpp
void Entity::hide()
{
    VisualComponent::propagateCommand(cVisualComponentCommandHide, this);
}
```

Events

ListenerObjects can listen for events or fire them. This enables to implement event driven behavior where it makes sense to, for example, avoid the need of constantly polling for some condition to happen.

To listen for events, an EventListener plus a scope object must be attached to a ListenerObject:

```cpp
    Pong::addEventListener
    (
        this, ListenerObject::safeCast(this), (EventListener)Pong::onPongBallOutOfBounds, kEventPongBallStreamedOut
    );
```

An EventListener method must return a boolean and receive a ListenerObject as the event firer:

```cpp
bool Pong::onPongBallOutOfBounds(ListenerObject eventFirer __attribute__ ((unused)))
{
    Pong::printScore(this);

    RumbleManager::startEffect(&PointRumbleEffectSpec);

    SoundManager::playSound
    (
        SoundManager::getInstance(), &Point1SoundSpec, NULL, kSoundPlaybackNormal, NULL, NULL
    );

    return true;
}
```

If the EventListener returns false, it is removed from the eventFirer’s list of listeners; to retain the listener, the function must return true.

An event is fired by calling fireEvent on an instance of ListenerObject:

```cpp
    Pong::fireEvent(this, kEventPongRemoteInSync);
```