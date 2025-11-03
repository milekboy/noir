import React, { createContext, useContext, useEffect, useState } from "react";
import {
  register as apiRegister,
  login as apiLogin,
  verifyOtp as apiVerifyOtp,
} from "../lib/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      return typeof window !== "undefined" ? localStorage.getItem("token") : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Keep token in localStorage
  useEffect(() => {
    try {
      if (token) localStorage.setItem("token", token);
      else localStorage.removeItem("token");
    } catch (err) {
      // ignore storage errors
    }
  }, [token]);

  const register = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRegister(payload);
       const cookieToken =cookieStore.get("token")?.value;
      if (cookieToken) setToken(cookieToken);
      // if backend returns user data, store it
      if (res?.userData) setUser(res.userData);
      return res;
    } catch (err) {
      setError(err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiLogin(email, password);
      // common places to look for token: res.token, res.accessToken, res.data?.token
      const cookieToken =cookieStore.get("token")?.value;
      if (cookieToken) setToken(cookieToken);
      // if backend returns user info, save it
      if (res?.userData) setUser(res.userData);
      return res;
    } catch (err) {
      setError(err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiVerifyOtp(email, otp);
      if (res?.userData) setUser(res.userData);
      return res;
    } catch (err) {
      setError(err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    try {
      localStorage.removeItem("token");
    } catch {
      // ignore
    }
  };

  const value = {
    user,
    setUser,
    token,
    loading,
    error,
    register,
    login,
    verifyOtp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;