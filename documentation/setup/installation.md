---
layout: documentation
parents: Documentation > Setup
title: Installation
---

# Installation

Download the latest release for your operating system from the [Download](/downloads) page.

> One note that affects all OSes: make sure that neither the folder you run [VUEngine Studio](https://www.vuengine.dev/) from, nor your project's folder contain whitespaces. Otherwise you won't be able to build your code.

## Windows

Run the installer. It will take a little moment to install [VUEngine Studio](https://www.vuengine.dev/) to `C:\VUEngine` and automatically launch it when done.

Note that binaries are not signed and Windows might warn you about it.

## macOS

Run the installer to install `VUEngine.app` to your Applications folder.

Note that binaries are are neither signed nor authored and macOS might warn you about it. If that is the case for you, hold down either the Options key <span class="keys">⌥</span> or meta key <span class="keys">⌘</span> while right clicking the `pkg` installer and selecting "Open". MacOS will allow you to still run the setup and not warn you again in the future.

You may need to install additional libraries to be able to build your code.

#### Intel

```bash
brew reinstall libmpc
```

#### Apple Silicon (ARM)

To work on devices running Apple Silicon, you will also need a `libmpc`, but instead of `arm64` version installation of `x86_64` is required. In order to accomplish that you will need `brew` for `x86_64` machines. Skip to step 2 if you already have it installed.

1. Install brew with command:

   ```bash
   arch -x86_64 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Install the `x86_64` version of `libmpc`:

   ```bash
   arch -x86_64 /usr/local/bin/brew install libmpc
   ```

You can read more about using x86 libraries on Apple Silicon Macs [here](https://gist.github.com/progrium/b286cd8c82ce0825b2eb3b0b3a0720a0).

## Linux

[VUEngine Studio](https://www.vuengine.dev/) can be run in different ways on Linux systems. Either install the `deb` using your favorite method, e.g.

```bash
sudo dpkg -i VUEngine-Studio-X-X-X-Setup.deb
```

Or use the AppImage without an installation. e.g. with

```bash
// make the appImage executable
chmod a+x VUEngine-Studio-X-X-X.AppImage

// execute
./VUEngine-Studio-X-X-X.AppImage
```

## Bleeding Edge

To enjoy the newest additions, which might not be included in the latest stable release, you can always check out and compile [VUEngine Studio](https://www.vuengine.dev/) yourself from its [GitHub](https://github.com/VUEngine/VUEngine-Studio) repository, or grab [WIP builds](https://github.com/VUEngine/VUEngine-Studio/actions) if available (you'll need to be signed in to a Github account for the latter).

> **Note**: There might be compatibility isses with VUEngine Core, Templates and/or other sample code. We only ensure compatibility at time of releases.
