import { lazy, Suspense, type ComponentType } from "react";
import { MotionConfig } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToHashElement from "./components/ScrollToHashElement";
import RouteMetadata from "./components/RouteMetadata";
import CustomCursor from "./components/CustomCursor";
import PrivacyControls from "@/components/PrivacyControls";
import { ThemeSync } from "@/lib/theme";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { appRoutes, type AppRouteId } from "@/lib/appRoutes";

const lazyRoutes = appRoutes.map((route) => ({ ...route, Page: lazy(route.load) }));

const PageFallback = () => (
  <div role="status" className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
    Загрузка…
  </div>
);

export type InitialRoute = AppRouteId;

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
      {lazyRoutes.map(({ id, path, Page }) => (
        <Route key={path} path={path} element={getRouteElement(id, initialRoute, InitialPage, Page)} />
      ))}
    </Routes>
  );

  return (
    <MotionConfig reducedMotion="user">
      <ScrollToHashElement />
      <RouteMetadata />
      <ThemeSync />
      <Suspense fallback={<PageFallback />}>{routes}</Suspense>
      <PrivacyControls />
    </MotionConfig>
  );
};

const App = (props: AppContentProps) => (
  <AppErrorBoundary>
    <CustomCursor />
    <BrowserRouter>
      <AppContent {...props} />
    </BrowserRouter>
  </AppErrorBoundary>
);

export default App;
