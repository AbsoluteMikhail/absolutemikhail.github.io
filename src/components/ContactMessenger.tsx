import { useEffect, useId, useState, type ReactNode, type Ref } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Mail, X } from "lucide-react";
import {
  DiscordIcon,
  MaxIcon,
  TelegramIcon,
} from "@/components/SocialIcons";
import {
  decodeContactLink,
  discordUsername,
  encodedContactLinks,
} from "@/constants/contactLinks";

interface ContactMessengerProps {
  className?: string;
  children?: ReactNode;
  message?: string;
  onOpen?: () => void;
  buttonRef?: Ref<HTMLButtonElement>;
}

const messengerOptions = [
  {
    id: "telegram",
    label: "Написать в Telegram",
    description: "Открыть личный чат",
    icon: TelegramIcon,
  },
  {
    id: "max",
    label: "Написать в MAX",
    description: "Открыть личный профиль",
    icon: MaxIcon,
  },
] as const;

export const ContactMessenger = ({
  className,
  children,
  message,
  onOpen,
  buttonRef,
}: ContactMessengerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [discordCopied, setDiscordCopied] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const openMessenger = (messenger: "max" | "telegram") => {
    const baseUrl = decodeContactLink(encodedContactLinks[messenger]);
    const url =
      messenger === "telegram" && message
        ? `${baseUrl}?text=${encodeURIComponent(message)}`
        : baseUrl;

    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const openDiscord = () => {
    void navigator.clipboard
      .writeText(discordUsername)
      .then(() => setDiscordCopied(true))
      .catch(() => setDiscordCopied(false));
    window.open(
      decodeContactLink(encodedContactLinks.discordProfile),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const openEmail = () => {
    window.location.href = decodeContactLink(encodedContactLinks.email);
    setIsOpen(false);
  };

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/85 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative max-h-[calc(100svh-2rem)] w-full max-w-sm overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl shadow-black/40"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Закрыть окно связи"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="pr-10">
              <h2 id={titleId} className="font-display text-2xl font-bold">
                Где вам удобнее?
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Выберите удобный способ связи — отвечу лично.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {messengerOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => openMessenger(option.id)}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-background/50 p-4 text-left transition-all hover:border-primary/50 hover:bg-primary/5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary/10">
                    <option.icon className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                      {option.label}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  </span>
                </button>
              ))}

              <button
                type="button"
                onClick={openDiscord}
                className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-background/50 p-4 text-left transition-all hover:border-primary/50 hover:bg-primary/5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary/10">
                  <DiscordIcon className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                    Написать в Discord
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {discordCopied ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400">
                        <Check className="h-3 w-3" /> Ник скопирован
                      </span>
                    ) : (
                      <>Открыть профиль @{discordUsername}</>
                    )}
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={openEmail}
                className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-background/50 p-4 text-left transition-all hover:border-primary/50 hover:bg-primary/5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary/10">
                  <Mail className="h-6 w-6" />
                </span>
                <span>
                  <span className="block font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                    Написать по почте
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Открыть почтовое приложение
                  </span>
                </span>
              </button>
            </div>

            <p className="mt-5 text-center text-[11px] leading-5 text-muted-foreground/70">
              Ссылки открываются только после вашего выбора — это снижает
              количество автоматического спама.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          onOpen?.();
          setDiscordCopied(false);
          setIsOpen(true);
        }}
        className={className}
      >
        {children || "Связаться"}
      </button>
      {typeof document !== "undefined" && createPortal(modal, document.body)}
    </>
  );
};
