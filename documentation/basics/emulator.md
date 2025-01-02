---
layout: documentation
title: Emulator
---

# Emulator

[...]

<span class="keys" data-osx="⇧⌥R">Shift+Alt+R</span>

## The Built-In Emulator

[...]

### Key Bindings

[...]

## Red Viper

As a secondary built-in emulator, VUEngine Studio supports playtesting on a Nintendo 3DS using the [Red Viper](https://github.com/skyfloogle/red-viper) emulator (version v0.9.5 and up). This allows you to comfortably preview in stereo at true 50Hz. The integration utilizes the VBLink protocol to wirelessly send your ROM over your home WiFi.

### Setup

Boot up Red Viper and press Y on the main menu to set it to listen for new ROMs being transferred via VBLink.

<a href="/documentation/images/basics/emulator/red-viper-vblink.png"><img src="/documentation/images/basics/emulator/red-viper-vblink.png"/></a>

The above screen displays your Nintendo 3DS' IP address, `192.168.5.206` in this case. Configure VUEngine Studio accordingly and set Red Viper as the default emulator, as seen in the following screenshot.

<a href="/documentation/images/basics/emulator/red-viper-set-ip.png"><img src="/documentation/images/basics/emulator/red-viper-set-ip.png" width="800"/></a>

### Usage

If Red Viper is set as the default emulator and as long as Red Viper is on the VBLink screen listening on the configured IP address, you're now able to use it just like any other emulator.

## Custom Emulator Configurations

As an alternative to using the built-in emulator, you can also configure custom emulator configurations. This can be useful if for instance an external emulator offers functionality that is not present in the built-in one.

To set up your custom configurations, open the Preferences dialog and [...]

Example:

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

To configure VUEngine Studio to make use of any of your custom emulator configurations, you have to choose it as the new default emulator using the command `Emulator: Set Default Emulator Config`.

Note that this command writes the name of your chosen emulator config to a preference like below. So be aware that you have to reset it in case you change the name of the respective emulator configuration.

```json
"emulator.custom.default": "Mednafen (Anaglyph)"
```
