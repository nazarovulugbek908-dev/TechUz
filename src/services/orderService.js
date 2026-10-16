import { supabase } from '../lib/supabase';
import { authService } from './authService';
import { adminAuthService } from './adminAuthService';

export function normalizeOrder(o) {
  if (!o) return null;
  const items = Array.isArray(o.items)
    ? o.items
    : typeof o.items === 'string'
    ? (() => { try { return JSON.parse(o.items); } catch { return []; } })()
    : [];

  return {
    id: o.id,
    orderNumber: o.order_number || o.orderNumber,
    order_number: o.order_number || o.orderNumber,
    userId: o.user_id || o.userId,
    user_id: o.user_id || o.userId,
    customerName: o.customer_name || o.customerName || o.customer?.fullName || '',
    customer_name: o.customer_name || o.customerName || o.customer?.fullName || '',
    customerPhone: o.customer_phone || o.customerPhone || o.customer?.phone || '',
    customer_phone: o.customer_phone || o.customerPhone || o.customer?.phone || '',
    customerRegion: o.customer_region || o.customerRegion || o.customer?.region || '',
    customerCity: o.customer_city || o.customerCity || o.customer?.city || '',
    customerStreet: o.customer_street || o.customerStreet || o.customer?.address || '',
    customerNotes: o.customer_notes || o.customerNotes || '',
    customer: {
      fullName: o.customer_name || o.customerName || o.customer?.fullName || '',
      phone: o.customer_phone || o.customerPhone || o.customer?.phone || '',
      region: o.customer_region || o.customerRegion || o.customer?.region || '',
      city: o.customer_city || o.customerCity || o.customer?.city || '',
      streetAddress: o.customer_street || o.customerStreet || o.customer?.address || ''
    },
    subtotal: Number(o.subtotal) || 0,
    deliveryFee: Number(o.delivery_fee ?? o.deliveryFee ?? 0),
    delivery_fee: Number(o.delivery_fee ?? o.deliveryFee ?? 0),
    discount: Number(o.discount ?? 0),
    total: Number(o.total) || 0,
    paymentMethod: o.payment_method || o.paymentMethod || 'cash',
    payment_method: o.payment_method || o.paymentMethod || 'cash',
    paymentStatus: o.payment_status || o.paymentStatus || 'pending',
    payment_status: o.payment_status || o.paymentStatus || 'pending',
    status: o.status || 'pending',
    items,
    createdAt: o.created_at || o.createdAt,
    created_at: o.created_at || o.createdAt,
    updatedAt: o.updated_at || o.updatedAt,
    updated_at: o.updated_at || o.updatedAt
  };
}

export const orderService = {
  /**
   * Order Creation: Supabase first with fallback to local API
   */
  async createOrder({ customer, items, subtotal, deliveryFee, total, paymentMethod = 'cash', notes = '', userId = null }) {
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const currentCustomer = authService.getCurrentUserSync();
    const effectiveUserId = userId || currentCustomer?.id || null;

    const payload = {
      id: orderId,
      order_number: orderNumber,
      user_id: effectiveUserId,
      customer_name: customer.fullName || customer.customer_name || customer.name || '',
      customer_phone: customer.phone || '',
      customer_region: customer.region || 'Toshkent viloyati',
      customer_city: customer.city || 'Toshkent',
      customer_street: customer.address || customer.streetAddress || '',
      customer_notes: notes || '',
      subtotal: Number(subtotal) || 0,
      delivery_fee: Number(deliveryFee) || 0,
      discount: 0,
      total: Number(total) || 0,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'cash' ? 'pending' : 'paid',
      status: 'pending',
      items: items || []
    };

    // 1. Try Supabase insert
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        return { data: normalizeOrder(data), error: null };
      }
    } catch (err) {
      console.warn('Supabase createOrder fallback:', err);
    }

    // 2. Fallback to API
    const token = authService.getToken();
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          customer,
          items,
          paymentMethod,
          notes,
          userId: effectiveUserId
        })
      });

      const json = await res.json();
      if (!res.ok) {
        return { data: null, error: { message: json.error || 'Buyurtma rasmiylashtirishda xatolik yuz berdi' } };
      }

      return { data: normalizeOrder(json.data), error: null };
    } catch (err) {
      console.error('Order creation failed:', err);
      return { data: null, error: { message: 'Serverga ulanib bo‘lmadi. Qaytadan urinib ko‘ring.' } };
    }
  },

  /**
   * Order History for customer or admin
   */
  async getOrders(userId = null, { status = 'all', search = '', limit = 50, offset = 0 } = {}) {
    const adminToken = adminAuthService.getToken();
    const customer = authService.getCurrentUserSync();
    const effectiveUserId = userId || customer?.id;

    // 1. Try Supabase
    try {
      let query = supabase.from('orders').select('*', { count: 'exact' });

      // If customer and not admin
      if (!adminToken && effectiveUserId) {
        query = query.eq('user_id', effectiveUserId);
      }

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      if (search && search.trim()) {
        const s = search.trim();
        query = query.or(`order_number.ilike.%${s}%,customer_name.ilike.%${s}%,customer_phone.ilike.%${s}%`);
      }

      query = query.order('created_at', { ascending: false });

      if (limit) {
        query = query.range(offset, offset + Number(limit) - 1);
      }

      const { data, error, count } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        return {
          data: data.map(normalizeOrder),
          total: count != null ? count : data.length,
          error: null
        };
      }
    } catch (err) {
      console.warn('Supabase getOrders fallback:', err);
    }

    // 2. Fallback to API
    const customerToken = authService.getToken();
    try {
      if (adminToken) {
        const params = new URLSearchParams();
        if (status && status !== 'all') params.append('status', status);
        if (search) params.append('search', search);
        params.append('limit', String(limit));
        params.append('offset', String(offset));

        const res = await fetch(`/api/orders?${params.toString()}`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
          const json = await res.json();
          const list = (json.data || []).map(normalizeOrder);
          return { data: list, total: json.total || list.length, error: null };
        }
      }

      if (customerToken) {
        const res = await fetch('/api/orders/my-orders', {
          headers: { 'Authorization': `Bearer ${customerToken}` }
        });
        if (res.ok) {
          const json = await res.json();
          const list = (json.data || []).map(normalizeOrder);
          return { data: list, total: list.length, error: null };
        }
      }

      return { data: [], total: 0, error: null };
    } catch (err) {
      console.error('Fetch orders error:', err);
      return { data: [], total: 0, error: err };
    }
  },

  async getOrderById(id) {
    // 1. Try Supabase
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`id.eq.${id},order_number.eq.${id}`)
        .single();
      if (!error && data) {
        return { data: normalizeOrder(data), error: null };
      }
    } catch (err) {}

    // 2. Fallback to API
    const adminToken = adminAuthService.getToken();
    const customerToken = authService.getToken();
    const token = adminToken || customerToken;

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) return { data: null, error: 'Buyurtma topilmadi' };
      const json = await res.json();
      return { data: normalizeOrder(json.data), error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Admin Update Order Status
   */
  async updateOrderStatus(id, newStatus) {
    // 1. Try Supabase
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        return { data: normalizeOrder(data), error: null };
      }
    } catch (err) {
      console.warn('Supabase updateOrderStatus fallback:', err);
    }

    // 2. Fallback to API
    const adminToken = adminAuthService.getToken();
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(id)}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (!res.ok) {
        return { data: null, error: { message: json.error || 'Holatni yangilab bo‘lmadi' } };
      }
      return { data: normalizeOrder(json.data), error: null };
    } catch (err) {
      return { data: null, error: { message: 'Serverga ulanib bo‘lmadi' } };
    }
  }
};
