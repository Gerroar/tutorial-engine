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
/**DONT FORGET ABOUT tsc -w WHEN WORKING WITH THE ENGINE PART IF NOT THEY WONT APPEAR ANY CHANGES FROM THE index.ts */
function nextCharactersAreEquals(str, character, charIndex, indexesToLook) {
    let theyAre = false;
    switch (indexesToLook) {
        case 1:
            //For two characters
            if (str[charIndex] === str[charIndex + 1]) {
                theyAre = true;
            }
            break;
        case 2:
            if (str.length !== charIndex + 2) {
                if (str[charIndex] === str[charIndex + 1] && str[charIndex + 1] === str[charIndex + 2]) {
                    theyAre = true;
                }
            }
            break;
    }
    return theyAre;
}
function wordBetweenCharacters(str, character, arrOfWords) {
    let word = "";
}
/**Get all the items from the layer stack as a string with dots between them */
function getStringFromLayerStack(listLayerStack) {
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
/**Removes the first spaces and the list character to get the text*/
function removeFirstSpacesAndListCharacter(str, character) {
    return str.substring(str.indexOf(" "), str.indexOf(character));
}
/**Checks if the character is a blank space */
function hasSpaceAfterChar(str, index) {
    let isSpace = false;
    if (str[index] === " ") {
        isSpace = true;
    }
    return isSpace;
}
/**Check if the character of the index and the next index are blank spaces what in .md files
 * is considered a tab
*/
function hasTab(str, index) {
    let isTab = false;
    if (str[index] === " " && str[index + 1] === " ") {
        isTab = true;
    }
    return isTab;
}
/**Get how many tabs are in the line, this will give us the layer of an
 * unordened list
 */
function getListLayerFromTabs(str) {
    /**Starts with one becuase when layer it's 0 means that no list was created
     * or the list before its done already, this funcion will triggered always when
     * the layer it's 1 , that means that a new list it's created already
     */
    let tabCount = 1;
    for (let i = 0; i < str.length; i++) {
        if (hasTab(str, i) && i + 1 !== str.length) {
            tabCount++;
            i++;
        }
    }
    return tabCount;
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
function replaceTheWordWithSymbols(str, arrOfWords) {
    let fullWord = "";
    let wordBetweenSymbols = "";
    let startAdding = false;
    for (const word of arrOfWords) {
        let charExpressionLength = 0;
        let charToAnalyze = "";
        let keepAdding = true;
        for (let i = 0; i < word.length; i++) {
            const element = word[i];
            if (i === 0) {
                charToAnalyze += element;
                console.log(element);
            }
            else if (element === word[0] && keepAdding === true) {
                charToAnalyze += element;
                console.log(charToAnalyze);
            }
            else if (element !== word[0]) {
                keepAdding = false;
            }
        }
        charExpressionLength = charToAnalyze.length;
        switch (charExpressionLength) {
            case 1:
            case 2:
                console.log("Its a 2 type character");
                for (let i = 0; i < str.length; i++) {
                    const chr = str[i];
                    if ((i + 1) !== str.length) {
                        let twoChars = chr + str[i + 1];
                        if (twoChars === charToAnalyze) {
                            fullWord += twoChars;
                            startAdding = !startAdding;
                            i++;
                        }
                        else if (startAdding) {
                            fullWord += chr;
                            wordBetweenSymbols += chr;
                        }
                    }
                }
                if (!startAdding) {
                    return (str.replace(fullWord, "<strong>" + wordBetweenSymbols + "</strong>"));
                }
                else {
                    break;
                }
            case 3:
                for (let i = 0; i < str.length; i++) {
                    const chr = str[i];
                    if ((i + 2) !== str.length) {
                        let threeChars = chr + str[i + 1] + str[i + 2];
                        if (threeChars === charToAnalyze) {
                            fullWord += threeChars;
                            startAdding = !startAdding;
                            i += 2;
                        }
                        else if (startAdding) {
                            fullWord += chr;
                            wordBetweenSymbols += chr;
                        }
                    }
                }
                if (!startAdding) {
                    return (str.replace(fullWord, "<em><strong>" + wordBetweenSymbols + "</em></strong>"));
                }
        }
    }
}
function generateList(listLayer, listNumber, listLayerStack, str, character) {
    if (listLayer === 0) {
        listNumber++;
        listLayer = 1;
        listLayerStack.push(1);
        return `<ul id=list-number-${listNumber}>` + `<li>` + str.substring(2) + `</li>` + `</ul>`;
    }
    else {
        let stringLayer = getListLayerFromTabs(str);
        let list = document.getElementById(`list-number-${listNumber}`);
        let nodeLi = document.createElement("li");
        let textLi = document.createTextNode(removeFirstSpacesAndListCharacter(str, character));
        nodeLi.appendChild(textLi);
        if (list) {
            if (stringLayer > listLayer) {
                listLayerStack.push(1);
                let nodeUl = document.createElement("ul");
                nodeUl.setAttribute("id", `list-number-${listNumber}.${getStringFromLayerStack(listLayerStack)}`);
                nodeUl.appendChild(nodeLi);
                list.appendChild(nodeUl);
            }
            else if (stringLayer < listLayer) {
                let stackValue = listLayerStack[stringLayer - 1];
                listLayerStack.splice(stackValue, 1, stackValue++);
                let manipulatedArray = listLayerStack.slice(0, stringLayer);
                listLayerStack = manipulatedArray;
                let subList = document.getElementById(`list-number-${listNumber}.${getStringFromLayerStack(listLayerStack)}`);
                if (subList) {
                    subList.appendChild(nodeLi);
                }
            }
            else {
                let stackValue = listLayerStack[stringLayer - 1];
                listLayerStack.splice(stackValue, 1, stackValue++);
                let subList = document.getElementById(`list-number-${listNumber}.${getStringFromLayerStack(listLayerStack)}`);
                if (subList) {
                    subList.appendChild(nodeLi);
                }
            }
            listLayer = stringLayer;
        }
    }
}
function processLine(str, listLayer, listLayerStack, listNumber) {
    if (str.startsWith("# ")) {
        return "<h1>" + str.substring(2) + "</h1>";
    }
    else if (str.startsWith("## ")) {
        return "<h2>" + str.substring(3) + "</h2>";
    }
    else if (str.startsWith("### ")) {
        return "<h3>" + str.substring(4) + "</h3>";
    }
    else if (str.startsWith("#### ")) {
        return "<h4>" + str.substring(5) + "</h4>";
    }
    else if (str.startsWith("##### ")) {
        return "<h5>" + str.substring(6) + "</h5>";
    }
    else if (str.startsWith("###### ")) {
        return "<h6>" + str.substring(7) + "</h6>";
    }
    else if (str.includes("-")) { //This part is for controlling the undordened lists
        if ((str.startsWith("-") && hasSpaceAfterChar(str, 1)) || (characterIsFirstWithoutSpaces(str, "-") && hasSpaceAfterChar(str, str.indexOf("-") + 1))) {
            generateList(listLayer, listNumber, listLayerStack, str, "-");
        }
    }
    else if (str.includes("_") || str.includes("*") || str.includes("^")) { //This part is for controlling the italics and bold
        if (moreThanOne(str, "*") || moreThanOne(str, "_")) {
            str = str.replace(/\^([^\^]+)\^/g, "<sup>$1</sup>");
            str = str.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
            str = str.replace(/\*(.*?)\*/g, "<i>$1</i>");
            str = str.replace(/_([^_]+)_/g, "<sub>$1</sub>");
        }
    }
    else if (str.startsWith("```")) {
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
    let listLayer = 0;
    let listLayerStack = [];
    let listNumber = 0;
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
    fs_1.default.writeFileSync(`${buildFolder}/${pathWithoutExtension}.html`, HEAD + lines.map((line) => processLine(line, listLayer, listLayerStack, listNumber)).join("\n") + FOOT);
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
