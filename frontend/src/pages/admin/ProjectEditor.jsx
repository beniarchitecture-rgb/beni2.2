import { useEffect, useState } from "react";

import { createProject, formatApiError, updateProject } from "@/lib/api";

const CATEGORIES = [
  { value: "institutional", label: "Institutionnel" },
  { value: "residential", label: "Résidentiel" },
  { value: "commercial", label: "Commercial" },
  { value: "social", label: "Social" },
];

const inputStyle = {
  background: "#0E1017",
  border: "1px solid rgba(232, 96, 10, 0.22)",
  fontSize: "0.85rem",
  cursor: "auto",
  color: "#E8E6DF",
  width: "100%",
  padding: "0.6rem 0.9rem",
  outline: "none",
};

const labelStyle = {
  fontSize: "0.6rem",
  letterSpacing: "0.25em",
  color: "#E8600A",
  textTransform: "uppercase",
  display: "block",
  marginBottom: "0.4rem",
};

const lines = (s) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const csv = (s) => s.split(",").map((x) => x.trim()).filter(Boolean);

function toForm(p) {
  if (!p) {
    return {
      id: "", category: "residential", titleFr: "", titleEn: "", locationFr: "", locationEn: "",
      year: "", area: "", descFr: "", descEn: "", programFr: "", programEn: "",
      tagsFr: "", tagsEn: "", imageUrl: "", gallery: "",
    };
  }
  return {
    id: p.id || "",
    category: p.category || "residential",
    titleFr: p.title?.fr || "", titleEn: p.title?.en || "",
    locationFr: p.location?.fr || "", locationEn: p.location?.en || "",
    year: p.year || "",
    area: p.area_m2 != null ? String(p.area_m2) : "",
    descFr: p.description?.fr || "", descEn: p.description?.en || "",
    programFr: (p.program?.fr || []).join("\n"), programEn: (p.program?.en || []).join("\n"),
    tagsFr: (p.tags?.fr || []).join(", "), tagsEn: (p.tags?.en || []).join(", "),
    imageUrl: p.imageUrl || "",
    gallery: (p.gallery || []).join("\n"),
  };
}

function toPayload(f) {
  return {
    id: f.id.trim().toLowerCase().replace(/\s+/g, "-"),
    category: f.category,
    title: { fr: f.titleFr.trim(), en: f.titleEn.trim() },
    location: { fr: f.locationFr.trim(), en: f.locationEn.trim() },
    year: f.year.trim(),
    area_m2: f.area.trim() ? Number(f.area) : null,
    description: { fr: f.descFr.trim(), en: f.descEn.trim() },
    program: { fr: lines(f.programFr), en: lines(f.programEn) },
    tags: { fr: csv(f.tagsFr), en: csv(f.tagsEn) },
    imageUrl: f.imageUrl.trim(),
    gallery: lines(f.gallery),
  };
}

function Field({ label, testId, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function ProjectEditor({ project, onSaved, onCancel }) {
  const isNew = !project;
  const [form, setForm] = useState(() => toForm(project));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = toPayload(form);
      if (isNew) await createProject(payload);
      else await updateProject(project.id, payload);
      onSaved();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6" data-testid="project-editor-form">
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Identifiant (slug, unique)" testId="editor-id-field">
          <input
            value={form.id}
            onChange={set("id")}
            required
            disabled={!isNew}
            placeholder="ex. villa-triplex-dabou"
            style={{ ...inputStyle, opacity: isNew ? 1 : 0.5 }}
            data-testid="editor-id"
          />
        </Field>
        <Field label="Catégorie">
          <select value={form.category} onChange={set("category")} style={inputStyle} data-testid="editor-category">
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Titre (FR)">
          <input value={form.titleFr} onChange={set("titleFr")} required style={inputStyle} data-testid="editor-title-fr" />
        </Field>
        <Field label="Titre (EN)">
          <input value={form.titleEn} onChange={set("titleEn")} required style={inputStyle} data-testid="editor-title-en" />
        </Field>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Localisation (FR)">
          <input value={form.locationFr} onChange={set("locationFr")} style={inputStyle} data-testid="editor-location-fr" />
        </Field>
        <Field label="Localisation (EN)">
          <input value={form.locationEn} onChange={set("locationEn")} style={inputStyle} data-testid="editor-location-en" />
        </Field>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Année (optionnel)">
          <input value={form.year} onChange={set("year")} placeholder="ex. 2026" style={inputStyle} data-testid="editor-year" />
        </Field>
        <Field label="Surface m² (optionnel)">
          <input value={form.area} onChange={set("area")} type="number" min="0" placeholder="ex. 1200" style={inputStyle} data-testid="editor-area" />
        </Field>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Description (FR)">
          <textarea value={form.descFr} onChange={set("descFr")} required rows={4} style={inputStyle} data-testid="editor-desc-fr" />
        </Field>
        <Field label="Description (EN)">
          <textarea value={form.descEn} onChange={set("descEn")} required rows={4} style={inputStyle} data-testid="editor-desc-en" />
        </Field>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Programme (FR) — une ligne par élément">
          <textarea value={form.programFr} onChange={set("programFr")} rows={4} style={inputStyle} data-testid="editor-program-fr" />
        </Field>
        <Field label="Programme (EN) — une ligne par élément">
          <textarea value={form.programEn} onChange={set("programEn")} rows={4} style={inputStyle} data-testid="editor-program-en" />
        </Field>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Tags (FR) — séparés par des virgules">
          <input value={form.tagsFr} onChange={set("tagsFr")} placeholder="Résidentiel, Villa" style={inputStyle} data-testid="editor-tags-fr" />
        </Field>
        <Field label="Tags (EN) — séparés par des virgules">
          <input value={form.tagsEn} onChange={set("tagsEn")} placeholder="Residential, Villa" style={inputStyle} data-testid="editor-tags-en" />
        </Field>
      </div>

      <Field label="Image principale (URL)">
        <input value={form.imageUrl} onChange={set("imageUrl")} required placeholder="https://..." style={inputStyle} data-testid="editor-image-url" />
      </Field>
      {form.imageUrl.trim() && (
        <div
          className="h-40 w-full max-w-sm"
          style={{ backgroundImage: `url(${form.imageUrl.trim()})`, backgroundSize: "cover", backgroundPosition: "center", border: "1px solid rgba(232,96,10,0.22)" }}
          data-testid="editor-image-preview"
        />
      )}

      <Field label="Galerie (URLs — une ligne par image)">
        <textarea value={form.gallery} onChange={set("gallery")} rows={4} placeholder={"https://...\nhttps://..."} style={inputStyle} data-testid="editor-gallery" />
      </Field>

      {error && (
        <p style={{ color: "#f87171", fontSize: "0.8rem" }} data-testid="editor-error">
          {error}
        </p>
      )}

      <div className="flex gap-4">
        <button type="submit" disabled={saving} className="btn-orange" style={{ cursor: "pointer", opacity: saving ? 0.6 : 1 }} data-testid="editor-save">
          {saving ? "Enregistrement..." : isNew ? "Créer le projet" : "Enregistrer"}
        </button>
        <button type="button" onClick={onCancel} className="btn-outline" style={{ cursor: "pointer" }} data-testid="editor-cancel">
          Annuler
        </button>
      </div>
    </form>
  );
}
