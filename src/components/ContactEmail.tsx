import React from 'react';

interface ContactEmailProps {
  className?: string;
  children?: React.ReactNode;
}

export const ContactEmail: React.FC<ContactEmailProps> = ({ className, children }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const user = 'ruage';
    const domain = 'vk.com';
    window.location.href = `mailto:${user}@${domain}`;
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className={className}
    >
      {children || 'Написать'}
    </a>
  );
};
