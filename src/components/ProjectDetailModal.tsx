import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ChevronRight, ChevronLeft, Play } from "lucide-react";
import { useState, useEffect, useId, useRef } from "react";
import { Project } from "@/constants/projects";
import ProjectStatusIcon from "@/components/ProjectStatusIcon";

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailModal = ({ project, isOpen, onClose }: ProjectDetailModalProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKeyDown);
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
      window.cancelAnimationFrame(focusFrame);
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) return;
    setCurrentSlide(0);
    setIsVideoPlaying(false);
  }, [isOpen]);

  useEffect(() => {
    setIsVideoPlaying(false);
  }, [currentSlide]);

  if (!project) return null;

  const getSlides = (p: Project) => [
    { type: "video", url: p.videoUrl },
    ...p.screenshots.map((s) => ({ type: "image", url: s })),
  ];

  const slides = getSlides(project);
  const storeLinks = project.storeLinks ?? (
    project.storeUrl
      ? [{ label: "Смотреть проект", url: project.storeUrl }]
      : []
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Закрыть описание проекта"
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center text-foreground hover:bg-primary/20 hover:text-primary transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Carousel */}
            <div className="relative group/carousel bg-black aspect-video flex-shrink-0 z-10 shadow-xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    const threshold = 50;
                    if (info.offset.x < -threshold) {
                      setCurrentSlide((prev) => (prev + 1) % slides.length);
                    } else if (info.offset.x > threshold) {
                      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
                    }
                  }}
                  className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
                >
                  {slides[currentSlide].type === "video" ? (
                    <div className="relative w-full h-full">
                      {isVideoPlaying ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={slides[currentSlide].url}
                          title={`Видео проекта ${project.title}`}
                          style={{ border: "none" }}
                          loading="lazy"
                          allow="clipboard-write; autoplay"
                          allowFullScreen
                        />
                      ) : (
                        <button
                          type="button"
                          aria-label={`Воспроизвести видео проекта ${project.title}`}
                          className="relative w-full h-full cursor-pointer group/play"
                          onClick={() => setIsVideoPlaying(true)}
                        >
                          <img
                            src={project.cover}
                            alt={`Видео-превью проекта ${project.title}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover brightness-50 group-hover/play:brightness-75 transition-all"
                          />
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-20 h-20 rounded-full bg-primary/80 flex items-center justify-center text-white group-hover/play:scale-110 transition-transform box-glow">
                              <Play className="w-10 h-10 fill-current ml-1" />
                            </span>
                          </span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <img
                      src={slides[currentSlide].url}
                      alt={`Скриншот проекта ${project.title}, кадр ${currentSlide}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                type="button"
                aria-label="Предыдущий кадр"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white md:opacity-0 md:group-hover/carousel:opacity-100 opacity-100 transition-all hover:bg-primary/50 z-20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                aria-label="Следующий кадр"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide((prev) => (prev + 1) % slides.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white md:opacity-0 md:group-hover/carousel:opacity-100 opacity-100 transition-all hover:bg-primary/50 z-20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Открыть кадр ${idx + 1} из ${slides.length}`}
                    aria-current={idx === currentSlide ? "true" : undefined}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentSlide ? "bg-primary w-4" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-x-hidden overflow-y-auto p-5 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <span className="px-3 py-1 rounded-full gradient-primary text-xs font-display text-primary-foreground tracking-wider uppercase">
                  {project.genre}
                </span>
                <span className="text-sm text-muted-foreground">{project.year}</span>
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <ProjectStatusIcon status={project.stats} className="h-4 w-4" />
                  {project.stats}
                </span>
              </div>

              <h2 id={titleId} className="text-3xl md:text-4xl font-display font-bold text-foreground">
                {project.title}
              </h2>

              <div className="text-muted-foreground leading-relaxed text-lg">
                {project.fullDesc.split("\n").map((line, idx) => {
                  const trimmed = line.trim();
                  if (!trimmed) return <div key={idx} className="h-2" />;
                  if (trimmed.startsWith("—")) {
                    return (
                      <div key={idx} className="flex gap-3 pl-4 mb-2 last:mb-0">
                        <span className="text-primary font-bold">—</span>
                        <span>{trimmed.slice(1).trim()}</span>
                      </div>
                    );
                  }
                  if (trimmed.endsWith(":")) {
                    return (
                      <div key={idx} className="text-foreground font-bold mt-6 mb-3 first:mt-0 last:mb-0">
                        {trimmed}
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className="mb-2 last:mb-0">
                      {trimmed}
                    </p>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-2 pt-4">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-4 py-2 rounded-lg bg-secondary text-sm text-secondary-foreground font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {storeLinks.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 pt-6">
                  {storeLinks.map((store) => (
                    <a
                      key={store.url}
                      href={store.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-xl px-8 py-4 gradient-primary font-display text-sm uppercase tracking-wider text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/20"
                    >
                      {store.label}
                      <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetailModal;
