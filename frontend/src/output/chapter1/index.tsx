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
let backPath: string = "/index";
let nextPath: string = "/chapter1/section1/chr/file";
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
    }]
useEffect(() => {
    hljs.highlightAll();
  },[selectedTab]);
return(<><div id="page-content" className="pl-16 pr-16">
<h1>This is chapter 1</h1><hr/>
<div className="code-window  mt-10 min-w-[600px] max-w-[700px]">
  <nav className="lang-nav z-20">
    <ul className="grid grid-cols-3 gap-x-32 gap-y-6 xl:gap-x-44 w-full">
      <li
      key={arrCodeBlocks0[0].language}
      className={arrCodeBlocks0[0].language === selectedTab ? "selected" : ""}
      onClick={() => changeStateAndReRender(arrCodeBlocks0[0].language)}
      >
      <div className="flex gap-3"><JavaPlain size="30" /><span className="mt-[0.4rem] font-medium">{ arrCodeBlocks0[0].language}</span></div>
                {arrCodeBlocks0[0].language === selectedTab ? (
        <motion.div className="underline" layoutId="underline0" />
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
            {getCodeFromArray(arrCodeBlocks0, selectedTab)}
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
          onClick={(e) => handleCopyClipboard(e, getCodeFromArray(arrCodeBlocks0, selectedTab))}
        ><FontAwesomeIcon icon={faCopy} className="copy-icon" size="lg"/></motion.button>
      </div>
    </div>
</div>
</div><div className="nav-wrapper flex" aria-label="Page Navigation"><Link  className="nav-back flex-none" to={backPath}><FontAwesomeIcon icon={faAngleLeft} size="2x" className="nav-icon"/></Link><div className="flex-initial w-1/2"></div>
<Link  className="nav-next flex-none" to={nextPath}><FontAwesomeIcon icon={faAngleRight} size="2x" className="nav-icon"/></Link></div>
</>)}