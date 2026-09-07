import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

// Native details keeps navigation usable in prerendered HTML without JavaScript.
export const AcademyDisclosure = ({ label, children }: { label: string; children: ReactNode }) => (
  <details
    className="group rounded-lg border border-border bg-card/35"
    onClick={(event) => {
      if (event.target instanceof Element && event.target.closest("a")) event.currentTarget.open = false;
    }}
    onKeyDown={(event) => {
      if (event.key !== "Escape") return;
      event.currentTarget.open = false;
      event.currentTarget.querySelector("summary")?.focus();
    }}
  >
    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
      {label}
      <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
    </summary>
    <div className="max-h-[60svh] overflow-y-auto border-t border-border p-4">{children}</div>
  </details>
);
