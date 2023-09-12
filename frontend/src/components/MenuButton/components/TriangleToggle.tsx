import { motion } from "framer-motion";
import { useState } from "react";

export const TriangleToggle = ({ isActive, indexLength }: { isActive: boolean, indexLength: number }) => {

    const [tColor, setTColor] = useState("black");
    let leftValue: string = "";

    if (indexLength === 1) {

        leftValue = "320px"
    } else {

        let pxPerJump = 32;
        if (indexLength > 3) {

            leftValue = `${(288 - (((indexLength - 3) / 2) * pxPerJump)).toString()}px`;
        } else {

            leftValue = "288px"
        }

    }

    console.log(isActive)

    return (
        <motion.div
            className={`absolute`}
            style={{ left: leftValue }}
            animate={{ rotate: isActive ? 90 : 0 }}
            onHoverStart={() => setTColor("blue")}
            onHoverEnd={() => setTColor("black")}
        >
            ➧
        </motion.div>
    )
};