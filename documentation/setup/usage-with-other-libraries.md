---
layout: documentation
parents: Documentation > Setup
title: Usage with other libraries
---

# Usage with other libraries

Although [VUEngine Studio](https://www.vuengine.dev/) has been tailor-made to work with VUEngine, you can also use it with any other library. Sans the [VUEngine](https://github.com/VUEngine/VUEngine-Core)-specific features, of course, unless you explicitly add support.

In the following, as an example, it is described how to use [VUEngine Studio](https://www.vuengine.dev/) with libgccvb.

1. Download [libgccvb](https://github.com/VUEngine/libgccvb) from GitHub and unzip. This version of libgccvb ships with a makefile that is compatible with [VUEngine Studio](https://www.vuengine.dev/) calling conventions.
2. Change the engine path setting <span class="setting">build.engine.core.path</span> to the location of libgccvb, e.g. `/Users/user/dev/libgccvb`.
3. Profit! You can now build your libgccvb-based project (e.g. [libgccvb-Barebone](https://github.com/VUEngine/libgccvb-Barebone)) through VUEngine Studio's build system.
