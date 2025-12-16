import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import { format } from 'date-fns';
import './MilkTracking.css';

interface MilkData {
    _id?: string;
    date: string;
    morningMilk: number;
    eveningMilk: number;
    teaCupsSold: number;
}

const MilkTracking: React.FC = () => {
    const { t, language } = useLanguage();
    const [milkRecords, setMilkRecords] = useState<MilkData[]>([]);
    const [formData, setFormData] = useState({
        morningMilk: '',
        eveningMilk: '',
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMilkData();
    }, []);

    const fetchMilkData = async () => {
        try {
            const response = await axios.get('/api/milk-tracking');
            setMilkRecords(response.data);
        } catch (error) {
            console.error('Error fetching milk data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post('/api/milk-tracking', {
                morningMilk: parseFloat(formData.morningMilk),
                eveningMilk: parseFloat(formData.eveningMilk),
            });

            setFormData({ morningMilk: '', eveningMilk: '' });
            fetchMilkData();
            alert(language === 'ta' ? 'பால் தரவு சேமிக்கப்பட்டது!' : 'Milk data saved!');
        } catch (error) {
            console.error('Error saving milk data:', error);
            alert(language === 'ta' ? 'பிழை ஏற்பட்டது' : 'Error saving data');
        }
    };

    const totalMilk = parseFloat(formData.morningMilk || '0') + parseFloat(formData.eveningMilk || '0');
    const todayRecord = milkRecords.find(r => r.date === format(new Date(), 'yyyy-MM-dd'));

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>{t('loading')}</p>
            </div>
        );
    }

    return (
        <div className="milk-tracking-page">
            <div className="page-header">
                <h1 className="page-title">{t('milkTracking')}</h1>
                <p className="page-subtitle">
                    {language === 'ta' ? 'தினசரி பால் பயன்பாட்டை கண்காணிக்கவும்' : 'Track daily milk usage and tea production'}
                </p>
            </div>

            <div className="grid grid-2">
                {/* Milk Entry Form */}
                <div className="card">
                    <h3 className="card-title">
                        <span>🥛</span>
                        <span>{language === 'ta' ? 'இன்றைய பால் தரவு' : 'Today\'s Milk Data'}</span>
                    </h3>

                    <form onSubmit={handleSubmit} className="milk-form">
                        <div className="input-group">
                            <label className="input-label">{t('morningMilk')}</label>
                            <input
                                type="number"
                                step="0.1"
                                className="input-field"
                                value={formData.morningMilk}
                                onChange={(e) => setFormData({ ...formData, morningMilk: e.target.value })}
                                placeholder="0.0"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">{t('eveningMilk')}</label>
                            <input
                                type="number"
                                step="0.1"
                                className="input-field"
                                value={formData.eveningMilk}
                                onChange={(e) => setFormData({ ...formData, eveningMilk: e.target.value })}
                                placeholder="0.0"
                                required
                            />
                        </div>

                        <div className="milk-total">
                            <span>{t('totalMilkUsed')}:</span>
                            <span className="milk-total-value">{totalMilk.toFixed(1)} L</span>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">
                            <span>💾</span>
                            <span>{t('updateMilkData')}</span>
                        </button>
                    </form>
                </div>

                {/* Today's Stats */}
                <div className="card">
                    <h3 className="card-title">
                        <span>📊</span>
                        <span>{language === 'ta' ? 'இன்றைய புள்ளிவிவரங்கள்' : 'Today\'s Statistics'}</span>
                    </h3>

                    {todayRecord ? (
                        <div className="milk-stats">
                            <div className="stat-item">
                                <div className="stat-icon">🥛</div>
                                <div className="stat-info">
                                    <div className="stat-value">{(todayRecord.morningMilk + todayRecord.eveningMilk).toFixed(1)} L</div>
                                    <div className="stat-label">{t('totalMilkUsed')}</div>
                                </div>
                            </div>

                            <div className="stat-item">
                                <div className="stat-icon">🍵</div>
                                <div className="stat-info">
                                    <div className="stat-value">{todayRecord.teaCupsSold}</div>
                                    <div className="stat-label">{t('teaCupsSold')}</div>
                                </div>
                            </div>

                            <div className="stat-item">
                                <div className="stat-icon">📈</div>
                                <div className="stat-info">
                                    <div className="stat-value">
                                        {todayRecord.morningMilk + todayRecord.eveningMilk > 0
                                            ? (todayRecord.teaCupsSold / (todayRecord.morningMilk + todayRecord.eveningMilk)).toFixed(1)
                                            : '0'}
                                    </div>
                                    <div className="stat-label">{t('cupsPerLiter')}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">📝</div>
                            <p>{language === 'ta' ? 'இன்று தரவு இல்லை' : 'No data for today'}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* History */}
            <div className="card mt-lg">
                <h3 className="card-title">
                    <span>📜</span>
                    <span>{language === 'ta' ? 'பால் பயன்பாட்டு வரலாறு' : 'Milk Usage History'}</span>
                </h3>

                {milkRecords.length > 0 ? (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>{t('date')}</th>
                                    <th>{t('morningMilk')}</th>
                                    <th>{t('eveningMilk')}</th>
                                    <th>{t('totalMilkUsed')}</th>
                                    <th>{t('teaCupsSold')}</th>
                                    <th>{t('cupsPerLiter')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {milkRecords.map((record) => {
                                    const total = record.morningMilk + record.eveningMilk;
                                    const cupsPerLiter = total > 0 ? (record.teaCupsSold / total).toFixed(1) : '0';

                                    return (
                                        <tr key={record._id}>
                                            <td>{format(new Date(record.date), 'dd/MM/yyyy')}</td>
                                            <td>{record.morningMilk.toFixed(1)} L</td>
                                            <td>{record.eveningMilk.toFixed(1)} L</td>
                                            <td className="highlight">{total.toFixed(1)} L</td>
                                            <td>{record.teaCupsSold}</td>
                                            <td className="highlight">{cupsPerLiter}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <p>{language === 'ta' ? 'வரலாறு இல்லை' : 'No history yet'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MilkTracking;
