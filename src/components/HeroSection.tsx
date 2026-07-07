import { motion } from "framer-motion";
import { Building2, CheckCircle2, Film, GraduationCap, Trophy } from "lucide-react";
import heroPhoto from "@/assets/hero-photo.jpg";
import { DiscordIcon, SteamIcon, TelegramIcon, YoutubeIcon, TwitchIcon } from "@/components/SocialIcons";

const trustItems = [
  { icon: Trophy, label: "Gamebox Hack Winner" },
  { icon: Film, label: "Golden Eagle VFX" },
  { icon: GraduationCap, label: "Автор курса UE C++" },
  { icon: Building2, label: "Skolkovo Resident" },
];

const HeroSection = () => {
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
      <div className="relative w-full h-[60vh] md:hidden">
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          src={heroPhoto}
          alt="Absolute Mikhail, ментор по Unreal Engine 5 и C++"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-[center_20%]"
          style={{ filter: 'brightness(0.9) contrast(1.1) saturate(0.8)' }}
        />
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
            alt="Absolute Mikhail, ментор по Unreal Engine 5 и C++"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center"
            style={{ filter: 'brightness(0.9) contrast(1.1) saturate(0.8)' }}
          />
          {/* Gradients for smooth transition and depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/0 to-30%" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/0 to-background/0" />
          
          {/* Subtle Glow like in OG Snippet */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-full h-full bg-primary/5 blur-[100px] mix-blend-screen" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="absolute bottom-24 right-8 w-72 rounded-2xl border border-white/10 bg-background/45 p-5 shadow-2xl shadow-black/30 backdrop-blur-md lg:right-12"
          >
            <div className="space-y-3">
              {trustItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-display text-xs font-bold uppercase tracking-[0.14em] text-foreground/90">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-10 md:py-20">
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
            className="inline-block mb-4 px-5 py-2 rounded-full border border-primary/40 bg-primary/10"
          >
            <span className="block text-sm font-display tracking-[0.3em] text-primary uppercase font-bold">
              Gameplay Programmer
            </span>
            <span className="mt-1 block text-sm font-display tracking-[0.3em] text-primary uppercase font-bold">
              Indie Developer
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-5xl md:text-7xl font-display font-black leading-tight mb-6 tracking-tight"
            style={{ textShadow: '0 0 40px rgba(0,0,0,0.5)' }}
          >
            <span className="text-foreground">ДОВЕДИ </span>
            <span className="gradient-text">UNREAL</span>
            <br />
            <span className="text-foreground">ПРОЕКТ</span>
            <br />
            <span className="text-foreground">ДО РЕЛИЗА</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mb-8 max-w-xl space-y-3"
          >
            <p className="text-lg leading-relaxed text-foreground md:text-xl">
              Помогаю Blueprint и C++ разработчикам доводить проекты до релиза
              без архитектурного хаоса.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              Разбираем gameplay systems, архитектуру, оптимизацию и самые
              сложные технические проблемы проекта.
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
              Обсудить менторинг
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
            className="flex gap-3"
          >
            {[
              { icon: YoutubeIcon, href: "https://www.youtube.com/@Absolute-Unreal", label: "YouTube" },
              { icon: TwitchIcon, href: "https://www.twitch.tv/absolutemikhail", label: "Twitch" },
              { icon: DiscordIcon, href: "https://discord.gg/NkwZ8pqyS6", label: "Discord" },
              { icon: TelegramIcon, href: "https://t.me/AbsoluteUnderground", label: "Telegram" },
              { icon: SteamIcon, href: "https://store.steampowered.com/developer/GamePunk-Studio", label: "Steam" },
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
