import { openPrivacySettings } from "@/lib/privacyPreferences";

const LegalLinks = () => (
  <nav aria-label="Документы и конфиденциальность" className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
    <a className="inline-flex min-h-11 items-center hover:text-primary" href="/privacy">Политика конфиденциальности</a>
    <a className="inline-flex min-h-11 items-center hover:text-primary" href="/terms">Пользовательское соглашение</a>
    <button type="button" className="min-h-11 hover:text-primary" onClick={openPrivacySettings}>Настройки аналитики</button>
  </nav>
);

export default LegalLinks;
