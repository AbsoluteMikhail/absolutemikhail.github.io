import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import heroPhoto from "@/assets/hero-photo.jpg";
import uaiBadge from "@/assets/uai-badge-2026.png";
import InstructorBadgeCard from "@/components/InstructorBadgeCard";
import { buttonStyles } from "@/components/ui/button";
import { DiscordIcon, SteamIcon, TelegramIcon, YoutubeIcon, TwitchIcon } from "@/components/SocialIcons";

const HeroSection = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section 
      id="about" 
      className="relative flex flex-col overflow-hidden bg-background pt-[72px] md:min-h-[760px] md:flex-row md:items-center md:pt-0 lg:min-h-[min(900px,100svh)]"
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 0% 70%, hsl(var(--primary) / 0.14), transparent 55%),
          linear-gradient(225deg, rgba(255,255,255,0.01) 0%, transparent 20%)
        `
      }}
    >
      {/* Mobile: photo on top */}
      <div className="relative h-[28svh] min-h-[200px] max-h-[260px] w-full md:hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="h-full w-full"
        >
          <img
            src={heroPhoto}
            alt="Михаил Ефремов, Senior Gameplay Programmer и Unreal Authorized Instructor"
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

      {/* Keep the small source portrait within 2× its native size and the content container. */}
      <div 
        className="pointer-events-none absolute right-[max(0px,calc((100%-1400px)/2))] top-[76px] hidden aspect-[292/363] max-h-[calc(100%-76px)] w-[52%] max-w-[584px] md:block"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 35%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 35%, black 85%, transparent 100%)'
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
            alt="Михаил Ефремов, Senior Gameplay Programmer и Unreal Authorized Instructor"
            loading="eager"
            {...{ fetchpriority: "high" }}
            decoding="async"
            className="h-full w-full object-cover object-[center_15%]"
            style={{ filter: 'brightness(0.9) contrast(1.1) saturate(0.8)' }}
          />
          {/* Gradients for smooth transition and depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/0 to-30%" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/0 to-background/0" />
          
          {/* Subtle Glow like in OG Snippet */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-full h-full bg-primary/5 blur-[100px] mix-blend-screen [html.light_&]:mix-blend-normal" />

        </motion.div>
      </div>

      {/* Desktop credential card: the supplied badge stays replaceable as one asset. */}
      <InstructorBadgeCard
        className="absolute bottom-10 right-8 z-20 hidden w-[340px] lg:block xl:right-[max(48px,calc((100%-1400px)/2+48px))]"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pb-10 pt-2 md:pb-24 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl md:max-w-[58%] lg:max-w-[60%]"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-5 border-l-2 border-primary pl-4 md:mb-7"
          >
            <span className="mb-2 block font-display text-sm font-semibold uppercase tracking-[0.18em] text-foreground sm:text-base">
              <span className="block md:inline">Михаил Ефремов</span>
              <span className="hidden md:inline"> · </span>
              <span className="mt-1 block md:mt-0 md:inline">Absolute Mikhail</span>
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-primary sm:text-xs">
              <span className="block md:inline">Senior Gameplay Programmer</span>
              <span className="hidden md:inline"> · </span>
              <span className="mt-1 block md:mt-0 md:inline">GamePunk Studio</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="hero-heading-shadow mb-5 font-display text-[clamp(1.6rem,7.2vw,3rem)] font-black leading-[1.12] tracking-tight md:mb-7 md:text-[clamp(2rem,4vw,3.8rem)]"
          >
            <span className="block gradient-text">ДЕЛАЮ ИГРЫ</span>
            <span className="block text-foreground">ДЕЛЮСЬ ОПЫТОМ</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mb-4 max-w-lg md:mb-8"
          >
            <p className="text-base leading-relaxed text-foreground sm:text-lg md:text-xl">
              Разрабатываю игры на Unreal Engine. Помогаю с C++, Blueprint
              и архитектурой — в статьях и на личных занятиях.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.7 }}
            className="mb-4 grid grid-cols-2 items-center gap-3 sm:flex sm:flex-wrap md:mb-6"
          >
            <a
              href="#games"
              className={buttonStyles({ className: "box-glow px-3 text-[10px] sm:px-5 sm:text-xs", size: "sm" })}
            >
              Смотреть игры
            </a>
            <a
              href="#academy"
              className={buttonStyles({ variant: "outline", size: "sm", className: "px-3 text-[10px] sm:px-5 sm:text-xs" })}
            >
              Изучать Unreal
            </a>
            <a
              href="#mentoring"
              className={buttonStyles({ variant: "text", size: "none", className: "col-span-2 inline-flex min-h-11 items-center px-3 text-sm" })}
            >
              Обсудить задачу →
            </a>
          </motion.div>

          <motion.a
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.82, duration: 0.6 }}
            href="https://credential.unrealengine.com/b0a726a2-6749-4f13-a1c9-8ebfcc3d6034"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Unreal Authorized Instructor — открыть официальный credential"
            className="mb-4 flex max-w-xl items-center gap-3 border-y border-border py-2.5 lg:hidden"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-white via-zinc-300 to-zinc-500 p-0.5">
              <img src={uaiBadge} alt="Unreal Authorized Instructor 2026" className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block font-display text-[9px] uppercase tracking-[0.2em] text-primary">Статус 2026</span>
              <strong className="mt-1 block font-display text-xs uppercase leading-5 tracking-[0.07em] text-foreground">
                Unreal Authorized Instructor
              </strong>
            </span>
          </motion.a>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.92, duration: 0.6 }}
            className="mb-5 flex flex-col gap-2 text-sm text-muted-foreground sm:gap-1.5 md:mb-7"
          >
            <span className="inline-flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              С 2015 года в Unreal Engine · 20 игровых проектов
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-wrap gap-1 sm:gap-2"
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
                className="flex h-14 w-14 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <social.icon className="h-10 w-10" />
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
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
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
