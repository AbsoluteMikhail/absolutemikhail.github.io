import { motion } from "framer-motion";
import { useEffect } from "react";
import heroPhoto from "@/assets/hero-photo.jpg";
import { DiscordIcon, SteamIcon, TelegramIcon, YoutubeIcon, TwitchIcon } from "@/components/SocialIcons";
import Logo from "@/components/Logo";

const OGSnippet = () => {
  useEffect(() => {
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
        className="relative bg-background overflow-hidden border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex-shrink-0"
        style={{
          width: '1200px',
          height: '630px',
          transform: 'scale(var(--snippet-scale, 1))',
        }}
      >
        {/* ============================================================================== */}
        {/* ВАРИАНТ 1: Очищенный блок фото с использованием CSS Mask */}
        {/* ============================================================================== */}
        <div
            className="absolute top-0 right-0 h-full w-[65%] pointer-events-none"
            style={{
              // Маска делает левый край плавно прозрачным, убирая любые полосы.
              maskImage: 'linear-gradient(to right, transparent 0%, black 40%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 40%)'
            }}
        >
          <img
              src={heroPhoto}
              alt="Absolute Mikhail"
              // Оставляем твои настройки картинки
              className="absolute inset-0 h-full w-full object-cover object-top scale-[1.05] translate-x-[5%]"
          />

          {/* Убираем левый градиент-наплыв (он больше не нужен поверх маски) */}

          {/* Оставляем ТОЛЬКО нижний и верхний градиенты, чтобы сохранить плавность снизу */}
          {/* Снизу (подредактированный для плавности) */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent to-30%" />
          {/* Сверху */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-transparent" />

          {/* Свечение */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-full h-full bg-primary/5 blur-[100px]" />
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
              Game Developer & UE5 Mentor
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-8xl font-display font-black leading-[0.9] mb-8 tracking-tighter"
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
            <p className="text-2xl text-muted-foreground font-medium tracking-wide">
              Создаю миры, которые захватывают дух
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            {[
              { icon: YoutubeIcon, label: "YouTube" },
              { icon: TwitchIcon, label: "Twitch" },
              { icon: TelegramIcon, label: "Telegram" },
              { icon: DiscordIcon, label: "Discord" },
              { icon: SteamIcon, label: "Steam" },
            ].map((social, i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-2xl border border-border bg-card/40 backdrop-blur-md flex items-center justify-center text-muted-foreground shadow-xl"
              >
                <social.icon className="w-8 h-8" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Bar / Branding */}
        <div className="absolute bottom-12 left-20 right-20 flex justify-between items-end">
          <Logo className="text-3xl font-bold tracking-tighter" />
          
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-1">
              Official Portfolio
            </p>
            <p className="text-sm font-display font-bold text-foreground/80">
              absolutemikhail.github.io
            </p>
          </div>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent blur-3xl" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[120px]" />
      </div>
      
      {/* 
        Floating info for the user taking the screenshot 
      */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-md border border-border px-6 py-3 rounded-full text-xs text-muted-foreground pointer-events-none">
        Разрешение контейнера выше: <span className="text-primary font-bold">1200 x 630 px</span> (1.91:1)
      </div>
    </div>
  );
};

export default OGSnippet;
