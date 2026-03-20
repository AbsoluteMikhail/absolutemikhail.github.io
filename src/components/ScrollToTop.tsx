import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Следим за тем, открыто ли модальное окно (через класс на body)
  useEffect(() => {
    const checkModal = () => {
      setIsModalOpen(document.body.classList.contains("modal-open"));
    };

    // Начальная проверка
    checkModal();

    // Наблюдатель за изменениями классов body
    const observer = new MutationObserver(checkModal);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  // Показываем кнопку, если прокрутили ниже hero-блока (около 100vh)
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    
    // Очистка хеша без перезагрузки
    if (window.location.hash) {
      window.history.pushState(
        "",
        document.title,
        window.location.pathname + window.location.search
      );
    }
  };

  return (
    <AnimatePresence>
      {isVisible && !isModalOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary backdrop-blur-md shadow-2xl shadow-primary/20 transition-all hover:bg-primary/20 hover:border-primary/40 group"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6 transition-transform group-hover:-translate-y-0.5" />
          <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
