import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import ExcelJS from 'exceljs';
import './Analytics.css';

interface AnalyticsData {
    bestSellingItems: Array<{ name: string; count: number; revenue: number }>;
    salesByPayment: Array<{ method: string; count: number; total: number }>;
    peakHours: Array<{ hour: number; count: number }>;
    monthlyTrend: Array<{ date: string; sales: number; revenue: number }>;
}

const Analytics: React.FC = () => {
    const { t, language } = useLanguage();
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        bestSellingItems: [],
        salesByPayment: [],
        peakHours: [],
        monthlyTrend: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    // Date Filtering
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchAnalytics();
    }, [selectedMonth, selectedYear]);

    const fetchAnalytics = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/analytics', {
                params: {
                    month: selectedMonth,
                    year: selectedYear
                }
            });
            setAnalytics(response.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const exportToExcel = async () => {
        setIsExporting(true);
        try {
            const workbook = new ExcelJS.Workbook();

            // Sales Data Sheet
            const salesSheet = workbook.addWorksheet('Sales Report');
            salesSheet.columns = [
                { header: 'Date', key: 'date', width: 15 },
                { header: 'Sales Count', key: 'sales', width: 15 },
                { header: 'Revenue', key: 'revenue', width: 15 }
            ];
            analytics.monthlyTrend.forEach(item => {
                salesSheet.addRow(item);
            });

            // Best Selling Items Sheet
            const itemsSheet = workbook.addWorksheet('Best Selling Items');
            itemsSheet.columns = [
                { header: 'Product Name', key: 'name', width: 25 },
                { header: 'Quantity Sold', key: 'count', width: 15 },
                { header: 'Revenue', key: 'revenue', width: 15 }
            ];
            analytics.bestSellingItems.forEach(item => {
                itemsSheet.addRow(item);
            });

            // Payment Methods Sheet
            const paymentSheet = workbook.addWorksheet('Payment Methods');
            paymentSheet.columns = [
                { header: 'Payment Method', key: 'method', width: 20 },
                { header: 'Transactions', key: 'count', width: 15 },
                { header: 'Total Amount', key: 'total', width: 15 }
            ];
            analytics.salesByPayment.forEach(item => {
                paymentSheet.addRow(item);
            });

            // Generate file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `TeaShop_Report_${selectedYear}_${selectedMonth + 1}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(url);

            alert(language === 'ta' ? 'அறிக்கை பதிவிறக்கப்பட்டது!' : 'Report downloaded successfully!');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert(language === 'ta' ? 'ஏற்றுமதி பிழை' : 'Export error');
        } finally {
            setIsExporting(false);
        }
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const tamilMonths = [
        'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
        'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
    ];

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className="analytics-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('analytics')}</h1>
                    <p className="page-subtitle">
                        {language === 'ta' ? 'விற்பனை பகுப்பாய்வு மற்றும் அறிக்கைகள்' : 'Sales insights and reports'}
                    </p>
                </div>

                <div className="header-actions">
                    <div className="date-filter">
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                            className="filter-select"
                        >
                            {months.map((m, i) => (
                                <option key={i} value={i}>
                                    {language === 'ta' ? tamilMonths[i] : m}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="filter-select"
                        >
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={exportToExcel}
                        disabled={isExporting}
                    >
                        {isExporting ? (
                            <>
                                <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                                <span>{language === 'ta' ? 'ஏற்றுமதி...' : 'Exporting...'}</span>
                            </>
                        ) : (
                            <>
                                <span>📥</span>
                                <span>{t('exportToExcel')}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>{t('loading')}</p>
                </div>
            ) : (
                <div className="analytics-grid">
                    {/* Best Selling Items */}
                    <div className="card">
                        <h3 className="card-title">
                            <span>🏆</span>
                            <span>{t('bestSellingItems')}</span>
                        </h3>

                        {analytics.bestSellingItems.length > 0 ? (
                            <div className="items-grid">
                                {analytics.bestSellingItems.map((item, index) => (
                                    <div key={index} className="item-card">
                                        <div className="item-rank">#{index + 1}</div>
                                        <div className="item-details">
                                            <div className="item-name">{item.name}</div>
                                            <div className="item-stats">
                                                <span>{item.count} {language === 'ta' ? 'விற்பனை' : 'sold'}</span>
                                                <span className="item-revenue">₹{item.revenue.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">📊</div>
                                <p>{language === 'ta' ? 'தரவு இல்லை' : 'No data available'}</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-2 mt-lg">
                        {/* Payment Methods */}
                        <div className="card">
                            <h3 className="card-title">
                                <span>💳</span>
                                <span>{t('salesByPayment')}</span>
                            </h3>

                            {analytics.salesByPayment.length > 0 ? (
                                <div className="payment-list">
                                    {analytics.salesByPayment.map((payment, index) => (
                                        <div key={index} className="payment-item">
                                            <div className="payment-method">{payment.method}</div>
                                            <div className="payment-stats">
                                                <div className="payment-count">{payment.count} {language === 'ta' ? 'பரிவர்த்தனைகள்' : 'transactions'}</div>
                                                <div className="payment-total">₹{payment.total.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon">💳</div>
                                    <p>{language === 'ta' ? 'தரவு இல்லை' : 'No data'}</p>
                                </div>
                            )}
                        </div>

                        {/* Peak Hours */}
                        <div className="card">
                            <h3 className="card-title">
                                <span>⏰</span>
                                <span>{t('peakSalesTimes')}</span>
                            </h3>

                            {analytics.peakHours.length > 0 ? (
                                <div className="hours-chart">
                                    {analytics.peakHours.map((hour, index) => (
                                        <div key={index} className="hour-bar">
                                            <div className="hour-label">
                                                {hour.hour}:00 - {hour.hour + 1}:00
                                            </div>
                                            <div className="hour-bar-container">
                                                <div
                                                    className="hour-bar-fill"
                                                    style={{
                                                        width: `${(hour.count / Math.max(...analytics.peakHours.map(h => h.count))) * 100}%`
                                                    }}
                                                >
                                                    <span className="hour-count">{hour.count}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon">⏰</div>
                                    <p>{language === 'ta' ? 'தரவு இல்லை' : 'No data'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
