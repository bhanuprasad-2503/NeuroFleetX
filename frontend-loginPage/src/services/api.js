import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8083", 
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("nf_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        localStorage.removeItem("nf_token");
        localStorage.removeItem("nf_role");
        window.location.href = "/login";
      } else if (status === 403) {
        console.error("⚠️ Forbidden access (403) — check backend CORS or SecurityConfig.");
      } else if (status >= 500) {
        console.error("💥 Server error (500)");
      }
    } else if (error.request) {
      console.error("🌐 Network error: no response from backend");
    } else {
      console.error("❌ Unexpected error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
