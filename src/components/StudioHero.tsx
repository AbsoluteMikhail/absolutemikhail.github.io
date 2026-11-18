import heroCollage from "@/assets/studio/hero-collage.webp";
import { DiscordIcon, TelegramIcon, TwitchIcon, VkIcon, YoutubeIcon } from "@/components/SocialIcons";
import { gamepunkLinks, telegramCommunityUrl } from "@/constants/contactLinks";
import { studioCopy } from "@/constants/studioCopy";
import type { StudioLocale } from "@/lib/studioLocale";

export function StudioHeroTitle({ locale }: { locale: StudioLocale }) {
  const [verb, games, character] = studioCopy[locale].hero;
  return (
    <h1 id="studio-title">
      <span className="studio-title-line"><span className="studio-title-highlight">{verb}</span></span>{" "}
      <span className="studio-title-line">{games}</span>{" "}
      <span className="studio-title-line">
        <span className="studio-title-marked">{character}
          <svg viewBox="0 0 600 24" preserveAspectRatio="none" fill="none" aria-hidden="true">
            <path d="M7 17C126 4 357 5 591 13" /><path d="M13 19C153 9 375 7 587 15" />
          </svg>
        </span>
      </span>
    </h1>
  );
}

const socialChannels = [
  { name: "Telegram", href: telegramCommunityUrl, icon: TelegramIcon },
  { name: "Discord", href: gamepunkLinks.discord, icon: DiscordIcon },
  { name: "VK", href: gamepunkLinks.vk, icon: VkIcon },
  { name: "Twitch", href: gamepunkLinks.twitch, icon: TwitchIcon },
  { name: "YouTube", href: gamepunkLinks.youtube, icon: YoutubeIcon },
];

export function StudioSocials({ locale }: { locale: StudioLocale }) {
  return (
    <nav className="studio-socials" aria-label={studioCopy[locale].socialLinks}>
      {socialChannels.map(({ name, href, icon: Icon }) => (
        <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name} title={name}>
          <Icon size={48} />
        </a>
      ))}
    </nav>
  );
}

export function StudioHeroCollage({ locale, className }: { locale: StudioLocale; className: string }) {
  const copy = studioCopy[locale];
  return (
    <div className={className}>
      <img className="studio-collage-art" src={heroCollage} width="1088" height="1440" alt={copy.collageAlt} {...{ fetchpriority: "high" }} />
      <span className="studio-character-sticker">
        {copy.characterSticker}<br />
        <small>{copy.releaseNote}</small>
      </span>
    </div>
  );
}
