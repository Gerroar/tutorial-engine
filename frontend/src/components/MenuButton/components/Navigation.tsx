import React, { FC, ReactElement, ReactDOM, useState } from "react";
import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";
import { arrDirectories } from "../../../output/directoriesList";

//Framer motion

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

//Framer motion



//Arrays & Maps

/**Array for storing the split of the arrDirectories
 * result
 */


const arrSplitDir: string[][] = [];

let flattenOutput: string[] = [];


/**Array of tsx */
const arrTsxContainerElm: ReactElement[] = [];
const mapTsxFileElm = new Map<string, ReactElement>()

//Arrays & Maps

//Functions

/**Functions for parse the arrDirectories to a tree */
function parseArrayDirectories(arrDirectories: Array<Array<string>>) {

  let result = new Map();

  arrDirectories.forEach((splitFilePathList) => {
    let cleanSplitFilePathList = splitFilePathList.slice(1); //First empty element removed
    result.set(cleanSplitFilePathList[0], parseArrayDirectory(cleanSplitFilePathList.slice(1), result.get(cleanSplitFilePathList[0])));
  });

  return result;
}




function parseArrayDirectory(arrDirectory: Array<string>, directoryTree: Map<string, any>) {

  if (arrDirectory.length === 0) {

    return null;
  } else {

    if (directoryTree === undefined) {
      directoryTree = new Map();
    }
    directoryTree.set(arrDirectory[0], parseArrayDirectory(arrDirectory.slice(1), directoryTree.get((arrDirectory[0]))),);

    return directoryTree;
  }
}

function flatten(tree: Map<string, any>, prefix: string) {
  if (tree !== null) {
    let i = 0;
    tree.forEach((v, k) => { flattenOutput.push(prefix + ++i + " " + k); flatten(v, prefix + i + ".") });
  }
}

function docsInside(dir: string) {

  if (dir.includes(".md")) {

    return false
  } else {

    return true;
  }
}

function generateTsx(marginL: number, marginR: number, name: string, index: string, hasDocsInside: boolean) {

  if (index.length === 1) {

    arrTsxContainerElm.push(<MenuItem marginL={`${marginL}rem`} marginR={`${marginR}rem`} directoryElm={name} elementIndex={index} key={index} hasDocsInside={hasDocsInside} hidden={false} />)
  } else {

    arrTsxContainerElm.push(<MenuItem marginL={`${marginL}rem`} marginR={`${marginR}rem`} directoryElm={name} elementIndex={index} key={index} hasDocsInside={hasDocsInside} hidden={true} />)
  }

}

function populateTsxMap() {

  if (flattenOutput.length === 0) {

    arrTsxContainerElm.push(<MenuItem marginL="0rem" marginR="0rem" directoryElm={"No files or directories"} elementIndex={"1"} key={"1"} hasDocsInside={false} hidden={false} />)
  } else {

    let depth = 1;
    let marginL = 2;
    let marginR = 0;

    flattenOutput.forEach(value => {

      let index = value.substring(0, value.indexOf(" "));
      let name = value.substring(value.indexOf(" "));

      let hasDocsInside = docsInside(name);

      if (index.length === depth) {

        generateTsx(marginL, marginR, name, index, hasDocsInside)
      } else if (index.length > depth) {

        depth = index.length;
        marginL += 2;
        marginR++;
        generateTsx(marginL, marginR, name, index, hasDocsInside)
      } else if (index.length < depth) {

        let oldDepth = depth;
        depth = index.length;

        while (oldDepth !== depth) {

          oldDepth -= 2;
          marginL -= 2;
          marginR--;
        }

        generateTsx(marginL, marginR, name, index, hasDocsInside)
      }
    })
  }
}



//Functions



arrDirectories.map((directory) => { arrSplitDir.push(directory.split("/")) })

let directoryTree = parseArrayDirectories(arrSplitDir)

flatten(directoryTree, "");
populateTsxMap();
console.log(arrTsxContainerElm)

export const Navigation = () => {

  let arrDirWSubDone: string[] = [];

  return (
    <motion.ul variants={variants} className="ul-menu">
      {
        arrTsxContainerElm.map(x => {
          return x
        })
      }
    </motion.ul>)

};
