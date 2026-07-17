import { MaxIcon } from "@/components/SocialIcons";
import {
  decodeContactLink,
  encodedContactLinks,
} from "@/constants/contactLinks";

interface ProtectedSocialButtonProps {
  className: string;
  iconClassName?: string;
}

export const ProtectedSocialButton = ({
  className,
  iconClassName,
}: ProtectedSocialButtonProps) => {
  const handleClick = () => {
    window.open(
      decodeContactLink(encodedContactLinks.max),
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="MAX"
      title="MAX"
      className={className}
    >
      <MaxIcon className={iconClassName} />
    </button>
  );
};
