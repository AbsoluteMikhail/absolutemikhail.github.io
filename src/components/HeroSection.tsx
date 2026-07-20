import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Building2, CheckCircle2, Film, GraduationCap, Trophy } from "lucide-react";
import heroPhoto from "@/assets/hero-photo.jpg";
import { DiscordIcon, SteamIcon, TelegramIcon, YoutubeIcon, TwitchIcon } from "@/components/SocialIcons";

const trustItems = [
  { icon: Building2, lines: ["Резидент игрового кластера", "Сколково"] },
  { icon: Film, lines: ["Премия «Золотой орёл»", "За VFX фильма «Воздух»"] },
  { icon: Trophy, lines: ["Победитель", "Хакатон «Синеус»"] },
  { icon: GraduationCap, lines: ["Unreal Authorized", "Instructor"] },
];

const HeroSection = () => {
  const trustCardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let frameId: number | null = null;

    const updateTrustCard = () => {
      frameId = null;
      const card = trustCardRef.current;
      if (!card) return;

      const progress = Math.min(window.scrollY / 360, 1);
      card.style.opacity = String(1 - progress);
      card.style.transform = `translate3d(0, ${progress * 32}px, 0) scale(${1 - progress * 0.04})`;
      card.style.pointerEvents = progress > 0.95 ? "none" : "auto";
    };

    const handleScroll = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(updateTrustCard);
    };

    updateTrustCard();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section 
      id="about" 
      className="relative min-h-screen flex flex-col md:flex-row md:items-center overflow-hidden bg-background"
      style={{
        // Глубина и объем: Внутренняя фаска (стеклянный край) и диагональные отблески
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
        backgroundImage: `
          linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 30%),
          linear-gradient(225deg, rgba(255,255,255,0.01) 0%, transparent 20%)
        `
      }}
    >
      {/* Mobile: photo on top */}
      <div className="relative h-[40svh] min-h-[300px] max-h-[360px] w-full md:hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="h-full w-full"
        >
          <img
            src={heroPhoto}
            alt="Absolute Mikhail, инди-разработчик игр на Unreal Engine 5"
            loading="eager"
            {...{ fetchpriority: "high" }}
            decoding="async"
            className="h-full w-full object-cover object-[center_20%]"
            style={{ filter: 'brightness(0.9) contrast(1.1) saturate(0.8)' }}
          />
        </motion.div>
        <div 
          className="absolute inset-0"
          style={{
            maskImage: 'linear-gradient(to top, black 0%, transparent 20%, transparent 90%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 20%, transparent 90%, black 100%)',
            backgroundColor: 'hsl(var(--background))'
          }}
        />
      </div>

      {/* Desktop: photo on the right */}
      <div 
        className="hidden md:block absolute top-0 right-0 h-full w-[50%] lg:w-[45%] pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 40%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 40%)'
        }}
      >
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative h-full w-full"
        >
          <img
            src={heroPhoto}
            alt="Absolute Mikhail, инди-разработчик игр на Unreal Engine 5"
            loading="eager"
            {...{ fetchpriority: "high" }}
            decoding="async"
            className="h-full w-full object-cover object-center"
            style={{ filter: 'brightness(0.9) contrast(1.1) saturate(0.8)' }}
          />
          {/* Gradients for smooth transition and depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/0 to-30%" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/0 to-background/0" />
          
          {/* Subtle Glow like in OG Snippet */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-full h-full bg-primary/5 blur-[100px] mix-blend-screen" />

        </motion.div>
      </div>

      {/* Compact facts card: the whole card leads to the proof section. */}
      <a
        ref={trustCardRef}
        href="#proof"
        aria-label="Перейти к разделу «Проверяемый опыт»"
        className="group absolute bottom-10 right-8 z-20 hidden w-72 rounded-2xl border border-white/10 bg-background/55 p-5 shadow-2xl shadow-black/35 backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-300 will-change-[transform,opacity] hover:border-primary/35 hover:bg-background/70 hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 lg:block xl:right-12"
      >
        <span className="mb-4 block font-display text-[10px] font-bold uppercase tracking-[0.24em] text-primary/85">
          Проверяемый опыт
        </span>
        <span className="block space-y-3">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <span key={item.lines.join("-")} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-display text-[11px] font-bold uppercase leading-4 tracking-[0.09em] text-foreground/85">
                  {item.lines.map((line) => (
                    <span key={line} className="block whitespace-nowrap">
                      {line}
                    </span>
                  ))}
                </span>
              </span>
            );
          })}
        </span>
      </a>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-6 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-4 inline-block rounded-full border border-primary/40 bg-primary/10 px-4 py-2"
          >
            <span className="block font-display text-[10px] font-bold uppercase tracking-[0.2em] text-primary sm:text-xs md:text-sm md:tracking-[0.3em]">
              Инди-разработчик на Unreal Engine
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mb-4 font-display text-[1.75rem] font-black leading-[1.05] tracking-tight min-[360px]:text-[2rem] sm:text-5xl md:mb-6 md:text-7xl md:leading-tight"
            style={{ textShadow: '0 0 40px rgba(0,0,0,0.5)' }}
          >
            <span className="gradient-text whitespace-nowrap">UNREAL-ПРОЕКТ</span>
            <br />
            <span className="text-foreground">ДО РЕЛИЗА</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mb-6 max-w-xl space-y-2 md:mb-8 md:space-y-3"
          >
            <p className="text-base leading-relaxed text-foreground sm:text-lg md:text-xl">
              Помогаю Blueprint и C++ разработчикам доводить Unreal проекты до
              релиза без архитектурного хаоса и бесконечных переделок.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
              Разбираем игровые системы, архитектуру, производительность и
              сложные технические узлы проекта.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="flex flex-col gap-4 mb-8 sm:flex-row"
          >
            <a
              href="#mentoring"
              className="px-8 py-3 rounded-lg font-display text-sm tracking-wider uppercase gradient-primary text-primary-foreground font-semibold box-glow hover:scale-105 transition-transform"
            >
              Выбрать формат работы
            </a>
            <a
              href="#timeline"
              className="px-8 py-3 rounded-lg font-display text-sm tracking-wider uppercase border border-border text-foreground hover:border-primary/50 hover:text-primary transition-colors"
            >
              Почему мне доверяют
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="-mt-4 mb-8 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
            Перед первой консультацией бесплатно помогу выбрать формат.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="hidden gap-3 sm:flex"
          >
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
                className="w-10 h-10 rounded-lg border border-border bg-card/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/40 flex justify-center pt-2"
        >
          <div className="w-1 h-2 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
