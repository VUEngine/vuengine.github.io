---
layout: documentation
parents: Documentation > Tutorial
title: Project Setup
---

# Project Setup

The very first thing to do, if you haven't already, is to [download and install VUEngine Studio](/documentation/setup/installation/).

Launch [VUEngine Studio](https://www.vuengine.dev/) and you will be greeted with the [Welcome view](/documentation/basics/getting-started/) when starting it for the first time (or whenever you don't currently have any project loaded).

<figure>
    <a href="/documentation/images/tutorial/welcome-view.png" data-toggle="lightbox" data-gallery="gallery" data-caption="The Welcome View">
        <img src="/documentation/images/tutorial/welcome-view.png" width="640"/>
    </a>
    <figcaption class="pullup">
        The Welcome View
    </figcaption>
</figure>

## Create the Project

Click the **New Project** button to bring up the **Create New Project** dialog. Alternatively, you can bring it up through the main menu with `Help > Welcome` or through the command palette <span class="keys" data-osx="⇧⌘P">Ctrl+P</span>, choosing the `Welcome` command.

In the **Create New Project** dialog, give the project a name, we will call it just "Pong". Enter your name as the author, and select the Barebone template to start off with a minimal boilerplate project.

<figure>
    <a href="/documentation/images/tutorial/create-new-project-dialog.png" data-toggle="lightbox" data-gallery="gallery" data-caption="The Create New Project dialog">
        <img src="/documentation/images/tutorial/create-new-project-dialog.png" width="640"/>
    </a>
    <figcaption class="pullup">
        The Create New Project dialog
    </figcaption>
</figure>

Finally, click the **Create** button and [VUEngine Studio](https://www.vuengine.dev/) will create and open the project. Once your project has loaded, the File Explorer will be open. The `pong` folder contains your project's files. The others, `core` and `plugins` are handy shortcuts to the (readonly) [VUEngine Core](https://github.com/VUEngine/VUEngine-Core) and [VUEngine Plugins](https://github.com/VUEngine/VUEngine-Plugins) sources that ship with [VUEngine Studio](https://www.vuengine.dev/).

<figure>
    <a href="/documentation/images/tutorial/fresh-project.png" data-toggle="lightbox" data-gallery="gallery" data-caption="First time opening the new project">
        <img src="/documentation/images/tutorial/fresh-project.png" width="640"/>
    </a>
    <figcaption class="pullup">
        First time opening the new project
    </figcaption>
</figure>

## First Build & Run

Let's [build](/documentation/basics/building/) and [run](/documentation/basics/emulator/) our new project for the first time, before we head on to make any modifications, to be sure things are working fine so far. In the toolbar, on the top right of the IDE, click the **Build** button. Then click the **Run** button right next to it to schedule the game to be started in the built-in emulator once the build is done.

If everything goes well, you will eventually be greeted by the screen on the right.

<figure style="width: 48%">
    <a href="/documentation/images/tutorial/building.png" data-toggle="lightbox" data-gallery="gallery" data-caption="The Build view">
        <img src="/documentation/images/tutorial/building.png"/>
    </a>
    <figcaption class="pullup">
        The Build view
    </figcaption>
</figure>
<figure style="width: 48%">
    <a href="/documentation/images/tutorial/sucessful-build.png" data-toggle="lightbox" data-gallery="gallery" data-caption="The Emulator view">
        <img src="/documentation/images/tutorial/sucessful-build.png"/>
    </a>
    <figcaption class="pullup">
        The Emulator view
    </figcaption>
</figure>

Now that we have set up our project and confirmed that it's building just fine, we are ready to start [diving into the code](/documentation/tutorial/first-steps/) <i class="fa fa-arrow-right"></i>.
