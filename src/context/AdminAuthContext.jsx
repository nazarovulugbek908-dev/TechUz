import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAuthService } from '../services/adminAuthService';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdmin() {
      try {
        const { data } = await adminAuthService.getCurrentAdmin();
        if (data) {
          setAdmin(data);
        }
      } catch (err) {
        console.error('Failed to load admin session:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdmin();
  }, []);

  const loginAdmin = async (email, password) => {
    const { data, error } = await adminAuthService.signIn({ email, password });
    if (!error && data) {
      setAdmin(data);
    }
    return { data, error };
  };

  const updateAdminProfile = async ({ name, email, newPassword }) => {
    const { data, error } = await adminAuthService.updateProfile({ name, email, newPassword });
    if (!error && data) {
      setAdmin(data);
    }
    return { data, error };
  };

  const logoutAdmin = async () => {
    await adminAuthService.signOut();
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        isAdminAuthenticated: !!admin,
        loginAdmin,
        updateAdminProfile,
        logoutAdmin
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
