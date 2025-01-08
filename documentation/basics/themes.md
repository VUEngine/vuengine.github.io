---
layout: documentation
title: Themes
---

# Themes

Apart from various settings to customize the IDE to your likings, VUEngine Studio also allows you to customize its visual appearance through two different kinds of themes: **Color Themes** and **File Icon Themes**.

## Color Themes

Color themes let you modify the colors in VUEngine Studio's user interface to suit your preferences and work environment.

<a href="/documentation/images/basics/themes/theme-picker.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/themes/theme-picker.png" width="500" /></a>

### Selecting the Color Theme

- In VUEngine Studio, open the Color Theme picker with **File > Preferences > Color Theme** or the keyboard shortcut <span class="keys" data-osx="⌘K ⌘T">Ctrl+K Ctrl+T</span>.
- Use the cursor keys to highlight a theme and preview it.
- Select the theme you want and press <span class="keys">Enter</span>.

The active color theme is stored in your user settings (<span class="keys" data-osx="⌘,">Ctrl+,</span>).

```json
"workbench.colorTheme": "dark"
```

> Tip: By default, the theme is stored in your user settings and applies globally to all workspaces. You can also configure workspace or folder specific theme. To do so, set a theme in the Workspace or folder settings.

### Color Themes from the Marketplace

There are a few out-of-the-box color themes in VUEngine Studio for you to try.

Many more user-made themes can be found in the Extension Marketplace. If you find one you want to use, install it and restart VUEngine Studio and the new theme will be available.

You can search for themes in the Extensions view (<span class="keys" data-osx="⇧⌘X">Shift+Ctrl+X</span>) search box using the `@category:"themes"` filter.

<a href="/documentation/images/basics/themes/themes-extensions.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/themes/themes-extensions.png" width="300" /></a>

## File Icon Themes

File icon themes can be contributed by extensions and selected by users as their favorite set of file icons. File icons are shown in the File Explorer and tabbed headings.

### Selecting the File Icon Theme

- In VUEngine Studio, open the File Icon Theme picker with **File > Preferences > File Icon Theme** or the `Preferences: File Icon Theme` command from the Command Palette (<span class="keys" data-osx="⇧⌘P">Shift+Ctrl+P</span>).
- Use the cursor keys to preview the icons of the theme.
- Select the theme you want and hit <span class="keys">Enter</span>.

<a href="/documentation/images/basics/themes/file-icon-theme-picker.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/themes/file-icon-theme-picker.png" width="500" /></a>

By default, the VUEngine Studio file icon set is used and those are the icons you see in the File Explorer. Once a file icon theme is selected, the selected theme will be remembered and appear again whenever VUEngine Studio is restarted. You can disable file icons by selecting None.

To install more file icon themes, you can browse the Extension Marketplace to find available themes.

The active File Icon theme is persisted in your user settings (<span class="keys" data-osx="⌘,">Ctrl+,</span>).

```json
"workbench.iconTheme": "vuengine-studio-file-icons"
```
