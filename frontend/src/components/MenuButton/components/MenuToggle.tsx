import { motion } from "framer-motion";

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    id={"menu-path"}
    strokeLinecap="round"
    {...props}
  />
);

function hideElements(toggle: any) {
  return toggle;
}

export const MenuToggle = ({ toggle }: { toggle: any }) => (
  <button
    onClick={hideElements(toggle)}
    className="absolute border-none cursor-pointer top-[0.85rem] left-[1.57rem] w-14 h-14 border-r-8 bg-transparent select-none"
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </button>
);
