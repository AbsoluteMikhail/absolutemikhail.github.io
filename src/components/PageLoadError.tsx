import { Button, buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const PageLoadError = ({ compact = false }: { compact?: boolean }) => {
  const Heading = compact ? "h2" : "h1";
  return (
    <section role="alert" className={cn(
      "flex items-center justify-center bg-background px-6 py-10 text-foreground",
      compact ? "border-b border-border pt-24" : "min-h-screen",
    )}>
      <div className="w-full max-w-xl">
        <Heading className="font-display text-xl font-bold sm:text-2xl">
          {compact ? "Не удалось включить все функции страницы" : "Не удалось открыть страницу"}
        </Heading>
        <p className="mt-4 leading-7 text-muted-foreground">
          Возможно, соединение прервалось или сайт обновился. Попробуйте загрузить страницу ещё раз.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button size="sm" onClick={() => window.location.reload()}>Обновить страницу</Button>
          <a className={buttonStyles({ variant: "outline", size: "sm" })} href="/">На главную</a>
        </div>
      </div>
    </section>
  );
};
