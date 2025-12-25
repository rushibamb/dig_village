# Gram Panchayat Digital Portal

A comprehensive digital platform for village administration, enabling villagers to access services, pay taxes, submit grievances, and stay informed about village activities. Built with modern web technologies and featuring bilingual support (English/Marathi).

## 🌟 Features

- **Tax Management**: Online tax payment and record management
- **Grievance System**: Submit and track complaints
- **Villager Management**: Register and manage family details
- **News & Media**: Stay updated with village news and media
- **Committee Information**: View Gram Panchayat committee details
- **Contracts Management**: View and manage village contracts
- **Admin Dashboard**: Comprehensive admin panel for village administration
- **Bilingual Support**: Full English and Marathi language support
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🏗️ Project Structure

```
ty_pro/
├── client/          # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API service functions
│   │   ├── pages/         # Page components
│   │   └── styles/        # Global styles
│   └── public/            # Static assets
│
├── server/          # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── middleware/    # Custom middleware
│   └── uploads/           # File uploads directory
│
└── README.md        # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB database
- Cloudinary account (for media uploads)
- Twilio account (for SMS services, optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rushibamb/dig_village.git
   cd dig_village
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Configure environment variables**

   Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

5. **Start the development servers**

   **Terminal 1 - Start backend server:**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Start frontend client:**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📦 Build for Production

### Build Client

```bash
cd client
npm run build
```

The production build will be in `client/build/` directory.

### Deploy Server

The server can be deployed to any Node.js hosting platform (Heroku, Railway, Render, etc.). Make sure to:

1. Set all environment variables in your hosting platform
2. Ensure MongoDB is accessible
3. Configure CORS settings if needed

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Radix UI** - UI components
- **Axios** - HTTP client
- **Zustand** - State management

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - Media storage
- **Twilio** - SMS services
- **Razorpay** - Payment gateway
- **Multer** - File uploads

## 📚 Documentation

- [Quick Start Guide](./QUICK_START.md) - Get started quickly
- [Font Improvements](./FONT_IMPROVEMENTS.md) - Marathi font implementation
- [Improvements Summary](./IMPROVEMENTS_README.md) - Recent updates
- [Client README](./client/README.md) - Frontend documentation
- [Cloudinary Setup](./cloudinary-setup.md) - Media upload configuration

## 🔐 Authentication

- **Villager Authentication**: Registration and login for villagers
- **Admin Authentication**: Separate admin login system
- **JWT Tokens**: Secure token-based authentication
- **Protected Routes**: Route protection for authenticated users

## 🌐 API Endpoints

The backend provides RESTful API endpoints for:
- Authentication (`/api/auth/*`)
- Tax Management (`/api/tax/*`)
- Grievances (`/api/grievance/*`)
- Villagers (`/api/villager/*`)
- News (`/api/news/*`)
- Media (`/api/media/*`)
- Committee (`/api/committee/*`)
- Admin operations (`/api/admin/*`)

## 🎨 Features in Detail

### Tax Payment System
- View tax records
- Online payment via Razorpay
- Download receipts
- CSV upload for bulk records (Admin)

### Grievance Management
- Submit grievances with attachments
- Track status (Pending, In Progress, Resolved)
- Admin dashboard for managing grievances

### Villager Management
- Register family details
- Edit information with OTP verification
- View family records

### News & Media
- Publish news articles
- Upload and manage media files
- Categorize content

### Committee Information
- View committee members
- Department information
- Office details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 👥 Authors

- **Development Team** - Initial work

## 🙏 Acknowledgments

- Fonts: Mukta, Noto Sans Devanagari, Tiro Devanagari Marathi
- UI Components: Radix UI
- Icons: Lucide React

## 📞 Support

For support, please contact the development team or open an issue in the repository.

---

**Built with ❤️ for Digital India Initiative**

