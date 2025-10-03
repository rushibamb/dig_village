import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useLanguage } from './LanguageProvider';
import { ContractsManagement } from './ContractsManagement';
import { 
  Home,
  CreditCard,
  MessageSquare,
  User,
  Settings,
  Camera,
  Newspaper,
  FileBarChart
} from 'lucide-react';

export function AdminPageWithContracts() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('home-content');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {language === 'mr' ? 'प्रशासन पटल' : 'Admin Dashboard'}
              </h1>
              <p className="text-muted-foreground">
                {language === 'mr' 
                  ? 'गाव प्रशासन आणि सेवा व्यवस्थापन' 
                  : 'Village administration and service management'
                }
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>{language === 'mr' ? 'मुख्य पृष्ठ' : 'Home'}</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 lg:grid-cols-8">
            <TabsTrigger value="home-content" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === 'mr' ? 'मुख्यपृष्ठ' : 'Home'}
              </span>
            </TabsTrigger>
            <TabsTrigger value="tax-management" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === 'mr' ? 'कर' : 'Tax'}
              </span>
            </TabsTrigger>
            <TabsTrigger value="grievance-management" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === 'mr' ? 'तक्रार' : 'Grievance'}
              </span>
            </TabsTrigger>
            <TabsTrigger value="villager-management" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === 'mr' ? 'गावकरी' : 'Villager'}
              </span>
            </TabsTrigger>
            <TabsTrigger value="committee-management" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === 'mr' ? 'समिती' : 'Committee'}
              </span>
            </TabsTrigger>
            <TabsTrigger value="media-management" className="flex items-center space-x-2">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === 'mr' ? 'मीडिया' : 'Media'}
              </span>
            </TabsTrigger>
            <TabsTrigger value="news-management" className="flex items-center space-x-2">
              <Newspaper className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === 'mr' ? 'बातम्या' : 'News'}
              </span>
            </TabsTrigger>
            <TabsTrigger value="contracts-management" className="flex items-center space-x-2">
              <FileBarChart className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === 'mr' ? 'कंत्राट' : 'Contracts'}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Home Content Management */}
          <TabsContent value="home-content">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'mr' ? 'मुख्यपृष्ठ व्यवस्थापन' : 'Home Content Management'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === 'mr' 
                    ? 'मुख्यपृष्ठ सामग्री संपादित करा' 
                    : 'Edit home page content'
                  }
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tax Management */}
          <TabsContent value="tax-management">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'mr' ? 'कर व्यवस्थापन' : 'Tax Management'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === 'mr' 
                    ? 'कर नोंदी आणि पेमेंट व्यवस्थापित करा' 
                    : 'Manage tax records and payments'
                  }
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grievance Management */}
          <TabsContent value="grievance-management">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'mr' ? 'तक्रार व्यवस्थापन' : 'Grievance Management'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === 'mr' 
                    ? 'गावकऱ्यांच्या तक्रारी व्यवस्थापित करा' 
                    : 'Manage villager complaints and grievances'
                  }
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Villager Management */}
          <TabsContent value="villager-management">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'mr' ? 'गावकरी व्यवस्थापन' : 'Villager Management'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === 'mr' 
                    ? 'गावकऱ्यांची नोंदणी आणि माहिती व्यवस्थापित करा' 
                    : 'Manage villager registration and information'
                  }
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Committee Management */}
          <TabsContent value="committee-management">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'mr' ? 'समिती व्यवस्थापन' : 'Committee Management'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === 'mr' 
                    ? 'गाव समिती आणि पदाधिकारी व्यवस्थापित करा' 
                    : 'Manage village committee and officials'
                  }
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Management */}
          <TabsContent value="media-management">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'mr' ? 'मीडिया व्यवस्थापन' : 'Media Management'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === 'mr' 
                    ? 'फोटो आणि व्हिडिओ व्यवस्थापित करा' 
                    : 'Manage photos and videos'
                  }
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* News Management */}
          <TabsContent value="news-management">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'mr' ? 'बातम्या व्यवस्थापन' : 'News Management'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === 'mr' 
                    ? 'गाव बातम्या आणि घोषणा व्यवस्थापित करा' 
                    : 'Manage village news and announcements'
                  }
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contracts Management */}
          <TabsContent value="contracts-management">
            <ContractsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}