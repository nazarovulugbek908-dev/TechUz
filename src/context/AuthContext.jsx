import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAuth() {
      try {
        const { data } = await authService.getCurrentUser();
        if (data?.user) {
          setUser(data.user);
          setSession(data.session);
        }
      } catch (err) {
        console.error('Failed to load current user session:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAuth();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await authService.signIn({ email, password });
    if (!error && data?.user) {
      setUser(data.user);
      setSession(data.session);
    }
    return { data, error };
  };

  const register = async ({ email, password, fullName, phone, city, streetAddress }) => {
    const { data, error } = await authService.signUp({
      email,
      password,
      fullName,
      phone,
      city,
      streetAddress
    });
    if (!error && data?.user) {
      setUser(data.user);
      setSession(data.session);
    }
    return { data, error };
  };

  const forgotPassword = async (email) => {
    return await authService.forgotPassword(email);
  };

  const resetPassword = async ({ email, newPassword }) => {
    return await authService.resetPassword({ email, newPassword });
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (updates) => {
    const { data, error } = await authService.updateProfile(updates);
    if (!error && data?.user) {
      setUser(data.user);
    }
    return { data, error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
