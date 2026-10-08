import { storage } from '../utils/storage';
import { generateOrderId } from '../utils/formatters';

const ORDERS_STORAGE_KEY = 'techuz_mock_orders';

const DEFAULT_ORDERS = [
  {
    id: 'ord-1710001001',
    orderNumber: 'UZ-849201',
    userId: 'usr-default-01',
    isGuest: false,
    customer: {
      fullName: 'Ulugbek Nazarov',
      phone: '+998 94 587-64-72',
      region: 'Fargʻona viloyati',
      cityDistrict: 'Quvasoy shahri',
      streetAddress: 'Quvasoy shahri, Markaziy ko\'cha, 1-uy',
      notes: 'Iltimos, soat 18:00 dan keyin yetkazing'
    },
    items: [
      {
        id: 'iphone-15-pro-max',
        name_uz: 'iPhone 15 Pro Max',
        name_ru: 'iPhone 15 Pro Max',
        price: 15450000,
        quantity: 1,
        color: 'Natural Titanium',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'ugreen-gan-65w',
        name_uz: 'Ugreen Nexode 65W GaN Quvvatlagich',
        name_ru: 'Зарядное устройство Ugreen Nexode 65W GaN',
        price: 345000,
        quantity: 1,
        color: 'Space Gray',
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 15795000,
    deliveryFee: 0,
    total: 15795000,
    paymentMethod: 'cash',
    status: 'pending', // pending | confirmed | shipped | completed | cancelled
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'ord-1710001002',
    orderNumber: 'UZ-732910',
    userId: null,
    isGuest: true,
    customer: {
      fullName: 'Ulugbek Nazarov',
      phone: '+998 94 587-64-72',
      region: 'Fargʻona viloyati',
      cityDistrict: 'Quvasoy shahri',
      streetAddress: 'Quvasoy shahri, Mustaqillik ko\'chasi, 24-uy',
      notes: ''
    },
    items: [
      {
        id: 'samsung-s24-ultra',
        name_uz: 'Samsung Galaxy S24 Ultra',
        name_ru: 'Samsung Galaxy S24 Ultra',
        price: 14200000,
        quantity: 1,
        color: 'Titanium Black',
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 14200000,
    deliveryFee: 0,
    total: 14200000,
    paymentMethod: 'cash',
    status: 'shipped',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

function getStoredOrders() {
  const orders = storage.get(ORDERS_STORAGE_KEY, null);
  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    storage.set(ORDERS_STORAGE_KEY, DEFAULT_ORDERS);
    return DEFAULT_ORDERS;
  }
  const updated = orders.map((o) => {
    if (o.customer) {
      return {
        ...o,
        customer: {
          ...o.customer,
          fullName: 'Ulugbek Nazarov',
          phone: '+998 94 587-64-72',
          region: 'Fargʻona viloyati',
          cityDistrict: 'Quvasoy shahri',
          streetAddress: o.customer.streetAddress?.includes('Quvasoy') ? o.customer.streetAddress : 'Quvasoy shahri, Markaziy ko\'cha, 1-uy'
        }
      };
    }
    return o;
  });
  storage.set(ORDERS_STORAGE_KEY, updated);
  return updated;
}

/**
 * Order placement and retrieval service (Frontend-Only Mock)
 */
export const orderService = {
  /**
   * Create new order (supports both guest and authenticated users)
   */
  async createOrder({
    customer,
    items,
    subtotal,
    deliveryFee = 0,
    total,
    paymentMethod = 'cash',
    notes = '',
    userId = null
  }) {
    if (!items || items.length === 0) {
      return {
        data: null,
        error: { message: 'cart.empty_error' }
      };
    }

    if (!customer || !customer.fullName || !customer.phone || !customer.streetAddress) {
      return {
        data: null,
        error: { message: 'checkout.error_missing_fields' }
      };
    }

    const orderNumber = generateOrderId();
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: userId || null,
      isGuest: !userId,
      customer: {
        fullName: customer.fullName,
        phone: customer.phone,
        region: customer.region || 'Toshkent shahri',
        cityDistrict: customer.cityDistrict || '',
        streetAddress: customer.streetAddress,
        notes: notes || ''
      },
      items: items.map((item) => ({
        id: item.id,
        name_uz: item.name_uz || item.nameUz || item.name,
        name_ru: item.name_ru || item.nameRu || item.name,
        price: item.price,
        quantity: item.quantity,
        color: item.selectedColor || null,
        image: item.images?.[0] || item.image || 'https://placehold.co/600x600/f8fafc/0f172a?text=Product'
      })),
      subtotal: Math.round(subtotal),
      deliveryFee: Math.round(deliveryFee),
      total: Math.round(total),
      paymentMethod,
      status: 'pending', // pending, confirmed, shipped, completed, cancelled
      createdAt: new Date().toISOString()
    };

    const existingOrders = getStoredOrders();
    const updatedOrders = [newOrder, ...existingOrders];
    storage.set(ORDERS_STORAGE_KEY, updatedOrders);

    return {
      data: newOrder,
      orderNumber,
      error: null
    };
  },

  /**
   * Get orders for current user or all orders
   */
  async getOrders(userId = null) {
    const orders = getStoredOrders();
    if (userId) {
      return {
        data: orders.filter((o) => o.userId === userId),
        error: null
      };
    }
    return {
      data: orders,
      error: null
    };
  },

  /**
   * Get single order by orderNumber or ID
   */
  async getOrderByNumber(orderNumber) {
    const orders = getStoredOrders();
    const order = orders.find(
      (o) => o.orderNumber === orderNumber || o.id === orderNumber
    );
    if (!order) {
      return { data: null, error: { message: 'order.not_found' } };
    }
    return { data: order, error: null };
  },

  /**
   * Update order status (Admin CRUD)
   */
  async updateOrderStatus(idOrNumber, status) {
    const orders = getStoredOrders();
    const idx = orders.findIndex(
      (o) => o.id === idOrNumber || o.orderNumber === idOrNumber
    );
    if (idx === -1) {
      return { data: null, error: { message: 'order.not_found' } };
    }

    orders[idx].status = status;
    orders[idx].updatedAt = new Date().toISOString();
    storage.set(ORDERS_STORAGE_KEY, orders);

    return { data: orders[idx], error: null };
  }
};
