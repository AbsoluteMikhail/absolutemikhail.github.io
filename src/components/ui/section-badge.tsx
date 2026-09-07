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
      "mb-5 inline-flex items-center gap-3",
      tone === "primary" ? "text-primary" : "text-accent",
      className,
    )}
    {...props}
  >
    {icon || <span aria-hidden="true" className="h-px w-8 shrink-0 bg-current" />}
    <span className={cn(
      "font-display uppercase",
      size === "sm" ? "text-[10px] tracking-[0.2em]" : "text-xs tracking-widest",
      tone === "primary" ? "text-primary" : "text-accent",
    )}>
      {children}
    </span>
  </motion.div>
);
