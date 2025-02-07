---
layout: documentation
parents: Documentation > Basics
title: User Interface
---

# User Interface

VUEngine Studio's user interface is modeled after Visual Studio Code, but with more flexibility and an additional right sidepanel and sidebar in mind. Like many other code editors, [VUEngine Studio](https://www.vuengine.dev/) adopts a common user interface and layout of an explorer on the left, showing all of the files and folders you have access to, and an editor in the center, showing the content of the files you have opened.

<a href="/documentation/images/basics/user-interface/user-interface.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/user-interface/user-interface.png" width="100%" /></a>

## Layout

[VUEngine Studio](https://www.vuengine.dev/) comes with a simple and intuitive layout that maximizes the space provided for the editor while leaving ample room to browse and access the full context of your folder or project. The UI is divided into the following areas:

- **(A) Sidepanels** - Located on the far left-hand and right-hand sides, this lets you switch between views and gives you additional context-specific indicators, like the number of outgoing changes when Git is enabled, number of connected flash carts, etc.
- **(B) Sidebars** - Contains different views like the Explorer to assist you while working on your project.
- **(C) Editor** - The main area to edit your files. You can open as many editors as you like side by side vertically and horizontally.
- **(D) Bottom Panel** - You can display different panels below the editor region for output or debug information, errors and warnings, or an integrated terminal.
- **(E) Status Bar** - Information about the opened project and the file you're editing as well as build, emulator and flash cart statuses.
- **(F) Toolbar** - A freely configurable toolbar that comed pre-loaded with e.g. buttons to build your project, see progress, queue running in an emulator or flashing to your flash cart(s) on the right hand side and editor buttons on the left.

You can freely drag and drop editors and widgets between all the editor area, sidebar and bottom panel.

Each time you start [VUEngine Studio](https://www.vuengine.dev/), it opens up in the same state it was in when you last closed it. The last opened project, folder, layout, and opened files are preserved.

You can revert to the default layout with the `View: Reset Workbench Layout` command.

## Tabs

Open files in each editor are displayed with tabbed headers (Tabs) at the top of the editor region. When you open a file, a new Tab is added for that file. Tabs let you quickly navigate between items and you can Drag and Drop Tabs to reorder them.

When you have more open items than can fit in the title area, you can use the `View: Show All Opened Editors` command to display a dropdown list of tabbed items.

## Side by side editing

You can open as many editors as you like side by side vertically and horizontally. You can either drag and drop an opened file to any side of the editor region, or right click it and select any of `Split Up/Down/Left/Right`.

<a href="/documentation/images/basics/user-interface/side-by-side-editing.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/user-interface/side-by-side-editing.png" width="600" /></a>

Whenever you open another file, the editor that is active will display the content of that file. So if you have two editors side by side and you want to open file "file.c" into the right-hand editor, make sure that editor is active (by clicking inside it) before opening file "file.c". Editors will open to the right-hand side of the active one.

## Minimap

A Minimap (code outline) gives you a high-level overview of your source code, which is useful for quick navigation and code understanding. A file's minimap is shown on the right side of the editor. You can click or drag the shaded area to quickly jump to different sections of your file.

<a href="/documentation/images/basics/user-interface/minimap.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/user-interface/minimap.png" width="600" /></a>

You can move the minimap to the left hand side, disable it completely, change the scale and more with the following settings:

```json
"editor.minimap.side": "right"
"editor.minimap.enabled": true
"editor.minimap.renderCharacters": true
"editor.minimap.scale": 1
"editor.minimap.showSlider": "mouseover"
"editor.minimap.maxColumn": 120
```

## Indent Guides

In the above image, you can also see indentation guides (vertical lines) in the editor, which help you quickly see matching indent levels. If you would like to disable indent guides, you can set "editor.renderIndentGuides": false in your user or workspace settings.

```json
"editor.renderIndentGuides": false
```

## Explorer

The Explorer is used to browse, open, and manage all of the files and folders in your project. [VUEngine Studio](https://www.vuengine.dev/) is file and folder based - you can get started immediately by opening a file or folder in [VUEngine Studio](https://www.vuengine.dev/).

After opening a folder in [VUEngine Studio](https://www.vuengine.dev/), the contents of the folder are shown in the Explorer. You can do many things from here:

- Create, delete, and rename files and folders.
- Move files and folders with drag and drop.
- Use the context menu to explore all options.

> **Tip:** You can drag and drop files into the Explorer from outside [VUEngine Studio](https://www.vuengine.dev/) to copy them (if the explorer is empty [VUEngine Studio](https://www.vuengine.dev/) will open them instead)

[VUEngine Studio](https://www.vuengine.dev/) works very well with other tools that you might use, especially command-line tools. If you want to run a command-line tool in the context of the folder you currently have open in [VUEngine Studio](https://www.vuengine.dev/), right-click the folder and select <span class="target-os-win">`Open in Command Prompt`</span><span class="target-os-not-win">`Open in Terminal`</span>.

> **Tip:** Type <span class="keys" data-osx="⌘P">Ctrl+P</span> to quickly search and open a file by its name.

By default, [VUEngine Studio](https://www.vuengine.dev/) excludes some folders from the Explorer (for example. .git). Use the `files.exclude` setting to configure rules for hiding files and folders from the Explorer.

### Multi-selection

You can select multiple files in the **File Explorer** and **OPEN EDITORS** view to run actions (Delete, Drag and Drop, Open) on multiple items. Use the <span class="keys" data-osx="⌘">Ctrl</span> key with <span class="keys">click</span> to select individual files and <span class="keys">Shift + click</span> to select a range. If you select two items, you can use the context menu `Compare with Each Other` command to quickly diff two files.

### Filtering the document tree

You can type to filter the currently visible files in the **File Explorer**. With the focus on the **File Explorer** start to type part of the file name you want to match. You will see a filter box in the top-right of the **File Explorer** showing what you have typed so far and matching file names will be highlighted. When you press the cursor keys to move up and down the file list, it will jump between matching files or folders.

Hovering over the filter box and selecting **Enable Filter on Type** will show only matching files/folders. Use the 'X' **Clear** button to clear the filter.

<a href="/documentation/images/basics/user-interface/filtering-the-document-tree.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/user-interface/filtering-the-document-tree.png" width="300" /></a>

### Open Editors

The Explorer holds an additional view labeled **OPEN EDITORS**. It is hidden by default and can be enabled by right clicking on the Exlorer header and checking the `Open Editors` option.

This is a list of active files or previews. These are files you previously opened in [VUEngine Studio](https://www.vuengine.dev/) that you were working on. For example, a file will be listed in the **OPEN EDITORS** view if you:

- Make a change to a file.
- Double-click a file's header.
- Double-click a file in the Explorer.
- Open a file that is not part of the current folder.

Just click an item in the **OPEN EDITORS** view, and it becomes active in [VUEngine Studio](https://www.vuengine.dev/).

Once you are done with your task, you can remove files individually from the **OPEN EDITORS** view, or you can remove all files by using the `Close All Editors` or `Close Group` actions.

## Views

The Explorer is just one of the Views available in [VUEngine Studio](https://www.vuengine.dev/). There are also Views for:

- Build - The project build panel.
- Documentation - Browse this documentation within [VUEngine Studio](https://www.vuengine.dev/).
- Extensions - Install and manage extensions within [VUEngine Studio](https://www.vuengine.dev/).
- Flash Carts - Lets you write your built ROM to any flash carts.
- History - Git history of currently opened file.
- Image Conversion - Image conversion logs.
- Output - Generic output panel.
- Plugins - VUEngine Plugins management.
- Problems - List of problems in workspace.
- Properties - Properties of currently opened file.
- Search - Provides global search and replace across your open folder.
- Source Control - [VUEngine Studio](https://www.vuengine.dev/) includes Git source control by default.
- Other - Views contributed by extensions.

> **Tip:** You can open any view using the `View: Open View` command.

### Sidebars

The Sidebars on the left and right let you quickly switch between Views. You can also reorder Views by dragging and dropping them on the respective Sidebar or remove a View entirely (right click and select "Close").

## Command Palette

[VUEngine Studio](https://www.vuengine.dev/) is equally accessible from the keyboard. The most important key combination to know is <span class="keys" data-osx="⇧⌘P">Shift+Ctrl+P</span>, which brings up the **Command Palette**. From here, you have access to all of the functionality of [VUEngine Studio](https://www.vuengine.dev/), including keyboard shortcuts for the most common operations.

<a href="/documentation/images/basics/user-interface/command-palette.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/user-interface/command-palette.png" width="600" /></a>

The **Command Palette** provides access to many commands. You can execute editor commands, open files, build your project, convert images, etc, all using the same interactive window. Here are a few tips:

- <span class="keys" data-osx="⌘P">Ctrl+P</span> will let you navigate to any file or symbol by typing its name
- <span class="keys" data-osx="⇧⌘P">Shift+Ctrl+P</span> will bring you directly to the editor commands
- <span class="keys" data-osx="⇧⌘O">Shift+Ctrl+O</span> will let you navigate to a specific symbol in a file
- <span class="keys">⌃G</span> will let you navigate to a specific line in a file

Type "?" into the input field to get a list of available commands you can execute from there.

## Editor Configuration

[VUEngine Studio](https://www.vuengine.dev/) gives you many options to configure the editor. From the **View** menu, you can hide or toggle various parts of the user interface, such as the Side Panels, Status Bar, and Bottom Panel.

### Settings

Most editor configurations are kept in settings which can be modified directly. You can set options globally through user settings, per project through workspace settings, or per folder. Settings values are kept in a `settings.json` file in the user folder or currently opened folder under a `.vuengine` folder, or in a workspace file.

- Select File > Preferences > Open Settings (UI) (or press <span class="keys" data-osx="⌘,">Ctrl+,</span>) to edit the user `settings.json` file.
- To edit workspace settings, select the **Workspace** tab to edit the settings saved to the current workspace file.
- To edit folder settings, select the **Folder** tab to edit the settings saved to the current folder.

## Preview Mode

When you single-click or select a file in the Explorer, it is shown in a preview mode and reuses an existing Tab. This is useful if you are quickly browsing files and don't want every visited file to have its own Tab. When you start editing the file or use double-click to open the file from the Explorer, a new Tab is dedicated to that file.

Preview mode is indicated by italics in the Tab heading:

<a href="/documentation/images/basics/user-interface/preview-mode.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/user-interface/preview-mode.png" width="600" /></a>

If you'd prefer to not use preview mode and always create a new Tab, you can control the behavior with this setting:

```json
"editor.enablePreview": false
```
