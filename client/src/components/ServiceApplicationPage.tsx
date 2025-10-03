import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageProvider';
import { useAuth } from './AuthContext';
import { 
  ClipboardList, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download,
  Upload,
  Calendar,
  User,
  Home,
  Plus,
  ArrowRight
} from 'lucide-react';

export function ServiceApplicationPage() {
  const { t } = useLanguage();
  const { isLoggedIn, user } = useAuth();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const services = [
    {
      id: 'birth-certificate',
      name: { en: 'Birth Certificate', mr: 'जन्म प्रमाणपत्र' },
      description: { en: 'Apply for birth certificate', mr: 'जन्म प्रमाणपत्रासाठी अर्ज करा' },
      fee: 50,
      processingTime: { en: '7-10 days', mr: '७-१० दिवस' },
      requiredDocs: [
        { en: 'Hospital Birth Record', mr: 'हॉस्पिटल जन्म नोंद' },
        { en: 'Parents Aadhaar Card', mr: 'पालकांचे आधार कार्ड' },
        { en: 'Address Proof', mr: 'पत्ता पुरावा' }
      ],
      icon: '👶',
      color: 'bg-blue-500'
    },
    {
      id: 'death-certificate',
      name: { en: 'Death Certificate', mr: 'मृत्यू प्रमाणपत्र' },
      description: { en: 'Apply for death certificate', mr: 'मृत्यू प्रमाणपत्रासाठी अर्ज करा' },
      fee: 50,
      processingTime: { en: '7-10 days', mr: '७-१० दिवस' },
      requiredDocs: [
        { en: 'Hospital Death Record', mr: 'हॉस्पिटल मृत्यू नोंद' },
        { en: 'Family Member ID', mr: 'कुटुंब सदस्याचा ओळखपत्र' },
        { en: 'Address Proof', mr: 'पत्ता पुरावा' }
      ],
      icon: '📄',
      color: 'bg-gray-500'
    },
    {
      id: 'income-certificate',
      name: { en: 'Income Certificate', mr: 'उत्पन्न प्रमाणपत्र' },
      description: { en: 'Apply for income certificate', mr: 'उत्पन्न प्रमाणपत्रासाठी अर्ज करा' },
      fee: 30,
      processingTime: { en: '5-7 days', mr: '५-७ दिवस' },
      requiredDocs: [
        { en: 'Salary Certificate', mr: 'पगार प्रमाणपत्र' },
        { en: 'Bank Statements', mr: 'बँक स्टेटमेंट' },
        { en: 'Aadhaar Card', mr: 'आधार कार्ड' }
      ],
      icon: '💰',
      color: 'bg-green-500'
    },
    {
      id: 'residence-certificate',
      name: { en: 'Residence Certificate', mr: 'निवास प्रमाणपत्र' },
      description: { en: 'Apply for residence certificate', mr: 'निवास प्रमाणपत्रासाठी अर्ज करा' },
      fee: 30,
      processingTime: { en: '5-7 days', mr: '५-७ दिवस' },
      requiredDocs: [
        { en: 'Aadhaar Card', mr: 'आधार कार्ड' },
        { en: 'Utility Bills', mr: 'युटिलिटी बिल्स' },
        { en: 'Ration Card', mr: 'रेशन कार्ड' }
      ],
      icon: '🏠',
      color: 'bg-orange-500'
    },
    {
      id: 'caste-certificate',
      name: { en: 'Caste Certificate', mr: 'जाती प्रमाणपत्र' },
      description: { en: 'Apply for caste certificate', mr: 'जाती प्रमाणपत्रासाठी अर्ज करा' },
      fee: 30,
      processingTime: { en: '10-15 days', mr: '१०-१५ दिवस' },
      requiredDocs: [
        { en: 'Aadhaar Card', mr: 'आधार कार्ड' },
        { en: 'School Leaving Certificate', mr: 'शाळा सोडल्याचे प्रमाणपत्र' },
        { en: 'Family Caste Certificate', mr: 'कुटुंबाचे जाती प्रमाणपत्र' }
      ],
      icon: '📋',
      color: 'bg-purple-500'
    },
    {
      id: 'marriage-registration',
      name: { en: 'Marriage Registration', mr: 'विवाह नोंदणी' },
      description: { en: 'Register your marriage', mr: 'आपले लग्न नोंदवा' },
      fee: 100,
      processingTime: { en: '15-30 days', mr: '१५-३० दिवस' },
      requiredDocs: [
        { en: 'Marriage Invitation', mr: 'लग्नाचे निमंत्रणपत्र' },
        { en: 'Age Proof of Both', mr: 'दोघांचा वय पुरावा' },
        { en: 'Witness Documents', mr: 'साक्षीदारांचे कागदपत्रे' }
      ],
      icon: '💍',
      color: 'bg-pink-500'
    }
  ];

  const myApplications = [
    {
      id: 'APP001',
      serviceId: 'birth-certificate',
      serviceName: { en: 'Birth Certificate', mr: 'जन्म प्रमाणपत्र' },
      applicationDate: '2024-01-15',
      status: 'in-progress',
      estimatedCompletion: '2024-01-25',
      trackingNumber: 'BC2024001'
    },
    {
      id: 'APP002',
      serviceId: 'income-certificate',
      serviceName: { en: 'Income Certificate', mr: 'उत्पन्न प्रमाणपत्र' },
      applicationDate: '2024-01-10',
      status: 'completed',
      completedDate: '2024-01-17',
      trackingNumber: 'IC2024002'
    },
    {
      id: 'APP003',
      serviceId: 'residence-certificate',
      serviceName: { en: 'Residence Certificate', mr: 'निवास प्रमाणपत्र' },
      applicationDate: '2024-01-08',
      status: 'pending',
      trackingNumber: 'RC2024003'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-service rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t({ en: 'Service Applications', mr: 'सेवा अर्ज' })}
          </h1>
          <p className="text-gray-600 text-lg">
            {t({ en: 'Apply for various government services online', mr: 'विविध सरकारी सेवांसाठी ऑनलाइन अर्ज करा' })}
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-8">
          <div className="relative h-64 rounded-2xl overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1604218118561-4bc4427d1e7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwb2ZmaWNlJTIwZG9jdW1lbnRzJTIwYXBwbGljYXRpb25zfGVufDF8fHx8MTc1NTQ1NDQxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Government services"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-2">
                  {t({ en: 'Digital Government Services', mr: 'डिजिटल सरकारी सेवा' })}
                </h2>
                <p className="text-lg opacity-90">
                  {t({ en: 'Fast, secure, and convenient online applications', mr: 'वेगवान, सुरक्षित आणि सोयीस्कर ऑनलाइन अर्ज' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Services List */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-service" />
                  {t({ en: 'Available Services', mr: 'उपलब्ध सेवा' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <Card 
                      key={service.id} 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedService === service.id ? 'ring-2 ring-service border-service' : ''
                      }`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                            {service.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold mb-1">{t(service.name)}</h3>
                            <p className="text-sm text-gray-600 mb-2">{t(service.description)}</p>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-green-600 font-medium">₹{service.fee}</span>
                              <span className="text-gray-500">{t(service.processingTime)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {selectedService === service.id && (
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="font-medium mb-2">
                              {t({ en: 'Required Documents:', mr: 'आवश्यक कागदपत्रे:' })}
                            </h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {service.requiredDocs.map((doc, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-service rounded-full"></div>
                                  {t(doc)}
                                </li>
                              ))}
                            </ul>
                            <Button 
                              className="w-full mt-4 bg-service hover:bg-service/90 text-service-foreground"
                              onClick={() => {
                                if (isLoggedIn) {
                                  setShowApplicationForm(true);
                                } else {
                                  alert(t({ en: 'Please login to apply', mr: 'अर्ज करण्यासाठी कृपया लॉगिन करा' }));
                                }
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              {t({ en: 'Apply Now', mr: 'आता अर्ज करा' })}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Application Form */}
            {showApplicationForm && selectedService && (
              <Card className="border-service border-2">
                <CardHeader>
                  <CardTitle className="text-service">
                    {t({ en: 'Application Form', mr: 'अर्जाचा फॉर्म' })} - {t(services.find(s => s.id === selectedService)?.name || { en: '', mr: '' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t({ en: 'Full Name', mr: 'पूर्ण नाव' })} *
                        </label>
                        <input 
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-service"
                          placeholder={t({ en: 'Enter full name', mr: 'पूर्ण नाव टाका' })}
                          defaultValue={user?.name || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t({ en: 'Mobile Number', mr: 'मोबाइल नंबर' })} *
                        </label>
                        <input 
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-service"
                          placeholder={t({ en: 'Enter mobile number', mr: 'मोबाइल नंबर टाका' })}
                          defaultValue={user?.phone || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t({ en: 'House Number', mr: 'घर क्रमांक' })} *
                        </label>
                        <input 
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-service"
                          placeholder={t({ en: 'Enter house number', mr: 'घर क्रमांक टाका' })}
                          defaultValue={user?.houseNumber || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t({ en: 'Ward Number', mr: 'वार्ड क्रमांक' })} *
                        </label>
                        <input 
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-service"
                          placeholder={t({ en: 'Enter ward number', mr: 'वार्ड क्रमांक टाका' })}
                          defaultValue={user?.wardNumber || ''}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t({ en: 'Additional Details', mr: 'अतिरिक्त तपशील' })}
                      </label>
                      <textarea 
                        rows={3}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-service resize-none"
                        placeholder={t({ en: 'Enter any additional information', mr: 'कोणतीही अतिरिक्त माहिती टाका' })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t({ en: 'Upload Documents', mr: 'कागदपत्रे अपलोड करा' })} *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">
                          {t({ en: 'Click to upload documents or drag and drop', mr: 'कागदपत्रे अपलोड करण्यासाठी क्लिक करा किंवा ड्रॅग अँड ड्रॉप करा' })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {t({ en: 'PDF, JPG, PNG files up to 5MB each', mr: 'प्रत्येकी 5MB पर्यंतच्या PDF, JPG, PNG फाइल्स' })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button className="bg-service hover:bg-service/90 text-service-foreground">
                        {t({ en: 'Submit Application', mr: 'अर्ज सबमिट करा' })}
                      </Button>
                      <Button variant="outline" onClick={() => setShowApplicationForm(false)}>
                        {t({ en: 'Cancel', mr: 'रद्द करा' })}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* My Applications */}
            {isLoggedIn ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <User className="h-5 w-5" />
                    {t({ en: 'My Applications', mr: 'माझे अर्ज' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {myApplications.map((app) => (
                      <div key={app.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{t(app.serviceName)}</h4>
                          <Badge className={`${getStatusColor(app.status)} text-white`}>
                            {getStatusIcon(app.status)}
                            <span className="ml-1 capitalize">{app.status}</span>
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          {t({ en: `Applied: ${app.applicationDate}`, mr: `अर्ज: ${app.applicationDate}` })}
                        </p>
                        <p className="text-xs text-gray-600">
                          {t({ en: `Tracking: ${app.trackingNumber}`, mr: `ट्रॅकिंग: ${app.trackingNumber}` })}
                        </p>
                        {app.status === 'completed' && (
                          <Button size="sm" variant="outline" className="w-full mt-2">
                            <Download className="h-3 w-3 mr-1" />
                            {t({ en: 'Download', mr: 'डाउनलोड' })}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold mb-2 text-orange-800">
                    {t({ en: 'Login Required', mr: 'लॉगिन आवश्यक' })}
                  </h4>
                  <p className="text-orange-700 text-sm mb-4">
                    {t({ 
                      en: 'Login to apply for services and track your applications',
                      mr: 'सेवांसाठी अर्ज करण्यासाठी आणि आपल्या अर्जांचा मागोवा घेण्यासाठी लॉगिन करा'
                    })}
                  </p>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    {t({ en: 'Login Now', mr: 'आता लॉगिन करा' })}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Guide */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {t({ en: 'Quick Guide', mr: 'द्रुत मार्गदर्शक' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-service rounded-full flex items-center justify-center text-white text-xs">1</div>
                    <p>{t({ en: 'Select the service you need', mr: 'आपल्याला आवश्यक असलेली सेवा निवडा' })}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-service rounded-full flex items-center justify-center text-white text-xs">2</div>
                    <p>{t({ en: 'Fill the application form', mr: 'अर्जाचा फॉर्म भरा' })}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-service rounded-full flex items-center justify-center text-white text-xs">3</div>
                    <p>{t({ en: 'Upload required documents', mr: 'आवश्यक कागदपत्रे अपलोड करा' })}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-service rounded-full flex items-center justify-center text-white text-xs">4</div>
                    <p>{t({ en: 'Track your application status', mr: 'आपल्या अर्जाच्या स्थितीचा मागोवा घ्या' })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4 text-center">
                <h4 className="font-bold mb-2 text-orange-800">
                  {t({ en: 'Need Assistance?', mr: 'मदत हवी?' })}
                </h4>
                <p className="text-orange-700 text-sm mb-3">
                  {t({ 
                    en: 'Contact our service desk for help',
                    mr: 'मदतीसाठी आमच्या सेवा डेस्कशी संपर्क साधा'
                  })}
                </p>
                <Button variant="outline" size="sm" className="border-orange-300 text-orange-700">
                  📞 +91 20 1234 5681
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}