---
layout: documentation
title: Installation
---

# Installation

Download the latest release for your operating system from the <a href="/downloads">Download</a> page.

> One note that affects all OSes: make sure that neither the folder you run VUEngine Studio from, nor your project's folder contain whitespaces. Otherwise you won't be able to build your code.

## Windows

Run the installer. It will take a little moment to install VUEngine Studio to `C:\VUEngine`, then automatically launch it when done.

Note that binaries are not signed and Windows might warn you about it.

## macOS

Unzip and move `VUEngine.app` to your Applications folder. Double click to start.

Note that binaries are are neither signed nor authored and macOS might warn you about it. If that is the case for you, hold down the Options (⌥) key while double clicking and macOS will allow you to still open VUEngine Studio and not warn you again in the future.

You may need to install additional libraries to be able to build your code.

    brew reinstall libmpc

> Note: The bundled version of gcc has been built for Intel Macs. So if you're on an Apple Silicon (M1/M2) device, you'll need to install libmpc via brew for x86 versions and manually copy files to usr/local/lib.

## Linux

VUEngine Studio is not yet available for Linux distributions.

## Bleeding Edge

To enjoy the newest additions, which might not be included in the latest stable release, you can always check out and compile VUEngine Studio yourself from the <a href="https://github.com/VUEngine/VUEngine-Studio">GitHub</a> repository, or grab <a href="https://github.com/VUEngine/VUEngine-Studio/actions">pre-compiled WIP versions</a> if available.

Note, thought, that there might be compatibility problems with VUEngine Core, Templates and/or other sample code. We only ensure compatibility at time of releases.
