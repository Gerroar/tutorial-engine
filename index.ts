import { execFileSync, execSync, spawnSync } from "child_process";
import fs from "fs";
import crypto from "crypto";

let inCode = false;
let lastSh = ``;

function processLine(str: string) {
  if (str.startsWith("```")) {
    if (str.endsWith(`sh`)) lastSh = ``;
    inCode = !inCode;
    return inCode ? "<pre>" : "</pre>";
  } else if (inCode) {
    lastSh += str + "\n";
  } else if (str === "[output]") {
    fs.writeFileSync("tmp/tmp.sh", lastSh);
    let ls = spawnSync("./tmp/tmp.sh", [], { shell: "sh" });
    let output = ls.stdout;

    let hash = crypto.createHash("md5").update(lastSh).digest("hex");
    if (fs.existsSync("tmp/prevRuns/" + hash)) {
      let prevOutput = fs.readFileSync("tmp/prevRuns/" + hash);
      if (!prevOutput.equals(output)) {
        console.log(`Output changed for command: \x1B[0;93m${lastSh}\x1B[0m`);
        console.log(`Output expected:\n\x1B[0;34m${prevOutput}\x1B[0m`);
        console.log(`Output was:\n\x1B[0;31m${output}\x1B[0m`);
      }
    } else {
      fs.writeFileSync("tmp/prevRuns/" + hash, output);
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

function processFile(root: string, path: string) {
  let pathWithoutExtension = path.substring(0, path.lastIndexOf("."));
  console.log(`Processing ${pathWithoutExtension}`);
  let filename = path.substring(path.lastIndexOf("/") + 1);
  let filenameWithoutExtension = filename.substring(
    0,
    filename.lastIndexOf(".")
  );
  let lines = ("" + fs.readFileSync(`${root}/${pathWithoutExtension}.md`))
    .split("\n")
    .map((x) => x.trimEnd());
  let pathWithoutFile = path.substring(0, path.lastIndexOf("/"));
  fs.mkdirSync(`output/${pathWithoutFile}`, { recursive: true });
  fs.writeFileSync(
    `output/${pathWithoutExtension}.html`,
    HEAD + lines.map(processLine).join("\n") + FOOT
  );
}

function processPath(root: string, path: string) {
  if (fs.lstatSync(`${root}/${path}`).isFile()) {
    let extension = path.substring(path.lastIndexOf(".") + 1);
    if (!["md", "png"].includes(extension))
      console.log(`Warning. Unknown extension: ${root}${path}`);
    if (extension === "md") processFile(root, path);
    else fs.copyFileSync(`${root}/${path}`, `output/${path}`);
  } else {
    fs.readdirSync(`${root}/${path}`).forEach((f) => {
      processPath(root, `${path}/${f}`);
    });
  }
}
fs.rmSync("output", { recursive: true, force: true });
fs.mkdirSync("output");
processPath(process.argv[2] || "tests/first-test", "");
