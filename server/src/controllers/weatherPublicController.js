const WeatherAlert = require('../models/weatherAlertModel');

// Get active weather alerts
const getActiveWeatherAlerts = async (req, res) => {
  try {
    const now = new Date();
    
    const alerts = await WeatherAlert.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ severity: -1, createdAt: -1 });
    
    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching active weather alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather alerts',
      error: error.message
    });
  }
};

// Get current weather alert (most recent active alert)
const getCurrentWeatherAlert = async (req, res) => {
  try {
    const now = new Date();
    console.log('Fetching current weather alert at:', now);
    
    // First, let's check all weather alerts to debug
    const allAlerts = await WeatherAlert.find({});
    console.log('Total weather alerts in database:', allAlerts.length);
    allAlerts.forEach((alert, index) => {
      console.log(`Alert ${index + 1}:`, {
        id: alert._id,
        title: alert.title?.en,
        isActive: alert.isActive,
        startDate: alert.startDate,
        endDate: alert.endDate,
        startDateValid: alert.startDate <= now,
        endDateValid: alert.endDate >= now
      });
    });
    
    const alert = await WeatherAlert.findOne({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ severity: -1, createdAt: -1 });
    
    console.log('Found active alert:', alert ? 'Yes' : 'No');
    
    if (!alert) {
      return res.json({
        success: true,
        data: null,
        message: 'No active weather alerts'
      });
    }
    
    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    console.error('Error fetching current weather alert:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather alert',
      error: error.message
    });
  }
};

module.exports = {
  getActiveWeatherAlerts,
  getCurrentWeatherAlert
};
