import { useEffect, useMemo, useState } from "react";
import { Eye, Languages, Mail, Send, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { MarkdownContent } from "@/components/academy/MarkdownContent";
import privacyPolicyRu from "@/content/malena/PRIVACY_POLICY.md?raw";
import privacyPolicyEn from "@/content/malena/PRIVACY_POLICY_EN.md?raw";

type Language = "ru" | "en";

const decodeContact = (parts: string[]) => {
  if (typeof window === "undefined") return "";
  return window.atob(parts.join(""));
};

const contactParts = {
  email: ["cnVh", "Z2VA", "dmsu", "Y29t"],
  telegram: ["QWJz", "b2x1", "dGVN", "aWto", "YWls"],
};

const ProtectedContacts = ({ language }: { language: Language }) => {
  const [revealed, setRevealed] = useState(false);
  const contacts = useMemo(() => {
    if (!revealed) return null;
    return {
      email: decodeContact(contactParts.email),
      telegram: decodeContact(contactParts.telegram),
    };
  }, [revealed]);

  const copy = language === "ru"
    ? {
        description: "Контакты скрыты от простых автоматических сборщиков и появятся только после вашего действия.",
        email: "Электронная почта",
        reveal: "Показать контакты",
        telegram: "Написать в Telegram",
        title: "Связаться с разработчиком",
      }
    : {
        description: "Contact details are hidden from basic automated harvesters and appear only after your action.",
        email: "Email",
        reveal: "Show contacts",
        telegram: "Message on Telegram",
        title: "Contact the Developer",
      };

  return (
    <section
      aria-labelledby="protected-contacts-title"
      className="mt-10 overflow-hidden rounded-2xl border border-primary/25 bg-card/70 p-5 shadow-[0_0_50px_hsl(var(--primary)/0.08)] sm:p-7"
      data-nosnippet
    >
      <div className="flex items-start gap-4">
        <div className="rounded-xl border border-primary/25 bg-primary/10 p-3 text-primary">
          <ShieldCheck aria-hidden="true" className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold text-foreground" id="protected-contacts-title">
            {copy.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.description}</p>

          {!contacts ? (
            <button
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-primary/35 bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_0_24px_hsl(var(--primary)/0.2)] transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={() => setRevealed(true)}
              type="button"
            >
              <Eye aria-hidden="true" className="h-4 w-4" />
              {copy.reveal}
            </button>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2" role="group">
              <a
                className="flex min-h-12 items-center gap-3 rounded-xl border border-border bg-background/65 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/45 hover:text-primary"
                href={`https://t.me/${contacts.telegram}`}
                rel="nofollow noreferrer"
                target="_blank"
              >
                <Send aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span className="truncate">{copy.telegram}</span>
              </a>
              <a
                className="flex min-h-12 items-center gap-3 rounded-xl border border-border bg-background/65 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/45 hover:text-primary"
                href={`mailto:${contacts.email}`}
                rel="nofollow"
              >
                <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span className="truncate">{copy.email}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const MalenaPrivacy = () => {
  const [language, setLanguage] = useState<Language>("ru");
  const isRussian = language === "ru";

  useEffect(() => {
    document.documentElement.lang = language;
    return () => {
      document.documentElement.lang = "ru";
    };
  }, [language]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background pb-20 text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.16),transparent_68%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(92vw,900px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            aria-label={isRussian ? "На главную" : "Home"}
            className="group flex min-w-0 items-center gap-3"
            to="/"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 font-display text-sm font-black text-primary transition group-hover:border-primary/60">
              M
            </span>
            <span className="truncate font-display text-sm font-bold tracking-wide text-foreground sm:text-base">
              Malena · Privacy
            </span>
          </Link>

          <div
            aria-label={isRussian ? "Выбор языка" : "Language selection"}
            className="flex items-center rounded-xl border border-border bg-card/80 p-1 shadow-lg"
            role="group"
          >
            <Languages aria-hidden="true" className="ml-2 mr-1 hidden h-4 w-4 text-muted-foreground sm:block" />
            {(["ru", "en"] as const).map((option) => (
              <button
                aria-pressed={language === option}
                className={`min-h-9 rounded-lg px-3 text-xs font-bold uppercase tracking-[0.14em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  language === option
                    ? "bg-primary text-primary-foreground shadow-[0_0_18px_hsl(var(--primary)/0.24)]"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
                key={option}
                onClick={() => setLanguage(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-4xl px-4 pt-10 sm:px-6 sm:pt-14">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
          <ShieldCheck aria-hidden="true" className="h-4 w-4" />
          {isRussian ? "Конфиденциальность Malena" : "Malena privacy"}
        </div>

        <article
          className="rounded-2xl border border-border/80 bg-card/55 p-5 shadow-2xl shadow-black/20 sm:p-8 md:p-10"
          data-nosnippet
          lang={language}
        >
          <MarkdownContent content={isRussian ? privacyPolicyRu : privacyPolicyEn} />
        </article>

        <ProtectedContacts language={language} />

        <p className="mt-8 text-center text-xs leading-5 text-muted-foreground" data-nosnippet>
          {isRussian
            ? "Страница намеренно не включена в поиск и карту сайта. Публичный доступ сохранён для пользователей Telegram."
            : "This page is intentionally excluded from search and the sitemap while remaining publicly available to Telegram users."}
        </p>
      </div>
    </main>
  );
};

export default MalenaPrivacy;
