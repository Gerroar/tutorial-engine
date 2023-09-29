"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const buildFolder = "../frontend/src/output";
let arrDirectories = [];
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
let backButtonInfoExtracted = false;
let nextButtonInfoExtracted = false;
let nextButtonCreated = false;
let backButtonCreated = false;
let cleanTheLine = false;
let navButtonsMap = new Map([
    ["back", ""],
    ["next", ""]
]);
//Regex
let quoteBlockRegex = /^\>[\s]*?/g;
let quoteBlockRegexwText = /^>(.*)/;
let urlRegEx = /(((http|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*[-a-zA-Z0-9@:%_\+~#?&//=])?)/;
//Regex
/**DONT FORGET ABOUT tsc -w WHEN WORKING WITH THE ENGINE PART IF NOT THEY WONT APPEAR ANY CHANGES FROM THE index.ts */
/**Restart all the vars to the default value */
function restartVariables() {
    inCode = false;
    lastSh = ``;
    olLayer = 0;
    olNumber = 0;
    ulLayer = 0;
    ulNumber = 0;
    todoListLayer = 0;
    todoListNumber = 0;
    openBlockQuote = false;
    openCallOut = false;
    currentCOType = ""; //CallOut type
    openSpoilerDiv = false;
    openNavBar = false;
    backButtonInfoExtracted = false;
    nextButtonInfoExtracted = false;
    nextButtonCreated = false;
    backButtonCreated = false;
    cleanTheLine = false;
    navButtonsMap.set("back", "");
    navButtonsMap.set("next", "");
}
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
    if (backButtonCreated) {
        addClosingTag = "</div>";
        backButtonCreated = false;
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
    let checkbox = `<input type="checkbox" id="${id}" name="${id}" value="${value}" className="mr-2" />`;
    let label = `<label htmlFor="${id}">${value}</label><br/>`;
    return `<div className="flex items-center mt-2 mb-2">` + checkbox + label + `</div>`;
}
/**For friday, create a function that looks for specefic [next]() [back]() links, and extract the route
 * inside of the parentesis , to generate the component name for the setter
*/
function generateComponentName(dir) {
    let dashPositions = [];
    for (let index = 0; index < dir.length; index++) {
        const element = dir[index];
        if (element === "/") {
            dashPositions.push(index);
        }
    }
    let componentName = dir.substring(dashPositions[dashPositions.length - 2] + 1);
    componentName = componentName.replace(".md", "").replace("/", "").replace(" ", "");
    componentName = componentName.replace(componentName[0], componentName[0].toUpperCase());
    return componentName;
}
function fillNavButtonsMap(str) {
    if (/\[.*\]\(.*\)/.test(str)) {
        let linkContent = str.substring(str.indexOf("[") + 1, str.lastIndexOf("]"));
        let href = str.substring(str.indexOf("(") + 1, str.lastIndexOf(")"));
        href = generateComponentName(href);
        if (/(^back$)|(^\<\-$)/gi.test(linkContent)) {
            console.log("Generated href", href);
            if (!backButtonInfoExtracted) {
                backButtonInfoExtracted = true;
                navButtonsMap.set("back", href);
            }
        }
        else if (/(^next$)|(^\-\>$)/gi.test(linkContent)) {
            console.log("Generated href", href);
            if (!nextButtonCreated) {
                nextButtonInfoExtracted = true;
                navButtonsMap.set("next", href);
            }
        }
    }
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
        if (/(^back$)|(^\<\-$)/gi.test(linkContent)) {
            href = "../" + href.replace(".md", ".tsx");
            console.log(href);
            if (!backButtonCreated) {
                backButtonCreated = true;
                return `<div className="nav-wrapper flex" aria-label="Page Navigation"><div className="nav-back flex-none" rel="previous" title="Previous Chapter" aria-label="Previous Chapter" aria-keyshortcuts="Left" onClick={() => handleLinkClick("back")}><FontAwesomeIcon icon={faAngleLeft} size="2x" color="gray"/></div><div className="flex-initial w-80"></div>`;
            }
        }
        else if (/(^next$)|(^\-\>$)/gi.test(linkContent)) {
            href = "../" + href.replace(".md", ".tsx");
            console.log(href);
            if (!nextButtonCreated) {
                if (backButtonCreated) {
                    return `<div className="nav-next flex-none" rel="next" title="Next Chapter" aria-label="Next Chapter" aria-keyshortcuts="Right" onClick={() => handleLinkClick("next")}><FontAwesomeIcon icon={faAngleRight} size="2x" color="gray"/></div>`;
                }
                else {
                    return `<div className="nav-wrapper flex" aria-label="Page Navigation"><div className="flex-none"></div><div className="flex-initial w-80"></div><div className="nav-back flex-none" rel="next" title="Next Chapter" aria-label="Next Chapter" aria-keyshortcuts="Right" onClick={() => handleLinkClick("next")}><FontAwesomeIcon icon={faAngleRight} size="2x" color="gray"/></div></div>`;
                }
                backButtonCreated = true;
            }
        }
        else {
            return `${beforeLink}<a href="${href}">${linkContent}</a>${afterLink}`;
        }
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
                return `<p className="mt-2 mb-2">${spoilerContent}</p>`;
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
/**Why arrDirectories inside this function ?
 *
 * In order to generate a menu with all the directories and files that they are being created,
 * we store the path as a string in the array
 */
function processFile(root, path) {
    console.log("I enter");
    //Restart all the needed variables
    restartVariables();
    //Restart all the needed variables
    let pathWithoutExtension = path.substring(0, path.lastIndexOf("."));
    console.log(`Processing ${pathWithoutExtension}`);
    arrDirectories.push(path);
    let filename = path.substring(path.lastIndexOf("/") + 1);
    let filenameWithoutExtension = filename.substring(0, filename.lastIndexOf("."));
    //filenameWithoutExtension = filenameWithoutExtension.replace(filenameWithoutExtension[0], filenameWithoutExtension[0].toUpperCase);
    let lines = ("" + fs_1.default.readFileSync(`${root}/${pathWithoutExtension}.md`))
        .split("\n")
        .map((x) => x.trimEnd());
    let pathWithoutFile = path.substring(0, path.lastIndexOf("/"));
    let slashes = 0;
    for (const character of path) {
        if (character === "/") {
            slashes++;
        }
    }
    let importRouteToApp = "";
    for (let i = 0; i < slashes; i++) {
        if (i === slashes - 1) {
            importRouteToApp += "../App";
        }
        else {
            importRouteToApp += "../";
        }
    }
    //Fill the map of the component name for back and next
    lines.map((line) => fillNavButtonsMap(line));
    let headOfFile = `import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
  import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
  import { pages } from "${importRouteToApp}";
  export default function ${filenameWithoutExtension}({setCurrentPageIndex}:{setCurrentPageIndex: any}){
    
    let pageIndex: number = 0;
    let backComponentName: string = "${navButtonsMap.get("back")}";
    let nextComponentName: string = "${navButtonsMap.get("next")}";
    const handleLinkClick = (option: string) => {

      for (let i = 0; i < pages.length; i++) {
        const element = pages[i];
        switch (option) {
          case "back":
            
            if (element.name === backComponentName) {
              pageIndex = i;
            }
            break;
          case "next":
            
            if (element.name === nextComponentName) {

              pageIndex = i;
            }
            break;
        }
      }

      setCurrentPageIndex(pageIndex);
    }
  return(<>`;
    fs_1.default.mkdirSync(`${buildFolder}/${pathWithoutFile}`, { recursive: true });
    fs_1.default.writeFileSync(`${buildFolder}/${pathWithoutExtension}.tsx`, headOfFile + lines.map((line) => processLine(line)).join("\n") + `</>)}`);
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
let defaultAppContentImports = `import './index.css';
import { MenuButton } from './components/MenuButton/MenuButton';
import { lazy, Suspense, useState } from 'react';

`;
let defaultAppContentFunction = `
export default function App() {

    let defaultIndex: number = 0;
    for (let i = 0; i < pages.length; i++) {
      const element = pages[i];
      if (element.name === "Index") {
        defaultIndex = i;
      }
    }

    const [currentPageIndex, setCurrentPageIndex] = useState(defaultIndex);
    const renderPage = () => {

        const Page = pages[currentPageIndex].component;
        return <Page setCurrentPageIndex={setCurrentPageIndex} />
    }

    return (
        <>
            <MenuButton currentPageIndex={currentPageIndex} setCurrentPageIndex={setCurrentPageIndex} defaultIndex={defaultIndex} />
            <div id="page-wrap" className='pl-80 pr-20'>
                <Suspense fallback={<div>Loading...</div>}>
                    {renderPage()}
                </Suspense>
            </div>
        </>
    )
}`;
let lazyImports = "";
let arrPages = `export const pages = [ \n`;
for (let index = 0; index < arrDirectories.length; index++) {
    const dir = arrDirectories[index];
    let componentName = generateComponentName(dir);
    let correctedFile = `const ${componentName} = lazy(() => import("./output${dir}"));\n`;
    correctedFile = correctedFile.replace(".md", "");
    lazyImports += correctedFile;
    if (index !== arrDirectories.length - 1) {
        arrPages += `\t{ component: ${componentName}, name: "${componentName}"},\n`;
    }
    else {
        arrPages += `\t{ component: ${componentName}, name: "${componentName}"},\n];`;
    }
}
fs_1.default.writeFileSync(`../frontend/src/App.tsx`, defaultAppContentImports + lazyImports + arrPages + defaultAppContentFunction);
fs_1.default.writeFileSync(`../frontend/src/output/directoriesList.ts`, `export const arrDirectories = [\n${arrDirectories.map(x => `"${x}"`).join(",\n")}\n];`);
