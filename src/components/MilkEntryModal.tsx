import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import './MilkEntryModal.css';

interface MilkEntryModalProps {
    isOpen: boolean;
    type: 'morning' | 'evening';
    onSubmit: (value: number) => Promise<void>;
    onClose: () => void;
}

const MilkEntryModal: React.FC<MilkEntryModalProps> = ({ isOpen, type, onSubmit, onClose }) => {
    const { t, language } = useLanguage();
    const [value, setValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!value) return;

        setIsSubmitting(true);
        try {
            await onSubmit(parseFloat(value));
            setValue('');
        } catch (error) {
            console.error('Error submitting milk data:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>
                        {type === 'morning' ? '☀️ ' : '🌙 '}
                        {type === 'morning'
                            ? (language === 'ta' ? 'காலை பால் பதிவு' : 'Morning Milk Entry')
                            : (language === 'ta' ? 'மாலை பால் பதிவு' : 'Evening Milk Entry')}
                    </h2>
                </div>

                <p className="modal-description">
                    {type === 'morning'
                        ? (language === 'ta'
                            ? 'இன்றைய வியாபாரத்தை தொடங்க காலை பால் அளவை உள்ளிடவும்.'
                            : 'Please enter the morning milk quantity to start the day.')
                        : (language === 'ta'
                            ? 'வெளியேறும் முன் மாலை பால் அளவை உள்ளிடவும்.'
                            : 'Please enter the evening milk quantity before logging out.')}
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>
                            {language === 'ta' ? 'பால் அளவு (லிட்டர்)' : 'Milk Quantity (Liters)'}
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="0.0"
                            autoFocus
                            required
                            className="modal-input"
                        />
                    </div>

                    <div className="modal-actions">
                        {type === 'evening' && (
                            <button type="button" className="btn-secondary" onClick={onClose}>
                                {t('cancel')}
                            </button>
                        )}
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? t('loading') : t('save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MilkEntryModal;
