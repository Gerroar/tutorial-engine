import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
  import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
  import { Link } from "react-router-dom";
  export default function index(){

  let backPath: string = "/index";
  let nextPath: string = "/chapter1/section1/chr/file";
  return(<><div id="page-content" className="pl-40 pr-40"><h1>This is chapter 1</h1><hr/>

</div><div className="nav-wrapper flex" aria-label="Page Navigation"><Link  className="nav-back flex-none" to={backPath}><FontAwesomeIcon icon={faAngleLeft} size="2x" color="gray"/></Link><div className="flex-initial w-1/2"></div>
<Link  className="nav-next flex-none" to={nextPath}><FontAwesomeIcon icon={faAngleRight} size="2x" color="gray"/></Link>
</div></>)}