"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
let lines = ("" + fs_1.default.readFileSync("tests/first-test/index.md"))
    .split("\n")
    .map((x) => x.trimEnd());
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
            if (prevOutput !== output)
                console.log(`Output changed for command: \x1B[0;93m${lastSh}\x1B[0m`);
            console.log(`Output expected:\n\x1B[0;34m${prevOutput}\x1B[0m`);
            console.log(`Output was:\n\x1B[0;31m${output}\x1B[0m`);
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
fs_1.default.writeFileSync("output/index.html", HEAD + lines.map(processLine).join("\n") + FOOT);
