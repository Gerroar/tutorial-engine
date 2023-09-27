import { execFileSync, execSync, spawnSync } from "child_process";
import fs from "fs";
import crypto from "crypto";

const buildFolder = "../frontend/src/output";
var arrDirectories: string[] = [];

let inCode = false;
let lastSh = ``;
let olLayer: number = 0;
let olNumber: number = 0;
let ulLayer: number = 0;
let ulNumber: number = 0;
let todoListLayer: number = 0;
let todoListNumber: number = 0;
let openBlockQuote: boolean = false;
let openCallOut: boolean = false;
let currentCOType: string = ""; //CallOut type
let openSpoilerDiv: boolean = false;
let openNavBar: boolean = false;
let nextButtonCreated: boolean = false;
let backButtonCreated: boolean = false;

let cleanTheLine: boolean = false;
//Regex

let quoteBlockRegex: RegExp = /^\>[\s]*?/g;
let quoteBlockRegexwText: RegExp = /^>(.*)/;
let urlRegEx: RegExp = /(((http|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*[-a-zA-Z0-9@:%_\+~#?&//=])?)/

//Regex

/**DONT FORGET ABOUT tsc -w WHEN WORKING WITH THE ENGINE PART IF NOT THEY WONT APPEAR ANY CHANGES FROM THE index.ts */



/**Removes the spaces to check if the first character is the one that was passed, this function it's used for detecting
 * if the line it's part of a nested list or just a line that concides with the characters used for lists
*/

function characterIsFirstWithoutSpaces(str: string, character: string) {

  let isFirstCharacter: boolean = false;
  let whiteSpaceRemoved: string = str.replace(/\s/g, '');
  if (whiteSpaceRemoved[0] === character) {

    isFirstCharacter = true;
  }

  return isFirstCharacter;
}


/**Function used for adding close tag ul in case that the next line doesn't have
 * * or - , checking the listLayer
 */

function checkIfNeedClosingandAddTag(str?: string) {

  let addClosingTag = "";
  if (ulLayer != 0) {

    while (ulLayer-- != 0) {
      if (ulLayer === 0) {

        addClosingTag += "</ul><br/>";
      } else {

        addClosingTag += "</ul>";
      }
    }
    ulLayer = 0;
  }

  if (olLayer != 0) {

    while (olLayer-- != 0) {
      if (olLayer === 0) {

        addClosingTag += "</ol><br/>"
      } else {

        addClosingTag += "</ol>";
      }
    }
    olLayer = 0;
  }

  if (todoListLayer != 0) {

    addClosingTag = "</div><br/>"
    todoListLayer = 0;
  }

  if (openBlockQuote) {

    if (str) {
      if (/^>[\s]*?/.test(str)) {

        cleanTheLine = true;
      }
    } else {

      addClosingTag = "</blockquote>"
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

function moreThanOne(str: string, charType: string) {

  let charTypeLength: number = charType.length;
  let hasMoreThanOne: boolean = false;
  let howManyChars: number = 0;

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

          let twoChars = chr + str[i + 1]
          if (twoChars === charType) {
            i++;
            howManyChars += 2
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

          let twoChars = chr + str[i + 1]
          if (twoChars === charType) {
            i++;
            howManyChars += 2
          }
        }
      }

      if (howManyChars > 3) {

        hasMoreThanOne = true;
      }

      return hasMoreThanOne;
  }
}

function generateCheckBoxAndLabel(id: string, value: string) {


  let checkbox = `<input type="checkbox" id="${id}" name="${id}" value="${value}" className="mr-2" />`;
  let label = `<label htmlFor="${id}">${value}</label><br/>`

  return `<div className="flex items-center mt-2 mb-2">` + checkbox + label + `</div>`
}

function processLine(str: string) {
  if (str.startsWith("# ")) {

    return checkIfNeedClosingandAddTag() + "<h1>" + str.substring(2) + "</h1><hr/>";
  } else if (str.startsWith("## ")) {

    return checkIfNeedClosingandAddTag() + "<h2>" + str.substring(3) + "</h2><hr/>";
  } else if (str.startsWith("### ")) {

    return checkIfNeedClosingandAddTag() + "<h3>" + str.substring(4) + "</h3>";
  } else if (str.startsWith("#### ")) {

    return checkIfNeedClosingandAddTag() + "<h4>" + str.substring(5) + "</h4>";
  } else if (str.startsWith("##### ")) {

    return checkIfNeedClosingandAddTag() + "<h5>" + str.substring(6) + "</h5>";
  } else if (str.startsWith("###### ")) {

    return checkIfNeedClosingandAddTag() + "<h6>" + str.substring(7) + "</h6>";
  } else if (/\[.*\]\(.*\)/.test(str)) {

    let beforeLink: string = str.substring(0, str.lastIndexOf("["));
    let linkContent: string = str.substring(str.indexOf("[") + 1, str.lastIndexOf("]"));
    let href: string = str.substring(str.indexOf("(") + 1, str.lastIndexOf(")"));
    let afterLink: string = str.substring(str.indexOf(")") + 1);

    if (/(^next$)|(^\-\>$)/gi.test(linkContent)) {

      if (!nextButtonCreated) {



        if (backButtonCreated) {



        } else {



        }

        nextButtonCreated = true;

      }

    } else if (/(^back$)|(^\<\-$)/gi.test(linkContent)) {
      if (!backButtonCreated) {
        if (nextButtonCreated) {


        } else {

        }

        backButtonCreated = true;

      }
    } else {

      return `${beforeLink}<a href="${href}">${linkContent}</a>${afterLink}`;
    }


    //&#9001;

    /**FOR TUESDAY: 
     * - Add the page-wrapper ( inspect the structure of rust tutorial example)
     * - Create and add the nav and elements for the desktop option
     * - Create the classes for all the navs and their elements
     * - Make the arrows good looking like in the rust tutorial example
     */


  } else if (/^\$/.test(str)) {
    if (/^\$title\s(\w+(.*)?)/.test(str)) {
      let spoilerTitle: string = str.replace(/^\$title\s(\w+(.*)?)/, "$1");
      if (openSpoilerDiv) {

        return `</details><details><summary>${spoilerTitle}</summary>`;
      } else {

        openSpoilerDiv = true;
        return `<details><summary>${spoilerTitle}</summary>`;
      }
    } else if (openSpoilerDiv) {
      if (/^\$\s(\w+(.*)?)/.test(str)) {

        let spoilerContent: string = str.replace(/^\$\s(\w+(.*)?)/, "$1");
        return `<p className="mt-2 mb-2">${spoilerContent}</p>`;
      } else if (/^\$$/) {

        return "";
      }
    }
  } else if (/^!/.test(str)) {
    let callOutType: string = "";
    let callOutContent: string = "";

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


      let cotLastWord: string = callOutType[callOutType.length - 1] //CallOut Type last word

      /**Manage when the callout "tag" it's just !good, !bad or !warning wihtout any text
       * after
       */

      if (cotLastWord === "d" || cotLastWord === "g") {
        if (openCallOut) {
          if (callOutContent !== "" && currentCOType === callOutType) {

            return `<p>${callOutContent}</p>`;
          } else {


            return "";
          }
        } else {

          openCallOut = true;
          currentCOType = callOutType;
          return `<div className="${callOutType}">`
        }
      } else if (cotLastWord === "r") {
        /**Manage when the callout "tag" it's just !goodHr, !badHr or !warningHr without any text
         * after
         */

        if (openCallOut) {

          return `<hr/>`
        } else {

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
            } else {

              return "";
            }
          } else {

            openCallOut = true;
            currentCOType = coClass;
            return `<div className="${coClass}"><h3>${callOutContent}</h3>`;
          }
        } else {

          callOutType = "";
        }
      }
    }


  } else if (quoteBlockRegex.test(str)) {
    if (quoteBlockRegexwText.test(str)) {
      if (openBlockQuote) {
        str = str.replace(/(\r\n|\n|\r)/gm, "")
        str = str.replace(/^>(.*)/, `$1`);
        str = str.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
        str = str.replace(/\*(.*?)\*/g, "<i>$1</i>");
        str = str.replace(/_([^_]+)_/g, "<sub>$1</sub>");
        str = str.replace(/--/g, "&mdash;")
        str = `<p>${str}</p>`;
      } else {

        str = str.replace(quoteBlockRegexwText, `<blockquote><p>$1</p>`)
        openBlockQuote = true;
      }
    } else {
      if (openBlockQuote) {

        str = str.replace(quoteBlockRegex, "");
      }
    }
  } else if (urlRegEx.test(str)) {

    str = str.replace(urlRegEx, `<a href="${`$1`}" target="_blank">$1</a>`)
  } else if (/([0-9]\.\s)/.test(str)) {

    let startingRegex = /^[0-9]+\.[ ](.*)/;
    let normalRegex = /^[0-9]+\.[ ](.*)/;
    if (/^([0-9]\.\s)/.test(str.trim())) {

      let layer = 0;
      let c = 0;

      while (/ |\t/.test(str.charAt(c++))) layer++;
      layer = (layer / 2) + 1;
      str = str.trim();

      if (olLayer === 0) {

        olLayer = 1;
        str = str.replace(startingRegex, `<ol id="ol-${olNumber}" className="list-decimal list-inside"><li>$1</li>`);
        olNumber++;
      } else {
        if (layer === olLayer) {
          if (olLayer === 1) {

            str = str.replace(startingRegex, `<li>$1</li>`).trim();
          } else {

            str = str.replace(normalRegex, `<li>$1</li>`).trim();
          }
        } else if (olLayer < layer) {

          str = str.replace(normalRegex, `<ol className="list-decimal list-inside"><li>$1</li>`);
          olLayer = layer;
        } else {

          str = str.replace(normalRegex, `</ol><li>$1</li>`);
          olLayer = layer;
        }

      }
    }

  } else if (str.includes("_") || str.includes("*") || str.includes("^") || str.includes("-")) {

    str = str.replace(/\^([^\^]+)\^/g, "<sup>$1</sup><br/>");
    if (moreThanOne(str, "*") || moreThanOne(str, "_") || moreThanOne(str, "-")) { //This part is for controlling the italics, bold and emdash

      str = str.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
      str = str.replace(/\*(.*?)\*/g, "<i>$1</i>");
      str = str.replace(/_([^_]+)_/g, "<sub>$1</sub>");
      str = str.replace(/--/g, "&mdash;");
      str = `<p>${str}</p>`;
    } else if (str.startsWith("*") || str.startsWith("-") || characterIsFirstWithoutSpaces(str, "*") || characterIsFirstWithoutSpaces(str, "-")) { //This part is for controlling the unordened lists

      if (ulLayer === 0) {

        str = str.replace(/^\* (.*)/gm, `<ul id="ul-${ulNumber}" className="list-disc list-inside"><li>$1</li>`);
        str = str.replace(/^\- (.*)/gm, `<ul id="ul-${ulNumber}" className="list-disc list-inside"><li>$1</li>`);
        ulLayer = 1;
        ulNumber++;
      } else {

        let layer = 0;
        let c = 0;

        while (/ |\t/.test(str.charAt(c++))) layer++;
        layer = (layer / 2) + 1;
        if (layer === ulLayer) {
          if (ulLayer === 1) {

            str = str.replace(/^\* (.*)/gm, `<li>$1</li>`).trim();
            str = str.replace(/^\- (.*)/gm, `<li>$1</li>`).trim();
          } else {

            str = str.replace(/\* (.*)/gm, `</ul><li>$1</li>`).trim();
            str = str.replace(/\- (.*)/gm, `</ul><li>$1</li>`).trim();
          }
        } else if (ulLayer < layer) {

          str = str.replace(/\* (.*)/gm, `<ul className="list-disc list-inside"><li>$1</li>`);
          str = str.replace(/\- (.*)/gm, `<ul className="list-disc list-inside"><li>$1</li>`);
          ulLayer = layer;
        } else {

          str = str.replace(/\* (.*)/gm, `</ul><li>$1</li>`);
          str = str.replace(/\- (.*)/gm, `</ul><li>$1</li>`);
          ulLayer = layer;
        }
      }
    }

  } else if (characterIsFirstWithoutSpaces(str, "\\")) {

    str = str.replace(/^\s*(?!\\)/, "");
    if (/^\\todo\s[\w|\s]+/g.test(str)) {

      let todoContent = str.replace(/^\\todo\s/g, "");
      if (todoListLayer === 0) {

        todoListNumber++;
        todoListLayer = 1;
        str = str.replace(/^\\todo\s[\w|\s]+/g, `<div id="todo-${todoListNumber}">${generateCheckBoxAndLabel(`todo-component-${todoListNumber}.${todoListLayer}`, todoContent)}`);
      } else {

        todoListLayer++;
        str = str.replace(/^\\todo\s[\w|\s]+/g, `${generateCheckBoxAndLabel(`todo-component-${todoListNumber}.${todoListLayer}`, todoContent)}`);
      }
    }
  } else if (str.startsWith("```")) {

    if (str.endsWith(`sh`)) lastSh = ``;
    inCode = !inCode;
    return inCode ? checkIfNeedClosingandAddTag() + "<pre>" : "</pre>";
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
    return checkIfNeedClosingandAddTag() + `<pre>${output}</pre>`;
  } else if (/^[a-zA-Z0-9]/.test(str)) {

    return `<p>${str}</p>`
  } else if (!/(^(^([0-9]\.\s)|^\-\s|^\*\s|^(\!\s))|(^>*?)|\n)/g.test(str) || !characterIsFirstWithoutSpaces(str, "\\")) {

    let possibleValue = checkIfNeedClosingandAddTag(str);
    if (cleanTheLine) {

      cleanTheLine = false;
      return "";
    } else {

      return possibleValue + str
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

function processFile(root: string, path: string) {

  let pathWithoutExtension = path.substring(0, path.lastIndexOf("."));
  console.log(`Processing ${pathWithoutExtension}`);
  arrDirectories.push(path);
  let filename = path.substring(path.lastIndexOf("/") + 1);
  let filenameWithoutExtension = filename.substring(
    0,
    filename.lastIndexOf(".")
  );
  let lines = ("" + fs.readFileSync(`${root}/${pathWithoutExtension}.md`))
    .split("\n")
    .map((x) => x.trimEnd());
  let pathWithoutFile = path.substring(0, path.lastIndexOf("/"));
  fs.mkdirSync(`${buildFolder}/${pathWithoutFile}`, { recursive: true });
  fs.writeFileSync(
    `${buildFolder}/${pathWithoutExtension}.tsx`,
    `export default function ${filenameWithoutExtension}(){  return(<>` + lines.map((line) => processLine(line)).join("\n") + `</>)}`
  );
}

function processPath(root: string, path: string) {
  if (fs.lstatSync(`${root}/${path}`).isFile()) {
    let extension = path.substring(path.lastIndexOf(".") + 1);
    if (!["md", "png"].includes(extension))
      console.log(`Warning. Unknown extension: ${root}${path}`);
    if (extension === "md") processFile(root, path);
    else fs.copyFileSync(`${root}/${path}`, `${buildFolder}/${path}`);
  } else {
    fs.readdirSync(`${root}/${path}`).forEach((f) => {
      processPath(root, `${path}/${f}`);
    });
  }
}
fs.rmSync(buildFolder, { recursive: true, force: true });
fs.mkdirSync(buildFolder);
processPath(process.argv[2] || "tests/first-test", "");

let defaultAppContentImports = `import './index.css';
import { MenuButton } from './components/MenuButton/MenuButton';
import { lazy, Suspense, useState } from 'react';

`
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
        return <Page />
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

function generateComponentName(dir: string) {

  let dashPositions: Array<number> = [];
  for (let index = 0; index < dir.length; index++) {
    const element = dir[index];
    if (element === "/") {

      dashPositions.push(index);
    }
  }

  let componentName: string = dir.substring(dashPositions[dashPositions.length - 2] + 1);
  componentName = componentName.replace(".md", "").replace("/", "").replace(" ", "");
  componentName = componentName.replace(componentName[0], componentName[0].toUpperCase())
  return componentName;
}

let lazyImports: string = "";
let arrPages: string = `const pages = [ \n`;

for (let index = 0; index < arrDirectories.length; index++) {
  const dir = arrDirectories[index];
  let componentName: string = generateComponentName(dir);
  let correctedFile: string = `const ${componentName} = lazy(() => import("./output${dir}"));\n`;
  correctedFile = correctedFile.replace(".md", "");

  lazyImports += correctedFile;

  if (index !== arrDirectories.length - 1) {

    arrPages += `\t{ component: ${componentName}, name: "${componentName}"},\n`
  } else {

    arrPages += `\t{ component: ${componentName}, name: "${componentName}"},\n];`
  }
}



fs.writeFileSync(
  `../frontend/src/App.tsx`,
  defaultAppContentImports + lazyImports + arrPages + defaultAppContentFunction
)

fs.writeFileSync(
  `../frontend/src/output/directoriesList.ts`,
  `export const arrDirectories = [\n${arrDirectories.map(x => `"${x}"`).join(",\n")}\n];`
)

