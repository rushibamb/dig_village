// Test script to create a weather alert with proper data
// Run this with: node test-weather-alert.js

const axios = require('axios');

async function createTestWeatherAlert() {
  try {
    const testAlert = {
      title: {
        en: "Heavy Rainfall Warning",
        mr: "जोरदार पावसाची चेतावणी"
      },
      message: {
        en: "Heavy rainfall expected for next 72 hours. Take necessary precautions and stay indoors.",
        mr: "पुढील ७२ तासांत जोरदार पावसाची शक्यता. आवश्यक खबरदारी घ्या आणि घरात रहा."
      },
      alertType: "warning",
      severity: "high",
      startDate: new Date().toISOString(), // Start now
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // End in 3 days
      isActive: true,
      icon: "CloudRain"
    };

    console.log('Creating test weather alert:', testAlert);

    const response = await axios.post('http://localhost:5000/api/admin/weather-alerts', testAlert, {
      headers: {
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN', // You'll need to replace this with actual token
        'Content-Type': 'application/json'
      }
    });

    console.log('Weather alert created successfully:', response.data);
  } catch (error) {
    console.error('Error creating weather alert:', error.response?.data || error.message);
  }
}

// Uncomment the line below to run the test
// createTestWeatherAlert();

console.log('Test script ready. Uncomment the last line to run.');























