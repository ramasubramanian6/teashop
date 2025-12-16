# Quick Start Guide | விரைவு தொடக்க வழிகாட்டி

## Installation | நிறுவல்

### Option 1: Using setup.bat (Recommended)
1. Double-click `setup.bat`
2. Wait for installation to complete

### Option 2: Manual Installation
```bash
npm install
```

## Running the Application | பயன்பாட்டை இயக்குதல்

### You need TWO terminals | இரண்டு டெர்மினல்கள் தேவை

#### Terminal 1 - Backend Server
**Windows:**
```bash
Double-click start-server.bat
```
**OR**
```bash
npm run server
```

#### Terminal 2 - Frontend
**Windows:**
```bash
Double-click start-frontend.bat
```
**OR**
```bash
npm run dev
```

## Access the Application | பயன்பாட்டை அணுகவும்

1. Open your browser | உங்கள் உலாவியைத் திறக்கவும்
2. Go to: `http://localhost:3000`
3. Login with:
   - Username: `admin`
   - Password: `admin123`

## Troubleshooting | சிக்கல் தீர்வு

### If npm install fails:
```bash
# Clear cache
npm cache clean --force

# Try again
npm install
```

### If ports are busy:
- Backend uses port 5000
- Frontend uses port 3000
- Close any applications using these ports

### Database Connection:
- MongoDB Atlas is already configured
- Connection string is in `.env` file
- No additional setup needed

## Features Checklist | அம்சங்கள் சரிபார்ப்பு பட்டியல்

✅ Login Page | உள்நுழைவு பக்கம்
✅ Dashboard with Stats | புள்ளிவிவரங்களுடன் கூடிய முகப்பு
✅ Product Management | பொருள் மேலாண்மை
✅ Sales Recording | விற்பனை பதிவு
✅ Milk Tracking | பால் கண்காணிப்பு
✅ Analytics | பகுப்பாய்வு
✅ Excel Export | எக்செல் ஏற்றுமதி
✅ Help Guide | உதவி வழிகாட்டி
✅ Tamil/English Toggle | தமிழ்/ஆங்கிலம் மாற்றம்

## Next Steps | அடுத்த படிகள்

1. ✅ Install dependencies
2. ✅ Start backend server
3. ✅ Start frontend
4. 📝 Login to the application
5. 🍵 Add your first product
6. 💰 Record your first sale
7. 🥛 Track milk usage
8. 📊 View analytics

## Support | ஆதரவு

If you encounter any issues:
1. Check both terminals are running
2. Verify MongoDB connection in `.env`
3. Clear browser cache
4. Restart both servers

---

Enjoy managing your tea shop! | உங்கள் தேநீர் கடையை நிர்வகிப்பதை அனுபவிக்கவும்! ☕
