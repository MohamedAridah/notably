"use client";

import { useState } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import { ArrowUpIcon } from "lucide-react";

const THRESHOLD = 240;

export default function ScrollToTop({
  threshold = THRESHOLD,
}: {
  threshold?: number;
}) {
  const { scrollY, scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest >= threshold);
  });

  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.button
      type="button"
      role="progressbar"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      initial={{ opacity: 0, scale: 0 }}
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`
        fixed bottom-6 end-4 z-50 size-9 flex items-center justify-center rounded-full border bg-background hover:cursor-pointer`}
    >
      {/* Progress Ring */}
      <svg className="absolute h-12 w-12 -rotate-90">
        <motion.circle
          cx="24"
          cy="24"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          pathLength={1}
          style={{ pathLength: progress }}
          className="text-primary"
        />
      </svg>

      <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }}>
        <ArrowUpIcon className="size-4.5" />
      </motion.div>
    </motion.button>
  );
}
