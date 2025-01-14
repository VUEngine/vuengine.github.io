---
layout: documentation
parents: Documentation > User Guide
title: Sound
---

# Sound

[VUEngine](https://github.com/VUEngine/VUEngine-Core) supports two types of sound playback through a common interface: the [Sound](/documentation/api/class-sound/) class. A [SoundSpec](/documentation/api/struct-sound-spec/) specifies, among other properties, a list of [SoundTracks](/documentation/api/class-sound-track/) to play:

```cpp
SoundTrackROMSpec* const MenuSongSoundTracks[] =
{
    &MenuSongSoundTrack1,
    &MenuSongSoundTrack2,
    &MenuSongSoundTrack3,
    &MenuSongSoundTrack4,
    &MenuSongSoundTrack5,
    &MenuSongSoundTrack6,
    NULL,
};

SoundROMSpec MenuSongSoundSpec =
{
    // Name
    "MenuSong",

    // Play in loop
    true,

    // Tick duration in US
    3140,

    // Tracks
    (SoundTrackSpec**)MenuSongSoundTracks
};
```

A [SoundTrackSpec](/documentation/api/struct-sound-track-spec/) determines if the playback reproduces sounds as natively supported by the Virtual Boy’s Virtual Sound Unit (VSU) or Pulse Code Modulation data (PCM).

```cpp
SoundTrackROMSpec MenuSongSoundTrack1 =
{
    /// kTrackNative, kTrackPCM
    kTrackNative,

    /// Skip if no sound source available?
    true,

    /// Total number of samples (0 if not PCM)
    0,

    /// Keyframes that define the track
    (SoundTrackKeyframe*)MenuSongSoundTrack1Keyframes,

    /// SxINT values
    (uint8*)MenuSongSoundTrack1SxINT,

    /// SxLRV values
    (uint8*)MenuSongSoundTrack1SxLRV,

    /// SxFQH and SxFQL values
    (uint16*)MenuSongSoundTrack1SxFQ,

    /// SxEV0 values
    (uint8*)MenuSongSoundTrack1SxEV0,

    /// SxEV1 values
    (uint8*)MenuSongSoundTrack1SxEV1,

    /// SxRAM pointers
    (int8**)MenuSongSoundTrack1SxRAM,

    /// SxSWP values
    (uint8*)MenuSongSoundTrack1SxSWP,

    /// SxMOD values
    (int8**)NULL
};
```

Each [SoundTrackSpec](/documentation/api/struct-sound-track-spec/) must provide arrays for all the VSU’s hardware registers:

```cpp
/// Sound source mapping
/// @memberof VSUManager
typedef struct VSUSoundSource
{
    uint8 SxINT;
    uint8 spacer1[3];
    uint8 SxLRV;
    uint8 spacer2[3];
    uint8 SxFQL;
    uint8 spacer3[3];
    uint8 SxFQH;
    uint8 spacer4[3];
    uint8 SxEV0;
    uint8 spacer5[3];
    uint8 SxEV1;
    uint8 spacer6[3];
    uint8 SxRAM;
    uint8 spacer7[3];
    uint8 SxSWP;
    uint8 spacer8[35];
} VSUSoundSource;
```

And it has to provide a list of sound events that represent the duration of each sound played through the hardware’s sound sources:

```cpp
const SoundTrackKeyframe MenuSongSoundTrack1Keyframes[] =
{
    {60, kSoundTrackEventStart},
    {60, kSoundTrackEventSxEV1},
    {60, kSoundTrackEventSxFQ | kSoundTrackEventSxEV1},
    {60, kSoundTrackEventSxEV1},
    {60, kSoundTrackEventSxFQ | kSoundTrackEventSxEV1},
    {60, kSoundTrackEventSxFQ},
    {60, kSoundTrackEventSxEV1},
    {60, kSoundTrackEventSxFQ | kSoundTrackEventSxEV1},
    {60, kSoundTrackEventSxFQ},
    {60, kSoundTrackEventSxEV1},
    {60, kSoundTrackEventSxFQ | kSoundTrackEventSxEV1},
    {0, kSoundTrackEventEnd}
};
```

The [VUEngine](https://github.com/VUEngine/VUEngine-Core)’s sound player is flexible enough to support all sound effects that the VSU is capable off and doesn’t require to reserve in advance any sound source, instead, it dispatches sound playback requests following a FIFO strategy as sound sources become available. This flexibility puts the responsibility of proper usage of the available resources on the sound data. Which means that priority has to be taken into account when producing sound effects and songs since sound playback requests have to be queued or ignored when there are no sound sources available at the moment of the request.

To reproduce a sound, a request to the [SoundManager](/documentation/api/class-sound-manager/)’s instance can be performed as shown below:

```cpp
SoundManager::playSound
(
    soundSpec, (const Vector3D*)&this->transformation.position,
    kSoundPlaybackNormal, NULL, NULL
);
```

A [Sound](/documentation/api/class-sound/) can be acquired to control its playback as follows:

```cpp
extern SoundSpec SampleSoundSpec;

Sound sound = SoundManager::getSound(&SampleSoundSpec, NULL, NULL);
```

Sound playback supports spatial positioning through stereo separation if a reference to a [Transformation](/documentation/api/struct-transformations/) is provided when calling [Sound::play](/documentation/api/class-sound/#a70097b312319605afa05f6b2e72f4834):

```cpp
if(!isDeleted(sound))
{
    Sound::play(sound, &this->transformation.position, kSoundPlaybackFadeIn);
}
```

[Sounds](/documentation/api/class-sound/) can be set to auto release on completion. This is the default behavior when they are simply reproduced by calling `SoundManager::playSound`.

## Timer settings

The engine plays sounds during the timer interrupts, which are controlled by the [TimerManager](/documentation/api/class-timer-manager/). The configuration of the hardware's timer can affect the output sound, this is a pressing fact when playing back PCM sound tracks.

The timer can be configured at any time during the execution of a program, but it is usual to configure it once per [Stage](/documentation/api/class-stage/). In the [StageSpec](/documentation/api/struct-stage-spec/) there is a field for the timer settings:

```cpp
/// An Stage Spec
/// @memberof Stage
typedef struct StageSpec
{
    AllocatorPointer allocator;

    /// Timer config
    struct Timer
    {
        /// Timer's resolution (__TIMER_100US or __TIMER_20US)
        uint16 resolution;

        /// Target elapsed time between timer interrupts
        uint16 targetTimePerInterrupt;

        /// Timer interrupt's target time units
        uint16 targetTimePerInterrupttUnits;

    } timer;

    [...]
};
```

The resolution corresponds to the hardware's capabilities of ticking at 20 or 100 us intervals. Hence, a resolution of `__TIMER_20US` allows for greater precision between interrupts.

The target time per interrupt, measured either in milliseconds or in microseconds depending on the value of the target timer per interrupt units attribute (`kMS` or `kUS`), is the disired time interval between interrupts.

Usually, a target timer per interrupt of 5, 10, or even 20 ms is good enough for rich sound effects and songs during gameplay. Depending on the [Stage](/documentation/api/class-stage/), firing more interrupts per second can have a negative impact on the performance of the game.

In the case of PCM playback, a high frequency interrupt triggering is required to achieve acceptable sound playback and to reduce the noise, product of the fact that the VSU is not designed to reproduce such sounds and they are basically hacked together to make them possible on the platform.

The following table shows some general guidance on what is achievable, although the actual results are highly dependent on the load on the [Stage](/documentation/api/class-stage/)'s complexity:

<table class="table">
  <thead>
    <tr>
      <th scope="col">
        Target Hz
      </th>
      <th scope="col">
        Theoretical us/interrupt
      </th>
      <th scope="col">
        Real us/interrupt
      </th>
      <th scope="col">
        Effective us/interrupt
      </th>
      <th scope="col">
        Real Hz
      </th>
      <th scope="col">
        Notes
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td>44000</td>
        <td>23</td>
        <td>-25</td>
        <td>-20</td>
        <td>43478</td>
        <td>Impossible</td>
    </tr>
    <tr>
        <td>24000</td>
        <td>42</td>
        <td>-6</td>
        <td>0</td>
        <td>23810</td>
        <td>Impossible</td>
    </tr>
    <tr>
        <td>16000</td>
        <td>63</td>
        <td>15</td>
        <td>20</td>
        <td>15873</td>
        <td>Unfeasible / Not selectable </td>
    </tr>
    <tr>
        <td>11025</td>
        <td>91</td>
        <td>43</td>
        <td>40</td>
        <td>10989</td>
        <td>Unfeasible / Crashes</td>
    </tr>
    <tr>
        <td>9000</td>
        <td>111</td>
        <td>63</td>
        <td>60</td>
        <td>9009</td>
        <td>Maximum with an empty stage</td>
    </tr>
    <tr>
        <td>8000</td>
        <td>125</td>
        <td>77</td>
        <td>80</td>
        <td>8000</td>
        <td>Maximum, without animations</td>
    </tr>
    <tr>
        <td>7000</td>
        <td>143</td>
        <td>95</td>
        <td>100</td>
        <td>6993</td>
        <td>Achievable in very simple scenes</td>
        </tr>
    <tr>
        <td>6000</td>
        <td>167</td>
        <td>119</td>
        <td>120</td>
        <td>5988</td>
        <td>Realistic target</td> 
        </tr>
    <tr>
        <td>5500</td>
        <td>182</td>
        <td>134</td>
        <td>140</td>
        <td>5495</td>
        <td>Realistic target</td> 
        </tr>
    <tr>
        <td>5000</td>
        <td>200</td>
        <td>152</td>
        <td>160</td>
        <td>5000</td>
        <td>Realistic target, with some animations</td> 
        </tr>
    <tr>
        <td>4500</td>
        <td>222</td>
        <td>174</td>
        <td>180</td>
        <td>4505</td>
        <td>Minimum acceptable quality</td> 
        </tr>
    <tr>
        <td>4000</td>
        <td>250</td>
        <td>202</td>
        <td>200</td>
        <td>4000</td>
        <td>Sounds terrible</td> 
    </tr>
  </tbody>
</table>
