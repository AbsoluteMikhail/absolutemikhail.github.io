import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const primaryColors = "gradient-primary text-primary-foreground";
const variants = {
  primary: cn(primaryColors, "font-semibold"),
  outline: "border border-border text-foreground transition-colors hover:border-primary/50 hover:text-primary",
  secondary: "border border-border bg-secondary text-foreground transition-all hover:bg-primary/10 hover:border-primary/50",
  subtle: "bg-secondary text-foreground transition-colors hover:bg-primary/20",
  text: "text-muted-foreground transition-colors hover:text-primary",
  unstyled: "",
};
const sizes = {
  sm: "px-5 py-2 text-xs",
  md: "px-8 py-3 text-sm",
  lg: "px-8 py-4 text-sm",
  menu: "px-5 py-4 text-sm",
  none: "",
};
const effects = {
  glow: "transition-[filter,box-shadow] hover:brightness-110 hover:shadow-lg hover:shadow-primary/20",
  shadow: "transition-all hover:shadow-lg hover:shadow-primary/20",
  none: "",
};

export interface ButtonStyleProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  effect?: keyof typeof effects;
  className?: string;
}

// Shared by native buttons, anchors and Router links; layout stays with the caller.
export function buttonStyles({ variant = "primary", size = "md", effect = "glow", className }: ButtonStyleProps = {}) {
  return cn(
    variant !== "text" && variant !== "unstyled" && "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg font-display uppercase tracking-wider",
    variant !== "unstyled" && sizes[size],
    variants[variant],
    variant === "primary" && effects[effect],
    className,
  );
}

export function mentoringButtonStyles(highlighted = false) {
  return cn(
    "block text-center py-4 px-3 rounded-lg font-display text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-300",
    highlighted
      ? cn(primaryColors, "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30")
      : "border border-primary/20 text-primary hover:bg-primary/5",
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, effect, className, type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={buttonStyles({ variant, size, effect, className })} {...props} />
  ),
);
Button.displayName = "Button";
