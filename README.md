# ts-cscript-debugger
Compile Typescript files and run the compilation with the VS debugger via cscript

### Usage

Pass a Typescript filename to `loader.js`
```
cscript loader.js greeter.ts
```
The script will search for a `tsconfig.json` in the parent folders of the file, and it will be used as the compilation target.

`cscript.exe` will be started with the debugging options (`//X //D`).

You need to have Typescript installed as a global node package; and a JIT debugger (VS Community Edition works fine.)
