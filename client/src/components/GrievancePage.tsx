import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useLanguage } from './LanguageProvider';
import { useAuth } from './AuthContext';
import { toast } from 'sonner@2.0.3';
import { FileText, Plus, MessageCircle, Clock, CheckCircle, AlertTriangle, Camera, User } from 'lucide-react';

export function GrievancePage() {
  const { t } = useLanguage();
  const { isLoggedIn } = useAuth();
  const [showNewGrievanceForm, setShowNewGrievanceForm] = useState(false);

  const handleNewGrievance = () => {
    if (!isLoggedIn) {
      toast.error(t({ 
        en: 'Please login to submit a grievance', 
        mr: 'तक्रार सबमिट करण्यासाठी कृपया लॉगिन करा' 
      }));
      return;
    }
    setShowNewGrievanceForm(true);
  };

  const grievances = [
    {
      id: 'GRV001',
      title: { en: 'Street Light Not Working', mr: 'रस्ता दिवा काम करत नाही' },
      category: { en: 'Infrastructure', mr: 'पायाभूत सुविधा' },
      description: { en: 'The street light near temple is not working since 3 days', mr: 'मंदिराजवळील रस्ता दिवा ३ दिवसांपासून काम करत नाही' },
      status: 'in-progress',
      date: '10 Jan 2024',
      response: { en: 'We have forwarded your complaint to electricity department', mr: 'आम्ही तुमची तक्रार वीज विभागाकडे पाठवली आहे' }
    },
    {
      id: 'GRV002',
      title: { en: 'Water Supply Issue', mr: 'पाणीपुरवठ्याची समस्या' },
      category: { en: 'Water', mr: 'पाणी' },
      description: { en: 'Irregular water supply in ward 3', mr: 'वार्ड ३ मध्ये अनियमित पाणीपुरवठा' },
      status: 'resolved',
      date: '5 Jan 2024',
      response: { en: 'Issue has been resolved. New water connection installed', mr: 'समस्येचे निराकरण झाले आहे. नवीन पाणी कनेक्शन बसवले आहे' }
    },
    {
      id: 'GRV003',
      title: { en: 'Road Repair Needed', mr: 'रस्ता दुरुस्तीची गरज' },
      category: { en: 'Roads', mr: 'रस्ते' },
      description: { en: 'Main road has potholes causing inconvenience', mr: 'मुख्य रस्त्यावर खड्डे असल्यामुळे अडचण होत आहे' },
      status: 'pending',
      date: '8 Jan 2024',
      response: null
    }
  ];

  const categories = [
    { en: 'Infrastructure', mr: 'पायाभूत सुविधा' },
    { en: 'Water', mr: 'पाणी' },
    { en: 'Roads', mr: 'रस्ते' },
    { en: 'Electricity', mr: 'वीज' },
    { en: 'Health', mr: 'आरोग्य' },
    { en: 'Education', mr: 'शिक्षण' },
    { en: 'Other', mr: 'इतर' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-white';
      case 'in-progress': return 'bg-blue-500 text-white';
      case 'resolved': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <MessageCircle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-grievance rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t({ en: 'Grievance Redressal', mr: 'तक्रार निवारण' })}
          </h1>
          <p className="text-gray-600 text-lg">
            {t({ en: 'Submit complaints and track their resolution', mr: 'तक्रारी सबमिट करा आणि त्यांच्या निराकरणाचा मागोवा घ्या' })}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* New Grievance Button */}
            <Card className="mb-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {t({ en: 'Have a Complaint?', mr: 'तक्रार आहे?' })}
                    </h3>
                    <p className="opacity-90">
                      {t({ en: 'Submit your grievance and we will address it promptly', mr: 'आपली तक्रार सबमिट करा आणि आम्ही तिचे तातडीने निराकरण करू' })}
                    </p>
                  </div>
                  <Button 
                    onClick={handleNewGrievance}
                    className="bg-white text-purple-600 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t({ en: 'New Grievance', mr: 'नवीन तक्रार' })}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Authentication Warning */}
            {!isLoggedIn && (
              <Card className="mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center animate-pulse-slow">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-purple-700 mb-1">
                        {t({ en: 'Login Required', mr: 'लॉगिन आवश्यक' })}
                      </h3>
                      <p className="text-purple-600 text-sm mb-3">
                        {t({ 
                          en: 'You need to login to submit grievances and track their status. Please login to access all features.',
                          mr: 'तक्रारी सबमिट करण्यासाठी आणि त्यांची स्थिती पाहण्यासाठी तुम्हाला लॉगिन करावे लागेल. सर्व वैशिष्ट्ये वापरण्यासाठी कृपया लॉगिन करा.'
                        })}
                      </p>
                      <Button 
                        onClick={() => window.location.href = '/login'}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 hover-scale hover:shadow-xl transition-all duration-300"
                        size="sm"
                      >
                        <User className="h-4 w-4 mr-2" />
                        {t({ en: 'Login Now', mr: 'आता लॉगिन करा' })}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* New Grievance Form */}
            {showNewGrievanceForm && (
              <Card className="mb-6 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-grievance">
                    {t({ en: 'Submit New Grievance', mr: 'नवीन तक्रार सबमिट करा' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t({ en: 'Category', mr: 'श्रेणी' })} *
                        </label>
                        <select className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-grievance">
                          <option value="">{t({ en: 'Select Category', mr: 'श्रेणी निवडा' })}</option>
                          {categories.map((cat, index) => (
                            <option key={index} value={cat.en}>{t(cat)}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t({ en: 'Priority', mr: 'प्राधान्यता' })}
                        </label>
                        <select className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-grievance">
                          <option value="normal">{t({ en: 'Normal', mr: 'सामान्य' })}</option>
                          <option value="high">{t({ en: 'High', mr: 'उच्च' })}</option>
                          <option value="urgent">{t({ en: 'Urgent', mr: 'तातडीची' })}</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t({ en: 'Subject', mr: 'विषय' })} *
                      </label>
                      <input 
                        type="text" 
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-grievance"
                        placeholder={t({ en: 'Brief description of your issue', mr: 'तुमच्या समस्येचे थोडक्यात वर्णन' })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t({ en: 'Description', mr: 'तपशील' })} *
                      </label>
                      <textarea 
                        rows={4}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-grievance"
                        placeholder={t({ en: 'Provide detailed information about your grievance', mr: 'तुमच्या तक्रारीची तपशीलवार माहिती द्या' })}
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t({ en: 'Location', mr: 'स्थान' })}
                      </label>
                      <input 
                        type="text" 
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-grievance"
                        placeholder={t({ en: 'Specific location (optional)', mr: 'विशिष्ट स्थान (पर्यायी)' })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t({ en: 'Attach Photos', mr: 'फोटो जोडा' })}
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">
                          {t({ en: 'Click to upload photos or drag and drop', mr: 'फोटो अपलोड करण्यासाठी क्लिक करा किंवा ड्रॅग अँड ड्रॉप करा' })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button className="bg-grievance text-white flex-1">
                        {t({ en: 'Submit Grievance', mr: 'तक्रार सबमिट करा' })}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowNewGrievanceForm(false)}
                      >
                        {t({ en: 'Cancel', mr: 'रद्द करा' })}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Existing Grievances */}
            <Card>
              <CardHeader>
                <CardTitle className="text-grievance">
                  {t({ en: 'Your Grievances', mr: 'तुमच्या तक्रारी' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {grievances.map((grievance) => (
                    <div key={grievance.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {t(grievance.title)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {t({ en: `ID: ${grievance.id} • Category: `, mr: `आयडी: ${grievance.id} • श्रेणी: ` })}
                            {t(grievance.category)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(grievance.status)}>
                            {getStatusIcon(grievance.status)}
                            <span className="ml-1">
                              {t({ 
                                en: grievance.status === 'pending' ? 'Pending' : grievance.status === 'in-progress' ? 'In Progress' : 'Resolved',
                                mr: grievance.status === 'pending' ? 'प्रलंबित' : grievance.status === 'in-progress' ? 'प्रगतीपथावर' : 'निराकरण झाले'
                              })}
                            </span>
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">
                        {t(grievance.description)}
                      </p>
                      
                      {grievance.response && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                          <p className="text-sm font-medium text-blue-800 mb-1">
                            {t({ en: 'Official Response:', mr: 'अधिकृत प्रतिसाद:' })}
                          </p>
                          <p className="text-blue-700 text-sm">
                            {t(grievance.response)}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mt-3 pt-3 border-t">
                        <span className="text-sm text-gray-500">
                          {t({ en: `Submitted on ${grievance.date}`, mr: `${grievance.date} रोजी सबमिट केले` })}
                        </span>
                        <Button variant="outline" size="sm">
                          {t({ en: 'View Details', mr: 'तपशील पहा' })}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Grievance Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-grievance">
                  {t({ en: 'Statistics', mr: 'आकडेवारी' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>{t({ en: 'Total Grievances', mr: 'एकूण तक्रारी' })}</span>
                    <span className="font-bold">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t({ en: 'Resolved', mr: 'निराकरण झालेल्या' })}</span>
                    <span className="font-bold text-green-600">142</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t({ en: 'In Progress', mr: 'प्रगतीपथावर' })}</span>
                    <span className="font-bold text-blue-600">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t({ en: 'Pending', mr: 'प्रलंबित' })}</span>
                    <span className="font-bold text-yellow-600">6</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-grievance">
                  {t({ en: 'Contact Information', mr: 'संपर्क माहिती' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">{t({ en: 'Grievance Officer', mr: 'तक्रार अधिकारी' })}</p>
                    <p>श्री. राजेश कुमार</p>
                    <p>📞 +91 98765 43210</p>
                  </div>
                  <div>
                    <p className="font-medium">{t({ en: 'Office Hours', mr: 'कार्यालयीन वेळा' })}</p>
                    <p>{t({ en: 'Monday - Friday: 9 AM - 5 PM', mr: 'सोमवार - शुक्रवार: सकाळी ९ - संध्याकाळी ५' })}</p>
                    <p>{t({ en: 'Saturday: 9 AM - 1 PM', mr: 'शनिवार: सकाळी ९ - दुपारी १' })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}