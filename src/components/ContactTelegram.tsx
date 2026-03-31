import React from 'react';

interface ContactTelegramProps {
  className?: string;
  children?: React.ReactNode;
  message?: string;
}

export const ContactTelegram: React.FC<ContactTelegramProps> = ({ className, children, message }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const domain = 't.me';
    const user = 'AbsoluteMikhail';
    let url = `https://${domain}/${user}`;
    if (message) {
      url += `?text=${encodeURIComponent(message)}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className={className}
    >
      {children || 'Записаться'}
    </a>
  );
};
