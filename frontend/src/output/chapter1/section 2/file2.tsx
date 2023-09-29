import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
  import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
  import { pages } from "../../../App";
  export default function file2({setCurrentPageIndex}:{setCurrentPageIndex: any}){
    
    let pageIndex: number = 0;
    let backComponentName: string = "";
    let nextComponentName: string = "";
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
  return(<><h2>Another file</h2><hr/></>)}