import { getAnalyticsChoice, isAnalyticsExcluded } from "@/lib/privacyPreferences";

const googleId = "G-ZXRCS636DL";
const metricaId = 110478218;
type MetricaFunction = ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number };
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  ym?: MetricaFunction;
  "ga-disable-G-ZXRCS636DL"?: boolean;
};
let started = false;

const addScript = (src: string) => {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  script.dataset.siteAnalytics = "true";
  document.head.appendChild(script);
};

export const startAnalytics = () => {
  if (started || typeof window === "undefined" || getAnalyticsChoice() !== "accepted"
    || isAnalyticsExcluded(window.location.pathname)) return;
  const target = window as AnalyticsWindow;
  // The local queue in index.html preserves the official gtag Arguments API.
  if (!target.gtag) return;
  started = true;
  target["ga-disable-G-ZXRCS636DL"] = false;
  target.dataLayer = target.dataLayer || [];
  target.gtag("consent", "default", {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "granted",
  });
  target.gtag("js", new Date());
  target.gtag("config", googleId, { allow_google_signals: false, allow_ad_personalization_signals: false });

  target.ym = target.ym || Object.assign((...args: unknown[]) => { target.ym!.a!.push(args); }, { a: [] as unknown[][], l: Date.now() });
  target.ym(metricaId, "init", { clickmap: false, trackLinks: false, accurateTrackBounce: false, webvisor: false });
  addScript(`https://www.googletagmanager.com/gtag/js?id=${googleId}`);
  addScript(`https://mc.yandex.ru/metrika/tag.js?id=${metricaId}`);
};

const clearSiteAnalyticsStorage = () => {
  const names = document.cookie.split(";").map(cookie => cookie.trim().split("=")[0])
    .filter(name => /^(?:_ga(?:_|$)|_gid$|_gat(?:_|$)|_ym_)/.test(name));
  const parts = window.location.hostname.split(".");
  const domains = ["", ...parts.map((_, index) => `; domain=${parts.slice(index).join(".")}`)];
  for (const name of names) {
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax`;
  }
  try {
    for (const key of Object.keys(localStorage)) if (key.startsWith("_ym")) localStorage.removeItem(key);
  } catch { /* Browsers may block storage access. */ }
};

export const stopAnalytics = (clearStorage = true) => {
  if (typeof window === "undefined") return false;
  const wasStarted = started;
  started = false;
  const target = window as AnalyticsWindow;
  target["ga-disable-G-ZXRCS636DL"] = true;
  if (wasStarted) {
    target.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    target.ym?.(metricaId, "destruct");
    // Cancel pending initialization too, when approval is withdrawn mid-download.
    if (target.ym?.a) target.ym.a.length = 0;
    if (target.dataLayer) target.dataLayer.length = 0;
    document.querySelectorAll('script[data-site-analytics="true"]').forEach(script => script.remove());
  }
  if (clearStorage) clearSiteAnalyticsStorage();
  // The caller reloads after withdrawal to discard third-party listeners.
  return wasStarted;
};
