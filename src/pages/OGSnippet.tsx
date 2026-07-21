import { motion } from "framer-motion";
import { useEffect } from "react";
import { Award } from "lucide-react";
import heroPhoto from "@/assets/hero-photo.jpg";
import uaiBadge from "@/assets/uai-badge-2026.png";
import { DiscordIcon, MaxIcon, SteamIcon, TelegramIcon, YoutubeIcon, TwitchIcon } from "@/components/SocialIcons";
import Logo from "@/components/Logo";
import { decodeContactLink, encodedContactLinks } from "@/constants/contactLinks";

const OGSnippet = () => {
  useEffect(() => {
    const isCaptureMode = new URLSearchParams(window.location.search).has('capture');
    if (isCaptureMode) {
      document.documentElement.classList.add('snippet-capture');
    }

    const handleResize = () => {
      const scaleW = window.innerWidth / 1200;
      const scaleH = window.innerHeight / 630;
      const scale = Math.min(scaleW, scaleH);
      document.documentElement.style.setProperty('--snippet-scale', scale.toString());
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.documentElement.style.removeProperty('--snippet-scale');
      document.documentElement.classList.remove('snippet-capture');
    };
  }, []);

  const openPrivateContact = (encodedLink: string) => {
    window.open(decodeContactLink(encodedLink), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-0 overflow-hidden">
      {/* 
        Container with fixed 1200x630 aspect ratio, 
        but scales to fit the screen while maintaining proportions.
      */}
      <div
          id="og-snippet-container"
          className="relative bg-background overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex-shrink-0"
          style={{
            width: '1200px',
            height: '630px',
            transform: 'scale(var(--snippet-scale, 1))',

            // ВИШЕНКА №1: Внутренняя фаска (стеклянный край)
            // Мы добавляем 1px белого цвета с очень низкой прозрачностью.
            // Глаз видит это как блик на грани стекла.
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07), 0 20px 50px rgba(0,0,0,0.5)',

            // ВИШЕНКА №2: Диагональный отблеск
            // Создает эффект того, что на панель падает свет под углом.
            backgroundImage: `
            linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 30%),
            linear-gradient(225deg, rgba(255,255,255,0.02) 0%, transparent 20%)
          `
          }}
      >
        {/* ============================================================================== */}
        {/* ВАРИАНТ 1: Очищенный блок фото с использованием CSS Mask */}
        {/* ============================================================================== */}
        <div
            className="absolute top-0 right-0 h-full w-[50%] pointer-events-none"
            style={{
              // Мы объединяем две маски: горизонтальную (to right) и вертикальную (to top)
              maskImage: `
            linear-gradient(to right, transparent 0%, black 40%), 
            linear-gradient(to top, transparent 0%, black 35%)
        `,
              WebkitMaskImage: `
            linear-gradient(to right, transparent 0%, black 40%), 
            linear-gradient(to top, transparent 0%, black 35%)
        `,
              // Это заставляет маски пересекаться (как логическое И в шейдерах)
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in'
            }}
        >
          <img
              src={heroPhoto}
              alt="Михаил Ефремов, Senior Gameplay Programmer и Unreal Authorized Instructor"
              loading="eager"
              {...{ fetchpriority: "high" }}
              decoding="async"
              // Оставляем настройки картинки
              className="absolute inset-0 h-full w-full object-cover object-top scale-[1.05] translate-x-[5%]"
              style={{ filter: 'brightness(0.9) contrast(1.1) saturate(0.8)' }}
          />

          {/* Сбоку (мягкое припорошивание левого края градиентом) */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-background/0 to-60%" />

          {/* Оставляем ТОЛЬКО нижний и верхний градиенты, чтобы сохранить плавность снизу */}
          {/* Снизу (подредактированный для плавности) */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/0 to-30%" />
          {/* Сверху */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/0 to-background/0" />

          {/* Свечение */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-full h-full bg-primary/5 blur-[100px] mix-blend-screen" />
        </div>
        {/* ============================================================================== */}

        {/* Left Side Content */}
        <div className="relative z-10 flex h-full max-w-3xl -translate-y-14 flex-col justify-center px-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-block mb-6 px-5 py-2 rounded-full border border-primary/40 bg-primary/10 w-fit"
          >
            <span className="text-sm font-display tracking-[0.3em] text-primary uppercase font-bold">
              Senior Gameplay Programmer • UAI
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 font-display text-8xl font-black leading-[0.9] tracking-[0.05em]"
            style={{ textShadow: '0 0 40px rgba(0,0,0,0.5)' }}
          >
            <span className="text-foreground">ABSOLUTE</span>
            <br />
            <span className="gradient-text">MIKHAIL</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="h-px w-12 bg-primary/50" />
            <p className="font-display text-2xl font-bold uppercase leading-tight tracking-[0.08em]">
              <span className="block text-foreground">Unreal-проекты</span>
              <span className="block text-foreground/70">до релиза</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-12"
          >
            <span className="flex gap-4">
              {[
                { icon: YoutubeIcon, label: "YouTube", href: "https://www.youtube.com/@Absolute-Unreal" },
                { icon: TwitchIcon, label: "Twitch", href: "https://www.twitch.tv/absolutemikhail" },
                { icon: SteamIcon, label: "Steam", href: "https://store.steampowered.com/developer/GamePunk-Studio" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card/40 text-muted-foreground shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:shadow-lg hover:shadow-primary/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  <social.icon className="h-8 w-8" />
                </a>
              ))}
            </span>

            <span className="flex gap-4">
              {[
                { icon: DiscordIcon, label: "Discord — личный профиль", encodedLink: encodedContactLinks.discordProfile },
                { icon: TelegramIcon, label: "Telegram — личный профиль", encodedLink: encodedContactLinks.telegram },
                { icon: MaxIcon, label: "MAX — личный профиль", encodedLink: encodedContactLinks.max },
              ].map((social) => (
                <button
                  key={social.label}
                  type="button"
                  onClick={() => openPrivateContact(social.encodedLink)}
                  aria-label={social.label}
                  title={social.label}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card/40 text-muted-foreground shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:shadow-lg hover:shadow-primary/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  <social.icon className="h-8 w-8" />
                </button>
              ))}
            </span>
          </motion.div>
        </div>

        {/* Compact credential card: mirrors the trust block from the main hero. */}
        <a
          href="https://absolutemikhail.github.io/#proof"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Unreal Authorized Instructor — открыть подтверждённый опыт"
          className="group absolute bottom-10 right-10 z-20 w-[390px] rounded-2xl border border-white/15 bg-background/70 p-3.5 shadow-2xl shadow-black/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-background/85 hover:shadow-primary/10 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          <span className="flex items-center gap-4">
            <span className="flex h-[92px] w-[92px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-white via-zinc-300 to-zinc-500 p-1 shadow-inner shadow-white/50">
              <img
                src={uaiBadge}
                alt="Unreal Authorized Instructor 2026"
                className="h-full w-full object-contain"
              />
            </span>

            <span className="min-w-0 flex-1">
              <span className="mb-1.5 flex items-center gap-1.5 text-primary">
                <Award className="h-4 w-4" />
                <span className="font-display text-[9px] font-bold uppercase tracking-[0.22em]">
                  Статус 2026
                </span>
              </span>
              <strong className="block font-display text-[13px] uppercase leading-5 tracking-[0.09em] text-foreground">
                Unreal Authorized Instructor
              </strong>
              <span className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-2">
                <span>
                  <strong className="font-display text-base text-foreground">11 лет</strong>
                  <span className="ml-1.5 text-[9px] text-muted-foreground">в UE</span>
                </span>
                <span>
                  <strong className="font-display text-base text-foreground">6+ лет</strong>
                  <span className="ml-1.5 text-[9px] text-muted-foreground">в коммерции</span>
                </span>
              </span>
            </span>
          </span>
        </a>

        {/* Corner branding */}
        <Logo className="absolute right-10 top-10 z-20 rounded-xl border border-white/10 bg-background/35 px-4 py-2 text-3xl font-bold tracking-tighter shadow-xl shadow-black/25 backdrop-blur-md" />

        <a
          href="https://absolutemikhail.github.io/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Открыть портфолио Absolute Mikhail"
          className="group absolute bottom-10 left-10 z-20 flex flex-col items-start rounded-xl border border-white/5 bg-background/40 px-5 py-3 shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10 hover:shadow-primary/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          <p className="mb-2 text-[10px] font-black uppercase leading-none tracking-[0.4em] text-primary/80 transition-colors group-hover:text-primary">
            Production-портфолио
          </p>

          <div className="mb-2 h-px w-full bg-gradient-to-r from-primary/50 to-transparent" />

          <p className="font-display text-sm font-bold leading-none tracking-[0.092em] text-foreground/90 antialiased transition-colors group-hover:text-primary">
            absolutemikhail.github.io
          </p>
        </a>

        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent blur-3xl" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

export default OGSnippet;
