---
layout: documentation
parents: Documentation > Basics
title: Flash Carts
---

# Flash Carts

As part of [VUEngine Studio](https://www.vuengine.dev/)'s build chain, it features built-in support for writing your project's ROM to your flash cart(s), through the flash carts widget or with the command `Flash to Flash Cart` <span class="keys" data-osx="⇧⌥F">Shift+Alt+F</span>. If no ROM exists yet, or a build is currently in progress, flashing will be queued to happen after the build has succeeded. You can connect, and flash to, any number of flash carts at once.

<figure>
    <a href="/documentation/images/basics/flash-carts/flash-carts-panel.png" data-toggle="lightbox" data-gallery="gallery" data-caption="The Flash Carts Panel">
        <img src="/documentation/images/basics/flash-carts/flash-carts-panel.png" width="640"/>
    </a>
    <figcaption class="pullup">
        The Flash Carts Panel
    </figcaption>
</figure>

[VUEngine Studio](https://www.vuengine.dev/) ships with built-in configurations for all the most common Virtual Boy flash carts.

- FlashBoy
- FlashBoy Plus
- HyperBoy
- HyperFlash32

## Custom configurations

If your cart is not natively supported, you can, however, easily add custom configurations by expanding the Configuration Panel (H) and clicking the "+" button on the bottom.

<figure>
    <a href="/documentation/images/basics/flash-carts/custom-flash-cart-config.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Creating a custom Flash Cart configuration">
        <img src="/documentation/images/basics/flash-carts/custom-flash-cart-config.png" width="500" />
    </a>
    <figcaption class="pullup">
        Creating a custom Flash Cart configuration
    </figcaption>
</figure>

A flash cart config consists of the following information:

- Name: Name of the flash cart, for display purposes only.
- Size: Available flash size of the cart.
- Pad: Some carts require the ROM to be padded to the full size of the available ROM space. When this box is checked, the ROM will be padded (by repeating it) to the configured available size before it is passed to the flasher.
- Flasher Path: Full path to the flasher software to write ROMs to the cart.
- Flasher Arguments: Arguments passed to the flasher software. Support various placeholders, see list below.
- Device Codes: VID, PID as well as manufacturer and product name labels of the cart, used to detect the cart being connected via USB.

There are a few placeholders that can be used in the flasher arguments input.

- %NAME%: Name of the current project
- %NAME_NO_SPACES%: Name of the current project (without spaces)
- %ROM%: Full path to the project ROM
- %PORT%: Detected port of the flash cart

> **Note**: On Windows 10, you can't see COM ports directly. You need to open Device Manager, select `View tab` and choose `Show hidden` devices. After that, You’ll see the Ports (COM & LPT) option and only need to expand it to find COM ports.

> **Note**: On Windows, if your flash cart is not HID, like HyperFlash32 or HyperBoy, and it is not using WinUSB driver, you must install those before [VUEngine Studio](https://www.vuengine.dev/) is able to detect the cart. The recommended way is to install the most recent version of [Zadig](https://zadig.akeo.ie/) and use it to change the driver of your flash cart to WinUSB, as shown in the following screenshot.<br><br> <a href="/documentation/images/basics/flash-carts/zadig-hyperflash32.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/flash-carts/zadig-hyperflash32.png" width="600" /></a>
