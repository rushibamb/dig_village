import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageProvider';
import { getPublicFacilities, getPublicAchievements, getPublicSiteSettings, getPublicLatestDevelopments } from '../services/homeContentService';
import { getPublicOfficeInfo } from '../services/committeeService';
import { getVillagerStats } from '../services/villagerService';
import { 
  MapPin,
  Users,
  Phone,
  Calendar,
  TreePine,
  Home,
  GraduationCap,
  Heart,
  Zap,
  Droplets,
  Award,
  Star,
  TrendingUp,
  Shield,
  Sparkles
} from 'lucide-react';

export function VillageLandingPage() {
  const { t } = useLanguage();

  // State for all dynamic content
  const [homeContent, setHomeContent] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [latestDevelopments, setLatestDevelopments] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);
  const [villagerStats, setVillagerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);

  // Fetch all data concurrently
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data concurrently for better performance
        const [siteSettings, facilitiesData, achievementsData, latestDevelopmentsData, officeInfo, villagerStatsData] = await Promise.all([
          getPublicSiteSettings(),
          getPublicFacilities(),
          getPublicAchievements(),
          getPublicLatestDevelopments({ limit: 3 }),
          getPublicOfficeInfo(),
          getVillagerStats()
        ]);

        // Update state with fetched data
        setHomeContent(siteSettings.data || siteSettings);
        setFacilities(facilitiesData.data || facilitiesData || []);
        setAchievements(achievementsData.data || achievementsData || []);
        setLatestDevelopments(latestDevelopmentsData.data || latestDevelopmentsData || []);
        setContactInfo(officeInfo.data || officeInfo);
        setVillagerStats(villagerStatsData.data || villagerStatsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set fallback data to prevent empty page
        setFacilities([]);
        setAchievements([]);
        setLatestDevelopments([]);
        setContactInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Static data for village stats icons and labels
  const villageStatsConfig = [
    {
      icon: Users,
      label: { en: 'Total Population', mr: 'एकूण लोकसंख्या' },
      key: 'population',
      gradient: 'from-emerald-500 to-green-600',
      delay: '0.1s'
    },
    {
      icon: Home,
      label: { en: 'Households', mr: 'कुटुंबे' },
      key: 'households',
      gradient: 'from-blue-500 to-cyan-600',
      delay: '0.2s'
    },
    {
      icon: TreePine,
      label: { en: 'Area (Hectares)', mr: 'क्षेत्रफळ (हेक्टर)' },
      key: 'area',
      gradient: 'from-purple-500 to-violet-600',
      delay: '0.3s'
    },
    {
      icon: GraduationCap,
      label: { en: 'Literacy Rate', mr: 'साक्षरता दर' },
      key: 'literacyRate',
      gradient: 'from-orange-500 to-red-600',
      delay: '0.4s'
    }
  ];

  // Icon mapping for dynamic facilities
  const iconMap = {
    'GraduationCap': GraduationCap,
    'Heart': Heart,
    'Zap': Zap,
    'Droplets': Droplets,
    'Home': Home,
    'Users': Users,
    'TreePine': TreePine,
    'Phone': Phone,
    'Calendar': Calendar,
    'Shield': Shield,
    'Sparkles': Sparkles
  };

  // Default gradients for facilities
  const gradients = [
    'from-blue-400 to-blue-600',
    'from-blue-300 to-blue-500',
    'from-blue-500 to-blue-700',
    'from-sky-400 to-blue-600',
    'from-blue-400 to-indigo-500',
    'from-blue-200 to-blue-400'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-emerald-500/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-32 w-28 h-28 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="h-[600px] relative">
          <ImageWithFallback
            src={homeContent?.heroImageUrl || "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2aWxsYWdlJTIwZ3JlZW4lMjBmaWVsZHN8ZW58MXx8fHwxNzU1NDUzMjgxfDA&ixlib=rb-4.1.0&q=80&w=1080"}
            alt="Village landscape"
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-purple-900/40"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-5xl mx-auto px-6">
            <div className="animate-fade-in-up">
    {/* - Increased font sizes for larger screens (e.g., 2xl:text-[32rem]).
      - A vibrant blue-to-purple-to-pink gradient for more visual impact.
      - A slightly stronger custom drop-shadow to make the text stand out more.
      - `tracking-tighter` to make the large letters sit closer together.
    */}
    <h1 className="text-[16rem] md:text-[18rem] lg:text-[28rem] xl:text-[28rem] 2xl:text-[38rem] font-black mb-8 
                   bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 
                   bg-clip-text text-transparent 
                   drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)] 
                   leading-none tracking-tighter font-serif">
        {loading ? 
            t({ en: 'Welcome to Rampur Village', mr: 'रामपूर गावात आपले स्वागत आहे' }) :
            t(homeContent?.heroTitle) || t({ en: 'Welcome to Rampur Village', mr: 'रामपूर गावात आपले स्वागत आहे' })
        }
    </h1>
</div>
              
              <div className="animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
                <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-white/98 leading-relaxed font-medium drop-shadow-xl max-w-4xl mx-auto">
                  {loading ?
                    t({ 
                      en: 'A progressive smart village embracing technology for sustainable living and digital governance',
                      mr: 'शाश्वत जीवन आणि डिजिटल गव्हर्नन्ससाठी तंत्रज्ञानाचा अवलंब करणारे प्रगतिशील स्मार्ट गाव'
                    }) :
                    t(homeContent?.heroSubtitle) || t({ 
                      en: 'A progressive smart village embracing technology for sustainable living and digital governance',
                      mr: 'शाश्वत जीवन आणि डिजिटल गव्हर्नन्ससाठी तंत्रज्ञानाचा अवलंब करणारे प्रगतिशील स्मार्ट गाव'
                    })
                  }
                </p>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-8 text-lg animate-scale-in" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center gap-3 glass-effect px-6 py-3 rounded-full hover-glow transition-all duration-500 hover-scale">
                  <MapPin className="h-6 w-6 animate-pulse-slow" />
                  <span className="font-medium">{t({ en: 'Maharashtra, India', mr: 'महाराष्ट्र, भारत' })}</span>
                </div>
                <div className="flex items-center gap-3 glass-effect px-6 py-3 rounded-full hover-glow transition-all duration-500 hover-scale">
                  <Calendar className="h-6 w-6 animate-pulse-slow" />
                  <span className="font-medium">{t({ en: 'Est. 1892', mr: 'स्थापना १८९२' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Village Stats */}
      <section className="py-20 px-6 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              {t({ en: 'Village at a Glance', mr: 'गावाची एक झलक' })}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t({ en: 'Key statistics that showcase our vibrant community', mr: 'आमच्या दोलायमान समुदायाचे प्रदर्शन करणारे मुख्य आकडे' })}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {villageStatsConfig.map((statConfig, index) => {
              // Use dynamic villager stats for population, fallback to static for other stats
              const value = statConfig.key === 'population' 
                ? (villagerStats?.total || homeContent?.villageStats?.[statConfig.key] || '-')
                : (homeContent?.villageStats?.[statConfig.key] || '-');
              return (
                <Card key={index} 
                      className={`text-center border-0 shadow-xl hover-lift glass-effect group animate-scale-in`}
                      style={{ animationDelay: statConfig.delay }}>
                  <CardContent className="pt-8 pb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className={`w-20 h-20 bg-gradient-to-br ${statConfig.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 animate-float relative z-10`}>
                      <statConfig.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-4xl font-bold mb-3 gradient-text animate-pulse-slow relative z-10">{value}</div>
                    <p className="text-gray-600 font-medium relative z-10">{t(statConfig.label)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-4xl font-bold mb-8 gradient-text">
                {t({ en: 'About Our Smart Village', mr: 'आमच्या स्मार्ट गावाबद्दल' })}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {loading ?
                  t({
                    en: 'Rampur represents the future of rural India - a harmonious blend of traditional values and cutting-edge technology. Our journey from a small farming community to a digitally empowered smart village showcases what\'s possible when innovation meets determination.',
                    mr: 'रामपूर ग्रामीण भारताच्या भविष्याचे प्रतिनिधित्व करते - पारंपारिक मूल्ये आणि अत्याधुनिक तंत्रज्ञानाचे सुसंवादी मिश्रण. एका छोट्या शेतकरी समुदायातून डिजिटल सक्षम स्मार्ट गावापर्यंतचा आमचा प्रवास दाखवतो की नवकल्पना आणि दृढनिश्चय भेटल्यावर काय शक्य आहे.'
                  }) :
                  t(homeContent?.aboutText) || t({
                    en: 'Rampur represents the future of rural India - a harmonious blend of traditional values and cutting-edge technology. Our journey from a small farming community to a digitally empowered smart village showcases what\'s possible when innovation meets determination.',
                    mr: 'रामपूर ग्रामीण भारताच्या भविष्याचे प्रतिनिधित्व करते - पारंपारिक मूल्ये आणि अत्याधुनिक तंत्रज्ञानाचे सुसंवादी मिश्रण. एका छोट्या शेतकरी समुदायातून डिजिटल सक्षम स्मार्ट गावापर्यंतचा आमचा प्रवास दाखवतो की नवकल्पना आणि दृढनिश्चय भेटल्यावर काय शक्य आहे.'
                  })
                }
              </p>
              
              <div className="space-y-5">
                <div className="flex items-center gap-4 glass-effect p-4 rounded-xl hover-glow transition-all duration-300 hover-scale">
                  <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full animate-pulse-slow"></div>
                  <span className="font-medium">{t({ en: 'Established in 1892 - 130+ years of heritage', mr: '१८९२ मध्ये स्थापना - १३०+ वर्षांचा वारसा' })}</span>
                </div>
                <div className="flex items-center gap-4 glass-effect p-4 rounded-xl hover-glow transition-all duration-300 hover-scale">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full animate-pulse-slow"></div>
                  <span className="font-medium">{t({ en: 'Primary occupation: Smart Agriculture & Technology', mr: 'मुख्य व्यवसाय: स्मार्ट शेती आणि तंत्रज्ञान' })}</span>
                </div>
                <div className="flex items-center gap-4 glass-effect p-4 rounded-xl hover-glow transition-all duration-300 hover-scale">
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full animate-pulse-slow"></div>
                  <span className="font-medium">{t({ en: 'Connected to 5G digital infrastructure', mr: '५जी डिजिटल पायाभूत सुविधांशी जोडलेले' })}</span>
                </div>
              </div>
            </div>
            
            <div className="relative animate-slide-in-right">
              <div className="glass-effect p-6 rounded-3xl hover-lift shadow-2xl">
                <ImageWithFallback
                  src={homeContent?.aboutImageUrl || "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2aWxsYWdlJTIwZ3JlZW4lMjBmaWVsZHN8ZW58MXx8fHwxNzU1NDUzMjgxfDA&ixlib=rb-4.1.0&q=80&w=1080"}
                  alt="Village temple"
                  className="rounded-2xl w-full h-[450px] object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-float shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Village Facilities */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              {t({ en: 'Smart Village Facilities', mr: 'स्मार्ट गावातील सुविधा' })}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t({ en: 'Modern infrastructure powering our digital transformation', mr: 'आमच्या डिजिटल परिवर्तनाला चालना देणारी आधुनिक पायाभूत सुविधा' })}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities.map((facility, index) => {
              const IconComponent = iconMap[facility.icon] || Heart;
              const gradient = gradients[index % gradients.length];
              const delay = `${0.1 + (index * 0.1)}s`;
              
              return (
                <Card key={facility._id || index} 
                      className={`text-center border-0 shadow-xl hover-lift glass-effect group animate-scale-in hover-tilt`}
                      style={{ animationDelay: delay }}>
                  <CardContent className="pt-8 pb-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>
                    <div className={`w-18 h-18 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-float relative z-10`}>
                      <IconComponent className="h-9 w-9 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-3 relative z-10">{t(facility.name) || t({ en: 'Facility', mr: 'सुविधा' })}</h3>
                    <p className="text-gray-600 text-sm relative z-10">{t(facility.description) || t({ en: 'Description', mr: 'वर्णन' })}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Updates */}
      <section className="py-20 px-6 bg-gradient-to-r from-slate-50/80 to-purple-50/80 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              {t({ en: 'Latest Developments', mr: 'अलीकडील विकास' })}
            </h2>
            <p className="text-xl text-gray-600">
              {t({ en: 'Stay updated with our village progress', mr: 'आमच्या गावाच्या प्रगतीसह अद्ययावत राहा' })}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {latestDevelopments.map((development, index) => {
              const gradient = gradients[index % gradients.length];
              const date = new Date(development.publishDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              });
              
              return (
                <Card key={development._id || index} 
                      className={`overflow-hidden border-0 shadow-xl hover-lift glass-effect group animate-slide-in-left cursor-pointer`}
                      style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                      onClick={() => setSelectedNews(development)}>
                  <div className="h-52 overflow-hidden relative">
                    <ImageWithFallback
                      src={development.imageUrl || "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2aWxsYWdlJTIwZ3JlZW4lMjBmaWVsZHN8ZW58MXx8fHwxNzU1NDUzMjgxfDA&ixlib=rb-4.1.0&q=80&w=1080"}
                      alt={t(development.title) || t({ en: 'Latest Development', mr: 'अलीकडील विकास' })}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={`bg-gradient-to-r ${gradient} text-white border-0 px-3 py-1 shadow-lg`}>
                        {t(development.category) || t({ en: 'Development', mr: 'विकास' })}
                      </Badge>
                      <span className="text-sm text-gray-500 font-medium">{date}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-3 group-hover:gradient-text transition-all duration-300">{t(development.title) || t({ en: 'Latest Development', mr: 'अलीकडील विकास' })}</h3>
                    <p className="text-gray-600 text-sm mb-3">{t(development.description) || t({ en: 'Development description', mr: 'विकास वर्णन' })}</p>
                    <div className="w-full h-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${gradient} animate-shimmer`}></div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Village Achievements */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              {t({ en: 'Our Achievements', mr: 'आमच्या उपलब्धी' })}
            </h2>
            <p className="text-xl text-gray-600">
              {t({ 
                en: 'Recognition and milestones that make us proud',
                mr: 'ओळख आणि मैलाचे दगड ज्यांचा आम्हाला अभिमान आहे'
              })}
            </p>
          </div>

          {/* Featured Achievement */}
          {achievements.length > 0 && (
            <div className="mb-16 animate-scale-in">
              <Card className="border-0 shadow-2xl overflow-hidden glass-effect hover-lift group">
                <div className="bg-gradient-to-r from-blue-100/20 via-blue-200/20 to-blue-300/20 p-8">
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl animate-glow group-hover:scale-110 transition-transform duration-500">
                      <Award className="h-16 w-16 text-white animate-pulse-slow" />
                    </div>
                    <div className="flex-1 text-center lg:text-left">
                      <h3 className="text-3xl font-bold mb-4 gradient-text">
                        {t(achievements[0].title) || t({ en: 'Featured Achievement', mr: 'विशेष उपलब्धी' })}
                      </h3>
                      <p className="text-lg mb-6 text-gray-700 leading-relaxed">
                        {t(achievements[0].description) || t({ en: 'Outstanding achievement', mr: 'उत्कृष्ट उपलब्धी' })}
                      </p>
                      <Badge className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-base px-6 py-2 shadow-lg">
                        {t({ en: 'State Level Recognition', mr: 'राज्यस्तरीय मान्यता' })}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Achievement Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {achievements.slice(1).map((achievement, index) => {
              const gradient = gradients[index % gradients.length];
              return (
                <Card key={achievement._id || index} 
                      className={`text-center border-0 shadow-xl hover-lift glass-effect group animate-scale-in hover-tilt`}
                      style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                  <CardContent className="p-8 relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                    <div className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-float relative z-10`}>
                      {achievement.icon || '🏆'}
                    </div>
                    <h4 className="font-bold text-lg mb-3 relative z-10 group-hover:gradient-text transition-all duration-300">
                      {t(achievement.title) || t({ en: 'Achievement', mr: 'उपलब्धी' })}
                    </h4>
                    <p className="text-gray-600 relative z-10">
                      {t(achievement.description) || t({ en: 'Description', mr: 'वर्णन' })}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white relative overflow-hidden">
        {/* Background animation elements */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full animate-float"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-emerald-600/10 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
        
        <div className="container mx-auto relative">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <Card className="glass-effect border-white/10 text-white hover-lift animate-slide-in-left">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                  <Home className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 gradient-text">
                  {t({ en: 'Village Office', mr: 'गाव कार्यालय' })}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {contactInfo?.officeName || 'Village Panchayat Office'}<br />
                  {t(contactInfo?.address) || 'Main Road, Rampur'}<br />
                  {contactInfo?.pincode || 'Dist. Pune - 412345'}
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-white/10 text-white hover-lift animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 gradient-text">
                  {t({ en: 'Contact', mr: 'संपर्क' })}
                </h3>
                <div className="text-gray-300 space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4 text-blue-400" />
                    <span>{contactInfo?.phone || '+91 20 1234 5678'}</span>
                  </div>
                  <p>{contactInfo?.email || 'rampur.panchayat@gov.in'}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-white/10 text-white hover-lift animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 gradient-text">
                  {t({ en: 'Office Hours', mr: 'कार्यालयीन वेळा' })}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {t({ en: 'Monday - Friday', mr: 'सोमवार - शुक्रवार' })}<br />
                  9:00 AM - 5:00 PM<br />
                  {t({ en: 'Saturday: 9:00 AM - 1:00 PM', mr: 'शनिवार: ९:०० AM - १:०० PM' })}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest Developments Modal */}
      <Dialog open={selectedNews !== null} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedNews && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold mb-2">
                  {t(selectedNews.title)}
                </DialogTitle>
                <DialogDescription className="text-lg text-gray-600">
                  {t(selectedNews.description)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Image */}
                <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={selectedNews.imageUrl || "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2aWxsYWdlJTIwZ3JlZW4lMjBmaWVsZHN8ZW58MXx8fHwxNzU1NDUzMjgxfDA&ixlib=rb-4.1.0&q=80&w=1080"}
                    alt={t(selectedNews.title)}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {t(selectedNews.category)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(selectedNews.publishDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {t(selectedNews.description)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}