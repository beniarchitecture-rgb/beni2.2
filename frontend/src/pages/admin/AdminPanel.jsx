import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  adminLogout,
  adminMe,
  deleteProject,
  fetchAdminMessages,
  fetchProjects,
  formatApiError,
} from "@/lib/api";
import ProjectEditor from "./ProjectEditor";

import { FolderKanban, LogOut, Mail, Pencil, Plus, Trash2 } from "lucide-react";

const CATEGORY_LABELS = {
  institutional: "Institutionnel",
  residential: "Résidentiel",
  commercial: "Commercial",
  social: "Social",
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [editing, setEditing] = useState(undefined); // undefined=liste, null=nouveau, objet=édition
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminMe()
      .then(setUser)
      .catch(() => navigate("/admin/login", { replace: true }))
      .finally(() => setChecking(false));
  }, [navigate]);

  const loadProjects = useCallback(() => {
    fetchProjects()
      .then(setProjects)
      .catch((e) => setError(formatApiError(e)));
  }, []);

  useEffect(() => {
    if (user) loadProjects();
  }, [user, loadProjects]);

  useEffect(() => {
    if (user && tab === "messages") {
      fetchAdminMessages().then(setMessages).catch(() => {});
    }
  }, [user, tab]);

  const onDelete = async (id) => {
    try {
      await deleteProject(id);
      setConfirmDelete(null);
      loadProjects();
    } catch (e) {
      setError(formatApiError(e));
    }
  };

  const onLogout = async () => {
    try {
      await adminLogout();
    } catch (e) {}
    navigate("/admin/login", { replace: true });
  };

  if (checking) {
    return <div className="min-h-screen" style={{ background: "#0E1017" }} data-testid="admin-loading" />;
  }
  if (!user) return null;

  const tabBtn = (key, label, Icon, testId) => (
    <button
      key={key}
      onClick={() => { setTab(key); setEditing(undefined); }}
      className="inline-flex items-center gap-2 pb-2 transition-colors"
      style={{
        color: tab === key ? "#E8600A" : "#8A8680",
        fontSize: "0.7rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        borderBottom: tab === key ? "1px solid #E8600A" : "1px solid transparent",
        cursor: "pointer",
        background: "none",
      }}
      data-testid={testId}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );

  return (
    <div className="min-h-screen" style={{ background: "#0E1017", fontFamily: "'Outfit', sans-serif" }} data-testid="admin-panel">
      {/* Top bar */}
      <header
        className="flex items-center justify-between px-6 md:px-12 py-5 border-b"
        style={{ borderColor: "rgba(232, 96, 10, 0.22)", background: "#161920" }}
        data-testid="admin-topbar"
      >
        <div>
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.35em", color: "#E8600A", textTransform: "uppercase" }}>
            Administration
          </span>
          <h1 className="text-white" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 300 }} data-testid="admin-title">
            BENI <em style={{ fontStyle: "italic", color: "#FF8533" }}>Architecture</em>
          </h1>
        </div>
        <div className="flex items-center gap-5">
          <span className="hidden md:inline" style={{ fontSize: "0.7rem", color: "#5A5854" }} data-testid="admin-user-email">
            {user.email}
          </span>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 hover:text-[#E8600A] transition-colors"
            style={{ color: "#8A8680", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", background: "none" }}
            data-testid="admin-logout"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-12 py-10">
        {/* Tabs */}
        <div className="flex gap-8 mb-10" data-testid="admin-tabs">
          {tabBtn("projects", `Projets (${projects.length})`, FolderKanban, "admin-tab-projects")}
          {tabBtn("messages", "Messages", Mail, "admin-tab-messages")}
        </div>

        {error && (
          <p className="mb-6" style={{ color: "#f87171", fontSize: "0.8rem" }} data-testid="admin-error">
            {error}
          </p>
        )}

        {tab === "projects" && editing === undefined && (
          <div data-testid="admin-projects-list">
            <button
              onClick={() => setEditing(null)}
              className="btn-orange inline-flex items-center gap-2 mb-8"
              style={{ cursor: "pointer" }}
              data-testid="admin-new-project"
            >
              <Plus className="h-4 w-4" /> Nouveau projet
            </button>

            <div className="space-y-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 p-4 border"
                  style={{ background: "#161920", borderColor: "rgba(232, 96, 10, 0.22)" }}
                  data-testid={`admin-project-row-${p.id}`}
                >
                  <div
                    className="h-14 w-20 flex-shrink-0"
                    style={{ backgroundImage: `url(${p.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-white truncate" style={{ fontSize: "0.9rem" }} data-testid={`admin-project-title-${p.id}`}>
                      {p.title?.fr}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "#5A5854", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {CATEGORY_LABELS[p.category] || p.category} · {p.location?.fr || "—"}
                    </div>
                  </div>
                  <button
                    onClick={() => setEditing(p)}
                    className="inline-flex items-center gap-1 hover:text-[#E8600A] transition-colors"
                    style={{ color: "#8A8680", fontSize: "0.7rem", cursor: "pointer", background: "none" }}
                    data-testid={`admin-edit-${p.id}`}
                  >
                    <Pencil className="h-4 w-4" /> Modifier
                  </button>
                  {confirmDelete === p.id ? (
                    <button
                      onClick={() => onDelete(p.id)}
                      style={{ color: "#f87171", fontSize: "0.7rem", cursor: "pointer", background: "none", letterSpacing: "0.05em" }}
                      data-testid={`admin-confirm-delete-${p.id}`}
                    >
                      Confirmer ?
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(p.id)}
                      className="inline-flex items-center gap-1 hover:text-red-400 transition-colors"
                      style={{ color: "#8A8680", fontSize: "0.7rem", cursor: "pointer", background: "none" }}
                      data-testid={`admin-delete-${p.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "projects" && editing !== undefined && (
          <div
            className="p-8 border"
            style={{ background: "#161920", borderColor: "rgba(232, 96, 10, 0.22)" }}
            data-testid="admin-project-editor"
          >
            <h2 className="text-white mb-8" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300 }} data-testid="admin-editor-title">
              {editing ? `Modifier : ${editing.title?.fr}` : "Nouveau projet"}
            </h2>
            <ProjectEditor
              project={editing}
              onSaved={() => { setEditing(undefined); loadProjects(); }}
              onCancel={() => setEditing(undefined)}
            />
          </div>
        )}

        {tab === "messages" && (
          <div className="space-y-4" data-testid="admin-messages-list">
            {messages.length === 0 && (
              <p style={{ color: "#8A8680", fontSize: "0.85rem" }} data-testid="admin-messages-empty">
                Aucun message pour l'instant.
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className="p-6 border"
                style={{ background: "#161920", borderColor: "rgba(232, 96, 10, 0.22)" }}
                data-testid={`admin-message-${m.id}`}
              >
                <div className="flex flex-wrap justify-between gap-2 mb-3">
                  <span className="text-white" style={{ fontSize: "0.9rem" }} data-testid={`admin-message-name-${m.id}`}>
                    {m.name} <span style={{ color: "#5A5854", fontSize: "0.75rem" }}>· {m.email}</span>
                  </span>
                  <span style={{ fontSize: "0.65rem", color: "#5A5854" }}>
                    {m.created_at ? new Date(m.created_at).toLocaleString("fr-FR") : ""}
                  </span>
                </div>
                {m.subject && (
                  <p style={{ fontSize: "0.75rem", color: "#E8600A", marginBottom: "0.4rem" }}>{m.subject}</p>
                )}
                <p style={{ fontSize: "0.85rem", color: "#8A8680", lineHeight: 1.7 }}>{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
