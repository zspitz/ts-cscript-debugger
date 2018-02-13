# ts-cscript-debugger
Compile Typescript files and run the compilation with the VS debugger via cscript

### Usage

Pass a Typescript filename to `loader.js`
```
cscript loader.js greeter.ts
```
You can either pass in an absolute path, or run the script from within the same folder as the file.

The script will search for a `tsconfig.json` in the parent folders of the file, and it will be used as the compilation target.

It will also inject [es5-shim](https://github.com/es-shims/es5-shim) and [activex-helpers](https://github.com/zspitz/activex-js-helpers) into the script. (Run `npm install` from the root folder to install these packages locally.)

`cscript.exe` will be started with the debugging options (`//X //D`).

You need to have Typescript installed as a global node package; and a JIT debugger (VS Community Edition works fine.)
