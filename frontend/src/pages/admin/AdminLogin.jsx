import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { adminLogin, formatApiError } from "@/lib/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin(email.trim(), password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#0E1017", fontFamily: "'Outfit', sans-serif" }}
      data-testid="admin-login-page"
    >
      <div
        className="w-full max-w-md p-10 border"
        style={{ background: "#161920", borderColor: "rgba(232, 96, 10, 0.22)" }}
      >
        <div className="mb-10">
          <div className="section-label">
            <div className="line" />
            <span>Administration</span>
          </div>
          <h1
            className="text-white mt-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300 }}
            data-testid="admin-login-title"
          >
            BENI <em style={{ fontStyle: "italic", color: "#FF8533" }}>Architecture</em>
          </h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-6" data-testid="admin-login-form">
          <div>
            <label
              htmlFor="admin-email"
              className="block mb-2"
              style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "#E8600A", textTransform: "uppercase" }}
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-white outline-none focus:border-[#E8600A] transition-colors"
              style={{ background: "#0E1017", border: "1px solid rgba(232, 96, 10, 0.22)", fontSize: "0.85rem", cursor: "auto" }}
              data-testid="admin-login-email"
              autoComplete="username"
            />
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="block mb-2"
              style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "#E8600A", textTransform: "uppercase" }}
            >
              Mot de passe
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-white outline-none focus:border-[#E8600A] transition-colors"
              style={{ background: "#0E1017", border: "1px solid rgba(232, 96, 10, 0.22)", fontSize: "0.85rem", cursor: "auto" }}
              data-testid="admin-login-password"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p style={{ color: "#f87171", fontSize: "0.8rem" }} data-testid="admin-login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-orange w-full"
            style={{ cursor: "pointer", opacity: loading ? 0.6 : 1 }}
            data-testid="admin-login-submit"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <a
          href="/"
          className="block mt-8 text-center"
          style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#5A5854", textTransform: "uppercase" }}
          data-testid="admin-login-back-link"
        >
          ← Retour au site
        </a>
      </div>
    </div>
  );
}
