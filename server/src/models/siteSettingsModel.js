const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  // Hero Section
  heroTitle: {
    en: {
      type: String
    },
    mr: {
      type: String
    }
  },
  heroSubtitle: {
    en: {
      type: String
    },
    mr: {
      type: String
    }
  },
  heroImageUrl: {
    type: String
  },
  
  // Village Statistics
  villageStats: {
    population: {
      type: String
    },
    households: {
      type: String
    },
    area: {
      type: String
    },
    literacyRate: {
      type: String
    }
  },
  
  // About Section
  aboutText: {
    en: {
      type: String
    },
    mr: {
      type: String
    }
  },
  aboutImageUrl: {
    type: String
  },
  
  // Latest Developments Section
  latestDevelopments: {
    title: {
      en: {
        type: String
      },
      mr: {
        type: String
      }
    },
    subtitle: {
      en: {
        type: String
      },
      mr: {
        type: String
      }
    }
  },
  
  // Footer Section
  footer: {
    copyright: {
      en: {
        type: String
      },
      mr: {
        type: String
      }
    },
    description: {
      en: {
        type: String
      },
      mr: {
        type: String
      }
    },
    contactInfo: {
      address: {
        en: {
          type: String
        },
        mr: {
          type: String
        }
      },
      phone: {
        type: String
      },
      email: {
        type: String
      }
    },
    socialLinks: {
      facebook: {
        type: String
      },
      twitter: {
        type: String
      },
      instagram: {
        type: String
      },
      youtube: {
        type: String
      }
    }
  }
}, {
  timestamps: true
});

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

module.exports = SiteSettings;
