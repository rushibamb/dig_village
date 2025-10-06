const SiteSettings = require('../models/siteSettingsModel');

// Get site settings (admin)
const getSiteSettings = async (req, res) => {
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
        aboutImageUrl: 'https://images.unsplash.com/photo-1695981103111-89f89e9755a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx2aWxsYWdlJTIwdGVtcGxlJTIwYXJjaGl0ZWN0dXJlJTIwaW5kaWF8ZW58MXx8fHwxNzU1NDUzMjg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        latestDevelopments: {
          title: {
            en: 'Latest Developments',
            mr: 'अलीकडील विकास'
          },
          subtitle: {
            en: 'Stay updated with our village progress',
            mr: 'आमच्या गावाच्या प्रगतीसह अद्ययावत राहा'
          }
        },
        footer: {
          copyright: {
            en: '© 2024 Rampur Village. All rights reserved.',
            mr: '© २०२४ रामपूर गाव. सर्व हक्क राखीव.'
          },
          description: {
            en: 'A progressive smart village embracing technology for sustainable living and digital governance.',
            mr: 'शाश्वत जीवन आणि डिजिटल गव्हर्नन्ससाठी तंत्रज्ञानाचा अवलंब करणारे प्रगतिशील स्मार्ट गाव.'
          },
          contactInfo: {
            address: {
              en: 'Main Road, Rampur, Dist. Pune - 412345',
              mr: 'मुख्य रस्ता, रामपूर, जिल्हा पुणे - ४१२३४५'
            },
            phone: '+91 20 1234 5678',
            email: 'rampur.panchayat@gov.in'
          },
          socialLinks: {
            facebook: '',
            twitter: '',
            instagram: '',
            youtube: ''
          }
        }
      });
      
      await siteSettings.save();
    }

    res.json({
      success: true,
      data: siteSettings,
      message: 'Site settings retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching site settings',
      error: error.message
    });
  }
};

// Update site settings (admin)
const updateSiteSettings = async (req, res) => {
  try {
    const updateData = req.body;
    
    // Find existing settings or create new one
    let siteSettings = await SiteSettings.findOne();
    
    if (!siteSettings) {
      // Create new settings if none exist
      siteSettings = new SiteSettings(updateData);
    } else {
      // Update existing settings
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          siteSettings[key] = updateData[key];
        }
      });
    }
    
    await siteSettings.save();

    res.json({
      success: true,
      data: siteSettings,
      message: 'Site settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating site settings',
      error: error.message
    });
  }
};

// Upload image for home content
const uploadHomeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Determine resource type based on file mimetype
    const resourceType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: resourceType,
        folder: 'village-portal/home-content',
        use_filename: true,
        unique_filename: true,
        overwrite: false
      };

      // For images, add optimization
      if (resourceType === 'image') {
        uploadOptions.quality = 'auto:good';
        uploadOptions.fetch_format = 'auto';
      }

      const cloudinary = require('cloudinary').v2;
      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Return the upload result
    res.json({
      success: true,
      data: {
        fileUrl: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
        format: result.format,
        width: result.width,
        height: result.height,
        size: result.bytes
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
};

module.exports = {
  getSiteSettings,
  updateSiteSettings,
  uploadHomeImage
};


