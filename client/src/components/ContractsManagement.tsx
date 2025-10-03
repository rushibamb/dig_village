import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useLanguage } from './LanguageProvider';
import { 
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  Search,
  Filter,
  FileText,
  CheckCircle,
  AlertTriangle,
  Download,
  Eye,
  MoreHorizontal,
  Building,
  TrendingUp,
  Target,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  Clock,
  FileBarChart
} from 'lucide-react';

export function ContractsManagement() {
  const { language } = useLanguage();

  // Contract management states
  const [openTenders, setOpenTenders] = useState([
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
      documents: ['tender_notice.pdf', 'technical_specs.pdf', 'terms_conditions.pdf'],
      isActive: true
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
      documents: ['tender_notice.pdf', 'site_survey.pdf', 'material_specs.pdf'],
      isActive: true
    }
  ]);

  const [ongoingContracts, setOngoingContracts] = useState([
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
      sitePhoto: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd',
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
      ],
      isActive: true
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
      sitePhoto: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12',
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
      ],
      isActive: true
    }
  ]);

  const [completedContracts, setCompletedContracts] = useState([
    {
      id: 1,
      title: { 
        en: 'Village Main Road Concretization', 
        mr: 'गाव मुख्य रस्ता काँक्रीटीकरण' 
      },
      contractor: { en: 'Perfect Roads Ltd.', mr: 'परफेक्ट रोड्स लिमिटेड' },
      totalCost: 4200000,
      completionDate: '2023-10-15',
      finalPhoto: 'https://images.unsplash.com/photo-1548618447-14dc67c0d8f7',
      rating: 4.8,
      summary: {
        en: '3.2 km main road successfully completed with high-quality concrete and proper drainage',
        mr: '३.२ किमी मुख्य रस्ता उच्च दर्जाच्या काँक्रीट आणि योग्य निचरा व्यवस्थेसह यशस्वीपणे पूर्ण'
      },
      deliverables: [
        { item: { en: 'Road Length', mr: 'रस्त्याची लांबी' }, value: '3.2 km' },
        { item: { en: 'Drainage Lines', mr: 'निचरा रेषा' }, value: '2.8 km' },
        { item: { en: 'Street Lights', mr: 'रस्ते दिवे' }, value: '32 units' }
      ],
      isActive: true
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
      finalPhoto: 'https://images.unsplash.com/photo-1551076805-e1869033e561',
      rating: 4.9,
      summary: {
        en: 'Modern primary health center with 15 beds, emergency room, and medical equipment',
        mr: 'आधुनिक प्राथमिक आरोग्य केंद्र १५ बेड, आपत्कालीन कक्ष आणि वैद्यकीय उपकरणांसह'
      },
      deliverables: [
        { item: { en: 'Total Area', mr: 'एकूण क्षेत्रफळ' }, value: '2,500 sq ft' },
        { item: { en: 'Patient Beds', mr: 'रुग्ण बेड' }, value: '15 units' },
        { item: { en: 'Medical Equipment', mr: 'वैद्यकीय उपकरणे' }, value: 'Complete Set' }
      ],
      isActive: true
    }
  ]);

  const [contractors, setContractors] = useState([
    {
      id: 1,
      name: { en: 'ABC Construction Ltd.', mr: 'एबीसी कन्स्ट्रक्शन लिमिटेड' },
      contactPerson: { en: 'Mr. Suresh Joshi', mr: 'श्री. सुरेश जोशी' },
      phone: '+91 9876501234',
      email: 'contact@abcconstruction.com',
      address: { en: 'Plot 15, Industrial Area, Pune', mr: 'प्लॉट १५, औद्योगिक क्षेत्र, पुणे' },
      experience: { en: '15 years in construction', mr: '१५ वर्षांचा बांधकाम अनुभव' },
      specialization: { en: 'Building Construction', mr: 'इमारत बांधकाम' },
      rating: 4.5,
      isActive: true,
      completedProjects: 12
    },
    {
      id: 2,
      name: { en: 'XYZ Infrastructure Pvt.', mr: 'एक्सवायझेड इन्फ्रास्ट्रक्चर प्रायव्हेट' },
      contactPerson: { en: 'Mrs. Priya Singh', mr: 'श्रीमती. प्रिया सिंग' },
      phone: '+91 9876501235',
      email: 'info@xyzinfra.com',
      address: { en: 'Sector 23, IT Park, Mumbai', mr: 'सेक्टर २३, आयटी पार्क, मुंबई' },
      experience: { en: '20 years in infrastructure', mr: '२० वर्षांचा पायाभूत सुविधा अनुभव' },
      specialization: { en: 'Water & Drainage Systems', mr: 'पाणी आणि निचरा प्रणाली' },
      rating: 4.7,
      isActive: true,
      completedProjects: 18
    }
  ]);

  // UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedContract, setSelectedContract] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddTenderOpen, setIsAddTenderOpen] = useState(false);
  const [isEditContractOpen, setIsEditContractOpen] = useState(false);
  const [isContractorManagementOpen, setIsContractorManagementOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tenders');

  const [newTender, setNewTender] = useState({
    title: { en: '', mr: '' },
    department: '',
    estimatedBudget: '',
    issueDate: '',
    lastDate: '',
    contact: { name: { en: '', mr: '' }, phone: '' },
    description: { en: '', mr: '' },
    requirements: { en: '', mr: '' }
  });

  const handleAddTender = () => {
    const tender = {
      id: openTenders.length + 1,
      ...newTender,
      estimatedBudget: parseInt(newTender.estimatedBudget),
      documents: [],
      isActive: true
    };
    setOpenTenders([...openTenders, tender]);
    setNewTender({
      title: { en: '', mr: '' },
      department: '',
      estimatedBudget: '',
      issueDate: '',
      lastDate: '',
      contact: { name: { en: '', mr: '' }, phone: '' },
      description: { en: '', mr: '' },
      requirements: { en: '', mr: '' }
    });
    setIsAddTenderOpen(false);
  };

  const handleDeleteTender = (id) => {
    setOpenTenders(openTenders.filter(tender => tender.id !== id));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ongoing':
        return <Badge className="bg-blue-500 text-white">{language === 'mr' ? 'सुरू' : 'Ongoing'}</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 text-white">{language === 'mr' ? 'पूर्ण' : 'Completed'}</Badge>;
      default:
        return <Badge className="bg-orange-500 text-white">{language === 'mr' ? 'खुला' : 'Open'}</Badge>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileBarChart className="h-8 w-8 text-contracts" />
          <div>
            <h1 className="text-contracts">
              {language === 'mr' ? 'कंत्राट व्यवस्थापन' : 'Contracts Management'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'mr' 
                ? 'टेंडर, चालू आणि पूर्ण कंत्राट व्यवस्थापित करा' 
                : 'Manage tenders, ongoing and completed contracts'
              }
            </p>
          </div>
        </div>
        <Button onClick={() => setIsAddTenderOpen(true)} className="bg-contracts text-white">
          <Plus className="h-4 w-4 mr-2" />
          {language === 'mr' ? 'नवीन टेंडर' : 'New Tender'}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'mr' ? 'कंत्राट शोधा...' : 'Search contracts...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={language === 'mr' ? 'स्थिती' : 'Status'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">{language === 'mr' ? 'सर्व' : 'All'}</SelectItem>
                  <SelectItem value="Open">{language === 'mr' ? 'खुला' : 'Open'}</SelectItem>
                  <SelectItem value="Ongoing">{language === 'mr' ? 'सुरू' : 'Ongoing'}</SelectItem>
                  <SelectItem value="Completed">{language === 'mr' ? 'पूर्ण' : 'Completed'}</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                onClick={() => setIsContractorManagementOpen(true)}
              >
                <Building className="h-4 w-4 mr-2" />
                {language === 'mr' ? 'कंत्राटदार' : 'Contractors'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different contract types */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tenders" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>{language === 'mr' ? 'खुले टेंडर' : 'Open Tenders'}</span>
          </TabsTrigger>
          <TabsTrigger value="ongoing" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>{language === 'mr' ? 'चालू कंत्राट' : 'Ongoing Contracts'}</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>{language === 'mr' ? 'पूर्ण कंत्राट' : 'Completed Contracts'}</span>
          </TabsTrigger>
        </TabsList>

        {/* Open Tenders Tab */}
        <TabsContent value="tenders" className="space-y-4">
          <div className="grid gap-4">
            {openTenders.map((tender) => (
              <Card key={tender.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg">{tender.title[language]}</h3>
                        {getStatusBadge('open')}
                      </div>
                      <p className="text-muted-foreground mb-2">{tender.department[language]}</p>
                      <p className="text-sm mb-4">{tender.description[language]}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            {language === 'mr' ? 'अंदाजित बजेट:' : 'Estimated Budget:'}
                          </span>
                          <p className="font-medium">{formatCurrency(tender.estimatedBudget)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {language === 'mr' ? 'शेवटची तारीख:' : 'Last Date:'}
                          </span>
                          <p className="font-medium">{new Date(tender.lastDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {language === 'mr' ? 'संपर्क व्यक्ती:' : 'Contact Person:'}
                          </span>
                          <p className="font-medium">{tender.contact.name[language]}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {language === 'mr' ? 'फोन:' : 'Phone:'}
                          </span>
                          <p className="font-medium">{tender.contact.phone}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedContract(tender);
                          setIsDetailOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteTender(tender.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Ongoing Contracts Tab */}
        <TabsContent value="ongoing" className="space-y-4">
          <div className="grid gap-4">
            {ongoingContracts.map((contract) => (
              <Card key={contract.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg">{contract.title[language]}</h3>
                        {getStatusBadge('ongoing')}
                      </div>
                      <p className="text-muted-foreground mb-2">{contract.contractor[language]}</p>
                      <p className="text-sm mb-4">{contract.currentPhase[language]}</p>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            {language === 'mr' ? 'प्रगती:' : 'Progress:'}
                          </span>
                          <span className="text-sm font-medium">{contract.progress}%</span>
                        </div>
                        <Progress value={contract.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            {language === 'mr' ? 'बजेट:' : 'Budget:'}
                          </span>
                          <p className="font-medium">{formatCurrency(contract.allocatedBudget)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {language === 'mr' ? 'अपेक्षित पूर्णता:' : 'Expected Completion:'}
                          </span>
                          <p className="font-medium">{new Date(contract.expectedCompletion).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {language === 'mr' ? 'सुरुवातीची तारीख:' : 'Start Date:'}
                          </span>
                          <p className="font-medium">{new Date(contract.startDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedContract(contract);
                          setIsDetailOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Completed Contracts Tab */}
        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4">
            {completedContracts.map((contract) => (
              <Card key={contract.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg">{contract.title[language]}</h3>
                        {getStatusBadge('completed')}
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{contract.rating}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">{contract.contractor[language]}</p>
                      <p className="text-sm mb-4">{contract.summary[language]}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            {language === 'mr' ? 'एकूण खर्च:' : 'Total Cost:'}
                          </span>
                          <p className="font-medium">{formatCurrency(contract.totalCost)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {language === 'mr' ? 'पूर्ण तारीख:' : 'Completion Date:'}
                          </span>
                          <p className="font-medium">{new Date(contract.completionDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {language === 'mr' ? 'डिलिव्हरेबल्स:' : 'Deliverables:'}
                          </span>
                          <p className="font-medium">{contract.deliverables.length} {language === 'mr' ? 'आयटम' : 'items'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedContract(contract);
                          setIsDetailOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Tender Dialog */}
      <Dialog open={isAddTenderOpen} onOpenChange={setIsAddTenderOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{language === 'mr' ? 'नवीन टेंडर जोडा' : 'Add New Tender'}</DialogTitle>
            <DialogDescription>
              {language === 'mr' 
                ? 'नवीन टेंडरची माहिती भरा' 
                : 'Fill in the details for the new tender'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title-en">{language === 'mr' ? 'शीर्षक (English)' : 'Title (English)'}</Label>
                <Input
                  id="title-en"
                  value={newTender.title.en}
                  onChange={(e) => setNewTender({
                    ...newTender,
                    title: { ...newTender.title, en: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="title-mr">{language === 'mr' ? 'शीर्षक (मराठी)' : 'Title (Marathi)'}</Label>
                <Input
                  id="title-mr"
                  value={newTender.title.mr}
                  onChange={(e) => setNewTender({
                    ...newTender,
                    title: { ...newTender.title, mr: e.target.value }
                  })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">{language === 'mr' ? 'विभाग' : 'Department'}</Label>
                <Select
                  value={newTender.department}
                  onValueChange={(value) => setNewTender({ ...newTender, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'mr' ? 'विभाग निवडा' : 'Select Department'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="water">
                      {language === 'mr' ? 'पाणी विभाग' : 'Water Department'}
                    </SelectItem>
                    <SelectItem value="roads">
                      {language === 'mr' ? 'सार्वजनिक बांधकाम विभाग' : 'Public Works Department'}
                    </SelectItem>
                    <SelectItem value="development">
                      {language === 'mr' ? 'विकास विभाग' : 'Development Department'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="budget">{language === 'mr' ? 'अंदाजित बजेट' : 'Estimated Budget'}</Label>
                <Input
                  id="budget"
                  type="number"
                  value={newTender.estimatedBudget}
                  onChange={(e) => setNewTender({ ...newTender, estimatedBudget: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issue-date">{language === 'mr' ? 'जारी तारीख' : 'Issue Date'}</Label>
                <Input
                  id="issue-date"
                  type="date"
                  value={newTender.issueDate}
                  onChange={(e) => setNewTender({ ...newTender, issueDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="last-date">{language === 'mr' ? 'शेवटची तारीख' : 'Last Date'}</Label>
                <Input
                  id="last-date"
                  type="date"
                  value={newTender.lastDate}
                  onChange={(e) => setNewTender({ ...newTender, lastDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-name-en">{language === 'mr' ? 'संपर्क व्यक्ती (English)' : 'Contact Person (English)'}</Label>
                <Input
                  id="contact-name-en"
                  value={newTender.contact.name.en}
                  onChange={(e) => setNewTender({
                    ...newTender,
                    contact: { 
                      ...newTender.contact, 
                      name: { ...newTender.contact.name, en: e.target.value }
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="contact-phone">{language === 'mr' ? 'फोन नंबर' : 'Phone Number'}</Label>
                <Input
                  id="contact-phone"
                  value={newTender.contact.phone}
                  onChange={(e) => setNewTender({
                    ...newTender,
                    contact: { ...newTender.contact, phone: e.target.value }
                  })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description-en">{language === 'mr' ? 'वर्णन (English)' : 'Description (English)'}</Label>
              <Textarea
                id="description-en"
                value={newTender.description.en}
                onChange={(e) => setNewTender({
                  ...newTender,
                  description: { ...newTender.description, en: e.target.value }
                })}
              />
            </div>

            <div>
              <Label htmlFor="description-mr">{language === 'mr' ? 'वर्णन (मराठी)' : 'Description (Marathi)'}</Label>
              <Textarea
                id="description-mr"
                value={newTender.description.mr}
                onChange={(e) => setNewTender({
                  ...newTender,
                  description: { ...newTender.description, mr: e.target.value }
                })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddTenderOpen(false)}>
              {language === 'mr' ? 'रद्द करा' : 'Cancel'}
            </Button>
            <Button onClick={handleAddTender} className="bg-contracts text-white">
              <Save className="h-4 w-4 mr-2" />
              {language === 'mr' ? 'सेव्ह करा' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contract Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl">
          {selectedContract && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedContract.title[language]}</DialogTitle>
                <DialogDescription>
                  {language === 'mr' ? 'कंत्राटची संपूर्ण माहिती' : 'Complete contract details'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="mb-3">{language === 'mr' ? 'मूलभूत माहिती' : 'Basic Information'}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedContract.department && (
                      <div>
                        <span className="text-muted-foreground">{language === 'mr' ? 'विभाग:' : 'Department:'}</span>
                        <p>{selectedContract.department[language]}</p>
                      </div>
                    )}
                    {selectedContract.contractor && (
                      <div>
                        <span className="text-muted-foreground">{language === 'mr' ? 'कंत्राटदार:' : 'Contractor:'}</span>
                        <p>{selectedContract.contractor[language]}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="mb-3">{language === 'mr' ? 'वर्णन' : 'Description'}</h4>
                  <p className="text-sm">
                    {selectedContract.description ? selectedContract.description[language] : selectedContract.summary[language]}
                  </p>
                </div>

                {/* Timeline for ongoing contracts */}
                {selectedContract.timeline && (
                  <div>
                    <h4 className="mb-3">{language === 'mr' ? 'वेळापत्रक' : 'Timeline'}</h4>
                    <div className="space-y-2">
                      {selectedContract.timeline.map((phase, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          {phase.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-gray-400" />
                          )}
                          <span className={phase.completed ? 'text-green-600' : 'text-gray-600'}>
                            {phase.phase[language]}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ({new Date(phase.date).toLocaleDateString()})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deliverables for completed contracts */}
                {selectedContract.deliverables && (
                  <div>
                    <h4 className="mb-3">{language === 'mr' ? 'डिलिव्हरेबल्स' : 'Deliverables'}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedContract.deliverables.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.item[language]}:</span>
                          <span className="font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Contractor Management Dialog */}
      <Dialog open={isContractorManagementOpen} onOpenChange={setIsContractorManagementOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>{language === 'mr' ? 'कंत्राटदार व्यवस्थापन' : 'Contractor Management'}</DialogTitle>
            <DialogDescription>
              {language === 'mr' ? 'कंत्राटदारांची यादी आणि त्यांची माहिती' : 'List of contractors and their information'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative flex-1 mr-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'mr' ? 'कंत्राटदार शोधा...' : 'Search contractors...'}
                  className="pl-10"
                />
              </div>
              <Button className="bg-contracts text-white">
                <Plus className="h-4 w-4 mr-2" />
                {language === 'mr' ? 'नवीन कंत्राटदार' : 'New Contractor'}
              </Button>
            </div>

            <div className="grid gap-4">
              {contractors.map((contractor) => (
                <Card key={contractor.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4>{contractor.name[language]}</h4>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm">{contractor.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {contractor.contactPerson[language]}
                        </p>
                        <p className="text-sm mb-3">{contractor.specialization[language]}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">{language === 'mr' ? 'फोन:' : 'Phone:'}</span>
                            <p>{contractor.phone}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{language === 'mr' ? 'ईमेल:' : 'Email:'}</span>
                            <p>{contractor.email}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{language === 'mr' ? 'अनुभव:' : 'Experience:'}</span>
                            <p>{contractor.experience[language]}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{language === 'mr' ? 'पूर्ण प्रकल्प:' : 'Completed:'}</span>
                            <p>{contractor.completedProjects}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}