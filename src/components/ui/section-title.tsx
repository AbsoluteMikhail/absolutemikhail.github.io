import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionTitleProps extends HTMLMotionProps<"h2"> {
  size?: "default" | "compact";
}

export const SectionTitle = ({ size = "default", className, ...props }: SectionTitleProps) => (
  <motion.h2
    className={cn(
      "font-display font-bold",
      size === "compact" ? "text-2xl md:text-3xl" : "text-3xl md:text-5xl",
      className,
    )}
    {...props}
  />
);
