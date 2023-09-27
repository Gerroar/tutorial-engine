import { useRef } from "react";
import { motion, useCycle } from "framer-motion";
import { useDimensions } from "./components/use-dimensions";
import { Navigation } from "./components/Navigation";
import { MenuToggle } from "./components/MenuToggle";

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2
    }
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  }
};

export const MenuButton = ({ currentPageIndex, setCurrentPageIndex, defaultIndex }: { currentPageIndex: number, setCurrentPageIndex: any, defaultIndex: number }) => {
  const [isMenuOpen, toggleMenuOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);

  return (
    <motion.nav
      initial={false}
      animate={isMenuOpen ? "open" : "closed"}
      custom={height}
      ref={containerRef}
      className="fixed"
    >
      <motion.div className="top-0 left-0 bottom-0" variants={sidebar} />
      <Navigation currentPageIndex={currentPageIndex} setCurrentPageIndex={setCurrentPageIndex} defaultIndex={defaultIndex} />
      <MenuToggle toggle={() => toggleMenuOpen()} />
    </motion.nav>
  );
};
