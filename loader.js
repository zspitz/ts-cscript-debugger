"use strict";
var fso = new ActiveXObject('Scripting.FileSystemObject');
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
var prepend = function (path, textToPrepend) {
    var txt = fso.OpenTextFile(outFile, 1 /* ForReading */, false);
    var contents = txt.ReadAll();
    txt.Close();
    txt = null;
    txt = fso.OpenTextFile(outFile, 2 /* ForWriting */);
    txt.Write(textToPrepend + '\n' + contents);
    txt.Close();
    txt = null;
};
var prependFiles = function (path) {
    var prepends = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        prepends[_i - 1] = arguments[_i];
    }
    var contents = [];
    for (var i = 0; i < prepends.length; i++) {
        var txt = fso.OpenTextFile(prepends[i]);
        contents.push(txt.ReadAll());
        txt.Close();
        txt = null;
    }
    prepend(path, contents.join('\n'));
};
var args = collectionToArray(WScript.Arguments);
if (args.length === 0) {
    throw new Error('No file to compile and debug');
}
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
// TODO write outFile to same folder, then delete when finished; it shouldn't be added to source control, nor should it pollute the directory
var outFile = fso.BuildPath(outfolderPath, fso.GetBaseName(file) + '.js');
var tsconfigFolder = fso.GetParentFolderName(tsconfigPath);
shellExec("tsc.cmd -p tsconfig.json --outFile \"" + outFile + "\" --listEmittedFiles --noEmit false --module system --allowJs", tsconfigFolder);
var scriptFolder = fso.GetParentFolderName(WScript.ScriptFullName);
prependFiles(outFile, fso.BuildPath(scriptFolder, 'node_modules\\es5-shim\\es5-shim.js'), fso.BuildPath(scriptFolder, 'node_modules\\activex-helpers\\activex-js-helpers.js'));
shellExec("cscript.exe //x //d " + outFile, tsconfigFolder);
//# sourceMappingURL=loader.js.map