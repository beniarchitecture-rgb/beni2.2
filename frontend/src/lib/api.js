import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

export function formatApiError(e) {
  const d = e?.response?.data?.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d))
    return d.map((x) => (x && typeof x.msg === "string" ? x.msg : JSON.stringify(x))).join(" ");
  return e?.message || "Une erreur est survenue.";
}

export async function submitContactMessage(payload) {
  const res = await axios.post(`${API_BASE}/contact`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

export async function fetchProjects() {
  const res = await axios.get(`${API_BASE}/projects`);
  return res.data;
}

// --- Admin auth (Bearer token en secours des cookies httpOnly) ---
const TOKEN_KEY = "beni_admin_access";
const REFRESH_KEY = "beni_admin_refresh";

const getAccessToken = () => localStorage.getItem(TOKEN_KEY) || "";
const getRefreshToken = () => localStorage.getItem(REFRESH_KEY) || "";

function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

const authed = () => ({
  withCredentials: true,
  headers: getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {},
});

async function withRefreshRetry(fn) {
  try {
    return await fn();
  } catch (e) {
    if (e?.response?.status === 401) {
      try {
        const rt = getRefreshToken();
        const res = await axios.post(
          `${API_BASE}/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: rt ? { Authorization: `Bearer ${rt}` } : {},
          }
        );
        if (res.data?.access_token) localStorage.setItem(TOKEN_KEY, res.data.access_token);
        return await fn();
      } catch (refreshErr) {
        clearTokens();
        throw e;
      }
    }
    throw e;
  }
}

export async function adminLogin(email, password) {
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password }, { withCredentials: true });
  if (res.data?.access_token) localStorage.setItem(TOKEN_KEY, res.data.access_token);
  if (res.data?.refresh_token) localStorage.setItem(REFRESH_KEY, res.data.refresh_token);
  return res.data;
}

export async function adminMe() {
  return withRefreshRetry(async () => (await axios.get(`${API_BASE}/auth/me`, authed())).data);
}

export async function adminLogout() {
  try {
    await axios.post(`${API_BASE}/auth/logout`, {}, authed());
  } catch (e) {}
  clearTokens();
}

export async function fetchAdminMessages() {
  return withRefreshRetry(async () => (await axios.get(`${API_BASE}/admin/messages`, authed())).data);
}

export async function createProject(payload) {
  return withRefreshRetry(async () => (await axios.post(`${API_BASE}/admin/projects`, payload, authed())).data);
}

export async function updateProject(id, payload) {
  return withRefreshRetry(async () => (await axios.put(`${API_BASE}/admin/projects/${id}`, payload, authed())).data);
}

export async function deleteProject(id) {
  return withRefreshRetry(async () => (await axios.delete(`${API_BASE}/admin/projects/${id}`, authed())).data);
}
