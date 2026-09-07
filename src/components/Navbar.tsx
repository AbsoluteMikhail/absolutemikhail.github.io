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
    { label: "Работа", href: "#production" },
    { label: "Игры", href: "#games" },
    { label: "История", href: "#timeline" },
    { label: "Академия", href: "/academy" },
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
          : "bg-background/65 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Logo
          className="font-display text-xl font-bold text-foreground z-50"
        />

        {/* Desktop Navigation */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-8 mr-2 lg:flex">
            {navLinks.map((link) => (
              isHomePage && link.href.startsWith("#") ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs font-display tracking-wider uppercase text-foreground/80 hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href.startsWith("#") ? `/${link.href}` : link.href}
                  className="text-xs font-display tracking-wider uppercase text-foreground/80 hover:text-primary transition-colors"
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
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors z-50"
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
            className="lg:hidden max-h-[calc(100svh-76px)] overflow-y-auto bg-background border-b border-border"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                isHomePage && link.href.startsWith("#") ? (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-xl font-display tracking-wider uppercase text-foreground hover:text-primary transition-colors border-b border-border py-4"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href.startsWith("#") ? `/${link.href}` : link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-xl font-display tracking-wider uppercase text-foreground hover:text-primary transition-colors border-b border-border py-4"
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
