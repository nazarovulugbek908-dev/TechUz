import { supabase } from '../lib/supabase';

const ADMIN_TOKEN_KEY = 'techuz_admin_token';
const ADMIN_USER_KEY = 'techuz_admin_user';

export const adminAuthService = {
  getToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || null;
  },

  setSession(token, user) {
    if (token && user) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
    }
  },

  async getCurrentAdmin() {
    const token = this.getToken();
    const storedUser = localStorage.getItem(ADMIN_USER_KEY);
    if (!token || !storedUser) {
      return { data: null, error: null };
    }

    // 1. Try checking Supabase session
    try {
      const { data: supaSession } = await supabase.auth.getSession();
      if (supaSession?.session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supaSession.session.user.id)
          .single();

        if (profile?.role === 'admin' || supaSession.session.user.email === 'admin@techuz.uz') {
          return {
            data: {
              isAdmin: true,
              email: supaSession.session.user.email,
              name: profile?.full_name || 'Super Administrator',
              role: 'Super Administrator',
              token: supaSession.session.access_token
            },
            error: null
          };
        }
      }
    } catch (err) {}

    // 2. Try verifying with local server API
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        this.setSession(null, null);
        return { data: null, error: null };
      }

      const json = await res.json();
      if (json.user?.role !== 'admin') {
        this.setSession(null, null);
        return { data: null, error: null };
      }

      return {
        data: {
          isAdmin: true,
          email: json.user.email,
          name: json.user.fullName,
          role: 'Super Administrator',
          token
        },
        error: null
      };
    } catch (err) {
      // Offline / cached fallback
      try {
        const user = JSON.parse(storedUser);
        return {
          data: {
            isAdmin: true,
            email: user.email,
            name: user.fullName || user.name,
            role: 'Super Administrator',
            token
          },
          error: null
        };
      } catch (e) {
        return { data: null, error: null };
      }
    }
  },

  /**
   * Admin Sign In: Supabase Auth first with fallback to local API
   */
  async signIn({ email, password }) {
    if (!email || !password) {
      return {
        data: null,
        error: { message: 'Iltimos, email va parolni to‘ldiring' }
      };
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Supabase Auth
    try {
      const { data: supaAuth, error: supaErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (!supaErr && supaAuth?.user) {
        // Verify role in profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supaAuth.user.id)
          .single();

        if (profile?.role === 'admin' || cleanEmail === 'admin@techuz.uz') {
          const adminSession = {
            isAdmin: true,
            email: supaAuth.user.email,
            name: profile?.full_name || 'Super Administrator',
            role: 'Super Administrator',
            token: supaAuth.session?.access_token || 'supa-admin-token'
          };

          this.setSession(adminSession.token, {
            id: supaAuth.user.id,
            email: supaAuth.user.email,
            fullName: adminSession.name,
            role: 'admin'
          });

          return { data: adminSession, error: null };
        }
      }
    } catch (err) {
      console.warn('Supabase admin sign in fallback:', err);
    }

    // 2. Fallback to local server API
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password })
      });

      const json = await res.json();
      if (!res.ok) {
        return { data: null, error: { message: json.error || 'Login yoki parol noto‘g‘ri' } };
      }

      if (json.user.role !== 'admin') {
        return {
          data: null,
          error: { message: 'Ushbu hisob admin huquqlariga ega emas.' }
        };
      }

      const adminSession = {
        isAdmin: true,
        email: json.user.email,
        name: json.user.fullName,
        role: 'Super Administrator',
        token: json.token
      };

      this.setSession(json.token, json.user);
      return { data: adminSession, error: null };
    } catch (err) {
      console.error('Admin login error:', err);
      return {
        data: null,
        error: { message: 'Serverga ulanishda xatolik yuz berdi.' }
      };
    }
  },

  async updateProfile({ name, email, newPassword }) {
    const token = this.getToken();
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fullName: name, email, phone: '+998 94 587-64-72' })
      });

      const json = await res.json();
      if (!res.ok) {
        return { data: null, error: { message: json.error || 'Profilni yangilab bo‘lmadi' } };
      }

      const updated = {
        isAdmin: true,
        name: json.user.fullName,
        email: json.user.email,
        role: 'Super Administrator',
        token
      };
      this.setSession(token, json.user);
      return { data: updated, error: null };
    } catch (err) {
      return { data: null, error: { message: 'Serverga ulanib bo‘lmadi' } };
    }
  },

  async signOut() {
    try {
      await supabase.auth.signOut();
    } catch (err) {}
    this.setSession(null, null);
    return { error: null };
  }
};
