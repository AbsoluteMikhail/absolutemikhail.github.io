import React from 'react';

interface ContactTelegramProps {
  className?: string;
  children?: React.ReactNode;
}

export const ContactTelegram: React.FC<ContactTelegramProps> = ({ className, children }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const domain = 't.me';
    const user = 'AbsoluteMikhail';
    window.open(`https://${domain}/${user}`, '_blank', 'noopener,noreferrer');
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
