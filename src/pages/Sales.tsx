import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import './Sales.css';

interface Product {
    _id: string;
    name: string;
    sellingPrice: number;
    category: 'tea' | 'snacks';
}

interface SaleItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface Sale {
    _id: string;
    tokenNumber: string;
    items: SaleItem[];
    totalAmount: number;
    paymentMethod: string;
    createdAt: string;
}

interface CartItem {
    product: Product;
    quantity: number;
}

const Sales: React.FC = () => {
    const { t, language } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchSales();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchSales = async () => {
        try {
            const response = await axios.get('/api/sales');
            setSales(response.data);
        } catch (error) {
            console.error('Error fetching sales:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProductClick = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product._id === product._id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { product, quantity: 1 }];
            }
        });
    };

    const handleQuantityChange = (productId: string, delta: number) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.product._id === productId) {
                    const newQuantity = item.quantity + delta;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
                }
                return item;
            });
        });
    };

    const handleRemoveItem = (productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.product._id !== productId));
    };

    const handlePayment = async (method: string) => {
        if (cart.length === 0) return;
        setIsProcessing(true);

        try {
            const items = cart.map(item => ({
                productId: item.product._id,
                quantity: item.quantity
            }));

            await axios.post('/api/sales', {
                items,
                paymentMethod: method
            });

            setCart([]);
            fetchSales();
        } catch (error) {
            console.error('Error recording sale:', error);
            alert(language === 'ta' ? 'பிழை ஏற்பட்டது' : 'Error recording sale');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleEditSale = async (sale: Sale) => {
        const newPaymentMethod = prompt(
            language === 'ta'
                ? 'புதிய கட்டண முறையை உள்ளிடவும் (cash/gpay/phonePe):'
                : 'Enter new payment method (cash/gpay/phonePe):',
            sale.paymentMethod
        );

        if (newPaymentMethod && ['cash', 'gpay', 'phonePe'].includes(newPaymentMethod)) {
            try {
                await axios.put(`/api/sales/${sale._id}`, { paymentMethod: newPaymentMethod });
                fetchSales();
            } catch (error) {
                console.error('Error updating sale:', error);
                alert(language === 'ta' ? 'புதுப்பிப்பதில் பிழை' : 'Error updating sale');
            }
        } else if (newPaymentMethod) {
            alert(language === 'ta' ? 'செல்லுபடியாகாத கட்டண முறை' : 'Invalid payment method');
        }
    };

    const handleDeleteSale = async (saleId: string) => {
        if (confirm(language === 'ta' ? 'இந்த விற்பனையை நீக்க விரும்புகிறீர்களா?' : 'Are you sure you want to delete this sale?')) {
            try {
                await axios.delete(`/api/sales/${saleId}`);
                fetchSales();
            } catch (error) {
                console.error('Error deleting sale:', error);
                alert(language === 'ta' ? 'நீக்குவதில் பிழை' : 'Error deleting sale');
            }
        }
    };

    const totalAmount = cart.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0);

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>{t('loading')}</p>
            </div>
        );
    }

    return (
        <div className="sales-page pos-layout">
            <div className="pos-left">
                <div className="page-header">
                    <h1 className="page-title">{t('sales')}</h1>
                </div>

                {/* Product Grid */}
                <div className="product-grid">
                    {products.map((product) => (
                        <button
                            key={product._id}
                            className={`product-card ${cart.some(item => item.product._id === product._id) ? 'active' : ''} ${product.category}`}
                            onClick={() => handleProductClick(product)}
                        >
                            <div className="product-name">{product.name}</div>
                            <div className="product-price">₹{product.sellingPrice}</div>
                            {cart.find(item => item.product._id === product._id) && (
                                <div className="product-badge">
                                    {cart.find(item => item.product._id === product._id)?.quantity}
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Recent Sales List (Compact) */}
                <div className="recent-sales-compact">
                    <h3>{t('saleHistory')} (Last 5)</h3>
                    <div className="compact-list">
                        {sales.slice(0, 5).map(sale => (
                            <div key={sale._id} className="compact-sale-item">
                                <div className="sale-info-left">
                                    <span className="token">#{sale.tokenNumber.slice(-4)}</span>
                                    <div className="sale-items-summary">
                                        {sale.items && sale.items.map((item, idx) => (
                                            <span key={idx} className="summary-item">
                                                {item.productName} x{item.quantity}
                                                {idx < sale.items.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="sale-info-right">
                                    <span className="total">₹{sale.totalAmount}</span>
                                    <div className="sale-actions">
                                        <button className="icon-btn edit-btn" onClick={() => handleEditSale(sale)}>✏️</button>
                                        <button className="icon-btn delete-btn" onClick={() => handleDeleteSale(sale._id)}>🗑️</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pos-right">
                {/* Current Sale / Cart */}
                <div className="current-sale-panel">
                    <h2>{t('newSale')}</h2>

                    {cart.length > 0 ? (
                        <div className="cart-content">
                            <div className="cart-items-list">
                                {cart.map(item => (
                                    <div key={item.product._id} className="cart-item">
                                        <div className="cart-item-details">
                                            <div className="cart-item-name">{item.product.name}</div>
                                            <div className="cart-item-price">₹{item.product.sellingPrice} x {item.quantity}</div>
                                        </div>
                                        <div className="cart-item-actions">
                                            <button className="qty-btn-small" onClick={() => handleQuantityChange(item.product._id, -1)}>-</button>
                                            <span className="qty-display-small">{item.quantity}</span>
                                            <button className="qty-btn-small" onClick={() => handleQuantityChange(item.product._id, 1)}>+</button>
                                            <button className="remove-btn" onClick={() => handleRemoveItem(item.product._id)}>×</button>
                                        </div>
                                        <div className="cart-item-total">
                                            ₹{item.product.sellingPrice * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="total-section">
                                <div className="total-label">{t('total')}</div>
                                <div className="total-value">₹{totalAmount.toFixed(2)}</div>
                            </div>

                            <div className="payment-options">
                                <div className="payment-label">{t('paymentMethod')}</div>
                                <div className="payment-grid">
                                    <button className="pay-btn cash" onClick={() => handlePayment('cash')} disabled={isProcessing}>
                                        <span>💵</span> {t('cash')}
                                    </button>
                                    <button className="pay-btn gpay" onClick={() => handlePayment('gpay')} disabled={isProcessing}>
                                        <span>🔵</span> GPay
                                    </button>
                                    <button className="pay-btn phonepe" onClick={() => handlePayment('phonePe')} disabled={isProcessing}>
                                        <span>🟣</span> PhonePe
                                    </button>
                                </div>
                            </div>

                            <button className="cancel-btn" onClick={() => setCart([])} disabled={isProcessing}>
                                {t('cancel')}
                            </button>
                        </div>
                    ) : (
                        <div className="empty-cart-message">
                            <div className="icon">👈</div>
                            <p>{language === 'ta' ? 'பொருளை தேர்வு செய்யவும்' : 'Select products from the left'}</p>
                        </div>
                    )}
                </div>

                {/* Today's Stats (Compact) */}
                <div className="stats-compact">
                    <div className="stat-box">
                        <div className="label">{t('totalTransactions')}</div>
                        <div className="value">{sales.filter(s =>
                            new Date(s.createdAt).toDateString() === new Date().toDateString()
                        ).length}</div>
                    </div>
                    <div className="stat-box">
                        <div className="label">{t('todayRevenue')}</div>
                        <div className="value">₹{sales
                            .filter(s => new Date(s.createdAt).toDateString() === new Date().toDateString())
                            .reduce((sum, s) => sum + s.totalAmount, 0)
                            .toFixed(0)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sales;
