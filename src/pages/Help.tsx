import React from 'react';
import { useLanguage } from '../LanguageContext';
import './Help.css';

const Help: React.FC = () => {
    const { language } = useLanguage();

    const helpSections = [
        {
            title: language === 'ta' ? 'தொடங்குதல்' : 'Getting Started',
            icon: '🚀',
            content: language === 'ta'
                ? 'இந்த பயன்பாடு உங்கள் தேநீர் கடையை திறம்பட நிர்வகிக்க உதவுகிறது. உள்நுழைந்த பிறகு, நீங்கள் முகப்பு பக்கத்தில் இன்றைய மற்றும் மாதாந்திர விற்பனை புள்ளிவிவரங்களைக் காணலாம்.'
                : 'This application helps you manage your tea shop efficiently. After logging in, you\'ll see the dashboard with today\'s and monthly sales statistics.'
        },
        {
            title: language === 'ta' ? 'பொருட்களை நிர்வகித்தல்' : 'Managing Products',
            icon: '🍵',
            content: language === 'ta'
                ? 'பொருட்கள் பக்கத்தில், நீங்கள் தேநீர் மற்றும் சிற்றுண்டிகளை சேர்க்கலாம், திருத்தலாம் அல்லது நீக்கலாம். ஒவ்வொரு பொருளுக்கும் செலவு விலை மற்றும் விற்பனை விலையை அமைக்கவும். பால் உள்ள தேநீர் வகைகளுக்கு "பால் உள்ளதா" விருப்பத்தை தேர்வு செய்யவும்.'
                : 'In the Products page, you can add, edit, or delete teas and snacks. Set the cost price and selling price for each item. For tea varieties with milk, check the "Contains Milk" option.'
        },
        {
            title: language === 'ta' ? 'விற்பனையை பதிவு செய்தல்' : 'Recording Sales',
            icon: '💰',
            content: language === 'ta'
                ? 'விற்பனை பக்கத்தில், பொருளை தேர்வு செய்து, அளவை உள்ளிட்டு, பணம் செலுத்தும் முறையை தேர்வு செய்யவும் (பணம், போன்பே, கூகுள் பே, அல்லது கார்டு). ஒவ்வொரு விற்பனைக்கும் தானாக ஒரு டோக்கன் எண் உருவாக்கப்படும்.'
                : 'In the Sales page, select the product, enter quantity, and choose the payment method (Cash, PhonePe, Google Pay, or Card). Each sale automatically generates a unique token number for tracking.'
        },
        {
            title: language === 'ta' ? 'பால் பயன்பாட்டை கண்காணித்தல்' : 'Tracking Milk Usage',
            icon: '🥛',
            content: language === 'ta'
                ? 'பால் கண்காணிப்பு பக்கத்தில், காலை மற்றும் மாலை பால் அளவை லிட்டரில் உள்ளிடவும். கணினி தானாக மொத்த பால் பயன்பாடு மற்றும் ஒரு லிட்டருக்கு எத்தனை கப் தேநீர் விற்கப்பட்டது என்பதை கணக்கிடும்.'
                : 'In the Milk Tracking page, enter morning and evening milk quantities in liters. The system automatically calculates total milk used and how many cups of tea were sold per liter.'
        },
        {
            title: language === 'ta' ? 'பகுப்பாய்வு மற்றும் அறிக்கைகள்' : 'Analytics and Reports',
            icon: '📊',
            content: language === 'ta'
                ? 'பகுப்பாய்வு பக்கத்தில், அதிகம் விற்பனையான பொருட்கள், பணம் செலுத்தும் முறை வாரியாக விற்பனை, மற்றும் உச்ச விற்பனை நேரங்களைக் காணலாம். மாதாந்திர விற்பனை தரவை எக்செல் கோப்பாக பதிவிறக்கம் செய்யலாம்.'
                : 'In the Analytics page, view best-selling items, sales by payment method, and peak sales hours. You can export monthly sales data to an Excel file for detailed analysis.'
        },
        {
            title: language === 'ta' ? 'குறிப்புகள்' : 'Tips',
            icon: '💡',
            content: language === 'ta'
                ? '• தினமும் பால் தரவை புதுப்பிக்கவும்\n• வாராந்திர அறிக்கைகளை பதிவிறக்கம் செய்யவும்\n• சிறந்த விற்பனைக்கு உச்ச நேரங்களை கவனியுங்கள்\n• பொருட்களின் விலைகளை தொடர்ந்து புதுப்பிக்கவும்'
                : '• Update milk data daily for accurate tracking\n• Download weekly reports for better insights\n• Monitor peak hours to optimize staffing\n• Keep product prices updated regularly'
        }
    ];

    return (
        <div className="help-page">
            <div className="page-header">
                <h1 className="page-title">
                    {language === 'ta' ? 'உதவி வழிகாட்டி' : 'Help Guide'}
                </h1>
                <p className="page-subtitle">
                    {language === 'ta'
                        ? 'பயன்பாட்டை எவ்வாறு பயன்படுத்துவது என்பதை அறிக'
                        : 'Learn how to use the application effectively'}
                </p>
            </div>

            <div className="help-sections">
                {helpSections.map((section, index) => (
                    <div key={index} className="help-card glass-card">
                        <div className="help-header">
                            <div className="help-icon">{section.icon}</div>
                            <h3 className="help-title">{section.title}</h3>
                        </div>
                        <div className="help-content">
                            {section.content.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="help-footer card mt-lg">
                <h3 className="card-title">
                    <span>📞</span>
                    <span>{language === 'ta' ? 'உதவி தேவையா?' : 'Need Help?'}</span>
                </h3>
                <p className="help-footer-text">
                    {language === 'ta'
                        ? 'மேலும் உதவிக்கு அல்லது கேள்விகளுக்கு, உங்கள் கணினி நிர்வாகியை தொடர்பு கொள்ளவும்.'
                        : 'For additional assistance or questions, please contact your system administrator.'}
                </p>
            </div>
        </div>
    );
};

export default Help;
