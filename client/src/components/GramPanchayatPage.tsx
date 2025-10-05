import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageProvider';
import {
  getPublicCommitteeMembers,
  getPublicDepartments,
  getPublicOfficeInfo
} from '../services/committeeService';
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

  // State for dynamic data
  const [committeeMembers, setCommitteeMembers] = useState([]);

  const [officeHours, setOfficeHours] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [officeInfo, setOfficeInfo] = useState(null);

  // Fetch data from public APIs
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const [committeeMembersRes, departmentsRes, officeInfoRes] = await Promise.all([
          getPublicCommitteeMembers(),
          getPublicDepartments(),
          getPublicOfficeInfo()
        ]);

        setCommitteeMembers(committeeMembersRes.data || []);
        setDepartments(departmentsRes.data || []);
        setOfficeInfo(officeInfoRes.data || null);
        
        // Set office hours if available in office info
        if (officeInfoRes.data?.officeHours) {
          setOfficeHours(officeInfoRes.data.officeHours);
        }
      } catch (error) {
        console.error('Failed to fetch page data:', error);
      }
    };

    fetchPageData();
  }, []);

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
          
          {committeeMembers.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">{t({ en: 'Committee members will be displayed here', mr: 'समिती सदस्य येथे दर्शविले जातील' })}</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {/* Sarpanch - Featured */}
              {committeeMembers.length > 0 && (
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
                            {committeeMembers[0].achievements?.map((achievement, index) => (
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
              )}

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
                              {member.achievements?.map((achievement, index) => (
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
          )}
        </div>

        {/* Departments */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {t({ en: 'Departments', mr: 'विभाग' })}
          </h2>
          
          {departments.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">{t({ en: 'Departments will be displayed here', mr: 'विभाग येथे दर्शविले जातील' })}</p>
            </div>
          ) : (
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
                          {dept.services?.map((service, idx) => (
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
          )}
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
                {officeHours.length > 0 ? (
                  officeHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{t(schedule.day)}</span>
                      <span className={`text-sm ${schedule.available ? 'text-green-600' : 'text-red-600'}`}>
                        {schedule.hours}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>{t({ en: 'Office hours will be displayed here', mr: 'कार्यालयीन वेळा येथे दर्शविल्या जातील' })}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h4 className="font-bold text-purple-800 mb-2">
                  {t({ en: 'Public Meeting', mr: 'सार्वजनिक सभा' })}
                </h4>
                <p className="text-purple-700 text-sm">
                  {officeInfo?.publicMeetingInfo ? 
                    t(officeInfo.publicMeetingInfo) :
                    t({ 
                      en: 'Every first Monday of the month at 10:00 AM',
                      mr: 'दर महिन्याच्या पहिल्या सोमवारी सकाळी १०:०० वाजता'
                    })
                  }
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
                    {officeInfo?.address ? (
                      <p className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <span className="whitespace-pre-line">{officeInfo.address.en}</span>
                      </p>
                    ) : (
                      <p className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        Village Panchayat Building<br />
                        Main Road, Rampur<br />
                        Taluka: Pune, District: Pune<br />
                        Maharashtra - 412345
                      </p>
                    )}
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {officeInfo?.phone || '+91 20 1234 5678'}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {officeInfo?.email || 'office.rampur@gov.in'}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-2">
                    {t({ en: 'Emergency Contact', mr: 'आपत्कालीन संपर्क' })}
                  </h4>
                  <p className="text-blue-700 text-sm">
                    📞 {officeInfo?.emergencyContact || '+91 9876543210'}<br />
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