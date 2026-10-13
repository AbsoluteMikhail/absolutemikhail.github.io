import { ArrowUpRight, Coffee } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/section-title";
import { donationAlertsUrl } from "@/constants/contactLinks";

export const SupportAuthor = () => (
  <section
    id="support-author"
    aria-labelledby="support-author-title"
    className="relative mt-12 scroll-mt-24 overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/10 via-card to-card p-6 sm:p-8"
  >
    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent/70 via-accent/20 to-transparent" />
    <div className="flex items-start gap-4">
      <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
        <Coffee className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <SectionTitle id="support-author-title" size="compact" className="text-xl leading-tight md:text-2xl">
          Материал пригодился?
        </SectionTitle>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Если материал помог, можно поблагодарить меня чашечкой кофе. Спасибо за поддержку!
        </p>
      </div>
    </div>
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
      <a
        href={donationAlertsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-describedby="support-author-destination"
        className={buttonStyles({
          size: "sm",
          className: "w-full shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:w-auto",
        })}
      >
        Угостить кофе
        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
      </a>
      <p id="support-author-destination" className="text-center text-xs leading-5 text-muted-foreground sm:text-left">
        DonationAlerts · откроется в новой вкладке
      </p>
    </div>
  </section>
);
