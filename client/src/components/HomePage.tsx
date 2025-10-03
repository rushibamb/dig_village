import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  CreditCard, 
  FileText, 
  Users, 
  Newspaper, 
  ClipboardList,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Shield,
  TreePine,
  Users2
} from 'lucide-react';
import { useLanguage, translations } from './LanguageProvider';

interface HomePageProps {
  onQuickAction?: (action: string) => void;
}

export function HomePage({ onQuickAction }: HomePageProps) {
  const { t } = useLanguage();

  const quickActions = [
    {
      icon: CreditCard,
      title: t(translations.payTax),
      description: { en: 'Pay your property tax online securely', mr: 'आपला मालमत्ता कर ऑनलाइन सुरक्षितपणे भरा' },
      action: 'pay-tax',
      color: 'bg-brand text-brand-foreground'
    },
    {
      icon: FileText,
      title: t(translations.submitGrievance),
      description: { en: 'Submit complaints and track their status', mr: 'तक्रारी सबमिट करा आणि त्यांच्या स्थितीचा मागोवा घ्या' },
      action: 'grievance',
      color: 'bg-accent text-accent-foreground'
    },
    {
      icon: ClipboardList,
      title: t(translations.serviceApplications),
      description: { en: 'Apply for government services online', mr: 'ऑनलाइन सरकारी सेवांसाठी अर्ज करा' },
      action: 'services',
      color: 'bg-primary text-primary-foreground'
    },
    {
      icon: Users,
      title: t(translations.villagerManagement),
      description: { en: 'Register and manage family details', mr: 'कुटुंबाचे तपशील नोंदवा आणि व्यवस्थापित करा' },
      action: 'register',
      color: 'bg-secondary text-secondary-foreground'
    }
  ];

  const villageStats = [
    { 
      icon: Users2, 
      label: { en: 'Total Villagers', mr: 'एकूण गावकरी' }, 
      value: '2,847',
      color: 'text-primary'
    },
    { 
      icon: Shield, 
      label: { en: 'Registered Families', mr: 'नोंदणीकृत कुटुंबे' }, 
      value: '743',
      color: 'text-brand'
    },
    { 
      icon: TreePine, 
      label: { en: 'Area (sq km)', mr: 'क्षेत्रफळ (चौ. कि.मी.)' }, 
      value: '12.5',
      color: 'text-accent'
    }
  ];

  const recentNews = [
    {
      title: { en: 'New Water Supply Scheme Approved', mr: 'नवीन पाणीपुरवठा योजना मंजूर' },
      date: '2024-01-15',
      category: { en: 'Infrastructure', mr: 'पायाभूत सुविधा' }
    },
    {
      title: { en: 'Solar Street Light Installation', mr: 'सौर रस्ता दिवे बसवणे' },
      date: '2024-01-12',
      category: { en: 'Development', mr: 'विकास' }
    },
    {
      title: { en: 'Agricultural Subsidy Applications Open', mr: 'कृषी अनुदान अर्ज सुरू' },
      date: '2024-01-10',
      category: { en: 'Agriculture', mr: 'शेती' }
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-br from-primary/5 via-accent/5 to-brand/5">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {t(translations.welcomeTo)} <br />
                  <span className="text-primary">{t(translations.smartVillagePortal)}</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  {t({ 
                    en: 'Empowering our village with digital services for a better tomorrow',
                    mr: 'उज्ज्वल उद्याकरिता डिजिटल सेवांसह आमच्या गावाला सशक्त बनवत आहोत'
                  })}
                </p>
              </div>

              {/* Village Stats */}
              <div className="grid grid-cols-3 gap-4">
                {villageStats.map((stat, index) => (
                  <div key={index} className="text-center p-4 rounded-lg bg-card border">
                    <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">
                      {t(stat.label)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1709744873302-923841d5e8b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2aWxsYWdlJTIwcnVyYWwlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU1NDUyNjIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Village landscape"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t({ en: 'Quick Services', mr: 'त्वरित सेवा' })}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t({ 
                en: 'Access essential village services with just a few clicks',
                mr: 'फक्त काही क्लिकसह आवश्यक गाव सेवांमध्ये प्रवेश मिळवा'
              })}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20"
                onClick={() => onQuickAction?.(action.action)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="mb-4">
                    {t(action.description)}
                  </CardDescription>
                  <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                    {t({ en: 'Get Started', mr: 'सुरुवात करा' })}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent News */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              {t({ en: 'Latest News & Updates', mr: 'ताज्या बातम्या आणि अपडेट्स' })}
            </h2>
            <Button variant="outline">
              {t({ en: 'View All', mr: 'सर्व पहा' })}
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {recentNews.map((news, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">{t(news.category)}</Badge>
                    <span className="text-sm text-muted-foreground">{news.date}</span>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {t(news.title)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" className="p-0 h-auto text-primary">
                    {t({ en: 'Read More', mr: 'अधिक वाचा' })}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-card rounded-2xl p-8 border">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {t({ en: 'Village Office Contact', mr: 'गाव कार्यालय संपर्क' })}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <MapPin className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold mb-1">
                    {t({ en: 'Address', mr: 'पत्ता' })}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Village Panchayat Office<br />
                    Main Road, Village Name<br />
                    District, State - 123456
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <Phone className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold mb-1">
                    {t({ en: 'Phone', mr: 'दूरध्वनी' })}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    +91 12345 67890<br />
                    Helpline: 1800-123-456
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <Mail className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold mb-1">
                    {t({ en: 'Email', mr: 'ईमेल' })}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    info@village.gov.in<br />
                    grievance@village.gov.in
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}