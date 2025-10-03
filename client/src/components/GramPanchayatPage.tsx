import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageProvider';
import { 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock,
  Award,
  BookOpen,
  Building2,
  User
} from 'lucide-react';

export function GramPanchayatPage() {
  const { t } = useLanguage();

  const committeeMembers = [
    {
      id: 1,
      name: { en: 'Smt. Sunita Devi', mr: 'श्रीमती सुनीता देवी' },
      position: { en: 'Sarpanch (Village Head)', mr: 'सरपंच (गाव प्रमुख)' },
      ward: 'All Wards',
      phone: '+91 9876543210',
      email: 'sarpanch.rampur@gov.in',
      experience: { en: '8 years in local governance', mr: '८ वर्षांचा स्थानिक प्रशासनाचा अनुभव' },
      education: { en: 'B.A., Diploma in Rural Development', mr: 'बी.ए., ग्रामीण विकास डिप्लोमा' },
      achievements: [
        { en: 'Village Development Award 2022', mr: 'गाव विकास पुरस्कार २०२२' },
        { en: 'Digital Village Initiative', mr: 'डिजिटल व्हिलेज इनिशिएटिव्ह' }
      ],
      photo: 'https://images.unsplash.com/photo-1667564790635-0f560121359e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBnb3Zlcm5tZW50JTIwb2ZmaWNpYWxzJTIwbWVldGluZ3xlbnwxfHx8fDE3NTU0NTQ0OTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      color: 'bg-purple-500'
    },
    {
      id: 2,
      name: { en: 'Shri Ram Kumar Sharma', mr: 'श्री राम कुमार शर्मा' },
      position: { en: 'Deputy Sarpanch', mr: 'उप सरपंच' },
      ward: 'Ward 1 & 2',
      phone: '+91 9876543211',
      email: 'deputy.rampur@gov.in',
      experience: { en: '5 years in village administration', mr: '५ वर्षांचा गाव प्रशासनाचा अनुभव' },
      education: { en: 'B.Com, Rural Management Certificate', mr: 'बी.कॉम, ग्रामीण व्यवस्थापन प्रमाणपत्र' },
      achievements: [
        { en: 'Water Conservation Project', mr: 'जल संधारण प्रकल्प' },
        { en: 'Best Ward Development 2023', mr: 'सर्वोत्तम वार्ड विकास २०२३' }
      ],
      color: 'bg-blue-500'
    },
    {
      id: 3,
      name: { en: 'Smt. Kamala Patil', mr: 'श्रीमती कमला पाटील' },
      position: { en: 'Ward Member', mr: 'वार्ड सदस्य' },
      ward: 'Ward 3',
      phone: '+91 9876543212',
      email: 'ward3.rampur@gov.in',
      experience: { en: '3 years as ward representative', mr: '३ वर्षांचा वार्ड प्रतिनिधी अनुभव' },
      education: { en: 'M.A. Social Work', mr: 'एम.ए. सामाजिक कार्य' },
      achievements: [
        { en: 'Women Empowerment Programs', mr: 'महिला सशक्तीकरण कार्यक्रम' },
        { en: 'Health Awareness Campaigns', mr: 'आरोग्य जागरूकता मोहीम' }
      ],
      color: 'bg-pink-500'
    },
    {
      id: 4,
      name: { en: 'Shri Mohan Singh', mr: 'श्री मोहन सिंह' },
      position: { en: 'Ward Member', mr: 'वार्ड सदस्य' },
      ward: 'Ward 4',
      phone: '+91 9876543213',
      email: 'ward4.rampur@gov.in',
      experience: { en: '4 years in local development', mr: '४ वर्षांचा स्थानिक विकासाचा अनुभव' },
      education: { en: 'B.Sc. Agriculture', mr: 'बी.एससी कृषी' },
      achievements: [
        { en: 'Organic Farming Initiative', mr: 'सेंद्रिय शेती उपक्रम' },
        { en: 'Youth Development Programs', mr: 'युवा विकास कार्यक्रम' }
      ],
      color: 'bg-green-500'
    },
    {
      id: 5,
      name: { en: 'Shri Prakash Jadhav', mr: 'श्री प्रकाश जाधव' },
      position: { en: 'Secretary', mr: 'सचिव' },
      ward: 'Administrative',
      phone: '+91 9876543214',
      email: 'secretary.rampur@gov.in',
      experience: { en: '10 years in rural administration', mr: '१० वर्षांचा ग्रामीण प्रशासनाचा अनुभव' },
      education: { en: 'M.A. Public Administration', mr: 'एम.ए. लोक प्रशासन' },
      achievements: [
        { en: 'Digital Governance Implementation', mr: 'डिजिटल गव्हर्नन्स अंमलबजावणी' },
        { en: 'Transparency in Administration', mr: 'प्रशासनात पारदर्शकता' }
      ],
      color: 'bg-orange-500'
    }
  ];

  const officeHours = [
    { day: { en: 'Monday', mr: 'सोमवार' }, hours: '9:00 AM - 5:00 PM', available: true },
    { day: { en: 'Tuesday', mr: 'मंगळवार' }, hours: '9:00 AM - 5:00 PM', available: true },
    { day: { en: 'Wednesday', mr: 'बुधवार' }, hours: '9:00 AM - 5:00 PM', available: true },
    { day: { en: 'Thursday', mr: 'गुरुवार' }, hours: '9:00 AM - 5:00 PM', available: true },
    { day: { en: 'Friday', mr: 'शुक्रवार' }, hours: '9:00 AM - 5:00 PM', available: true },
    { day: { en: 'Saturday', mr: 'शनिवार' }, hours: '9:00 AM - 1:00 PM', available: true },
    { day: { en: 'Sunday', mr: 'रविवार' }, hours: 'Closed', available: false }
  ];

  const departments = [
    {
      name: { en: 'Revenue Department', mr: 'महसूल विभाग' },
      head: { en: 'Shri Anil Khade', mr: 'श्री अनिल खडे' },
      phone: '+91 9876543215',
      services: [
        { en: 'Land Records', mr: 'जमीन नोंदी' },
        { en: 'Property Tax', mr: 'मालमत्ता कर' },
        { en: 'Revenue Certificates', mr: 'महसूल प्रमाणपत्रे' }
      ]
    },
    {
      name: { en: 'Development Department', mr: 'विकास विभाग' },
      head: { en: 'Smt. Priya Kulkarni', mr: 'श्रीमती प्रिया कुलकर्णी' },
      phone: '+91 9876543216',
      services: [
        { en: 'Infrastructure Projects', mr: 'पायाभूत सुविधा प्रकल्प' },
        { en: 'Road Maintenance', mr: 'रस्ता देखभाल' },
        { en: 'Public Facilities', mr: 'सार्वजनिक सुविधा' }
      ]
    },
    {
      name: { en: 'Health & Sanitation', mr: 'आरोग्य आणि स्वच्छता' },
      head: { en: 'Dr. Suresh Patil', mr: 'डॉ. सुरेश पाटील' },
      phone: '+91 9876543217',
      services: [
        { en: 'Public Health Programs', mr: 'सार्वजनिक आरोग्य कार्यक्रम' },
        { en: 'Waste Management', mr: 'कचरा व्यवस्थापन' },
        { en: 'Water Quality', mr: 'पाण्याची गुणवत्ता' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-purple-50 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t({ en: 'Gram Panchayat Committee', mr: 'ग्राम पंचायत समिती' })}
          </h1>
          <p className="text-gray-600 text-lg">
            {t({ en: 'Meet your elected representatives', mr: 'आपल्या निवडून आलेल्या प्रतिनिधींना भेटा' })}
          </p>
        </div>

        {/* Committee Members */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {t({ en: 'Committee Members', mr: 'समिती सदस्य' })}
          </h2>
          
          <div className="grid gap-6">
            {/* Sarpanch - Featured */}
            <Card className="border-purple-200 shadow-lg">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
                  <div className="relative">
                    <div className="w-32 h-32 bg-purple-500 rounded-full flex items-center justify-center text-white text-4xl">
                      👩‍💼
                    </div>
                    <Badge className="absolute -top-2 -right-2 bg-purple-600">
                      {t({ en: 'Sarpanch', mr: 'सरपंच' })}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-2xl font-bold mb-2">{t(committeeMembers[0].name)}</h3>
                    <p className="text-purple-600 font-medium text-lg mb-4">{t(committeeMembers[0].position)}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3 justify-center lg:justify-start">
                        <Phone className="h-5 w-5 text-gray-500" />
                        <span>{committeeMembers[0].phone}</span>
                      </div>
                      <div className="flex items-center gap-3 justify-center lg:justify-start">
                        <Mail className="h-5 w-5 text-gray-500" />
                        <span className="text-sm">{committeeMembers[0].email}</span>
                      </div>
                      <div className="flex items-center gap-3 justify-center lg:justify-start">
                        <BookOpen className="h-5 w-5 text-gray-500" />
                        <span className="text-sm">{t(committeeMembers[0].education)}</span>
                      </div>
                      <div className="flex items-center gap-3 justify-center lg:justify-start">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <span className="text-sm">{t(committeeMembers[0].experience)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">{t({ en: 'Key Achievements:', mr: 'मुख्य उपलब्धी:' })}</h4>
                      <div className="flex flex-wrap gap-2">
                        {committeeMembers[0].achievements.map((achievement, index) => (
                          <Badge key={index} variant="secondary">
                            <Award className="h-3 w-3 mr-1" />
                            {t(achievement)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Other Members */}
            <div className="grid md:grid-cols-2 gap-6">
              {committeeMembers.slice(1).map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 ${member.color} rounded-full flex items-center justify-center text-white text-2xl`}>
                        👤
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{t(member.name)}</h3>
                        <p className="text-purple-600 font-medium mb-2">{t(member.position)}</p>
                        
                        {member.ward !== 'Administrative' && (
                          <p className="text-sm text-gray-600 mb-3">
                            <MapPin className="h-4 w-4 inline mr-1" />
                            {member.ward}
                          </p>
                        )}
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span>{member.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-xs">{member.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-gray-500" />
                            <span className="text-xs">{t(member.education)}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <h5 className="font-medium text-sm mb-1">
                            {t({ en: 'Focus Areas:', mr: 'मुख्य क्षेत्रे:' })}
                          </h5>
                          <div className="space-y-1">
                            {member.achievements.map((achievement, index) => (
                              <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                                {t(achievement)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Departments */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {t({ en: 'Departments', mr: 'विभाग' })}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-purple-600" />
                    {t(dept.name)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-sm">{t({ en: 'Department Head:', mr: 'विभाग प्रमुख:' })}</p>
                      <p className="text-gray-700">{t(dept.head)}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {dept.phone}
                      </p>
                    </div>
                    
                    <div>
                      <p className="font-medium text-sm mb-2">{t({ en: 'Services:', mr: 'सेवा:' })}</p>
                      <ul className="space-y-1">
                        {dept.services.map((service, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                            {t(service)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Office Hours & Contact */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Office Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-purple-600" />
                {t({ en: 'Office Hours', mr: 'कार्यालयीन वेळा' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {officeHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{t(schedule.day)}</span>
                    <span className={`text-sm ${schedule.available ? 'text-green-600' : 'text-red-600'}`}>
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h4 className="font-bold text-purple-800 mb-2">
                  {t({ en: 'Public Meeting', mr: 'सार्वजनिक सभा' })}
                </h4>
                <p className="text-purple-700 text-sm">
                  {t({ 
                    en: 'Every first Monday of the month at 10:00 AM',
                    mr: 'दर महिन्याच्या पहिल्या सोमवारी सकाळी १०:०० वाजता'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-purple-600" />
                {t({ en: 'Contact Information', mr: 'संपर्क माहिती' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold mb-2">{t({ en: 'Gram Panchayat Office', mr: 'ग्राम पंचायत कार्यालय' })}</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      Village Panchayat Building<br />
                      Main Road, Rampur<br />
                      Taluka: Pune, District: Pune<br />
                      Maharashtra - 412345
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      +91 20 1234 5678
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      office.rampur@gov.in
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-2">
                    {t({ en: 'Emergency Contact', mr: 'आपत्कालीन संपर्क' })}
                  </h4>
                  <p className="text-blue-700 text-sm">
                    📞 +91 9876543210<br />
                    {t({ en: '24/7 Emergency Helpline', mr: '२४/७ आपत्कालीन हेल्पलाइन' })}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    {t({ en: 'Call Office', mr: 'कार्यालयाला कॉल करा' })}
                  </Button>
                  <Button variant="outline" className="border-purple-600 text-purple-600 flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    {t({ en: 'Send Email', mr: 'ईमेल पाठवा' })}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}