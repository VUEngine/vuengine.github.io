---
layout: documentation
title: Enhancing build times on Windows
---

# Enhancing build times on Windows

On Windows, build times can be painfully slow. However, if you're running Windows 10 or upwards, you can greatly enhance build times by using the Windows Subsystem for Linux (WSL).

1.  Ensure that you have the Windows Subsystem for Linux enabled, and that you're using Windows Build version 18362 or later. To enable WSL run this command in a PowerShell prompt with admin privileges.

        Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux

2.  In a PowerShell prompt with admin privileges run the following command to install Ubuntu in WSL 1. Note that WSL 1 is recommended over WSL 2 for much faster file access.

        wsl --set-default-version 1
        wsl --install --distribution=Ubuntu

3.  When installation is complete, your newly installed Linux distro is being launched. Follow the on-screen instructions to create a new user.

4.  Update the distro:

        sudo apt update && sudo apt upgrade

5.  Install required libraries:

        sudo apt install make libmpfr-dev libmpc-dev

6.  VUEngine Studio automatically detects WSL when it is installed. You might have to restart with <span class="keys target-os-osx">⌘R</span><span class="keys target-os-not-osx">Ctrl+R</span> to pick up the change if you just installed WSL.
