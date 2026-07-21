import { useState } from "react";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { ContactMessenger } from "@/components/ContactMessenger";
import LegalModal from "@/components/LegalModal";
import Logo from "@/components/Logo";
import {
  DiscordIcon,
  SteamIcon,
  TelegramIcon,
  TwitchIcon,
  YoutubeIcon,
} from "@/components/SocialIcons";
import { legalContent } from "@/constants/legalContent";

interface SiteFooterProps {
  projectsPage?: boolean;
}

const SiteFooter = ({ projectsPage = false }: SiteFooterProps) => {
  const [activeLegalModal, setActiveLegalModal] = useState<"privacy" | "terms" | null>(null);
  const homePrefix = projectsPage ? "/" : "";

  return (
    <>
      <footer className="relative overflow-hidden border-t border-border/50 pb-12 pt-24">
        <div className="absolute left-1/2 top-0 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="container relative z-10 mx-auto px-6">
          <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-6">
              <Logo className="font-display text-2xl font-bold tracking-tighter" />
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Senior Gameplay Programmer и Unreal Authorized Instructor. Создаю игровые системы, собственные проекты и помогаю командам доходить до релиза.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: YoutubeIcon, href: "https://www.youtube.com/@Absolute-Unreal", label: "YouTube" },
                  { icon: TwitchIcon, href: "https://www.twitch.tv/absolutemikhail", label: "Twitch" },
                  { icon: DiscordIcon, href: "https://discord.gg/NkwZ8pqyS6", label: "Discord-сообщество" },
                  { icon: SteamIcon, href: "https://store.steampowered.com/developer/GamePunk-Studio", label: "Steam" },
                  { icon: TelegramIcon, href: "https://t.me/AbsoluteUnderground", label: "Telegram" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-6 font-display text-xs font-bold uppercase tracking-widest text-foreground">Навигация</h4>
              <ul className="space-y-4">
                {[
                  { label: "Менторинг", href: `${homePrefix}#mentoring` },
                  { label: "Отзывы учеников", href: `${homePrefix}#mentee-reviews` },
                  { label: "Проекты", href: `${homePrefix}#games` },
                  { label: "Опыт", href: `${homePrefix}#timeline` },
                  { label: "Все проекты", href: "/projects" },
                ].map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary">
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 -translate-y-0.5 opacity-0 transition-all group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-6 font-display text-xs font-bold uppercase tracking-widest text-foreground">Контакты</h4>
              <ul className="space-y-4">
                <li>
                  <ContactMessenger className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary">
                    <Mail className="h-4 w-4 text-primary" />
                    Написать мне
                  </ContactMessenger>
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  Удалённо / по всему миру
                </li>
              </ul>
            </div>

            <div className="group relative">
              <div className="absolute -inset-4 rounded-3xl border border-primary/10 bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <h4 className="mb-6 font-display text-xs font-bold uppercase tracking-widest text-foreground">Статус</h4>
                <div className="mb-4 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-xs font-medium text-emerald-500">Доступен для новых проектов</span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Открыт к предложениям по разработке игр и менторству. Напишите мне, чтобы обсудить ваш проект.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-6 border-t border-border/50 pt-8 md:flex-row">
            <div className="flex flex-col items-center gap-2 md:items-start">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                © 2026 Absolute Mikhail. Разработка игр и менторинг.
              </p>
              <p className="font-display text-xs font-bold leading-none tracking-wider text-foreground/60 antialiased">
                absolutemikhail.github.io
              </p>
            </div>
            <div className="flex gap-8">
              <button onClick={() => setActiveLegalModal("privacy")} className="text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary">
                Политика конфиденциальности
              </button>
              <button onClick={() => setActiveLegalModal("terms")} className="text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary">
                Пользовательское соглашение
              </button>
            </div>
          </div>
        </div>
      </footer>

      <LegalModal
        isOpen={activeLegalModal !== null}
        onClose={() => setActiveLegalModal(null)}
        title={activeLegalModal ? legalContent[activeLegalModal].title : ""}
        content={activeLegalModal ? legalContent[activeLegalModal].content : null}
      />
    </>
  );
};

export default SiteFooter;
