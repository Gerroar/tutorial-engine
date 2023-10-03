import { Variants, motion } from "framer-motion";
import { TriangleToggle } from "./TriangleToggle";
import { useState } from "react";
import { Link } from "react-router-dom";

const variants: Variants = {
  open: {
    opacity: 1,
  },
  closed: {
    opacity: 0,
  },
};

function changeSubsVisibility(
  index: string,
  isActive: boolean,
  setIsActive: any
) {
  console.log("enter");
  setIsActive(!isActive);
  const ulMenu = document.getElementById("ul-menu");
  if (ulMenu) {
    let menuChildren = ulMenu.children;
    let maxLength = 0;

    for (const menuChild of menuChildren) {
      if (menuChild.id.length > maxLength) {
        maxLength = menuChild.id.length;
      }
    }

    if (isActive === false) {
      for (const menuChild of menuChildren) {
        let mChildId = menuChild.id;
        if (
          mChildId.startsWith(`${index}.`) &&
          mChildId.length === index.length + 2
        ) {
          let visibleElement = document.getElementById(mChildId);
          if (visibleElement) {
            visibleElement.className = "li-menu";
          }
        }
      }
    } else {
      for (const menuChild of menuChildren) {
        let mChildId = menuChild.id;
        if (mChildId.startsWith(`${index}.`)) {
          let visibleElement = document.getElementById(mChildId);
          if (visibleElement) {
            visibleElement.className = "hidden";
          }
        }
      }
    }
  }
}

type MenuItemProps = {
  marginL: string;
  marginR: string;
  directoryElm: string;
  elementIndex: string;
  hasDocsInside: boolean;
  hidden: boolean;
  fileCountIndex: number;
  pathToUse: string;
};

export const MenuItem = ({
  marginL,
  marginR,
  directoryElm,
  elementIndex,
  hasDocsInside,
  hidden,
  fileCountIndex,
  pathToUse,
}: MenuItemProps) => {
  const [isActive, setIsActive] = useState(false);

  let classN: string = "";
  let havePath: boolean = false;

  directoryElm = directoryElm.replace(".md", "");
  if (hidden) {
    classN = "hidden";
  } else {
    classN = "li-menu";
  }

  if (hasDocsInside) {
    if (elementIndex.length === 1) {
      return (
        <motion.li
          style={{ marginLeft: marginL }}
          className={classN}
          variants={variants}
          onClick={() =>
            changeSubsVisibility(elementIndex, isActive, setIsActive)
          }
          id={elementIndex}
        >
          <>
            <div className="flex flex-row">
              <div
                className={`w-6 h-6 flex-shrink-0 content-center font-bold`}
                style={{ marginRight: `${marginR}` }}
              >
                {elementIndex}
              </div>
              <div className="w-20 h-5 ">{directoryElm}</div>
              <TriangleToggle
                isActive={isActive}
                indexLength={elementIndex.length}
              />
            </div>
          </>
        </motion.li>
      );
    } else {
      return (
        <motion.li
          style={{ marginLeft: marginL }}
          className={classN}
          variants={variants}
          onClick={() =>
            changeSubsVisibility(elementIndex, isActive, setIsActive)
          }
          id={elementIndex}
        >
          <>
            <div className="flex flex-row ml-3">
              <div
                className={`w-6 h-6 flex-shrink-0 content-center font-bold`}
                style={{ marginRight: `${marginR}` }}
              >
                {elementIndex}
              </div>
              <div className="w-20 h-5">{directoryElm}</div>
              <TriangleToggle
                isActive={isActive}
                indexLength={elementIndex.length}
              />
            </div>
          </>
        </motion.li>
      );
    }
  } else if (pathToUse !== "") {
    console.log("I enter with this path", pathToUse);
    if (elementIndex.length === 1) {
      return (
        <motion.li
          style={{ marginLeft: marginL }}
          className={classN}
          variants={variants}
          id={elementIndex}
        >
          <>
            <Link to={pathToUse}>
              <div className="flex flex-row">
                <div
                  className={`w-6 h-6  flex-shrink-0  content-center font-bold`}
                >
                  {elementIndex}
                </div>
                <div className={`w-20 h-5 font-normal`}>{directoryElm}</div>
              </div>
            </Link>
          </>
        </motion.li>
      );
    } else {
      return (
        <motion.li
          style={{ marginLeft: marginL }}
          className={classN}
          variants={variants}
          id={elementIndex}
        >
          <>
            <Link to={pathToUse}>
              <div className="flex flex-row ml-3" id={`${fileCountIndex - 1}`}>
                <div
                  className={`w-6 h-6 flex-shrink-0 content-center font-bold`}
                  style={{ marginRight: `${marginR}` }}
                >
                  {elementIndex}
                </div>
                <div className="w-20 h-5">{directoryElm}</div>
              </div>
            </Link>
          </>
        </motion.li>
      );
    }
  }

  /**
  *  return (
    <motion.li
      style={{ marginLeft: marginL }}
      className={classN}
      variants={variants}
      onClick={() => changeSubsVisibility(elementIndex, isActive, setIsActive)}
      id={elementIndex}
    >
      {hasDocsInside ? (
        elementIndex.length === 1 ? (
          <>
            <div className="flex flex-row">
              <div
                className={`w-6 h-6 flex-shrink-0 content-center font-bold`}
                style={{ marginRight: `${marginR}` }}
              >
                {elementIndex}
              </div>
              <div className="w-20 h-5 ">{directoryElm}</div>
              <TriangleToggle
                isActive={isActive}
                indexLength={elementIndex.length}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-row ml-3">
              <div
                className={`w-6 h-6 flex-shrink-0 content-center font-bold`}
                style={{ marginRight: `${marginR}` }}
              >
                {elementIndex}
              </div>
              <div className="w-20 h-5">{directoryElm}</div>
              <TriangleToggle
                isActive={isActive}
                indexLength={elementIndex.length}
              />
            </div>
          </>
        )
      ) : elementIndex.length === 1 ? (
        <div className="flex flex-row">
          <div className={`w-6 h-6  flex-shrink-0  content-center font-bold`}>
            {elementIndex}
          </div>
          <div className={`w-20 h-5 font-normal`}>{directoryElm}</div>
        </div>
      ) : (
        <div className="flex flex-row ml-3" id={`${fileCountIndex - 1}`}>
          <div
            className={`w-6 h-6 flex-shrink-0 content-center font-bold`}
            style={{ marginRight: `${marginR}` }}
          >
            {elementIndex}
          </div>
          <div className="w-20 h-5">{directoryElm}</div>
        </div>
      )}
    </motion.li>
  );
 */
};
