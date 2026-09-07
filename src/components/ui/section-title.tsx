import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionTitleProps extends HTMLMotionProps<"h2"> {
  size?: "default" | "compact";
}

export const SectionTitle = ({ size = "default", className, ...props }: SectionTitleProps) => (
  <motion.h2
    className={cn(
      "font-display font-bold leading-[1.12] tracking-tight",
      size === "compact" ? "text-2xl md:text-3xl" : "text-[clamp(1.75rem,3.5vw,3.5rem)]",
      className,
    )}
    {...props}
  />
);
