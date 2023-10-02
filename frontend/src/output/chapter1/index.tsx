import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
  import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
  import { pages } from "../../App";
  export default function index({setCurrentPageIndex}:{setCurrentPageIndex: any}){
    
    let pageIndex: number = 0;
    let backComponentName: string = "Index";
    let nextComponentName: string = "Chrfile";
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
  return(<><div id="page-content" className="pl-40 pr-40"><h1>This is chapter 1</h1><hr/>

</div><div className="nav-wrapper flex" aria-label="Page Navigation"><div className="nav-back flex-none" rel="previous" title="Previous Chapter" aria-label="Previous Chapter" aria-keyshortcuts="Left" onClick={() => handleLinkClick("back")}><FontAwesomeIcon icon={faAngleLeft} size="2x" color="gray"/></div><div className="flex-initial w-1/2"></div>
<div className="nav-next flex-none" rel="next" title="Next Chapter" aria-label="Next Chapter" aria-keyshortcuts="Right" onClick={() => handleLinkClick("next")}><FontAwesomeIcon icon={faAngleRight} size="2x" color="gray"/></div>
</div></>)}