import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageProvider';
import { 
  FileBarChart,
  Search,
  Filter,
  Calendar,
  IndianRupee,
  Phone,
  User,
  Building2,
  Eye,
  Download,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  FileText,
  Camera,
  TrendingUp,
  Users,
  Target,
  Award
} from 'lucide-react';

export function ContractsPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedContract, setSelectedContract] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Open Tenders Data
  const openTenders = [
    {
      id: 1,
      title: { 
        en: 'Village Water Supply Pipeline Extension Project', 
        mr: 'गाव पाणी पुरवठा पाइपलाइन विस्तार प्रकल्प' 
      },
      department: { en: 'Water Department', mr: 'पाणी विभाग' },
      estimatedBudget: 2500000,
      issueDate: '2024-01-15',
      lastDate: '2024-02-15',
      contact: {
        name: { en: 'Mr. Rajesh Patil', mr: 'श्री. राजेश पाटील' },
        phone: '+91 9876543210'
      },
      description: {
        en: 'Extension of water supply pipeline to cover 150 additional households in Ward 4 and Ward 5',
        mr: 'वार्ड ४ आणि वार्ड ५ मधील अतिरिक्त १५० कुटुंबांना पाणी पुरवठा पाइपलाइन विस्तार'
      },
      requirements: {
        en: 'Minimum 5 years experience in pipeline projects, ISO certification required',
        mr: 'पाइपलाइन प्रकल्पांमध्ये किमान ५ वर्षांचा अनुभव, ISO प्रमाणपत्र आवश्यक'
      },
      documents: ['tender_notice.pdf', 'technical_specs.pdf', 'terms_conditions.pdf']
    },
    {
      id: 2,
      title: { 
        en: 'Village Road Construction and Repair Work', 
        mr: 'गाव रस्ता बांधकाम आणि दुरुस्ती कार्य' 
      },
      department: { en: 'Public Works Department', mr: 'सार्वजनिक बांधकाम विभाग' },
      estimatedBudget: 1800000,
      issueDate: '2024-01-20',
      lastDate: '2024-02-20',
      contact: {
        name: { en: 'Mrs. Sunita Sharma', mr: 'श्रीमती. सुनिता शर्मा' },
        phone: '+91 9876543211'
      },
      description: {
        en: 'Construction of 2.5 km concrete road from village center to school with proper drainage',
        mr: 'गाव केंद्रापासून शाळेपर्यंत २.५ किमी काँक्रीट रस्ता बांधकाम योग्य निचरा व्यवस्थेसह'
      },
      requirements: {
        en: 'Experience in road construction, Grade A contractor license required',
        mr: 'रस्ता बांधकामाचा अनुभव, ग्रेड ए कंत्राटदार परवाना आवश्यक'
      },
      documents: ['tender_notice.pdf', 'site_survey.pdf', 'material_specs.pdf']
    },
    {
      id: 3,
      title: { 
        en: 'Solar Street Light Installation Project', 
        mr: 'सोलर स्ट्रीट लाइट स्थापना प्रकल्प' 
      },
      department: { en: 'Electricity Department', mr: 'विजेचा विभाग' },
      estimatedBudget: 1200000,
      issueDate: '2024-01-25',
      lastDate: '2024-02-25',
      contact: {
        name: { en: 'Mr. Anil Kumar', mr: 'श्री. अनिल कुमार' },
        phone: '+91 9876543212'
      },
      description: {
        en: 'Installation of 50 solar street lights across main village roads with 3-year maintenance',
        mr: 'मुख्य गाव रस्त्यांवर ५० सोलर स्ट्रीट लाइट स्थापना ३ वर्षांच्या देखभालीसह'
      },
      requirements: {
        en: 'Solar equipment installation experience, electrical contractor license',
        mr: 'सोलर उपकरण स्थापनेचा अनुभव, इलेक्ट्रिकल कंत्राटदार परवाना'
      },
      documents: ['tender_notice.pdf', 'technical_specs.pdf', 'location_map.pdf']
    }
  ];

  // Ongoing Contracts Data
  const ongoingContracts = [
    {
      id: 1,
      title: { 
        en: 'Community Center Construction', 
        mr: 'सामुदायिक केंद्र बांधकाम' 
      },
      contractor: { en: 'ABC Construction Ltd.', mr: 'एबीसी कन्स्ट्रक्शन लिमिटेड' },
      allocatedBudget: 3500000,
      startDate: '2023-11-01',
      expectedCompletion: '2024-05-01',
      progress: 75,
      sitePhoto: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlfGVufDB8fHx8MTczNzAzODQwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      status: 'ongoing',
      currentPhase: {
        en: 'Interior finishing work in progress',
        mr: 'आंतरिक फिनिशिंग कार्य सुरू आहे'
      },
      timeline: [
        { phase: { en: 'Foundation', mr: 'पाया' }, completed: true, date: '2023-12-15' },
        { phase: { en: 'Structure', mr: 'संरचना' }, completed: true, date: '2024-01-30' },
        { phase: { en: 'Roofing', mr: 'छत' }, completed: true, date: '2024-02-28' },
        { phase: { en: 'Interior', mr: 'आंतरिक' }, completed: false, date: '2024-04-15' },
        { phase: { en: 'Finishing', mr: 'फिनिशिंग' }, completed: false, date: '2024-05-01' }
      ]
    },
    {
      id: 2,
      title: { 
        en: 'Drainage System Development', 
        mr: 'पाणी निचरा प्रणाली विकास' 
      },
      contractor: { en: 'XYZ Infrastructure Pvt.', mr: 'एक्सवायझेड इन्फ्रास्ट्रक्चर प्रायव्हेट' },
      allocatedBudget: 2200000,
      startDate: '2024-01-15',
      expectedCompletion: '2024-06-15',
      progress: 45,
      sitePhoto: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFpbmFnZSUyMGNvbnN0cnVjdGlvbnxlbnwwfHx8fDE3MzcwMzg0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      status: 'ongoing',
      currentPhase: {
        en: 'Pipeline laying in Ward 2',
        mr: 'वार्ड २ मध्ये पाइपलाइन टाकणे'
      },
      timeline: [
        { phase: { en: 'Survey & Planning', mr: 'सर्वेक्षण आणि नियोजन' }, completed: true, date: '2024-02-01' },
        { phase: { en: 'Excavation', mr: 'खोदकाम' }, completed: true, date: '2024-03-01' },
        { phase: { en: 'Pipeline Installation', mr: 'पाइपलाइन स्थापना' }, completed: false, date: '2024-05-01' },
        { phase: { en: 'Testing & Commissioning', mr: 'चाचणी आणि सुरुवात' }, completed: false, date: '2024-06-15' }
      ]
    },
    {
      id: 3,
      title: { 
        en: 'School Building Renovation', 
        mr: 'शाळा इमारत नूतनीकरण' 
      },
      contractor: { en: 'Village Builders Co.', mr: 'व्हिलेज बिल्डर्स कंपनी' },
      allocatedBudget: 1800000,
      startDate: '2023-12-01',
      expectedCompletion: '2024-04-01',
      progress: 85,
      sitePhoto: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBidWlsZGluZyUyMHJlbm92YXRpb258ZW58MHx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      status: 'ongoing',
      currentPhase: {
        en: 'Final painting and electrical work',
        mr: 'अंतिम रंगकाम आणि विद्युत कार्य'
      },
      timeline: [
        { phase: { en: 'Demolition', mr: 'पाडणे' }, completed: true, date: '2023-12-15' },
        { phase: { en: 'Structural Repair', mr: 'संरचनात्मक दुरुस्ती' }, completed: true, date: '2024-01-15' },
        { phase: { en: 'Flooring & Walls', mr: 'फरशी आणि भिंती' }, completed: true, date: '2024-02-28' },
        { phase: { en: 'Electrical & Plumbing', mr: 'विद्युत आणि प्लंबिंग' }, completed: false, date: '2024-03-15' },
        { phase: { en: 'Final Touches', mr: 'अंतिम स्पर्श' }, completed: false, date: '2024-04-01' }
      ]
    }
  ];

  // Completed Contracts Data
  const completedContracts = [
    {
      id: 1,
      title: { 
        en: 'Village Main Road Concretization', 
        mr: 'गाव मुख्य रस्ता काँक्रीटीकरण' 
      },
      contractor: { en: 'Perfect Roads Ltd.', mr: 'परफेक्ट रोड्स लिमिटेड' },
      totalCost: 4200000,
      completionDate: '2023-10-15',
      finalPhoto: 'https://images.unsplash.com/photo-1548618447-14dc67c0d8f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jcmV0ZSUyMHJvYWR8ZW58MHx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rating: 4.8,
      summary: {
        en: '3.2 km main road successfully completed with high-quality concrete and proper drainage',
        mr: '३.२ किमी मुख्य रस्ता उच्च दर्जाच्या काँक्रीट आणि योग्य निचरा व्यवस्थेसह यशस्वीपणे पूर्ण'
      },
      deliverables: [
        { item: { en: 'Road Length', mr: 'रस्त्याची लांबी' }, value: '3.2 km' },
        { item: { en: 'Drainage Lines', mr: 'निचरा रेषा' }, value: '2.8 km' },
        { item: { en: 'Street Lights', mr: 'रस्ते दिवे' }, value: '32 units' }
      ]
    },
    {
      id: 2,
      title: { 
        en: 'Primary Health Center Building', 
        mr: 'प्राथमिक आरोग्य केंद्र इमारत' 
      },
      contractor: { en: 'HealthCare Construction', mr: 'हेल्थकेयर कन्स्ट्रक्शन' },
      totalCost: 5800000,
      completionDate: '2023-09-30',
      finalPhoto: 'https://images.unsplash.com/photo-1551076805-e1869033e561?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGglMjBjZW50ZXIlMjBidWlsZGluZ3xlbnwwfHx8fDE3MzcwMzg0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rating: 4.9,
      summary: {
        en: 'Modern primary health center with 15 beds, emergency room, and medical equipment',
        mr: 'आधुनिक प्राथमिक आरोग्य केंद्र १५ बेड, आपत्कालीन कक्ष आणि वैद्यकीय उपकरणांसह'
      },
      deliverables: [
        { item: { en: 'Total Area', mr: 'एकूण क्षेत्रफळ' }, value: '2,500 sq ft' },
        { item: { en: 'Patient Beds', mr: 'रुग्ण बेड' }, value: '15 units' },
        { item: { en: 'Medical Equipment', mr: 'वैद्यकीय उपकरणे' }, value: 'Complete Set' }
      ]
    },
    {
      id: 3,
      title: { 
        en: 'Water Storage Tank Construction', 
        mr: 'पाणी साठवण टाकी बांधकाम' 
      },
      contractor: { en: 'AquaTech Builders', mr: 'एक्वाटेक बिल्डर्स' },
      totalCost: 1500000,
      completionDate: '2023-08-20',
      finalPhoto: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMHRhbmt8ZW58MHx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rating: 4.7,
      summary: {
        en: 'Underground water storage tank with 500,000 liters capacity and automated supply system',
        mr: 'भूगर्भीय पाणी साठवण टाकी ५,००,००० लिटर क्षमता आणि स्वयंचलित पुरवठा प्रणालीसह'
      },
      deliverables: [
        { item: { en: 'Storage Capacity', mr: 'साठवण क्षमता' }, value: '5,00,000 liters' },
        { item: { en: 'Pipeline Network', mr: 'पाइपलाइन नेटवर्क' }, value: '1.5 km' },
        { item: { en: 'Auto Supply System', mr: 'स्वयंचलित पुरवठा प्रणाली' }, value: 'Installed' }
      ]
    }
  ];

  // Filter functions
  const getFilteredTenders = () => {
    return openTenders.filter(tender => {
      const matchesSearch = tender.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tender.title.mr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tender.department.en.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };

  const getFilteredOngoing = () => {
    let filtered = ongoingContracts;
    if (statusFilter !== 'All') {
      // For ongoing contracts, we could filter by progress ranges if needed
      filtered = ongoingContracts;
    }
    return filtered.filter(contract => {
      const matchesSearch = contract.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contract.title.mr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contract.contractor.en.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };

  const getFilteredCompleted = () => {
    return completedContracts.filter(contract => {
      const matchesSearch = contract.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contract.title.mr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contract.contractor.en.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'ongoing': return 'bg-orange-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-20 h-20 bg-contracts rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
            <FileBarChart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t({ en: 'Government Contracts', mr: 'शासकीय कंत्राटे' })}
          </h1>
          <p className="text-gray-600 text-lg">
            {t({ en: 'View and track government contracts, tenders, and projects in your village', mr: 'आपल्या गावातील शासकीय कंत्राटे, निविदा आणि प्रकल्प पहा आणि ट्रॅक करा' })}
          </p>
        </div>

        {/* Search and Filter Controls */}
        <Card className="mb-8 border-0 shadow-xl glass-effect animate-slide-in-right">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={t({ en: 'Search by contract title or department...', mr: 'कंत्राट शीर्षक किंवा विभागाने शोधा...' })}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-white/50 backdrop-blur-sm">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">{t({ en: 'All Status', mr: 'सर्व स्थिती' })}</SelectItem>
                    <SelectItem value="Open">{t({ en: 'Open Tenders', mr: 'खुल्या निविदा' })}</SelectItem>
                    <SelectItem value="Ongoing">{t({ en: 'Ongoing', mr: 'सुरू आहे' })}</SelectItem>
                    <SelectItem value="Completed">{t({ en: 'Completed', mr: 'पूर्ण झाले' })}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-lg glass-effect hover-lift animate-scale-in">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600">{openTenders.length}</div>
              <div className="text-sm text-gray-600">{t({ en: 'Open Tenders', mr: 'खुल्या निविदा' })}</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg glass-effect hover-lift animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <PlayCircle className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-orange-600">{ongoingContracts.length}</div>
              <div className="text-sm text-gray-600">{t({ en: 'Ongoing', mr: 'सुरू आहे' })}</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg glass-effect hover-lift animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{completedContracts.length}</div>
              <div className="text-sm text-gray-600">{t({ en: 'Completed', mr: 'पूर्ण झाले' })}</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg glass-effect hover-lift animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <IndianRupee className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(
                  [...openTenders, ...ongoingContracts, ...completedContracts].reduce((total, item) => 
                    total + (item.estimatedBudget || item.allocatedBudget || item.totalCost), 0
                  )
                ).slice(0, -3)}K
              </div>
              <div className="text-sm text-gray-600">{t({ en: 'Total Value', mr: 'एकूण मूल्य' })}</div>
            </CardContent>
          </Card>
        </div>

        {/* Open Tenders Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-8 bg-green-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t({ en: 'Open Tenders', mr: 'खुल्या निविदा' })}
            </h2>
            <Badge className="bg-green-500 text-white">{getFilteredTenders().length}</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredTenders().map((tender, index) => (
              <Card key={tender.id} className="border-0 shadow-xl glass-effect hover-lift animate-slide-in-right" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge className="bg-green-500 text-white mb-2">
                      {t({ en: 'Open', mr: 'खुले' })}
                    </Badge>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(tender.estimatedBudget).slice(0, -3)}K
                      </div>
                      <div className="text-xs text-gray-500">{t({ en: 'Est. Budget', mr: 'अंदाजे बजेट' })}</div>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{t(tender.title)}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="h-4 w-4" />
                    {t(tender.department)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="text-gray-500">{t({ en: 'Issue Date', mr: 'जारी दिनांक' })}</div>
                        <div className="font-medium">{formatDate(tender.issueDate)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="text-gray-500">{t({ en: 'Last Date', mr: 'शेवटची तारीख' })}</div>
                        <div className="font-medium text-red-600">{formatDate(tender.lastDate)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium">{t(tender.contact.name)}</div>
                      <div className="text-gray-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {tender.contact.phone}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => {
                      setSelectedContract(tender);
                      setIsDetailOpen(true);
                    }}
                    className="w-full bg-contracts hover:bg-contracts/90 text-white"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t({ en: 'View Details', mr: 'तपशील पहा' })}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Ongoing Contracts Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-8 bg-orange-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t({ en: 'Ongoing Contracts', mr: 'सुरू असलेले कंत्राटे' })}
            </h2>
            <Badge className="bg-orange-500 text-white">{getFilteredOngoing().length}</Badge>
          </div>
          
          <div className="space-y-6">
            {getFilteredOngoing().map((contract, index) => (
              <Card key={contract.id} className="border-0 shadow-xl glass-effect hover-lift animate-slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-6">
                    {/* Project Info */}
                    <div className="md:col-span-2">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className="bg-orange-500 text-white">
                          {t({ en: 'Ongoing', mr: 'सुरू आहे' })}
                        </Badge>
                        <div className="text-right">
                          <div className="text-xl font-bold text-orange-600">
                            {formatCurrency(contract.allocatedBudget).slice(0, -3)}K
                          </div>
                          <div className="text-xs text-gray-500">{t({ en: 'Budget', mr: 'बजेट' })}</div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2">{t(contract.title)}</h3>
                      <p className="text-gray-600 mb-3">{t(contract.contractor)}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <div className="text-gray-500">{t({ en: 'Start Date', mr: 'सुरुवात दिनांक' })}</div>
                          <div className="font-medium">{formatDate(contract.startDate)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">{t({ en: 'Expected Completion', mr: 'अपेक्षित पूर्णता' })}</div>
                          <div className="font-medium">{formatDate(contract.expectedCompletion)}</div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{t({ en: 'Progress', mr: 'प्रगती' })}</span>
                          <span className="text-sm font-bold">{contract.progress}%</span>
                        </div>
                        <Progress 
                          value={contract.progress} 
                          className="h-3"
                        />
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">{t(contract.currentPhase)}</p>
                    </div>
                    
                    {/* Site Photo */}
                    <div className="flex flex-col items-center">
                      <div className="mb-3">
                        <ImageWithFallback
                          src={contract.sitePhoto}
                          alt={t(contract.title)}
                          className="w-full h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => {
                            // Could open image in full view
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 text-center">
                        {t({ en: 'Latest Site Photo', mr: 'नवीनतम साइट फोटो' })}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button 
                        onClick={() => {
                          setSelectedContract(contract);
                          setIsProgressOpen(true);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        {t({ en: 'View Progress', mr: 'प्रगती पहा' })}
                      </Button>
                      
                      <Button variant="outline" className="border-gray-300">
                        <Camera className="h-4 w-4 mr-2" />
                        {t({ en: 'Site Photos', mr: 'साइट फोटो' })}
                      </Button>
                      
                      <Button variant="outline" className="border-gray-300">
                        <FileText className="h-4 w-4 mr-2" />
                        {t({ en: 'Documents', mr: 'कागदपत्रे' })}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Completed Contracts Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-8 bg-blue-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t({ en: 'Completed Contracts', mr: 'पूर्ण झालेले कंत्राटे' })}
            </h2>
            <Badge className="bg-blue-500 text-white">{getFilteredCompleted().length}</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredCompleted().map((contract, index) => (
              <Card key={contract.id} className="border-0 shadow-xl glass-effect hover-lift animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative">
                  <ImageWithFallback
                    src={contract.finalPhoto}
                    alt={t(contract.title)}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-500 text-white">
                      {t({ en: 'Completed', mr: 'पूर्ण झाले' })}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                      <Award className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs font-bold">{contract.rating}</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{t(contract.title)}</h3>
                  <p className="text-gray-600 text-sm mb-3">{t(contract.contractor)}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <div className="text-gray-500">{t({ en: 'Total Cost', mr: 'एकूण खर्च' })}</div>
                      <div className="font-bold text-blue-600">
                        {formatCurrency(contract.totalCost).slice(0, -3)}K
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">{t({ en: 'Completed', mr: 'पूर्ण दिनांक' })}</div>
                      <div className="font-medium">{formatDate(contract.completionDate)}</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{t(contract.summary)}</p>
                  
                  <Button 
                    onClick={() => {
                      setSelectedContract(contract);
                      setIsReportOpen(true);
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {t({ en: 'View Report', mr: 'अहवाल पहा' })}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Tender Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t({ en: 'Tender Details', mr: 'निविदा तपशील' })}</DialogTitle>
          </DialogHeader>

          {selectedContract && 'estimatedBudget' in selectedContract && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg mb-2">{t(selectedContract.title)}</h3>
                    <Badge className="bg-green-500 text-white">{t({ en: 'Open Tender', mr: 'खुली निविदा' })}</Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">{t({ en: 'Description', mr: 'वर्णन' })}</h4>
                    <p className="text-gray-600">{t(selectedContract.description)}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">{t({ en: 'Requirements', mr: 'आवश्यकता' })}</h4>
                    <p className="text-gray-600">{t(selectedContract.requirements)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold">{t({ en: 'Department', mr: 'विभाग' })}</h4>
                      <p>{t(selectedContract.department)}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">{t({ en: 'Estimated Budget', mr: 'अंदाजे बजेट' })}</h4>
                      <p className="text-xl font-bold text-green-600">{formatCurrency(selectedContract.estimatedBudget)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold">{t({ en: 'Issue Date', mr: 'जारी दिनांक' })}</h4>
                      <p>{formatDate(selectedContract.issueDate)}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">{t({ en: 'Last Date', mr: 'शेवटची तारीख' })}</h4>
                      <p className="text-red-600 font-medium">{formatDate(selectedContract.lastDate)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">{t({ en: 'Contact Person', mr: 'संपर्क व्यक्ती' })}</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">{t(selectedContract.contact.name)}</p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {selectedContract.contact.phone}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">{t({ en: 'Download Documents', mr: 'कागदपत्रे डाउनलोड करा' })}</h4>
                    <div className="space-y-2">
                      {selectedContract.documents.map((doc, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {doc}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              {t({ en: 'Close', mr: 'बंद करा' })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Progress Dialog */}
      <Dialog open={isProgressOpen} onOpenChange={setIsProgressOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t({ en: 'Project Progress', mr: 'प्रकल्प प्रगती' })}</DialogTitle>
          </DialogHeader>

          {selectedContract && 'progress' in selectedContract && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">{t(selectedContract.title)}</h3>
                <div className="flex justify-center items-center gap-4 mb-4">
                  <div className="text-3xl font-bold text-orange-600">{selectedContract.progress}%</div>
                  <div className="text-gray-600">{t({ en: 'Complete', mr: 'पूर्ण' })}</div>
                </div>
                <Progress value={selectedContract.progress} className="h-4 mb-4" />
                <p className="text-gray-600">{t(selectedContract.currentPhase)}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-lg mb-4">{t({ en: 'Project Timeline', mr: 'प्रकल्प वेळापत्रक' })}</h4>
                  <div className="space-y-4">
                    {selectedContract.timeline.map((phase, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          phase.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {phase.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{t(phase.phase)}</div>
                          <div className="text-sm text-gray-500">{formatDate(phase.date)}</div>
                        </div>
                        {phase.completed && (
                          <Badge className="bg-green-500 text-white">
                            {t({ en: 'Completed', mr: 'पूर्ण' })}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-4">{t({ en: 'Project Details', mr: 'प्रकल्प तपशील' })}</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold">{t({ en: 'Contractor', mr: 'कंत्राटदार' })}</h5>
                      <p>{t(selectedContract.contractor)}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold">{t({ en: 'Budget Allocated', mr: 'वाटप केलेले बजेट' })}</h5>
                      <p className="text-xl font-bold text-orange-600">{formatCurrency(selectedContract.allocatedBudget)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold">{t({ en: 'Start Date', mr: 'सुरुवात दिनांक' })}</h5>
                        <p>{formatDate(selectedContract.startDate)}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">{t({ en: 'Expected Completion', mr: 'अपेक्षित पूर्णता' })}</h5>
                        <p>{formatDate(selectedContract.expectedCompletion)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold mb-2">{t({ en: 'Latest Site Photo', mr: 'नवीनतम साइट फोटो' })}</h5>
                      <ImageWithFallback
                        src={selectedContract.sitePhoto}
                        alt={t(selectedContract.title)}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsProgressOpen(false)}>
              {t({ en: 'Close', mr: 'बंद करा' })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Completion Report Dialog */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t({ en: 'Project Completion Report', mr: 'प्रकल्प पूर्णता अहवाल' })}</DialogTitle>
          </DialogHeader>

          {selectedContract && 'totalCost' in selectedContract && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">{t(selectedContract.title)}</h3>
                <Badge className="bg-blue-500 text-white mb-4">
                  {t({ en: 'Successfully Completed', mr: 'यशस्वीपणे पूर्ण' })}
                </Badge>
                <div className="flex justify-center items-center gap-1 mb-4">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <span className="text-lg font-bold">{selectedContract.rating}/5.0</span>
                  <span className="text-gray-600">{t({ en: 'Rating', mr: 'रेटिंग' })}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <ImageWithFallback
                    src={selectedContract.finalPhoto}
                    alt={t(selectedContract.title)}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold">{t({ en: 'Project Summary', mr: 'प्रकल्प सारांश' })}</h4>
                      <p className="text-gray-600">{t(selectedContract.summary)}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold">{t({ en: 'Contractor', mr: 'कंत्राटदार' })}</h4>
                      <p>{t(selectedContract.contractor)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold">{t({ en: 'Total Cost', mr: 'एकूण खर्च' })}</h4>
                      <p className="text-xl font-bold text-blue-600">{formatCurrency(selectedContract.totalCost)}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">{t({ en: 'Completion Date', mr: 'पूर्णता दिनांक' })}</h4>
                      <p>{formatDate(selectedContract.completionDate)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-3">{t({ en: 'Project Deliverables', mr: 'प्रकल्प वितरण' })}</h4>
                    <div className="space-y-2">
                      {selectedContract.deliverables.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                          <span className="font-medium">{t(item.item)}</span>
                          <span className="text-blue-600 font-bold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                      <Download className="h-4 w-4 mr-2" />
                      {t({ en: 'Download Full Report', mr: 'संपूर्ण अहवाल डाउनलोड करा' })}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsReportOpen(false)}>
              {t({ en: 'Close', mr: 'बंद करा' })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}