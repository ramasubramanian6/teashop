# Tea Shop Management System
# தேநீர் கடை மேலாண்மை அமைப்பு

A comprehensive, bilingual (Tamil & English) tea shop management application with sales tracking, inventory management, milk usage tracking, and analytics.

## Features

### 🌐 Bilingual Support
- Tamil (Primary)
- English
- Easy language switching

### 📊 Dashboard
- Daily and monthly sales statistics
- Revenue tracking
- Top selling items
- Recent transactions

### 🍵 Product Management
- Add/Edit/Delete products
- Categorize as Tea or Snacks
- Track cost and selling prices
- Mark products with milk content
- Automatic profit calculation

### 💰 Sales Management
- Quick sale recording
- Unique token number for each transaction
- Multiple payment methods (Cash, PhonePe, Google Pay, Card)
- Real-time sales history

### 🥛 Milk Tracking
- Daily morning and evening milk entry
- Automatic calculation of milk usage
- Cups per liter tracking
- Historical data

### 📈 Analytics
- Best selling items
- Sales by payment method
- Peak sales hours visualization
- Excel export functionality

### ❓ Help Guide
- Comprehensive bilingual instructions
- Step-by-step guides for all features

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Styling**: Modern CSS with Glassmorphism
- **Authentication**: JWT
- **Export**: ExcelJS

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (already configured)

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   The `.env` file is already configured with your MongoDB connection string.

3. **Start the Backend Server**
   ```bash
   npm run server
   ```
   Server will run on `http://localhost:5000`

4. **Start the Frontend (in a new terminal)**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## Default Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

## Usage Guide

### Adding Products
1. Navigate to Products page
2. Click "Add Product" button
3. Enter product details (name, category, prices)
4. Check "Contains Milk" for tea varieties with milk
5. Click Save

### Recording Sales
1. Go to Sales page
2. Select product from dropdown
3. Enter quantity
4. Choose payment method
5. Click "Record Sale"
6. A unique token number will be generated

### Tracking Milk Usage
1. Visit Milk Tracking page
2. Enter morning milk quantity (liters)
3. Enter evening milk quantity (liters)
4. Click "Update Milk Data"
5. System automatically calculates cups per liter based on tea sales

### Viewing Analytics
1. Open Analytics page
2. View best selling items
3. Check payment method distribution
4. See peak sales hours
5. Click "Export to Excel" to download monthly report

### Exporting Reports
- Click the "Export to Excel" button in Analytics
- Excel file will download with:
  - Sales Report
  - Best Selling Items
  - Payment Methods breakdown

## Mobile Responsive

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## Database Structure

### Collections
- **users**: Authentication data
- **products**: Tea and snacks inventory
- **sales**: Transaction records
- **milktrackings**: Daily milk usage data

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales
- `GET /api/sales` - Get sales history
- `POST /api/sales` - Record new sale

### Milk Tracking
- `GET /api/milk-tracking` - Get milk records
- `POST /api/milk-tracking` - Add/Update milk data

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Analytics
- `GET /api/analytics` - Get analytics data

## Features Highlights

✅ Bilingual (Tamil/English)
✅ Mobile-friendly responsive design
✅ JWT authentication
✅ Real-time statistics
✅ Automatic token generation
✅ Milk usage tracking
✅ Excel export
✅ Beautiful glassmorphism UI
✅ Smooth animations
✅ Dark theme
✅ Payment method tracking

## Support

For any issues or questions, refer to the Help page within the application or contact your system administrator.

## License

Private use for tea shop management.

---

Made with ☕ for tea shop owners
