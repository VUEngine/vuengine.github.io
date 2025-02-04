---
layout: documentation
parents: Documentation > Tutorial
title: Scoring
---

# Scoring

The `PongManager` doesn't to much right now besides processing the user input and instruction the paddles to move in the input direction.

Since it is the class in charge of handling the game's logic, it should be the one keeping track of the score. Lets add some attributes for that to it:

```cpp
class PongManager : ListenerObject
{
    [...]

    /// Scoring
    uint32 leftScore;
    uint32 rightScore;

    [...]
}
```

And intialize the attributes:

```cpp
void PongManager::constructor(Stage stage)
{
    [...]

    this->leftScore = 0;
    this->rightScore = 0;

    [...]
}
```

We can infer the side that score the point by checking the position of the disk when it is destroyed, update and print it:

```cpp
#include <Printer.h>

[...]

bool PongManager::onEvent(ListenerObject eventFirer __attribute__((unused)), uint16 eventCode)
{
    switch(eventCode)
    {
        case kEventActorDeleted:
        {
            if(__GET_CAST(Disk, eventFirer))
            {
                if(0 < Disk::getPosition(eventFirer)->x)
                {
                    this->leftScore++;
                }
                else
                {
                    this->rightScore++;
                }

                PongManager::printScore(this);
            }

    [...]
}

[...]

void PongManager::printScore()
{
    Printer::int32(this->leftScore, 24 - 3, 0, NULL);
    Printer::int32(this->rightScore, 24 + 3, 0, NULL);
}
```

The first time that either side scores a point, you will probably notice that the wrong score values show in the screen. It is because the [CharSet](/documentation/api/class-char-set/) that is used for printing is loaded after the disk's [CharSet](/documentation/api/class-char-set/) and when the later is destroyed for the first time, CHAR memory gets defragmented by the [CharSetManager](/documentation/api/class-char-set-manager/), causing the printing [CharSet](/documentation/api/class-char-set/) to be defragmented, which requires the re-print any text.

The [Printer](/documentation/api/class-printer/) fires the `kEventFontRewritten` when its [CharSets](/documentation/api/class-char-set/) get defragmented. So, we just need to listen for it and react appropriately:

```cpp
void PongManager::constructor(Stage stage)
{
    [...]

    Printer::addEventListener(Printer::getInstance(), ListenerObject::safeCast(this), kEventFontRewritten);
}

[...]

bool PongManager::onEvent(ListenerObject eventFirer __attribute__((unused)), uint16 eventCode)
{
    switch(eventCode)
    {
        [...]
        
        case kEventFontRewritten:
        {
            PongManager::printScore(this);

            return true;
        }

    [...]
}
```