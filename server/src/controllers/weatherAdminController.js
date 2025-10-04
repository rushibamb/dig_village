const WeatherAlert = require('../models/weatherAlertModel');

// Create a new weather alert
const createWeatherAlert = async (req, res) => {
  try {
    console.log('Creating weather alert with body:', req.body);
    
    // Ensure dates are properly formatted
    const alertData = {
      ...req.body,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate)
    };
    
    console.log('Processed alert data:', alertData);
    
    const weatherAlert = new WeatherAlert(alertData);
    await weatherAlert.save();
    
    console.log('Saved weather alert:', weatherAlert);
    
    res.status(201).json({
      success: true,
      message: 'Weather alert created successfully',
      data: weatherAlert
    });
  } catch (error) {
    console.error('Error creating weather alert:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create weather alert',
      error: error.message
    });
  }
};

// Get all weather alerts
const getAllWeatherAlerts = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive, alertType } = req.query;
    
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (alertType) filter.alertType = alertType;
    
    const alerts = await WeatherAlert.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await WeatherAlert.countDocuments(filter);
    
    res.json({
      success: true,
      data: alerts,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching weather alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather alerts',
      error: error.message
    });
  }
};

// Get weather alert by ID
const getWeatherAlertById = async (req, res) => {
  try {
    const alert = await WeatherAlert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Weather alert not found'
      });
    }
    
    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    console.error('Error fetching weather alert:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather alert',
      error: error.message
    });
  }
};

// Update weather alert
const updateWeatherAlert = async (req, res) => {
  try {
    const alert = await WeatherAlert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Weather alert not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Weather alert updated successfully',
      data: alert
    });
  } catch (error) {
    console.error('Error updating weather alert:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update weather alert',
      error: error.message
    });
  }
};

// Delete weather alert
const deleteWeatherAlert = async (req, res) => {
  try {
    const alert = await WeatherAlert.findByIdAndDelete(req.params.id);
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Weather alert not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Weather alert deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting weather alert:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete weather alert',
      error: error.message
    });
  }
};

// Get weather alert statistics
const getWeatherAlertStats = async (req, res) => {
  try {
    const total = await WeatherAlert.countDocuments();
    const active = await WeatherAlert.countDocuments({ isActive: true });
    const inactive = await WeatherAlert.countDocuments({ isActive: false });
    const critical = await WeatherAlert.countDocuments({ severity: 'critical' });
    
    res.json({
      success: true,
      data: {
        total,
        active,
        inactive,
        critical
      }
    });
  } catch (error) {
    console.error('Error fetching weather alert stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather alert statistics',
      error: error.message
    });
  }
};

module.exports = {
  createWeatherAlert,
  getAllWeatherAlerts,
  getWeatherAlertById,
  updateWeatherAlert,
  deleteWeatherAlert,
  getWeatherAlertStats
};
