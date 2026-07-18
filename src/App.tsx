import { lazy, Suspense, type ComponentType } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToHashElement from "./components/ScrollToHashElement";
import RouteMetadata from "./components/RouteMetadata";
import CustomCursor from "./components/CustomCursor";

const Index = lazy(() => import("./pages/Index"));
const Projects = lazy(() => import("./pages/Projects"));
const Music = lazy(() => import("./pages/Music"));
const Twitch = lazy(() => import("./pages/Twitch"));
const OGSnippet = lazy(() => import("./pages/OGSnippet"));
const Academy = lazy(() => import("./pages/Academy"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
    Загрузка…
  </div>
);

export type InitialRoute = "academy" | "home" | "projects";

type AppContentProps = {
  InitialPage?: ComponentType;
  initialRoute?: InitialRoute;
};

const getRouteElement = (
  route: InitialRoute,
  initialRoute: InitialRoute | undefined,
  InitialPage: ComponentType | undefined,
  LazyPage: ComponentType,
) => (initialRoute === route && InitialPage ? <InitialPage /> : <LazyPage />);

export const AppContent = ({ InitialPage, initialRoute }: AppContentProps = {}) => {
  const routes = (
    <Routes>
        <Route path="/" element={getRouteElement("home", initialRoute, InitialPage, Index)} />
        <Route
          path="/projects"
          element={getRouteElement("projects", initialRoute, InitialPage, Projects)}
        />
        <Route path="/music" element={<Music />} />
        <Route path="/twitch" element={<Twitch />} />
        <Route path="/snippet" element={<OGSnippet />} />
        <Route
          path="/academy/*"
          element={getRouteElement("academy", initialRoute, InitialPage, Academy)}
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
    </Routes>
  );

  return (
    <>
      <ScrollToHashElement />
      <RouteMetadata />
      <Suspense fallback={<PageFallback />}>{routes}</Suspense>
    </>
  );
};

const App = (props: AppContentProps) => (
  <>
    <CustomCursor />
    <BrowserRouter>
      <AppContent {...props} />
    </BrowserRouter>
  </>
);

export default App;
