import { Link, useLocation } from "react-router-dom";

interface LogoProps {
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const Logo = ({ className, onClick }: LogoProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleClick = (e: React.MouseEvent) => {
    if (isHomePage) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      // Очистка хеша без перезагрузки страницы
      if (window.location.hash) {
        window.history.pushState(
          "",
          document.title,
          window.location.pathname + window.location.search
        );
      }
    }
    
    // Вызываем переданный onClick, если он есть
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link
      to="/"
      onClick={handleClick}
      className={className}
    >
      <span className="text-primary">&lt;</span>DEV<span className="text-primary">/&gt;</span>
    </Link>
  );
};

export default Logo;
