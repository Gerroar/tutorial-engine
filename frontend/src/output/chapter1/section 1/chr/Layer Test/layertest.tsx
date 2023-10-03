import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
  import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
  import { Link } from "react-router-dom";
  export default function layertest(){

  let backPath: string = "";
  let nextPath: string = "";
  if (backPath === "/index") {
    backPath = "/";
  } else if (nextPath === "/index") {
    nextPath = "/";
  }
  return(<><div id="page-content" className="pl-40 pr-40"><h2>Hello everyone</h2><hr/></div></>)}