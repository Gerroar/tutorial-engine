import { Variants, motion } from "framer-motion";
import { TriangleToggle } from "./TriangleToggle";
import { useRef, useState, useEffect } from "react"


const variants: Variants = {
  open: {
    y: 1,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: 20 },
    }
  },
  closed: {
    y: 0,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    }
  }
};

function changeSubsVisibility(index: string, isActive: boolean, setIsActive: any) {

  setIsActive(!isActive);
  const ulMenu = document.getElementById("ul-menu");
  if (ulMenu) {
    let menuChildren = ulMenu.children;
    let maxLength = 0;

    for (const menuChild of menuChildren) {
      if (menuChild.id.length > maxLength) {
        maxLength = menuChild.id.length
      }
      // console.log(menuChild)
    }

    if (isActive === false) {

      for (const menuChild of menuChildren) {

        let mChildId = menuChild.id;


        console.log(menuChild)
        if ((mChildId.startsWith(`${index}.`)) && (mChildId.length === (index.length + 2))) {

          let visibleElement = document.getElementById(mChildId);
          if (visibleElement) { visibleElement.className = 'li-menu' }
        }

      }
    } else {

      for (const menuChild of menuChildren) {

        let mChildId = menuChild.id;
        console.log(mChildId.length)

        if ((mChildId.startsWith(`${index}.`))) {

          let visibleElement = document.getElementById(mChildId);
          if (visibleElement) { visibleElement.className = 'hidden' }
        }

      }
    }
  }


}



type MenuItemProps = {
  marginL: string, marginR: string, directoryElm: string, elementIndex: string, hasDocsInside: boolean, hidden: boolean
}

export const MenuItem = ({ marginL, marginR, directoryElm, elementIndex, hasDocsInside, hidden }: MenuItemProps) => {

  const [isActive, setIsActive] = useState(false);

  let classN: string = "";


  if (hidden) {
    classN = "hidden"
  } else {
    classN = "li-menu"
  }

  return (
    <motion.li
      style={{ marginLeft: marginL }}
      className={classN}
      variants={variants}
      onClick={() => changeSubsVisibility(elementIndex, isActive, setIsActive)}
      id={elementIndex}
    >
      {hasDocsInside ?
        (
          (elementIndex.length === 1) ?
            (
              <>
                <div className="flex flex-row">
                  <div className={`w-6 h-6 flex-shrink-0 content-center font-bold`} style={{ marginRight: `${marginR}` }}>{elementIndex}</div>
                  <div className="w-20 h-5 ">
                    {directoryElm}
                  </div>
                  <TriangleToggle isActive={isActive} indexLength={elementIndex.length} />
                </div>
              </>
            )
            :
            (
              <>
                <div className="flex flex-row ml-3">
                  <div className={`w-6 h-6 flex-shrink-0 content-center font-bold`} style={{ marginRight: `${marginR}` }}>{elementIndex}</div>
                  <div className="w-20 h-5">
                    {directoryElm}
                  </div>
                  <TriangleToggle isActive={isActive} indexLength={elementIndex.length} />
                </div>
              </>

            )
        )
        :
        (
          (elementIndex.length === 1) ?
            (<div className="flex flex-row">

              <div className={`w-6 h-6  flex-shrink-0  content-center font-bold`}>{elementIndex}</div>
              <div className={`w-20 h-5`}>
                {directoryElm}
              </div>
            </div>
            )
            :
            (
              <div className="flex flex-row">

                <div className={`w-6 h-6 flex-shrink-0 content-center font-bold`} style={{ marginRight: `${marginR}` }}>{elementIndex}</div>
                <div className="w-20 h-5">
                  {directoryElm}
                </div>

              </div>
            )

        )
      }
    </motion.li>
  );
};
