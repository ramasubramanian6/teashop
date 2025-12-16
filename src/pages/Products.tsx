import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import './Products.css';

interface Product {
    _id: string;
    name: string;
    category: 'tea' | 'snacks';
    costPrice: number;
    sellingPrice: number;
    hasMilk: boolean;
}

const Products: React.FC = () => {
    const { t, language } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'tea' as 'tea' | 'snacks',
        costPrice: '',
        sellingPrice: '',
        hasMilk: false
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const productData = {
                ...formData,
                costPrice: parseFloat(formData.costPrice),
                sellingPrice: parseFloat(formData.sellingPrice)
            };

            if (editingProduct) {
                await axios.put(`/api/products/${editingProduct._id}`, productData);
            } else {
                await axios.post('/api/products', productData);
            }

            fetchProducts();
            closeModal();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm(language === 'ta' ? 'நீக்க உறுதியா?' : 'Are you sure you want to delete?')) {
            try {
                await axios.delete(`/api/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const openModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                category: product.category,
                costPrice: product.costPrice.toString(),
                sellingPrice: product.sellingPrice.toString(),
                hasMilk: product.hasMilk
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                category: 'tea',
                costPrice: '',
                sellingPrice: '',
                hasMilk: false
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>{t('loading')}</p>
            </div>
        );
    }

    return (
        <div className="products-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('productManagement')}</h1>
                    <p className="page-subtitle">
                        {language === 'ta' ? 'தேநீர் மற்றும் சிற்றுண்டிகளை நிர்வகிக்கவும்' : 'Manage your teas and snacks'}
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <span>➕</span>
                    <span>{t('addProduct')}</span>
                </button>
            </div>

            <div className="products-grid grid grid-3">
                {products.map((product) => (
                    <div key={product._id} className="product-card glass-card">
                        <div className="product-header">
                            <div className="product-icon">
                                {product.category === 'tea' ? '🍵' : '🍪'}
                            </div>
                            <span className={`badge ${product.category === 'tea' ? 'badge-info' : 'badge-warning'}`}>
                                {t(product.category)}
                            </span>
                        </div>

                        <h3 className="product-name">{product.name}</h3>

                        {product.hasMilk && (
                            <div className="milk-indicator">
                                <span>🥛</span>
                                <span>{language === 'ta' ? 'பால் உள்ளது' : 'Contains Milk'}</span>
                            </div>
                        )}

                        <div className="product-pricing">
                            <div className="price-item">
                                <span className="price-label">{t('costPrice')}</span>
                                <span className="price-value cost">₹{product.costPrice.toFixed(2)}</span>
                            </div>
                            <div className="price-item">
                                <span className="price-label">{t('sellingPrice')}</span>
                                <span className="price-value selling">₹{product.sellingPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="profit-margin">
                            <span>{language === 'ta' ? 'லாபம்' : 'Profit'}:</span>
                            <span className="profit-value">
                                ₹{(product.sellingPrice - product.costPrice).toFixed(2)}
                            </span>
                        </div>

                        <div className="product-actions">
                            <button className="btn btn-secondary" onClick={() => openModal(product)}>
                                <span>✏️</span>
                                <span>{t('edit')}</span>
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDelete(product._id)}>
                                <span>🗑️</span>
                                <span>{t('delete')}</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <p>{language === 'ta' ? 'பொருட்கள் இல்லை' : 'No products yet'}</p>
                    <button className="btn btn-primary mt-md" onClick={() => openModal()}>
                        {t('addProduct')}
                    </button>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">
                            {editingProduct ? t('editProduct') : t('addProduct')}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label className="input-label">{t('productName')}</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">{t('category')}</label>
                                <select
                                    className="input-field"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as 'tea' | 'snacks' })}
                                >
                                    <option value="tea">{t('tea')}</option>
                                    <option value="snacks">{t('snacks')}</option>
                                </select>
                            </div>

                            <div className="grid grid-2">
                                <div className="input-group">
                                    <label className="input-label">{t('costPrice')}</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="input-field"
                                        value={formData.costPrice}
                                        onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">{t('sellingPrice')}</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="input-field"
                                        value={formData.sellingPrice}
                                        onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.hasMilk}
                                        onChange={(e) => setFormData({ ...formData, hasMilk: e.target.checked })}
                                    />
                                    <span>{t('hasMilk')}</span>
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    {t('cancel')}
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {t('save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
