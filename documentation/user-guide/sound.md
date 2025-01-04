---
layout: documentation
title: Sound
---

# Sound

VUEngine supports two types of sound playback through a common interface: the `Sound` class. A **SoundSpec** specifies, among other properties, a list of `SoundTrack`s to play:

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

A **SoundTrackSpec** determines if the playback reproduces sounds as natively supported by the VirtualBoy’s Virtual Sound Unit (VSU) or Pulse Code Modulation data (PCM).

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

Each **SoundTrackSpec** must provide arrays for all the VSU’s hardware registers:

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

The VUEngine’s sound player is flexible enough to support all sound effects that the VSU is capable off and doesn’t require to reserve in advance any sound source, instead, it dispatches sound playback requests following a FIFO strategy as sound sources become available. This flexibility puts the responsibility of proper usage of the available resources on the sound data. Which means that priority has to be taken into account when producing sound effects and songs since sound playback requests have to be queued or ignored when there are no sound sources available at the moment of the request.

To reproduce a sound, a request to the `SoundManager`’s instance can be performed as shown below:

```cpp
    SoundManager::playSound
    (
        SoundManager::getInstance(), soundSpec, (const Vector3D*)&this->transformation.position, 
        kSoundPlaybackNormal, NULL, NULL
    );
```

A `Sound` can be acquired to control its playback as follows:

```cpp
    extern SoundSpec SampleSoundSpec;

    Sound sound = SoundManager::getSound(SoundManager::getInstance(), &SampleSoundSpec, NULL, NULL);
```

Sound playback supports spatial positioning through stereo separation if a reference to a transformation is provided when calling `Sound::play`:

```cpp
    if(!isDeleted(sound))
    {
        Sound::play(sound, &this->transformation.position, kSoundPlaybackFadeIn);
    }
```

`Sound`s can be set to auto release on completion. This is the default behavior when they are simply reproduced by calling `SoundManager::playSound`.
