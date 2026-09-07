import { useState, useEffect, useRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ContactMessenger } from "@/components/ContactMessenger";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const contactTriggerRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      menuButtonRef.current?.focus();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const navLinks = [
    { label: "Опыт", href: "#production" },
    { label: "Проекты", href: "#games" },
    { label: "Путь", href: "#timeline" },
    { label: "Менторинг", href: "#mentoring" },
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
            returnFocusRef={menuButtonRef}
            size="sm"
            className="hidden sm:block whitespace-nowrap"
          >
            Связаться
          </ContactMessenger>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors z-50"
            aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isOpen}
            aria-controls={menuId}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={menuId}
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
              <Button
                type="button"
                size="menu"
                effect="none"
                onClick={() => {
                  setIsOpen(false);
                  contactTriggerRef.current?.click();
                }}
                className="mt-2 text-center"
              >
                Связаться
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
