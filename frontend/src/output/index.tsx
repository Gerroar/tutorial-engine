import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { motion, AnimatePresence} from "framer-motion";
import { Link } from "react-router-dom";
import "highlight.js/styles/github.css";
import hljs from "highlight.js";
import { useEffect } from "react";
import { JavaPlain } from 'devicons-react'
import { BashPlain } from 'devicons-react'
import { TypescriptPlain } from 'devicons-react'
import { JavascriptPlain } from 'devicons-react'
import { RustPlain } from 'devicons-react'
import { GoPlain } from 'devicons-react'
type StateProps = {
  selectedTab: any,
  setSelectedTab: any
}
interface ArrCodeElement {
  language: string,
  code: string
}
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
export default function index({selectedTab, setSelectedTab}: StateProps){
  let noCopy: boolean = false;
let backPath: string = "";
let nextPath: string = "/chapter1/index";
if (backPath === "/index") {
  backPath = "/";
} else if (nextPath === "/index") {
  nextPath = "/";
}
function getCodeFromArray(arr: Array<ArrCodeElement>, lang: string) {
  let codeToReturn: string = "";
  arr.map(element => {
    if (element.language === lang) {
      codeToReturn = element.code;
    }
  })
  if (codeToReturn === "") {
    noCopy = false;
    return "Language not selected";
  } else {
    noCopy = true;
    return codeToReturn;
  }
}
const changeStateAndReRender = (lang: string) => {
  setSelectedTab(lang);
  hljs.highlightAll();
};
  let arrCodeBlocks0: Array<ArrCodeElement> = [{
      language: "Sh",
      code: `$ mist whoami
`
    }]
let arrCodeBlocks1: Array<ArrCodeElement> = [{
      language: "Typescript",
      code: `document.getElementById("demo").innerHTML = "Hello JavaScript";
`
    }]
let arrCodeBlocks2: Array<ArrCodeElement> = [{
          language: "Java",
          code: `class GFG {
      // main function
    public static void main(String[] args)
    {
        // Declare the variables
        int num;
        // Input the integer
        System.out.println("Enter the integer: ");
        // Create Scanner object
        Scanner s = new Scanner(System.in);
        // Read the next integer from the screen
        num = s.nextInt();
        // Display the integer
        System.out.println("Entered integer is: "
                           + num);
    }
}
`
        },{
          language: "Typescript",
          code: `alert("whatever");
`
        },{
      language: "Javascript",
      code: `alert("whatever");
`
    }]
let arrCodeBlocks3: Array<ArrCodeElement> = [{
          language: "Java",
          code: `class GFG {
      // main function
    public static void main(String[] args)
    {
        System.out.println("Another thing");
    }
}
`
        },{
          language: "Typescript",
          code: `alert("Another thing");
`
        },{
          language: "Rust",
          code: `fn main() {
    // Statements here are executed when the compiled binary is called.
    // Print text to the console.
    println!("Hello World!");
}
`
        },{
          language: "Go",
          code: `package funding
type Fund struct {
    // balance is unexported (private), because it's lowercase
    balance int
}
// A regular function returning a pointer to a fund
func NewFund(initialBalance int) *Fund {
    // We can return a pointer to a new struct without worrying about
    // whether it's on the stack or heap: Go figures that out for us.
    return &Fund{
        balance: initialBalance,
    }
}
// Methods start with a *receiver*, in this case a Fund pointer
func (f *Fund) Balance() int {
    return f.balance
}
func (f *Fund) Withdraw(amount int) {
    f.balance -= amount
}
`
        },{
      language: "Javascript",
      code: `alert("Another thing");
`
    }]
useEffect(() => {
    hljs.highlightAll();
  },[selectedTab]);
return(<><div id="page-content" className="pl-16 pr-16">
<h1>Tutorial Engine</h1><hr/>
Something a little like <a href="https://doc.rust-lang.org/book/" target="_blank">https://doc.rust-lang.org/book/</a>
<h2>Light and Dark theme?</h2><hr/>
<h2>Syntax Highlight</h2><hr/>
<h2>Auto Output</h2><hr/>
<div className="code-window bash mt-10 min-w-[600px] max-w-[700px]">
  <nav className="lang-nav z-20">
    <ul className="grid grid-cols-3 gap-x-32 gap-y-6 xl:gap-x-44 w-full">
      <li
      key={arrCodeBlocks0[0].language}
      className={arrCodeBlocks0[0].language === selectedTab ? "selected" : ""}
      >
      <div className="flex gap-3"><BashPlain size="30" /><span className="mt-[0.4rem] font-medium">{ arrCodeBlocks0[0].language}</span></div>
      </li>
      </ul>
    </nav>
    <div>
        <pre className={"language-bash"}><code className={"hljs language-bash"}>
        {arrCodeBlocks0[0].code}
        </code></pre>
    </div>
  </div>
<div className="output mb-10 min-w-[600px] max-w-[700px]"><pre className="min-w-[580px] max-w-[700px] language-plaintext"><code className="language-plaintext">"gr@mist-cloud.eu"</code></pre></div>
<h3>Besides that</h3>
<h2>Tabs Have Memory</h2><hr/>
<a href="file2.ts" target="_blank">file2.ts</a>
<div className="code-window  mt-10 min-w-[600px] max-w-[700px]">
  <nav className="lang-nav z-20">
    <ul className="grid grid-cols-3 gap-x-32 gap-y-6 xl:gap-x-44 w-full">
      <li
      key={arrCodeBlocks1[0].language}
      className={arrCodeBlocks1[0].language === selectedTab ? "selected" : ""}
      onClick={() => changeStateAndReRender(arrCodeBlocks1[0].language)}
      >
      <div className="flex gap-3"><TypescriptPlain size="30" /><span className="mt-[0.4rem] font-medium">{ arrCodeBlocks1[0].language}</span></div>
                {arrCodeBlocks1[0].language === selectedTab ? (
        <motion.div className="underline" layoutId="underline1" />
        ) : null}
      </li>
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
              <pre className={`language-${selectedTab.replace(selectedTab[0],
                          selectedTab[0].toLowerCase())}`}><code className={`hljs language-${selectedTab.replace(selectedTab[0],
                            selectedTab[0].toLowerCase())}`}>
              {getCodeFromArray(arrCodeBlocks1, selectedTab)}
              </code></pre>
            ) : (
              "No loaded code"
            )}
          </motion.div>
        </AnimatePresence>
        {
          noCopy ? (
            <div className="copy-block flex flex-col justify-center">
              <motion.span className="copied-message">Copied!</motion.span>
              <motion.button 
                className="copy-button"
                whileTap={{ y: -6}}
                onClick={(e) => handleCopyClipboard(e, getCodeFromArray(arrCodeBlocks1, selectedTab))}
              ><FontAwesomeIcon icon={faCopy} className="copy-icon" size="lg"/></motion.button>
            </div>
          ) : (
            ""
          )
        }
      </div>
  </div>
<a href="file2.java" target="_blank">file2.java</a>
<div className="code-window  mt-10 min-w-[600px] max-w-[700px]">
  <nav className="lang-nav z-20">
    <ul className="grid grid-cols-3 gap-x-32 gap-y-6 xl:gap-x-44 w-full">
      <li
      key={arrCodeBlocks2[0].language}
      className={arrCodeBlocks2[0].language === selectedTab ? "selected" : ""}
      onClick={() => changeStateAndReRender(arrCodeBlocks2[0].language)}
      >
      <div className="flex gap-3"><JavaPlain size="30" /><span className="mt-[0.4rem] font-medium">{ arrCodeBlocks2[0].language}</span></div>
                {arrCodeBlocks2[0].language === selectedTab ? (
        <motion.div className="underline" layoutId="underline2" />
        ) : null}
      </li>
      <li
      key={arrCodeBlocks2[1].language}
      className={arrCodeBlocks2[1].language === selectedTab ? "selected" : ""}
      onClick={() => changeStateAndReRender(arrCodeBlocks2[1].language)}
      >
      <div className="flex gap-3"><TypescriptPlain size="30" /><span className="mt-[0.4rem] font-medium">{ arrCodeBlocks2[1].language}</span></div>
                {arrCodeBlocks2[1].language === selectedTab ? (
        <motion.div className="underline" layoutId="underline2" />
        ) : null}
      </li>
      <li
      key={arrCodeBlocks2[2].language}
      className={arrCodeBlocks2[2].language === selectedTab ? "selected" : ""}
      onClick={() => changeStateAndReRender(arrCodeBlocks2[2].language)}
      >
      <div className="flex gap-3"><JavascriptPlain size="30" /><span className="mt-[0.4rem] font-medium">{ arrCodeBlocks2[2].language}</span></div>
                {arrCodeBlocks2[2].language === selectedTab ? (
        <motion.div className="underline" layoutId="underline2" />
        ) : null}
      </li>
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
            <pre className={`language-${selectedTab.replace(selectedTab[0],
                        selectedTab[0].toLowerCase())}`}><code className={`hljs language-${selectedTab.replace(selectedTab[0],
                          selectedTab[0].toLowerCase())}`}>
            {getCodeFromArray(arrCodeBlocks2, selectedTab)}
            </code></pre>
          ) : (
            "No loaded code"
          )}
        </motion.div>
      </AnimatePresence>
      <div className="copy-block flex flex-col justify-center">
        <motion.span className="copied-message">Copied!</motion.span>
        <motion.button 
          className="copy-button"
          whileTap={{ y: -6}}
          onClick={(e) => handleCopyClipboard(e, getCodeFromArray(arrCodeBlocks2, selectedTab))}
        ><FontAwesomeIcon icon={faCopy} className="copy-icon" size="lg"/></motion.button>
      </div>
    </div>
</div>
<div className="code-window  mt-10 min-w-[600px] max-w-[700px]">
  <nav className="lang-nav z-20">
    <ul className="grid grid-cols-3 gap-x-32 gap-y-6 xl:gap-x-44 w-full">
      <li
      key={arrCodeBlocks3[0].language}
      className={arrCodeBlocks3[0].language === selectedTab ? "selected" : ""}
      onClick={() => changeStateAndReRender(arrCodeBlocks3[0].language)}
      >
      <div className="flex gap-3"><JavaPlain size="30" /><span className="mt-[0.4rem] font-medium">{ arrCodeBlocks3[0].language}</span></div>
                {arrCodeBlocks3[0].language === selectedTab ? (
        <motion.div className="underline" layoutId="underline3" />
        ) : null}
      </li>
      <li
      key={arrCodeBlocks3[1].language}
      className={arrCodeBlocks3[1].language === selectedTab ? "selected" : ""}
      onClick={() => changeStateAndReRender(arrCodeBlocks3[1].language)}
      >
      <div className="flex gap-3"><TypescriptPlain size="30" /><span className="mt-[0.4rem] font-medium">{ arrCodeBlocks3[1].language}</span></div>
                {arrCodeBlocks3[1].language === selectedTab ? (
        <motion.div className="underline" layoutId="underline3" />
        ) : null}
      </li>
      <li
      key={arrCodeBlocks3[2].language}
      className={arrCodeBlocks3[2].language === selectedTab ? "selected" : ""}
      onClick={() => changeStateAndReRender(arrCodeBlocks3[2].language)}
      >
      <div className="flex gap-3"><RustPlain size="30" /><span className="mt-[0.4rem] font-medium">{ arrCodeBlocks3[2].language}</span></div>
                {arrCodeBlocks3[2].language === selectedTab ? (
        <motion.div className="underline" layoutId="underline3" />
        ) : null}
      </li>
      <li
      key={arrCodeBlocks3[3].language}
      className={arrCodeBlocks3[3].language === selectedTab ? "selected" : ""}
      onClick={() => changeStateAndReRender(arrCodeBlocks3[3].language)}
      >
      <div className="flex gap-3"><GoPlain size="30" /><span className="mt-[0.4rem] font-medium">{ arrCodeBlocks3[3].language}</span></div>
                {arrCodeBlocks3[3].language === selectedTab ? (
        <motion.div className="underline" layoutId="underline3" />
        ) : null}
      </li>
      <li
      key={arrCodeBlocks3[4].language}
      className={arrCodeBlocks3[4].language === selectedTab ? "selected" : ""}
      onClick={() => changeStateAndReRender(arrCodeBlocks3[4].language)}
      >
      <div className="flex gap-3"><JavascriptPlain size="30" /><span className="mt-[0.4rem] font-medium">{ arrCodeBlocks3[4].language}</span></div>
                {arrCodeBlocks3[4].language === selectedTab ? (
        <motion.div className="underline" layoutId="underline3" />
        ) : null}
      </li>
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
            <pre className={`language-${selectedTab.replace(selectedTab[0],
                        selectedTab[0].toLowerCase())}`}><code className={`hljs language-${selectedTab.replace(selectedTab[0],
                          selectedTab[0].toLowerCase())}`}>
            {getCodeFromArray(arrCodeBlocks3, selectedTab)}
            </code></pre>
          ) : (
            "No loaded code"
          )}
        </motion.div>
      </AnimatePresence>
      <div className="copy-block flex flex-col justify-center">
        <motion.span className="copied-message">Copied!</motion.span>
        <motion.button 
          className="copy-button"
          whileTap={{ y: -6}}
          onClick={(e) => handleCopyClipboard(e, getCodeFromArray(arrCodeBlocks3, selectedTab))}
        ><FontAwesomeIcon icon={faCopy} className="copy-icon" size="lg"/></motion.button>
      </div>
    </div>
</div>
<h2>Various</h2><hr/>
<div className="warning"><h3>Callout</h3>
<p>fdsfdsfdsfdsfgdsgfdsgfdsgfsgfsgfsgrftrrvfsgrwgfdsgfwrwgfdgrwgrwegrwgrwgrwegrwegrwwwerrgewwwwwwwrgergwerr</p>
<hr/>
<p>text</p>
</div>
<blockquote><p> Quotes</p>
<p> de</p>
<p> &mdash; Hello</p>
<p> &mdash; <sub>Socrates</sub></p>
<p> <b>testing gr</b></p>
<p> Isosceles</p>
</blockquote>
<p>Em &mdash; dash</p>
<p>Line <sub>Hello</sub> of <sub>Goodbye</sub></p>
2<sup>3</sup><br/>
<p>Text formatting <sub>italics</sub> and <b>bold gfdfd dsad s</b>.</p>
<p>Spoiler</p>
<details><summary>Spoiler Title One</summary>
<p className="mt-2 mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et malesuada fames ac turpis egestas maecenas pharetra convallis posuere. Nunc pulvinar sapien et ligula. Id cursus metus aliquam eleifend mi in nulla posuere. Mauris pharetra et ultrices neque ornare aenean euismod elementum. Ultricies mi quis hendrerit dolor magna eget. Mauris ultrices eros in cursus turpis massa. Dui accumsan sit amet nulla. Nunc eget lorem dolor sed viverra ipsum nunc aliquet. Duis tristique sollicitudin nibh sit amet commodo nulla. Eu turpis egestas pretium aenean pharetra magna ac placerat vestibulum. Nulla posuere sollicitudin aliquam ultrices sagittis orci a scelerisque. Magna ac placerat vestibulum lectus. Curabitur vitae nunc sed velit dignissim sodales ut eu sem. Enim eu turpis egestas pretium aenean pharetra. Interdum velit euismod in pellentesque massa placerat duis ultricies. Sodales ut eu sem integer vitae justo eget. Libero nunc consequat interdum varius sit amet mattis vulputate enim. Mauris in aliquam sem fringilla ut. Diam vel quam elementum pulvinar etiam non quam lacus.</p>
<p className="mt-2 mb-2">fdsfdsfdsfdsfgdsgfdsgfdsgfsgfsgfsgrftrrvfsgrwgfdsgfwrwgfdgrwgrwegrwgrwgrwegrwegrwwwerrgewwwwwwwrgergwerr</p>
<p className="mt-2 mb-2">Duis tristique sollicitudin nibh sit amet commodo nulla. Eu turpis egestas pretium aenean pharetra magna ac placerat vestibulum. Nulla posuere sollicitudin aliquam ultrices sagittis orci a scelerisque. Magna ac placerat vestibulum lectus. Curabitur vitae nunc sed velit dignissim sodales ut eu sem. Enim eu turpis egestas pretium aenean pharetra. Interdum velit euismod in pellentesque massa placerat duis ultricies. Sodales ut eu sem integer vitae justo eget. Libero nunc consequat interdum varius sit amet mattis vulputate enim. Mauris in aliquam sem fringilla ut. Diam vel quam elementum pulvinar etiam non quam lacus.</p>
</details><details><summary>Spoiler Title Two</summary>
</details>
<ol id="ol-0" className="list-decimal list-inside"><li>Hello</li>
<ol className="list-decimal list-inside"><li>Bye</li>
<li>dfs</li>
</ol><li>there,</li>
<li>Sailor</li>
</ol><br/>
<p>Unordered list</p>
<ul id="ul-0" className="list-disc list-inside"><li>What is up</li>
  <ul className="list-disc list-inside"><li>Nested</li>
    <ul className="list-disc list-inside"><li>Deeply</li>
      <ul className="list-disc list-inside"><li>In your hearth</li>
        <ul className="list-disc list-inside"><li>Hello</li>
</ul></ul></ul></ul></ul><br/>
<p>Test with starting tab</p>
<ul id="ul-1" className="list-disc list-inside"><li>Test</li>
</ul><br/>
<p>More tests</p>
<ul id="ul-2" className="list-disc list-inside"><li>a</li>
<li>b</li>
<li>c</li>
</ul><br/>
<p>Test of going back in nested lists</p>
<ul id="ul-3" className="list-disc list-inside"><li>a</li>
<li>b</li>
  <ul className="list-disc list-inside"><li>c</li>
    <ul className="list-disc list-inside"><li>d</li>
  </ul><li>e</li>
</ul></ul><br/>
<p>List with tab</p>
<ul id="ul-4" className="list-disc list-inside"><li>Hi</li>
</ul><br/>
<h1>Good news everyone</h1><hr/>
<p>More tests</p>
<ul id="ul-5" className="list-disc list-inside"><li>This</li>
  <ul className="list-disc list-inside"><li>Is</li>
</ul><li>A</li>
  <ul className="list-disc list-inside"><li>Nested</li>
    <ul className="list-disc list-inside"><li>List</li>
      <ul className="list-disc list-inside"><li>okay</li>
</ul></ul></ul></ul><br/>
<p>Todo list</p>
<div id="todo-1"><div className="flex items-center mt-2 mb-2"><input type="checkbox" id="todo-component-1.1" name="todo-component-1.1" value="One" className="mr-2" /><label htmlFor="todo-component-1.1">One</label><br/></div>
<div className="flex items-center mt-2 mb-2"><input type="checkbox" id="todo-component-1.2" name="todo-component-1.2" value="Two" className="mr-2" /><label htmlFor="todo-component-1.2">Two</label><br/></div>
<div className="flex items-center mt-2 mb-2"><input type="checkbox" id="todo-component-1.3" name="todo-component-1.3" value="Three" className="mr-2" /><label htmlFor="todo-component-1.3">Three</label><br/></div>
</div><br/>
<p>Spoiler, collapsable section</p>
Links <a href="https://doc.rust-lang.org/book/#the-rust-programming-language">to other places</a>
<h2>Menu and Navigation</h2><hr/>
<p>Menu on the side</p>
<p>Menu is hidable</p>
<p>Next button</p>
<p>Prev button</p>
</div><div className="nav-wrapper flex" aria-label="Page Navigation"><div ></div><div className="flex-initial w-1/2"></div><Link  className="nav-back flex-none" to={nextPath}><FontAwesomeIcon icon={faAngleRight} size="2x" className="nav-icon"/></Link></div>
</>)}