const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Import models and routes
const User = require('./models/userModel');
const authRoutes = require('./routes/authRoutes');
const villagerRoutes = require('./routes/villagerRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    // Wait for DB connection to be ready
    console.log('🔄 Checking database connection...');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@village.com' });
    
    if (!existingAdmin) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
        // Create admin user
        const adminUser = await User.create({
          name: 'admin',
          email: 'admin@village.com',
          password: hashedPassword,
          role: 'admin'
        });
      
      console.log('✅ Default admin user created successfully:');
      console.log('📧 Email: admin@village.com');
      console.log('🔑 Password: admin123');
      console.log('👤 Role: admin');
    } else {
      console.log('ℹ️ Admin user already exists');
      console.log('📧 Email: admin@village.com');
      console.log('🔑 Password: admin123');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    
    // If there's a duplicate key error, try to fix it
    if (error.code === 11000) {
      console.log('🔧 Attempting to fix duplicate key error...');
      try {
        // Drop the entire users collection and recreate
        await User.collection.drop();
        console.log('🗑️ Cleared existing users collection');
        
        // Try creating admin again
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        const adminUser = await User.create({
          name: 'admin',
          email: 'admin@village.com',
          password: hashedPassword,
          role: 'admin'
        });
        
        console.log('✅ Default admin user created successfully after cleanup:');
        console.log('📧 Email: admin@village.com');
        console.log('🔑 Password: admin123');
        console.log('👤 Role: admin');
      } catch (retryError) {
        console.error('❌ Failed to create admin after cleanup:', retryError.message);
        console.log('⚠️ Please manually delete the database and restart the server');
      }
    }
  }
};

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Digital Village API' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Villager routes
app.use('/api/villagers', villagerRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Wait a bit for database to be fully ready, then create admin user
  setTimeout(async () => {
    await createDefaultAdmin();
  }, 2000);
});
