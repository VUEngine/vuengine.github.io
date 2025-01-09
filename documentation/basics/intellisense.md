---
layout: documentation
parents: Documentation > Basics
title: Intellisense
---

# Intellisense

IntelliSense is a general term for various code editing features including: code completion, parameter info, quick info, and member lists. IntelliSense features are sometimes called by other names such as "code completion", "content assist", and "code hinting."

## Features

VUEngine Studio IntelliSense features are powered by a language service and such a service for Virtual C, the language used by VUEngine, comes bundled. A language service provides intelligent code completions based on language semantics and an analysis of your source code. If a language service knows possible completions, the IntelliSense suggestions will pop up as you type. If you continue typing characters, the list of members (variables, methods, etc.) is filtered to only include members containing your typed characters. Pressing Tab or Enter will insert the selected member.

You can trigger IntelliSense in any editor window by typing <span class="keys" data-osx="⌃Space">Ctrl+Space</span> or by typing a trigger character (such as color (:)).

<a href="/documentation/images/basics/intellisense/method-auto-completion.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/intellisense/method-auto-completion.png"/></a>

If documentation is available, such info will be shown to the right of the auto-complete selection by either pressing <span class="keys" data-osx="⌃Space">Ctrl+Space</span> or clicking the <i class="codicon codicon-chevron-right"></i> icon on the right. The accompanying documentation for the method will now expand to the side. The expanded documentation will stay so and will update as you navigate the list. You can close this by pressing <span class="keys" data-osx="⌃Space">Ctrl+Space</span> again or by clicking on the close icon.

After choosing a method you are provided with a parameter hint for the parameter you are currently typing. You can also bring it up manually with <span class="keys" data-osx="⇧⌘Space">Shift+Ctrl+Space</span> when your cursor is inside the brackets of a function call.

<a href="/documentation/images/basics/intellisense/method-parameters-hint.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/intellisense/method-parameters-hint.png"/></a>

If you prefer, you can turn off IntelliSense while you type. See <a href="#customizing-intelliSense">Customizing IntelliSense</a> below to learn how to disable or customize VUEngine Studio's IntelliSense features.

## Types of completions

IntelliSense gives both inferred proposals and the global identifiers of the project. The inferred symbols are presented first, followed by the global identifiers (shown by the Word icon).

<a href="/documentation/images/basics/intellisense/auto-completion-types.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/basics/intellisense/auto-completion-types.png"/></a>

VUEngine Studio IntelliSense offers different types of completions, including language server suggestions, snippets, and simple word based textual completions.

<table class="table">
  <thead>
    <tr>
      <th scope="col">Icon</th>
      <th scope="col">Name</th>
      <th scope="col">Symbol type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td><i class="codicon codicon-symbol-method"></i></td>
        <td>Methods and Functions</td>
        <td><code>method</code>, <code>function</code>, <code>constructor</code></td>
    </tr>
    <tr>
        <td><i class="codicon codicon-symbol-variable"></i></td>
        <td>Variables</td>
        <td><code>variable</code></td>
    </tr>
    <tr>
        <td><i class="codicon codicon-symbol-field"></i></td>
        <td>Fields</td>
        <td><code>field</code></td>
    </tr>
    <tr>
        <td><i class="codicon codicon-symbol-parameter"></i></td>
        <td>Type parameters</td>
        <td><code>typeParameter</code></td>
    </tr>
    <tr>
        <td><i class="codicon codicon-symbol-constant"></i></td>
        <td>Constants</td>
        <td><code>constant</code></td>
    </tr>
    <tr>
        <td><i class="codicon codicon-symbol-class"></i></td>
        <td>Classes</td>
        <td><code>class</code></td>
    </tr>
    <tr>
        <td><i class="codicon codicon-symbol-interface"></i></td>
        <td>Interfaces</td>
        <td><code>interface</code></td>
    </tr>
    <tr>
        <td><i class="codicon codicon-symbol-structure"></i></td>
        <td>Structures</td>
        <td><code>struct</code></td>
    </tr>
    <tr>
        <td><i class="codicon codicon-symbol-event"></i></td>
        <td>Events</td>
        <td><code>event</code></td>
    </tr>
    <tr>
        <td><i class="codicon codicon-symbol-operator"></i></td>
        <td> Operators</td>
        <td><code>operator</code></td>
    </tr>
    <tr>
        <td><i class="codicon codicon-symbol-module"></i></td>
        <td>Modules</td>
        <td><code>module</code></td>
    </tr>
    <tr>
        <td><i class="codicon codicon-symbol-property"></i></td>
        <td>Properties and Attributes</td>
        <td><code>property</code></td>
    </tr>
    <tr>
        <td><i class="codicon codicon-symbol-enum"></i></td>
        <td>Values and Enumerations</td>
        <td><code>value, enum</code></td>
    </tr>
    <tr>
        <td><i class="codicon codicon-symbol-reference"></i></td>
        <td>References</td>
        <td><code>reference</code></td>
    </tr>
    <tr>
        <td><i class="codicon codicon-symbol-keyword"></i></td>
        <td>Keywords</td>
        <td><code>keyword</code></td>
    </tr>
    <tr>
        <td><i class="codicon codicon-file"></i></td>
        <td>Files</td>
        <td><code>file</code></td>
    </tr>
    <tr>
        <td><i class="codicon codicon-folder"></i></td>
        <td>Folders</td>
        <td><code>folder</code></td>
    </tr>
    <tr>
        <td><i class="codicon codicon-symbol-color"></i></td>
        <td>Colors</td>
        <td><code>color</code></td>
    </tr>
    <tr>
        <td><i class="codicon codicon-symbol-unit"></i></td>
        <td>Unit</td>
        <td><code>unit</code></td>
    </tr>
    <tr>
        <td><i class="codicon codicon-symbol-snippet"></i></td>
        <td>Snippet prefixes</td>
        <td><code>snippet</code></td>
    </tr>
    <tr>
        <td><i class="codicon codicon-symbol-string"></i></td>
        <td>Words</td>
        <td><code>text</code></td>
    </tr>
  </tbody>
</table>

## Customizing IntelliSense

You can customize your IntelliSense experience in settings and key bindings.
