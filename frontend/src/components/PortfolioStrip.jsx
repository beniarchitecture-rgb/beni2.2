import { Link } from "react-router-dom";

import useProjects from "@/hooks/useProjects";

export default function PortfolioStrip({ lang }) {
  const { projects } = useProjects();
  const featured = projects.slice(0, 3);

  return (
    <section className="border-t border-border/60 bg-muted/20" data-testid="vision-portfolio-strip">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div
              className="text-xs font-medium tracking-[0.28em] text-muted-foreground"
              data-testid="vision-portfolio-eyebrow"
            >
              {lang === "en" ? "PORTFOLIO" : "PORTFOLIO"}
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight" data-testid="vision-portfolio-title">
              {lang === "en" ? "Selected projects" : "Projets sélectionnés"}
            </h2>
          </div>

          <Link to="/projets" data-testid="vision-portfolio-link">
            <span className="text-sm text-muted-foreground hover:text-foreground">
              {lang === "en" ? "View all" : "Voir tout"}
            </span>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3" data-testid="vision-portfolio-grid">
          {featured.map((p) => (
            <Link
              key={p.id}
              to={`/projets/${p.id}`}
              className="group"
              data-testid={`vision-portfolio-card-link-${p.id}`}
            >
              <div
                className="relative overflow-hidden rounded-xl border border-border bg-muted"
                data-testid={`vision-portfolio-card-${p.id}`}
              >
                <div
                  className="h-56 w-full bg-muted transition-transform duration-500 group-hover:scale-[1.03]"
                  style={{
                    backgroundImage: `url(${p.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  data-testid={`vision-portfolio-image-${p.id}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4" data-testid={`vision-portfolio-overlay-${p.id}`}>
                  <div className="text-sm font-medium text-white" data-testid={`vision-portfolio-name-${p.id}`}>
                    {p.title[lang]}
                  </div>
                  <div className="mt-1 text-xs text-white/75" data-testid={`vision-portfolio-meta-${p.id}`}>
                    {p.location?.[lang]}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
