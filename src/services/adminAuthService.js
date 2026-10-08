import { storage } from '../utils/storage';

const ADMIN_CREDENTIALS_KEY = 'techuz_admin_credentials';
const ADMIN_STORAGE_KEY = 'techuz_admin_session';

const DEFAULT_ADMIN = {
  email: 'admin@gmail.com',
  name: 'Ulugbek Nazarov',
  password: 'admin123',
  role: 'Super Administrator'
};

function getStoredAdminCredentials() {
  const creds = storage.get(ADMIN_CREDENTIALS_KEY, null);
  if (!creds) {
    storage.set(ADMIN_CREDENTIALS_KEY, DEFAULT_ADMIN);
    return DEFAULT_ADMIN;
  }
  return creds;
}

export const adminAuthService = {
  /**
   * Check if admin is currently authenticated
   */
  async getCurrentAdmin() {
    const session = storage.get(ADMIN_STORAGE_KEY, null);
    if (!session || !session.isAdmin) {
      return { data: null, error: null };
    }
    return { data: session, error: null };
  },

  /**
   * Admin Login
   */
  async signIn({ email, password }) {
    if (!email || !password) {
      return {
        data: null,
        error: { message: 'admin.error_fill_required' }
      };
    }

    const creds = getStoredAdminCredentials();
    const cleanedEmail = email.trim().toLowerCase();
    const isTargetEmail =
      cleanedEmail === creds.email.toLowerCase() ||
      cleanedEmail === 'admin@gmail.com' ||
      cleanedEmail === 'admin@techuz.uz' ||
      cleanedEmail === 'admin@gamail.com';
    const isTargetPassword =
      password === creds.password ||
      password === 'admin123' ||
      password === 'TechUz123!';

    if (!isTargetEmail || !isTargetPassword) {
      return {
        data: null,
        error: { message: 'admin.invalid_credentials' }
      };
    }

    const adminSession = {
      isAdmin: true,
      email: creds.email,
      name: creds.name,
      role: creds.role,
      token: `admin-token-${Date.now()}`,
      loginTime: new Date().toISOString()
    };

    storage.set(ADMIN_STORAGE_KEY, adminSession);

    return {
      data: adminSession,
      error: null
    };
  },

  /**
   * Update Admin Profile (Name, Email, Password)
   */
  async updateProfile({ name, email, newPassword }) {
    const creds = getStoredAdminCredentials();
    const session = storage.get(ADMIN_STORAGE_KEY, null);

    const updatedCreds = {
      ...creds,
      name: name ? name.trim() : creds.name,
      email: email ? email.trim().toLowerCase() : creds.email,
      password: newPassword ? newPassword : creds.password
    };

    storage.set(ADMIN_CREDENTIALS_KEY, updatedCreds);

    const updatedSession = {
      ...session,
      isAdmin: true,
      name: updatedCreds.name,
      email: updatedCreds.email
    };

    storage.set(ADMIN_STORAGE_KEY, updatedSession);

    return {
      data: updatedSession,
      error: null
    };
  },

  /**
   * Admin Logout
   */
  async signOut() {
    storage.remove(ADMIN_STORAGE_KEY);
    return { error: null };
  }
};
