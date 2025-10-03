import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { useLanguage } from './LanguageProvider';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  Upload,
  FileBarChart,
  AlertCircle,
  Building2,
  IndianRupee,
  Clock,
  PlayCircle,
  CheckCircle,
  Calendar,
  User,
  Phone,
  MapPin,
  Camera,
  TrendingUp,
  Award,
  Search,
  Filter
} from 'lucide-react';

export function ContractsContentManager() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('tenders');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [currentAction, setCurrentAction] = useState('');

  // Open Tenders Management
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
    }
  ]);

  // Ongoing Contracts Management
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
      ]
    }
  ]);

  // Completed Contracts Management
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
      ]
    }
  ]);

  // Form states
  const [formData, setFormData] = useState({});

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

  // Dialog handlers
  const openAddDialog = (section) => {
    setCurrentAction('add');
    setActiveSection(section);
    setEditingItem(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const openEditDialog = (item, section) => {
    setCurrentAction('edit');
    setActiveSection(section);
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({});
    setCurrentAction('');
  };

  const saveItem = () => {
    if (currentAction === 'add') {
      const newId = Math.max(...getAllItems().map(item => item.id)) + 1;
      const newItem = { ...formData, id: newId };
      
      switch (activeSection) {
        case 'tenders':
          setOpenTenders([...openTenders, newItem]);
          break;
        case 'ongoing':
          setOngoingContracts([...ongoingContracts, newItem]);
          break;
        case 'completed':
          setCompletedContracts([...completedContracts, newItem]);
          break;
      }
    } else if (currentAction === 'edit') {
      switch (activeSection) {
        case 'tenders':
          setOpenTenders(openTenders.map(item => item.id === editingItem.id ? formData : item));
          break;
        case 'ongoing':
          setOngoingContracts(ongoingContracts.map(item => item.id === editingItem.id ? formData : item));
          break;
        case 'completed':
          setCompletedContracts(completedContracts.map(item => item.id === editingItem.id ? formData : item));
          break;
      }
    }
    closeDialog();
  };

  const deleteItem = (id, section) => {
    switch (section) {
      case 'tenders':
        setOpenTenders(openTenders.filter(item => item.id !== id));
        break;
      case 'ongoing':
        setOngoingContracts(ongoingContracts.filter(item => item.id !== id));
        break;
      case 'completed':
        setCompletedContracts(completedContracts.filter(item => item.id !== id));
        break;
    }
  };

  const getAllItems = () => {
    return [...openTenders, ...ongoingContracts, ...completedContracts];
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedFormData = (parentField, childField, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t({ en: 'Contracts Content Management', mr: 'कंत्राट सामग्री व्यवस्थापन' })}
          </h2>
          <p className="text-gray-600">
            {t({ en: 'Manage all contracts page content including tenders, ongoing and completed projects', mr: 'निविदा, चालू आणि पूर्ण प्रकल्पांसह सर्व कंत्राट पृष्ठ सामग्री व्यवस्थापित करा' })}
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium mb-1">
                  {t({ en: 'Open Tenders', mr: 'खुल्या निविदा' })}
                </p>
                <p className="text-3xl font-bold text-green-700">{openTenders.length}</p>
              </div>
              <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium mb-1">
                  {t({ en: 'Ongoing Contracts', mr: 'सुरू असलेले कंत्राटे' })}
                </p>
                <p className="text-3xl font-bold text-orange-700">{ongoingContracts.length}</p>
              </div>
              <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center">
                <PlayCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium mb-1">
                  {t({ en: 'Completed Contracts', mr: 'पूर्ण झालेले कंत्राटे' })}
                </p>
                <p className="text-3xl font-bold text-blue-700">{completedContracts.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tenders" className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>{t({ en: 'Open Tenders', mr: 'खुल्या निविदा' })}</span>
          </TabsTrigger>
          <TabsTrigger value="ongoing" className="flex items-center space-x-2">
            <PlayCircle className="h-4 w-4" />
            <span>{t({ en: 'Ongoing', mr: 'सुरू आहे' })}</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>{t({ en: 'Completed', mr: 'पूर्ण झाले' })}</span>
          </TabsTrigger>
        </TabsList>

        {/* Open Tenders Management */}
        <TabsContent value="tenders">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-green-500" />
                  <span>{t({ en: 'Open Tenders Management', mr: 'खुल्या निविदा व्यवस्थापन' })}</span>
                </CardTitle>
                <Button 
                  onClick={() => openAddDialog('tenders')}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t({ en: 'Add Tender', mr: 'निविदा जोडा' })}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t({ en: 'Title', mr: 'शीर्षक' })}</TableHead>
                      <TableHead>{t({ en: 'Department', mr: 'विभाग' })}</TableHead>
                      <TableHead>{t({ en: 'Budget', mr: 'बजेट' })}</TableHead>
                      <TableHead>{t({ en: 'Last Date', mr: 'शेवटची तारीख' })}</TableHead>
                      <TableHead>{t({ en: 'Contact', mr: 'संपर्क' })}</TableHead>
                      <TableHead>{t({ en: 'Actions', mr: 'क्रिया' })}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openTenders.map((tender) => (
                      <TableRow key={tender.id}>
                        <TableCell className="font-medium">
                          {t(tender.title)}
                        </TableCell>
                        <TableCell>{t(tender.department)}</TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {formatCurrency(tender.estimatedBudget)}
                        </TableCell>
                        <TableCell>{formatDate(tender.lastDate)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{t(tender.contact.name)}</div>
                            <div className="text-gray-500">{tender.contact.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(tender, 'tenders')}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteItem(tender.id, 'tenders')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ongoing Contracts Management */}
        <TabsContent value="ongoing">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <PlayCircle className="h-5 w-5 text-orange-500" />
                  <span>{t({ en: 'Ongoing Contracts Management', mr: 'सुरू असलेले कंत्राट व्यवस्थापन' })}</span>
                </CardTitle>
                <Button 
                  onClick={() => openAddDialog('ongoing')}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t({ en: 'Add Contract', mr: 'कंत्राट जोडा' })}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ongoingContracts.map((contract) => (
                  <Card key={contract.id} className="border-l-4 border-orange-500">
                    <CardContent className="p-4">
                      <div className="grid md:grid-cols-4 gap-4 items-center">
                        <div className="md:col-span-2">
                          <h3 className="font-semibold text-lg mb-1">{t(contract.title)}</h3>
                          <p className="text-gray-600 mb-2">{t(contract.contractor)}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{formatCurrency(contract.allocatedBudget)}</span>
                            <span>{contract.progress}% Complete</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <ImageWithFallback
                            src={contract.sitePhoto}
                            alt={t(contract.title)}
                            className="w-20 h-20 object-cover rounded-lg mb-2"
                          />
                          <span className="text-xs text-gray-500">{t({ en: 'Site Photo', mr: 'साइट फोटो' })}</span>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(contract, 'ongoing')}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            {t({ en: 'Edit', mr: 'संपादित करा' })}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteItem(contract.id, 'ongoing')}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t({ en: 'Delete', mr: 'हटवा' })}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completed Contracts Management */}
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <span>{t({ en: 'Completed Contracts Management', mr: 'पूर्ण झालेले कंत्राट व्यवस्थापन' })}</span>
                </CardTitle>
                <Button 
                  onClick={() => openAddDialog('completed')}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t({ en: 'Add Completed Project', mr: 'पूर्ण प्रकल्प जोडा' })}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedContracts.map((contract) => (
                  <Card key={contract.id} className="border-l-4 border-blue-500">
                    <CardContent className="p-4">
                      <div className="grid md:grid-cols-4 gap-4 items-center">
                        <div className="md:col-span-2">
                          <h3 className="font-semibold text-lg mb-1">{t(contract.title)}</h3>
                          <p className="text-gray-600 mb-2">{t(contract.contractor)}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{formatCurrency(contract.totalCost)}</span>
                            <span className="flex items-center">
                              <Award className="h-4 w-4 mr-1" />
                              {contract.rating}/5
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <ImageWithFallback
                            src={contract.finalPhoto}
                            alt={t(contract.title)}
                            className="w-20 h-20 object-cover rounded-lg mb-2"
                          />
                          <span className="text-xs text-gray-500">{t({ en: 'Final Photo', mr: 'अंतिम फोटो' })}</span>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(contract, 'completed')}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            {t({ en: 'Edit', mr: 'संपादित करा' })}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteItem(contract.id, 'completed')}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t({ en: 'Delete', mr: 'हटवा' })}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentAction === 'add' 
                ? t({ en: 'Add New Item', mr: 'नवीन आयटम जोडा' })
                : t({ en: 'Edit Item', mr: 'आयटम संपादित करा' })
              }
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title-en">{t({ en: 'Title (English)', mr: 'शीर्षक (इंग्रजी)' })}</Label>
                <Input
                  id="title-en"
                  value={formData.title?.en || ''}
                  onChange={(e) => updateNestedFormData('title', 'en', e.target.value)}
                  placeholder="Enter title in English"
                />
              </div>
              <div>
                <Label htmlFor="title-mr">{t({ en: 'Title (Marathi)', mr: 'शीर्षक (मराठी)' })}</Label>
                <Input
                  id="title-mr"
                  value={formData.title?.mr || ''}
                  onChange={(e) => updateNestedFormData('title', 'mr', e.target.value)}
                  placeholder="मराठीत शीर्षक प्रविष्ट करा"
                />
              </div>
            </div>

            {/* Section-specific fields for tenders */}
            {activeSection === 'tenders' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department-en">{t({ en: 'Department (English)', mr: 'विभाग (इंग्रजी)' })}</Label>
                    <Input
                      id="department-en"
                      value={formData.department?.en || ''}
                      onChange={(e) => updateNestedFormData('department', 'en', e.target.value)}
                      placeholder="Enter department name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department-mr">{t({ en: 'Department (Marathi)', mr: 'विभाग (मराठी)' })}</Label>
                    <Input
                      id="department-mr"
                      value={formData.department?.mr || ''}
                      onChange={(e) => updateNestedFormData('department', 'mr', e.target.value)}
                      placeholder="विभागाचे नाव प्रविष्ट करा"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="budget">{t({ en: 'Estimated Budget (₹)', mr: 'अंदाजे बजेट (₹)' })}</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.estimatedBudget || ''}
                      onChange={(e) => updateFormData('estimatedBudget', parseInt(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="issue-date">{t({ en: 'Issue Date', mr: 'जारी दिनांक' })}</Label>
                    <Input
                      id="issue-date"
                      type="date"
                      value={formData.issueDate || ''}
                      onChange={(e) => updateFormData('issueDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last-date">{t({ en: 'Last Date', mr: 'शेवटची तारीख' })}</Label>
                    <Input
                      id="last-date"
                      type="date"
                      value={formData.lastDate || ''}
                      onChange={(e) => updateFormData('lastDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact-name-en">{t({ en: 'Contact Name (English)', mr: 'संपर्क नाव (इंग्रजी)' })}</Label>
                    <Input
                      id="contact-name-en"
                      value={formData.contact?.name?.en || ''}
                      onChange={(e) => updateFormData('contact', {
                        ...formData.contact,
                        name: { ...formData.contact?.name, en: e.target.value }
                      })}
                      placeholder="Contact person name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-phone">{t({ en: 'Contact Phone', mr: 'संपर्क फोन' })}</Label>
                    <Input
                      id="contact-phone"
                      value={formData.contact?.phone || ''}
                      onChange={(e) => updateFormData('contact', {
                        ...formData.contact,
                        phone: e.target.value
                      })}
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Section-specific fields for ongoing contracts */}
            {activeSection === 'ongoing' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contractor-en">{t({ en: 'Contractor (English)', mr: 'कंत्राटदार (इंग्रजी)' })}</Label>
                    <Input
                      id="contractor-en"
                      value={formData.contractor?.en || ''}
                      onChange={(e) => updateNestedFormData('contractor', 'en', e.target.value)}
                      placeholder="Contractor name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contractor-mr">{t({ en: 'Contractor (Marathi)', mr: 'कंत्राटदार (मराठी)' })}</Label>
                    <Input
                      id="contractor-mr"
                      value={formData.contractor?.mr || ''}
                      onChange={(e) => updateNestedFormData('contractor', 'mr', e.target.value)}
                      placeholder="कंत्राटदार नाव"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="allocated-budget">{t({ en: 'Allocated Budget (₹)', mr: 'नियुक्त बजेट (₹)' })}</Label>
                    <Input
                      id="allocated-budget"
                      type="number"
                      value={formData.allocatedBudget || ''}
                      onChange={(e) => updateFormData('allocatedBudget', parseInt(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="start-date">{t({ en: 'Start Date', mr: 'सुरुवात दिनांक' })}</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={formData.startDate || ''}
                      onChange={(e) => updateFormData('startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="completion-date">{t({ en: 'Expected Completion', mr: 'अपेक्षित पूर्णता' })}</Label>
                    <Input
                      id="completion-date"
                      type="date"
                      value={formData.expectedCompletion || ''}
                      onChange={(e) => updateFormData('expectedCompletion', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="progress">{t({ en: 'Progress (%)', mr: 'प्रगती (%)' })}</Label>
                  <Input
                    id="progress"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress || 0}
                    onChange={(e) => updateFormData('progress', parseInt(e.target.value))}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="site-photo">{t({ en: 'Site Photo URL', mr: 'साइट फोटो URL' })}</Label>
                  <Input
                    id="site-photo"
                    value={formData.sitePhoto || ''}
                    onChange={(e) => updateFormData('sitePhoto', e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </>
            )}

            {/* Section-specific fields for completed contracts */}
            {activeSection === 'completed' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contractor-en">{t({ en: 'Contractor (English)', mr: 'कंत्राटदार (इंग्रजी)' })}</Label>
                    <Input
                      id="contractor-en"
                      value={formData.contractor?.en || ''}
                      onChange={(e) => updateNestedFormData('contractor', 'en', e.target.value)}
                      placeholder="Contractor name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contractor-mr">{t({ en: 'Contractor (Marathi)', mr: 'कंत्राटदार (मराठी)' })}</Label>
                    <Input
                      id="contractor-mr"
                      value={formData.contractor?.mr || ''}
                      onChange={(e) => updateNestedFormData('contractor', 'mr', e.target.value)}
                      placeholder="कंत्राटदार नाव"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="total-cost">{t({ en: 'Total Cost (₹)', mr: 'एकूण खर्च (₹)' })}</Label>
                    <Input
                      id="total-cost"
                      type="number"
                      value={formData.totalCost || ''}
                      onChange={(e) => updateFormData('totalCost', parseInt(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="completion-date">{t({ en: 'Completion Date', mr: 'पूर्णता दिनांक' })}</Label>
                    <Input
                      id="completion-date"
                      type="date"
                      value={formData.completionDate || ''}
                      onChange={(e) => updateFormData('completionDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rating">{t({ en: 'Rating (1-5)', mr: 'रेटिंग (१-५)' })}</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating || ''}
                      onChange={(e) => updateFormData('rating', parseFloat(e.target.value))}
                      placeholder="4.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="final-photo">{t({ en: 'Final Photo URL', mr: 'अंतिम फोटो URL' })}</Label>
                  <Input
                    id="final-photo"
                    value={formData.finalPhoto || ''}
                    onChange={(e) => updateFormData('finalPhoto', e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </>
            )}

            {/* Description fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="description-en">{t({ en: 'Description (English)', mr: 'वर्णन (इंग्रजी)' })}</Label>
                <Textarea
                  id="description-en"
                  value={formData.description?.en || ''}
                  onChange={(e) => updateNestedFormData('description', 'en', e.target.value)}
                  placeholder="Enter description in English"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="description-mr">{t({ en: 'Description (Marathi)', mr: 'वर्णन (मराठी)' })}</Label>
                <Textarea
                  id="description-mr"
                  value={formData.description?.mr || ''}
                  onChange={(e) => updateNestedFormData('description', 'mr', e.target.value)}
                  placeholder="मराठीत वर्णन प्रविष्ट करा"
                  rows={3}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={closeDialog}>
                <X className="h-4 w-4 mr-2" />
                {t({ en: 'Cancel', mr: 'रद्द करा' })}
              </Button>
              <Button onClick={saveItem} className="bg-contracts">
                <Save className="h-4 w-4 mr-2" />
                {currentAction === 'add' 
                  ? t({ en: 'Add Item', mr: 'आयटम जोडा' })
                  : t({ en: 'Save Changes', mr: 'बदल जतन करा' })
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}