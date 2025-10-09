import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageProvider';
import { getPublicProjects } from '../services/contractService';
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
  Award,
  BarChart3,
  Wallet,
  DollarSign
} from 'lucide-react';

export function ContractsPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedContract, setSelectedContract] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSitePhotosOpen, setIsSitePhotosOpen] = useState(false);

  // Dynamic data state
  const [openTenders, setOpenTenders] = useState([]);
  const [ongoingContracts, setOngoingContracts] = useState([]);
  const [completedContracts, setCompletedContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Fetch all three statuses concurrently
        const [tendersRes, ongoingRes, completedRes] = await Promise.all([
          getPublicProjects({ status: 'Tender' }),
          getPublicProjects({ status: 'Ongoing' }),
          getPublicProjects({ status: 'Completed' })
        ]);

        setOpenTenders(tendersRes.data || []);
        setOngoingContracts(ongoingRes.data || []);
        setCompletedContracts(completedRes.data || []);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        // Set empty arrays on error
        setOpenTenders([]);
        setOngoingContracts([]);
        setCompletedContracts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [searchTerm, statusFilter]);


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
              <div className="text-2xl font-bold text-green-600">{loading ? '...' : openTenders.length}</div>
              <div className="text-sm text-gray-600">{t({ en: 'Open Tenders', mr: 'खुल्या निविदा' })}</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg glass-effect hover-lift animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <PlayCircle className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-orange-600">{loading ? '...' : ongoingContracts.length}</div>
              <div className="text-sm text-gray-600">{t({ en: 'Ongoing', mr: 'सुरू आहे' })}</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg glass-effect hover-lift animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{loading ? '...' : completedContracts.length}</div>
              <div className="text-sm text-gray-600">{t({ en: 'Completed', mr: 'पूर्ण झाले' })}</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg glass-effect hover-lift animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <IndianRupee className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {loading ? '...' : formatCurrency(
                  [...openTenders, ...ongoingContracts, ...completedContracts].reduce((total, item) => 
                    total + (item.estimatedBudget || item.allocatedBudget || item.totalCost || 0), 0
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
            <Badge className="bg-green-500 text-white">{loading ? '...' : openTenders.length}</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500">Loading tenders...</div>
              </div>
            ) : openTenders.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500">No open tenders found</div>
              </div>
            ) : (
              openTenders.map((tender, index) => (
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
                      <div className="font-medium">{t(tender.contactName || { en: 'N/A', mr: 'N/A' })}</div>
                      <div className="text-gray-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {tender.contactPhone || 'N/A'}
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
              ))
            )}
          </div>
        </section>

        {/* Ongoing Contracts Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-8 bg-orange-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t({ en: 'Ongoing Contracts', mr: 'सुरू असलेले कंत्राटे' })}
            </h2>
            <Badge className="bg-orange-500 text-white">{loading ? '...' : ongoingContracts.length}</Badge>
          </div>
          
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-gray-500">Loading ongoing contracts...</div>
              </div>
            ) : ongoingContracts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500">No ongoing contracts found</div>
              </div>
            ) : (
              ongoingContracts.map((contract, index) => (
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
                          <div className="font-medium">{formatDate(contract.expectedCompletionDate)}</div>
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
                      
                      <p className="text-sm text-gray-600 mb-4">{t(contract.currentPhase || { en: 'N/A', mr: 'N/A' })}</p>
                    </div>
                    
                    {/* Site Photo */}
                    <div className="flex flex-col items-center">
                      <div className="mb-3">
                        <ImageWithFallback
                          src={contract.sitePhotos?.[0] || contract.sitePhoto}
                          alt={t(contract.title)}
                          className="w-full h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => {
                            if (contract.sitePhotos && contract.sitePhotos.length > 0) {
                              setSelectedContract(contract);
                              setIsSitePhotosOpen(true);
                            }
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
                        <Eye className="h-4 w-4 mr-2" />
                        {t({ en: 'View Detail', mr: 'तपशील पहा' })}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="border-gray-300"
                        onClick={() => {
                          if (contract.sitePhotos && contract.sitePhotos.length > 0) {
                            setSelectedContract(contract);
                            setIsSitePhotosOpen(true);
                          } else {
                            // Show a message if no photos available
                            alert(t({ en: 'No site photos available', mr: 'साइट फोटो उपलब्ध नाहीत' }));
                          }
                        }}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {t({ en: 'Site Photos', mr: 'साइट फोटो' })}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </div>
        </section>

        {/* Completed Contracts Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-8 bg-blue-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t({ en: 'Completed Contracts', mr: 'पूर्ण झालेले कंत्राटे' })}
            </h2>
            <Badge className="bg-blue-500 text-white">{loading ? '...' : completedContracts.length}</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500">Loading completed contracts...</div>
              </div>
            ) : completedContracts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500">No completed contracts found</div>
              </div>
            ) : (
              completedContracts.map((contract, index) => (
              <Card key={contract.id} className="border-0 shadow-xl glass-effect hover-lift animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative">
                  <ImageWithFallback
                    src={contract.finalPhotos?.[0] || contract.finalPhoto || contract.sitePhotos?.[0] || '/api/placeholder/400/200'}
                    alt={t(contract.title)}
                    className="w-full h-48 object-cover rounded-t-lg"
                    fallbackSrc="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=200&fit=crop"
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
              ))
            )}
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
                    <p className="text-gray-600">{t(selectedContract.description || { en: 'No description available', mr: 'वर्णन उपलब्ध नाही' })}</p>
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
                      <p className="font-medium">{t(selectedContract.contactName || { en: 'N/A', mr: 'N/A' })}</p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {selectedContract.contactPhone || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">{t({ en: 'Tender Notice', mr: 'निविदा सूचना' })}</h4>
                    <div className="space-y-2">
                      {selectedContract.tenderNoticeUrl ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = selectedContract.tenderNoticeUrl;
                            link.target = '_blank';
                            link.click();
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {t({ en: 'Download Tender Notice (PDF)', mr: 'निविदा सूचना डाउनलोड करा (PDF)' })}
                        </Button>
                      ) : (
                        <p className="text-gray-500 text-sm">{t({ en: 'No tender notice available', mr: 'निविदा सूचना उपलब्ध नाही' })}</p>
                      )}
                      
                      {selectedContract.tenderDocuments?.length > 0 && (
                        <>
                          <h5 className="font-medium mt-4 mb-2">{t({ en: 'Additional Documents', mr: 'अतिरिक्त कागदपत्रे' })}</h5>
                          {selectedContract.tenderDocuments.map((doc, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                        >
                          <Download className="h-4 w-4 mr-2" />
                              {doc.name || doc}
                        </Button>
                      ))}
                        </>
                      )}
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

      {/* Project Detail Dialog for Ongoing Contracts */}
      <Dialog open={isProgressOpen} onOpenChange={setIsProgressOpen}>
        <DialogContent className="max-w-[98vw] w-[98vw] max-h-[95vh] h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{t({ en: 'Project Details', mr: 'प्रकल्प तपशील' })}</DialogTitle>
          </DialogHeader>

          {selectedContract && 'progress' in selectedContract && (
            <div className="space-y-8">
              {/* Project Header */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Side - Title and Status */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-orange-500 text-white text-lg px-4 py-2">
                        {t({ en: 'Ongoing Project', mr: 'चालू प्रकल्प' })}
                      </Badge>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">{t(selectedContract.title)}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{t(selectedContract.department)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{t({ en: 'Tender Issued', mr: 'निविदा जारी' })}: {formatDate(selectedContract.issueDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{t({ en: 'Tender Deadline', mr: 'निविदा मुदत' })}: {formatDate(selectedContract.lastDate)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Side - Progress */}
                  <div className="flex flex-col items-end">
              <div className="text-center">
                      <div className="text-5xl font-bold text-orange-600 mb-2">{selectedContract.progress}%</div>
                      <div className="text-gray-600 text-lg">{t({ en: 'Complete', mr: 'पूर्ण' })}</div>
                </div>
                    <div className="w-full mt-4">
                      <Progress value={selectedContract.progress} className="h-4" />
                    </div>
                  </div>
              </div>

                {/* Current Phase Section */}
                <div className="mt-6 pt-6 border-t border-orange-200">
                  <h4 className="font-semibold text-gray-700 mb-2">{t({ en: 'Current Phase', mr: 'सध्याचा टप्पा' })}</h4>
                  <p className="text-lg text-gray-800">{t(selectedContract.currentPhase || { en: 'N/A', mr: 'N/A' })}</p>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Project Information */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Tender Information */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {t({ en: 'Tender Information', mr: 'निविदा माहिती' })}
                    </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                        <h5 className="font-semibold text-gray-700 mb-2">{t({ en: 'Original Budget', mr: 'मूळ बजेट' })}</h5>
                        <p className="text-xl font-bold text-blue-600">{formatCurrency(selectedContract.estimatedBudget)}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">{t({ en: 'Contact Person', mr: 'संपर्क व्यक्ती' })}</h5>
                        <div className="text-gray-600">
                          <p>{t(selectedContract.contactName)}</p>
                          <p className="text-sm text-gray-500">{selectedContract.contactPhone}</p>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">{t({ en: 'Tender Issue Date', mr: 'निविदा जारी दिनांक' })}</h5>
                        <p className="text-gray-600">{formatDate(selectedContract.issueDate)}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">{t({ en: 'Tender Deadline', mr: 'निविदा मुदत' })}</h5>
                        <p className="text-gray-600">{formatDate(selectedContract.lastDate)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Project Information */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      {t({ en: 'Project Information', mr: 'प्रकल्प माहिती' })}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">{t({ en: 'Contractor', mr: 'कंत्राटदार' })}</h5>
                        <p className="text-gray-600">{t(selectedContract.contractor)}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">{t({ en: 'Budget Allocated', mr: 'वाटप केलेले बजेट' })}</h5>
                        <p className="text-2xl font-bold text-orange-600">{formatCurrency(selectedContract.allocatedBudget)}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">{t({ en: 'Start Date', mr: 'सुरुवात दिनांक' })}</h5>
                        <p className="text-gray-600">{formatDate(selectedContract.startDate)}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">{t({ en: 'Expected Completion', mr: 'अपेक्षित पूर्णता' })}</h5>
                        <p className="text-gray-600">{formatDate(selectedContract.expectedCompletionDate)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Section */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      {t({ en: 'Project Timeline', mr: 'प्रकल्प वेळापत्रक' })}
                    </h4>
                  <div className="space-y-4">
                      {selectedContract.timeline && selectedContract.timeline.length > 0 ? (
                        selectedContract.timeline.map((phase, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-l-4 border-l-orange-400">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              phase.completed ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {phase.completed ? (
                                <CheckCircle className="h-6 w-6" />
                          ) : (
                                <Clock className="h-6 w-6" />
                          )}
                        </div>
                        <div className="flex-1">
                              <div className="font-semibold text-gray-800 text-lg">{t(phase.phase)}</div>
                              <div className="text-gray-600 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {formatDate(phase.date)}
                              </div>
                        </div>
                        {phase.completed && (
                              <Badge className="bg-green-500 text-white px-3 py-1">
                            {t({ en: 'Completed', mr: 'पूर्ण' })}
                          </Badge>
                        )}
                      </div>
                        ))
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 italic">{t({ en: 'No timeline information available', mr: 'वेळापत्रक माहिती उपलब्ध नाही' })}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Site Photos Sidebar */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h4 className="font-bold text-lg mb-4 text-gray-800">{t({ en: 'Site Photos', mr: 'साइट फोटो' })}</h4>
                    {selectedContract.sitePhotos && selectedContract.sitePhotos.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          {selectedContract.sitePhotos.slice(0, 3).map((photo, index) => (
                            <ImageWithFallback
                              key={index}
                              src={photo}
                              alt={`${t(selectedContract.title)} - Photo ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                              onClick={() => {
                                setSelectedContract({...selectedContract, currentPhotoIndex: index});
                                setIsSitePhotosOpen(true);
                              }}
                            />
                    ))}
                  </div>
                        {selectedContract.sitePhotos.length > 3 && (
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {
                              setSelectedContract(selectedContract);
                              setIsSitePhotosOpen(true);
                            }}
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            {t({ en: `View All ${selectedContract.sitePhotos.length} Photos`, mr: `सर्व ${selectedContract.sitePhotos.length} फोटो पहा` })}
                          </Button>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-center py-8">{t({ en: 'No site photos available', mr: 'साइट फोटो उपलब्ध नाहीत' })}</p>
                    )}
                </div>

                  {/* Quick Stats */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      {t({ en: 'Quick Stats', mr: 'त्वरित आकडेवारी' })}
                    </h4>
                  <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="text-gray-700 font-medium">{t({ en: 'Days Remaining', mr: 'दिवस शिल्लक' })}</span>
                    </div>
                          <span className="text-2xl font-bold text-blue-600">
                            {selectedContract.expectedCompletionDate ? 
                              Math.max(0, Math.ceil((new Date(selectedContract.expectedCompletionDate) - new Date()) / (1000 * 60 * 60 * 24))) : 
                              'N/A'
                            }
                          </span>
                    </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-gray-700 font-medium">{t({ en: 'Budget Used', mr: 'वापरलेले बजेट' })}</span>
                          </div>
                          <span className="text-xl font-bold text-green-600">
                            {formatCurrency((selectedContract.allocatedBudget * selectedContract.progress) / 100)}
                          </span>
                      </div>
                    </div>
                    
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-orange-600" />
                            <span className="text-gray-700 font-medium">{t({ en: 'Budget Remaining', mr: 'बजेट शिल्लक' })}</span>
                    </div>
                          <span className="text-xl font-bold text-orange-600">
                            {formatCurrency((selectedContract.allocatedBudget * (100 - selectedContract.progress)) / 100)}
                          </span>
                  </div>
                </div>

                      {/* Budget Variance */}
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-purple-600" />
                            <span className="text-gray-700 font-medium">{t({ en: 'Budget Variance', mr: 'बजेट फरक' })}</span>
                          </div>
                          <span className={`text-xl font-bold ${selectedContract.allocatedBudget > selectedContract.estimatedBudget ? 'text-green-600' : selectedContract.allocatedBudget < selectedContract.estimatedBudget ? 'text-red-600' : 'text-gray-600'}`}>
                            {selectedContract.allocatedBudget > selectedContract.estimatedBudget ? '+' : ''}
                            {formatCurrency(selectedContract.allocatedBudget - selectedContract.estimatedBudget)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {t({ en: 'vs Original Budget', mr: 'मूळ बजेटच्या तुलनेत' })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
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
                    src={selectedContract.finalPhotos?.[0] || selectedContract.finalPhoto || selectedContract.sitePhotos?.[0] || '/api/placeholder/400/200'}
                    alt={t(selectedContract.title)}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                    fallbackSrc="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=200&fit=crop"
                  />
                  
                  {/* Additional final photos if available */}
                  {selectedContract.finalPhotos && selectedContract.finalPhotos.length > 1 && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {selectedContract.finalPhotos.slice(1, 5).map((photo, index) => (
                        <ImageWithFallback
                          key={index}
                          src={photo}
                          alt={`${t(selectedContract.title)} - Final Photo ${index + 2}`}
                          className="w-full h-20 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => window.open(photo, '_blank')}
                          fallbackSrc="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&h=100&fit=crop"
                        />
                      ))}
                    </div>
                  )}
                  
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
                      {selectedContract.deliverables?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                          <span className="font-medium">{t(item.item)}</span>
                          <span className="text-blue-600 font-bold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    {selectedContract.completionReportUrl ? (
                      <Button 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = selectedContract.completionReportUrl;
                          link.target = '_blank';
                          link.click();
                        }}
                      >
                      <Download className="h-4 w-4 mr-2" />
                      {t({ en: 'Download Full Report', mr: 'संपूर्ण अहवाल डाउनलोड करा' })}
                    </Button>
                    ) : (
                      <p className="text-gray-500 text-center">{t({ en: 'No completion report available', mr: 'पूर्णता अहवाल उपलब्ध नाही' })}</p>
                    )}
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

      {/* Site Photos Modal */}
      <Dialog open={isSitePhotosOpen} onOpenChange={setIsSitePhotosOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{t({ en: 'Site Photos', mr: 'साइट फोटो' })}</DialogTitle>
          </DialogHeader>

          {selectedContract && selectedContract.sitePhotos && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900">{t(selectedContract.title)}</h3>
                <p className="text-gray-600">{t({ en: `${selectedContract.sitePhotos.length} photos available`, mr: `${selectedContract.sitePhotos.length} फोटो उपलब्ध` })}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedContract.sitePhotos.map((photo, index) => (
                  <div key={index} className="group relative">
                    <ImageWithFallback
                      src={photo}
                      alt={`${t(selectedContract.title)} - Photo ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => {
                        // Open full screen view
                        window.open(photo, '_blank');
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => window.open(photo, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {t({ en: 'View Full Size', mr: 'पूर्ण आकार पहा' })}
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-sm text-gray-500">{t({ en: `Photo ${index + 1}`, mr: `फोटो ${index + 1}` })}</span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedContract.sitePhotos.length === 0 && (
                <div className="text-center py-12">
                  <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t({ en: 'No site photos available', mr: 'साइट फोटो उपलब्ध नाहीत' })}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsSitePhotosOpen(false)}>
              {t({ en: 'Close', mr: 'बंद करा' })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}