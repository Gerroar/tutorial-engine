import { animate, color, motion } from "framer-motion";
import { useState } from "react";

const variants = {
    rotate90: {
        rotate: "90deg"
    },
    rotate0: {
        rotate: "0deg"
    }
}

export const TriangleToggle = ({ name, isActive }: { name: string, isActive: boolean }) => {

    const [tColor, setTColor] = useState("black");

    return (
        <motion.div
            className=" absolute left-80"
            animate={{ rotate: isActive ? 90 : 0 }}
            onHoverStart={() => setTColor("blue")}
            onHoverEnd={() => setTColor("black")}
        >
            ➧
        </motion.div>
    )
};