import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: [
        'https://teashop-tvl.web.app',
        'http://localhost:5173',
        'http://localhost:3000',
        'https://teashop-9dk1.onrender.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is missing in .env file');
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is missing in .env file');
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        // Do not exit, just log, so server stays up for other routes if possible (though DB is needed)
    });

// Schemas
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['tea', 'snacks'], required: true },
    costPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    hasMilk: { type: Boolean, default: false }
}, { timestamps: true });

const saleSchema = new mongoose.Schema({
    tokenNumber: { type: String, required: true, unique: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        total: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cash', 'phonePe', 'gpay', 'card'], required: true }
}, { timestamps: true });

const milkTrackingSchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true },
    morningMilk: { type: Number, required: true },
    eveningMilk: { type: Number, required: true },
    teaCupsSold: { type: Number, default: 0 }
}, { timestamps: true });

const auditLogSchema = new mongoose.Schema({
    action: { type: String, required: true }, // 'DELETE', 'UPDATE'
    collectionName: { type: String, required: true },
    documentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    oldValue: { type: Object },
    newValue: { type: Object },
    performedBy: { type: String, default: 'user' }, // Could be user ID if auth extended
    timestamp: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Sale = mongoose.model('Sale', saleSchema);
const MilkTracking = mongoose.model('MilkTracking', milkTrackingSchema);
const AuditLog = mongoose.model('AuditLog', auditLogSchema);

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Initialize default user
const initializeDefaultUser = async () => {
    try {
        const existingUser = await User.findOne({ username: 'admin' });
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({ username: 'admin', password: hashedPassword });
            console.log('✅ Default admin user created');
        }
    } catch (error) {
        console.error('Error creating default user:', error);
    }
};

initializeDefaultUser();

// Routes

// Auth
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            id: user._id,
            username: user.username,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Products
app.get('/api/products', authenticateToken, async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/products', authenticateToken, async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Sales
app.get('/api/sales', authenticateToken, async (req, res) => {
    try {
        const sales = await Sale.find().sort({ createdAt: -1 }).limit(100);
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/sales', authenticateToken, async (req, res) => {
    try {
        const { items, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in sale' });
        }

        const tokenNumber = `TKN${Date.now()}`;
        let totalAmount = 0;
        const saleItems = [];

        // Validate and process items
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) continue;

            const itemTotal = product.sellingPrice * item.quantity;
            totalAmount += itemTotal;

            saleItems.push({
                productId: product._id,
                productName: product.name,
                quantity: item.quantity,
                unitPrice: product.sellingPrice,
                total: itemTotal
            });

            // Update milk tracking
            if (product.hasMilk) {
                const today = new Date().toISOString().split('T')[0];
                await MilkTracking.findOneAndUpdate(
                    { date: today },
                    { $inc: { teaCupsSold: item.quantity } },
                    { upsert: true }
                );
            }
        }

        const sale = await Sale.create({
            tokenNumber,
            items: saleItems,
            totalAmount,
            paymentMethod
        });

        res.status(201).json(sale);
    } catch (error) {
        console.error('Error creating sale:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/sales/:id', authenticateToken, async (req, res) => {
    try {
        const { paymentMethod } = req.body;
        const sale = await Sale.findByIdAndUpdate(
            req.params.id,
            { paymentMethod },
            { new: true }
        );

        if (!sale) return res.status(404).json({ message: 'Sale not found' });

        // Log audit
        await AuditLog.create({
            action: 'UPDATE',
            collectionName: 'Sale',
            documentId: sale._id,
            newValue: { paymentMethod },
            performedBy: 'admin'
        });

        res.json(sale);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/sales/:id', authenticateToken, async (req, res) => {
    try {
        const sale = await Sale.findByIdAndDelete(req.params.id);
        if (!sale) return res.status(404).json({ message: 'Sale not found' });

        // Log audit
        await AuditLog.create({
            action: 'DELETE',
            collectionName: 'Sale',
            documentId: sale._id,
            oldValue: sale.toObject(),
            performedBy: 'admin'
        });

        res.json({ message: 'Sale deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Milk Tracking
app.get('/api/milk-tracking', authenticateToken, async (req, res) => {
    try {
        const records = await MilkTracking.find().sort({ date: -1 }).limit(30);
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/milk-tracking', authenticateToken, async (req, res) => {
    try {
        const { morningMilk, eveningMilk } = req.body;
        const today = new Date().toISOString().split('T')[0];

        const record = await MilkTracking.findOneAndUpdate(
            { date: today },
            { morningMilk, eveningMilk },
            { upsert: true, new: true }
        );

        res.json(record);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Dashboard Stats
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const dailySales = await Sale.find({ createdAt: { $gte: today } });
        const monthlySales = await Sale.find({ createdAt: { $gte: startOfMonth } });

        const dailyRevenue = dailySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const monthlyRevenue = monthlySales.reduce((sum, sale) => sum + sale.totalAmount, 0);

        // Top selling item
        const productCounts = {};
        monthlySales.forEach(sale => {
            if (sale.items) {
                sale.items.forEach(item => {
                    productCounts[item.productName] = (productCounts[item.productName] || 0) + item.quantity;
                });
            }
        });

        const topSellingItem = Object.keys(productCounts).length > 0
            ? Object.keys(productCounts).reduce((a, b) => productCounts[a] > productCounts[b] ? a : b)
            : '-';

        const recentSales = await Sale.find({ createdAt: { $gte: today } })
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            dailySales: dailySales.length,
            dailyRevenue,
            monthlySales: monthlySales.length,
            monthlyRevenue,
            topSellingItem,
            totalTransactions: monthlySales.length,
            recentSales
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Analytics
app.get('/api/analytics', authenticateToken, async (req, res) => {
    try {
        const { month, year } = req.query;
        const now = new Date();
        const currentYear = year ? parseInt(year) : now.getFullYear();
        const currentMonth = month ? parseInt(month) : now.getMonth();

        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

        const sales = await Sale.find({
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });

        // Best selling items
        const productStats = {};
        sales.forEach(sale => {
            if (sale.items) {
                sale.items.forEach(item => {
                    if (!productStats[item.productName]) {
                        productStats[item.productName] = { name: item.productName, count: 0, revenue: 0 };
                    }
                    productStats[item.productName].count += item.quantity;
                    productStats[item.productName].revenue += item.total;
                });
            }
        });

        const bestSellingItems = Object.values(productStats)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Sales by payment method
        const paymentStats = {};
        sales.forEach(sale => {
            if (!paymentStats[sale.paymentMethod]) {
                paymentStats[sale.paymentMethod] = { method: sale.paymentMethod, count: 0, total: 0 };
            }
            paymentStats[sale.paymentMethod].count += 1;
            paymentStats[sale.paymentMethod].total += sale.totalAmount;
        });

        const salesByPayment = Object.values(paymentStats);

        // Peak hours
        const hourStats = {};
        sales.forEach(sale => {
            const hour = new Date(sale.createdAt).getHours();
            hourStats[hour] = (hourStats[hour] || 0) + 1;
        });

        const peakHours = Object.entries(hourStats)
            .map(([hour, count]) => ({ hour: parseInt(hour), count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);

        res.json({
            bestSellingItems,
            salesByPayment,
            peakHours,
            monthlyTrend: []
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Serve static files from the React app
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
