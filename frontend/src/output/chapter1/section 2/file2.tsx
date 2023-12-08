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
export default function file2({selectedTab, setSelectedTab}: StateProps){
  let noCopy: boolean = false;
let backPath: string = "";
let nextPath: string = "";
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
    noCopy = true;
    return "Language not selected";
  } else {
    noCopy = false;
    return codeToReturn;
  }
}
const changeStateAndReRender = (lang: string) => {
  setSelectedTab(lang);
  hljs.highlightAll();
};
  useEffect(() => {
    hljs.configure({
      ignoreUnescapedHTML: true,
    });
    hljs.highlightAll();
  },[selectedTab]);
return(<><div id="page-content" className="pl-16 pr-16">
<h2>Another file</h2><hr className="hr0"/></div></>)}