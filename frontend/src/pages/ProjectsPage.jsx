import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { t } from "@/lib/i18n";
import useProjects from "@/hooks/useProjects";

const FILTERS = [
  { key: "all", category: null },
  { key: "institutional", category: "institutional" },
  { key: "residential", category: "residential" },
  { key: "commercial", category: "commercial" },
  { key: "social", category: "social" },
];

export default function ProjectsPage({ lang }) {
  const [active, setActive] = useState("all");
  const { projects: allProjects } = useProjects();

  const projects = useMemo(() => {
    const selected = FILTERS.find((f) => f.key === active);
    if (!selected || !selected.category) return allProjects;
    return allProjects.filter((p) => p.category === selected.category);
  }, [active, allProjects]);

  return (
    <div data-testid="page-projects">
      {/* Hero Section */}
      <section 
        className="relative min-h-[50vh] flex items-center overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, rgba(14,16,23,0.95) 0%, rgba(14,16,23,0.8) 100%), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80') center/cover no-repeat`
        }}
      >
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-32 w-full">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="section-label">
                <div className="line" />
                <span>Portfolio</span>
              </div>
              <h1 
                className="text-white mt-4"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1, fontWeight: 300 }}
                data-testid="projects-title"
              >
                {lang === "fr" ? (
                  <>Nos <em style={{ fontStyle: 'italic', color: '#FF8533' }}>projets</em></>
                ) : (
                  <>Our <em style={{ fontStyle: 'italic', color: '#FF8533' }}>projects</em></>
                )}
              </h1>
              <p 
                className="mt-6 max-w-xl"
                style={{ fontSize: '0.85rem', lineHeight: 1.9, color: '#8A8680' }}
                data-testid="projects-subtitle"
              >
                {t(lang, "sections.projectsSubtitle")}
              </p>
            </div>
            <div 
              className="px-4 py-2 border"
              style={{ borderColor: 'rgba(232, 96, 10, 0.5)', color: '#E8600A', fontSize: '0.7rem', letterSpacing: '0.2em' }}
              data-testid="projects-count"
            >
              {projects.length} / {allProjects.length}
            </div>
          </div>
        </div>
      </section>

      {/* Filters + Grid Section */}
      <section style={{ background: 'var(--dark2)' }}>
        <div className="max-w-7xl mx-auto">
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-6 mb-16" data-testid="projects-filters">
            {FILTERS.map((f) => {
              const isActive = f.key === active;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setActive(f.key)}
                  className="relative pb-2 transition-colors"
                  style={{ 
                    color: isActive ? '#E8600A' : '#8A8680',
                    fontSize: '0.7rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase'
                  }}
                  data-testid={`projects-filter-${f.key}`}
                  aria-pressed={isActive}
                >
                  {t(lang, `filters.${f.key}`)}
                  {/* Underline */}
                  <span 
                    className="absolute bottom-0 left-0 h-px transition-all duration-300"
                    style={{ 
                      background: '#E8600A',
                      width: isActive ? '100%' : '0'
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Projects Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" data-testid="projects-grid">
            {projects.map((p) => (
              <Link
                key={p.id}
                to={`/projets/${p.id}`}
                className="beni-card group block"
                data-testid={`projects-card-link-${p.id}`}
              >
                <div
                  className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${p.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  data-testid={`projects-image-${p.id}`}
                  aria-label={`${p.title[lang]} image`}
                />

                <div className="p-6">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: '#E8600A', textTransform: 'uppercase' }}>
                      {p.location?.[lang]}
                    </span>
                    {p.year && (
                      <span style={{ fontSize: '0.6rem', color: '#5A5854' }}>
                        {p.year}
                      </span>
                    )}
                  </div>
                  
                  <h2
                    className="text-white group-hover:text-[#FF8533] transition-colors mb-3"
                    style={{ fontSize: '1.1rem', fontWeight: 400 }}
                    data-testid={`projects-title-${p.id}`}
                  >
                    {p.title[lang]}
                  </h2>

                  <p
                    style={{ fontSize: '0.8rem', color: '#8A8680', lineHeight: 1.7 }}
                    data-testid={`projects-desc-${p.id}`}
                  >
                    {p.description[lang].substring(0, 120)}...
                  </p>

                  {(p.tags?.[lang] || []).length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2" data-testid={`projects-tags-${p.id}`}>
                      {p.tags[lang].slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs"
                          style={{ 
                            background: 'rgba(232, 96, 10, 0.1)',
                            color: '#E8600A',
                            fontSize: '0.6rem',
                            letterSpacing: '0.1em'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
