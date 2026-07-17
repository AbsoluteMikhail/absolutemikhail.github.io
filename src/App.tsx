import { lazy, Suspense } from "react";
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

const App = () => (
  <>
    <CustomCursor />
    <BrowserRouter>
      <ScrollToHashElement />
      <RouteMetadata />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/music" element={<Music />} />
          <Route path="/twitch" element={<Twitch />} />
          <Route path="/og-snippet" element={<OGSnippet />} />
          <Route path="/academy/*" element={<Academy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </>
);

export default App;
