import { Component, type ErrorInfo, type ReactNode } from "react";
import { PageLoadError } from "@/components/PageLoadError";

export class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Page rendering failed", error, info.componentStack);
  }

  render() {
    return this.state.failed ? <PageLoadError /> : this.props.children;
  }
}
