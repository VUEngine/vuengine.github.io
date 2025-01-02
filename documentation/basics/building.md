---
layout: documentation
title: Building
---

# Building

To get from source code to a playable ROM (\*.vb) file, you'll need to build your code.

VUEngine Studio allows you to build your project and queue running it in an emulator, flash to your flash cart(s) or export the ROM, all in a unified workflow and in fully embedded tools.

## Build Panel

The central spot for building is the Build Panel.

<a href="/documentation/images/basics/building/build-panel.png"><img src="/documentation/images/basics/building/build-panel.png" width="500" /></a>

### Action Buttons

The Action Button Bar (**A**) in the top right of the application allow you to quickly start a build, run or flash a game, or clean the build cache. You'll also be able to see the progress of builds or flash cart writes on the respective buttons.

If you click on <i class="fa fa-play" /> **Run** or <i class="fa fa-microchip" /> **Flash** without a ROM being built yet, a build will start and the respective action will be queued and executed once the build is completed. Click the button again to unqueue. Click the other button, respectively, to queue/unqueue that action as well. Clicking the Build button while a build is running toggles the Build Panel.

Click the <i class="fa fa-trash" /> **Clean** button to delete the build cache for the current mode.

The progress bar on the <i class="fa fa-wrench" /> **Build** button will turn yellow once a warning occured. It will be colored red if a build failed.

Keyboard shortcuts:

- Build: <span class="keys" data-osx="⇧⌥B">Shift+Alt+B</span>
- Run: <span class="keys" data-osx="⇧⌥R">Shift+Alt+R</span>
- Flash: <span class="keys" data-osx="⇧⌥F">Shift+Alt+F</span>
- Clean: <span class="keys" data-osx="⇧⌥C">Shift+Alt+C</span>

### Side Bar Tab

The Build Side Bar Tab <i class="codicon codicon-tools"></i> (**B**) allows you to toggle the visibility of the Build Panel by clicking on it. It can also shows the current build status:

- <i class="fa fa-fw fa-cog" /> Cog for running build
- <i class="fa fa-fw fa-check" /> Checkmark for a successful build
- <i class="far fa-fw fa-times-circle" /> Cross for a failed build

### Context Buttons

The Context Buttons (**C**) in the Build Panel's header allow you to (in this order):

- Maximize the panel's size. When maximized, use the far-right icon appearing in the Action Button Bar (**A**) to bring the panel back to its regular size.
- Open the settings dialog with build-related options.
- Open this documentation page.

### Progress Bar

The Build Progress Bar (**D**) Shows you the progress of the current build. It will turn yellow once any warnings occur.

### Button Bar

The Button Bar (**E**) below the progress bar allows you to (in this order):

- Cancel the currently running build
- Start the resulting ROM in the emulator
- Flash the resulting ROM to your flash cart(s)
- Export the resulting ROM
- Clean the build folder

### Build Status & Meta Data

Below the build button bar, you'll find the current build's status. This includes the current activity, running time, Build Mode and ID of the build process. On Windows machines, if you are building through WSL, you'll also find an indicator for that here.

### Build Log

The large area in the center of the build panel is holding the Build Log (**G**). In shows the output of the build process running through `make`. Errors are highlighted in red, warnings in yellow.

### Build Log Filter

The Build Log Filter buttons (**H**) below the Build Log allow you to filter the Build Log to show only warnings (center button) or errors (right button). By default, the Build Log automatically scrolls to the very bottom when it gets updated. Use the left button to toggle that behaviour.

### Build Mode Switch

A Build Mode Switch (**I**), which shows the current build mode, can be found in the Status Bar. Click to change the build mode. See the chapter below for more into about <a href="#build-modes">Build Modes</a>.

## Build Modes

VUEngine can be built in different modes, for different purposes. You can change modes in various ways:

- Via the respective status bar entry (see screenshot above)
- Via the `Build: Set Build Mode` command
- Via the menu: **Build > Set Build Mode**
- Via the Touch Bar (MacBook Pro only)
- By changing the respective setting:

```json
"build.mode": "Beta"
```

The following modes are available:

- **Release**:
  Includes no asserts or debug flags, for shipping only.
- **Beta** (Default):
  Includes selected asserts, for testing on emulators.
- **Tools**:
  Includes selected asserts, includes debugging tools.
- **Debug**:
  Includes all runtime assertions, includes debugging tools.

Normally, you'll work in **Beta** mode, which includes a selected set of debug asserts. When debugging, you'll want to switch to **Tools** mode, to include the engine's various debugging tools, or to **Debug** mode for the full set of runtime assertions and debug output. Be warned that **Debug** mode is heavy on resources and has the potential to slow down your program considerably. Finally, to build a releasable ROM, you'll want to build in **Release** mode to get rid of any asserts or debug flags.

## Build Options

Additional build options are available through the settings dialog. These will prove helpful when having to debug harder problems.

- **`Build: Dump Elf`**: Dump assembly code and memory sections.
- **Pedantic Warnings**: Enable pedantic compiler warnings.

```json
"build.dumpElf": false
"build.pedanticWarnings": false
```

## Cleaning Build Cache

Sometimes you may want to, or have to, clean up the build folder before starting a build to start with a clean plate.

Hit the **Clean** Action Button, use the keyboard shortcut <span class="keys" data-osx="⇧⌥C">Shift+Alt+C</span> or use the command palette to execute the `Build: Clean Build Folder` command.

This will delete the respective subfolder in the build folder for the currently selected Build Mode (`build/{mode}`).

## Pre and Post Build Tasks

If, for some reason, you need to run certain <a href="/documentation/basics/tasks/">Tasks</a> or Commands before or after each build, you can set up pre and post build tasks according to your needs. There's two preferences for that take any number of Tasks or Commands and work through them sequentially.

```jsonc
"build.tasks.pre": []
"build.tasks.post": [{
    "name": "Patch ROM", // Depending on the type, either a task label or command ID.
    "type": "Task" // Can be either "Task" or "Command".
}]
```

In the above example, the output ROM would be patched through the **"Patch ROM"** Task after the build completed.

See the <a href="/documentation/basics/tasks/">Tasks</a> page to learn how to set up a Task.

> Tip: The JSON preferences editor will assist you with auto completion of option names and, if applicable, values.

## The ROM file

A successful build will result in the creation of a Virtual Boy ROM, a binary V810 machine code file that can be run on a Virtual Boy using a <a href="/documentation/basics/flash-carts/">flash cart</a> or on a Virtual Boy <a href="/documentation/basics/emulator/">emulator</a>. It will be written to `build/{mode}/output-{mode}.vb` and copied to `build/output.vb`.

## Troubleshooting

When a build fails, you can, in the best case, just follow the error messages to find and fix the problem, and get the build to succeed again. Error messages can often be a bit cryptic, though. See below for info on how to diagnose build errors.

### Error diagnosis

Since the engine makes heavy use of pointer logic, it is really easy to trigger difficult to find bugs. In order to mitigate this issue, VUEngine provides the following aids:

#### Asserts

Use the `ASSERT` macro to check every pointer or variable which can be troublesome; in particular, place an `ASSERT` checking that the `this` pointer passed to the class's methods is not `NULL`.

The engine provides two kinds of `ASSERT` macros, which check a given statement and throw an exception with a given error message if this statement returns false. These macros should be used throughout the code to make debugging easier. Since the engine relies on heavy pointer usage, it is common to operate on a `NULL` pointer and get lost.

##### ASSERT

Only inserted when compiling under **Debug** mode. It is used at the start of most of the engine's methods to check that the `this` pointer is not `NULL`. Since the MemoryPool writes a 0 in the first byte of a deleted pointer, this helps to assure that any memory slot within the MemoryPool's pools has a 0 when it has been deleted.

Another good use case for this would be to check an object's class against the expected class as shown below.

```cpp
ASSERT(__GET_CAST(ClassName, someObject), "ClassName::methodName: Wrong object class");
```

##### NM_ASSERT

Inserted under any compilation type (NM stands for "non maskable"). This macro is meant to be placed in sensible parts of the code. Here's a few examples of usage in VUEngine:

- **MemoryPool allocation**:
  To let you know that the memory is full, otherwise extremely hard to track bugs occur.
- **SpriteManager, registering a new Sprite**:
  To let you know that there are no more WORLDs available.
- **ParamTableManager, registering a new Sprite**:
  To let you know that param memory is depleted.

#### Initialize everything

One of the most difficult, and common source of hard to diagnose bugs are uninitialized variables; random crashes or completely strange behavior often are caused by not properly initialized variables. To aid the detection of such mistakes, set `memoryPools.cleanUp` to `true` in `config/Engine.json` to define the `__MEMORY_POOL_CLEAN_UP` macro. This will force the engine to put every memory pool's free block to 0 when the game changes its state, so, if the problem gets solved by defining such macro, the cause is, most likely, an uninitialized variable.

#### MemoryPool size

Whenever crashes appear more or less randomly with alternating exceptions, the cause will be, most likely, a stack overflow. Try to reduce the memory pool size to leave a bit more room for the stack. Since the safe minimum for the stack is about 2KB, your memory pool configuration should not exceed 62KB (depending on how deep the stack can grow because of nested function calls, this limit could be lower; this is specially the case when compiling under **Debug** mode).

#### Cast everything

Because the engine implements class inheritance by accumulation of attributes' definitions within macros, it is necessary to cast every pointer of any given class to its base class in order to avoid compiler warnings when calling the base class' methods. This exposes the program to hard to identify errors. In order to mitigate this danger, cast every pointer before passing it to the base class' method by following this pattern:

```cpp
BaseClass::method(__SAFE_CAST(BaseClass, object), ...);
```

When compiling for release, the macro is replaced by a simple C type cast; while for debug, the `Object::getCast` method will be called, returning `NULL` if the object does not inherit from the given BaseClass, raising an exception in the method (which must check that the `this` pointer isn't `NULL`).

#### Exceptions

When an exception is thrown in-game in **Debug** mode, you're presented with some output that's meant to help you find the exact location that is causing the crash. These are last process, LP and SP as well as the exception message.

Looking for the message in both your game code as well as the engine would be the quickest thing to do but should give you only a rough idea of the problem's root in most cases.

The LP (linker pointer) value shows you the exact location in program where the crash occurred and will lead you to the function that has caused it. Enable the `Build: Dump Elf` setting and recompile. The compiler will produce a file called `machine-{MODE}.asm` in the project's `build/{MODE}` folder. It contains a huge list of all functions, their ASM equivalent and memory locations. Search it for your LP value and it will lead you to the faulty function.

The SP (stack pointer) value becomes useful in the (seldom) case of a stack overflow. Since the check is performed during a timer interrupt, it is possible that an overflow occurs between interrupts. By checking the SP value against the `__lastDataVariable` address in the `sections.txt` file, you can guess that there was an overflow. As described for the `machine.asm` file above, activate generation of the `sections.txt` file in the makefile.

#### Other useful macros

- `__GET_CLASS_NAME()`:
  Get the class of an object using this macro.
