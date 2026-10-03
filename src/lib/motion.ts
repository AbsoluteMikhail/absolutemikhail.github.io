import type { MotionProps } from "framer-motion";

// Render readable HTML at the source, without rewriting unrelated CSS after SSR.
// The client uses createRoot, so entrance animations can keep their initial state.
export const motionInitial = (initial: NonNullable<MotionProps["initial"]>): MotionProps["initial"] =>
  import.meta.env.SSR ? false : initial;
