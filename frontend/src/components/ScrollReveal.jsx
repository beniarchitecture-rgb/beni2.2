import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollReveal
 * -------------
 * Global, dependency-free scroll reveal manager.
 * - Fades + lifts each <section> into view as the user scrolls (premium feel).
 * - Staggers individual cards inside any grid ([data-testid$="-grid"]).
 * - Skips the first (hero) section of every page so above-the-fold content
 *   never flashes empty.
 * - Re-scans on every route change (SPA navigation).
 * - Respects prefers-reduced-motion and gracefully degrades without
 *   IntersectionObserver support.
 *
 * Uses classes `.reveal` / `.reveal-visible` defined in index.css.
 * Runs in useLayoutEffect so elements are hidden BEFORE first paint
 * (prevents a show-then-hide flicker on navigation).
 */
export default function ScrollReveal() {
  const location = useLocation();

  useLayoutEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const main =
      document.querySelector('[data-testid="site-main"]') ||
      document.querySelector("main");
    if (!main) return undefined;

    const targets = [];
    const sections = Array.from(main.querySelectorAll("section"));

    sections.forEach((section, idx) => {
      // Keep the hero (first section) fully visible on load.
      if (idx === 0) return;

      const grid = section.querySelector('[data-testid$="-grid"]');
      const cards = grid ? Array.from(grid.children) : [];

      if (cards.length > 1) {
        // Reveal the section's intro/header blocks (siblings of the grid).
        const container = grid.parentElement;
        if (container) {
          Array.from(container.children).forEach((child) => {
            if (child !== grid) {
              child.classList.add("reveal");
              targets.push(child);
            }
          });
        }
        // Stagger each card individually for an elegant cascade.
        cards.forEach((card, i) => {
          card.classList.add("reveal");
          card.style.transitionDelay = `${Math.min(i, 10) * 70}ms`;
          targets.push(card);
        });
      } else {
        // Reveal the whole section as one block.
        section.classList.add("reveal");
        targets.push(section);
      }
    });

    if (targets.length === 0) return undefined;

    // Fallback: no animation environment -> show everything immediately.
    if (prefersReduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("reveal-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [location.pathname]);

  return null;
}
