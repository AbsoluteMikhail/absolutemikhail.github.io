import { useSyncExternalStore } from "react";
import { motion, type HTMLMotionProps, type MotionProps } from "framer-motion";

const staticEntranceQuery = "(max-width: 767px), (hover: none), (prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(staticEntranceQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const getSnapshot = () => window.matchMedia(staticEntranceQuery).matches;
const getServerSnapshot = () => true;

// Keep content visible on touch devices and in server HTML. MotionConfig's
// reducedMotion policy only removes transforms; opacity and delays still run.
const useEntranceProps = (props: MotionProps): MotionProps => {
  const isStatic = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isStatic ? {
    initial: false,
    whileInView: undefined,
    animate: props.whileInView ?? props.animate,
    transition: { duration: 0, delay: 0 },
  } : {};
};

export const EntranceDiv = (props: HTMLMotionProps<"div">) => (
  <motion.div {...props} {...useEntranceProps(props)} />
);

export const EntranceArticle = (props: HTMLMotionProps<"article">) => (
  <motion.article {...props} {...useEntranceProps(props)} />
);

export const EntranceParagraph = (props: HTMLMotionProps<"p">) => (
  <motion.p {...props} {...useEntranceProps(props)} />
);

export const EntranceHeading = (props: HTMLMotionProps<"h2">) => (
  <motion.h2 {...props} {...useEntranceProps(props)} />
);

export const EntrancePageTitle = (props: HTMLMotionProps<"h1">) => (
  <motion.h1 {...props} {...useEntranceProps(props)} />
);

export const EntranceLink = (props: HTMLMotionProps<"a">) => (
  <motion.a {...props} {...useEntranceProps(props)} />
);
