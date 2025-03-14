---
layout: documentation
parents: Documentation > Basics
title: VUEngine Plugins
---

# VUEngine Plugins

[VUEngine](https://github.com/VUEngine/VUEngine-Core) is built on a modular architecture that allows to seamlessly link in and use additional components alongside the actual engine through the concept of **VUEngine Plugins**.

You can [create plugins yourself](#custom-plugins), but first and foremost, [VUEngine Studio](https://www.vuengine.dev/) comes with an extensive library of reuseable, prefab components like actors, states or fonts, that can be easily included in your VUEngine project for a good headstart and/or to add new functionality.

For example, the library covers all the basic needs of a Virtual Boy game, like an automatic pause feature, a blinking low battery indicator, various splash screens or even a save data manager to work with Save RAM, so you can focus on writing the actual game. It also offers a broad selection of ready to use fonts, post processing effects, special actors, and more.

## The Plugins Browser

You can conveniently manage your project's plugins in the Plugins Browser (**B**). Bring it up via any of the following means:

- by clicking on the plug symbol <i class="codicon codicon-plug" /> on the left side bar (**A**)
- with the keyboard shortcut <span class="keys" data-osx="⇧⌘L">Shift+Ctrl+L</span>
- with the `Toggle Plugins View` command
- through the menu: **View > Plugins**

<figure>
    <a href="/documentation/images/basics/plugins/vuengine-plugins-browser.png" data-toggle="lightbox" data-gallery="gallery" data-caption="The VUEngine Plugins Browser">
        <img src="/documentation/images/basics/plugins/vuengine-plugins-browser.png"/>
    </a>
    <figcaption class="pullup">
        The VUEngine Plugins Browser
    </figcaption>
</figure>

### Browsing Plugins

The Plugins Browser (**B**) shows a list of plugins that match the search terms you enter in the search bar (**D**).

If no search terms have been entered, installed and (not installed) recommended plugins will be listed by default.

The current search terms can be removed with the leftmost button <i class="codicon codicon-clear-all" /> of the Context Buttons (**C**) . The others allow you to show this documentation page <i class="codicon codicon-book" />, open related settings <i class="codicon codicon-settings" /> and control the visibility of views <i class="codicon codicon-ellipsis" />.

Click any plugin to open the respective detail view `(H)`, or click the Add/Remove buttons to add the plugin to, or remove it from, your project.

### Source of Truth

The list of installed plugins is stored in the `config/GameConfig` file in your project. Any changes you make by installing or uninstalling plugins will be written back to this file, which in turns triggers the re-generation of the `config.make` file in your project's root directory.

## Custom Plugins

Of course you can also create custom plugins and consume them the same way as "official" plugins. That means you will be able to find them in, and install through, the plugins browser alongside the "official" plugins.

For [VUEngine Studio](https://www.vuengine.dev/) to be able to know your custom plugins, you need to configure a root folder for them with the following setting.

```json
"plugins.user.path": "/Users/chris/dev/vb/plugins/"
```

All your custom plugins should reside in individual subfolders under this root folder. In the above case, for instance, this could be `/Users/chris/dev/vb/plugins/custom-font`.

### Creation

In the future, we plan to provide templates and a dialog for creating custom plugins, similar to the [New Project](/documentation/setup/getting-started/#new-project) dialog. For now, the recommended method is the following:

1. Find a plugin in the [VUEngine Plugins GitHub repository](https://github.com/VUEngine/VUEngine-Plugins) to use as a starting point. The repository is organized by categories, so if you want to create, for instance, a font plugin, choose any plugin from the fonts directory.
2. Copy the respective plugin to a new folder below the user plugins base folder you configured.
3. Adjust according to your own plugin's requirements.

### Configuration

What defines a VUEngine Plugin as such, is the `vuengine.plugin` in its root. Open it to configure your plugin.

<a href="/documentation/images/basics/plugins/vuengine-plugins-edit-plugin.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/plugins/vuengine-plugins-edit-plugin.png" width="100%" /></a>
