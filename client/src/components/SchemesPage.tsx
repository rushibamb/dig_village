import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageProvider';
import { 
  FileCheck, 
  Download, 
  ExternalLink, 
  Users, 
  IndianRupee,
  Calendar,
  FileText,
  Phone,
  Mail,
  MapPin,
  Filter,
  Search,
  Eye,
  ArrowRight,
  Building2,
  Heart,
  Briefcase,
  Home,
  GraduationCap,
  Stethoscope
} from 'lucide-react';

export function SchemesPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const schemeCategories = [
    { id: 'all', label: { en: 'All Schemes', mr: 'सर्व योजना' }, icon: FileCheck, count: 24 },
    { id: 'housing', label: { en: 'Housing', mr: 'गृहनिर्माण' }, icon: Home, count: 6 },
    { id: 'employment', label: { en: 'Employment', mr: 'रोजगार' }, icon: Briefcase, count: 8 },
    { id: 'education', label: { en: 'Education', mr: 'शिक्षण' }, icon: GraduationCap, count: 5 },
    { id: 'health', label: { en: 'Health', mr: 'आरोग्य' }, icon: Stethoscope, count: 3 },
    { id: 'welfare', label: { en: 'Social Welfare', mr: 'समाज कल्याण' }, icon: Heart, count: 2 }
  ];

  const schemes = [
    {
      id: 1,
      category: 'housing',
      title: { en: 'Pradhan Mantri Awas Yojana (Rural)', mr: 'प्रधानमंत्री आवास योजना (ग्रामीण)' },
      description: { 
        en: 'Financial assistance for construction of pucca houses for homeless and those living in kutcha houses',
        mr: 'बेघर आणि कच्च्या घरात राहणाऱ्यांसाठी पक्के घर बांधण्यासाठी आर्थिक मदत'
      },
      benefits: {
        en: ['₹1.20 lakh for plain areas', '₹1.30 lakh for hilly areas', 'Additional ₹12,000 for toilet construction'],
        mr: ['साधे भागासाठी ₹१.२० लाख', 'डोंगराळ भागासाठी ₹१.३० लाख', 'शौचालय बांधकामासाठी अतिरिक्त ₹१२,०००']
      },
      eligibility: {
        en: ['Houseless or living in kutcha house', 'Below Poverty Line', 'No pucca house in name'],
        mr: ['घर नसणारे किंवा कच्च्या घरात राहणारे', 'दारिद्र्यरेषेखालील', 'नावावर पक्के घर नसणे']
      },
      documents: {
        en: ['Aadhaar Card', 'BPL Card', 'Income Certificate', 'Land Documents'],
        mr: ['आधार कार्ड', 'बीपीएल कार्ड', 'उत्पन्न प्रमाणपत्र', 'जमीन कागदपत्रे']
      },
      applicationProcess: {
        en: 'Apply through Common Service Center or online portal',
        mr: 'कॉमन सर्व्हिस सेंटर किंवा ऑनलाइन पोर्टलद्वारे अर्ज करा'
      },
      status: 'active',
      deadline: '2024-03-31',
      contactPerson: { 
        en: 'Village Development Officer', 
        mr: 'ग्राम विकास अधिकारी' 
      },
      phone: '+91 20 2345 6789',
      appliedCount: 45,
      approvedCount: 32
    },
    {
      id: 2,
      category: 'employment',
      title: { en: 'MGNREGA (Mahatma Gandhi NREGA)', mr: 'मनरेगा (महात्मा गांधी नरेगा)' },
      description: { 
        en: 'Guaranteed 100 days of wage employment to rural households willing to do unskilled manual work',
        mr: 'अकुशल हस्तकला करण्यास तयार असलेल्या ग्रामीण कुटुंबांना १०० दिवसांच्या मजुरीची हमी'
      },
      benefits: {
        en: ['Guaranteed 100 days employment', '₹220 per day wage', 'Work within 5 km radius'],
        mr: ['१०० दिवसांच्या रोजगाराची हमी', 'दररोज ₹२२० मजुरी', '५ किमी परिघात काम']
      },
      eligibility: {
        en: ['Adult member of rural household', 'Willing to do unskilled manual work', 'Job card holder'],
        mr: ['ग्रामीण कुटुंबातील प्रौढ सदस्य', 'अकुशल मॅन्युअल काम करण्यास तयार', 'जॉब कार्ड धारक']
      },
      documents: {
        en: ['Aadhaar Card', 'Bank Account Details', 'Passport Size Photo'],
        mr: ['आधार कार्ड', 'बँक खाते तपशील', 'पासपोर्ट साइज फोटो']
      },
      applicationProcess: {
        en: 'Apply at Gram Panchayat office for Job Card',
        mr: 'जॉब कार्डसाठी ग्राम पंचायत कार्यालयात अर्ज करा'
      },
      status: 'active',
      deadline: 'Ongoing',
      contactPerson: { 
        en: 'MGNREGA Coordinator', 
        mr: 'मनरेगा समन्वयक' 
      },
      phone: '+91 20 2345 6780',
      appliedCount: 156,
      approvedCount: 134
    },
    {
      id: 3,
      category: 'education',
      title: { en: 'Sarva Shiksha Abhiyan', mr: 'सर्व शिक्षा अभियान' },
      description: { 
        en: 'Free and compulsory education for children aged 6-14 years with mid-day meals and books',
        mr: '६-१४ वर्षे वयोगटातील मुलांसाठी मध्यान्ह भोजन आणि पुस्तकांसह मोफत आणि अनिवार्य शिक्षण'
      },
      benefits: {
        en: ['Free education up to 8th standard', 'Free textbooks and uniforms', 'Mid-day meal scheme'],
        mr: ['८वी पर्यंत मोफत शिक्षण', 'मोफत पाठ्यपुस्तके आणि गणवेश', 'मध्यान्ह भोजन योजना']
      },
      eligibility: {
        en: ['Children aged 6-14 years', 'Residing in the village', 'Enrolled in government school'],
        mr: ['६-१४ वर्षे वयोगटातील मुले', 'गावात राहणारे', 'सरकारी शाळेत नावनोंदणी']
      },
      documents: {
        en: ['Birth Certificate', 'Aadhaar Card', 'Residence Proof'],
        mr: ['जन्म प्रमाणपत्र', 'आधार कार्ड', 'निवास पुरावा']
      },
      applicationProcess: {
        en: 'Direct admission at village school',
        mr: 'गावातील शाळेत थेट प्रवेश'
      },
      status: 'active',
      deadline: 'Ongoing',
      contactPerson: { 
        en: 'School Headmaster', 
        mr: 'शाळा मुख्याध्यापक' 
      },
      phone: '+91 20 2345 6781',
      appliedCount: 89,
      approvedCount: 89
    },
    {
      id: 4,
      category: 'health',
      title: { en: 'Ayushman Bharat Yojana', mr: 'आयुष्मान भारत योजना' },
      description: { 
        en: 'Health insurance coverage up to ₹5 lakh per family per year for secondary and tertiary care',
        mr: 'द्वितीयक आणि तृतीयक काळजीसाठी प्रति कुटुंब प्रति वर्ष ₹५ लाखापर्यंत आरोग्य विमा संरक्षण'
      },
      benefits: {
        en: ['₹5 lakh coverage per family', 'Cashless treatment', 'Pre and post hospitalization coverage'],
        mr: ['प्रति कुटुंब ₹५ लाख कव्हरेज', 'रोखपाल उपचार', 'आधी आणि नंतरच्या रुग्णालयात दाखल संरक्षण']
      },
      eligibility: {
        en: ['Families listed in SECC 2011', 'Below Poverty Line', 'Rural household'],
        mr: ['SECC 2011 मध्ये सूचीबद्ध कुटुंबे', 'दारिद्र्यरेषेखालील', 'ग्रामीण कुटुंब']
      },
      documents: {
        en: ['Aadhaar Card', 'Ration Card', 'Family ID'],
        mr: ['आधार कार्ड', 'रेशन कार्ड', 'कुटुंब ओळखपत्र']
      },
      applicationProcess: {
        en: 'Visit nearest empaneled hospital or CSC',
        mr: 'जवळच्या सूचीबद्ध रुग्णालयात किंवा CSC ला भेट द्या'
      },
      status: 'active',
      deadline: 'Ongoing',
      contactPerson: { 
        en: 'Health Worker', 
        mr: 'आरोग्य कार्यकर्ता' 
      },
      phone: '+91 20 2345 6782',
      appliedCount: 67,
      approvedCount: 54
    },
    {
      id: 5,
      category: 'welfare',
      title: { en: 'Pradhan Mantri Kisan Samman Nidhi', mr: 'प्रधानमंत्री किसान सम्मान निधी' },
      description: { 
        en: 'Income support of ₹6,000 per year to small and marginal farmers in three equal installments',
        mr: 'छोट्या आणि सीमांत शेतकऱ्यांना तीन समान हप्त्यांमध्ये वर्षाला ₹६,००० उत्पन्न सहाय्य'
      },
      benefits: {
        en: ['₹6,000 per year', 'Direct bank transfer', 'Three installments of ₹2,000 each'],
        mr: ['वर्षाला ₹६,०००', 'थेट बँक हस्तांतरण', 'प्रत्येकी ₹२,००० चे तीन हप्ते']
      },
      eligibility: {
        en: ['Small and marginal farmers', 'Cultivable land holding', 'Valid bank account'],
        mr: ['छोटे आणि सीमांत शेतकरी', 'लागवडीयोग्य जमीन धारणा', 'वैध बँक खाते']
      },
      documents: {
        en: ['Aadhaar Card', 'Bank Account Details', 'Land Records', 'Khasra Number'],
        mr: ['आधार कार्ड', 'बँक खाते तपशील', 'भूमी रेकॉर्ड', 'खसरा नंबर']
      },
      applicationProcess: {
        en: 'Register on PM-KISAN portal or visit local agriculture office',
        mr: 'PM-KISAN पोर्टलवर नोंदणी करा किंवा स्थानिक कृषी कार्यालयाला भेट द्या'
      },
      status: 'active',
      deadline: 'Ongoing',
      contactPerson: { 
        en: 'Agriculture Extension Officer', 
        mr: 'कृषी विस्तार अधिकारी' 
      },
      phone: '+91 20 2345 6783',
      appliedCount: 234,
      approvedCount: 201
    },
    {
      id: 6,
      category: 'employment',
      title: { en: 'Pradhan Mantri Mudra Yojana', mr: 'प्रधानमंत्री मुद्रा योजना' },
      description: { 
        en: 'Loans up to ₹10 lakh for micro-enterprises and small businesses without collateral',
        mr: 'सूक्ष्म उद्योग आणि छोट्या व्यवसायांसाठी गहाणखतविना ₹१० लाखापर्यंत कर्ज'
      },
      benefits: {
        en: ['Loans from ₹50,000 to ₹10 lakh', 'No collateral required', 'Flexible repayment terms'],
        mr: ['₹५०,००० ते ₹१० लाख कर्ज', 'गहाणखत आवश्यक नाही', 'लवचिक परतफेड अटी']
      },
      eligibility: {
        en: ['Age 18-65 years', 'Small business owner', 'Income generating activity'],
        mr: ['वय १८-६५ वर्षे', 'छोटा व्यवसाय मालक', 'उत्पन्न निर्मिती क्रियाकलाप']
      },
      documents: {
        en: ['Aadhaar Card', 'PAN Card', 'Business Plan', 'Bank Statements'],
        mr: ['आधार कार्ड', 'पॅन कार्ड', 'व्यवसाय योजना', 'बँक स्टेटमेंट्स']
      },
      applicationProcess: {
        en: 'Apply through participating banks or online portal',
        mr: 'सहभागी बँकांमार्फत किंवा ऑनलाइन पोर्टलद्वारे अर्ज करा'
      },
      status: 'active',
      deadline: 'Ongoing',
      contactPerson: { 
        en: 'Bank Branch Manager', 
        mr: 'बँक शाखा व्यवस्थापक' 
      },
      phone: '+91 20 2345 6784',
      appliedCount: 23,
      approvedCount: 18
    }
  ];

  const filteredSchemes = schemes.filter(scheme => {
    const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      scheme.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.title.mr.includes(searchQuery) ||
      scheme.description.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.mr.includes(searchQuery);
    
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'upcoming': return 'bg-blue-500';
      case 'expired': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileCheck className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t({ en: 'Government Schemes & Contracts', mr: 'सरकारी योजना आणि करार' })}
          </h1>
          <p className="text-gray-600 text-lg">
            {t({ en: 'Explore government schemes, subsidies and contracts available for villagers', mr: 'गावकऱ्यांसाठी उपलब्ध सरकारी योजना, अनुदान आणि करार एक्स्प्लोर करा' })}
          </p>
        </div>

        {/* Header Image */}
        <div className="mb-8">
          <div className="relative h-64 rounded-2xl overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1718261738948-47a35f97437e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBnb3Zlcm5tZW50JTIwZG9jdW1lbnQlMjBvZmZpY2lhbCUyMHNjaGVtZXxlbnwxfHx8fDE3NTU0NTU2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Government schemes"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-2">
                  {t({ en: 'Empowering Rural India', mr: 'ग्रामीण भारताला सशक्त करणे' })}
                </h2>
                <p className="text-lg opacity-90">
                  {t({ en: 'Building stronger communities through government support', mr: 'सरकारी सहाय्याद्वारे मजबूत समुदाय निर्माण' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t({ en: 'Search schemes...', mr: 'योजना शोधा...' })}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {schemeCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`gap-2 ${selectedCategory === category.id ? 'bg-green-600 text-white' : ''}`}
              >
                <category.icon className="h-4 w-4" />
                {t(category.label)} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid gap-6">
          {filteredSchemes.map((scheme) => (
            <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-green-600 text-white">
                            {t(schemeCategories.find(cat => cat.id === scheme.category)?.label || { en: '', mr: '' })}
                          </Badge>
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(scheme.status)}`}></div>
                          <span className="text-sm text-gray-600">
                            {scheme.status === 'active' ? t({ en: 'Active', mr: 'सक्रिय' }) : scheme.status}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t(scheme.title)}</h2>
                        <p className="text-gray-600 leading-relaxed">{t(scheme.description)}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {/* Benefits */}
                      <div>
                        <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2">
                          <IndianRupee className="h-4 w-4" />
                          {t({ en: 'Benefits', mr: 'फायदे' })}
                        </h4>
                        <ul className="space-y-1">
                          {scheme.benefits.en.map((benefit, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              {t({ en: benefit, mr: scheme.benefits.mr[index] })}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Eligibility */}
                      <div>
                        <h4 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {t({ en: 'Eligibility', mr: 'पात्रता' })}
                        </h4>
                        <ul className="space-y-1">
                          {scheme.eligibility.en.map((criteria, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              {t({ en: criteria, mr: scheme.eligibility.mr[index] })}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Required Documents */}
                      <div>
                        <h4 className="font-bold text-orange-700 mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {t({ en: 'Required Documents', mr: 'आवश्यक कागदपत्रे' })}
                        </h4>
                        <ul className="space-y-1">
                          {scheme.documents.en.map((doc, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                              {t({ en: doc, mr: scheme.documents.mr[index] })}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Application Process */}
                      <div>
                        <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                          <ArrowRight className="h-4 w-4" />
                          {t({ en: 'How to Apply', mr: 'अर्ज कसा करावा' })}
                        </h4>
                        <p className="text-sm text-gray-600">{t(scheme.applicationProcess)}</p>
                      </div>
                    </div>

                    {/* Contact and Stats */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {scheme.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {t(scheme.contactPerson)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-600">
                          {t({ en: 'Applied:', mr: 'अर्ज:' })} {scheme.appliedCount}
                        </span>
                        <span className="text-blue-600">
                          {t({ en: 'Approved:', mr: 'मंजूर:' })} {scheme.approvedCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t({ en: 'Apply Online', mr: 'ऑनलाइन अर्ज करा' })}
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      {t({ en: 'Download PDF', mr: 'PDF डाउनलोड करा' })}
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      {t({ en: 'View Details', mr: 'तपशील पहा' })}
                    </Button>

                    {scheme.deadline !== 'Ongoing' && (
                      <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <Calendar className="h-4 w-4 mx-auto text-yellow-600 mb-1" />
                        <p className="text-xs text-yellow-700">
                          {t({ en: 'Deadline:', mr: 'अंतिम तारीख:' })}
                        </p>
                        <p className="text-sm font-medium text-yellow-800">
                          {new Date(scheme.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <Card className="mt-12 bg-green-100 border-green-200">
          <CardContent className="p-8 text-center">
            <FileCheck className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">
              {t({ en: 'Need Help with Applications?', mr: 'अर्जासाठी मदत हवी?' })}
            </h3>
            <p className="text-green-700 mb-4">
              {t({ 
                en: 'Visit our Common Service Center or contact the village helpdesk for assistance with scheme applications.',
                mr: 'योजना अर्जांसाठी मदतीसाठी आमच्या कॉमन सर्व्हिस सेंटरला भेट द्या किंवा गाव हेल्पडेस्कशी संपर्क साधा.'
              })}
            </p>
            <div className="flex gap-3 justify-center">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Phone className="h-4 w-4 mr-2" />
                📞 +91 20 1234 5679
              </Button>
              <Button variant="outline" className="border-green-300 text-green-700">
                <MapPin className="h-4 w-4 mr-2" />
                {t({ en: 'Visit CSC', mr: 'CSC ला भेट द्या' })}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}