import { Variants, motion } from "framer-motion";
import { TriangleToggle } from "./TriangleToggle";
import { useEffect, useState } from "react"


const variants: Variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -20 }
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

type MenuItemProps = {
  marginL: string, marginR: string, directoryElm: string, elementIndex: string, hasDocsInside: boolean, hidden: boolean
}

export const MenuItem = ({ marginL, marginR, directoryElm, elementIndex, hasDocsInside, hidden }: MenuItemProps) => {

  const [isActive, setIsActive] = useState(false);

  if (hidden) {
    return (
      ""
    )
  } else {
    return (
      <motion.li
        style={{ marginLeft: marginL }}
        className={"li-menu"}
        variants={variants}
        onClick={() => setIsActive(!isActive)}
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
                    <TriangleToggle name={directoryElm} isActive={isActive} />
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
                    <TriangleToggle name={directoryElm} isActive={isActive} />
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
  }
};
