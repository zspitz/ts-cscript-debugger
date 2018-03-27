// const htmlfile = WScript.CreateObject('htmlfile');
// htmlfile.write('<meta http-equiv="x-ua-compatible" content="IE=9" />');
// // @ts-ignore
// JSON = htmlfile.parentWindow.JSON;
// htmlfile.close();

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

interface Stream {
    stdout?: string;
}

const shellExec = (command: string, cwd?: string, stream?: Stream) => {
    WScript.Echo(`-- Command: ${command}`);
    WScript.Echo(`-- CWD: ${cwd}`);

    const shell = new ActiveXObject('WScript.Shell');
    if (cwd) { shell.CurrentDirectory = cwd; }
    const exec = shell.Exec(command);
    while (exec.Status === 0) {
        WScript.Sleep(100);
        while (!exec.StdOut.AtEndOfStream) {
            const nextString = exec.StdOut.ReadAll();
            if (stream) {
                stream.stdout = (stream.stdout || '') + nextString;
            }
            WScript.StdOut.Write(nextString);
        }
    }
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

const tsconfigFolder = fso.GetParentFolderName(tsconfigPath);
const stream: Stream = {};
shellExec('tsc.cmd --noEmit --listFiles', tsconfigFolder, stream);
if (!(stream.stdout)) {
    throw new Error('No emitted files');
}

const scriptFolder = fso.GetParentFolderName(WScript.ScriptFullName);
const outFile = fso.BuildPath(outfolderPath, fso.GetBaseName(file) + '.js');
const files = [
    fso.BuildPath(scriptFolder, 'node_modules\\es5-shim\\es5-shim.js').replace(/\\/g, '\\\\'),
    fso.BuildPath(scriptFolder, 'node_modules\\activex-helpers\\activex-js-helpers.js').replace(/\\/g, '\\\\')
];
for (var inputFile of stream.stdout.split('\r\n')) {
    if (!inputFile) { continue; }
    if (inputFile.indexOf('/AppData/Roaming/npm/node_modules/typescript/lib/') !== -1) { continue; }
    files.push(inputFile.replace(/\\/g, '\\\\'));
}

const tsconfig = `{
    "compilerOptions": {
        "outFile": "${outFile.replace(/\\/g, '\\\\')}",
        "listEmittedFiles": true,
        "noEmit": false,
        "module": "system",
        "allowJs": true,
        "checkJs": false,
        "inlineSourceMap": true,
        "inlineSources": true
    },
    "extends": "${tsconfigPath.replace(/\\/g, '\\\\')}",
    "files": ["${files.join('","')}"]
}`;

let txt: Scripting.TextStream | undefined = fso.CreateTextFile(fso.BuildPath(outfolderPath, 'tsconfig.json'), true, true);
txt.Write(tsconfig);
txt.Close();
txt = undefined;

shellExec(`tsc.cmd -p tsconfig.json --outFile "${outFile}"`, outfolderPath);

shellExec(`cscript.exe //x //d ${outFile}`, tsconfigFolder);