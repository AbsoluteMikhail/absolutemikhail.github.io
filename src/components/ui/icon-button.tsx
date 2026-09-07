import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  surface: "h-10 w-10 flex items-center justify-center bg-secondary/80 text-foreground hover:bg-primary/20 hover:text-primary",
  quiet: "p-2 text-muted-foreground hover:bg-secondary hover:text-foreground",
  outline: "inline-flex h-10 w-10 items-center justify-center border border-border text-muted-foreground hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
};

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
  variant?: keyof typeof variants;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = "surface", className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn("rounded-full transition-colors", variants[variant], className)}
      {...props}
    />
  ),
);
IconButton.displayName = "IconButton";
