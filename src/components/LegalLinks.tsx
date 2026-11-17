import { openPrivacySettings } from "@/lib/privacyPreferences";
import { useLocation } from "react-router-dom";
import { legalHref, siteContext } from "@/lib/siteContext";

const LegalLinks = () => {
  const { pathname, search } = useLocation();
  const context = siteContext(pathname, search);
  const en = context === "en";
  return (
  <nav aria-label={en ? "Legal and privacy" : "Документы и конфиденциальность"} className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
    <a className="inline-flex min-h-11 items-center hover:text-primary" href={legalHref("/privacy/", context)}>{en ? "Privacy Policy" : "Политика конфиденциальности"}</a>
    <a className="inline-flex min-h-11 items-center hover:text-primary" href={legalHref("/terms/", context)}>{en ? "Terms of Use" : "Пользовательское соглашение"}</a>
    <button type="button" className="min-h-11 hover:text-primary" onClick={openPrivacySettings}>{en ? "Analytics settings" : "Настройки аналитики"}</button>
  </nav>
  );
};

export default LegalLinks;
