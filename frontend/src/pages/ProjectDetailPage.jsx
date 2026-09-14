import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { ProjectGallery } from "@/components/ProjectGallery";
import useProjects from "@/hooks/useProjects";

import { ArrowLeft, MapPin, Calendar, Maximize2 } from "lucide-react";

export default function ProjectDetailPage({ lang }) {
  const params = useParams();
  const projectId = params.projectId;
  const { projects, loading } = useProjects();

  const project = useMemo(() => {
    return projects.find((p) => p.id === projectId);
  }, [projectId, projects]);

  // Get adjacent projects for navigation
  const adjacentProjects = useMemo(() => {
    if (!project) return { prev: null, next: null };
    const idx = projects.findIndex((p) => p.id === projectId);
    return {
      prev: idx > 0 ? projects[idx - 1] : null,
      next: idx < projects.length - 1 ? projects[idx + 1] : null,
    };
  }, [project, projectId, projects]);

  if (!project && loading) {
    return <div data-testid="page-project-loading" style={{ minHeight: "60vh", background: "var(--dark2)" }} />;
  }

  if (!project) {
    return (
      <div data-testid="page-project-not-found">
        <section 
          className="min-h-[60vh] flex items-center justify-center"
          style={{ background: 'var(--dark2)' }}
        >
          <div className="text-center px-8">
            <h1 
              className="text-white"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300 }}
              data-testid="project-not-found-title"
            >
              {lang === "en" ? "Project not found" : "Projet introuvable"}
            </h1>
            <p 
              className="mt-4"
              style={{ fontSize: '0.85rem', color: '#8A8680' }}
              data-testid="project-not-found-subtitle"
            >
              {lang === "en"
                ? "The project link may be outdated."
                : "Le lien du projet est peut-être obsolète."}
            </p>
            <Link 
              to="/projets" 
              className="btn-outline inline-block mt-8"
              data-testid="project-not-found-back-link"
            >
              {lang === "en" ? "Back to portfolio" : "Retour au portfolio"}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div data-testid="page-project-detail">
      {/* Hero Section */}
      <section
        className="relative min-h-[70vh] flex items-end overflow-hidden"
        data-testid="project-detail-hero"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, rgba(14,16,23,0.95) 0%, rgba(14,16,23,0.3) 50%, rgba(14,16,23,0.5) 100%), url(${project.imageUrl}) center/cover no-repeat`
          }}
          data-testid="project-detail-hero-image"
          aria-label={`${project.title?.[lang]} cover`}
        />

        {/* Back button */}
        <div className="absolute left-8 top-24 z-10" data-testid="project-detail-back">
          <Link 
            to="/projets" 
            className="inline-flex items-center gap-2 text-[#8A8680] hover:text-[#E8600A] transition-colors"
            style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}
            data-testid="project-detail-back-link"
          >
            <ArrowLeft className="h-4 w-4" />
            {lang === "en" ? "Portfolio" : "Portfolio"}
          </Link>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 pb-16 w-full" data-testid="project-detail-hero-content">
          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-6" data-testid="project-detail-tags">
            {(project.tags?.[lang] || []).map((tag) => (
              <span 
                key={tag}
                className="px-3 py-1"
                style={{ 
                  background: 'rgba(232, 96, 10, 0.15)',
                  color: '#E8600A',
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase'
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 
            className="text-white"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1, fontWeight: 300 }}
            data-testid="project-detail-title"
          >
            {project.title?.[lang]}
          </h1>
          
          {/* Meta info */}
          <div className="mt-6 flex flex-wrap items-center gap-6" style={{ color: '#8A8680', fontSize: '0.8rem' }} data-testid="project-detail-meta">
            {project.location?.[lang] && (
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#E8600A]" />
                {project.location[lang]}
              </span>
            )}
            {project.year && (
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#E8600A]" />
                {project.year}
              </span>
            )}
            {project.area_m2 && (
              <span className="flex items-center gap-2">
                <Maximize2 className="h-4 w-4 text-[#E8600A]" />
                {project.area_m2.toLocaleString()} m²
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ background: 'var(--dark2)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-16 lg:grid-cols-12" data-testid="project-detail-grid">
            {/* Main content */}
            <div className="lg:col-span-7" data-testid="project-detail-main">
              <div className="section-label mb-8">
                <div className="line" />
                <span>{lang === "en" ? "Overview" : "Présentation"}</span>
              </div>
              <p 
                style={{ fontSize: '0.9rem', lineHeight: 2, color: '#8A8680' }}
                data-testid="project-detail-description"
              >
                {project.description?.[lang]}
              </p>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-5" data-testid="project-detail-side">
              {/* Program */}
              {project.program && project.program[lang] && project.program[lang].length > 0 && (
                <div 
                  className="p-8 border mb-8"
                  style={{ borderColor: 'rgba(232, 96, 10, 0.22)', background: 'var(--dark3)' }}
                  data-testid="project-detail-program-card"
                >
                  <h3 
                    className="text-white mb-6"
                    style={{ fontSize: '1.1rem', fontWeight: 400 }}
                    data-testid="project-detail-program-title"
                  >
                    {lang === "en" ? "Program" : "Programme"}
                  </h3>
                  <div className="space-y-3" data-testid="project-detail-program">
                    {project.program[lang].map((x, i) => (
                      <div 
                        key={x} 
                        className="flex items-start gap-3"
                        style={{ fontSize: '0.85rem', color: '#8A8680' }}
                        data-testid={`project-detail-program-item-${i}`}
                      >
                        <span className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8600A]" />
                        <span>{x}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project info */}
              <div 
                className="p-8 border"
                style={{ borderColor: 'rgba(232, 96, 10, 0.22)', background: 'var(--dark3)' }}
                data-testid="project-detail-info-card"
              >
                <h3 
                  className="text-white mb-6"
                  style={{ fontSize: '1.1rem', fontWeight: 400 }}
                  data-testid="project-detail-info-title"
                >
                  {lang === "en" ? "Project Info" : "Informations"}
                </h3>
                <div className="space-y-4" data-testid="project-detail-info">
                  <div className="flex justify-between" style={{ borderBottom: '1px solid rgba(232, 96, 10, 0.1)', paddingBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#5A5854', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {lang === "en" ? "Category" : "Catégorie"}
                    </span>
                    <span className="text-white capitalize" style={{ fontSize: '0.85rem' }}>{project.category}</span>
                  </div>
                  {project.area_m2 && (
                    <div className="flex justify-between" style={{ borderBottom: '1px solid rgba(232, 96, 10, 0.1)', paddingBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#5A5854', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {lang === "en" ? "Surface" : "Surface"}
                      </span>
                      <span className="text-white" style={{ fontSize: '0.85rem' }}>{project.area_m2.toLocaleString()} m²</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ fontSize: '0.75rem', color: '#5A5854', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {lang === "en" ? "Location" : "Localisation"}
                    </span>
                    <span className="text-white" style={{ fontSize: '0.85rem' }}>{project.location?.[lang] || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section data-testid="project-detail-gallery">
          <div className="max-w-7xl mx-auto">
            <div className="section-label mb-8">
              <div className="line" />
              <span>{lang === "en" ? "Gallery" : "Galerie"}</span>
            </div>
            <ProjectGallery images={project.gallery} lang={lang} title={project.title?.[lang]} />
          </div>
        </section>
      )}

      {/* Navigation to adjacent projects */}
      <section style={{ background: 'var(--dark2)' }} data-testid="project-detail-navigation">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: '#5A5854', textTransform: 'uppercase' }}>
              {lang === "en" ? "Other projects" : "Autres projets"}
            </span>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {adjacentProjects.prev && (
              <Link 
                to={`/projets/${adjacentProjects.prev.id}`} 
                className="beni-card group block"
                data-testid="project-detail-prev"
              >
                <div 
                  className="aspect-[16/9] w-full transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${adjacentProjects.prev.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="p-6">
                  <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#5A5854', marginBottom: '0.5rem' }}>
                    ← {lang === "en" ? "Previous" : "Précédent"}
                  </div>
                  <div className="text-white group-hover:text-[#FF8533] transition-colors" style={{ fontSize: '1.1rem' }}>
                    {adjacentProjects.prev.title?.[lang]}
                  </div>
                </div>
              </Link>
            )}
            {adjacentProjects.next && (
              <Link 
                to={`/projets/${adjacentProjects.next.id}`} 
                className="beni-card group block"
                data-testid="project-detail-next"
              >
                <div 
                  className="aspect-[16/9] w-full transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${adjacentProjects.next.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="p-6 text-right">
                  <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#5A5854', marginBottom: '0.5rem' }}>
                    {lang === "en" ? "Next" : "Suivant"} →
                  </div>
                  <div className="text-white group-hover:text-[#FF8533] transition-colors" style={{ fontSize: '1.1rem' }}>
                    {adjacentProjects.next.title?.[lang]}
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
