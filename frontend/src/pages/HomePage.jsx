import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import { t } from "@/lib/i18n";
import { NavLink } from "react-router-dom";
import useProjects from "@/hooks/useProjects";

// Hook pour l'animation des compteurs
function useCountUp(target, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) {
      // Start immediately
      animateCount();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          animateCount();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  function animateCount() {
    const startTime = performance.now();
    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };
    requestAnimationFrame(updateCount);
  }

  return { count, ref };
}

// Hook pour le parallax
function useParallax(speed = 0.5) {
  const [offset, setOffset] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.scrollY;
        setOffset(scrolled * speed);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { offset, ref };
}

// Composant pour les chiffres animés
function AnimatedStat({ value, suffix = "", label, lang }) {
  const { count, ref } = useCountUp(value, 2000);
  
  return (
    <div ref={ref} className="stat-item text-left md:text-right">
      <span className="stat-num text-xl md:text-4xl">
        {count}{suffix && <span>{suffix}</span>}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

// Composant carte projet avec effet 3D
function ProjectCard3D({ project, lang }) {
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setTransform({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
  };

  return (
    <NavLink 
      to={`/projets/${project.id}`}
      ref={cardRef}
      className="project-card-3d group block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
      data-testid={`featured-project-${project.id}`}
    >
      <div className="beni-card overflow-hidden">
        <div
          className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-110"
          style={{
            backgroundImage: `url(${project.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          data-testid={`featured-project-image-${project.id}`}
        />
        <div className="p-6">
          <div 
            className="mb-2"
            style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--orange)', textTransform: 'uppercase' }}
          >
            {project.location[lang]}
          </div>
          <h3 
            className="text-white mb-3 group-hover:text-[#FF8533] transition-colors"
            style={{ fontSize: '1.2rem', fontWeight: 400 }}
            data-testid={`featured-project-title-${project.id}`}
          >
            {project.title[lang]}
          </h3>
          <p 
            style={{ fontSize: '0.8rem', color: '#8A8680', lineHeight: 1.7 }}
            data-testid={`featured-project-desc-${project.id}`}
          >
            {project.description[lang].substring(0, 100)}...
          </p>
        </div>
      </div>
    </NavLink>
  );
}

// Composant bandeau défilant
function MarqueeText({ text, speed = 30 }) {
  return (
    <div className="marquee-container overflow-hidden whitespace-nowrap py-4" style={{ background: 'var(--dark3)' }}>
      <div 
        className="marquee-content inline-block"
        style={{
          animation: `marquee ${speed}s linear infinite`
        }}
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="mx-16" style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: '#5A5854' }}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HomePage({ lang, onNavigateProjects, onNavigateContact }) {
  const { offset, ref: parallaxRef } = useParallax(0.4);
  const [isVisible, setIsVisible] = useState(false);
  const { projects } = useProjects();
  const videoBoxRef = useRef(null);
  const videoElRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);

  // La vidéo (535 Ko) ne se charge que lorsqu'elle devient visible à l'écran
  useEffect(() => {
    const el = videoBoxRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowVideo(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (showVideo && videoElRef.current) {
      videoElRef.current.play?.().catch(() => {});
    }
  }, [showVideo]);

  // Diaporama d'arrière-plan de la bannière (images de projets) + effet Ken Burns
  const heroSlides = [
    siteConfig.projects.find((p) => p.id === "deux-immeubles-r2-bassam")?.gallery?.[3],
    siteConfig.projects.find((p) => p.id === "immeuble-sci-ys-r3-penthouse")?.gallery?.[0],
    siteConfig.projects.find((p) => p.id === "hotel-sci-sad-r3-gagnoa")?.gallery?.[0],
    siteConfig.projects.find((p) => p.id === "college-twins-boni-djorobite")?.gallery?.[2],
  ].filter(Boolean);
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const id = setInterval(() => {
      setHeroSlide((s) => (s + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(id);
  }, [heroSlides.length]);

  return (
    <div data-testid="page-home">
      {/* Hero Section with Parallax */}
      <section 
        ref={parallaxRef}
        className="relative min-h-screen flex items-center overflow-hidden px-4 md:px-16" 
        data-testid="hero-section"
      >
        {/* Diaporama d'arrière-plan (images de projets) avec parallax */}
        <div
          className="absolute inset-0 overflow-hidden will-change-transform"
          style={{ transform: `translateY(${offset}px)` }}
          data-testid="hero-slideshow"
        >
          {heroSlides.map((src, i) => (
            <div
              key={i}
              className={`hero-slide dir-${i % 4} ${i === heroSlide ? "is-active" : ""}`}
              style={{ backgroundImage: `url("${src}")` }}
              data-testid={`hero-slide-${i}`}
            />
          ))}
          <div className="hero-slide-overlay" />
        </div>

        {/* Indicateurs de slide */}
        {heroSlides.length > 1 && (
          <div className="hero-dots" data-testid="hero-dots">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Image ${i + 1}`}
                className={`hero-dot ${i === heroSlide ? "active" : ""}`}
                onClick={() => setHeroSlide(i)}
                data-testid={`hero-dot-${i}`}
              />
            ))}
          </div>
        )}
        
        {/* Accent line on right */}
        <div className="hero-accent" />
        
        {/* Side number */}
        <div className="hero-number hidden md:block">
          BENI Architecture · {siteConfig.brand.yearFounded}
        </div>

        {/* Content with fade-in animation */}
        <div 
          className={`relative z-10 max-w-3xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          data-testid="hero-content"
        >
          {/* Eyebrow */}
          <div className="eyebrow mb-10">
            <div className="line" />
            <span>{t(lang, "hero.kicker")}</span>
          </div>

          {/* Title */}
          <h1 
            className="text-white mb-8"
            style={{ 
              fontSize: 'clamp(2.5rem, 8vw, 7rem)',
              lineHeight: 0.95,
              fontWeight: 300 
            }}
            data-testid="hero-title"
          >
            {lang === "fr" ? (
              <>Concevoir des <em style={{ fontStyle: 'italic', color: '#FF8533' }}>espaces</em> durables</>
            ) : (
              <>Designing <em style={{ fontStyle: 'italic', color: '#FF8533' }}>sustainable</em> spaces</>
            )}
          </h1>

          {/* Description */}
          <p 
            className="mb-12 max-w-md"
            style={{ 
              fontSize: '0.85rem',
              lineHeight: 1.9,
              color: '#8A8680',
              fontWeight: 300 
            }}
            data-testid="hero-subtitle"
          >
            {t(lang, "hero.subtitle")}
          </p>

          {/* CTAs */}
          <div className="flex gap-6 items-center flex-wrap" data-testid="hero-cta-group">
            <button 
              onClick={onNavigateProjects}
              className="btn-orange"
              data-testid="hero-cta-primary"
            >
              {t(lang, "hero.ctaPrimary")}
            </button>
            <button 
              onClick={onNavigateContact}
              className="btn-outline"
              data-testid="hero-cta-secondary"
            >
              {t(lang, "hero.ctaSecondary")}
            </button>
          </div>
        </div>

        {/* Animated Stats - Bottom */}
        <div className="absolute left-4 md:left-auto md:right-20 bottom-8 md:bottom-16 flex gap-6 md:gap-12" data-testid="hero-stats">
          <AnimatedStat value={50} suffix="+" label={lang === "fr" ? "Projets" : "Projects"} lang={lang} />
          <AnimatedStat value={10} suffix="+" label={lang === "fr" ? "Experts" : "Experts"} lang={lang} />
          <AnimatedStat value={2022} suffix="" label={lang === "fr" ? "Fondé" : "Founded"} lang={lang} />
        </div>
      </section>

      {/* Marquee Banner */}
      <MarqueeText text="ARCHITECTURE · URBANISME · DÉVELOPPEMENT · CONSTRUCTION · INNOVATION · DURABILITÉ" />

      {/* About Section */}
      <section style={{ background: 'var(--dark2)' }} data-testid="home-about">
        <div className="max-w-7xl mx-auto">
          <div className="section-label">
            <div className="line" />
            <span>{t(lang, "sections.visionTitle")}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Video with hover effect */}
            <div className="relative group" ref={videoBoxRef}>
              <video
                ref={videoElRef}
                className="aspect-video w-full object-cover block transition-transform duration-700 group-hover:scale-[1.02]"
                src={showVideo ? `${process.env.PUBLIC_URL || ""}/lumina.mp4` : undefined}
                autoPlay={showVideo}
                loop
                muted
                playsInline
                preload={showVideo ? "auto" : "none"}
                data-testid="about-lumina-video"
              />
              {/* Orange accent box */}
              <div 
                className="absolute -bottom-6 -right-6 w-16 h-16 md:w-24 md:h-24 transition-transform duration-500 group-hover:scale-110"
                style={{ background: 'var(--orange)' }}
                data-testid="about-video-accent"
              />
            </div>

            {/* Content */}
            <div>
              <h2 
                className="text-white mb-8"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}
                data-testid="about-title"
              >
                {lang === "fr" ? (
                  <>Une architecture <em style={{ fontStyle: 'italic', color: '#FF8533' }}>identitaire</em></>
                ) : (
                  <>Identity-driven <em style={{ fontStyle: 'italic', color: '#FF8533' }}>architecture</em></>
                )}
              </h2>
              <p 
                className="mb-8"
                style={{ fontSize: '0.85rem', lineHeight: 1.9, color: '#8A8680' }}
                data-testid="about-text"
              >
                {t(lang, "sections.visionText")}
              </p>
              <button 
                onClick={onNavigateContact}
                className="btn-outline"
                data-testid="about-cta"
              >
                {t(lang, "hero.ctaSecondary")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects with 3D Cards */}
      <section data-testid="home-featured-projects">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-8 mb-16">
            <div>
              <div className="section-label">
                <div className="line" />
                <span>{lang === "fr" ? "Portfolio" : "Portfolio"}</span>
              </div>
              <h2 
                className="text-white"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}
                data-testid="featured-projects-title"
              >
                {t(lang, "sections.featuredProjectsTitle")}
              </h2>
            </div>
            <button 
              onClick={onNavigateProjects}
              className="btn-outline hidden md:block"
              data-testid="featured-projects-cta"
            >
              {lang === "fr" ? "Voir tous" : "View all"}
            </button>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" data-testid="featured-projects-grid">
            {["eglise-ambassade-miracles-daloa", "parc-attraction-abengourou", "temple-cathedrale-cocody"]
              .map((id) => projects.find((p) => p.id === id))
              .filter(Boolean)
              .map((p) => (
              <ProjectCard3D key={p.id} project={p} lang={lang} />
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="mt-8 text-center md:hidden">
            <button 
              onClick={onNavigateProjects}
              className="btn-outline"
            >
              {lang === "fr" ? "Voir tous les projets" : "View all projects"}
            </button>
          </div>
        </div>
      </section>

      {/* Services/Expertise */}
      <section style={{ background: 'var(--dark2)' }} data-testid="home-expertise">
        <div className="max-w-7xl mx-auto">
          <div className="section-label">
            <div className="line" />
            <span>{t(lang, "sections.expertiseTitle")}</span>
          </div>
          <h2 
            className="text-white mb-16"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}
          >
            {lang === "fr" ? (
              <>Nos domaines <em style={{ fontStyle: 'italic', color: '#FF8533' }}>d&apos;expertise</em></>
            ) : (
              <>Our areas of <em style={{ fontStyle: 'italic', color: '#FF8533' }}>expertise</em></>
            )}
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {siteConfig.expertise.map((exp, index) => (
              <div 
                key={exp.key}
                className="expertise-card p-8 border transition-all duration-300 hover:border-[#E8600A] hover:-translate-y-2 group"
                style={{ borderColor: 'rgba(232, 96, 10, 0.22)', background: 'var(--dark3)' }}
              >
                <div 
                  className="mb-4 text-[#E8600A] transition-transform duration-300 group-hover:scale-110"
                  style={{ fontSize: '0.6rem', letterSpacing: '0.3em' }}
                >
                  0{index + 1}
                </div>
                <h3 
                  className="text-white group-hover:text-[#FF8533] transition-colors"
                  style={{ fontSize: '1.1rem', fontWeight: 400 }}
                >
                  {exp[lang]}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, rgba(232,96,10,0.15) 0%, rgba(14,16,23,1) 100%)`,
          borderTop: '1px solid rgba(232, 96, 10, 0.22)'
        }}
        data-testid="home-cta"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="eyebrow justify-center mb-8">
            <div className="line" />
            <span>{lang === "fr" ? "Commencer" : "Get Started"}</span>
            <div className="line" />
          </div>
          <h2 
            className="text-white mb-8"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.2 }}
          >
            {lang === "fr" ? (
              <>Prêt à donner vie à <em style={{ fontStyle: 'italic', color: '#FF8533' }}>votre projet</em> ?</>
            ) : (
              <>Ready to bring your <em style={{ fontStyle: 'italic', color: '#FF8533' }}>project</em> to life?</>
            )}
          </h2>
          <p 
            className="mb-10 max-w-xl mx-auto"
            style={{ fontSize: '0.85rem', lineHeight: 1.9, color: '#8A8680' }}
          >
            {t(lang, "contact.lead")}
          </p>
          <button 
            onClick={onNavigateContact}
            className="btn-orange"
            data-testid="home-final-cta"
          >
            {t(lang, "nav.contact")}
          </button>
        </div>
      </section>
    </div>
  );
}
