import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionBadgeProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: ReactNode;
  tone?: "primary" | "accent";
  size?: "sm" | "md";
  icon?: ReactNode;
}

export const SectionBadge = ({ tone = "primary", size = "sm", icon, className, children, ...props }: SectionBadgeProps) => (
  <motion.div
    className={cn(
      "mb-4 rounded-full border px-4 py-1.5",
      icon ? "inline-flex items-center gap-2" : "inline-block",
      tone === "primary" ? "border-primary/20 bg-primary/5" : "border-accent/20 bg-accent/5",
      className,
    )}
    {...props}
  >
    {icon}
    <span className={cn(
      "font-display uppercase",
      size === "sm" ? "text-[10px] tracking-[0.2em]" : "text-xs tracking-widest",
      tone === "primary" ? "text-primary" : "text-accent",
    )}>
      {children}
    </span>
  </motion.div>
);
