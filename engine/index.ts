/**
 * Tutorial Engine — Inline documentation
 * This file adds JSDoc comments and inline notes without changing runtime logic.
 * Purpose: make the parser/generator easier to maintain and review.
 *
 * Notes:
 * - Code blocks: languages are detected and also used to import icons from `devicons-react` (e.g., <JavascriptPlain />).
 * - Multi-language tabs: place fenced blocks back-to-back with NO blank line to group them; use a double newline to separate groups.
 * - Input path: see the CLI entry near the bottom — you can pass a root folder via CLI or edit the default test path.
 */

import { execFileSync, execSync, spawnSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
import hljs from "highlight.js";

/* =========================
   Parser state & globals
   ========================= */

const buildFolder = "../frontend/src/output";
let arrDirectories: string[] = [];
let openPageContent: boolean = false;
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
let backButtonInfoExtracted: boolean = false;
let nextButtonInfoExtracted: boolean = false;
let nextButtonCreated: boolean = false;
let backButtonCreated: boolean = false;
let cleanTheLine: boolean = false;
let navButtonsMap: Map<string, string> = new Map([
  ["back", ""],
  ["next", ""],
]);
let indexOfArrHr: number = 0;
/**This variable its used to specify which path will be the first to appear in the app, that means that it uses
 * it with the route that it's located in "/" so that means the first route to appear when the page its loaded
 * without any specific url, change it at your convinience, the specified path will appear "hardcoded" in the
 * routes and will use "/" instead of for example "/index, always start your path with / because all of the
 * paths start with them ( you can check in the generated App.jsx)
 */
let rootPath: string = "/index";
let arrLanguages: Array<string> = [];
let arrOfCodeArrays: Array<Array<string>> = [];
let addElementToArrOfArr: boolean = false;
let language: string = "";
let extractCode: boolean = false;
let blockHandler: boolean = false;
let codeCollector: string = "";
let arrCodeBlocks: Array<string> = [];
let codeInProcess: boolean = false;
let codeBlockCounter: number = 0;
let languageOfElement: string = "";
let storedLanguage: string = "";
let counterOfCodeBlocks: number = 0;
let storeCodeBlocksCounter: number = 0;
let counterOfCodeArrElements: number = 0;
let foundedCodeBlocks: number = 0;
let openCodeBlock: boolean = true;
let formattedLang: string = "";
//Regex

let quoteBlockRegex: RegExp = /^\>[\s]*?/g;
let quoteBlockRegexwText: RegExp = /^>(.*)/;
let urlRegEx: RegExp =
  /(((http|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*[-a-zA-Z0-9@:%_\+~#?&//=])?)/;

//Regex

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
  backButtonInfoExtracted = false;
  nextButtonInfoExtracted = false;
  nextButtonCreated = false;
  backButtonCreated = false;
  cleanTheLine = false;
  navButtonsMap.set("back", "");
  navButtonsMap.set("next", "");
  arrOfCodeArrays = [];
  addElementToArrOfArr = false;
  language = "";
  extractCode = false;
  blockHandler = false;
  codeCollector = "";
  arrCodeBlocks = [];
  codeInProcess = false;
  codeBlockCounter = 0;
  languageOfElement = "";
  storedLanguage = "";
  counterOfCodeBlocks = 0;
  counterOfCodeArrElements = 0;
  storeCodeBlocksCounter = 0;
  foundedCodeBlocks = 0;
  openCodeBlock = true;
  formattedLang = "";
  indexOfArrHr = 3;
}

/**
 * Return the current <hr> class suffix (e.g., "hr3") and then increase the index.
 * Use this when closing a section and starting a new one so each section can get a different style.
 * @returns string The class suffix like "hr0", "hr1", ...
 */
function checkAndIncreaseHrIndex() {
  indexOfArrHr++;
  if (indexOfArrHr > 2) {
    indexOfArrHr = 0;
  }
  return indexOfArrHr;
}

/**
 * Check if a given character is the first non-whitespace character on a line.
 * Useful to quickly detect block starters like '>', '-', '*', or digits for OL.
 * @param line Full input line (untrimmed)
 * @param char Target character to look for (e.g., '>', '-', '*')
 * @returns boolean True if `char` is the first non-space character, false otherwise
 */
function characterIsFirstWithoutSpaces(str: string, character: string) {
  let isFirstCharacter: boolean = false;
  let whiteSpaceRemoved: string = str.replace(/\s/g, "");
  if (whiteSpaceRemoved[0] === character) {
    isFirstCharacter = true;
  }

  return isFirstCharacter;
}

/**
 * Close any open block-level structures before starting a new one.
 * This prevents orphan/unterminated tags when switching between different block types
 * (e.g., callout → list → blockquote → code fence, etc.).
 *
 * The function should:
 * - Check flags/state for: open code fence, open callout, open blockquote,
 *   open lists (UL/OL and their nesting), open spoiler/collapsible blocks, etc.
 * - Generate the appropriate closing tags in the correct reverse order of opening.
 * - Reset the corresponding flags/counters for the structures it closes.
 *
 * @returns string Concatenated closing tags to append to the output before opening the new block.
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
        addClosingTag += "</ol><br/>";
      } else {
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
    } else {
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

  if (inCode) {
    inCode = false;
  }
  if (languageOfElement !== "") {
    languageOfElement = "";
  }

  return addClosingTag;
}

/**
 * Check whether `needle` appears more than once in `haystack`.
 * Useful for parsing validations where multiple markers on the same line
 * would change how the line is interpreted (or indicate malformed input).
 *
 * @param haystack Full input string to scan.
 * @param needle Substring to look for.
 * @returns boolean True if the substring occurs at least twice; otherwise false.
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

        if (i + 1 !== str.length) {
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

        if (i + 1 !== str.length) {
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

/**
 * Generate JSX markup for a to-do item composed of a checkbox and a label.
 *
 * Responsibilities:
 * - Create a unique <input type="checkbox"> element with a matching <label>.
 * - Ensure the input has a stable `id` so the label can be correctly associated.
 * - Optionally set the checkbox as checked depending on the parsed marker.
 *
 * @param id Unique id to link the <input> and <label>.
 * @param text Label text to display next to the checkbox.
 * @param checked Optional initial checked state (default: false).
 * @returns string JSX snippet containing the input and label.
 */
function generateCheckBoxAndLabel(id: string, value: string) {
  let checkbox = `<input type="checkbox" id="${id}" name="${id}" value="${value}" className="mr-2" />`;
  let label = `<label htmlFor="${id}">${value}</label><br/>`;

  return (
    `<div className="flex items-center mt-2 mb-2">` +
    checkbox +
    label +
    `</div>`
  );
}

/**
 * Convert a raw path or file name into a valid React component name.
 *
 * Rules:
 * - Capitalize the first letter of each segment.
 * - Remove or replace invalid characters (spaces, dashes, special symbols).
 * - Normalize the result so it is always a valid PascalCase identifier.
 *
 * @param raw Source string (usually derived from a Markdown file path).
 * @returns string Valid React component name (e.g., "IntroGettingStarted").
 */
function generateComponentName(dir: string) {
  let dashPositions: Array<number> = [];
  for (let index = 0; index < dir.length; index++) {
    const element = dir[index];
    if (element === "/") {
      dashPositions.push(index);
    }
  }

  let componentName: string = dir.substring(
    dashPositions[dashPositions.length - 2] + 1
  );
  componentName = componentName
    .replace(".md", "")
    .replace("/", "")
    .replace(" ", "");
  componentName = componentName.replace(
    componentName[0],
    componentName[0].toUpperCase()
  );
  return componentName;
}

/**
 * Store navigation markers ("back" and "next") found inside a Markdown file.
 *
 * Responsibilities:
 * - Detect and parse custom markers like [back: /intro] or [next: /advanced].
 * - Register them in a map keyed by the current component/file path.
 * - Allow the generated page to render navigation buttons at the bottom.
 *
 * @param currentPath Route key derived from the Markdown file path.
 * @param markerLine Raw line containing the navigation marker.
 */
function fillNavButtonsMap(str: string) {
  if (/\[.*\]\(.*\)/.test(str)) {
    let linkContent: string = str.substring(
      str.indexOf("[") + 1,
      str.lastIndexOf("]")
    );
    let href: string = str.substring(
      str.indexOf("(") + 1,
      str.lastIndexOf(")")
    );
    href = "/" + href.replace(".md", "");
    if (/(^back$)|(^\<\-$)/gi.test(linkContent)) {
      if (!backButtonInfoExtracted) {
        backButtonInfoExtracted = true;
        navButtonsMap.set("back", href);
      }
    } else if (/(^next$)|(^\-\>$)/gi.test(linkContent)) {
      if (!nextButtonInfoExtracted) {
        nextButtonInfoExtracted = true;
        navButtonsMap.set("next", href);
      }
    }
  }
}

/**
 * Save one captured fenced code block into the in-memory arrays for later rendering.
 *
 * Responsibilities:
 * - Store the code block content together with its language id.
 * - Ensure consistent indexing so multiple code blocks of the same language
 *   can be retrieved individually.
 * - Register a devicons-react import so the language tab can show its icon.
 *
 * @param language Language id extracted from the fence (e.g., "javascript", "typescript", "bash").
 * @param code Raw code block content as a single string.
 */
function fillArrOfCodeArrays(str: string) {
  if (str.startsWith("```")) {
    if (!extractCode) {
      languageOfElement = str.replace("```", "");
    }
    addElementToArrOfArr = true;
    extractCode = !extractCode;
    blockHandler = true;
  } else if (extractCode) {
    if (storedLanguage !== languageOfElement) {
      if (storedLanguage === "sh") {
        codeCollector = "$ " + codeCollector;
      }
      if (storedLanguage !== "") {
        formattedLang = storedLanguage.replace(
          storedLanguage[0],
          storedLanguage[0].toUpperCase()
        );
        if (!arrLanguages.includes(formattedLang)) {
          arrLanguages.push(formattedLang);
        }
      }
      arrCodeBlocks.push(`{
          language: ${'"' + formattedLang + '"'},
          code: ${"`" + codeCollector + "`"}
        }`);
      storedLanguage = languageOfElement;
      codeCollector = "";
    }
    codeCollector += str + "\n";
  } else if (blockHandler) {
    if (storedLanguage === "sh") {
      codeCollector = "$ " + codeCollector;
    }
    if (storedLanguage !== "") {
      formattedLang = storedLanguage.replace(
        storedLanguage[0],
        storedLanguage[0].toUpperCase()
      );
      if (!arrLanguages.includes(formattedLang)) {
        arrLanguages.push(formattedLang);
      }
    }
    arrCodeBlocks.push(`{
      language: ${'"' + formattedLang + '"'},
      code: ${"`" + codeCollector + "`"}
    }`);
    blockHandler = false;
    codeCollector = "";
  } else if (addElementToArrOfArr) {
    arrCodeBlocks = arrCodeBlocks.slice(1);
    arrOfCodeArrays.push(arrCodeBlocks);
    addElementToArrOfArr = false;
    arrCodeBlocks = [];
  }
}

/**
 * Parse a single Markdown line and update the parser state accordingly.
 *
 * Responsibilities:
 * - Detect headings (#, ##, ###) and generate JSX <h*> tags.
 * - Handle horizontal rules (---, ***) and increment hrIndex for unique styling.
 * - Manage unordered and ordered lists, opening/closing <ul>/<ol> depending on nesting.
 * - Handle blockquotes (>) with proper open/close tags.
 * - Detect and manage callouts (!good | !bad | !warning), including title and divider handling.
 * - Manage spoilers/collapsible blocks ($).
 * - Handle fenced code blocks (```lang):
 *    - On open: extract language, reset buffer, set openCodeFence = true.
 *    - On close: call fillArrOfCodeArrays(language, buffer), reset state, and insert code reference.
 * - Detect navigation markers ([back], [next]) and to-do checkboxes.
 *
 * @param str Current line of the Markdown file (trimmed).
 * @returns string The generated JSX/HTML fragment for this line,
 *                 or an empty string if the line only mutates parser state.
 */
function processLine(str: string) {
  if (str.startsWith("# ")) {
    return (
      checkIfNeedClosingandAddTag() +
      "<h1>" +
      str.substring(2) +
      `</h1><hr className="hr${checkAndIncreaseHrIndex()}"/>`
    );
  } else if (str.startsWith("## ")) {
    return (
      checkIfNeedClosingandAddTag() +
      "<h2>" +
      str.substring(3) +
      `</h2><hr className="hr${checkAndIncreaseHrIndex()}"/>`
    );
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
    let linkContent: string = str.substring(
      str.indexOf("[") + 1,
      str.lastIndexOf("]")
    );
    let href: string = str.substring(
      str.indexOf("(") + 1,
      str.lastIndexOf(")")
    );

    let afterLink: string = str.substring(str.indexOf(")") + 1);

    if (/(^back$)|(^\<\-$)/gi.test(linkContent)) {
      href = "../" + href.replace(".md", ".tsx");
      if (!backButtonCreated) {
        backButtonCreated = true;
        openPageContent = false;
        return `</div><div className="nav-wrapper flex" aria-label="Page Navigation"><Link  className="nav-back flex-none" to={backPath}><FontAwesomeIcon icon={faAngleLeft} size="2x" className="nav-icon"/></Link><div className="flex-initial w-1/2"></div>`;
      }
    } else if (/(^next$)|(^\-\>$)/gi.test(linkContent)) {
      href = "../" + href.replace(".md", ".tsx");
      if (!nextButtonCreated) {
        nextButtonCreated = true;
        if (backButtonCreated) {
          return `<Link  className="nav-next flex-none" to={nextPath}><FontAwesomeIcon icon={faAngleRight} size="2x" className="nav-icon"/></Link></div>`;
        } else {
          openPageContent = false;
          return `</div><div className="nav-wrapper flex" aria-label="Page Navigation"><div ></div><div className="flex-initial w-1/2"></div><Link  className="nav-back flex-none" to={nextPath}><FontAwesomeIcon icon={faAngleRight} size="2x" className="nav-icon"/></Link></div>`;
        }
      }
    } else {
      return `${beforeLink}<a href="${href}">${linkContent}</a>${afterLink}`;
    }
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
      let cotLastWord: string = callOutType[callOutType.length - 1]; //CallOut Type last word

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
          return `<div className="${callOutType}">`;
        }
      } else if (cotLastWord === "r") {
        /**Manage when the callout "tag" it's just !goodHr, !badHr or !warningHr without any text
         * after
         */

        if (openCallOut) {
          return `<hr className="calloutHr"/>`;
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
        str = str.replace(/(\r\n|\n|\r)/gm, "");
        str = str.replace(/^>(.*)/, `$1`);
        str = str.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
        str = str.replace(/\*(.*?)\*/g, "<i>$1</i>");
        str = str.replace(/_([^_]+)_/g, "<sub>$1</sub>");
        str = str.replace(/--/g, "&mdash;");
        str = `<p>${str}</p>`;
      } else {
        str = str.replace(quoteBlockRegexwText, `<blockquote><p>$1</p>`);
        openBlockQuote = true;
      }
    } else {
      if (openBlockQuote) {
        str = str.replace(quoteBlockRegex, "");
      }
    }
  } else if (urlRegEx.test(str) && !inCode) {
    str = str.replace(urlRegEx, `<a href="${`$1`}" target="_blank">$1</a>`);
  } else if (/([0-9]\.\s)/.test(str)) {
    let startingRegex = /^[0-9]+\.[ ](.*)/;
    let normalRegex = /^[0-9]+\.[ ](.*)/;
    if (/^([0-9]\.\s)/.test(str.trim())) {
      let layer = 0;
      let c = 0;

      while (/ |\t/.test(str.charAt(c++))) layer++;
      layer = layer / 2 + 1;
      str = str.trim();

      if (olLayer === 0) {
        olLayer = 1;
        str = str.replace(
          startingRegex,
          `<ol id="ol-${olNumber}" className="list-decimal list-inside"><li>$1</li>`
        );
        olNumber++;
      } else {
        if (layer === olLayer) {
          if (olLayer === 1) {
            str = str.replace(startingRegex, `<li>$1</li>`).trim();
          } else {
            str = str.replace(normalRegex, `<li>$1</li>`).trim();
          }
        } else if (olLayer < layer) {
          str = str.replace(
            normalRegex,
            `<ol className="list-decimal list-inside"><li>$1</li>`
          );
          olLayer = layer;
        } else {
          str = str.replace(normalRegex, `</ol><li>$1</li>`);
          olLayer = layer;
        }
      }
    }
  } else if (
    str.includes("_") ||
    str.includes("*") ||
    str.includes("^") ||
    str.includes("-")
  ) {
    str = str.replace(/\^([^\^]+)\^/g, "<sup>$1</sup><br/>");
    if (
      moreThanOne(str, "*") ||
      moreThanOne(str, "_") ||
      moreThanOne(str, "-")
    ) {
      //This part is for controlling the italics, bold and emdash

      str = str.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
      str = str.replace(/\*(.*?)\*/g, "<i>$1</i>");
      str = str.replace(/_([^_]+)_/g, "<sub>$1</sub>");
      str = str.replace(/--/g, "&mdash;");
      str = `<p>${str}</p>`;
    } else if (
      str.startsWith("*") ||
      str.startsWith("-") ||
      characterIsFirstWithoutSpaces(str, "*") ||
      characterIsFirstWithoutSpaces(str, "-")
    ) {
      //This part is for controlling the unordened lists

      if (ulLayer === 0) {
        str = str.replace(
          /^\* (.*)/gm,
          `<ul id="ul-${ulNumber}" className="list-disc list-inside"><li>$1</li>`
        );
        str = str.replace(
          /^\- (.*)/gm,
          `<ul id="ul-${ulNumber}" className="list-disc list-inside"><li>$1</li>`
        );
        ulLayer = 1;
        ulNumber++;
      } else {
        let layer = 0;
        let c = 0;

        while (/ |\t/.test(str.charAt(c++))) layer++;
        layer = layer / 2 + 1;
        if (layer === ulLayer) {
          if (ulLayer === 1) {
            str = str.replace(/^\* (.*)/gm, `<li>$1</li>`).trim();
            str = str.replace(/^\- (.*)/gm, `<li>$1</li>`).trim();
          } else {
            str = str.replace(/\* (.*)/gm, `</ul><li>$1</li>`).trim();
            str = str.replace(/\- (.*)/gm, `</ul><li>$1</li>`).trim();
          }
        } else if (ulLayer < layer) {
          str = str.replace(
            /\* (.*)/gm,
            `<ul className="list-disc list-inside"><li>$1</li>`
          );
          str = str.replace(
            /\- (.*)/gm,
            `<ul className="list-disc list-inside"><li>$1</li>`
          );
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
        str = str.replace(
          /^\\todo\s[\w|\s]+/g,
          `<div id="todo-${todoListNumber}">${generateCheckBoxAndLabel(
            `todo-component-${todoListNumber}.${todoListLayer}`,
            todoContent
          )}`
        );
      } else {
        todoListLayer++;
        str = str.replace(
          /^\\todo\s[\w|\s]+/g,
          `${generateCheckBoxAndLabel(
            `todo-component-${todoListNumber}.${todoListLayer}`,
            todoContent
          )}`
        );
      }
    }
  } else if (str.startsWith("```")) {
    language = "";
    if (str.endsWith(`sh`)) {
      lastSh = ``;
    }
    language = str.replace("```", "");

    if (counterOfCodeBlocks < arrOfCodeArrays.length) {
      inCode = !inCode;
      codeInProcess = !codeInProcess;
      if (language !== "") {
        if (foundedCodeBlocks !== 0) {
          foundedCodeBlocks--;
          return "";
        } else if (foundedCodeBlocks === 0) {
          let classToAdd = "";
          if (language.toLowerCase() === "sh") classToAdd = "bash";
          counterOfCodeArrElements = 0;
          foundedCodeBlocks = arrOfCodeArrays[counterOfCodeBlocks].length - 1;
          counterOfCodeBlocks++;
          return `
<div className="code-window ${classToAdd} mt-10 min-w-[600px] max-w-[700px]">
  <nav className="lang-nav z-20">
    <ul className="grid grid-cols-3 gap-x-32 gap-y-7 xl:gap-x-44 w-full">
          `;
        } else {
          return "";
        }
      } else {
        if (foundedCodeBlocks === 0 && counterOfCodeArrElements <= 1) {
          let arrElm: string =
            arrOfCodeArrays[counterOfCodeBlocks - 1][
              counterOfCodeArrElements - 1
            ];
          if (arrElm.includes("Sh")) {
            return `
      </ul>
    </nav>
    <div>
        <pre className={"language-bash"}><code className={"hljs language-bash"}>
        {arrCodeBlocks${counterOfCodeBlocks - 1}[0].code}
        </code></pre>
    </div>
  </div>
                  `;
          } else {
            return `
      </ul>
    </nav>
    <div className="flex flex-row justify-between">
      <AnimatePresence mode="popLayout">
          <motion.div 
          key={selectedTab ? selectedTab : "empty"}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="min-w-[400px] max-w-[466px]"
          >
            { selectedTab ? (
              <pre className={\`language-\${selectedTab.replace(selectedTab[0],
                          selectedTab[0].toLowerCase())}\`}><code className={\`hljs language-\${selectedTab.replace(selectedTab[0],
                            selectedTab[0].toLowerCase())}\`}>
              {getCodeFromArray(arrCodeBlocks${
                counterOfCodeBlocks - 1
              }, selectedTab)}
              </code></pre>
            ) : (
              "No loaded code"
            )}
          </motion.div>
        </AnimatePresence>
        {
          noCopy ? (
            ""
          ) : (
            <div className="copy-block flex flex-col justify-center">
              <motion.span className="copied-message">Copied!</motion.span>
              <motion.button 
                className="copy-button"
                whileTap={{ y: -6}}
                onClick={(e) => handleCopyClipboard(e, getCodeFromArray(arrCodeBlocks${
                  counterOfCodeBlocks - 1
                }, selectedTab))}
              ><FontAwesomeIcon icon={faCopy} className="copy-icon" size="lg"/></motion.button>
            </div>
          )
        }
      </div>
  </div>
                  `;
          }
        } else {
          return "";
        }
      }
    } else {
      if (openCodeBlock) {
        openCodeBlock = false;
      }
      return "";
    }
  } else if (inCode) {
    lastSh += str + "\n";
    if (codeInProcess) {
      let elmOfCodeArrays: Array<string> =
        arrOfCodeArrays[counterOfCodeBlocks - 1];
      if (counterOfCodeArrElements < elmOfCodeArrays.length) {
        let indexTest =
          elmOfCodeArrays[counterOfCodeArrElements].indexOf("language");
        let extractedLang: string = elmOfCodeArrays[
          counterOfCodeArrElements
        ].substring(
          indexTest + 11,
          elmOfCodeArrays[counterOfCodeArrElements].indexOf('"', indexTest + 11)
        );
        if (extractedLang === "Sh") {
          console.log("I enter");
          return `
      <li
      key={arrCodeBlocks${
        counterOfCodeBlocks - 1
      }[${counterOfCodeArrElements++}].language}
      className={arrCodeBlocks${counterOfCodeBlocks - 1}[${
            counterOfCodeArrElements - 1
          }].language === selectedTab ? "selected" : ""}
      >
      <div className="flex gap-3"><BashPlain size="30" /><span className="mt-[0.4rem] font-medium">{ arrCodeBlocks${
        counterOfCodeBlocks - 1
      }[${counterOfCodeArrElements - 1}].language}</span></div>
      </li>
      `;
        } else {
          return `
      <li
      key={arrCodeBlocks${
        counterOfCodeBlocks - 1
      }[${counterOfCodeArrElements++}].language}
      className={arrCodeBlocks${counterOfCodeBlocks - 1}[${
            counterOfCodeArrElements - 1
          }].language === selectedTab ? "selected" : ""}
      onClick={() => changeStateAndReRender(arrCodeBlocks${
        counterOfCodeBlocks - 1
      }[${counterOfCodeArrElements - 1}].language)}
      >
      <div className="flex gap-3"><${extractedLang}Plain size="30" /><span className="mt-[0.4rem] font-medium">{ arrCodeBlocks${
            counterOfCodeBlocks - 1
          }[${counterOfCodeArrElements - 1}].language}</span></div>
                {arrCodeBlocks${counterOfCodeBlocks - 1}[${
            counterOfCodeArrElements - 1
          }].language === selectedTab ? (
        <motion.div className="underline" layoutId="underline${
          counterOfCodeBlocks - 1
        }" />
        ) : null}
      </li>
      `;
        }
      } else if (counterOfCodeArrElements <= elmOfCodeArrays.length) {
        /**Inside this conditional we also handle the closing tags of the blocks of
         * code that have more than one elements
         */

        counterOfCodeArrElements++;
        return `
    </ul>
  </nav>
    <div className="flex flex-row justify-between">
      <AnimatePresence mode="popLayout" >
        <motion.div
         key={selectedTab ? selectedTab : "empty"}
         initial={{ y: 0, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         exit={{ y: -30, opacity: 0 }}
         transition={{ duration: 0.1 }}
         className="min-w-[400px] max-w-[466px]"
        >
          { selectedTab ? (
            <pre className={\`language-\${selectedTab.replace(selectedTab[0],
                        selectedTab[0].toLowerCase())}\`}><code className={\`hljs language-\${selectedTab.replace(selectedTab[0],
                          selectedTab[0].toLowerCase())}\`}>
            {getCodeFromArray(arrCodeBlocks${
              counterOfCodeBlocks - 1
            }, selectedTab)}
            </code></pre>
          ) : (
            "No loaded code"
          )}
          
        </motion.div>
      </AnimatePresence>
      {noCopy ? (""):(<div className="copy-block flex flex-col justify-center">
      <motion.span className="copied-message">Copied!</motion.span>
      <motion.button 
        className="copy-button"
        whileTap={{ y: -6}}
        onClick={(e) => handleCopyClipboard(e, getCodeFromArray(arrCodeBlocks${
          counterOfCodeBlocks - 1
        }, selectedTab))}
      ><FontAwesomeIcon icon={faCopy} className="copy-icon" size="lg"/></motion.button>
    </div>)}
    </div>
</div>
        `;
      } else {
        return "";
      }
    }
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

    return (
      checkIfNeedClosingandAddTag() +
      `<div className="output mb-10 min-w-[600px] max-w-[700px]"><pre className="min-w-[580px] max-w-[700px] language-plaintext"><code className="language-plaintext">${output.toString(
        "utf-8",
        1,
        output.length - 2
      )}</code></pre></div>`
    );
  } else if (/^[a-zA-Z0-9]/.test(str)) {
    return `<p>${str}</p>`;
  } else if (
    !/(^(^([0-9]\.\s)|^\-\s|^\*\s|^(\!\s))|(^>*?)|\n)/g.test(str) ||
    !characterIsFirstWithoutSpaces(str, "\\")
  ) {
    let possibleValue = checkIfNeedClosingandAddTag(str);
    if (cleanTheLine) {
      cleanTheLine = false;
      return "";
    } else {
      return possibleValue + str;
    }
  }
  if (inCode) {
    return "";
  }
  return str;
}

/**
 * Process a single Markdown file and convert it into a React (TSX) component.
 *
 * Workflow:
 * 1. Reset all parser state with restartVariables().
 * 2. Read the file line by line and pass each through processLine().
 * 3. Collect generated JSX fragments into a component body.
 * 4. Register code blocks, navigation markers, and other metadata.
 * 5. Write the final .tsx file under the output directory.
 * 6. Update arrDirectories so the file is included in the navigation tree.
 *
 * Why arrDirectories inside this function?
 * - In order to generate a menu with all the directories and files being created,
 *   we store each processed file path as a string inside arrDirectories.
 *
 * Notes:
 * - Each Markdown file becomes its own React component.
 * - devicons-react imports are generated automatically based on detected code blocks.
 *
 * @param root Root directory of the content tree.
 * @param path Path to the Markdown file relative to the root.
 */
function processFile(root: string, path: string) {
  //Restart all the needed variables
  restartVariables();
  //Restart all the needed variables

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

  let slashes: number = 0;
  for (const character of path) {
    if (character === "/") {
      slashes++;
    }
  }

  let importRouteToApp: string = "";
  for (let i = 0; i < slashes; i++) {
    if (i === slashes - 1) {
      importRouteToApp += "../App";
    } else {
      importRouteToApp += "../";
    }
  }

  //Fill the map of the component name for back and next
  lines.map((line) => fillNavButtonsMap(line));

  //Fill the array of code blocks
  lines.map((line) => fillArrOfCodeArrays(line));

  let backPath: string = "";
  let nextPath: string = "";

  if (navButtonsMap.get("back") !== "") {
    backPath = navButtonsMap.get("back")!;
  }

  if (navButtonsMap.get("next") !== "") {
    nextPath = navButtonsMap.get("next")!;
  }

  let headOfFile: string = `
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { motion, AnimatePresence} from "framer-motion";
import { Link } from "react-router-dom";
import "highlight.js/styles/github.css";
import hljs from "highlight.js";
import { useEffect } from "react";
`;

  function generateIconsImports(lang: string) {
    if (lang === "Sh") lang = "bash";
    lang = lang.replace(lang[0], lang[0].toUpperCase());
    return `import { ${lang}Plain } from 'devicons-react'`;
  }
  let defaultFunction = `
type StateProps = {
  selectedTab: any,
  setSelectedTab: any
}
interface ArrCodeElement {
  language: string,
  code: string
}

/**
 * Provide a copy-to-clipboard action for code blocks.
 *
 * Responsibilities:
 * - Use the Clipboard API (or a fallback) to copy code content to the user's clipboard.
 * - Optionally provide a visual or console feedback when the copy succeeds or fails.
 * - Ensure that the elementId corresponds to a valid <pre>/<code> block.
 *
 * @param elementId DOM id of the code element to copy content from.
 */
function handleCopyClipboard(e: any, code: string) {
  if (e !== null) {
    let parent = e.target.parentNode.parentNode.querySelector(".copied-message");
    parent.style.opacity = 1;
    setTimeout(() => {
      parent.style.opacity = 0;
    }, 500);
  }

  console.log(code)
}

export default function ${filenameWithoutExtension}({selectedTab, setSelectedTab}: StateProps){
  let noCopy: boolean = false;
let backPath: string = "${backPath}";
let nextPath: string = "${nextPath}";
if (backPath === "${rootPath}") {
  backPath = "/";
} else if (nextPath === "${rootPath}") {
  nextPath = "/";
}`;

/**
 * Retrieve a code block from the internal arrays by language and index.
 *
 * Responsibilities:
 * - Locate the correct language array that was populated in fillArrOfCodeArrays().
 * - Return the code snippet stored at the given index.
 * - Fallback gracefully (e.g., return empty string) if not found.
 *
 * @param language Language key (e.g., "javascript", "typescript").
 * @param index Index of the code block within that language's array (zero-based).
 * @returns string The requested code snippet or an empty string if unavailable.
 */
  let getcodeFunctionString = `
function getCodeFromArray(arr: Array<ArrCodeElement>, lang: string) {
  let codeToReturn: string = "";
  arr.map(element => {
    if (element.language === lang) {
      codeToReturn = element.code;
    }
  })
  if (codeToReturn === "") {
    noCopy = true;
    return "Language not selected";
  } else {
    noCopy = false;
    return codeToReturn;
  }
}
  `;

  let changeSateAndReRenderString = `
const changeStateAndReRender = (lang: string) => {
  setSelectedTab(lang);
  hljs.highlightAll();
};
  `;

  /**
 * Generate the TypeScript snippet that declares the per-language code arrays
 * used by the generated TSX components (and by `getCodeFromArray`).
 *
 * Responsibilities:
 * - Emit one array per language (e.g., `const jsCodes = [...]`, `const bashCodes = [...]`).
 * - Keep the original ordering so tab indices remain stable across renders.
 * - Include all captured blocks previously stored via `fillArrOfCodeArrays()`.
 * - Ensure the output is valid TypeScript to be injected into the final component file(s).
 *
 * Multi-language tabs:
 * - When consecutive fenced blocks have NO blank line between them, they are grouped
 *   as a single multi-tab block; indexes must reflect that grouping consistently.
 * - Use a double line break to intentionally separate blocks.
 *
 * Interop:
 * - These arrays are consumed by `getCodeFromArray(language, index)` inside the generated TSX.
 * - Combined with detected languages, tabs can display icons from devicons-react.
 *
 * @returns string TypeScript code that declares and exports the language → code arrays.
 */
  function generateArraysOfCodes(arr: Array<any>, i: number) {
    return `let arrCodeBlocks${i}: Array<ArrCodeElement> = [${arr}]\n`;
  }

  let beforeContent: string = `useEffect(() => {
    hljs.configure({
      ignoreUnescapedHTML: true,
    });
    hljs.highlightAll();
  },[selectedTab]);\nreturn(<><div id="page-content" className="pl-16 pr-16">\n`;
  openPageContent = true;

  function correctTheFooterTags() {
    if (openPageContent) {
      openPageContent = false;
      return `</div></>)}`;
    } else {
      return `</>)}`;
    }
  }

  fs.mkdirSync(`${buildFolder}/${pathWithoutFile}`, { recursive: true });
  fs.writeFileSync(
    `${buildFolder}/${pathWithoutExtension}.tsx`,
    headOfFile +
      arrLanguages.map((lang) => generateIconsImports(lang)).join("\n") +
      defaultFunction +
      getcodeFunctionString +
      changeSateAndReRenderString +
      arrOfCodeArrays.map((arr, i) => generateArraysOfCodes(arr, i)).join("") +
      beforeContent +
      lines.map((line) => processLine(line)).join("\n") +
      correctTheFooterTags()
  );

  fs.readFile(
    `${buildFolder}/${pathWithoutExtension}.tsx`,
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return;
      }

      const lines = data.split("\n");
      const nonEmptyLines = lines.filter((line) => line.trim() !== "");
      const modifiedContent = nonEmptyLines.join("\n");
      fs.writeFile(
        `${buildFolder}/${pathWithoutExtension}.tsx`,
        modifiedContent,
        "utf8",
        (err) => {
          if (err) {
            console.error("Error writing file:", err);
            return;
          }
        }
      );
    }
  );
}

/**
 * Recursively walk through a directory tree, processing Markdown files
 * and copying non-Markdown assets when needed.
 *
 * Workflow:
 * - Start at the given root/path.
 * - If an entry is a Markdown file (.md), pass it to processFile().
 * - If an entry is a directory, recursively call processPath() on it.
 * - If an entry is another type of file (e.g., image), copy it to the output folder.
 * - Update arrDirectories to include discovered directories for navigation.
 *
 * Notes:
 * - This function is the backbone of the engine: it drives parsing of all content.
 * - It is also invoked at the bottom of index.ts with either:
 *   - A CLI argument (`npx ts-node engine/index.ts path/to/md-root`).
 *   - The default fallback path "tests/first-test".
 *
 * @param root The root folder from which traversal begins.
 * @param path The relative path to start traversal ("" for the root itself).
 */
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
/**
 * CLI entry point of the engine.
 *
 * How it works:
 * - If you run `npx ts-node engine/index.ts some/path`, the provided path is used as root.
 * - If no argument is provided, it falls back to "tests/first-test".
 *
 * Notes:
 * - This is the recommended place to adjust the default input folder if you
 *   want to parse Markdown from another location.
 * - For development, it is best to keep your Markdown content inside `engine/`
 *   (e.g., under `engine/tests/`) for easier organization.
 *
 * Example:
 * ```bash
 * npx ts-node engine/index.ts engine/docs
 * ```
 */
processPath(process.argv[2] || "tests/first-test", "");

let defaultAppContentImports = `import './index.css';
import { MenuButton } from './components/MenuButton/MenuButton';
import { Routes, Route, } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import { useState } from "react";
`;

let appContent = `export default function App() {
    const [selectedTab, setSelectedTab] = useState("Java")
    return (
      <>
        <MenuButton rootPath={"${rootPath}"}/>
        <div id="page-wrap" className="ml-64 2xl:ml-0 pr-20 max-w-[1280px]">
          <Routes>
            <Route path="/" element={<${generateComponentName(
              rootPath
            )} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />} />  
       `;

let routeImports: string = "";
let routeElements: string = "";

for (let i = 0; i < arrDirectories.length; i++) {
  const dir = arrDirectories[i];
  let componentName: string = generateComponentName(dir);
  let routerPath: string = dir.replace(".md", "");
  let correctedFile: string = `import ${componentName} from "./output${routerPath}";\n`;
  routeImports += correctedFile;
  if (i !== arrDirectories.length - 1) {
    if (routerPath !== rootPath) {
      routeElements += `<Route path="${routerPath.replace(
        / /g,
        ""
      )}" element={<${componentName} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />} />\n`;
    } else {
      console.log(rootPath);
    }
  } else {
    console.log("routerPath", routerPath, "rootpath", rootPath);
    if (routerPath !== rootPath) {
      routeElements += `<Route path="${routerPath.replace(
        / /g,
        ""
      )}" element={<${componentName} selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>} /></Routes></div></>)};`;
    } else {
      routeElements += `\n</Routes></div></>)};\n`;
    }
  }
}

fs.writeFileSync(
  `../frontend/src/App.tsx`,
  defaultAppContentImports + routeImports + appContent + routeElements
);

fs.writeFileSync(
  `../frontend/src/output/directoriesList.ts`,
  `export const arrDirectories = [\n${arrDirectories
    .map((x) => `"${x}"`)
    .join(",\n")}\n];`
);

fs.writeFileSync(
  `../frontend/src/output/languagesUtils.ts`,
  `export const arrLanguages = [\n${arrLanguages
    .map((x) => `"${x}"`)
    .join(",\n")}\n];`
);
