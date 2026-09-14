import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

import { siteConfig } from "@/data/siteConfig";

const TABS = [
  { key: "institutional", labelFr: "Institutionnel", labelEn: "Institutional" },
  { key: "residential", labelFr: "Résidentiel", labelEn: "Residential" },
  { key: "commercial", labelFr: "Commercial", labelEn: "Commercial" },
];

export default function ArchitecturePage({ lang }) {
  const [active, setActive] = useState("institutional");

  const items = useMemo(() => {
    return siteConfig.projects.filter((p) => p.category === active);
  }, [active]);

  return (
    <div data-testid="page-architecture">
      {/* Hero Section */}
      <section
        className="relative min-h-[50vh] flex items-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(14,16,23,0.95) 0%, rgba(14,16,23,0.8) 100%), url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80') center/cover no-repeat`
        }}
      >
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-32 w-full">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="section-label">
                <div className="line" />
                <span>Architecture</span>
              </div>
              <h1 
                className="text-white mt-4"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1, fontWeight: 300 }}
                data-testid="architecture-title"
              >
                {lang === "fr" ? (
                  <>Projets <em style={{ fontStyle: 'italic', color: '#FF8533' }}>architecturaux</em></>
                ) : (
                  <>Architectural <em style={{ fontStyle: 'italic', color: '#FF8533' }}>projects</em></>
                )}
              </h1>
              <p 
                className="mt-6 max-w-xl"
                style={{ fontSize: '0.85rem', lineHeight: 1.9, color: '#8A8680' }}
                data-testid="architecture-subtitle"
              >
                {lang === "en"
                  ? "Institutional, residential and commercial projects—designed with rigor and identity."
                  : "Projets institutionnels, résidentiels et commerciaux — conçus avec rigueur et identité."}
              </p>
            </div>
            <div 
              className="px-4 py-2 border"
              style={{ borderColor: 'rgba(232, 96, 10, 0.5)', color: '#E8600A', fontSize: '0.7rem', letterSpacing: '0.2em' }}
              data-testid="architecture-count"
            >
              {items.length} {lang === "fr" ? "PROJETS" : "PROJECTS"}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ background: 'var(--dark2)' }}>
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap gap-6 mb-16" data-testid="architecture-tabs">
            {TABS.map((t) => {
              const isActive = t.key === active;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActive(t.key)}
                  className="relative pb-2 transition-colors"
                  style={{ 
                    color: isActive ? '#E8600A' : '#8A8680',
                    fontSize: '0.7rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase'
                  }}
                  data-testid={`architecture-tab-${t.key}`}
                >
                  {lang === "en" ? t.labelEn : t.labelFr}
                  <span 
                    className="absolute bottom-0 left-0 h-px transition-all duration-300"
                    style={{ background: '#E8600A', width: isActive ? '100%' : '0' }}
                  />
                </button>
              );
            })}
          </div>

          {/* Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" data-testid="architecture-grid">
            {items.map((p) => (
              <NavLink 
                key={p.id}
                to={`/projets/${p.id}`}
                className="beni-card group block"
                data-testid={`architecture-card-${p.id}`}
              >
                <div
                  className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${p.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  data-testid={`architecture-image-${p.id}`}
                />
                <div className="p-6">
                  <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: '#E8600A', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {p.location?.[lang]}
                  </div>
                  <h3 
                    className="text-white group-hover:text-[#FF8533] transition-colors mb-3"
                    style={{ fontSize: '1.1rem', fontWeight: 400 }}
                    data-testid={`architecture-card-title-${p.id}`}
                  >
                    {p.title[lang]}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#8A8680', lineHeight: 1.7 }} data-testid={`architecture-card-desc-${p.id}`}>
                    {p.description[lang].substring(0, 100)}...
                  </p>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
