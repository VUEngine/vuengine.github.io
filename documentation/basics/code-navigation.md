---
layout: documentation
title: Code Navigation
---

# Code Navigation

VUEngine Studio has a high productivity code editor which, when combined with programming language services, gives you the power of an IDE and the speed of a text editor. In this topic, we'll first describe VUEngine Studio's language intelligence features (suggestions, parameter hints, smart code navigation) and then show the power of the core text editor.

## Quick file navigation

> Tip: You can open any file by its name when you type <span class="keys" data-osx="⌘P">Ctrl+P</span> (Quick Open).

The Explorer is great for navigating between files when you are exploring a project. However, when you are working on a task, you will find yourself quickly jumping between the same set of files. VUEngine Studio provides two powerful commands to navigate in and across files with easy-to-use key bindings.

The `Show All Opened Editors` command <span class="keys" data-osx="⌘K ⌘P">Ctrl+K Ctrl+P</span> shows you a list of all files open in an editor group. To open one of these files, use the arrow keys to pick the file you want to navigate to, then press `Enter` to open it.

<a href="/documentation/images/basics/code-navigation/code-navigation.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/code-navigation/code-navigation.png"/></a>

Alternatively, the `Show Next Tab` <span class="keys" data-osx="⌥⌘D">Ctrl+Alt+D</span> and `Show Previous Tab` <span class="keys" data-osx="⌥⌘A">Ctrl+Alt+A</span> commands let you cycle through opened files.

You can also use the `Go Back` <span class="keys" data-osx="⌃-" data-win="Ctrl+Left">Ctrl+Alt+-</span> and `Go Forward` <span class="keys" data-osx="⌃⇧-" data-win="Ctrl+Right">Ctrl+Alt+-</span> commands to navigate between files and edit locations. If you are jumping around between different lines of the same file, these shortcuts allow you to navigate between those locations easily.

## Breadcrumbs

The editor has a navigation bar above its contents called Breadcrumbs. It shows the current location and allows you to quickly navigate between folders, files, and symbols.

<a href="/documentation/images/basics/code-navigation/breadcrumbs.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/code-navigation/breadcrumbs.png"/></a>

Breadcrumbs always show the file path and, with the help of language extensions, the symbol path up to the cursor position. The symbols shown are the same as in Outline view and Go to Symbol.

Selecting a breadcrumb in the path displays a dropdown with that level's siblings so you can quickly navigate to other folders and files.

<a href="/documentation/images/basics/code-navigation/breadcrumbs-folders-dropdown.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/code-navigation/breadcrumbs-folders-dropdown.png"/></a>

If symbols were found in the current file, you will see the current symbol path and a dropdown of other symbols at the same level and below.

<a href="/documentation/images/basics/code-navigation/breadcrumbs-symbols-dropdown.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/code-navigation/breadcrumbs-symbols-dropdown.png"/></a>

You can turn off breadcrumbs with the `View > Toggle Breadcrumbs` toggle or with the <span class="setting">breadcrumbs.enabled</span> setting.

```json
"breadcrumbs.enabled": false
```

## Go to Definition

If known, you can go to the definition of a symbol by pressing <span class="keys">F12</span>.

If you press <span class="keys" data-osx="⌘">Ctrl</span> and hover over a symbol, a preview of the declaration will appear:

<a href="/documentation/images/basics/code-navigation/go-to-definition.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/code-navigation/go-to-definition.png" width="460"/></a>

> Tip: You can jump to the definition with <span class="keys" data-osx="⌘+Click">Ctrl+Click</span> or open the definition to the side with <span class="keys" data-osx="⌥⌘+Click">Ctrl+Alt+Click</span>.

## Go to Symbol

You can navigate symbols inside a file with the `Go To Symbol` command <span class="keys" data-osx="⇧⌘O">Ctrl+Shift+O</span>. By typing ":" the symbols will be grouped by category. Press Up or Down and navigate to the place you want.

<a href="/documentation/images/basics/code-navigation/go-to-symbol.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/code-navigation/go-to-symbol.png"/></a>

## Bracket matching

Matching brackets will be highlighted as soon as the cursor is near one of them.

<a href="/documentation/images/basics/code-navigation/bracket-matching.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/code-navigation/bracket-matching.png" width="300"/></a>

> Tip: You can jump to the matching bracket with <span class="keys" data-osx="⇧⌘\">Ctrl+Shift+\</span>

## Bracket Pair Colorization

Matching bracket pairs can also be colorized by setting <span class="setting">editor.bracketPairColorization.enabled</span> to `true`.

<a href="/documentation/images/basics/code-navigation/bracket-pair-colorization.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/code-navigation/bracket-pair-colorization.png" width="640"/></a>

All colors are themeable and up to six colors can be configured. You can use <span class="setting">workbench.colorCustomizations</span> to override these theme-contributed colors in your settings:

```json
"workbench.colorCustomizations": {
    "editorBracketHighlight.foreground1": "#FFD700",
    "editorBracketHighlight.foreground2": "#DA70D6",
    "editorBracketHighlight.foreground3": "#179fff",
}
```
