import { storage } from '../utils/storage';

const AUTH_STORAGE_KEY = 'techuz_mock_auth_session';
const USERS_STORAGE_KEY = 'techuz_mock_users';

const DEFAULT_USERS = [
  {
    id: 'usr-default-01',
    email: 'test@techuz.uz',
    fullName: 'Ulugbek Nazarov',
    phone: '+998 94 587-64-72',
    password: 'password123',
    city: 'Quvasoy',
    streetAddress: 'Quvasoy shahri, Markaziy ko\'cha, 1-uy',
    createdAt: new Date().toISOString()
  }
];

function getStoredUsers() {
  const users = storage.get(USERS_STORAGE_KEY, null);
  if (!users || !Array.isArray(users) || users.length === 0) {
    storage.set(USERS_STORAGE_KEY, DEFAULT_USERS);
    return DEFAULT_USERS;
  }
  // If stored user still has old mock name or city, update it to Ulugbek Nazarov / Quvasoy
  const updated = users.map((u) => {
    if (u.id === 'usr-default-01' || u.email === 'test@techuz.uz') {
      return {
        ...u,
        fullName: 'Ulugbek Nazarov',
        phone: '+998 94 587-64-72',
        city: 'Quvasoy',
        streetAddress: 'Quvasoy shahri, Markaziy ko\'cha, 1-uy'
      };
    }
    return u;
  });
  storage.set(USERS_STORAGE_KEY, updated);
  return updated;
}

/**
 * Customer Authentication & Profile Service (Frontend-Only Mock)
 */
export const authService = {
  /**
   * Get current session and user from localStorage
   */
  async getCurrentUser() {
    const session = storage.get(AUTH_STORAGE_KEY, null);
    if (!session || !session.user) {
      return { data: { user: null, session: null }, error: null };
    }
    if (session.user.id === 'usr-default-01' || session.user.fullName === 'Aziz Rahimov') {
      session.user.fullName = 'Ulugbek Nazarov';
      session.user.phone = '+998 94 587-64-72';
      session.user.city = 'Quvasoy';
      session.user.streetAddress = 'Quvasoy shahri, Markaziy ko\'cha, 1-uy';
      storage.set(AUTH_STORAGE_KEY, session);
    }
    return { data: { user: session.user, session }, error: null };
  },

  /**
   * Sign in with email and password
   */
  async signIn({ email, password }) {
    if (!email || !password) {
      return {
        data: { user: null, session: null },
        error: { message: 'auth.error_fill_required' }
      };
    }

    const users = getStoredUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!user || user.password !== password) {
      return {
        data: { user: null, session: null },
        error: { message: 'auth.invalid_credentials' }
      };
    }

    const { password: _, ...userWithoutPassword } = user;
    const session = {
      accessToken: `mock-token-${Date.now()}`,
      user: userWithoutPassword,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    };

    storage.set(AUTH_STORAGE_KEY, session);

    return {
      data: { user: userWithoutPassword, session },
      error: null
    };
  },

  /**
   * Sign up new customer
   */
  async signUp({ email, password, fullName, phone, city = '', streetAddress = '' }) {
    if (!email || !password || !fullName || !phone) {
      return {
        data: { user: null, session: null },
        error: { message: 'auth.error_fill_required' }
      };
    }

    const users = getStoredUsers();
    const existing = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (existing) {
      return {
        data: { user: null, session: null },
        error: { message: 'auth.email_exists' }
      };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      email: email.trim().toLowerCase(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      city: city.trim(),
      streetAddress: streetAddress.trim(),
      password: password,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    storage.set(USERS_STORAGE_KEY, updatedUsers);

    const { password: _, ...userWithoutPassword } = newUser;
    const session = {
      accessToken: `mock-token-${Date.now()}`,
      user: userWithoutPassword,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    };

    storage.set(AUTH_STORAGE_KEY, session);

    return {
      data: { user: userWithoutPassword, session },
      error: null
    };
  },

  /**
   * Request password reset (Simulated mock flow)
   */
  async forgotPassword(email) {
    if (!email) {
      return { error: { message: 'auth.error_fill_required' } };
    }
    const users = getStoredUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      return { error: { message: 'auth.email_not_found' } };
    }
    return { data: { success: true }, error: null };
  },

  /**
   * Reset user password (Simulated mock flow)
   */
  async resetPassword({ email, newPassword }) {
    if (!newPassword || newPassword.length < 6) {
      return { error: { message: 'auth.password_min_length' } };
    }
    const users = getStoredUsers();
    const targetEmail = (email || 'test@techuz.uz').toLowerCase().trim();
    const idx = users.findIndex((u) => u.email.toLowerCase() === targetEmail);
    if (idx === -1) {
      return { error: { message: 'auth.email_not_found' } };
    }
    users[idx].password = newPassword;
    storage.set(USERS_STORAGE_KEY, users);
    return { data: { success: true }, error: null };
  },

  /**
   * Sign out current user
   */
  async signOut() {
    storage.remove(AUTH_STORAGE_KEY);
    return { error: null };
  },

  /**
   * Update profile
   */
  async updateProfile(updates) {
    const session = storage.get(AUTH_STORAGE_KEY, null);
    if (!session || !session.user) {
      return {
        data: { user: null },
        error: { message: 'auth.unauthorized' }
      };
    }

    const updatedUser = { ...session.user, ...updates };
    session.user = updatedUser;
    storage.set(AUTH_STORAGE_KEY, session);

    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.id === updatedUser.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      storage.set(USERS_STORAGE_KEY, users);
    }

    return {
      data: { user: updatedUser },
      error: null
    };
  },

  /**
   * Get all registered demo users count (for Admin dashboard stats)
   */
  async getUsersCount() {
    const users = getStoredUsers();
    return users.length;
  }
};
