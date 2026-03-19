import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TimelineSection from "@/components/TimelineSection";
import GamesSection from "@/components/GamesSection";
import MentoringSection from "@/components/MentoringSection";
import ReviewsSection from "@/components/ReviewsSection";
import { motion } from "framer-motion";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import { DiscordIcon, SteamIcon, TelegramIcon, YoutubeIcon, TwitchIcon } from "@/components/SocialIcons";
import { ContactEmail } from "@/components/ContactEmail";
import ScrollToTop from "@/components/ScrollToTop";
import LegalModal from "@/components/LegalModal";
import { legalContent } from "@/constants/legalContent";

const Index = () => {
  const [activeLegalModal, setActiveLegalModal] = useState<"privacy" | "terms" | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <TimelineSection />
      <GamesSection />
      <ReviewsSection />
      <MentoringSection />

      {/* Footer */}
      <footer className="relative pt-24 pb-12 overflow-hidden border-t border-border/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="space-y-6">
              <a href="#" className="font-display text-2xl font-bold tracking-tighter">
                <span className="text-primary">&lt;</span>DEV<span className="text-primary">/&gt;</span>
              </a>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                Создаю захватывающие игровые миры и обучаю искусству разработки на Unreal Engine 5. Путь от идеи до реализации.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: YoutubeIcon, href: "https://www.youtube.com/@Absolute-Unreal" },
                  { icon: TwitchIcon, href: "https://www.twitch.tv/absolutemikhail" },
                  { icon: TelegramIcon, href: "https://t.me/AbsoluteUnderground" },
                  { icon: DiscordIcon, href: "https://discord.gg/NkwZ8pqyS6" },
                  { icon: SteamIcon, href: "https://store.steampowered.com/developer/GamePunk-Studio" },
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-display font-bold uppercase tracking-widest text-xs mb-6 text-foreground">Навигация</h4>
              <ul className="space-y-4">
                {[
                  { label: "Проекты", href: "#games" },
                  { label: "Достижения", href: "#timeline" },
                  { label: "Менторинг", href: "#mentoring" },
                  { label: "Все проекты", href: "/projects" },
                ].map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-display font-bold uppercase tracking-widest text-xs mb-6 text-foreground">Контакты</h4>
              <ul className="space-y-4">
                <li>
                  <ContactEmail className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-3">
                    <Mail className="w-4 h-4 text-primary" />
                    Написать мне
                  </ContactEmail>
                </li>
                <li className="text-sm text-muted-foreground flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  Remote / Worldwide
                </li>
              </ul>
            </div>

            {/* Newsletter/Status */}
            <div className="relative group">
              <div className="absolute -inset-4 rounded-3xl bg-primary/5 border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <h4 className="font-display font-bold uppercase tracking-widest text-xs mb-6 text-foreground">Статус</h4>
                <div className="flex items-center gap-2 mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-medium text-emerald-500">Доступен для новых проектов</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Открыт к предложениям по разработке игр и менторству. Напишите мне, чтобы обсудить ваш проект.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-muted-foreground">
              © 2026 Absolute Mikhail. Crafted with passion for GameDev.
            </p>
            <div className="flex gap-8">
              <button
                onClick={() => setActiveLegalModal("privacy")}
                className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveLegalModal("terms")}
                className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>
      <ScrollToTop />
      <LegalModal
        isOpen={activeLegalModal !== null}
        onClose={() => setActiveLegalModal(null)}
        title={activeLegalModal ? legalContent[activeLegalModal].title : ""}
        content={activeLegalModal ? legalContent[activeLegalModal].content : null}
      />
    </div>
  );
};

export default Index;
