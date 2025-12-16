import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_jd67drb';
const EMAILJS_PUBLIC_KEY = 'J0i9k9SCZ-xMB7LTX';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

interface DailyReportData {
    date: string;
    dailySales: number;
    dailyRevenue: number;
    topSellingItem: string;
    totalTransactions: number;
    recentSales: Array<{
        tokenNumber: string;
        productName: string;
        quantity: number;
        total: number;
        paymentMethod: string;
        createdAt: string;
    }>;
}

/**
 * Send daily production report via EmailJS
 * @param templateId - EmailJS template ID
 * @param recipientEmail - Email address to send the report to
 * @param reportData - Daily production data
 */
export const sendDailyProductionReport = async (
    templateId: string,
    recipientEmail: string,
    reportData: DailyReportData
): Promise<{ success: boolean; message: string }> => {
    try {
        // Format the sales data for email
        const salesList = reportData.recentSales
            .map((sale, index) =>
                `${index + 1}. ${sale.productName} - Qty: ${sale.quantity} - ₹${sale.total.toFixed(2)} (${sale.paymentMethod})`
            )
            .join('\n');

        // Prepare template parameters
        const templateParams = {
            to_email: recipientEmail,
            report_date: reportData.date,
            daily_sales_count: reportData.dailySales,
            daily_revenue: `₹${reportData.dailyRevenue.toFixed(2)}`,
            top_selling_item: reportData.topSellingItem,
            total_transactions: reportData.totalTransactions,
            sales_list: salesList || 'No sales today',
            shop_name: 'Tea Shop Management'
        };

        // Send email using EmailJS
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            templateId,
            templateParams
        );

        if (response.status === 200) {
            return {
                success: true,
                message: 'Daily report sent successfully!'
            };
        } else {
            return {
                success: false,
                message: 'Failed to send report. Please try again.'
            };
        }
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to send email'
        };
    }
};

/**
 * Send test email to verify EmailJS configuration
 */
export const sendTestEmail = async (
    templateId: string,
    recipientEmail: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const templateParams = {
            to_email: recipientEmail,
            message: 'This is a test email from Tea Shop Management System',
            shop_name: 'Tea Shop Management'
        };

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            templateId,
            templateParams
        );

        if (response.status === 200) {
            return {
                success: true,
                message: 'Test email sent successfully!'
            };
        } else {
            return {
                success: false,
                message: 'Failed to send test email.'
            };
        }
    } catch (error) {
        console.error('Error sending test email:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to send test email'
        };
    }
};
