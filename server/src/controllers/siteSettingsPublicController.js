const SiteSettings = require('../models/siteSettingsModel');

// Get public site settings
const getPublicSiteSettings = async (req, res) => {
  try {
    // Try to find existing settings, or create default if none exist
    let siteSettings = await SiteSettings.findOne();
    
    if (!siteSettings) {
      // Create default settings if none exist
      siteSettings = new SiteSettings({
        heroTitle: {
          en: 'Welcome to Rampur Village',
          mr: 'रामपूर गावात आपले स्वागत आहे'
        },
        heroSubtitle: {
          en: 'A progressive smart village embracing technology for sustainable living and digital governance',
          mr: 'शाश्वत जीवन आणि डिजिटल गव्हर्नन्ससाठी तंत्रज्ञानाचा अवलंब करणारे प्रगतिशील स्मार्ट गाव'
        },
        heroImageUrl: 'https://images.unsplash.com/photo-1655974239313-5ab1747a002e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2aWxsYWdlJTIwYmVhdXRpZnVsJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc1NTQ1MzI4MXww&ixlib=rb-4.1.0&q=80&w=1080',
        villageStats: {
          population: '3,247',
          households: '823',
          area: '1,250',
          literacyRate: '78%'
        },
        aboutText: {
          en: 'Rampur represents the future of rural India - a harmonious blend of traditional values and cutting-edge technology. Our journey from a small farming community to a digitally empowered smart village showcases what\'s possible when innovation meets determination.',
          mr: 'रामपूर ग्रामीण भारताच्या भविष्याचे प्रतिनिधित्व करते - पारंपारिक मूल्ये आणि अत्याधुनिक तंत्रज्ञानाचे सुसंवादी मिश्रण. एका छोट्या शेतकरी समुदायातून डिजिटल सक्षम स्मार्ट गावापर्यंतचा आमचा प्रवास दाखवतो की नवकल्पना आणि दृढनिश्चय भेटल्यावर काय शक्य आहे.'
        },
        aboutImageUrl: 'https://images.unsplash.com/photo-1695981103111-89f89e9755a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx2aWxsYWdlJTIwdGVtcGxlJTIwYXJjaGl0ZWN0dXJlJTIwaW5kaWF8ZW58MXx8fHwxNzU1NDUzMjg5fDA&ixlib=rb-4.1.0&q=80&w=1080'
      });
      
      await siteSettings.save();
    }

    res.json({
      success: true,
      data: siteSettings,
      message: 'Site settings retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching public site settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching site settings',
      error: error.message
    });
  }
};

module.exports = {
  getPublicSiteSettings
};






