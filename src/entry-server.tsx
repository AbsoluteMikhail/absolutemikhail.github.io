import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppContent } from "./App";
import type { InitialRoute } from "./App";
import CustomCursor from "./components/CustomCursor";
import { academyCourses, academyTopics } from "./lib/academy";

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
  ...academyTopicPaths,
  ...academyPaths,
];

const loadInitialPage = async (url: string) => {
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
  return { InitialPage: module.default, initialRoute: "academy" as InitialRoute };
};

export const render = async (url: string) => {
  const initialPage = await loadInitialPage(url);

  return new Promise<string>((resolve, reject) => {
    let settled = false;

    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      callback();
    };

    const timeout = setTimeout(() => {
      stream?.abort();
      finish(() => reject(new Error(`SSR timed out for ${url}`)));
    }, 15_000);

    const stream = renderToPipeableStream(
      <>
        <CustomCursor />
        <StaticRouter location={url}>
          <AppContent {...initialPage} />
        </StaticRouter>
      </>,
      {
        onAllReady() {
          const output = new PassThrough();
          let html = "";

          output.setEncoding("utf8");
          output.on("data", (chunk) => {
            html += chunk;
          });
          output.on("end", () => finish(() => resolve(html)));
          output.on("error", (error) => finish(() => reject(error)));
          stream.pipe(output);
        },
        onShellError(error) {
          finish(() => reject(error));
        },
        onError(error) {
          console.error(`SSR error for ${url}:`, error);
        },
      },
    );
  });
};
