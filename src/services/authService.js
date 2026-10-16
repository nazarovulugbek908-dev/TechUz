import { supabase } from '../lib/supabase';

const TOKEN_KEY = 'techuz_jwt_token';
const CURRENT_USER_KEY = 'techuz_current_user';

export const authService = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
  },

  setToken(token, remember = true) {
    if (token) {
      if (remember) {
        localStorage.setItem(TOKEN_KEY, token);
        sessionStorage.removeItem(TOKEN_KEY);
      } else {
        sessionStorage.setItem(TOKEN_KEY, token);
        localStorage.removeItem(TOKEN_KEY);
      }
    } else {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
    }
  },

  /**
   * Get current authenticated user session (Supabase first, fallback to local backend)
   */
  async getCurrentUser() {
    // 1. Try Supabase active session
    try {
      const { data: supaSessionData, error: supaErr } = await supabase.auth.getSession();
      if (!supaErr && supaSessionData?.session?.user) {
        const supaUser = supaSessionData.session.user;
        const user = {
          id: supaUser.id,
          email: supaUser.email,
          fullName:
            supaUser.user_metadata?.full_name ||
            supaUser.user_metadata?.fullName ||
            supaUser.email?.split('@')[0] ||
            'Mijoz',
          phone: supaUser.user_metadata?.phone || supaUser.phone || '',
          role: supaUser.user_metadata?.role || 'customer',
          city: supaUser.user_metadata?.city || 'Toshkent',
          streetAddress:
            supaUser.user_metadata?.street_address ||
            supaUser.user_metadata?.streetAddress ||
            ''
        };

        if (supaSessionData.session.access_token) {
          this.setToken(supaSessionData.session.access_token, true);
        }

        return {
          data: {
            user,
            session: {
              accessToken: supaSessionData.session.access_token,
              user
            }
          },
          error: null
        };
      }
    } catch (err) {
      console.warn('Supabase getSession error:', err);
    }

    // 2. Check local stored user (e.g. from registration without email confirmation requirement)
    const storedUserJson = localStorage.getItem(CURRENT_USER_KEY);
    const token = this.getToken();
    if (storedUserJson && token) {
      try {
        const storedUser = JSON.parse(storedUserJson);
        if (storedUser && storedUser.email) {
          return {
            data: {
              user: storedUser,
              session: { accessToken: token, user: storedUser }
            },
            error: null
          };
        }
      } catch (e) {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }

    // 3. Fallback to local server /api/auth/me (for admin & local SQLite accounts)
    if (!token) {
      return { data: { user: null, session: null }, error: null };
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        this.setToken(null);
        localStorage.removeItem(CURRENT_USER_KEY);
        return { data: { user: null, session: null }, error: null };
      }

      const json = await res.json();
      return {
        data: {
          user: json.user,
          session: { accessToken: token, user: json.user }
        },
        error: null
      };
    } catch (err) {
      console.error('Failed to load current user:', err);
      return { data: { user: null, session: null }, error: err };
    }
  },

  /**
   * Sign in with email/phone and password using Supabase with local fallback
   */
  async signIn({ email, password, remember = true }) {
    const cleanedIdentifier = email.trim().toLowerCase();

    // 1. Try Supabase Auth first (for valid emails)
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedIdentifier);
    if (isEmail) {
      try {
        const { data: supaData, error: supaError } = await supabase.auth.signInWithPassword({
          email: cleanedIdentifier,
          password
        });

        if (!supaError && supaData?.user) {
          const supaUser = supaData.user;
          const user = {
            id: supaUser.id,
            email: supaUser.email,
            fullName:
              supaUser.user_metadata?.full_name ||
              supaUser.user_metadata?.fullName ||
              supaUser.email?.split('@')[0] ||
              'Mijoz',
            phone: supaUser.user_metadata?.phone || supaUser.phone || '',
            role: supaUser.user_metadata?.role || 'customer',
            city: supaUser.user_metadata?.city || 'Toshkent',
            streetAddress:
              supaUser.user_metadata?.street_address ||
              supaUser.user_metadata?.streetAddress ||
              ''
          };

          const token = supaData.session?.access_token || `supa_token_${supaUser.id}`;
          this.setToken(token, remember);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

          return {
            data: {
              user,
              session: { accessToken: token, user }
            },
            error: null
          };
        }

        // If email not confirmed in Supabase, check local server fallback or local storage
        if (supaError && supaError.message?.toLowerCase().includes('email not confirmed')) {
          console.info('Supabase email not confirmed, attempting direct sign-in fallback...');
        }
      } catch (err) {
        console.warn('Supabase signIn error:', err);
      }
    }

    // 2. Fallback to local SQLite API (handles phone identifiers, admin, and pre-existing local users)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password })
      });

      const json = await res.json();
      if (!res.ok) {
        return { data: null, error: { message: json.error || 'Kirishda xatolik yuz berdi' } };
      }

      this.setToken(json.token, remember);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(json.user));

      return {
        data: {
          user: json.user,
          session: { accessToken: json.token, user: json.user }
        },
        error: null
      };
    } catch (err) {
      console.error('Sign in error:', err);
      return { data: null, error: { message: 'Serverga ulanib bo‘lmadi. Qaytadan urinib ko‘ring.' } };
    }
  },

  /**
   * Sign up (Customer registration) using Supabase WITHOUT email confirmation requirement
   */
  async signUp({ email, password, fullName, phone, city, streetAddress }) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanPhone = phone?.trim() || '';

    // 1. Try Supabase Auth Sign Up
    let supabaseSuccess = false;
    let createdUser = null;

    try {
      const { data: supaData, error: supaError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            fullName: cleanName,
            phone: cleanPhone,
            city: city || 'Toshkent',
            street_address: streetAddress || '',
            role: 'customer'
          }
        }
      });

      if (supaError) {
        // If duplicate email in Supabase
        if (
          supaError.message?.toLowerCase().includes('already registered') ||
          supaError.status === 422
        ) {
          return {
            data: null,
            error: { message: 'Ushbu email manzili bilan allaqachon hisob ochilgan.' }
          };
        }
        console.warn('Supabase signUp error, continuing with local fallback:', supaError.message);
      } else if (supaData?.user) {
        supabaseSuccess = true;
        const supaUser = supaData.user;
        createdUser = {
          id: supaUser.id,
          email: supaUser.email || cleanEmail,
          fullName: cleanName,
          phone: cleanPhone,
          role: 'customer',
          city: city || 'Toshkent',
          streetAddress: streetAddress || ''
        };

        const token = supaData.session?.access_token || `supa_auth_${supaUser.id}`;
        this.setToken(token, true);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(createdUser));
      }
    } catch (err) {
      console.warn('Supabase signUp network error:', err);
    }

    // 2. Also register in local SQLite DB in parallel for backend compatibility (orders, admin customers)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password,
          fullName: cleanName,
          phone: cleanPhone,
          city: city || 'Toshkent',
          streetAddress: streetAddress || ''
        })
      });

      const json = await res.json();
      if (res.ok && json?.user) {
        if (!createdUser) {
          createdUser = json.user;
          this.setToken(json.token, true);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(createdUser));
        }
      } else if (!supabaseSuccess && !res.ok) {
        return { data: null, error: { message: json.error || 'Ro‘yxatdan o‘tishda xatolik yuz berdi' } };
      }
    } catch (err) {
      if (!supabaseSuccess) {
        return { data: null, error: { message: 'Serverga ulanib bo‘lmadi. Qaytadan urinib ko‘ring.' } };
      }
    }

    if (createdUser) {
      const token = this.getToken() || `token_${createdUser.id}`;
      return {
        data: {
          user: createdUser,
          session: { accessToken: token, user: createdUser }
        },
        error: null
      };
    }

    return {
      data: null,
      error: { message: 'Ro‘yxatdan o‘tishda xatolik yuz berdi. Iltimos qaytadan urining.' }
    };
  },

  /**
   * Update profile
   */
  async updateProfile(updates) {
    // 1. Update in Supabase
    try {
      await supabase.auth.updateUser({
        data: {
          full_name: updates.fullName,
          fullName: updates.fullName,
          phone: updates.phone,
          city: updates.city,
          street_address: updates.streetAddress
        }
      });
    } catch (err) {
      console.warn('Supabase profile update warning:', err);
    }

    // 2. Update stored user
    const storedUserJson = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUserJson) {
      try {
        const stored = JSON.parse(storedUserJson);
        const updated = { ...stored, ...updates };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
      } catch (e) {}
    }

    // 3. Update local server DB
    const token = this.getToken();
    if (token) {
      try {
        const res = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updates)
        });

        const json = await res.json();
        if (res.ok) {
          return { data: { user: json.user }, error: null };
        }
      } catch (err) {}
    }

    return {
      data: {
        user: { ...updates }
      },
      error: null
    };
  },

  /**
   * Forgot password request
   */
  async forgotPassword(identifier) {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim());

    if (isEmail) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(identifier.trim(), {
          redirectTo: `${window.location.origin}/reset-password`
        });
        if (!error) {
          return { data: { message: 'Tiklash xabari yuborildi' }, error: null };
        }
      } catch (err) {
        console.warn('Supabase reset password warning:', err);
      }
    }

    // Fallback to local server
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });

      const json = await res.json();
      if (!res.ok) {
        return { data: null, error: { message: json.error || 'Foydalanuvchi topilmadi' } };
      }

      return { data: json, error: null };
    } catch (err) {
      return { data: null, error: { message: 'Serverga ulanib bo‘lmadi' } };
    }
  },

  /**
   * Reset password
   */
  async resetPassword({ resetToken, newPassword }) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (!error && data?.user) {
        return { data, error: null };
      }
    } catch (err) {}

    // Fallback to local server
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword })
      });

      const json = await res.json();
      if (!res.ok) {
        return { data: null, error: { message: json.error || 'Parolni tiklab bo‘lmadi' } };
      }

      return { data: json, error: null };
    } catch (err) {
      return { data: null, error: { message: 'Serverga ulanib bo‘lmadi' } };
    }
  },

  /**
   * Sign out
   */
  async signOut() {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut error:', err);
    }
    this.setToken(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    return { error: null };
  },

  /**
   * Get all registered customers for admin
   */
  async getUsers(search = '') {
    // 1. Try Supabase profiles
    try {
      let query = supabase.from('profiles').select('*');
      if (search && search.trim()) {
        const s = search.trim();
        query = query.or(`full_name.ilike.%${s}%,email.ilike.%${s}%,phone.ilike.%${s}%,city.ilike.%${s}%`);
      }
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        return {
          data: data.map((p) => ({
            id: p.id,
            email: p.email,
            fullName: p.full_name,
            full_name: p.full_name,
            phone: p.phone,
            role: p.role,
            city: p.city,
            streetAddress: p.street_address,
            street_address: p.street_address,
            createdAt: p.created_at,
            created_at: p.created_at
          })),
          error: null
        };
      }
    } catch (err) {
      console.warn('Supabase getUsers fallback:', err);
    }

    // 2. Fallback to local server API
    const adminToken = localStorage.getItem('techuz_admin_token') || this.getToken();
    try {
      const res = await fetch(`/api/admin/customers?search=${encodeURIComponent(search)}`, {
        headers: adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}
      });
      if (res.ok) {
        const json = await res.json();
        return { data: json.data || [], error: null };
      }
      return { data: [], error: null };
    } catch (err) {
      return { data: [], error: err };
    }
  },

  async getUsersCount() {
    const res = await this.getUsers();
    return (res.data || []).length;
  }
};
