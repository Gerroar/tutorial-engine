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
let olLayer = 0;
let olNumber = 0;
let ulLayer = 0;
let ulNumber = 0;
let todoListLayer = 0;
let todoListNumber = 0;
let openBlockQuote = false;
let openCallOut = false;
let currentCOType = ""; //CallOut type
let openSpoilerDiv = false;
let openNavBar = false;
let nextButtonCreated = false;
let backButtonCreated = false;
let cleanTheLine = false;
//Regex
let quoteBlockRegex = /^\>[\s]*?/g;
let quoteBlockRegexwText = /^>(.*)/;
let urlRegEx = /(((http|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*[-a-zA-Z0-9@:%_\+~#?&//=])?)/;
//Regex
/**DONT FORGET ABOUT tsc -w WHEN WORKING WITH THE ENGINE PART IF NOT THEY WONT APPEAR ANY CHANGES FROM THE index.ts */
/**Removes the spaces to check if the first character is the one that was passed, this function it's used for detecting
 * if the line it's part of a nested list or just a line that concides with the characters used for lists
*/
function characterIsFirstWithoutSpaces(str, character) {
    let isFirstCharacter = false;
    let whiteSpaceRemoved = str.replace(/\s/g, '');
    if (whiteSpaceRemoved[0] === character) {
        isFirstCharacter = true;
    }
    return isFirstCharacter;
}
/**Function used for adding close tag ul in case that the next line doesn't have
 * * or - , checking the listLayer
 */
function checkIfNeedClosingandAddTag(str) {
    let addClosingTag = "";
    if (ulLayer != 0) {
        while (ulLayer-- != 0) {
            if (ulLayer === 0) {
                addClosingTag += "</ul><br/>";
            }
            else {
                addClosingTag += "</ul>";
            }
        }
        ulLayer = 0;
    }
    if (olLayer != 0) {
        while (olLayer-- != 0) {
            if (olLayer === 0) {
                addClosingTag += "</ol><br/>";
            }
            else {
                addClosingTag += "</ol>";
            }
        }
        olLayer = 0;
    }
    if (todoListLayer != 0) {
        addClosingTag = "</div><br/>";
        todoListLayer = 0;
    }
    if (openBlockQuote) {
        if (str) {
            if (/^>[\s]*?/.test(str)) {
                cleanTheLine = true;
            }
        }
        else {
            addClosingTag = "</blockquote>";
            openBlockQuote = false;
        }
    }
    if (openCallOut) {
        addClosingTag = "</div>";
        openCallOut = false;
    }
    if (openSpoilerDiv) {
        addClosingTag = "</details>";
        openSpoilerDiv = false;
    }
    return addClosingTag;
}
/**Iterates the string looking for more than one of the character type passed,
 * doesn't matter if it's * , ** or *** ( for example, it could be any type accepted
 * for italics, bold or both (***x***, ___x___)), it will check if there is a pair of
 * that amount of symbols.
 */
function moreThanOne(str, charType) {
    let charTypeLength = charType.length;
    let hasMoreThanOne = false;
    let howManyChars = 0;
    switch (charTypeLength) {
        case 1:
            for (const chr of str) {
                if (chr === charType) {
                    howManyChars++;
                }
            }
            if (howManyChars > 1) {
                hasMoreThanOne = true;
            }
            return hasMoreThanOne;
        case 2:
            for (let i = 0; i < str.length; i++) {
                const chr = str[i];
                if ((i + 1) !== str.length) {
                    let twoChars = chr + str[i + 1];
                    if (twoChars === charType) {
                        i++;
                        howManyChars += 2;
                    }
                }
            }
            if (howManyChars > 2) {
                hasMoreThanOne = true;
            }
            return hasMoreThanOne;
        case 3:
            for (let i = 0; i < str.length; i++) {
                const chr = str[i];
                if ((i + 1) !== str.length) {
                    let twoChars = chr + str[i + 1];
                    if (twoChars === charType) {
                        i++;
                        howManyChars += 2;
                    }
                }
            }
            if (howManyChars > 3) {
                hasMoreThanOne = true;
            }
            return hasMoreThanOne;
    }
}
function generateCheckBoxAndLabel(id, value) {
    let checkbox = `<input type="checkbox" id="${id}" name="${id}" value="${value}"/>`;
    let label = `<label htmlFor="${id}">${value}</label><br/>`;
    return checkbox + label;
}
function processLine(str) {
    if (str.startsWith("# ")) {
        return checkIfNeedClosingandAddTag() + "<h1>" + str.substring(2) + "</h1><hr/>";
    }
    else if (str.startsWith("## ")) {
        return checkIfNeedClosingandAddTag() + "<h2>" + str.substring(3) + "</h2><hr/>";
    }
    else if (str.startsWith("### ")) {
        return checkIfNeedClosingandAddTag() + "<h3>" + str.substring(4) + "</h3>";
    }
    else if (str.startsWith("#### ")) {
        return checkIfNeedClosingandAddTag() + "<h4>" + str.substring(5) + "</h4>";
    }
    else if (str.startsWith("##### ")) {
        return checkIfNeedClosingandAddTag() + "<h5>" + str.substring(6) + "</h5>";
    }
    else if (str.startsWith("###### ")) {
        return checkIfNeedClosingandAddTag() + "<h6>" + str.substring(7) + "</h6>";
    }
    else if (/\[.*\]\(.*\)/.test(str)) {
        let beforeLink = str.substring(0, str.lastIndexOf("["));
        let linkContent = str.substring(str.indexOf("[") + 1, str.lastIndexOf("]"));
        let href = str.substring(str.indexOf("(") + 1, str.lastIndexOf(")"));
        let afterLink = str.substring(str.indexOf(")") + 1);
        if (/(^next$)|(^\-\>$)/gi.test(linkContent)) {
            if (!nextButtonCreated) {
                if (backButtonCreated) {
                }
                else {
                }
                nextButtonCreated = true;
            }
        }
        else if (/(^back$)|(^\<\-$)/gi.test(linkContent)) {
            if (!backButtonCreated) {
                if (nextButtonCreated) {
                }
                else {
                }
                backButtonCreated = true;
            }
        }
        else {
            return `${beforeLink}<a href="${href}">${linkContent}</a>${afterLink}`;
        }
        //&#9001;
        /**FOR MONDAY:
         * - Add the page-wrapper ( inspect the structure of rust tutorial example)
         * - Create and add the nav and elements for the desktop option
         * - Create the classes for all the navs and their elements
         * - Make the arrows good looking like in the rust tutorial example
         */
    }
    else if (/^\$/.test(str)) {
        if (/^\$title\s(\w+(.*)?)/.test(str)) {
            let spoilerTitle = str.replace(/^\$title\s(\w+(.*)?)/, "$1");
            if (openSpoilerDiv) {
                return `</details><details><summary>${spoilerTitle}</summary>`;
            }
            else {
                openSpoilerDiv = true;
                return `<details><summary>${spoilerTitle}</summary>`;
            }
        }
        else if (openSpoilerDiv) {
            if (/^\$\s(\w+(.*)?)/.test(str)) {
                let spoilerContent = str.replace(/^\$\s(\w+(.*)?)/, "$1");
                return `<p>${spoilerContent}</p>`;
            }
            else if (/^\$$/) {
                return "";
            }
        }
    }
    else if (/^!/.test(str)) {
        let callOutType = "";
        let callOutContent = "";
        switch (true) {
            case /^!good(\s\w+)?$/.test(str):
                callOutType = "good";
                callOutContent = str.replace(/^!good(\s\w+)?$/, "$1").trim();
                break;
            case /^!goodTitle(\s\w+)?$/.test(str):
                callOutType = "goodTitle";
                callOutContent = str.replace(/^!goodTitle(\s\w+)?$/, "$1").trim();
                break;
            case /^!goodHr$/.test(str):
                callOutType = "goodHr";
                break;
            case /^!bad(\s\w+)?$/.test(str):
                callOutType = "bad";
                callOutContent = str.replace(/^!bad(\s\w+)?$/, "$1").trim();
                break;
            case /^!badTitle(\s\w+)?$/.test(str):
                callOutType = "badTitle";
                callOutContent = str.replace(/^!badTitle(\s\w+)?$/, "$1").trim();
                break;
            case /^!badHr$/.test(str):
                callOutType = "badHr";
                break;
            case /^!warning(\s\w+)?$/.test(str):
                callOutType = "warning";
                callOutContent = str.replace(/^!warning(\s\w+)?$/, "$1").trim();
                break;
            case /^!warningTitle(\s\w+)?$/.test(str):
                callOutType = "warningTitle";
                callOutContent = str.replace(/^!warningTitle(\s\w+)?$/, "$1").trim();
                break;
            case /^!warningHr$/.test(str):
                callOutType = "warningHr";
                break;
        }
        if (callOutType !== "") {
            let cotLastWord = callOutType[callOutType.length - 1]; //CallOut Type last word
            /**Manage when the callout "tag" it's just !good, !bad or !warning wihtout any text
             * after
             */
            if (cotLastWord === "d" || cotLastWord === "g") {
                if (openCallOut) {
                    if (callOutContent !== "" && currentCOType === callOutType) {
                        return `<p>${callOutContent}</p>`;
                    }
                    else {
                        return "";
                    }
                }
                else {
                    openCallOut = true;
                    currentCOType = callOutType;
                    return `<div className="${callOutType}">`;
                }
            }
            else if (cotLastWord === "r") {
                /**Manage when the callout "tag" it's just !goodHr, !badHr or !warningHr without any text
                 * after
                 */
                if (openCallOut) {
                    return `<hr/>`;
                }
                else {
                    callOutType = "";
                }
            }
            /**Manage when the callout "tag" it's !goodTitle, !badTitle or !warningTitle and also that
             * there is some text, if there is no text for the title the type will be converted to an
             * empty string , what means that it's not valid and won't appear
             */
            if (callOutType.includes("Title")) {
                if (callOutContent !== "") {
                    let coClass = callOutType.substring(0, callOutType.lastIndexOf("T"));
                    if (openCallOut) {
                        if (coClass === currentCOType) {
                            openCallOut = true;
                            return `<div className="${coClass}"><h3>${callOutContent}</h3>`;
                        }
                        else {
                            return "";
                        }
                    }
                    else {
                        openCallOut = true;
                        currentCOType = coClass;
                        return `<div className="${coClass}"><h3>${callOutContent}</h3>`;
                    }
                }
                else {
                    callOutType = "";
                }
            }
        }
    }
    else if (quoteBlockRegex.test(str)) {
        if (quoteBlockRegexwText.test(str)) {
            if (openBlockQuote) {
                str = str.replace(/(\r\n|\n|\r)/gm, "");
                str = str.replace(/^>(.*)/, `$1`);
                str = str.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
                str = str.replace(/\*(.*?)\*/g, "<i>$1</i>");
                str = str.replace(/_([^_]+)_/g, "<sub>$1</sub>");
                str = str.replace(/--/g, "&mdash;");
                str = `<p>${str}</p>`;
            }
            else {
                str = str.replace(quoteBlockRegexwText, `<blockquote><p>$1</p>`);
                openBlockQuote = true;
            }
        }
        else {
            if (openBlockQuote) {
                str = str.replace(quoteBlockRegex, "");
            }
        }
    }
    else if (urlRegEx.test(str)) {
        str = str.replace(urlRegEx, `<a href="${`$1`}" target="_blank">$1</a>`);
    }
    else if (/([0-9]\.\s)/.test(str)) {
        let startingRegex = /^[0-9]+\.[ ](.*)/;
        let normalRegex = /^[0-9]+\.[ ](.*)/;
        if (/^([0-9]\.\s)/.test(str.trim())) {
            let layer = 0;
            let c = 0;
            while (/ |\t/.test(str.charAt(c++)))
                layer++;
            layer = (layer / 2) + 1;
            str = str.trim();
            if (olLayer === 0) {
                olLayer = 1;
                str = str.replace(startingRegex, `<ol id="ol-${olNumber}" className="list-decimal list-inside"><li>$1</li>`);
                olNumber++;
            }
            else {
                if (layer === olLayer) {
                    if (olLayer === 1) {
                        str = str.replace(startingRegex, `<li>$1</li>`).trim();
                    }
                    else {
                        str = str.replace(normalRegex, `<li>$1</li>`).trim();
                    }
                }
                else if (olLayer < layer) {
                    str = str.replace(normalRegex, `<ol className="list-decimal list-inside"><li>$1</li>`);
                    olLayer = layer;
                }
                else {
                    str = str.replace(normalRegex, `</ol><li>$1</li>`);
                    olLayer = layer;
                }
            }
        }
    }
    else if (str.includes("_") || str.includes("*") || str.includes("^") || str.includes("-")) {
        str = str.replace(/\^([^\^]+)\^/g, "<sup>$1</sup><br/>");
        if (moreThanOne(str, "*") || moreThanOne(str, "_") || moreThanOne(str, "-")) { //This part is for controlling the italics, bold and emdash
            str = str.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
            str = str.replace(/\*(.*?)\*/g, "<i>$1</i>");
            str = str.replace(/_([^_]+)_/g, "<sub>$1</sub>");
            str = str.replace(/--/g, "&mdash;");
            str = `<p>${str}</p>`;
        }
        else if (str.startsWith("*") || str.startsWith("-") || characterIsFirstWithoutSpaces(str, "*") || characterIsFirstWithoutSpaces(str, "-")) { //This part is for controlling the unordened lists
            if (ulLayer === 0) {
                str = str.replace(/^\* (.*)/gm, `<ul id="ul-${ulNumber}" className="list-disc list-inside"><li>$1</li>`);
                str = str.replace(/^\- (.*)/gm, `<ul id="ul-${ulNumber}" className="list-disc list-inside"><li>$1</li>`);
                ulLayer = 1;
                ulNumber++;
            }
            else {
                let layer = 0;
                let c = 0;
                while (/ |\t/.test(str.charAt(c++)))
                    layer++;
                layer = (layer / 2) + 1;
                if (layer === ulLayer) {
                    if (ulLayer === 1) {
                        str = str.replace(/^\* (.*)/gm, `<li>$1</li>`).trim();
                        str = str.replace(/^\- (.*)/gm, `<li>$1</li>`).trim();
                    }
                    else {
                        str = str.replace(/\* (.*)/gm, `</ul><li>$1</li>`).trim();
                        str = str.replace(/\- (.*)/gm, `</ul><li>$1</li>`).trim();
                    }
                }
                else if (ulLayer < layer) {
                    str = str.replace(/\* (.*)/gm, `<ul className="list-disc list-inside"><li>$1</li>`);
                    str = str.replace(/\- (.*)/gm, `<ul className="list-disc list-inside"><li>$1</li>`);
                    ulLayer = layer;
                }
                else {
                    str = str.replace(/\* (.*)/gm, `</ul><li>$1</li>`);
                    str = str.replace(/\- (.*)/gm, `</ul><li>$1</li>`);
                    ulLayer = layer;
                }
            }
        }
    }
    else if (characterIsFirstWithoutSpaces(str, "\\")) {
        str = str.replace(/^\s*(?!\\)/, "");
        if (/^\\todo\s[\w|\s]+/g.test(str)) {
            let todoContent = str.replace(/^\\todo\s/g, "");
            if (todoListLayer === 0) {
                todoListNumber++;
                todoListLayer = 1;
                str = str.replace(/^\\todo\s[\w|\s]+/g, `<div id="todo-${todoListNumber}">${generateCheckBoxAndLabel(`todo-component-${todoListNumber}.${todoListLayer}`, todoContent)}`);
            }
            else {
                todoListLayer++;
                str = str.replace(/^\\todo\s[\w|\s]+/g, `${generateCheckBoxAndLabel(`todo-component-${todoListNumber}.${todoListLayer}`, todoContent)}`);
            }
        }
    }
    else if (str.startsWith("```")) {
        if (str.endsWith(`sh`))
            lastSh = ``;
        inCode = !inCode;
        return inCode ? checkIfNeedClosingandAddTag() + "<pre>" : "</pre>";
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
        return checkIfNeedClosingandAddTag() + `<pre>${output}</pre>`;
    }
    else if (/^[a-zA-Z0-9]/.test(str)) {
        return `<p>${str}</p>`;
    }
    else if (!/(^(^([0-9]\.\s)|^\-\s|^\*\s|^(\!\s))|(^>*?)|\n)/g.test(str) || !characterIsFirstWithoutSpaces(str, "\\")) {
        let possibleValue = checkIfNeedClosingandAddTag(str);
        if (cleanTheLine) {
            cleanTheLine = false;
            return "";
        }
        else {
            return possibleValue + str;
        }
    }
    return str;
}
const HEAD = `<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      --content-max-width: 750px;
    }
    .content {
      overflow-y: auto;
      padding: 0 5px 50px 5px;
      
    }

    main {

      margin-left: auto;
      margin-right: auto;
      max-width: var(--content-max-width);
    }

    hr {
      width: 80%;
      margin-left: 0px;
    }

    blockquote {
      font-style: italic;
    }

    details summary { 
      cursor: pointer;
    }
    
    details summary > * {
      display: inline;
    }

    /*Classes for CallOuts*/

    .good,
    .bad,
    .warning {

      border-style: solid;
      border-width: 1px;
      border-radius: 4px;
      padding: 0 35px 0 35px;
      overflow-wrap: break-word;
    }

    .good {

      border-color: #6FAD6C;
      background-color: #8FE08B;
      color: #153b13;
    }

    .good hr {

      border: 1px solid #6eab6b;
    }

    .bad {

      border-color: #b04840;
      background-color: #e77f78;
      color: #450d09;
    }

    .bad hr {

      border: 1px solid #bf4f47;

    }

    .warning {

      border-color: #a7a343;
      background-color: #fffa64;
      color: #42401a;
    }

    .warning hr {

      border: 1px solid #bab64b;
    }
    /*Classes for CallOuts*/

    /*Classes for Spoiler*/

    .spoiler {
      border: 1px solid #999;
      border-radius: 4px;
      padding: 2px;
      background: rgb(195, 195, 195);
      padding: 0 35px 0 35px;
      margin: 20px 0 20px 0;
      overflow-wrap: break-word;
    }

    .spoiler-btn {
      user-select: none;
      font-size: 2rem;
    }
    .spoiler-btn:hover {
      cursor: pointer;
      color: rgb(120, 120, 120);
    }
    .spoiler-btn-bottom {
      width: 100%;
      text-align: right;
    }
    
    .spoiler-body {
      display: none;
      height: 0;
    }
    
    /*Classes for Spoiler*/
  </style>
  <title>Document</title>
</head>
<body>
<div id="body-container">
  <div id="content" className="content">
<main>`;
const FOOT = `</main></div></div>
</body>
</html>`;
const HEAD2 = "";
const FOOTER2 = "";
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
    fs_1.default.writeFileSync(`${buildFolder}/${pathWithoutExtension}.tsx`, `export default function ${filenameWithoutExtension}(){  return(<>` + lines.map((line) => processLine(line)).join("\n") + `</>)}`);
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
