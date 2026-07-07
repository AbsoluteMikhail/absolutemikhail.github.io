import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ChevronRight, ChevronLeft, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { Project } from "@/constants/projects";

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailModal = ({ project, isOpen, onClose }: ProjectDetailModalProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Сбрасываем слайд при смене проекта или закрытии и блокируем прокрутку
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    }
    
    if (!isOpen) {
      setCurrentSlide(0);
      setIsVideoPlaying(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    };
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-4xl w-full bg-card border border-border rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
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
                          style={{ border: "none" }}
                          loading="lazy"
                          allow="clipboard-write; autoplay"
                          webkitAllowFullScreen
                          mozAllowFullScreen
                          allowFullScreen
                        />
                      ) : (
                        <div 
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
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-primary/80 flex items-center justify-center text-white group-hover/play:scale-110 transition-transform box-glow">
                              <Play className="w-10 h-10 fill-current ml-1" />
                            </div>
                          </div>
                        </div>
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
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white md:opacity-0 md:group-hover/carousel:opacity-100 opacity-100 transition-all hover:bg-primary/50 z-20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
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
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentSlide ? "bg-primary w-4" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-8 space-y-4 overflow-y-auto flex-1">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full gradient-primary text-xs font-display text-primary-foreground tracking-wider uppercase">
                  {project.genre}
                </span>
                <span className="text-sm text-muted-foreground">{project.year}</span>
                <span className="text-sm text-muted-foreground">{project.stats}</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
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

              {project.storeUrl && (
                <div className="pt-6 flex justify-center">
                  <a
                    href={project.storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gradient-primary text-primary-foreground font-display text-sm tracking-wider uppercase hover:shadow-lg hover:shadow-primary/20 transition-all group"
                  >
                    Смотреть проект
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
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
