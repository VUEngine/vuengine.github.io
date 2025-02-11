---
layout: documentation
parents: Documentation > Basics
title: Emulator
---

# Emulator

As part of [VUEngine Studio](https://www.vuengine.dev/)'s build chain, you can run your project on an emulator through the emulator sidebar or with the command `Run on Emulator` <span class="keys" data-osx="⇧⌥R">Shift+Alt+R</span>. If no ROM exists yet, or a build is currently in progress, running in the emulator will be queued to happen after the build has succeeded.

[VUEngine Studio](https://www.vuengine.dev/) comes with a built-in, fully embedded emulator, but of course, any emulator can be configured to be used instead.

## The Built-In Emulator

<figure>
    <a href="/documentation/images/basics/emulator/built-in-emulator.png" data-toggle="lightbox" data-gallery="gallery" data-caption="The Built-In Emulator">
        <img src="/documentation/images/basics/emulator/built-in-emulator.png"/>
    </a>
    <figcaption class="pullup">
        The Built-In Emulator
    </figcaption>
</figure>

### Key Bindings

The built-in emulator's key bindings try to mimick the Virtual Boy controller's buttom layout on a keyboard and is as follows.

- Left D-Pad Up: <span class="keys">E</span>
- Left D-Pad Left: <span class="keys">S</span>
- Left D-Pad Right: <span class="keys">F</span>
- Left D-Pad Down: <span class="keys">D</span>
- B Button: <span class="keys">N</span>
- A Button: <span class="keys">M</span>
- Select Button: <span class="keys">V</span>
- Start Button: <span class="keys">B</span>
- Left Trigger Button: <span class="keys">G</span>
- Right Trigger Button:<span class="keys">H</span>
- Right D-Pad Up: <span class="keys">I</span>
- Right D-Pad Left: <span class="keys">J</span>
- Right D-Pad Right: <span class="keys">L</span>
- Right D-Pad Down: <span class="keys">K</span>

There's also the following functional key bindings as a secondary way to access the respective toolbar function.

- Toggle Pause <span class="keys">Space</span>
- Reset <span class="keys">F10</span>
- Audio Mute <span class="keys">Q</span>
- Toggle Low Power Signal <span class="keys">W</span>
- Frame Advance <span class="keys">↑</span>
- Toggle Fast Forward <span class="keys">→</span>
- Toggle Slow Motion <span class="keys">↓</span>
- Rewind <span class="keys">←</span>
- Save State <span class="keys">1</span>
- Load State <span class="keys">2</span>
- Increase Save State Slot <span class="keys">4</span>
- Decrease Save State Slot <span class="keys">3</span>
- Fullscreen <span class="keys">O</span>
- Take Screenshot <span class="keys">F9</span>
- Toggle Controls <span class="keys">Overlay</span>

All of the key bindings above can be changed in the emulator's Input overlay that can be toggled through the toolbar.

<figure>
    <a href="/documentation/images/basics/emulator/built-in-emulator-keybindings.png" data-toggle="lightbox" data-gallery="gallery" data-caption="The built-in emulator's keybinding overlay">
        <img src="/documentation/images/basics/emulator/built-in-emulator-keybindings.png"/>
    </a>
    <figcaption class="pullup">
        The built-in emulator's keybinding overlay
    </figcaption>
</figure>

## Red Viper

As a secondary built-in emulator, [VUEngine Studio](https://www.vuengine.dev/) supports playtesting on a Nintendo 3DS using the [Red Viper](https://github.com/skyfloogle/red-viper) emulator (version v0.9.5 and up). This allows you to comfortably preview in stereo at true 50Hz. The integration utilizes the VBLink protocol to wirelessly send your ROM over your home WiFi.

### Setup

Boot up Red Viper and press Y on the main menu to set it to listen for new ROMs being transferred via VBLink.

<a href="/documentation/images/basics/emulator/red-viper-vblink.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/emulator/red-viper-vblink.png"/></a>

The above screen displays your Nintendo 3DS' IP address, `192.168.5.206` in this case. Configure [VUEngine Studio](https://www.vuengine.dev/) accordingly and set Red Viper as the default emulator, as seen in the following screenshot.

<a href="/documentation/images/basics/emulator/red-viper-set-ip.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/emulator/red-viper-set-ip.png" width="800"/></a>

### Usage

If Red Viper is set as the default emulator and as long as Red Viper is on the VBLink screen listening on the configured IP address, you're now able to use it just like any other emulator.

## Custom Configurations

As an alternative to using the built-in emulator, you can also configure custom emulator configurations. This can be useful if for instance an external emulator offers functionality that is not present in the built-in one.

To set up your custom configurations, open the emulator sidebar, expand the Configuration Panel on the bottom and click the "+" button on the bottom.

<figure>
    <a href="/documentation/images/basics/emulator/custom-emulator.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Creating a custom emulator configuration">
        <img src="/documentation/images/basics/emulator/custom-emulator.png"/>
    </a>
    <figcaption class="pullup">
        Creating a custom emulator configuration
    </figcaption>
</figure>

An emulator config consists of the following information:

- Name: Name of the emulator (configuration), for display purposes only.
- Path: Full path to the emulator executable.
- Arguments: Arguments passed to the emulator software. Supports the placeholder %ROM% for the full path to the project ROM.

Your custom emulator configurations will be written to the <span class="setting">emulator.custom.configs</span> setting as in the following example.

```json
"emulator.custom.configs": [{
    "name": "Mednafen (Mono)",
    "path": "/absolute/path/to/mednafen",
    "args": "-vb.3dmode anaglyph -vb.anaglyph.preset disabled -vb.anaglyph.lcolor 0xff0000 -vb.anaglyph.rcolor 0x000000 -vb.xscale 2 -vb.yscale 2 %ROM%"
}, {
    "name": "Mednafen (Anaglyph)",
    "path": "/absolute/path/to/mednafen",
    "args": "-vb.3dmode anaglyph -vb.anaglyph.preset red_blue -vb.anaglyph.lcolor 0xffba00 -vb.anaglyph.rcolor 0x00baff -vb.xscale 2 -vb.yscale 2 %ROM%"
}]
```

## Default Emulator

To configure [VUEngine Studio](https://www.vuengine.dev/) to make use of any of your custom emulator configurations, you have to choose it as the new default emulator using the command `Emulator: Set Default Emulator Config` or by clicking on the respective entry in the status bar.

The default emulator will be written to the <span class="setting">emulator.custom.default</span> setting.

> **Note**: The name of your chosen default emulator is used as the setting value. So be aware that you have to reset it in case you change the name of the respective emulator configuration.
