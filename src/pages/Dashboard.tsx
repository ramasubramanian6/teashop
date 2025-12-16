import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import { format } from 'date-fns';
import './Dashboard.css';

interface DashboardStats {
    dailySales: number;
    dailyRevenue: number;
    monthlySales: number;
    monthlyRevenue: number;
    topSellingItem: string;
    totalTransactions: number;
    recentSales: Array<{
        _id: string;
        tokenNumber: string;
        items: Array<{
            productName: string;
            quantity: number;
        }>;
        totalAmount: number;
        paymentMethod: string;
        createdAt: string;
    }>;
}

const Dashboard: React.FC = () => {
    const { t, language } = useLanguage();
    const [stats, setStats] = useState<DashboardStats>({
        dailySales: 0,
        dailyRevenue: 0,
        monthlySales: 0,
        monthlyRevenue: 0,
        topSellingItem: '-',
        totalTransactions: 0,
        recentSales: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/api/dashboard/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
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
        <div className="dashboard">
            <div className="page-header">
                <h1 className="page-title">{t('dashboard')}</h1>
                <p className="page-subtitle">
                    {format(new Date(), 'EEEE, MMMM d, yyyy')}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid grid grid-4">
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.dailySales}</div>
                        <div className="stat-label">{t('dailySales')}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <div className="stat-value">₹{stats.dailyRevenue.toFixed(2)}</div>
                        <div className="stat-label">{t('todayRevenue')}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.monthlySales}</div>
                        <div className="stat-label">{t('monthlySales')}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">💵</div>
                    <div className="stat-content">
                        <div className="stat-value">₹{stats.monthlyRevenue.toFixed(2)}</div>
                        <div className="stat-label">{t('monthlyRevenue')}</div>
                    </div>
                </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-2 mt-lg">
                <div className="card">
                    <h3 className="card-title">
                        <span>🏆</span>
                        <span>{t('topSellingItem')}</span>
                    </h3>
                    <div className="top-item-display">
                        <div className="top-item-name">{stats.topSellingItem}</div>
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-title">
                        <span>🔢</span>
                        <span>{t('totalTransactions')}</span>
                    </h3>
                    <div className="top-item-display">
                        <div className="top-item-name">{stats.totalTransactions}</div>
                    </div>
                </div>
            </div>

            {/* Recent Sales */}
            <div className="card mt-lg">
                <h3 className="card-title">
                    <span>🕒</span>
                    <span>{language === 'ta' ? 'சமீபத்திய விற்பனைகள்' : 'Recent Sales'}</span>
                </h3>

                {stats.recentSales.length > 0 ? (
                    <div className="recent-sales-list">
                        {stats.recentSales.map((sale) => (
                            <div key={sale._id} className="recent-sale-item">
                                <div className="sale-info">
                                    <span className="sale-token">#{sale.tokenNumber.slice(-4)}</span>
                                    <div className="sale-products">
                                        {sale.items && sale.items.map((item, idx) => (
                                            <span key={idx}>
                                                {item.productName} ({item.quantity})
                                                {idx < sale.items.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="sale-meta">
                                    <span className="sale-amount">₹{sale.totalAmount}</span>
                                    <span className="sale-time">
                                        {format(new Date(sale.createdAt), 'h:mm a')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <p>{language === 'ta' ? 'இன்று விற்பனை இல்லை' : 'No sales today'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
