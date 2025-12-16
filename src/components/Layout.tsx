import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../AuthContext';
import MilkEntryModal from './MilkEntryModal';
import './Layout.css';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { language, setLanguage, t } = useLanguage();
    const { logout, user } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Milk Modal State
    const [showMilkModal, setShowMilkModal] = useState(false);
    const [milkModalType, setMilkModalType] = useState<'morning' | 'evening'>('morning');

    useEffect(() => {
        checkMilkStatus();
    }, []);

    const checkMilkStatus = async () => {
        try {
            const response = await axios.get('/api/milk-tracking');
            const records = response.data;
            const today = format(new Date(), 'yyyy-MM-dd');
            const todayRecord = records.find((r: any) => r.date === today);

            if (!todayRecord) {
                // No record for today, prompt for morning milk
                setMilkModalType('morning');
                setShowMilkModal(true);
            }
        } catch (error) {
            console.error('Error checking milk status:', error);
        }
    };

    const handleMilkSubmit = async (value: number) => {
        try {


            // If evening, we need to be careful not to overwrite morning milk if we use the same API
            // The API implementation handles upsert/update correctly based on date

            // However, for evening update, we should probably fetch current record first or rely on backend to merge
            // Let's check backend implementation:
            // app.post('/api/milk-tracking') uses findOneAndUpdate with { morningMilk, eveningMilk }
            // This might overwrite if we send only one.
            // Wait, the backend implementation:
            // const { morningMilk, eveningMilk } = req.body;
            // const record = await MilkTracking.findOneAndUpdate(..., { morningMilk, eveningMilk }, ...)
            // If we send undefined for one, it might be an issue depending on how mongoose handles it or if we send 0.

            // Let's adjust the payload logic to be safe.
            // Actually, for the morning prompt, we are creating a new record essentially.
            // For evening prompt (logout), we want to update.

            // Let's modify the handleMilkSubmit to handle this.

            let dataToSend: any = {};

            if (milkModalType === 'morning') {
                // For morning, we assume evening is 0 for now
                dataToSend = { morningMilk: value, eveningMilk: 0 };
            } else {
                // For evening, we need to preserve morning milk. 
                // We can fetch the record first or update the backend to handle partial updates.
                // Since I can't easily change backend right now without context switching, 
                // I'll fetch the current record first.
                const response = await axios.get('/api/milk-tracking');
                const today = format(new Date(), 'yyyy-MM-dd');
                const todayRecord = response.data.find((r: any) => r.date === today);

                dataToSend = {
                    morningMilk: todayRecord ? todayRecord.morningMilk : 0,
                    eveningMilk: value
                };
            }

            await axios.post('/api/milk-tracking', dataToSend);
            setShowMilkModal(false);

            if (milkModalType === 'evening') {
                logout();
            }
        } catch (error) {
            console.error('Error saving milk data:', error);
            alert(language === 'ta' ? 'பிழை ஏற்பட்டது' : 'Error saving data');
        }
    };

    const handleLogoutClick = async () => {
        try {
            const response = await axios.get('/api/milk-tracking');
            const today = format(new Date(), 'yyyy-MM-dd');
            const todayRecord = response.data.find((r: any) => r.date === today);

            // If no record or evening milk is 0, prompt for evening milk
            if (!todayRecord || todayRecord.eveningMilk === 0) {
                setMilkModalType('evening');
                setShowMilkModal(true);
            } else {
                logout();
            }
        } catch (error) {
            console.error('Error checking milk status for logout:', error);
            logout(); // Fallback to logout if error
        }
    };

    const navItems = [
        { path: '/', label: t('dashboard'), icon: '📊' },
        { path: '/products', label: t('products'), icon: '🍵' },
        { path: '/sales', label: t('sales'), icon: '💰' },
        { path: '/milk-tracking', label: t('milkTracking'), icon: '🥛' },
        { path: '/analytics', label: t('analytics'), icon: '📈' },
        { path: '/reports', label: t('reports'), icon: '📧' },
        { path: '/help', label: t('help'), icon: '❓' },
    ];

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ta' : 'en');
    };

    return (
        <div className="layout">
            {/* Sidebar */}
            <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <span className="logo-icon">☕</span>
                        <h1 className="logo-text">
                            {language === 'ta' ? 'தேநீர் கடை' : 'Tea Shop'}
                        </h1>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">👤</div>
                        <div className="user-details">
                            <div className="user-name">{user?.username}</div>
                            <button className="btn-logout" onClick={handleLogoutClick}>
                                {t('logout')}
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="main-content">
                {/* Top Bar */}
                <header className="topbar">
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        ☰
                    </button>

                    <div className="topbar-actions">
                        <button className="lang-toggle" onClick={toggleLanguage}>
                            <span className="lang-icon">🌐</span>
                            <span className="lang-text">{language === 'ta' ? 'English' : 'தமிழ்'}</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="page-content">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Milk Entry Modal */}
            <MilkEntryModal
                isOpen={showMilkModal}
                type={milkModalType}
                onSubmit={handleMilkSubmit}
                onClose={() => setShowMilkModal(false)}
            />
        </div>
    );
};

export default Layout;
