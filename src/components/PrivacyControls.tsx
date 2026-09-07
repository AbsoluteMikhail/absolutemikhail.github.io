import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LegalModal from "@/components/LegalModal";
import { startAnalytics, stopAnalytics } from "@/lib/analytics";
import {
  isAnalyticsExcluded, saveAnalyticsChoice, subscribePrivacySettings, useAnalyticsChoice,
  type AnalyticsChoice,
} from "@/lib/privacyPreferences";

const PrivacyControls = () => {
  const { pathname } = useLocation();
  const choice = useAnalyticsChoice();
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [storageNotice, setStorageNotice] = useState(false);
  const excluded = isAnalyticsExcluded(pathname);

  useEffect(() => {
    setReady(true);
    return subscribePrivacySettings(() => setSettingsOpen(true));
  }, []);

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
    <div className="grid gap-3 sm:grid-cols-2">
      <Button variant="outline" size="sm" effect="none" onClick={() => choose("rejected")}>
        Без аналитики
      </Button>
      <Button variant="outline" size="sm" effect="none" onClick={() => choose("accepted")}>
        Разрешить аналитику
      </Button>
    </div>
  );

  return (
    <>
      {ready && choice === null && !excluded && !settingsOpen && (
        <aside aria-label="Выбор аналитики" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-xl border border-border bg-card p-5 shadow-2xl sm:inset-x-6 sm:bottom-6 sm:p-6">
          <p className="font-semibold text-foreground">Поможете сделать сайт удобнее?</p>
          <p className="mb-4 mt-2 text-sm leading-6 text-muted-foreground">
            С вашего разрешения Google Analytics и Яндекс Метрика собирают статистику посещений и используют cookies.
            Без аналитики сайт тоже работает. Выбор можно изменить в настройках внизу страницы.
            {" "}<a className="text-foreground underline underline-offset-4" href="/privacy">Подробнее о данных</a>.
          </p>
          {buttons}
        </aside>
      )}
      {storageNotice && (
        <p role="status" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-lg border border-border bg-card p-4 text-sm">
          Браузер не сохранил выбор. При следующем открытии сайта мы спросим снова.
          <button type="button" className="ml-3 min-h-11 underline" onClick={() => setStorageNotice(false)}>Понятно</button>
        </p>
      )}
      <LegalModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} title="Настройки аналитики" content={
        <div className="space-y-5">
          <p>Сейчас аналитика {choice === "accepted" ? "разрешена" : "выключена"}.{excluded && " На этой странице она не загружается."}</p>
          <p>Разрешение включает Google Analytics и Яндекс Метрику для статистики посещений. Реклама и Вебвизор выключены.</p>
          <p>Отказ остановит дальнейший сбор данных и перезагрузит страницу, если аналитика уже работала. Уже собранные сервисами данные автоматически не удаляются.</p>
          {buttons}
          <p className="text-sm">Выбор хранится в этом браузере 180 дней. <a className="underline underline-offset-4" href="/privacy">Политика конфиденциальности</a></p>
        </div>
      } />
    </>
  );
};

export default PrivacyControls;
