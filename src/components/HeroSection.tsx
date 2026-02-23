import { motion } from "framer-motion";
import heroPhoto from "@/assets/hero-photo.jpg";
import { Youtube, MessageCircle, Send, Gamepad2, Twitch } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col md:flex-row md:items-center overflow-hidden bg-background">
      {/* Mobile: photo on top */}
      <div className="relative w-full h-[60vh] md:hidden">
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          src={heroPhoto}
          alt="Game Developer"
          className="w-full h-full object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
      </div>

      {/* Desktop: photo on the right */}
      <div className="hidden md:block absolute top-0 right-0 h-full w-[50%] lg:w-[45%]">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative h-full w-full"
        >
          <img
            src={heroPhoto}
            alt="Game Developer"
            className="h-full w-full object-cover object-center"
          />
          {/* Gradients for smooth transition */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-transparent" />
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
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10"
          >
            <span className="text-sm font-display tracking-widest text-primary uppercase">
              Game Developer
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6"
          >
            <span className="text-foreground">СОЗДАЮ</span>
            <br />
            <span className="gradient-text">ИГРОВЫЕ</span>
            <br />
            <span className="text-foreground">МИРЫ</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed"
          >
            Разработчик видеоигр с многолетним опытом. Создаю уникальные игровые
            миры, которые захватывают воображение и дарят незабываемые эмоции.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="flex gap-4 mb-8"
          >
            <a
              href="#games"
              className="px-8 py-3 rounded-lg font-display text-sm tracking-wider uppercase gradient-primary text-primary-foreground font-semibold box-glow hover:scale-105 transition-transform"
            >
              Мои игры
            </a>
            <a
              href="#timeline"
              className="px-8 py-3 rounded-lg font-display text-sm tracking-wider uppercase border border-border text-foreground hover:border-primary/50 hover:text-primary transition-colors"
            >
              Достижения
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7 }}
            className="flex gap-3"
          >
            {[
              { icon: Youtube, href: "https://www.youtube.com/@Absolute-Unreal", label: "YouTube" },
              { icon: Twitch, href: "https://www.twitch.tv/absolutemikhail", label: "Twitch" },
              { icon: MessageCircle, href: "https://discord.gg/NkwZ8pqyS6", label: "Discord" },
              { icon: Send, href: "https://t.me/AbsoluteUnderground", label: "Telegram" },
              { icon: Gamepad2, href: "https://store.steampowered.com/developer/GamePunk-Studio", label: "Steam" },
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
