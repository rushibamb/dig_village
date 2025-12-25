const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory:', uploadDir);
} else {
  console.log('Uploads directory already exists:', uploadDir);
}

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// --- ADDED: Cloudinary Secure Configuration ---
// Make sure your Cloudinary config (wherever you defined it) 
// includes { secure: true } to prevent broken images on mobile/https sites.

// Import models and routes
const User = require('./models/userModel');
const authRoutes = require('./routes/authRoutes');
const villagerRoutes = require('./routes/villagerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const grievanceRoutes = require('./routes/grievanceRoutes');
const newsPublicRoutes = require('./routes/newsPublicRoutes');
const weatherPublicRoutes = require('./routes/weatherPublicRoutes');
const committeePublicRoutes = require('./routes/committeePublicRoutes');
const mediaPublicRoutes = require('./routes/mediaPublicRoutes');
const mediaUploadRoutes = require('./routes/mediaUploadRoutes');
const homeContentPublicRoutes = require('./routes/homeContentPublicRoutes');
const projectPublicRoutes = require('./routes/projectPublicRoutes');
const taxPublicRoutes = require('./routes/taxPublicRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    console.log('🔄 Checking database connection...');
    const existingAdmin = await User.findOne({ email: 'admin@village.com' });
    
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        name: 'admin',
        email: 'admin@village.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('✅ Default admin user created successfully');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

// Initialize Express app
const app = express();

// --- UPDATED: CORS Middleware ---
// This allows your specific Vercel frontend to talk to this backend
app.use(cors({
  origin: ["https://dig-village-rushikesh-bambs-projects.vercel.app", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Digital Village API' });
});

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/villagers', villagerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/news', newsPublicRoutes);
app.use('/api/weather', weatherPublicRoutes);
app.use('/api/committee', committeePublicRoutes);
app.use('/api/media', mediaPublicRoutes);
app.use('/api/upload', mediaUploadRoutes);
app.use('/api/homepage', homeContentPublicRoutes);
app.use('/api/projects', projectPublicRoutes);
app.use('/api/taxes', taxPublicRoutes);
app.use('/api/payment', paymentRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  setTimeout(async () => {
    await createDefaultAdmin();
  }, 2000);
});