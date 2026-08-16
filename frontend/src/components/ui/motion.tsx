"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, type Variants, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

// Server Components can render these (they're real exported functions), but
// cannot use `motion.div` etc. directly — accessing a property on a value
// imported across the "use client" boundary doesn't resolve to a component,
// it silently renders as undefined. These wrappers are the fix.
export function MotionDiv(props: HTMLMotionProps<"div">) {
  return <motion.div {...props} />;
}
export function MotionSpan(props: HTMLMotionProps<"span">) {
  return <motion.span {...props} />;
}
export function MotionH1(props: HTMLMotionProps<"h1">) {
  return <motion.h1 {...props} />;
}
export function MotionP(props: HTMLMotionProps<"p">) {
  return <motion.p {...props} />;
}

export const EASE = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

type Tag = "div" | "section" | "tbody" | "tr" | "ul" | "li";

const TAG_MAP = {
  div: motion.div,
  section: motion.section,
  tbody: motion.tbody,
  tr: motion.tr,
  ul: motion.ul,
  li: motion.li,
} as const;

/** Fades/slides children in once they scroll into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: Tag;
}) {
  const MotionTag = TAG_MAP[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

/** Wraps a list/grid; children should be <StaggerItem>. Cascades in on scroll. */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  as?: Tag;
}) {
  const MotionTag = TAG_MAP[as];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: 0.05 } } }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
  y = 20,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  as?: Tag;
}) {
  const MotionTag = TAG_MAP[as];
  return (
    <MotionTag
      className={className}
      variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
    >
      {children}
    </MotionTag>
  );
}

/** Animated count-up number, triggers once visible. */
export function CountUp({
  value,
  duration = 1.4,
  className,
  prefix = "",
  suffix = "",
}: {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v)));
    return unsub;
  }, [spring]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

/** Soft blurred gradient orb for hero/dark sections — decorative only. */
export function GlowOrb({ className, color = "accent" }: { className?: string; color?: "accent" | "navy" | "violet" }) {
  const bg = color === "accent" ? "bg-accent-400" : color === "violet" ? "bg-indigo-500" : "bg-navy-500";
  return (
    <motion.div
      className={cn("pointer-events-none absolute rounded-full opacity-30 blur-3xl", bg, className)}
      animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/** Small glass badge card that gently floats — for hero mockup accents. */
export function FloatBadge({
  children,
  className,
  delay = 0,
  range = 8,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  range?: number;
}) {
  return (
    <motion.div
      className={cn("absolute flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-2xl", className)}
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: [0, -range, 0], scale: 1 }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay, ease: EASE },
        y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: delay + 0.5 },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Subtle animated dot-grid texture for premium hero backgrounds. */
export function DotGrid({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute opacity-[0.15]", className)}
      style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    />
  );
}

export { motion, AnimatePresence };
