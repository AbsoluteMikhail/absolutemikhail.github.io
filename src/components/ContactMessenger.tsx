import { motionInitial } from "@/lib/motion";
import { trackAnalytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import "@/components/studio-surfaces.css";
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
  studio?: boolean;
  analyticsPlacement?: "header" | "contact";
  locale?: "ru" | "en";
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
  studio = false,
  analyticsPlacement,
  locale = "ru",
  children,
  message,
  onOpen,
  buttonRef,
  returnFocusRef,
  variant,
  size,
  effect,
}: ContactMessengerProps) => {
  const en = locale === "en";
  const [isOpen, setIsOpen] = useState(false);
  const [discordCopied, setDiscordCopied] = useState(false);
  const titleId = useId();

  const openMessenger = (messenger: "max" | "telegram") => {
    if (analyticsPlacement) trackAnalytics("contact_select", { placement: analyticsPlacement, contact_method: messenger });
    const baseUrl = decodeContactLink(encodedContactLinks[messenger]);
    const url =
      messenger === "telegram" && message
        ? `${baseUrl}?text=${encodeURIComponent(message)}`
        : baseUrl;

    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const openDiscord = () => {
    if (analyticsPlacement) trackAnalytics("contact_select", { placement: analyticsPlacement, contact_method: "discord" });
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
    if (analyticsPlacement) trackAnalytics("contact_select", { placement: analyticsPlacement, contact_method: "email" });
    window.location.href = decodeContactLink(encodedContactLinks.email);
    setIsOpen(false);
  };

  const modal = (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      labelledBy={titleId}
      returnFocusRef={returnFocusRef}
      className={cn("backdrop:bg-background/85 backdrop:backdrop-blur-md", studio && "studio-dialog")}
    >
      <motion.div
        className={cn("relative max-h-[calc(100svh-2rem)] w-full max-w-sm overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl shadow-black/40 [html.light_&]:shadow-foreground/20", studio && "studio-surface studio-contact-sheet")}
        initial={motionInitial({ opacity: 0, y: 18, scale: 0.96 })}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <IconButton
          type="button"
          variant="quiet"
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4"
          aria-label={en ? "Close contact options" : "Закрыть окно связи"}
        >
          <X className="h-5 w-5" />
        </IconButton>

        <div className="pr-10">
          <h2 id={titleId} className="font-display text-2xl font-bold">
            {en ? "How would you like to get in touch?" : "Где вам удобнее?"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {en ? "Choose a way to reach us — Mikhail will reply personally." : "Выберите удобный способ связи — отвечу лично."}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {messengerOptions.map((option) => (
            <MessengerOption
              key={option.id}
              onClick={() => openMessenger(option.id)}
              icon={<option.icon className="h-6 w-6" />}
              title={en ? `Message on ${option.id === "max" ? "MAX" : "Telegram"}` : option.label}
              description={en ? (option.id === "max" ? "Open a personal profile" : "Open a private chat") : option.description}
            />
          ))}

          <MessengerOption
            onClick={openDiscord}
            icon={<DiscordIcon className="h-6 w-6" />}
            title={en ? "Message on Discord" : "Написать в Discord"}
            textClassName="min-w-0 flex-1"
            description={discordCopied ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 [html.light_&]:text-emerald-800">
                <Check className="h-3 w-3" /> {en ? "Username copied" : "Ник скопирован"}
              </span>
            ) : (
              <>{en ? "Click to open the profile" : "Профиль откроется после нажатия"}</>
            )}
          />

          <MessengerOption
            onClick={openEmail}
            icon={<Mail className="h-6 w-6" />}
            title={en ? "Send an email" : "Написать по почте"}
            description={en ? "Open your email app" : "Открыть почтовое приложение"}
          />
        </div>

        <p className="mt-5 text-center text-[11px] leading-5 text-muted-foreground/70">
          {en ? "Contact links are revealed only when you choose an option to help reduce automated spam." : "Ссылки открываются только после вашего выбора — это снижает количество автоматического спама."}
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
          if (analyticsPlacement) trackAnalytics("contact_open", { placement: analyticsPlacement });
          onOpen?.();
          setDiscordCopied(false);
          setIsOpen(true);
        }}
        className={className}
      >
        {children || (en ? "Contact" : "Связаться")}
      </Button>
      {modal}
    </>
  );
};
