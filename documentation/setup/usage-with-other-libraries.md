---
layout: documentation
parents: Documentation > Setup
title: Usage with other libraries
---

# Usage with other libraries

Although [VUEngine Studio](https://www.vuengine.dev/) has been tailor-made to work with VUEngine, you can also use it with any other library. Sans the [VUEngine](https://github.com/VUEngine/VUEngine-Core)-specific features, of course, unless you explicitly add support.

The following steps have to be taken:

1. Set the engine path [setting](/documentation/basics/settings/) <span class="setting">build.engine.core.path</span> to the location of the desired library. It is recommended to do so in the [workspace settings](/documentation/basics/settings/#workspace-settings) of any project using the custom library, so you can easily switch between projects using different libraries without having to reconfigure [VUEngine Studio](https://www.vuengine.dev/) every time.
2. Ensure that either the library or your project comes with a makefile that is compatible with [VUEngine Studio](https://www.vuengine.dev/) calling conventions ([Example](https://github.com/VUEngine/libgccvb/tree/master/lib/compiler/make)).
3. Profit! You can now build your custom library based project through [VUEngine Studio](https://www.vuengine.dev/)'s build system.

As a sample, we provide a version of [libgccvb](https://github.com/VUEngine/libgccvb) that ships with a [VUEngine Studio](https://www.vuengine.dev/) compatible makefile, as well as a [sample barebone project](https://github.com/VUEngine/libgccvb-Barebone) that uses libgccvb.
