import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import heroPhoto from "@/assets/hero-photo.jpg";
import uaiBadge from "@/assets/uai-badge-2026.png";
import InstructorBadgeCard from "@/components/InstructorBadgeCard";
import { buttonStyles } from "@/components/ui/button";
import { DiscordIcon, SteamIcon, TelegramIcon, YoutubeIcon, TwitchIcon } from "@/components/SocialIcons";

const HeroSection = () => {
  const trustCardRef = useRef<HTMLAnchorElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const trustCard = trustCardRef.current;
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
      trustCard?.style.removeProperty("opacity");
      trustCard?.style.removeProperty("transform");
      trustCard?.style.removeProperty("pointer-events");
    };
  }, [reduceMotion]);

  return (
    <section 
      id="about" 
      className="relative flex min-h-svh flex-col overflow-hidden bg-background pt-[72px] md:min-h-[850px] md:flex-row md:items-center md:pt-0 lg:min-h-svh"
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 0% 70%, hsl(var(--primary) / 0.14), transparent 55%),
          linear-gradient(225deg, rgba(255,255,255,0.01) 0%, transparent 20%)
        `
      }}
    >
      {/* Mobile: photo on top */}
      <div className="relative h-[42svh] min-h-[280px] max-h-[400px] w-full md:hidden">
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

      {/* Desktop: photo on the right */}
      <div 
        className="hidden md:block absolute top-[76px] right-0 bottom-0 w-[52%] pointer-events-none"
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
            alt="Михаил Ефремов, Senior Gameplay Programmer и Unreal Authorized Instructor"
            loading="eager"
            {...{ fetchpriority: "high" }}
            decoding="async"
            className="h-full w-full object-cover object-top"
            style={{ filter: 'brightness(0.9) contrast(1.1) saturate(0.8)' }}
          />
          {/* Gradients for smooth transition and depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/0 to-30%" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/0 to-background/0" />
          
          {/* Subtle Glow like in OG Snippet */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-full h-full bg-primary/5 blur-[100px] mix-blend-screen" />

        </motion.div>
      </div>

      {/* Desktop credential card: the supplied badge stays replaceable as one asset. */}
      <InstructorBadgeCard
        ref={trustCardRef}
        className="absolute bottom-12 right-8 z-20 hidden w-[390px] will-change-[transform,opacity] lg:block xl:right-12"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pb-12 pt-2 md:pb-24 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl md:max-w-[62%] lg:max-w-[60%]"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-7 border-l-2 border-primary pl-4"
          >
            <span className="mb-2 block font-display text-sm font-semibold uppercase tracking-[0.18em] text-foreground sm:text-base">
              Михаил Ефремов · Absolute Mikhail
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-primary sm:text-xs">
              Senior Gameplay Programmer · GamePunk Studio
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mb-6 font-display text-[clamp(1.5rem,7.6vw,2rem)] font-black leading-[1.15] tracking-tight sm:text-5xl md:mb-8 md:text-[clamp(2.4rem,4.9vw,4.7rem)]"
            style={{ textShadow: '0 0 40px rgba(0,0,0,0.5)' }}
          >
            <span className="gradient-text">ИГРЫ, КОД</span>
            <br />
            <span className="text-foreground">И МОЯ ИСТОРИЯ</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mb-6 max-w-lg md:mb-8"
          >
            <p className="text-base leading-relaxed text-foreground sm:text-lg md:text-xl">
              Делаю игры и делюсь опытом. Здесь — мои проекты, эксперименты и путь
              от первых прототипов до релизов.
            </p>
          </motion.div>

          <motion.a
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.6 }}
            href="https://credential.unrealengine.com/b0a726a2-6749-4f13-a1c9-8ebfcc3d6034"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Unreal Authorized Instructor — открыть официальный credential"
            className="mb-6 flex max-w-xl items-center gap-3 border-y border-border py-3 lg:hidden"
          >
            <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-white via-zinc-300 to-zinc-500 p-0.5">
              <img src={uaiBadge} alt="Unreal Authorized Instructor 2026" className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block font-display text-[9px] uppercase tracking-[0.2em] text-primary">Статус 2026</span>
              <strong className="mt-1 block font-display text-xs uppercase leading-5 tracking-[0.07em] text-foreground">
                Unreal Authorized Instructor
              </strong>
            </span>
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.82, duration: 0.7 }}
            className="mb-6 flex flex-wrap gap-3"
          >
            <a
              href="#games"
              className={buttonStyles({ className: "box-glow", size: "sm" })}
            >
              Смотреть игры
            </a>
            <a
              href="#timeline"
              className={buttonStyles({ variant: "outline", size: "sm" })}
            >
              Моя история
            </a>
            <a
              href="#mentoring"
              className={buttonStyles({ variant: "text", size: "none", className: "inline-flex min-h-11 items-center px-3 text-sm" })}
            >
              За менторингом →
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.92, duration: 0.6 }}
            className="mb-7 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
            20 игровых проектов · победы на Gamebox Hack и «Синеус» · выбор tinyBuild
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
