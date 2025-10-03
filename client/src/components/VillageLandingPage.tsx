import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageProvider';
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

  const villageStats = [
    {
      icon: Users,
      label: { en: 'Total Population', mr: 'एकूण लोकसंख्या' },
      value: '3,247',
      gradient: 'from-emerald-500 to-green-600',
      delay: '0.1s'
    },
    {
      icon: Home,
      label: { en: 'Households', mr: 'कुटुंबे' },
      value: '823',
      gradient: 'from-blue-500 to-cyan-600',
      delay: '0.2s'
    },
    {
      icon: TreePine,
      label: { en: 'Area (Hectares)', mr: 'क्षेत्रफळ (हेक्टर)' },
      value: '1,250',
      gradient: 'from-purple-500 to-violet-600',
      delay: '0.3s'
    },
    {
      icon: GraduationCap,
      label: { en: 'Literacy Rate', mr: 'साक्षरता दर' },
      value: '78%',
      gradient: 'from-orange-500 to-red-600',
      delay: '0.4s'
    }
  ];

  const facilities = [
    {
      icon: GraduationCap,
      name: { en: 'Primary School', mr: 'प्राथमिक शाळा' },
      description: { en: 'Modern educational facility with smart classrooms', mr: 'स्मार्ट वर्गखोल्यांसह आधुनिक शैक्षणिक सुविधा' },
      gradient: 'from-blue-500 to-indigo-600',
      delay: '0.1s'
    },
    {
      icon: Heart,
      name: { en: 'Health Center', mr: 'आरोग्य केंद्र' },
      description: { en: '24/7 primary healthcare services', mr: '२४/७ प्राथमिक आरोग्य सेवा' },
      gradient: 'from-red-500 to-pink-600',
      delay: '0.2s'
    },
    {
      icon: Zap,
      name: { en: 'Solar Grid', mr: 'सौर ग्रिड' },
      description: { en: 'Renewable energy with 80% solar coverage', mr: '८०% सौर कव्हरेजसह नवीकरणीय ऊर्जा' },
      gradient: 'from-yellow-500 to-orange-600',
      delay: '0.3s'
    },
    {
      icon: Droplets,
      name: { en: 'Water System', mr: 'जल प्रणाली' },
      description: { en: 'Smart water management and purification', mr: 'स्मार्ट जल व्यवस्थापन आणि शुद्धीकरण' },
      gradient: 'from-cyan-500 to-blue-600',
      delay: '0.4s'
    }
  ];

  const recentUpdates = [
    {
      title: { en: 'Digital Infrastructure Upgrade', mr: 'डिजिटल पायाभूत सुविधा सुधारणा' },
      date: '15 Jan 2024',
      category: { en: 'Technology', mr: 'तंत्रज्ञान' },
      gradient: 'from-purple-500 to-indigo-600',
      image: 'https://images.unsplash.com/photo-1655974239313-5ab1747a002e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2aWxsYWdlJTIwYmVhdXRpZnVsJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc1NTQ1MzI4MXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      title: { en: 'Community Health Program', mr: 'सामुदायिक आरोग्य कार्यक्रम' },
      date: '12 Jan 2024',
      category: { en: 'Health', mr: 'आरोग्य' },
      gradient: 'from-green-500 to-emerald-600',
      image: 'https://images.unsplash.com/photo-1740477138822-906f6b845579?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2aWxsYWdlJTIwY29tbXVuaXR5JTIwcGVvcGxlfGVufDF8fHx8MTc1NTQ1MzI4Nnww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      title: { en: 'Smart Farming Initiative', mr: 'स्मार्ट शेती उपक्रम' },
      date: '8 Jan 2024',
      category: { en: 'Agriculture', mr: 'शेती' },
      gradient: 'from-orange-500 to-red-600',
      image: 'https://images.unsplash.com/photo-1643474004250-05d73e1473e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2aWxsYWdlJTIwYWdyaWN1bHR1cmUlMjBmYXJtaW5nfGVufDF8fHx8MTc1NTQ1MzI5Mnww&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  const achievements = [
    {
      title: { en: 'Best Digital Village 2023', mr: 'सर्वोत्तम डिजिटल गाव २०२३' },
      description: { en: 'State Government Recognition', mr: 'राज्य सरकार मान्यता' },
      icon: '🏆',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      title: { en: 'Clean Village Award', mr: 'स्वच्छ गाव पुरस्कार' },
      description: { en: 'District Level Achievement', mr: 'जिल्हा स्तरीय उपलब्धी' },
      icon: '🌟',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: { en: 'Solar Champion', mr: 'सौर चॅम्पियन' },
      description: { en: '80% Renewable Energy', mr: '८०% नवीकरणीय ऊर्जा' },
      icon: '⚡',
      gradient: 'from-blue-500 to-cyan-600'
    }
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
            src="https://images.unsplash.com/photo-1655974239313-5ab1747a002e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2aWxsYWdlJTIwYmVhdXRpZnVsJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc1NTQ1MzI4MXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Village landscape"
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-purple-900/40"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-5xl mx-auto px-6">
              <div className="animate-fade-in-up">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text-primary">
                  {t({ en: 'Welcome to Rampur Village', mr: 'रामपूर गावात आपले स्वागत आहे' })}
                </h1>
              </div>
              
              <div className="animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
                <p className="text-xl md:text-2xl mb-10 opacity-95 leading-relaxed">
                  {t({ 
                    en: 'A progressive smart village embracing technology for sustainable living and digital governance',
                    mr: 'शाश्वत जीवन आणि डिजिटल गव्हर्नन्ससाठी तंत्रज्ञानाचा अवलंब करणारे प्रगतिशील स्मार्ट गाव'
                  })}
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
            {villageStats.map((stat, index) => (
              <Card key={index} 
                    className={`text-center border-0 shadow-xl hover-lift glass-effect group animate-scale-in`}
                    style={{ animationDelay: stat.delay }}>
                <CardContent className="pt-8 pb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500"></div>
                  <div className={`w-20 h-20 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 animate-float relative z-10`}>
                    <stat.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold mb-3 gradient-text animate-pulse-slow relative z-10">{stat.value}</div>
                  <p className="text-gray-600 font-medium relative z-10">{t(stat.label)}</p>
                </CardContent>
              </Card>
            ))}
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
                {t({
                  en: 'Rampur represents the future of rural India - a harmonious blend of traditional values and cutting-edge technology. Our journey from a small farming community to a digitally empowered smart village showcases what\'s possible when innovation meets determination.',
                  mr: 'रामपूर ग्रामीण भारताच्या भविष्याचे प्रतिनिधित्व करते - पारंपारिक मूल्ये आणि अत्याधुनिक तंत्रज्ञानाचे सुसंवादी मिश्रण. एका छोट्या शेतकरी समुदायातून डिजिटल सक्षम स्मार्ट गावापर्यंतचा आमचा प्रवास दाखवतो की नवकल्पना आणि दृढनिश्चय भेटल्यावर काय शक्य आहे.'
                })}
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
                  src="https://images.unsplash.com/photo-1695981103111-89f89e9755a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx2aWxsYWdlJTIwdGVtcGxlJTIwYXJjaGl0ZWN0dXJlJTIwaW5kaWF8ZW58MXx8fHwxNzU1NDUzMjg5fDA&ixlib=rb-4.1.0&q=80&w=1080"
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
            {facilities.map((facility, index) => (
              <Card key={index} 
                    className={`text-center border-0 shadow-xl hover-lift glass-effect group animate-scale-in hover-tilt`}
                    style={{ animationDelay: facility.delay }}>
                <CardContent className="pt-8 pb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>
                  <div className={`w-18 h-18 bg-gradient-to-br ${facility.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-float relative z-10`}>
                    <facility.icon className="h-9 w-9 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-3 relative z-10">{t(facility.name)}</h3>
                  <p className="text-gray-600 text-sm relative z-10">{t(facility.description)}</p>
                </CardContent>
              </Card>
            ))}
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
            {recentUpdates.map((update, index) => (
              <Card key={index} 
                    className={`overflow-hidden border-0 shadow-xl hover-lift glass-effect group animate-slide-in-left`}
                    style={{ animationDelay: `${0.1 + index * 0.1}s` }}>
                <div className="h-52 overflow-hidden relative">
                  <ImageWithFallback
                    src={update.image}
                    alt={t(update.title)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={`bg-gradient-to-r ${update.gradient} text-white border-0 px-3 py-1 shadow-lg`}>
                      {t(update.category)}
                    </Badge>
                    <span className="text-sm text-gray-500 font-medium">{update.date}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-3 group-hover:gradient-text transition-all duration-300">{t(update.title)}</h3>
                  <div className="w-full h-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${update.gradient} animate-shimmer`}></div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
          <div className="mb-16 animate-scale-in">
            <Card className="border-0 shadow-2xl overflow-hidden glass-effect hover-lift group">
              <div className="bg-gradient-to-r from-yellow-400/10 via-orange-500/10 to-red-500/10 p-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl animate-glow group-hover:scale-110 transition-transform duration-500">
                    <Award className="h-16 w-16 text-white animate-pulse-slow" />
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-3xl font-bold mb-4 gradient-text">
                      {t({ en: 'Best Digital Village Award 2023', mr: 'सर्वोत्तम डिजिटल गाव पुरस्कार २०२३' })}
                    </h3>
                    <p className="text-lg mb-6 text-gray-700 leading-relaxed">
                      {t({ 
                        en: 'Awarded by Maharashtra State Government for outstanding digital transformation and e-governance implementation',
                        mr: 'उत्कृष्ट डिजिटल परिवर्तन आणि ई-गव्हर्नन्स अंमलबजावणीसाठी महाराष्ट्र राज्य सरकारकडून पुरस्कृत'
                      })}
                    </p>
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-base px-6 py-2 shadow-lg">
                      {t({ en: 'State Level Recognition', mr: 'राज्यस्तरीय मान्यता' })}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Achievement Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} 
                    className={`text-center border-0 shadow-xl hover-lift glass-effect group animate-scale-in hover-tilt`}
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <CardContent className="p-8 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${achievement.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  <div className={`w-20 h-20 bg-gradient-to-br ${achievement.gradient} rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-float relative z-10`}>
                    {achievement.icon}
                  </div>
                  <h4 className="font-bold text-lg mb-3 relative z-10 group-hover:gradient-text transition-all duration-300">
                    {t(achievement.title)}
                  </h4>
                  <p className="text-gray-600 relative z-10">
                    {t(achievement.description)}
                  </p>
                </CardContent>
              </Card>
            ))}
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
                  Village Panchayat Office<br />
                  Main Road, Rampur<br />
                  Dist. Pune - 412345
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
                    <span>+91 20 1234 5678</span>
                  </div>
                  <p>rampur.panchayat@gov.in</p>
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
    </div>
  );
}