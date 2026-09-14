import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

export async function submitContactMessage(payload) {
  const res = await axios.post(`${API_BASE}/contact`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}
