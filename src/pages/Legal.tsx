import { useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ContactMessenger } from "@/components/ContactMessenger";
import LegalLinks from "@/components/LegalLinks";
import { legalContent } from "@/constants/legalContent";

const Legal = () => {
  const { pathname } = useLocation();
  const document = legalContent[pathname.replace(/\/+$/, "") === "/terms" ? "terms" : "privacy"];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-6 py-8 sm:py-14">
        <a className="mb-10 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-primary" href="/">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> На сайт
        </a>
        <h1 className="mb-4 break-words font-display text-2xl font-bold leading-tight sm:text-4xl">{document.title}</h1>
        <p className="mb-8 text-sm text-muted-foreground">Редакция от <time dateTime="2026-09-07">7 сентября 2026 года</time></p>
        <article className="space-y-7 text-base leading-7 text-muted-foreground">{document.content}</article>
        <section className="mt-10 border-t border-border pt-7" aria-labelledby="legal-contact-title">
          <h2 className="mb-3 text-lg font-semibold" id="legal-contact-title">Вопросы и обращения</h2>
          <p className="mb-5 leading-7 text-muted-foreground">Михаил Ефремов (Absolute Mikhail). Здесь можно запросить информацию о данных, их исправление или удаление, обсудить использование материалов или сообщить о нарушении прав.</p>
          <ContactMessenger size="sm">Связаться по вопросам сайта и данных</ContactMessenger>
        </section>
      </main>
      <footer className="border-t border-border px-6 py-6"><LegalLinks /></footer>
    </div>
  );
};

export default Legal;
