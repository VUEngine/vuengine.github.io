---
layout: documentation
parents: Documentation
title: FAQ
---

# FAQ

This page covers some of the most frequently asked questions about problems when using VUEngine Studio and VUEngine and how to resolve them.

If you're still stuck and need some help, feel free to reach out! You can find us, jorgeche and KR155E, and other developers on the Planet Virtual Boy [forums](https://www.virtual-boy.com/forums/) and [Discord](https://www.virtual-boy.com/discord/).

#### All of a sudden, I am getting a lot of different exceptions which I can't seem to find a reason for in the code. What's going on?

When things begin to break unexpectedly and in random places, it is almost guaranteed that a stack overflow is the cause. In that case, you need to shrink down the memory pools.

#### I am getting the following error after compiling, what does it mean?

```bash
/opt/gccvb/lib/gcc/v810/4.4.2/../../../../v810/bin/ld: main.elf section '.bss' will not fit in region 'ram'
/opt/gccvb/lib/gcc/v810/4.4.2/../../../../v810/bin/ld: region 'ram' overflowed by xx bytes
```

In the context of the engine, it means that the memory pool is too big. You're trying to reserve more RAM than physically exists.
