import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

const LegalModal = ({ isOpen, onClose, title, content }: LegalModalProps) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open");
    } else {
      document.body.style.overflow = "unset";
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-2xl w-full bg-card border border-border rounded-2xl overflow-hidden flex flex-col max-h-[80vh] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
              <h3 className="text-xl font-display font-bold uppercase tracking-wider text-primary">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center text-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto leading-relaxed text-muted-foreground">
              <div className="space-y-6">
                {content}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-secondary/30 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-secondary text-sm font-display tracking-wider uppercase text-foreground hover:bg-primary/20 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LegalModal;
