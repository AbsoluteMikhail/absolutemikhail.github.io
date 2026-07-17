import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ContactMessenger } from "@/components/ContactMessenger";
import Logo from "@/components/Logo";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const contactTriggerRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const navLinks = [
    { label: "Форматы", href: "#mentoring" },
    { label: "Отзывы", href: "#mentee-reviews" },
    { label: "Проекты", href: "#games" },
    { label: "Опыт", href: "#timeline" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? "bg-background/95 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Logo
          className="font-display text-xl font-bold text-foreground z-50"
        />

        {/* Desktop Navigation */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-6 mr-4 md:flex lg:gap-8">
            {navLinks.map((link) => (
              isHomePage ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-display tracking-wider uppercase text-foreground/70 hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={`/${link.href.startsWith("#") ? link.href : ""}`}
                  className="text-sm font-display tracking-wider uppercase text-foreground/70 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          <ContactMessenger
            buttonRef={contactTriggerRef}
            className="hidden sm:block px-5 py-2 rounded-lg text-xs font-display tracking-wider uppercase gradient-primary text-primary-foreground font-semibold hover:scale-105 transition-transform whitespace-nowrap"
          >
            Связаться
          </ContactMessenger>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors z-50"
            aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                isHomePage ? (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-display tracking-widest uppercase text-foreground/80 hover:text-primary transition-colors py-2"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={`/${link.href.startsWith("#") ? link.href : ""}`}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-display tracking-widest uppercase text-foreground/80 hover:text-primary transition-colors py-2"
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  contactTriggerRef.current?.click();
                }}
                className="mt-2 px-5 py-4 rounded-lg text-center text-sm font-display tracking-wider uppercase gradient-primary text-primary-foreground font-semibold"
              >
                Связаться
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
