---
layout: documentation
parents: Documentation > Basics
title: Settings
---

# Settings

You can configure VUEngine Studio to your liking through its various settings. Nearly every part of its editor, user interface, and functional behavior has options you can modify.

VUEngine Studio provides different scopes for settings:

- **User settings** - Settings that apply globally to any instance of VUEngine Studio you open.
- **Workspace settings** - Settings stored inside your workspace and only apply when the workspace is opened.

VUEngine Studio stores setting values in a settings JSON file. You can change settings values either by editing the settings JSON file or by using the <a href="#settings-editor">Settings editor</a>, which provides a graphical interface to manage settings.

## User settings

User settings are your personal settings for customizing VUEngine Studio. These settings apply globally to any instance of VUEngine Studio you open. For example, if you set the editor font size to 14 in your user settings, it will be 14 in all instances of VUEngine Studio on your computer.

You can access your user settings in a few ways:

- Select the **Preferences: Open Settings** command in the **Command Palette** <span class="keys" data-osx="⇧⌘P">Ctrl+Shift+P</span>
- Select the **User** tab in the <a href="#settings-editor">Settings editor</a> <span class="keys" data-osx="⌘,">Ctrl+,</span>
- Select the **Preferences: Open Settings (JSON)** command in the **Command Palette** <span class="keys" data-osx="⇧⌘P">Ctrl+Shift+P</span>

<a href="/documentation/images/basics/settings/settings-editor-user-tab.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/settings/settings-editor-user-tab.png" width="100%" /></a>

## Workspace settings

Workspace settings are specific to a project and override user settings. If you have specific settings that you want to apply to a specific project, you can use workspace settings. For example, for a certain project, you might want to set the <span class="setting">files.exclude</span> setting to exclude a certain folder from the File Explorer.

> Note: A VUEngine Studio "workspace" is usually just your project root folder. You can also have more than one root folder in a VUEngine Studio workspace through a feature called Multi-root workspaces. Get more info about VUEngine Studio workspaces.

VUEngine Studio stores workspace settings at the root of the project in a folder called `.vuengine`. This makes it easy to share settings with others in a version-controlled project.

You can access the workspace settings in a few ways:

- Select the **Preferences: Open Workspace Settings** command in the **Command Palette** <span class="keys" data-osx="⇧⌘P">Ctrl+Shift+P</span>
- Select the **Workspace** tab in the <a href="#settings-editor">Settings editor</a> <span class="keys" data-osx="⌘,">Ctrl+,</span>
- Select the **Preferences: Open Workspace Settings (JSON)** command in the **Command Palette** <span class="keys" data-osx="⇧⌘P">Ctrl+Shift+P</span>

<a href="/documentation/images/basics/settings/settings-editor-workspace-tab.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/settings/settings-editor-workspace-tab.png" width="100%" /></a>

Not all user settings are available as workspace settings. For example, application-wide settings like for application updates can not be overridden by Workspace settings.

## Settings editor

The Settings editor provides a graphical interface to manage both user and workspace settings. To open the Settings editor, navigate to **File > Settings > Settings**. Alternately, open the Settings editor from the **Command Palette** <span class="keys" data-osx="⇧⌘P">Ctrl+Shift+P</span> with **Preferences: Open Settings** or use the keyboard shortcut <span class="keys" data-osx="⌘,">Ctrl+,</span>.

When you open the Settings editor, you can search and discover the settings you are looking for. When you search using the search bar, the Settings editor filters the settings to only show those that match your criteria. This makes finding settings quick and easy.

<a href="/documentation/images/basics/settings/settings-editor-search.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/settings/settings-editor-search.png" width="100%" /></a>

VUEngine Studio applies changes to settings directly as you change them. You can identify settings that you modified by the colored bar on the left of the setting, similar to modified lines in the editor.

In the example below, the engine core path and hide build folder settings were changed.

<a href="/documentation/images/basics/settings/settings-editor-changed.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/settings/settings-editor-changed.png" width="100%" /></a>

The gear icon alongside the setting <span class="keys" data-osx="⇧F9">Shift+F9</span> opens a context menu with options to reset a setting to its default value, and to copy the setting ID, copy a JSON name-value pair, or copy the settings URL.

<a href="/documentation/images/basics/settings/settings-editor-context-menu.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/settings/settings-editor-context-menu.png" width="100%" /></a>

## Settings JSON file

VUEngine Studio stores setting values in a `settings.json` file. The Settings editor is the user interface that enables you to review and modify setting values that are stored in a `settings.json` file.

You can also review and edit the `settings.json` file directly by opening it in the editor with the **Preferences: Open Settings (JSON)** or **Preferences: Open Workspace Settings (JSON)** command in the Command Palette <span class="keys" data-osx="⇧⌘P">Ctrl+Shift+P</span>.

Settings are written as JSON by specifying the setting ID and value. You can quickly copy the corresponding JSON name-value pair for a setting by selecting the setting's gear icon in the Settings editor, and then selecting the Copy Setting as JSON action.

<a href="/documentation/images/basics/settings/settings-json.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/settings/settings-json.png" width="100%" /></a>

Some settings can only be edited in `settings.json` such as Code Actions On Save and show an Edit in `settings.json` link in the Settings editor.

### Settings file locations

#### User settings.json location

Depending on your platform, the user settings file is located here:

- **Windows**: %APPDATA%\vuengine\User\settings.json
- **macOS**: $HOME/.vuengine/settings.json
- **Linux**: $HOME/.vuengine/settings.json

#### Workspace settings.json location

Workspace settings are stored in your project's `.workspace` file.

<a href="/documentation/images/basics/settings/workspace-settings.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/settings/workspace-settings.png" width="100%" /></a>

## Reset settings

You can always reset a setting to the default value by hovering over a setting to show the gear icon, clicking on the gear icon, and then selecting the **Reset Setting** action.

While you can reset settings individually via the Settings editor, you can reset all changed settings by opening `settings.json` and deleting the entries between the braces `{}`. Be careful since there is no way to recover your previous setting values.

## Settings precedence

Configurations can be overridden at multiple levels by the different setting scopes. In the following list, _later scopes override earlier scopes_:

- Default settings - This scope represents the default unconfigured setting values.
- User settings - Apply globally to all VUEngine Studio instances.
- Workspace settings - Apply to the open folder or workspace.
- Workspace Folder settings - Apply to a specific folder of a multi-root workspace.

Setting values can be of various types:

- String - e.g. `"files.autoSave": "afterDelay"`
- Boolean - e.g. `"editor.minimap.enabled": true`
- Number - e.g. `"files.autoSaveDelay": 1000`
- Array - e.g. `"editor.rulers": []`
- Object - e.g. `"search.exclude": { "build": true }`

Values with primitive types and Array types are overridden, meaning a configured value in a scope that takes precedence over another scope is used instead of the value in the other scope. But, values with Object types are merged.

## Settings and security

Some settings allow you to specify an executable that VUEngine Studio will run to perform certain operations. For example, you can choose which shell the Integrated Terminal should use. For enhanced security, such settings can only be defined in user settings and not at workspace scope.

Here is the list of settings not supported in workspace settings:

- <span class="setting">git.path</span>
- <span class="setting">terminal.external.windowsExec</span>
- <span class="setting">terminal.external.osxExec</span>
- <span class="setting">terminal.external.linuxExec</span>

The first time you open a workspace that defines any of these settings, VUEngine Studio will warn you and then always ignore the values after that.
Settings Sync
