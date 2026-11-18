import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { studioLocale } from "@/lib/studioLocale";
import { isStudioContext, legalHref, siteContext } from "@/lib/siteContext";
import { cn } from "@/lib/utils";
import LegalModal from "@/components/LegalModal";
import { startAnalytics, stopAnalytics } from "@/lib/analytics";
import {
  isAnalyticsExcluded, saveAnalyticsChoice, subscribePrivacySettings, useAnalyticsChoice,
  type AnalyticsChoice,
} from "@/lib/privacyPreferences";

const PrivacyControls = () => {
  const { pathname, search } = useLocation();
  const context = siteContext(pathname, search);
  const studio = isStudioContext(context);
  const en = context === "en" || studioLocale(pathname) === "en";
  const choice = useAnalyticsChoice();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [storageNotice, setStorageNotice] = useState(false);
  const excluded = isAnalyticsExcluded(pathname);

  useEffect(() => subscribePrivacySettings(() => setSettingsOpen(true)), []);

  useEffect(() => {
    // Keep the HTML bootstrap's visibility hint in sync after expiry or cross-tab changes.
    document.documentElement.classList.toggle("analytics-decided", choice !== null);
  }, [choice]);

  useEffect(() => {
    if (choice === "accepted" && !excluded) startAnalytics();
    else if (stopAnalytics(choice !== "accepted")) window.location.reload();
  }, [choice, excluded]);

  const choose = (next: AnalyticsChoice) => {
    const wasStarted = next === "rejected" && stopAnalytics();
    const persisted = saveAnalyticsChoice(next);
    setStorageNotice(!persisted);
    setSettingsOpen(false);
    if (wasStarted && persisted) window.location.reload();
  };

  const buttons = (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="outline" size="sm" effect="none" className="min-h-11 whitespace-normal px-2 text-xs leading-4" onClick={() => choose("rejected")}>
        {en ? "Without analytics" : "Без аналитики"}
      </Button>
      <Button variant="outline" size="sm" effect="none" className="min-h-11 whitespace-normal px-2 text-xs leading-4" onClick={() => choose("accepted")}>
        {en ? "Allow analytics" : "Разрешить аналитику"}
      </Button>
    </div>
  );

  return (
    <>
      {choice === null && !excluded && !settingsOpen && (
        <aside aria-label={en ? "Analytics choice" : "Выбор аналитики"} className={cn("analytics-banner fixed inset-x-3 bottom-3 z-50 mx-auto max-w-lg rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-xl sm:left-auto sm:right-5 sm:bottom-5 sm:mx-0", studio && "studio-surface studio-consent")}>
          <p className="mb-3 text-xs leading-5 text-muted-foreground">
            {en ? "With your permission, " : "С вашего согласия "}<a className="underline underline-offset-2" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Analytics</a>{en ? " and " : " и "}<a className="underline underline-offset-2" href="https://yandex.ru/legal/confidential/" target="_blank" rel="noopener noreferrer">{en ? "Yandex Metrica" : "Яндекс Метрика"}</a>{en ? " use cookies to measure visits and interest in our projects. You can change your choice in the footer. " : " используют cookies для статистики посещений и интереса к проектам. Выбор можно изменить в подвале сайта. "}
            <a className="underline underline-offset-2" href={legalHref("/privacy/", context)}>{en ? "Details" : "Подробнее"}</a>.
          </p>
          {buttons}
        </aside>
      )}
      {storageNotice && (
          <p role="status" className={cn("fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-lg border border-border bg-popover p-4 text-sm text-popover-foreground", studio && "studio-surface")}>
          {en ? "Your browser could not save this choice. We’ll ask again next time." : "Браузер не сохранил выбор. При следующем открытии сайта мы спросим снова."}
          <button type="button" className="ml-3 min-h-11 underline" onClick={() => setStorageNotice(false)}>{en ? "Got it" : "Понятно"}</button>
        </p>
      )}
      <LegalModal studio={studio} isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} title={en ? "Analytics settings" : "Настройки аналитики"} closeLabel={en ? "Close" : "Закрыть"} closeAriaLabel={en ? "Close analytics settings" : "Закрыть документ"} content={
        <div className="space-y-5">
          <p>{en ? `Analytics are currently ${choice === "accepted" ? "enabled" : "disabled"}.` : `Сейчас аналитика ${choice === "accepted" ? "разрешена" : "выключена"}.`}{excluded && (en ? " They do not load on this page." : " На этой странице она не загружается.")}</p>
          <p>{en ? "Google Analytics and Yandex Metrica measure visits and interest in our projects: project opens, full-video playback and progress, contact opens and channel choices. Messages and contact addresses are not included in these events." : "Google Analytics и Яндекс Метрика собирают статистику посещений и интереса к проектам: открытие карточек, запуск и прогресс полных роликов, открытие контактов и выбор способа связи. Тексты сообщений и контактные адреса в эти события не включаются."}</p>
          <p>{en ? "Google advertising signals and ad personalization, as well as Yandex session replay and click maps, are disabled. These settings do not control embedded video services: their cookies and any ads may still load when you open a video." : "Рекламные сигналы и персонализация рекламы Google, Вебвизор и карта кликов Метрики выключены. Эти настройки не управляют встроенными видеосервисами: при открытии видео могут загружаться их cookies и реклама."}</p>
          <p>{en ? "Declining stops further data collection and reloads the page if analytics were running. Data already collected by these services is not automatically deleted." : "Отказ остановит дальнейший сбор данных и перезагрузит страницу, если аналитика уже работала. Уже собранные сервисами данные автоматически не удаляются."}</p>
          {buttons}
          <p className="text-sm">{en ? "Your choice is stored in this browser for 180 days. " : "Выбор хранится в этом браузере 180 дней. "}<a className="text-primary underline underline-offset-4 hover:text-accent" href={legalHref("/privacy/", context)}>{en ? "Privacy policy" : "Политика конфиденциальности"}</a></p>
        </div>
      } />
    </>
  );
};

export default PrivacyControls;
