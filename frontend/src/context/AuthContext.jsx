import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize user session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.data) {
            setUser(res.data);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      if (res.success && res.data) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data);
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const res = await authApi.register(username, email, password);
      if (res.success && res.data) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data);
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    try {
      const res = await authApi.updateProfile(data);
      if (res.success && res.data) {
        setUser((prev) => ({ ...prev, ...res.data }));
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await authApi.changePassword(currentPassword, newPassword);
      return res;
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
