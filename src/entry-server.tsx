import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppContent } from "./App";
import type { InitialRoute } from "./App";
import CustomCursor from "./components/CustomCursor";
import { academyCourses, academyTopics } from "./lib/academy";
export { resolvePageMetadata } from "@/lib/resolvePageMetadata";

const academyPaths = academyCourses.flatMap((course) => [
  `/academy/${course.slug}`,
  ...course.lessons.map((lesson) => `/academy/${course.slug}/${lesson.slug}`),
]);

const academyTopicPaths = academyTopics.map((topic) => `/academy/topics/${topic.slug}`);

export const prerenderPaths = [
  "/",
  "/projects",
  "/academy",
  "/malena/privacy",
  "/privacy",
  "/terms",
  ...academyTopicPaths,
  ...academyPaths,
];

const loadInitialPage = async (url: string) => {
  if (url === "/privacy" || url === "/terms") {
    const module = await import("@/pages/Legal");
    return { InitialPage: module.default, initialRoute: "legal" as InitialRoute };
  }
  if (url === "/") {
    const module = await import("./pages/Index");
    return { InitialPage: module.default, initialRoute: "home" as InitialRoute };
  }

  if (url === "/projects") {
    const module = await import("./pages/Projects");
    return { InitialPage: module.default, initialRoute: "projects" as InitialRoute };
  }

  if (url === "/malena/privacy") {
    const module = await import("./pages/MalenaPrivacy");
    return { InitialPage: module.default, initialRoute: "malenaPrivacy" as InitialRoute };
  }

  const module = await import("./pages/Academy");
  const { preloadAcademyPage } = await import("@/lib/academyContent");
  await preloadAcademyPage(url);
  return { InitialPage: module.default, initialRoute: "academy" as InitialRoute };
};

export const render = async (url: string) => {
  const initialPage = await loadInitialPage(url);
  // Every route and its selected article are ready before rendering. A string
  // renderer avoids the byte-boundary corruption observed in the React 18
  // streaming output for Cyrillic attributes on the local Node runtime.
  return renderToString(
    <>
      <CustomCursor />
      <StaticRouter location={url}>
        <AppContent {...initialPage} />
      </StaticRouter>
    </>,
  );
};
