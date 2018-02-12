"use strict";
var collectionToArray = function (col) {
    var results = [];
    var enumerator = new Enumerator(col);
    enumerator.moveFirst();
    while (!enumerator.atEnd()) {
        results.push(enumerator.item());
        enumerator.moveNext();
    }
    return results;
};
var isAbsolutePath = function (s) { return /^[A-Za-z]:/i.test(s); };
var shellExec = function (command, cwd) {
    WScript.Echo("-- Command: " + command);
    WScript.Echo("-- CWD: " + cwd);
    var shell = new ActiveXObject('WScript.Shell');
    if (cwd) {
        shell.CurrentDirectory = cwd;
    }
    var exec = shell.Exec(command);
    while (exec.Status === 0) {
        WScript.Sleep(100);
        while (!exec.StdOut.AtEndOfStream) {
            WScript.StdOut.Write(exec.StdOut.ReadAll());
        }
    }
};
var args = collectionToArray(WScript.Arguments);
if (args.length === 0) {
    throw new Error('No file to compile and debug');
}
var fso = new ActiveXObject('Scripting.FileSystemObject');
var file = args[0];
if (!isAbsolutePath(file)) {
    file = fso.GetAbsolutePathName(args[0]); // depends on the current working folder being set properly
}
if (!fso.FileExists(file)) {
    throw new Error("Can't find file: " + args[0] + " at location " + file);
}
var tsconfigPath = '';
var parent = file;
do {
    parent = fso.GetParentFolderName(parent);
    var testPath = fso.BuildPath(parent, 'tsconfig.json');
    if (fso.FileExists(testPath)) {
        tsconfigPath = testPath;
    }
} while (!tsconfigPath && parent);
if (!tsconfigPath) {
    throw new Error("Unable to find tsconfig.json for file '" + WScript.ScriptFullName + "'");
}
var outfolderPath = fso.BuildPath(fso.GetParentFolderName(WScript.ScriptFullName), 'out');
if (fso.FolderExists(outfolderPath)) {
    fso.DeleteFolder(outfolderPath, true);
}
try {
    fso.CreateFolder(outfolderPath);
}
catch (_a) {
    WScript.Sleep(100);
    fso.CreateFolder(outfolderPath); // sometimes works on the second attempt
}
var outFile = fso.BuildPath(outfolderPath, fso.GetBaseName(file) + '.js');
var tsconfigFolder = fso.GetParentFolderName(tsconfigPath);
shellExec("tsc.cmd -p tsconfig.json --outFile \"" + outFile + "\" --listEmittedFiles --noEmit false --module system --allowJs", tsconfigFolder);
shellExec("cscript.exe //x //d " + outFile, tsconfigFolder);
//# sourceMappingURL=loader.js.map