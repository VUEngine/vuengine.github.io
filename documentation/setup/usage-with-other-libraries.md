---
layout: documentation
parents: Documentation > Setup
title: Usage with other libraries
---

# Usage with other libraries

Although VUEngine Studio has been tailor-made to work with VUEngine, you can also use it with any other library. Sans the VUEngine-specific features, of course, unless you explicitly add support.

In the following, as an example, it is described how to use VUEngine Studio with libgccvb.

1. Download <a href="https://github.com/VUEngine/libgccvb">libgccvb</a> from GitHub and unzip. This version of libgccvb ships with a makefile that is compatible with VUEngine Studio calling conventions.
2. Change the VUEngine Core path setting <span class="setting">build.engine.core.path</span> to the location of libgccvb, e.g. `/Users/user/dev/libgccvb`.
3. Profit! You can now build your libgccvb-based project (e.g. <a href="https://github.com/VUEngine/libgccvb-Barebone">libgccvb-Barebone</a>) through VUEngine Studio's build system.
