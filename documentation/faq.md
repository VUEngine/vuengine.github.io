---
layout: documentation
parents: Documentation
title: FAQ
---

# FAQ

This page covers some of the most frequently asked questions about problems when using VUEngine Studio and VUEngine and how to resolve them.

If you're still stuck and need some help, feel free to reach out! You can find us, jorgeche and KR155E, and other developers on the Planet Virtual Boy [forums](https://www.virtual-boy.com/forums/) and [Discord](https://www.virtual-boy.com/discord/).

#### How do you debug a game built with VUEngine?

Currently, there isn't an interactive C debugger for the version of GCC bundled with [VUEngine Studio](https://www.vuengine.dev/). There are active efforts to patch it in and/or get the later to work with LLVM but for the time being, debugging is done through in game text output. There are a few handy macros defined in [**Priting.h**](https://github.com/VUEngine/VUEngine-Core/blob/master/source/Component/Graphics/2d/Sprites/Bgmap/Printing/Printing.h) that help to write such debug output code less tedious:

```cpp
#define PRINT_TEXT(string, x, y)            Printing::text(string, x, y, NULL)
#define PRINT_INT(number, x, y)             Printing::int32(number, x, y, NULL)
#define PRINT_FLOAT(number, x, y)           Printing::float(number, x, y, 2, NULL)
#define PRINT_HEX(number, x, y)             Printing::hex(number, x, y, 8, NULL)
```

[Mednafen](https://mednafen.github.io/)'s debugger can come in handy to step through the disassembled code.

#### What does the information in the assertion screen mean?

Your code will probably fall into an exception at some point when building non [release](/documentation/user-guide/building-modes/#release) ROMs:

<a href="/documentation/images/faq/exception.png" data-toggle="lightbox" data-gallery="gallery" data-caption="Illegal method access"><img src="/documentation/images/faq/exception.png" width="500" /></a><br/>
_Exception screen_

The most important information in the exception screen are the LP and the message. The message usually shows the class and the method where an assertion failed, while the LP value represents the return point in the binary of the code that made the call to method shown by the message. 

In the above example, the call to `BgmapTextureManager::reset` was made from the code address **0x7010E6E**. Looking for that address in the disassembled code will reveal which part of the program tried to illegally call the method:

```cpp
 7010e58:	aa 94       	bne	7010f02 <_AnimationSchemesState_removeSprites+0xea>
 7010e5a:	a0 bf 01 07 	movhi	1793, r0, r29
 7010e5e:	bd a3 cc f6 	movea	-2356, r29, r29
 7010e62:	dd 00       	mov	r29, r6
 7010e64:	00 ac f4 a3 	jal	701b258 <_BgmapTextureManager_getInstance>
 7010e68:	ca 00       	mov	r10, r6
 7010e6a:	00 ac 9e a0 	jal	701af08 <_BgmapTextureManager_reset>
 7010e6e:	dd 00       	mov	r29, r6
 7010e70:	00 ac e8 a3 	jal	701b258 <_BgmapTextureManager_getInstance>
 7010e74:	ca 00       	mov	r10, r6
 7010e76:	e0 40       	mov	0, r7
 7010e78:	00 ac 4c a4 	jal	701b2c4 <_BgmapTextureManager_clearBgmapSegment>
 ```

The above reveals that the illegal call is made from `AnimationSchemesState::removeSprites`, which leads to the C code:

```cpp
void AnimationSchemesState::removeSprites()
{
    [...]
    /*
    * Cleaning graphics memory explicitly should not be done in general, the engine takes care of that 
    * when swapping states. We do it here becuase BGMAP memory cannot be defragmented and loading non 
    * shared textures would quickly deplete it.
    *
    * BgmapTextureManager::reset call is restricted so, this call will trigger an exception 
    * in non release build modes!!!
    */ 
    BgmapTextureManager::reset(BgmapTextureManager::getInstance());
    BgmapTextureManager::clearBgmapSegment(BgmapTextureManager::getInstance(), 0);
}
```

#### All of a sudden, I am getting a lot of different exceptions which I can't seem to find a reason for in the code. What's going on?

When things begin to break unexpectedly and in random places, it is almost guaranteed that either a rogue pointer or a stack overflow is the underlying cause. Try shrinking down the memory pools and test the game in [debug mode](/documentation/user-guide/building-modes/#debug).

#### I am getting the following error after compiling, what does it mean?

```bash
/opt/gccvb/lib/gcc/v810/4.4.2/../../../../v810/bin/ld: main.elf section '.bss' will not fit in region 'ram'
/opt/gccvb/lib/gcc/v810/4.4.2/../../../../v810/bin/ld: region 'ram' overflowed by xx bytes
```

In the context of the engine, it means that the memory pool is too big. You're trying to reserve more RAM than physically exists.
