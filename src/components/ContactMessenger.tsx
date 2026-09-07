import { useId, useState, type ReactNode, type Ref, type RefObject } from "react";
import { motion } from "framer-motion";
import Modal from "@/components/ui/modal";
import { Button, type ButtonStyleProps } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Check, Mail, X } from "lucide-react";
import {
  DiscordIcon,
  MaxIcon,
  TelegramIcon,
} from "@/components/SocialIcons";
import {
  decodeContactLink,
  encodedDiscordUsername,
  encodedContactLinks,
} from "@/constants/contactLinks";

interface ContactMessengerProps extends ButtonStyleProps {
  children?: ReactNode;
  message?: string;
  onOpen?: () => void;
  buttonRef?: Ref<HTMLButtonElement>;
  returnFocusRef?: RefObject<HTMLElement>;
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

interface MessengerOptionProps {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  onClick: () => void;
  textClassName?: string;
}

const MessengerOption = ({ icon, title, description, onClick, textClassName }: MessengerOptionProps) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex w-full items-center gap-4 rounded-lg border-t border-border px-2 py-4 text-left transition-colors hover:bg-primary/5"
  >
    <span className="flex h-11 w-11 shrink-0 items-center justify-center text-primary">
      {icon}
    </span>
    <span className={textClassName}>
      <span className="block font-body text-base font-semibold text-foreground">
        {title}
      </span>
      <span className="mt-1 block text-xs text-muted-foreground">
        {description}
      </span>
    </span>
  </button>
);

export const ContactMessenger = ({
  className,
  children,
  message,
  onOpen,
  buttonRef,
  returnFocusRef,
  variant,
  size,
  effect,
}: ContactMessengerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [discordCopied, setDiscordCopied] = useState(false);
  const titleId = useId();

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
    const discordUsername = decodeContactLink(encodedDiscordUsername);
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
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      labelledBy={titleId}
      returnFocusRef={returnFocusRef}
      className="backdrop:bg-background/85 backdrop:backdrop-blur-md"
    >
      <motion.div
        className="relative max-h-[calc(100svh-2rem)] w-full max-w-sm overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl shadow-black/40"
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <IconButton
          type="button"
          variant="quiet"
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4"
          aria-label="Закрыть окно связи"
        >
          <X className="h-5 w-5" />
        </IconButton>

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
            <MessengerOption
              key={option.id}
              onClick={() => openMessenger(option.id)}
              icon={<option.icon className="h-6 w-6" />}
              title={option.label}
              description={option.description}
            />
          ))}

          <MessengerOption
            onClick={openDiscord}
            icon={<DiscordIcon className="h-6 w-6" />}
            title="Написать в Discord"
            textClassName="min-w-0 flex-1"
            description={discordCopied ? (
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <Check className="h-3 w-3" /> Ник скопирован
              </span>
            ) : (
              <>Профиль откроется после нажатия</>
            )}
          />

          <MessengerOption
            onClick={openEmail}
            icon={<Mail className="h-6 w-6" />}
            title="Написать по почте"
            description="Открыть почтовое приложение"
          />
        </div>

        <p className="mt-5 text-center text-[11px] leading-5 text-muted-foreground/70">
          Ссылки открываются только после вашего выбора — это снижает
          количество автоматического спама.
        </p>
      </motion.div>
    </Modal>
  );

  return (
    <>
      <Button
        ref={buttonRef}
        type="button"
        variant={variant}
        size={size}
        effect={effect}
        onClick={() => {
          onOpen?.();
          setDiscordCopied(false);
          setIsOpen(true);
        }}
        className={className}
      >
        {children || "Связаться"}
      </Button>
      {modal}
    </>
  );
};
