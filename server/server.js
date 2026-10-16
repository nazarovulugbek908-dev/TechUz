import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db.js';
import { authenticate } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(authenticate);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'TechUz Production API', time: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 TechUz Real Backend Server running on http://localhost:${PORT}`);
});
