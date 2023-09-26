import { motion } from "framer-motion";
import { useState } from "react";

export const TriangleToggle = ({ isActive, indexLength }: { isActive: boolean, indexLength: number }) => {

    const [tColor, setTColor] = useState("black");

    return (
        <motion.div
            className={`absolute`}
            style={{ left: "280px" }}
            animate={{ rotate: isActive ? 90 : 0 }}
            onHoverStart={() => setTColor("blue")}
            onHoverEnd={() => setTColor("black")}
        >
            ➧
        </motion.div>
    )
};