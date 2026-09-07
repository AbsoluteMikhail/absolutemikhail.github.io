import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
  returnFocusRef?: RefObject<HTMLElement>;
}

const Modal = ({ isOpen, onClose, labelledBy, children, className, returnFocusRef }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const fallbackFocus = returnFocusRef?.current;
    const previousOverflow = document.body.style.overflow;
    const wasModalOpen = document.body.classList.contains("modal-open");
    dialog.showModal();
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (!wasModalOpen) document.body.classList.remove("modal-open");
      // Mobile menu items disappear when they open the contact dialog.
      const target = previousFocus !== document.body && previousFocus?.isConnected && previousFocus.getClientRects().length
        ? previousFocus
        : fallbackFocus;
      target?.focus({ preventScroll: true });
    };
  }, [isOpen, returnFocusRef]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      aria-modal="true"
      className={cn(
        "fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-y-auto border-0 bg-transparent p-4 text-foreground outline-none open:flex open:items-center open:justify-center backdrop:bg-background/80 backdrop:backdrop-blur-sm",
        className,
      )}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
          'a[href], button, input, select, textarea, iframe, video[controls], audio[controls], [tabindex], [contenteditable="true"]',
        )).filter((element) => element.tabIndex >= 0 && !element.matches(":disabled")
          && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden");
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (!first) {
          event.preventDefault();
          return;
        }
        // Keep Tab inside the dialog instead of handing focus to browser chrome.
        if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {children}
    </dialog>,
    document.body,
  );
};

export default Modal;
