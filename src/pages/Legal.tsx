import { useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ContactMessenger } from "@/components/ContactMessenger";
import LegalLinks from "@/components/LegalLinks";
import { legalContent } from "@/constants/legalContent";
import { legalContentEn } from "@/constants/legalContentEn";
import { contextHome, isStudioContext, legalHref, siteContext } from "@/lib/siteContext";
import { cn } from "@/lib/utils";
import studioLogo from "@/assets/studio/gamepunk-logo.svg";
import "@/pages/studio.css";

const Legal = () => {
  const { pathname, search, hash } = useLocation();
  const context = siteContext(pathname, search);
  const studio = isStudioContext(context);
  const en = context === "en";
  const kind = /\/terms\/?$/.test(pathname) ? "terms" : "privacy";
  const document = (en ? legalContentEn : legalContent)[kind];
  return (
    <div lang={en ? "en" : "ru"} className={cn("min-h-screen bg-background text-foreground", studio && "studio-page studio-surface studio-legal")}>
      <main className="mx-auto max-w-3xl px-6 py-8 sm:py-14">
        {studio && <a href={contextHome(context)} aria-label={en ? "GamePunk — home" : "GamePunk — главная"} className="studio-legal-logo"><img src={studioLogo} width="1756" height="551" alt="GamePunk" /></a>}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <a className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-primary" href={contextHome(context)}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {en ? "Back to home" : "На сайт"}
          </a>
          {studio && <nav aria-label={en ? "Language" : "Язык"} className="flex items-center gap-3 text-sm font-bold">
            <a className="inline-flex min-h-11 items-center underline-offset-4 hover:underline" href={`${legalHref(`/${kind}/`, "studio")}${hash}`} lang="ru" aria-label="Русский" aria-current={!en ? "page" : undefined}>RU</a>
            <span aria-hidden="true">/</span>
            <a className="inline-flex min-h-11 items-center underline-offset-4 hover:underline" href={`${legalHref(`/${kind}/`, "en")}${hash}`} lang="en" aria-label="English" aria-current={en ? "page" : undefined}>EN</a>
          </nav>}
        </div>
        <h1 className="mb-4 break-words font-display text-2xl font-bold leading-tight sm:text-4xl">{document.title}</h1>
        <p className="mb-8 text-sm text-muted-foreground">{en ? "Last updated: " : "Редакция от "}<time dateTime="2026-11-17">{en ? "17 November 2026" : "17 ноября 2026 года"}</time></p>
        <article className="space-y-7 text-base leading-7 text-muted-foreground">{document.content(context)}</article>
        <section className="mt-10 border-t border-border pt-7" aria-labelledby="legal-contact-title">
          <h2 className="mb-3 text-lg font-semibold" id="legal-contact-title">{en ? "Questions and requests" : "Вопросы и обращения"}</h2>
          <p className="mb-5 leading-7 text-muted-foreground">{en ? "Mikhail Efremov (Absolute Mikhail). Contact me to ask about your data, request correction or deletion, discuss using materials or report a rights infringement." : "Михаил Ефремов (Absolute Mikhail). Здесь можно запросить информацию о данных, их исправление или удаление, обсудить использование материалов или сообщить о нарушении прав."}</p>
          <ContactMessenger locale={en ? "en" : "ru"} studio={studio} size="sm">{en ? "Contact about the website and your data" : "Связаться по вопросам сайта и данных"}</ContactMessenger>
        </section>
      </main>
      <footer className="border-t border-border px-6 py-6"><LegalLinks /></footer>
    </div>
  );
};

export default Legal;
