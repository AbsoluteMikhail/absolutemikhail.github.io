import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";

type AcademyImageLightboxProps = {
  alt: string;
  className?: string;
  imageClassName?: string;
  src: string;
};

export const AcademyImageLightbox = ({
  alt,
  className = "",
  imageClassName = "",
  src,
}: AcademyImageLightboxProps) => {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKeyDown);
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
      window.cancelAnimationFrame(focusFrame);
      previousFocus?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        aria-label={`${alt || "Изображение"} — увеличить`}
        className={`academy-image-link ${className}`}
        onClick={() => setOpen(true)}
        ref={triggerRef}
        type="button"
      >
        <img alt={alt} className={imageClassName} decoding="async" loading="lazy" src={src} />
        <span aria-hidden="true" className="academy-image-link__hint">
          <Maximize2 className="h-4 w-4" />
          Увеличить
        </span>
      </button>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="academy-lightbox"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                >
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    aria-labelledby={titleId}
                    aria-modal="true"
                    className="academy-lightbox__content"
                    exit={{ opacity: 0, scale: 0.94 }}
                    initial={{ opacity: 0, scale: 0.94 }}
                    onClick={(event) => event.stopPropagation()}
                    role="dialog"
                    transition={{ damping: 25, stiffness: 300, type: "spring" }}
                  >
                    <button
                      aria-label="Закрыть изображение"
                      className="academy-lightbox__close"
                      onClick={() => setOpen(false)}
                      ref={closeButtonRef}
                      type="button"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <img alt={alt} src={src} />
                    {alt ? <p id={titleId}>{alt}</p> : null}
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
};
