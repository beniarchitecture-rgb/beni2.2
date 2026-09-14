import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

const tileLayout = (idx, total) => {
  if (idx === 0) return { span: "md:col-span-12", height: "h-[260px] md:h-[560px]" };
  const rest = idx - 1;
  const lastAlone = idx === total - 1 && rest % 2 === 0;
  if (lastAlone) return { span: "md:col-span-12", height: "h-[260px] md:h-[460px]" };
  const pairIdx = Math.floor(rest / 2);
  const wideFirst = pairIdx % 2 === 0;
  const isFirstOfPair = rest % 2 === 0;
  const wide = wideFirst === isFirstOfPair;
  return { span: wide ? "md:col-span-7" : "md:col-span-5", height: "h-[240px] md:h-[420px]" };
};

export const ProjectGallery = ({ images, lang, title }) => {
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const els = containerRef.current?.querySelectorAll("[data-reveal]");
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0)";
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [images]);

  const close = useCallback(() => setLightboxIdx(null), []);
  const prev = useCallback(
    () => setLightboxIdx((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setLightboxIdx((i) => (i + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIdx, close, prev, next]);

  return (
    <>
      <div ref={containerRef} className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6" data-testid="project-gallery-grid">
        {images.map((img, idx) => {
          const { span, height } = tileLayout(idx, images.length);
          return (
            <button
              key={`gallery-${idx}`}
              type="button"
              onClick={() => setLightboxIdx(idx)}
              data-reveal
              className={`group relative block w-full overflow-hidden text-left ${span} ${height}`}
              style={{
                opacity: 0,
                transform: "translateY(28px)",
                transition: "opacity 0.8s ease, transform 0.8s ease",
                transitionDelay: `${(idx % 3) * 0.12}s`,
                cursor: "pointer",
              }}
              data-testid={`project-gallery-image-${idx}`}
              aria-label={`${title || "Image"} ${idx + 1}`}
            >
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.06]"
                style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }}
              />
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "linear-gradient(to top, rgba(14,16,23,0.75) 0%, transparent 45%)" }}
              />
              <div className="absolute bottom-5 left-6 flex items-baseline gap-3 opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                <span style={{ color: "#E8600A", fontSize: "1.4rem", fontWeight: 300, fontStyle: "italic" }}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>
                  {lang === "en" ? "View" : "Voir"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "rgba(8, 9, 13, 0.96)", backdropFilter: "blur(8px)" }}
          onClick={close}
          data-testid="gallery-lightbox"
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center text-white/60 transition-colors hover:text-[#E8600A]"
            data-testid="lightbox-close"
            aria-label={lang === "en" ? "Close" : "Fermer"}
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="absolute left-6 top-6 flex items-baseline gap-2"
            style={{ color: "rgba(255,255,255,0.55)" }}
            data-testid="lightbox-counter"
          >
            <span style={{ color: "#E8600A", fontSize: "1.3rem", fontWeight: 300 }}>
              {String(lightboxIdx + 1).padStart(2, "0")}
            </span>
            <span style={{ fontSize: "0.8rem" }}>/ {String(images.length).padStart(2, "0")}</span>
          </div>

          <img
            src={images[lightboxIdx]}
            alt={`${title || "Projet"} ${lightboxIdx + 1}`}
            className="max-h-[82vh] max-w-[88vw] object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            data-testid="lightbox-image"
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/10 text-white/70 transition-all hover:border-[#E8600A] hover:text-[#E8600A] md:left-8"
                data-testid="lightbox-prev"
                aria-label={lang === "en" ? "Previous image" : "Image précédente"}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/10 text-white/70 transition-all hover:border-[#E8600A] hover:text-[#E8600A] md:right-8"
                data-testid="lightbox-next"
                aria-label={lang === "en" ? "Next image" : "Image suivante"}
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};
