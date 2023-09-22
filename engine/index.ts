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
let openSpoilerDivContent: boolean = false;
let spoilerBodyCounter: number = 0;


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

    while (ulLayer-- != 0) addClosingTag += "</ul></br>"
    ulLayer = 0;
  }

  if (olLayer != 0) {

    while (olLayer-- != 0) addClosingTag += "</ol></br>"
    olLayer = 0;
  }

  if (todoListLayer != 0) {

    addClosingTag = "</div></br>"
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

  if (openSpoilerDiv && openSpoilerDivContent) {

    addClosingTag = "</div></div>";
    openSpoilerDiv = false;
    openSpoilerDivContent = false;
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


  let checkbox = `<input type="checkbox" id="${id}" name="${id}" value="${value}">`;
  let label = `<label for="${value}">${value}</label><br>`

  return checkbox + label
}

function processLine(str: string) {
  if (str.startsWith("# ")) {

    return checkIfNeedClosingandAddTag() + "<h1>" + str.substring(2) + "</h1><hr>";
  } else if (str.startsWith("## ")) {

    return checkIfNeedClosingandAddTag() + "<h2>" + str.substring(3) + "</h2><hr>";
  } else if (str.startsWith("### ")) {

    return checkIfNeedClosingandAddTag() + "<h3>" + str.substring(4) + "</h3>";
  } else if (str.startsWith("#### ")) {

    return checkIfNeedClosingandAddTag() + "<h4>" + str.substring(5) + "</h4>";
  } else if (str.startsWith("##### ")) {

    return checkIfNeedClosingandAddTag() + "<h5>" + str.substring(6) + "</h5>";
  } else if (str.startsWith("###### ")) {

    return checkIfNeedClosingandAddTag() + "<h6>" + str.substring(7) + "</h6>";
  } else if (/^\$/.test(str)) {
    if (/^\$title\s(\w+(.*)?)/.test(str)) {
      let spoilerTitle: string = str.replace(/^\$title\s(\w+(.*)?)/, "$1");
      if (openSpoilerDiv) {
        if (openSpoilerDivContent) {

          openSpoilerDivContent = false;
          return `</div></div><div class="spoiler"><div class="spoiler-btn spoiler-btn-top">${spoilerTitle}</div>`;
        } else {

          return `</div><div class="spoiler"><div class="spoiler-btn spoiler-btn-top">${spoilerTitle}</div>`;
        }
      } else {

        openSpoilerDiv = true;
        return `<div class="spoiler"><div class="spoiler-btn spoiler-btn-top">${spoilerTitle}</div>`;
      }
    } else if (openSpoilerDiv) {
      if (/^\$\s(\w+(.*)?)/.test(str)) {

        let spoilerContent: string = str.replace(/^\$\s(\w+(.*)?)/, "$1");
        if (openSpoilerDivContent) {

          return `<p>${spoilerContent}</p>`;
        } else {

          openSpoilerDivContent = true;
          spoilerBodyCounter++;
          return `<div class="spoiler-body" id="spoiler-body-${spoilerBodyCounter}"><p>${spoilerContent}</p>`;
        }
      } else if (/^\$$/) {
        if (openSpoilerDivContent) {

          return "";
        } else {

          openSpoilerDivContent = true;
          spoilerBodyCounter++;
          return `<div class="spoiler-body" id="spoiler-body-${spoilerBodyCounter}">`
        }
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
          return `<div class="${callOutType}">`
        }
      } else if (cotLastWord === "r") {
        /**Manage when the callout "tag" it's just !goodHr, !badHr or !warningHr without any text
         * after
         */

        if (openCallOut) {

          return `<hr>`
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
              return `<div class="${coClass}"><h3>${callOutContent}</h3>`;
            } else {

              return "";
            }
          } else {

            openCallOut = true;
            currentCOType = coClass;
            return `<div class="${coClass}"><h3>${callOutContent}</h3>`;
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
      } else {

        str = str.replace(quoteBlockRegexwText, `<blockquote>$1`)
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
        str = str.replace(startingRegex, `<ol id="ol-${olNumber}"><li>$1</li>`);
        olNumber++;
      } else {
        if (layer === olLayer) {
          if (olLayer === 1) {

            str = str.replace(startingRegex, `<li>$1</li>`).trim();
          } else {

            str = str.replace(normalRegex, `<li>$1</li>`).trim();
          }
        } else if (olLayer < layer) {

          str = str.replace(normalRegex, `<ol><li>$1</li>`);
          olLayer = layer;
        } else {

          str = str.replace(normalRegex, `</ol><li>$1</li>`);
          olLayer = layer;
        }

      }
    }

  } else if (str.includes("_") || str.includes("*") || str.includes("^") || str.includes("-")) {

    str = str.replace(/\^([^\^]+)\^/g, "<sup>$1</sup>");
    if (moreThanOne(str, "*") || moreThanOne(str, "_") || moreThanOne(str, "-")) { //This part is for controlling the italics, bold and emdash

      str = str.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
      str = str.replace(/\*(.*?)\*/g, "<i>$1</i>");
      str = str.replace(/_([^_]+)_/g, "<sub>$1</sub>");
      str = str.replace(/--/g, "&mdash;");
    } else if (str.startsWith("*") || str.startsWith("-") || characterIsFirstWithoutSpaces(str, "*") || characterIsFirstWithoutSpaces(str, "-")) { //This part is for controlling the unordened lists

      if (ulLayer === 0) {

        str = str.replace(/^\* (.*)/gm, `<ul id="ul-${ulNumber}"><li>$1</li>`);
        str = str.replace(/^\- (.*)/gm, `<ul id="ul-${ulNumber}"><li>$1</li>`);
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

          str = str.replace(/\* (.*)/gm, `<ul><li>$1</li>`);
          str = str.replace(/\- (.*)/gm, `<ul><li>$1</li>`);
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
  } else if (!/(^(^([0-9]\.\s)|^\-\s|^\*\s|^(\!\s))|(^>*?)|\n)/g.test(str) || !characterIsFirstWithoutSpaces(str, "\\")) {

    let possibleValue = checkIfNeedClosingandAddTag(str);

    if (cleanTheLine) {

      cleanTheLine = false;
      return "";
    } else {

      return possibleValue + str
    }
  }

  return str + "</br>";
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
<div id="content" class="content">
<main>`;
const FOOT = `</main></div>
<script>
    function toggleSpoilerAnimated(spoilerElement, isInvertedCollapse, isInvertedExpand, duration=1000) {
      let spoilerBody = spoilerElement.querySelector('.spoiler-body');
      let isCollapsing = spoilerElement.classList.contains('expanded');
      let heightBefore = spoilerElement.offsetHeight;
      
      let offsetBefore = window.scrollY;
      spoilerElement.classList.toggle('expanded', !isCollapsing);
      let isScrollRequired = ( isCollapsing && isInvertedCollapse) ||
                              (!isCollapsing && isInvertedExpand );
    
      
      // define a scroll func if one is required
      let scrollFunc = (isScrollRequired)
        ? () => {
          let heightNow = spoilerElement.offsetHeight;
          let heightDelta = heightNow - heightBefore;
           
          window.scrollTo(0, offsetBefore + heightDelta);
        }
        : undefined;
      slideToggle(spoilerBody, !isCollapsing, { duration: duration, progress: scrollFunc, complete: scrollFunc });
    }
    
    for (let el of document.querySelectorAll('.spoiler-btn-top')) {
      el.addEventListener('click', e => toggleSpoilerAnimated(el.parentNode));
    }
    for (let el of document.querySelectorAll('.spoiler-btn-bottom')) {
      el.addEventListener('click', e => toggleSpoilerAnimated(el.parentNode, true, true));
    }
    
    function slideUp(element, options) { slideToggle(element, false, options); }
    function slideDown(element, options) { slideToggle(element, true, options); }
    
    // main sliding
    function slideToggle(element, isOpening, options) {
      let h0 = getHeight(element);
      
      // set up transition event listeners
      function resetStyle() {
        console.log("reset");
        //element.style.display = "none";
        //element.style.height = '';
      }
      
      const logType = e => console.log(e.type, e.propertyName);
      element.addEventListener('transitionend', (e) => {
        if (!isOpening) {
          resetStyle();
        }
        logType(e);
        }, true);
      element.addEventListener('transitioncancel', logType, true);
      element.addEventListener('transitionrun', logType, true);
      element.addEventListener('transitionstart', logType, true);
    
      
      // change: get to duration from css
      let duration = (options && options.duration) || 1000;
      element.style.transitionDuration = duration + "ms";
      element.style.transitionProperty = "height";
      let start = null;
      
      function step(timestamp) {
        if (!start) { start = timestamp; }
        let progress = 1.0 * (timestamp - start) / duration;
        let h1 = isOpening ? (h0 * progress) : (h0 * (1 - progress));
        if ((progress) < 1.0) {
          //element.style.height = h1 + 'px';
          if (options.progress) { options.progress(); }
          window.requestAnimationFrame(step);
        } else {
          //element.style.height = '';
          //element.style.overflow = '';
          //if (!isOpening) { element.style.display = 'none'; }
          console.log("here");
          if (!isOpening) { 
            // reset height so that h0 can be calculated again
            // OLD STYLE RESET
            // element.style.display = "none";
            // element.style.height = '';
    
          }
          //if (options.complete) { options.complete(); }
        }
      }
      
      // toggle un-hide
      element.style.display = 'block';
      // changed:  // timeout due to mdn ...
      setTimeout(() => {
        //element.style.height = 0;
        if (!isOpening) {
          element.style.height = "0px";
          console.log("going down");
        } else {
          let allLengthsTogether = 0;
          let elementChildren = element.children;

          if (elementChildren !== 0) {
            if (elementChildren.length === 1) {

              allLengthsTogether = elementChildren[0].innerHTML.length;
            } else {

              for (const children of elementChildren) {

                allLengthsTogether += children.innerHTML.length
              }
            }

            if (allLengthsTogether < 103) {

              element.style.height = 50 + "px";
            } else {

              console.log(allLengthsTogether / 102)
              element.style.height = ((allLengthsTogether / 102) * 2) + "vh";
            }
          }
        }
        element.style.overflow = 'hidden';
        window.requestAnimationFrame(step);
      }, 3);
    }
    
    // https://stackoverflow.com/a/29047232/3423843
    function getHeight(el) {
      let el_comp_style = window.getComputedStyle(el),
        el_display    = el_comp_style.display,
        el_max_height = el_comp_style.maxHeight.replace('px', '').replace('%', ''),
        el_position   = el.style.position,
        el_visibility = el.style.visibility,
        wanted_height = 0;
        
        console.log("joehoe", el_max_height, el_display);
        
    
      if (el_display !== 'none' && el_max_height !== '0' && el_max_height !== 'none') {
        return el.offsetHeight;
      }
      
    
      el.style.position   = 'absolute';
      el.style.visibility = 'hidden';
      el.style.display    = 'block';
    
      wanted_height = el.offsetHeight;
    
      el.style.display    = el_display;
      el.style.position   = el_position;
      el.style.visibility = el_visibility;
    
      return wanted_height;
    }  
  </script>
</body>
</html>`;

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
    `${buildFolder}/${pathWithoutExtension}.html`,
    HEAD + lines.map((line) => processLine(line)).join("\n") + FOOT
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

/** Same as creating files for every page, each time that a new directory or file its created 
 * the array will be updated so will the menu do, the array it's being mapped to transform 
 * the contents into strings 
 */
fs.writeFileSync(
  `../frontend/src/output/directoriesList.ts`,
  `export const arrDirectories = [\n${arrDirectories.map(x => `"${x}"`).join(",\n")}\n];`
)

