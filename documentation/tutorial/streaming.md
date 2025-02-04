---
layout: documentation
parents: Documentation > Tutorial
title: Streaming
---

# Streaming

Since we haven't implemented any sort of collisions in the game, you will notice that the disk moves back to the center of the screen after a while it has left the screen. This is the engine's streaming kicking in. The same applies to the paddles if you move the out of the screen but, in their case, since the `PongManager` references them, an assertion like the following is displayed when that happens:

<a href="/documentation/images/tutorial/paddle-exception.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Paddle exception"><img src="/documentation/images/tutorial/paddle-exception.png" /></a>

This happens because the [Stage](/documentation/api/class-stage/) is constantly checking which [Actors](/documentation/api/class-actor/) are out of bounds -within a tolerance margin configurable in the [StageSpec](/documentation/api/struct-stage-spec/)- and removes and destroys those that are beyond them. This behavior can be modified by setting to `true` the flag in the entries of the **PongStageActors** array, but we will leave it as that to make things a little bit more interesting. [Stage](/documentation/api/class-stage/) constantly test the entries in that array too in order to instantiate those [Actors](/documentation/api/class-actor/) whose that are within the screen bounds.

Now, as it happens with the disk, the paddles should be streamed back in. And they are, but since the `PongManager` is not in sync with the streaming, the pointers to the paddles become invalid, triggering the exception. To fix this, the manager has to know when the paddles are destroyed and when new ones are created.

To be notified of the destruction of the paddles, an event listener has to be added to them on the `kEventActorDeleted` event. On top of that, another listener has to be addded to the [Stage](/documentation/api/class-stage/) so the `PongManager` is notified of new [Actors](/documentation/api/class-actor/) being instantiated. To do so, the `addEventListener` method is called on each:

```cpp
void PongManager::getReady(Stage stage)
{
	if(!isDeleted(stage))
	{
		this->disk = Disk::safeCast(Stage::getChildByName(stage, (char*)DISK_NAME, false));
		this->leftPaddle = Paddle::safeCast(Stage::getChildByName(stage, (char*)PADDLE_LEFT_NAME, true));
		this->rightPaddle = Paddle::safeCast(Stage::getChildByName(stage, (char*)PADDLE_RIGHT_NAME, true));

		if(!isDeleted(this->disk))
		{
			Actor::addEventListener(this->disk, ListenerObject::safeCast(this), kEventActorDeleted);
		}

		if(!isDeleted(this->leftPaddle))
		{
			Actor::addEventListener(this->leftPaddle, ListenerObject::safeCast(this), kEventActorDeleted);
		}

		if(!isDeleted(this->rightPaddle))
		{
			Actor::addEventListener(this->rightPaddle, ListenerObject::safeCast(this), kEventActorDeleted);
		}

		Stage::addActorLoadingListener(stage, ListenerObject::safeCast(this));
	}
}
```

For the later case, we don't add an event listener directly to the [Stage](/documentation/api/class-stage/) since we want to know about the new instance and that cannot be know in advance. So, by calling `Stage::addActorLoadingListener`, it will take care of adding the listener when the [Actor](/documentation/api/class-actor/) has been created, and it will be it which fires the `kEventActorCreated` event.

But now we need to process those events that the manager is listening for. To do so, the `PongManager` has to override the [ListenerObject::onEvent](/documentation/api/class-stage/) method:

```cpp
class PongManager : ListenerObject
{
    [...]

    /// Process an event that the instance is listen for.
    /// @param eventFirer: ListenerObject that signals the event
    /// @param eventCode: Code of the firing event
    /// @return False if the listener has to be removed; true to keep it
    override bool onEvent(ListenerObject eventFirer, uint16 eventCode);

    [...]
}
```

And in its implementation, we process both events as follows:

```cpp
bool PongManager::onEvent(ListenerObject eventFirer __attribute__((unused)), uint16 eventCode)
{
	switch(eventCode)
	{
		case kEventActorDeleted:
		{
			if(NULL != this->disk && eventFirer == ListenerObject::safeCast(this->disk))
			{
				this->disk = NULL;
			}
			else if(NULL != this->leftPaddle && eventFirer == ListenerObject::safeCast(this->leftPaddle))
			{
				this->leftPaddle = NULL;
			}
			else if(NULL != this->rightPaddle && eventFirer == ListenerObject::safeCast(this->rightPaddle))
			{
				this->rightPaddle = NULL;
			}

			return true;
		}

		case kEventActorCreated:
		{
            if(__GET_CAST(Disk, eventFirer))
            {
                if(0 == strcmp(DISK_NAME, Disk::getName(eventFirer)))
                {
                    this->disk = Disk::safeCast(eventFirer);
    				Actor::addEventListener(eventFirer, ListenerObject::safeCast(this), kEventActorDeleted);
                }
            }
            else if(__GET_CAST(Paddle, eventFirer))
            {
                if(0 == strcmp(PADDLE_LEFT_NAME, Actor::getName(eventFirer)))
                {
                    this->leftPaddle = Paddle::safeCast(eventFirer);
     				Actor::addEventListener(eventFirer, ListenerObject::safeCast(this), kEventActorDeleted);
               }
                else if(0 == strcmp(PADDLE_RIGHT_NAME, Actor::getName(eventFirer)))
                {
                    this->rightPaddle = Paddle::safeCast(eventFirer);
    				Actor::addEventListener(eventFirer, ListenerObject::safeCast(this), kEventActorDeleted);
                }
			}

			return true;
		}
	}

	return Base::onEvent(this, eventFirer, eventCode);
}
```

When processing the `kEventActorDeleted` event, we check if the object that fired the event, `eventFirer`, is the same as one of the paddles or the disk and make `NULL` the pointer that matches the firer.

While the processing of `kEventActorCreated` involves downcasting the firer of the event to check the class which it is an instance of and checking its name to assign it to the proper pointer. And the event listener for the `kEventActorDeleted` has to be added to the new instance too.

Now, when the paddles get streamed out, their pointers are properly setup to prevent the usage of invalid ones. The same was done to the disk pointer.