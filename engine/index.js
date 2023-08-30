"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const buildFolder = "../frontend/src/output";
var arrDirectories = [];
let inCode = false;
let lastSh = ``;
function processLine(str) {
    if (str.startsWith("```")) {
        if (str.endsWith(`sh`))
            lastSh = ``;
        inCode = !inCode;
        return inCode ? "<pre>" : "</pre>";
    }
    else if (inCode) {
        lastSh += str + "\n";
    }
    else if (str === "[output]") {
        fs_1.default.writeFileSync("tmp/tmp.sh", lastSh);
        let ls = (0, child_process_1.spawnSync)("./tmp/tmp.sh", [], { shell: "sh" });
        let output = ls.stdout;
        let hash = crypto_1.default.createHash("md5").update(lastSh).digest("hex");
        if (fs_1.default.existsSync("tmp/prevRuns/" + hash)) {
            let prevOutput = fs_1.default.readFileSync("tmp/prevRuns/" + hash);
            if (!prevOutput.equals(output)) {
                console.log(`Output changed for command: \x1B[0;93m${lastSh}\x1B[0m`);
                console.log(`Output expected:\n\x1B[0;34m${prevOutput}\x1B[0m`);
                console.log(`Output was:\n\x1B[0;31m${output}\x1B[0m`);
            }
        }
        else {
            fs_1.default.writeFileSync("tmp/prevRuns/" + hash, output);
        }
        return `<pre>${output}</pre>`;
    }
    return str;
}
const HEAD = `<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>`;
const FOOT = `</body>
</html>`;
/**Why arrDirectories inside this function ?
 *
 * In order to generate a menu with all the directories and files that they are being created,
 * we store the path as a string in the array
 */
function processFile(root, path) {
    let pathWithoutExtension = path.substring(0, path.lastIndexOf("."));
    console.log(`Processing ${pathWithoutExtension}`);
    arrDirectories.push(path);
    let filename = path.substring(path.lastIndexOf("/") + 1);
    let filenameWithoutExtension = filename.substring(0, filename.lastIndexOf("."));
    let lines = ("" + fs_1.default.readFileSync(`${root}/${pathWithoutExtension}.md`))
        .split("\n")
        .map((x) => x.trimEnd());
    let pathWithoutFile = path.substring(0, path.lastIndexOf("/"));
    fs_1.default.mkdirSync(`${buildFolder}/${pathWithoutFile}`, { recursive: true });
    fs_1.default.writeFileSync(`${buildFolder}/${pathWithoutExtension}.html`, HEAD + lines.map(processLine).join("\n") + FOOT);
}
function processPath(root, path) {
    if (fs_1.default.lstatSync(`${root}/${path}`).isFile()) {
        let extension = path.substring(path.lastIndexOf(".") + 1);
        if (!["md", "png"].includes(extension))
            console.log(`Warning. Unknown extension: ${root}${path}`);
        if (extension === "md")
            processFile(root, path);
        else
            fs_1.default.copyFileSync(`${root}/${path}`, `${buildFolder}/${path}`);
    }
    else {
        fs_1.default.readdirSync(`${root}/${path}`).forEach((f) => {
            processPath(root, `${path}/${f}`);
        });
    }
}
fs_1.default.rmSync(buildFolder, { recursive: true, force: true });
fs_1.default.mkdirSync(buildFolder);
processPath(process.argv[2] || "tests/first-test", "");
/** Same as creating files for every page, each time that a new directory or file its created
 * the array will be updated so will the menu do, the array it's being mapped to transform
 * the contents into strings
 */
fs_1.default.writeFileSync(`../frontend/src/output/directoriesList.ts`, `export const arrDirectories = [\n${arrDirectories.map(x => `"${x}"`).join(",\n")}\n];`);
