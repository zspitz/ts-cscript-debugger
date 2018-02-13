const fso = new ActiveXObject('Scripting.FileSystemObject');

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

const prepend = (path: string, textToPrepend: string) => {
    let txt: Scripting.TextStream | null = fso.OpenTextFile(outFile, Scripting.IOMode.ForReading, false);
    let contents = txt.ReadAll();
    txt.Close();
    txt = null;
    txt = fso.OpenTextFile(outFile, Scripting.IOMode.ForWriting);
    txt.Write(textToPrepend + '\n' + contents);
    txt.Close();
    txt = null;
};

const prependFiles = (path: string, ...prepends: string[]) => {
    let contents: string[] = [];
    for (let i = 0; i < prepends.length; i++) {
        let txt: Scripting.TextStream | null = fso.OpenTextFile(prepends[i]);
        contents.push(txt.ReadAll());
        txt.Close();
        txt = null;
    }
    prepend(path, contents.join('\n'));
};

const args = collectionToArray(WScript.Arguments);
if (args.length === 0) {
    throw new Error('No file to compile and debug');
}

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

// TODO write outFile to same folder, then delete when finished; it shouldn't be added to source control, nor should it pollute the directory

const outFile = fso.BuildPath(outfolderPath, fso.GetBaseName(file) + '.js');
const tsconfigFolder = fso.GetParentFolderName(tsconfigPath);
shellExec(`tsc.cmd -p tsconfig.json --outFile "${outFile}" --listEmittedFiles --noEmit false --module system --allowJs`, tsconfigFolder);

const scriptFolder = fso.GetParentFolderName(WScript.ScriptFullName);
prependFiles(outFile,
    fso.BuildPath(scriptFolder, 'node_modules\\es5-shim\\es5-shim.js'),
    fso.BuildPath(scriptFolder, 'node_modules\\activex-helpers\\activex-js-helpers.js'));

shellExec(`cscript.exe //x //d ${outFile}`, tsconfigFolder);