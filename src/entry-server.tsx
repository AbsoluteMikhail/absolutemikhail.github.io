import { projectPages, projectPath } from "@/lib/projectPages";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppContent } from "./App";
import { loadInitialPage } from "@/lib/appRoutes";
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
  "/snippet",
  ...projectPages.map((project) => projectPath(project.slug)),
  "/academy",
  "/malena/privacy",
  "/privacy",
  "/terms",
  ...academyTopicPaths,
  ...academyPaths,
];

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
