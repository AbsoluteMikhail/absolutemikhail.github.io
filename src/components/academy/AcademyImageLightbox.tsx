import { useRef } from "react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        aria-label={`${alt || "Изображение"} — увеличить`}
        className={`academy-image-link ${className}`}
        onClick={open}
        type="button"
      >
        <img
          alt={alt}
          className={imageClassName}
          decoding="async"
          loading="lazy"
          src={src}
        />
        <span aria-hidden="true" className="academy-image-link__hint">
          <Maximize2 className="h-4 w-4" />
          Увеличить
        </span>
      </button>

      <dialog
        aria-label={alt || "Просмотр изображения"}
        className="academy-lightbox"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        ref={dialogRef}
      >
        <div className="academy-lightbox__content">
          <button aria-label="Закрыть изображение" className="academy-lightbox__close" onClick={close} type="button">
            <X className="h-5 w-5" />
          </button>
          <img alt={alt} src={src} />
          {alt ? <p>{alt}</p> : null}
        </div>
      </dialog>
    </>
  );
};
