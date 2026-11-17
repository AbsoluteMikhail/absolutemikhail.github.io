import { motionInitial } from "@/lib/motion";
import { useId, type ReactNode } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";
import "@/components/studio-surfaces.css";

interface LegalModalProps {
  studio?: boolean;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: ReactNode;
  closeLabel?: string;
  closeAriaLabel?: string;
}

const LegalModal = ({ isOpen, onClose, title, content, studio = false, closeLabel = "Закрыть", closeAriaLabel = "Закрыть документ" }: LegalModalProps) => {
  const titleId = useId();

  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledBy={titleId} className={studio ? "studio-dialog" : undefined}>
      <motion.div
        initial={motionInitial({ scale: 0.9, opacity: 0 })}
        animate={{ scale: 1, opacity: 1 }}
        className={cn("relative flex max-h-[80svh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-2xl [html.light_&]:bg-popover [html.light_&]:text-popover-foreground", studio && "studio-surface studio-settings-sheet")}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-border flex shrink-0 items-center justify-between gap-3 bg-secondary/30">
          <h2 id={titleId} className="min-w-0 break-words text-base sm:text-xl font-display font-bold uppercase tracking-wider text-primary">
            {title}
          </h2>
          <IconButton
            type="button"
            aria-label={closeAriaLabel}
            onClick={onClose}
            className="shrink-0"
          >
            <X className="w-4 h-4" />
          </IconButton>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8 overflow-y-auto leading-relaxed text-muted-foreground">
          <div className="space-y-6">
            {content}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 sm:p-6 shrink-0 border-t border-border bg-secondary/30 flex justify-end">
          <Button
            type="button"
            variant="subtle"
            size="none"
            onClick={onClose}
            className="px-6 py-2 text-sm"
          >
            {closeLabel}
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
};

export default LegalModal;
