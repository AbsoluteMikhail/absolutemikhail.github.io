import { forwardRef, type AnchorHTMLAttributes } from "react";
import { Award, ExternalLink } from "lucide-react";
import uaiBadge from "@/assets/uai-badge-2026.png";
import { cn } from "@/lib/utils";

type InstructorBadgeCardProps = AnchorHTMLAttributes<HTMLAnchorElement>;

const InstructorBadgeCard = forwardRef<HTMLAnchorElement, InstructorBadgeCardProps>(
  (
    {
      className,
      href = "https://credential.unrealengine.com/b0a726a2-6749-4f13-a1c9-8ebfcc3d6034",
      rel = "noopener noreferrer",
      target = "_blank",
      ...props
    },
    ref,
  ) => (
    <a
      ref={ref}
      href={href}
      rel={rel}
      target={target}
      aria-label="Unreal Authorized Instructor — открыть официальный credential"
      className={cn(
        "group block rounded-3xl border border-white/15 bg-background/65 p-4 shadow-2xl shadow-black/45 backdrop-blur-xl transition-[border-color,background-color,box-shadow] duration-300 hover:border-primary/40 hover:bg-background/80 hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        className,
      )}
      {...props}
    >
      <span className="flex items-center gap-4">
        <span className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-white via-zinc-300 to-zinc-500 p-1 shadow-inner shadow-white/50">
          <img src={uaiBadge} alt="Unreal Authorized Instructor 2026" className="h-full w-full object-contain" />
        </span>
        <span className="min-w-0">
          <span className="mb-2 flex items-center gap-1.5 text-primary">
            <Award className="h-4 w-4" />
            <span className="font-display text-[9px] font-bold uppercase tracking-[0.2em]">Статус 2026</span>
          </span>
          <strong className="block font-display text-sm uppercase leading-5 tracking-[0.08em] text-foreground">
            Unreal Authorized Instructor
          </strong>
          <span className="mt-2 block text-xs leading-5 text-muted-foreground">
            <span className="block">Преподаю то, с чем сам работаю:</span>
            <span className="block">код, архитектуру и путь до релиза</span>
          </span>
        </span>
      </span>
      <span className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
        <span className="rounded-xl bg-white/[0.035] px-3 py-2">
          <strong className="block font-display text-lg text-foreground">11 лет</strong>
          <span className="text-[10px] text-muted-foreground">в экосистеме UE</span>
        </span>
        <span className="rounded-xl bg-white/[0.035] px-3 py-2">
          <strong className="block font-display text-lg text-foreground">6+ лет</strong>
          <span className="text-[10px] text-muted-foreground">в коммерции</span>
        </span>
      </span>
      <span className="mt-3 flex items-center justify-end gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary transition-colors group-hover:text-primary/80">
        Открыть официальный credential
        <ExternalLink className="h-3.5 w-3.5" />
      </span>
    </a>
  ),
);

InstructorBadgeCard.displayName = "InstructorBadgeCard";

export default InstructorBadgeCard;
