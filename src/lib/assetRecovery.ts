const RECOVERY_KEY = "gamepunk-asset-recovery-v1";

// A deployed bundle can still be open in a tab after its lazy chunks have
// disappeared from Pages. Fetch fresh HTML once, preserving the destination.
// Keep the marker after success: persistent failures must never reload in a loop.
export const recoverAssetLoad = (reload = () => window.location.reload()): boolean => {
  if (!navigator.onLine) return false;
  try {
    if (sessionStorage.getItem(RECOVERY_KEY) === import.meta.url) return false;
    sessionStorage.setItem(RECOVERY_KEY, import.meta.url);
  } catch {
    // Without durable tab storage we cannot guarantee a bounded retry.
    return false;
  }
  reload();
  return true;
};

export const installAssetRecovery = () => {
  const onPreloadError = () => {
    recoverAssetLoad();
    // Do not preventDefault: if recovery is unavailable, the rejection must
    // reach the startup handler, article retry UI or React error boundary.
  };
  window.addEventListener("vite:preloadError", onPreloadError);
  return () => window.removeEventListener("vite:preloadError", onPreloadError);
};
