import { useEffect, useMemo, useState, useCallback } from "react";

import { siteConfig } from "@/data/siteConfig";
import { Button } from "@/components/ui/button";

function clampIndex(i, len) {
  if (len <= 0) return 0;
  return (i + len) % len;
}

export default function HeroCarousel({ lang, onPrimaryCta }) {
  const slides = useMemo(() => {
    const imgs = siteConfig.projects
      .map((p) => ({
        id: p.id,
        title: p.title?.[lang] || p.title?.fr || "",
        imageUrl: p.imageUrl,
      }))
      .filter((x) => x.imageUrl)
      .slice(0, 3);

    return imgs.length
      ? imgs
      : [
          {
            id: "fallback-1",
            title: siteConfig.brand.name,
            imageUrl: "",
          },
        ];
  }, [lang]);

  const [active, setActive] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [textKey, setTextKey] = useState(0);

  const goToSlide = useCallback((newIndex) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActive(newIndex);
    setTextKey((k) => k + 1);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      goToSlide(clampIndex(active + 1, slides.length));
    }, 7000);
    return () => clearInterval(t);
  }, [slides.length, active, goToSlide]);

  const slide = slides[active];

  // Headlines for each slide
  const headlines = [
    { fr: "CONCEVOIR & PROPOSER", en: "DESIGN & PROPOSE" },
    { fr: "ARCHITECTES DÉVELOPPEURS", en: "ARCHITECTS DEVELOPERS" },
    { fr: "ANTICIPER", en: "ANTICIPATE" },
  ];

  const currentHeadline = headlines[active] || headlines[0];

  return (
    <section
      className="relative h-[78vh] min-h-[520px] overflow-hidden"
      data-testid="hero-carousel"
      aria-label="Hero"
    >
      {/* Background images with crossfade */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== active}
        >
          <div
            className={`absolute inset-0 bg-muted ${
              i === active ? "animate-zoom-subtle" : ""
            }`}
            style={
              s.imageUrl
                ? {
                    backgroundImage: `url(${s.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
            data-testid={`hero-bg-${i}`}
          />
        </div>
      ))}
      
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" 
        data-testid="hero-carousel-overlay" 
      />

      {/* Content with staggered animations */}
      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-4">
        <div className="max-w-4xl" key={textKey}>
          {/* Eyebrow */}
          <div
            className="animate-fade-in-down text-xs font-medium tracking-[0.28em] text-white/80"
            data-testid="hero-eyebrow"
          >
            Architecture • Design • Construction
          </div>

          {/* Headline - changes based on active slide */}
          <h1
            className="animate-fade-in-up animation-delay-200 mt-6 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl opacity-0"
            data-testid="hero-headline"
          >
            {currentHeadline[lang] || currentHeadline.fr}
          </h1>

          {/* Subheadline */}
          <p
            className="animate-fade-in-up animation-delay-400 mt-4 max-w-2xl text-sm leading-7 text-white/80 opacity-0"
            data-testid="hero-subheadline"
          >
            {lang === "en"
              ? "A contemporary premium practice rooted in local African context, delivering institutional, residential and commercial projects."
              : "Un cabinet contemporain premium, ancré dans son contexte local africain, au service de projets institutionnels, résidentiels et commerciaux."}
          </p>

          {/* CTA */}
          <div 
            className="animate-fade-in-up animation-delay-600 mt-7 flex flex-wrap items-center gap-3 opacity-0" 
            data-testid="hero-cta"
          >
            <Button
              variant="secondary"
              className="group relative overflow-hidden bg-white text-black transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-white/20"
              onClick={onPrimaryCta}
              data-testid="hero-primary-cta"
            >
              <span className="relative z-10">
                {lang === "en" ? "Explore portfolio" : "Découvrir le portfolio"}
              </span>
            </Button>
            <div 
              className="animate-slide-in-right animation-delay-700 flex items-center gap-2 text-xs text-white/70 opacity-0"
              data-testid="hero-slide-title"
            >
              <span className="h-px w-6 animate-line-grow bg-white/40" />
              {slide?.title}
            </div>
          </div>

          {/* Scroll indicator */}
          <div 
            className="animate-fade-in animation-delay-800 mt-10 flex items-center gap-3 text-white/70 opacity-0" 
            data-testid="hero-scroll-indicator"
          >
            <span className="text-[10px] tracking-[0.35em]">
              {lang === "en" ? "SCROLL" : "DÉFILER"}
            </span>
            <span className="h-px w-10 animate-line-grow bg-white/40" />
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        type="button"
        onClick={() => goToSlide(clampIndex(active - 1, slides.length))}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-110"
        data-testid="hero-prev"
        aria-label="Previous"
        disabled={isTransitioning}
      >
        <span className="text-xl">‹</span>
      </button>
      <button
        type="button"
        onClick={() => goToSlide(clampIndex(active + 1, slides.length))}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-110"
        data-testid="hero-next"
        aria-label="Next"
        disabled={isTransitioning}
      >
        <span className="text-xl">›</span>
      </button>

      {/* Slide indicators */}
      <div
        className="absolute bottom-10 right-8 hidden items-center gap-3 sm:flex"
        data-testid="hero-indicators"
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goToSlide(i)}
            className={`group flex items-center gap-2 transition-all duration-300 ${
              i === active
                ? "text-white"
                : "text-white/60 hover:text-white"
            }`}
            data-testid={`hero-indicator-${i}`}
            aria-label={`Slide ${i + 1}`}
            disabled={isTransitioning}
          >
            <span className="text-xs tabular-nums transition-transform duration-300 group-hover:scale-110">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span 
              className={`h-px transition-all duration-500 ${
                i === active 
                  ? "w-10 bg-white" 
                  : "w-6 bg-white/40 group-hover:w-8 group-hover:bg-white/60"
              }`} 
            />
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div 
          className="h-full bg-white/40 transition-all duration-300"
          style={{ 
            width: `${((active + 1) / slides.length) * 100}%`,
          }}
          data-testid="hero-progress"
        />
      </div>
    </section>
  );
}
