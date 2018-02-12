const collectionToArray = <T>(col: { Item(key: any): T }): T[] => {
    const results: T[] = [];
    const enumerator = new Enumerator<T>(col);
    enumerator.moveFirst();
    while (!enumerator.atEnd()) {
        results.push(enumerator.item());
        enumerator.moveNext();
    }
    return results;
};

const isAbsolutePath = (s: string) => /^[A-Za-z]:/i.test(s);

const shellExec = (command: string, cwd?: string) => {
    WScript.Echo(`-- Command: ${command}`);
    WScript.Echo(`-- CWD: ${cwd}`);

    const shell = new ActiveXObject('WScript.Shell');
    if (cwd) { shell.CurrentDirectory = cwd; }
    const exec = shell.Exec(command);
    while (exec.Status === 0) {
        WScript.Sleep(100);
        while (!exec.StdOut.AtEndOfStream) {
            WScript.StdOut.Write(exec.StdOut.ReadAll());
        }
    }
};

const args = collectionToArray(WScript.Arguments);
if (args.length === 0) {
    throw new Error('No file to compile and debug');
}
const fso = new ActiveXObject('Scripting.FileSystemObject');
let file = args[0];
if (!isAbsolutePath(file)) {
    file = fso.GetAbsolutePathName(args[0]); // depends on the current working folder being set properly
}
if (!fso.FileExists(file)) {
    throw new Error(`Can't find file: ${args[0]} at location ${file}`);
}

let tsconfigPath = '';
let parent = file;
do {
    parent = fso.GetParentFolderName(parent);
    const testPath = fso.BuildPath(parent, 'tsconfig.json');
    if (fso.FileExists(testPath)) {
        tsconfigPath = testPath;
    }
} while (!tsconfigPath && parent);

if (!tsconfigPath) {
    throw new Error(`Unable to find tsconfig.json for file '${WScript.ScriptFullName}'`);
}

const outfolderPath = fso.BuildPath(fso.GetParentFolderName(WScript.ScriptFullName), 'out');
if (fso.FolderExists(outfolderPath)) {
    fso.DeleteFolder(outfolderPath, true);
}
try {
    fso.CreateFolder(outfolderPath);
} catch {
    WScript.Sleep(100);
    fso.CreateFolder(outfolderPath); // sometimes works on the second attempt
}

const outFile = fso.BuildPath(outfolderPath, fso.GetBaseName(file) + '.js');
const tsconfigFolder = fso.GetParentFolderName(tsconfigPath);
shellExec(`tsc.cmd -p tsconfig.json --outFile "${outFile}" --listEmittedFiles --noEmit false --module system --allowJs`, tsconfigFolder);
shellExec(`cscript.exe //x //d ${outFile}`, tsconfigFolder);