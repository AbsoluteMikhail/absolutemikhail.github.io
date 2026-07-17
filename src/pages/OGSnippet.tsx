import { motion } from "framer-motion";
import { useEffect } from "react";
import heroPhoto from "@/assets/hero-photo.jpg";
import { DiscordIcon, SteamIcon, TelegramIcon, YoutubeIcon, TwitchIcon } from "@/components/SocialIcons";
import Logo from "@/components/Logo";
import { ProtectedSocialButton } from "@/components/ProtectedSocialButton";

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
              alt="Absolute Mikhail, инди-разработчик игр на Unreal Engine 5"
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
        <div className="relative z-10 h-full flex flex-col justify-center px-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-block mb-6 px-5 py-2 rounded-full border border-primary/40 bg-primary/10 w-fit"
          >
            <span className="text-sm font-display tracking-[0.3em] text-primary uppercase font-bold">
              Инди-разработчик • Unreal Engine
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-8xl font-display font-black leading-[0.9] mb-8 tracking-tight"
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
            <p className="text-2xl text-muted-foreground font-medium tracking-wide leading-snug">
              <span className="block">C++, Blueprint</span>
              <span className="block">игровые системы и архитектура</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            {[
              { icon: YoutubeIcon, label: "YouTube", href: "https://www.youtube.com/@Absolute-Unreal" },
              { icon: TwitchIcon, label: "Twitch", href: "https://www.twitch.tv/absolutemikhail" },
              { icon: DiscordIcon, label: "Discord-сообщество", href: "https://discord.gg/NkwZ8pqyS6" },
              { icon: SteamIcon, label: "Steam", href: "https://store.steampowered.com/developer/GamePunk-Studio" },
              { icon: TelegramIcon, label: "Telegram", href: "https://t.me/AbsoluteUnderground" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-16 h-16 rounded-2xl border border-border bg-card/40 backdrop-blur-md flex items-center justify-center text-muted-foreground shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:shadow-lg hover:shadow-primary/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <social.icon className="w-8 h-8" />
              </a>
            ))}
            <ProtectedSocialButton
              className="w-16 h-16 rounded-2xl border border-border bg-card/40 backdrop-blur-md flex items-center justify-center text-muted-foreground shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:shadow-lg hover:shadow-primary/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              iconClassName="w-8 h-8"
            />
          </motion.div>
        </div>

        {/* Bottom Bar / Branding */}
        <div className="absolute bottom-12 left-20 right-20 flex justify-between items-end z-20">
          <Logo className="text-3xl font-bold tracking-tighter" />

          {/* Твоя стеклянная карточка теперь на месте */}
          <a
            href="https://absolutemikhail.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Открыть портфолио Absolute Mikhail"
            className="group flex flex-col items-end bg-background/40 backdrop-blur-md px-5 py-3 rounded-xl border border-white/5 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10 hover:shadow-primary/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
              <p className="text-[10px] uppercase tracking-[0.4em] text-primary/80 mb-2 font-black leading-none transition-colors group-hover:text-primary">
              Портфолио разработчика
            </p>

            {/* Тонкая линия-разделитель в стиле UI игровых движков */}
            <div className="h-[1px] w-full bg-gradient-to-l from-primary/50 to-transparent mb-2" />

              <p className="text-sm font-display font-bold text-foreground/90 tracking-wider leading-none antialiased transition-colors group-hover:text-primary">
                  absolutemikhail.github.io
              </p>
          </a>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent blur-3xl" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

export default OGSnippet;
