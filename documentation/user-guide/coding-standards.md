---
layout: documentation
parents: Documentation > User Guide
title: Coding Standards
---

# Coding Standards

All the code written by Team VUEngine tries to adhere to the following coding standards to ensure a consistent code appearance and high interoperability.

- Tabs of size 4 must be used for indenting.

- Class names must be declared in StudlyCaps and follow the scheme: `ClassName`.

- Method names must be declared in camelCase and follow the scheme: `::methodName`.

- Variable names must be declared in camelCase and follow the scheme: `variableName`.

- Global variables must be prefixed with an underscore character: `_globalVariable`.

- Global **Spec** names must be declared in StudlyCaps and follow the scheme: `SomeClassSpec`.

- Macros must be declared in all upper case with underscore separators. Engine macros additionally must be prefixed with two underscores: `MACRO_NAME`

- Opening braces follow Allman style blocks, ie: for all blocks must go on the next line, and closing braces must go on the next line after the block's body:

```cpp
void SomeClass::someMethod()
{
    // Some block or control statement
    {
        // Code here
    }
}
```

- The soft limit for line length is 140 characters.

- Opening and closing parenthesis, both for function' signatures and calls, follow Allman style blocks when the line reaches the soft time limit:

```cpp
void SomeClass::someMethod
(
    uint32 someParameter1, uint32 someParameter2, uint32 someParameter3, uint32 someParameter4,
    uint32 someParameter5, uint32 someParameter6,
)
{
    SomeClass::someOtherMethod
    (
        this, someParameter1, someParameter2, someParameter3, someParameter4, someParameter5,
        someParameter6
    );
}
```
