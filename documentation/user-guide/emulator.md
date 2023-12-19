---
layout: documentation
title: Emulator
---

# Emulator

[...]

<span class="keys target-os-osx">⇧⌥R</span><span class="keys target-os-not-osx">Shift+Alt+R</span>

## The Built-In Emulator

[...]

### Key Bindings

[...]

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
