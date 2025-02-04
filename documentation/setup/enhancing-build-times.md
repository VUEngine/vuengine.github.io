---
layout: documentation
parents: Documentation > Setup
title: Enhancing build times
---

# Enhancing build times

A whole lot of files are being thrown around during compilation of a project, and, depending on your system set up, there are different factors that can have an impact on build times.

## Antivirus software

If you're running Antivirus software on your system, you should create an exception for your project folder. It will otherwise slow down the build process if it wants to have an eye on every file that is being touched during compilation.

## Windows Subsystem for Linux

On Windows, build times can be painfully slow. However, if you're running Windows 10 or upwards, you can greatly enhance build times by using the Windows Subsystem for Linux (WSL).

1.  Ensure that you have the Windows Subsystem for Linux enabled, and that you're using Windows Build version 18362 or later. To enable WSL run this command in a PowerShell prompt with admin privileges.

```bash
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
```

2.  In a PowerShell prompt with admin privileges run the following command to install Ubuntu in WSL 1. Note that WSL 1 is recommended over WSL 2 for much faster file access.

```bash
wsl --set-default-version 1
wsl --install --distribution=Ubuntu
```

3.  When installation is complete, your newly installed Linux distro is being launched. Follow the on-screen instructions to create a new user.

4.  Update the distro:

```bash
sudo apt update && sudo apt upgrade
```

5.  Install required libraries:

```bash
sudo apt install make libmpfr-dev libmpc-dev
```

6.  [VUEngine Studio](https://www.vuengine.dev/downloads/) automatically detects WSL when it is installed. You might have to restart with <span class="keys" data-osx="⌘R">Ctrl+R</span> to pick up the change if you just installed WSL.
