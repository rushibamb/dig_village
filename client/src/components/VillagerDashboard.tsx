import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { StatusBadge } from './StatusBadge';
import { useLanguage, translations } from './LanguageProvider';
import { 
  User, 
  CreditCard, 
  FileText, 
  Bell, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Edit,
  Download,
  Eye
} from 'lucide-react';

interface VillagerDashboardProps {
  userProfile?: {
    name: string;
    mobile: string;
    villageId: string;
    familyMembers: number;
  };
}

export function VillagerDashboard({ userProfile }: VillagerDashboardProps) {
  const { t } = useLanguage();

  const profile = userProfile || {
    name: '',
    mobile: '',
    villageId: '',
    familyMembers: 0,
    registrationDate: '',
    lastUpdated: ''
  };

  // Applications will be fetched from API
  const [applications, setApplications] = useState([]);

  // Notifications will be fetched from API
  const [notifications, setNotifications] = useState([]);

  // Quick stats will be calculated from actual data
  const [quickStats, setQuickStats] = useState([
    {
      icon: FileText,
      label: { en: 'Active Applications', mr: 'सक्रिय अर्ज' },
      value: '0',
      color: 'text-brand'
    },
    {
      icon: CheckCircle,
      label: { en: 'Completed', mr: 'पूर्ण झालेले' },
      value: '0',
      color: 'text-primary'
    },
    {
      icon: Clock,
      label: { en: 'Pending', mr: 'प्रलंबित' },
      value: '0',
      color: 'text-primary'
    }
  ]);

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {t({ en: 'My Dashboard', mr: 'माझे डॅशबोर्ड' })}
            </h1>
            <p className="text-muted-foreground">
              {t({ en: 'Manage your profile and track applications', mr: 'आपले प्रोफाइल व्यवस्थापित करा आणि अर्जांचा मागोवा घ्या' })}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="flex items-center p-6">
                <stat.icon className={`h-8 w-8 ${stat.color} mr-4`} />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{t(stat.label)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t({ en: 'My Profile', mr: 'माझे प्रोफाइल' })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <h3 className="font-semibold">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">{profile.mobile}</p>
                  <Badge variant="secondary">ID: {profile.villageId}</Badge>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>{t({ en: 'Family Members', mr: 'कुटुंब सदस्य' })}</span>
                    <span className="font-semibold">{profile.familyMembers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t({ en: 'Registered', mr: 'नोंदणी दिनांक' })}</span>
                    <span className="font-semibold">{profile.registrationDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t({ en: 'Last Updated', mr: 'शेवटचे अपडेट' })}</span>
                    <span className="font-semibold">{profile.lastUpdated}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  {t({ en: 'Edit Profile', mr: 'प्रोफाइल संपादित करा' })}
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  {t({ en: 'Notifications', mr: 'सूचना' })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-3 rounded-lg border bg-card">
                    <div className="flex items-start gap-3">
                      {notification.type === 'warning' ? (
                        <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      )}
                      <div className="flex-1 space-y-1">
                        <p className="font-semibold text-sm">{t(notification.title)}</p>
                        <p className="text-xs text-muted-foreground">{t(notification.message)}</p>
                        <p className="text-xs text-muted-foreground">{notification.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Applications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t({ en: 'My Applications', mr: 'माझे अर्ज' })}
                </CardTitle>
                <CardDescription>
                  {t({ en: 'Track the status of your service applications', mr: 'आपल्या सेवा अर्जांच्या स्थितीचा मागोवा घ्या' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{t(application.type)}</h3>
                            <StatusBadge status={application.status} />
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>ID: {application.id}</span>
                            <span>{application.date}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{t({ en: 'Progress', mr: 'प्रगती' })}</span>
                              <span>{application.progress}%</span>
                            </div>
                            <Progress value={application.progress} className="h-2" />
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            {t({ en: 'View', mr: 'पहा' })}
                          </Button>
                          {application.status === 'approved' && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              {t({ en: 'Download', mr: 'डाउनलोड' })}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button className="w-full md:w-auto">
                    <FileText className="h-4 w-4 mr-2" />
                    {t({ en: 'New Application', mr: 'नवीन अर्ज' })}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tax Payment Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {t({ en: 'Tax Information', mr: 'कर माहिती' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-primary">
                        {t({ en: 'Due Payment', mr: 'देय पेमेंट' })}
                      </h3>
                    </div>
                    <p className="text-2xl font-bold text-primary">₹2,500</p>
                    <p className="text-sm text-primary/80">
                      {t({ en: 'Due by Jan 31, 2024', mr: '३१ जानेवारी २०२४ पर्यंत' })}
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-primary">
                        {t({ en: 'Last Payment', mr: 'शेवटचे पेमेंट' })}
                      </h3>
                    </div>
                    <p className="text-2xl font-bold text-primary">₹2,500</p>
                    <p className="text-sm text-primary/80">
                      {t({ en: 'Paid on Dec 15, 2023', mr: '१५ डिसेंबर २०२३ रोजी भरले' })}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button className="flex-1">
                    <CreditCard className="h-4 w-4 mr-2" />
                    {t({ en: 'Pay Now', mr: 'आता भरा' })}
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    {t({ en: 'History', mr: 'इतिहास' })}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}