import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../LanguageContext';
import './Login.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { language, setLanguage, t } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(username, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ta' : 'en');
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="tea-cup-animation">☕</div>
            </div>

            <div className="login-card glass-card">
                <div className="login-header">
                    <div className="login-logo">
                        <span className="login-logo-icon">☕</span>
                    </div>
                    <h1 className="login-title">
                        {language === 'ta' ? 'தேநீர் கடை மேலாண்மை' : 'Tea Shop Management'}
                    </h1>
                    <p className="login-subtitle">
                        {language === 'ta'
                            ? 'உங்கள் கணக்கில் உள்நுழையவும்'
                            : 'Sign in to your account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="error-message">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="input-group">
                        <label className="input-label">{t('username')}</label>
                        <input
                            type="text"
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={language === 'ta' ? 'உங்கள் பயனர்பெயரை உள்ளிடவும்' : 'Enter your username'}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">{t('password')}</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={language === 'ta' ? 'உங்கள் கடவுச்சொல்லை உள்ளிடவும்' : 'Enter your password'}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary login-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                                <span>{language === 'ta' ? 'உள்நுழைகிறது...' : 'Logging in...'}</span>
                            </>
                        ) : (
                            t('login')
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <button className="lang-switch-btn" onClick={toggleLanguage}>
                        <span>🌐</span>
                        <span>{language === 'ta' ? 'Switch to English' : 'தமிழுக்கு மாறவும்'}</span>
                    </button>
                </div>

                <div className="login-demo-info">
                    <p className="demo-title">
                        {language === 'ta' ? 'டெமோ கணக்கு' : 'Demo Account'}
                    </p>
                    <p className="demo-credentials">
                        {language === 'ta' ? 'பயனர்பெயர்' : 'Username'}: <strong>admin</strong>
                    </p>
                    <p className="demo-credentials">
                        {language === 'ta' ? 'கடவுச்சொல்' : 'Password'}: <strong>admin123</strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
