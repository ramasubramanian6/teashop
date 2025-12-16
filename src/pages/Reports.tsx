import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import { format } from 'date-fns';
import { sendDailyProductionReport } from '../services/emailService';
import './Reports.css';

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
        productName: string;
        quantity: number;
        total: number;
        paymentMethod: string;
        createdAt: string;
    }>;
}

const Reports: React.FC = () => {
    const { t, language } = useLanguage();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recipientEmail, setRecipientEmail] = useState('');
    const [templateId, setTemplateId] = useState('template_yv508nh');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchDashboardData();
        // Load saved email settings from localStorage
        const savedEmail = localStorage.getItem('reportEmail');
        const savedTemplateId = localStorage.getItem('emailTemplateId');
        if (savedEmail) setRecipientEmail(savedEmail);
        if (savedTemplateId) setTemplateId(savedTemplateId);
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/api/dashboard/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const handleSendReport = async () => {
        if (!recipientEmail || !templateId) {
            setMessage({
                type: 'error',
                text: language === 'ta' ? 'மின்னஞ்சல் மற்றும் டெம்ப்ளேட் ஐடியை உள்ளிடவும்' : 'Please enter email and template ID'
            });
            return;
        }

        if (!stats) {
            setMessage({
                type: 'error',
                text: language === 'ta' ? 'தரவு கிடைக்கவில்லை' : 'No data available'
            });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        // Save settings to localStorage
        localStorage.setItem('reportEmail', recipientEmail);
        localStorage.setItem('emailTemplateId', templateId);

        const reportData = {
            date: format(new Date(), 'EEEE, MMMM d, yyyy'),
            dailySales: stats.dailySales,
            dailyRevenue: stats.dailyRevenue,
            topSellingItem: stats.topSellingItem,
            totalTransactions: stats.totalTransactions,
            recentSales: stats.recentSales
        };

        const result = await sendDailyProductionReport(templateId, recipientEmail, reportData);

        setIsLoading(false);
        setMessage({
            type: result.success ? 'success' : 'error',
            text: result.message
        });

        // Clear message after 5 seconds
        setTimeout(() => setMessage(null), 5000);
    };

    return (
        <div className="reports-page">
            <div className="page-header">
                <h1 className="page-title">
                    {language === 'ta' ? '📧 அறிக்கைகள்' : '📧 Reports'}
                </h1>
                <p className="page-subtitle">
                    {language === 'ta'
                        ? 'தினசரி உற்பத்தி அறிக்கையை மின்னஞ்சல் மூலம் அனுப்பவும்'
                        : 'Send daily production reports via email'}
                </p>
            </div>

            {/* Email Configuration */}
            <div className="card">
                <h3 className="card-title">
                    <span>⚙️</span>
                    <span>{language === 'ta' ? 'மின்னஞ்சல் அமைப்புகள்' : 'Email Configuration'}</span>
                </h3>

                <div className="email-config-form">
                    <div className="form-group">
                        <label htmlFor="recipientEmail">
                            {language === 'ta' ? 'பெறுநர் மின்னஞ்சல்' : 'Recipient Email'}
                        </label>
                        <input
                            type="email"
                            id="recipientEmail"
                            className="form-input"
                            placeholder="example@gmail.com"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="templateId">
                            {language === 'ta' ? 'EmailJS டெம்ப்ளேட் ஐடி' : 'EmailJS Template ID'}
                        </label>
                        <input
                            type="text"
                            id="templateId"
                            className="form-input"
                            placeholder="template_xxxxxxx"
                            value={templateId}
                            onChange={(e) => setTemplateId(e.target.value)}
                        />
                        <small className="form-hint">
                            {language === 'ta'
                                ? 'EmailJS டாஷ்போர்டில் இருந்து டெம்ப்ளேட் ஐடியை பெறவும்'
                                : 'Get your template ID from EmailJS dashboard'}
                        </small>
                    </div>
                </div>
            </div>

            {/* Today's Summary */}
            {stats && (
                <div className="card mt-lg">
                    <h3 className="card-title">
                        <span>📊</span>
                        <span>{language === 'ta' ? 'இன்றைய சுருக்கம்' : "Today's Summary"}</span>
                    </h3>

                    <div className="stats-grid grid grid-4">
                        <div className="stat-card">
                            <div className="stat-icon">📈</div>
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
                            <div className="stat-icon">🏆</div>
                            <div className="stat-content">
                                <div className="stat-value">{stats.topSellingItem}</div>
                                <div className="stat-label">{t('topSellingItem')}</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">🔢</div>
                            <div className="stat-content">
                                <div className="stat-value">{stats.totalTransactions}</div>
                                <div className="stat-label">{t('totalTransactions')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Send Report Button */}
            <div className="card mt-lg">
                <div className="send-report-section">
                    <button
                        className="btn btn-primary btn-large"
                        onClick={handleSendReport}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-small"></span>
                                <span>{language === 'ta' ? 'அனுப்புகிறது...' : 'Sending...'}</span>
                            </>
                        ) : (
                            <>
                                <span>📧</span>
                                <span>{language === 'ta' ? 'தினசரி அறிக்கையை அனுப்பு' : 'Send Daily Report'}</span>
                            </>
                        )}
                    </button>

                    {message && (
                        <div className={`alert alert-${message.type} mt-md`}>
                            {message.text}
                        </div>
                    )}
                </div>
            </div>

            {/* Instructions */}
            <div className="card mt-lg">
                <h3 className="card-title">
                    <span>📝</span>
                    <span>{language === 'ta' ? 'வழிமுறைகள்' : 'Instructions'}</span>
                </h3>

                <div className="instructions">
                    <ol>
                        <li>
                            {language === 'ta'
                                ? 'EmailJS இல் கணக்கு உருவாக்கவும்: '
                                : 'Create an account at '}
                            <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer">
                                emailjs.com
                            </a>
                        </li>
                        <li>
                            {language === 'ta'
                                ? 'புதிய மின்னஞ்சல் டெம்ப்ளேட்டை உருவாக்கவும் பின்வரும் மாறிகளுடன்:'
                                : 'Create a new email template with the following variables:'}
                            <ul>
                                <li><code>{'{{to_email}}'}</code> - Recipient email</li>
                                <li><code>{'{{report_date}}'}</code> - Report date</li>
                                <li><code>{'{{daily_sales_count}}'}</code> - Number of sales</li>
                                <li><code>{'{{daily_revenue}}'}</code> - Total revenue</li>
                                <li><code>{'{{top_selling_item}}'}</code> - Best selling item</li>
                                <li><code>{'{{total_transactions}}'}</code> - Total transactions</li>
                                <li><code>{'{{sales_list}}'}</code> - List of all sales</li>
                                <li><code>{'{{shop_name}}'}</code> - Shop name</li>
                            </ul>
                        </li>
                        <li>
                            {language === 'ta'
                                ? 'டெம்ப்ளேட் ஐடியை நகலெடுத்து மேலே உள்ள புலத்தில் ஒட்டவும்'
                                : 'Copy the template ID and paste it in the field above'}
                        </li>
                        <li>
                            {language === 'ta'
                                ? 'பெறுநர் மின்னஞ்சல் முகவரியை உள்ளிடவும்'
                                : 'Enter the recipient email address'}
                        </li>
                        <li>
                            {language === 'ta'
                                ? '"தினசரி அறிக்கையை அனுப்பு" பொத்தானை கிளிக் செய்யவும்'
                                : 'Click "Send Daily Report" button'}
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default Reports;
