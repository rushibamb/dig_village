import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageProvider';
import { 
  Newspaper, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertTriangle,
  Info,
  Megaphone,
  Zap,
  Droplets,
  Construction,
  Bell,
  ArrowRight,
  Share2,
  Bookmark
} from 'lucide-react';

export function NewsPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const newsCategories = [
    { id: 'all', label: { en: 'All News', mr: 'सर्व बातम्या' }, icon: Newspaper },
    { id: 'announcements', label: { en: 'Announcements', mr: 'घोषणा' }, icon: Megaphone },
    { id: 'events', label: { en: 'Events', mr: 'कार्यक्रम' }, icon: Calendar },
    { id: 'alerts', label: { en: 'Alerts', mr: 'सूचना' }, icon: AlertTriangle },
    { id: 'utilities', label: { en: 'Utilities', mr: 'सुविधा' }, icon: Zap }
  ];

  const newsItems = [
    {
      id: 1,
      category: 'alerts',
      priority: 'high',
      title: { en: 'Water Supply Disruption Notice', mr: 'पाणी पुरवठा खंडित होण्याची सूचना' },
      content: { 
        en: 'Water supply will be disrupted on January 25th from 6 AM to 4 PM due to pipeline maintenance work. Residents are advised to store water in advance.',
        mr: 'पाइपलाइन देखभाल कामामुळे २५ जानेवारी सकाळी ६ ते दुपारी ४ वाजेपर्यंत पाणी पुरवठा खंडित राहील. रहिवाशांना आगाऊ पाणी साठवण्याचा सल्ला दिला जातो.'
      },
      date: '2024-01-22',
      time: '09:30 AM',
      icon: Droplets,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 2,
      category: 'announcements',
      priority: 'medium',
      title: { en: 'Village Gram Sabha Meeting', mr: 'गाव ग्राम सभा बैठक' },
      content: { 
        en: 'Monthly Gram Sabha meeting scheduled for January 28th at 10 AM at the Village Panchayat Hall. All villagers are requested to attend.',
        mr: '२८ जानेवारी सकाळी १० वाजता गाव पंचायत हॉलमध्ये मासिक ग्राम सभा बैठक नियोजित आहे. सर्व गावकऱ्यांना उपस्थित राहण्याची विनंती.'
      },
      date: '2024-01-20',
      time: '02:15 PM',
      icon: Megaphone,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      image: 'https://images.unsplash.com/photo-1667564790635-0f560121359e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2aWxsYWdlJTIwYW5ub3VuY2VtZW50JTIwbWVldGluZ3xlbnwxfHx8fDE3NTU0NTU1ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 3,
      category: 'utilities',
      priority: 'medium',
      title: { en: 'Electricity Maintenance Work', mr: 'वीज देखभाल कार्य' },
      content: { 
        en: 'Scheduled power outage on January 26th from 11 AM to 3 PM in Ward 2 and Ward 3 for transformer maintenance.',
        mr: 'ट्रान्सफॉर्मर देखभालीसाठी २६ जानेवारी सकाळी ११ ते दुपारी ३ वाजेपर्यंत वार्ड २ आणि वार्ड ३ मध्ये नियोजित वीज खंडित.'
      },
      date: '2024-01-19',
      time: '11:00 AM',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      id: 4,
      category: 'events',
      priority: 'low',
      title: { en: 'Republic Day Celebration', mr: 'प्रजासत्ताक दिन साजरा' },
      content: { 
        en: 'Join us for the Republic Day celebration on January 26th at 8 AM at the Village Ground. Flag hoisting, cultural programs, and refreshments.',
        mr: '२६ जानेवारी सकाळी ८ वाजता गाव मैदानावर प्रजासत्ताक दिन साजरीकरणासाठी सामील व्हा. ध्वजारोहण, सांस्कृतिक कार्यक्रम आणि जलपान.'
      },
      date: '2024-01-18',
      time: '04:30 PM',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 5,
      category: 'announcements',
      priority: 'medium',
      title: { en: 'New Road Construction Update', mr: 'नवीन रस्ता बांधकाम अपडेट' },
      content: { 
        en: 'The concrete road construction work from Main Gate to School is 75% complete. Expected completion by February 15th.',
        mr: 'मुख्य गेट ते शाळेपर्यंतचे काँक्रीट रस्ता बांधकाम ७५% पूर्ण झाले आहे. १५ फेब्रुवारीपर्यंत पूर्ण होण्याची अपेक्षा.'
      },
      date: '2024-01-17',
      time: '10:45 AM',
      icon: Construction,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 6,
      category: 'alerts',
      priority: 'high',
      title: { en: 'Heavy Rain Warning', mr: 'जोरदार पावसाचे इशारे' },
      content: { 
        en: 'Heavy rainfall predicted for next 3 days. Farmers advised to take necessary precautions for crops. Avoid unnecessary travel.',
        mr: 'पुढील ३ दिवस जोरदार पावसाचा अंदाज. शेतकऱ्यांना पिकांसाठी आवश्यक काळजी घेण्याचा सल्ला. अनावश्यक प्रवास टाळा.'
      },
      date: '2024-01-16',
      time: '06:00 AM',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  const upcomingEvents = [
    {
      date: '28',
      month: 'Jan',
      title: { en: 'Gram Sabha Meeting', mr: 'ग्राम सभा बैठक' },
      time: '10:00 AM'
    },
    {
      date: '26',
      month: 'Jan',
      title: { en: 'Republic Day', mr: 'प्रजासत्ताक दिन' },
      time: '08:00 AM'
    },
    {
      date: '15',
      month: 'Feb',
      title: { en: 'Health Camp', mr: 'आरोग्य शिबिर' },
      time: '09:00 AM'
    }
  ];

  const filteredNews = selectedCategory === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Newspaper className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t({ en: 'Village News & Updates', mr: 'गाव बातम्या आणि अपडेट्स' })}
          </h1>
          <p className="text-gray-600 text-lg">
            {t({ en: 'Stay informed about village events, announcements and alerts', mr: 'गावातील कार्यक्रम, घोषणा आणि सूचनांबद्दल माहिती मिळवा' })}
          </p>
        </div>

        {/* Breaking News Banner */}
        <Card className="mb-8 bg-gradient-to-r from-red-500 to-red-600 border-0 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <Bell className="h-5 w-5 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <span className="font-bold text-sm">
                  {t({ en: 'BREAKING:', mr: 'तातडीची:' })}
                </span>
                <span className="ml-2">
                  {t({ 
                    en: 'Water supply disruption on Jan 25th - Store water in advance',
                    mr: '२५ जानेवारी पाणी पुरवठा खंडित - आगाऊ पाणी साठवा'
                  })}
                </span>
              </div>
              <ArrowRight className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {newsCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`gap-2 ${selectedCategory === category.id ? 'bg-indigo-600 text-white' : ''}`}
                >
                  <category.icon className="h-4 w-4" />
                  {t(category.label)}
                </Button>
              ))}
            </div>

            {/* News Items */}
            <div className="space-y-6">
              {filteredNews.map((item) => (
                <Card key={item.id} className={`hover:shadow-lg transition-shadow ${item.bgColor} ${item.borderColor} border-l-4`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${item.bgColor}`}>
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {t(newsCategories.find(cat => cat.id === item.category)?.label || { en: '', mr: '' })}
                              </Badge>
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(item.priority)}`}></div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">{t(item.title)}</h2>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Bookmark className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {item.image && (
                          <div className="mb-4">
                            <ImageWithFallback
                              src={item.image}
                              alt={t(item.title)}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        
                        <p className="text-gray-700 mb-4 leading-relaxed">{t(item.content)}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(item.date).toLocaleDateString('en-GB')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {item.time}
                            </span>
                          </div>
                          
                          <Button variant="link" className="text-indigo-600 p-0 h-auto">
                            {t({ en: 'Read more', mr: 'अधिक वाचा' })}
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  {t({ en: 'Upcoming Events', mr: 'आगामी कार्यक्रम' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">{event.date}</div>
                        <div className="text-xs text-gray-600">{event.month}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{t(event.title)}</h4>
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weather Alert */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-5 w-5" />
                  {t({ en: 'Weather Alert', mr: 'हवामान इशारा' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-700 text-sm mb-3">
                  {t({ 
                    en: 'Heavy rainfall expected for next 72 hours. Take necessary precautions.',
                    mr: 'पुढील ७२ तासांत जोरदार पावसाची शक्यता. आवश्यक खबरदारी घ्या.'
                  })}
                </p>
                <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-700 w-full">
                  {t({ en: 'View Details', mr: 'तपशील पहा' })}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-indigo-600" />
                  {t({ en: 'Quick Links', mr: 'द्रुत दुवे' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    {t({ en: 'Emergency Contacts', mr: 'आपत्कालीन संपर्क' })}
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    {t({ en: 'Village Directory', mr: 'गाव निर्देशिका' })}
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    {t({ en: 'Submit News', mr: 'बातमी सबमिट करा' })}
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    {t({ en: 'Newsletter Archive', mr: 'वृत्तपत्र संग्रह' })}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Subscribe Newsletter */}
            <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-80" />
                <h3 className="font-bold mb-2">
                  {t({ en: 'Stay Updated', mr: 'अपडेट राहा' })}
                </h3>
                <p className="text-sm mb-4 opacity-90">
                  {t({ 
                    en: 'Get instant notifications for important village updates',
                    mr: 'महत्त्वाच्या गाव अपडेट्ससाठी त्वरित सूचना मिळवा'
                  })}
                </p>
                <Button className="bg-white text-indigo-600 hover:bg-gray-100 w-full">
                  {t({ en: 'Enable Notifications', mr: 'सूचना सक्षम करा' })}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}