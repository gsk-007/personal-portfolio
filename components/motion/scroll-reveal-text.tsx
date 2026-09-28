"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

type ScrollRevealTextProps = {
  text: string;
  className?: string;
};

export function ScrollRevealText({ text, className }: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 60%"],
  });

  const words = text.split(" ");

  return (
    <span 
      ref={containerRef} 
      className={cn("inline-flex flex-wrap", className)}
      aria-label={text}
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        
        return (
          <span key={i} className="inline-block">
            <Word progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
            {i < words.length - 1 && <span className="inline-block w-[0.25em]" />}
          </span>
        );
      })}
    </span>
  );
}

function Word({ children, progress, range }: { children: string, progress: MotionValue<number>, range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  
  return (
    <motion.span style={{ opacity }} aria-hidden="true" className="inline-block transition-opacity duration-150">
      {children}
    </motion.span>
  );
}
