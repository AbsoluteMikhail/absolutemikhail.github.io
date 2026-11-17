import { Button, buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { studioLocale } from "@/lib/studioLocale";

export const PageLoadError = ({ compact = false }: { compact?: boolean }) => {
  const Heading = compact ? "h2" : "h1";
  const en = typeof window !== "undefined" && studioLocale(window.location.pathname) === "en";
  return (
    <section role="alert" className={cn(
      "flex items-center justify-center bg-background px-6 py-10 text-foreground",
      compact ? "border-b border-border pt-24" : "min-h-screen",
    )}>
      <div className="w-full max-w-xl">
        <Heading className="font-display text-xl font-bold sm:text-2xl">
          {en ? (compact ? "Some page features could not load" : "This page could not load") : (compact ? "Не удалось включить все функции страницы" : "Не удалось открыть страницу")}
        </Heading>
        <p className="mt-4 leading-7 text-muted-foreground">
          {en ? "Your connection may have dropped, or the site may have been updated. Try loading the page again." : "Возможно, соединение прервалось или сайт обновился. Попробуйте загрузить страницу ещё раз."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button size="sm" onClick={() => window.location.reload()}>{en ? "Reload page" : "Обновить страницу"}</Button>
          <a className={buttonStyles({ variant: "outline", size: "sm" })} href={en ? "/en/" : "/"}>{en ? "Back to home" : "На главную"}</a>
        </div>
      </div>
    </section>
  );
};
