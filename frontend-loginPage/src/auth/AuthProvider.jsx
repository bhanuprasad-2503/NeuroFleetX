import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import api from "../services/api";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("nf_token"));
  const [role, setRole] = useState(() => localStorage.getItem("nf_role"));
  const [loading, setLoading] = useState(false);

  // -----------------------------------------
  // 1️⃣ SET AUTH HEADER WHEN TOKEN CHANGES
  // -----------------------------------------
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem("nf_token", token);
    } else {
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem("nf_token");
    }
  }, [token]);

  // -----------------------------------------
  // 2️⃣ SYNC ROLE WITH LOCALSTORAGE
  // -----------------------------------------
  useEffect(() => {
    if (role) localStorage.setItem("nf_role", role);
    else localStorage.removeItem("nf_role");
  }, [role]);

  // -----------------------------------------
  // 3️⃣ LOGIN FUNCTION
  // -----------------------------------------
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", { email, password });

      const { token: newToken, role: newRole } = response.data;

      if (newToken) {
        setToken(newToken);
        setRole(newRole || "CUSTOMER");
      }

      return response;
    } catch (err) {
      console.error("❌ Login failed:", err);
      throw err?.response?.data || err;
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // 4️⃣ SIGNUP FUNCTION
  // -----------------------------------------
  const signup = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post("/api/auth/signup", payload);
      return response;
    } catch (err) {
      console.error("❌ Signup failed:", err);
      throw err?.response?.data || err;
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // 5️⃣ LOGOUT FUNCTION
  // -----------------------------------------
  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("nf_token");
    localStorage.removeItem("nf_role");
    delete api.defaults.headers.common.Authorization;
  };

  // -----------------------------------------
  // 6️⃣ CHECK IF USER IS LOGGED IN
  // -----------------------------------------
  const isAuthenticated = Boolean(token);

  // -----------------------------------------
  // 7️⃣ PROVIDER VALUE
  // -----------------------------------------
  const value = useMemo(
    () => ({
      token,
      role,
      isAuthenticated,
      loading,
      login,
      signup,
      logout,
    }),
    [token, role, isAuthenticated, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
