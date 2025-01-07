---
layout: documentation
title: Rumble Effects
---

# Rumble Effects

Rumble effects can be sent to a compatible device through the EXT port by means of the `RumbleManager` instance, which receives a **RumbleEffectSpec** that specifies the kind of effect to produce:

```cpp
RumbleEffectROMSpec PointRumbleEffectSpec =
{
    // Effect #
    56,
    // Frequency
    __RUMBLE_FREQ_240HZ,
    // Positive Sustain
    80,
    // Negative Sustain
    255,
    // Overdrive
    126,
    // Break
    255,
    // Stop before starting
    true,
};
```

To produce the effect, call `RumbleManager::startEffect` with a valid **RumbleEffectSpec**:

```cpp
extern RumbleEffectSpec PointRumbleEffectSpec;

RumbleManager::startEffect(&PointRumbleEffectSpec);
```
