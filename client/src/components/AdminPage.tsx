import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { useLanguage } from './LanguageProvider';
import { ContractsManagement } from './ContractsManagement';
import { ContractsContentManager } from './ContractsContentManager';
import { AdminContractsTab } from './AdminContractsTab';
import { AdminNavButton } from './AdminNavButton';
import { AdminFloatingContractsButton } from './AdminFloatingContractsButton';
import { 
  adminGetAllVillagers,
  adminAddNewVillager,
  adminUpdateStatus,
  adminUpdateVillager,
  adminExportCsv
} from '../services/villagerService';
import { formatDateForAPI } from '../utils/dateUtils';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { 
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Home,
  CreditCard,
  ArrowLeft,
  Upload,
  Search,
  Filter,
  FileText,
  CheckCircle,
  AlertTriangle,
  Download,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Clock,
  XCircle,
  Phone,
  Mail,
  User,
  UserCheck,
  Calendar,
  MapPin,
  Settings,
  Camera,
  Video,
  Image,
  Play,
  Grid3X3,
  List,
  Tag,
  Heart,
  Share2,
  Star,
  Newspaper,
  Megaphone,
  Zap,
  Droplets,
  Construction,
  Bell,
  Info,
  FileBarChart,
  TrendingUp,
  Target,
  Building,
  Badge as BadgeIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon
} from 'lucide-react';

export function AdminPage() {
  const { t } = useLanguage();
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('villagers');
  const fileInputRef = useRef(null);


  // Villager management states (dynamic)
  const [villagers, setVillagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVillager, setEditingVillager] = useState(null);

  // Summary stats for villager cards
  const getVillagerStats = () => {
    return {
      totalApproved: villagers.filter(v => v.status === 'Approved').length,
      pending: villagers.filter(v => v.status === 'Pending').length,
      male: villagers.filter(v => v.status === 'Approved' && v.gender === 'Male').length,
      female: villagers.filter(v => v.status === 'Approved' && v.gender === 'Female').length,
      other: villagers.filter(v => v.status === 'Approved' && v.gender === 'Other').length
    };
  };

  // Function to navigate to contracts management
  const handleContractsNavigation = () => {
    window.location.href = '/admin/contracts';
  };

  // Fetch villagers data
  const fetchVillagers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
      
      const response = await adminGetAllVillagers(params);
      if (response.success) {
        setVillagers(response.data);
      }
    } catch (error) {
      console.error('Error fetching villagers:', error);
      toast.error(t({ en: 'Failed to fetch villagers', mr: 'गावकऱ्यांची माहिती मिळाली नाही' }));
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchVillagers();
  }, [searchTerm, statusFilter]);

  // Handler functions
  const handleApprove = async (id) => {
    try {
      const response = await adminUpdateStatus(id, 'Approved');
      if (response.success) {
        toast.success(t({ en: 'Villager approved successfully', mr: 'गावकरी यशस्वीरित्या मंजूर झाला' }));
        fetchVillagers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error approving villager:', error);
      toast.error(t({ en: 'Failed to approve villager', mr: 'गावकरी मंजूर करण्यात अयशस्वी' }));
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await adminUpdateStatus(id, 'Rejected');
      if (response.success) {
        toast.success(t({ en: 'Villager rejected successfully', mr: 'गावकरी यशस्वीरित्या नाकारला' }));
        fetchVillagers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error rejecting villager:', error);
      toast.error(t({ en: 'Failed to reject villager', mr: 'गावकरी नाकारण्यात अयशस्वी' }));
    }
  };

  const handleOpenEditModal = (villager) => {
    setEditingVillager(villager);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditingVillager({
      fullName: '',
      mobileNumber: '',
      gender: '',
      dateOfBirth: '',
      aadharNumber: '',
      idProofPhoto: 'https://via.placeholder.com/300x200?text=ID+Proof',
      address: ''
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare villager data with properly formatted date
      const villagerData = {
        ...editingVillager,
        dateOfBirth: formatDateForAPI(editingVillager.dateOfBirth)
      };
      
      let response;
      if (editingVillager._id) {
        // Update existing villager
        response = await adminUpdateVillager(editingVillager._id, villagerData);
      } else {
        // Add new villager
        response = await adminAddNewVillager(villagerData);
      }
      
      if (response.success) {
        toast.success(t({ 
          en: editingVillager._id ? 'Villager updated successfully' : 'Villager added successfully',
          mr: editingVillager._id ? 'गावकरी यशस्वीरित्या अद्ययावत झाला' : 'गावकरी यशस्वीरित्या जोडला'
        }));
        setIsModalOpen(false);
        setEditingVillager(null);
        fetchVillagers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error saving villager:', error);
      toast.error(t({ en: 'Failed to save villager', mr: 'गावकरी सेव्ह करण्यात अयशस्वी' }));
    }
  };

  const handleExportCsv = async () => {
    try {
      await adminExportCsv();
      toast.success(t({ en: 'CSV exported successfully', mr: 'CSV यशस्वीरित्या एक्सपोर्ट झाला' }));
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error(t({ en: 'Failed to export CSV', mr: 'CSV एक्सपोर्ट करण्यात अयशस्वी' }));
    }
  };


  const handleInputChange = (field, value) => {
    setEditingVillager(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Home content management states
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [currentContentItem, setCurrentContentItem] = useState(null);
  const [contentFormData, setContentFormData] = useState({});

  const [heroContent, setHeroContent] = useState({
    mainImage: 'https://images.unsplash.com/photo-1655974239313-5ab1747a002e',
    title: { en: 'Welcome to Rampur Village', mr: 'रामपूर गावात आपले स्वागत आहे' },
    subtitle: { 
      en: 'A progressive smart village embracing technology for sustainable living and digital governance',
      mr: 'शाश्वत जीवन आणि डिजिटल गव्हर्नन्ससाठी तंत्रज्ञानाचा अवलंब करणारे प्रगतिशील स्मार्ट गाव'
    }
  });

  const [statistics, setStatistics] = useState([
    { id: 1, label: { en: 'Total Population', mr: 'एकूण लोकसंख्या' }, value: '3,247', icon: 'Users' },
    { id: 2, label: { en: 'Households', mr: 'कुटुंबे' }, value: '823', icon: 'Home' },
    { id: 3, label: { en: 'Area (Hectares)', mr: 'क्षेत्रफळ (हेक्टर)' }, value: '1,250', icon: 'TreePine' },
    { id: 4, label: { en: 'Literacy Rate', mr: 'साक्षरता दर' }, value: '78%', icon: 'GraduationCap' }
  ]);

  const [facilities, setFacilities] = useState([
    {
      id: 1,
      name: { en: 'Primary School', mr: 'प्राथमिक शाळा' },
      description: { en: 'Modern educational facility with smart classrooms', mr: 'स्मार्ट वर्गखोल्यांसह आधुनिक शैक्षणिक सुविधा' },
      icon: 'GraduationCap'
    },
    {
      id: 2,
      name: { en: 'Health Center', mr: 'आरोग्य केंद्र' },
      description: { en: '24/7 primary healthcare services', mr: '२४/७ प्राथमिक आरोग्य सेवा' },
      icon: 'Heart'
    },
    {
      id: 3,
      name: { en: 'Solar Grid', mr: 'सौर ग्रिड' },
      description: { en: 'Renewable energy with 80% solar coverage', mr: '८०% सौर कव्हरेजसह नवीकरणीय ऊर्जा' },
      icon: 'Zap'
    },
    {
      id: 4,
      name: { en: 'Water System', mr: 'जल प्रणाली' },
      description: { en: 'Smart water management and purification', mr: 'स्मार्ट जल व्यवस्थापन आणि शुद्धीकरण' },
      icon: 'Droplets'
    }
  ]);

  const [developments, setDevelopments] = useState([
    {
      id: 1,
      title: { en: 'Digital Infrastructure Upgrade', mr: 'डिजिटल पायाभूत सुविधा सुधारणा' },
      date: '15 Jan 2024',
      category: { en: 'Technology', mr: 'तंत्रज्ञान' },
      image: 'https://images.unsplash.com/photo-1655974239313-5ab1747a002e'
    },
    {
      id: 2,
      title: { en: 'Community Health Program', mr: 'सामुदायिक आरोग्य कार्यक्रम' },
      date: '12 Jan 2024',
      category: { en: 'Health', mr: 'आरोग्य' },
      image: 'https://images.unsplash.com/photo-1740477138822-906f6b845579'
    }
  ]);

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: { en: 'Best Digital Village 2023', mr: 'सर्वोत्तम डिजिटल गाव २०२३' },
      description: { en: 'State Government Recognition', mr: 'राज्य सरकार मान्यता' },
      icon: '🏆'
    },
    {
      id: 2,
      title: { en: 'Clean Village Award', mr: 'स्वच्छ गाव पुरस्कार' },
      description: { en: 'District Level Achievement', mr: 'जिल्हा स्तरीय उपलब्धी' },
      icon: '🌟'
    }
  ]);

  const [footerContent, setFooterContent] = useState({
    address: {
      en: 'Village Panchayat Office\nMain Road, Rampur\nDist. Pune - 412345',
      mr: 'ग्राम पंचायत कार्यालय\nमुख्य रस्ता, रामपूर\nजि. पुणे - ४१२३४५'
    },
    phone: '+91 20 1234 5678',
    email: 'rampur.panchayat@gov.in',
    officeHours: {
      en: 'Monday - Friday\n9:00 AM - 5:00 PM\nSaturday: 9:00 AM - 1:00 PM',
      mr: 'सोमवार - शुक्रवार\n९:०० AM - ५:०० PM\nशनिवार: ९:०० AM - १:०० PM'
    }
  });

  // Tax management states
  const [taxRecords, setTaxRecords] = useState([
    {
      id: 'TAX001',
      houseNumber: 'H-101',
      ownerName: 'राम शंकर पाटील',
      taxType: 'Property Tax',
      amountDue: 5000,
      status: 'Pending',
      dueDate: '2024-03-31',
      createdDate: '2024-01-15',
      paidDate: null,
      receiptNumber: null
    },
    {
      id: 'TAX002',
      houseNumber: 'H-102',
      ownerName: 'सुनीता रामेश देशमुख',
      taxType: 'Water Tax',
      amountDue: 1200,
      status: 'Paid',
      dueDate: '2024-03-31',
      createdDate: '2024-01-15',
      paidDate: '2024-01-20',
      receiptNumber: 'RCP001'
    },
    {
      id: 'TAX003',
      houseNumber: 'H-103',
      ownerName: 'मोहन कुमार शर्मा',
      taxType: 'Trade License',
      amountDue: 3000,
      status: 'Pending',
      dueDate: '2024-02-28',
      createdDate: '2024-01-10',
      paidDate: null,
      receiptNumber: null
    },
    {
      id: 'TAX004',
      houseNumber: 'H-104',
      ownerName: 'अनिता विजय कुलकर्णी',
      taxType: 'Property Tax',
      amountDue: 7500,
      status: 'Overdue',
      dueDate: '2024-01-31',
      createdDate: '2023-12-01',
      paidDate: null,
      receiptNumber: null
    },
    {
      id: 'TAX005',
      houseNumber: 'H-105',
      ownerName: 'विकास अशोक गायकवाड',
      taxType: 'Water Tax',
      amountDue: 1500,
      status: 'Paid',
      dueDate: '2024-03-31',
      createdDate: '2024-01-12',
      paidDate: '2024-01-25',
      receiptNumber: 'RCP002'
    }
  ]);

  // Tax management UI states
  const [taxStatusFilter, setTaxStatusFilter] = useState('All');
  const [taxTypeFilter, setTaxTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isAddRecordDialogOpen, setIsAddRecordDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  // Grievance management states
  const [grievances, setGrievances] = useState([
    {
      id: 'GRV001',
      title: 'Street Light Not Working',
      titleMr: 'रस्ता दिवा काम करत नाही',
      category: 'Infrastructure',
      categoryMr: 'पायाभूत सुविधा',
      description: 'The street light near temple is not working since 3 days',
      descriptionMr: 'मंदिराजवळील रस्ता दिवा ३ दिवसांपासून काम करत नाही',
      submittedBy: 'राम पाटील',
      mobile: '+91 9876543210',
      address: 'गल्ली नंबर ५',
      priority: 'high',
      status: 'pending',
      adminStatus: 'unapproved', // New field for admin approval
      submissionDate: '2024-01-10',
      assignedWorker: null,
      response: null,
      photos: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96']
    },
    {
      id: 'GRV002',
      title: 'Water Supply Issue',
      titleMr: 'पाणीपुरवठ्याची समस्या',
      category: 'Water',
      categoryMr: 'पाणी',
      description: 'Irregular water supply in ward 3',
      descriptionMr: 'वार्ड ३ मध्ये अनियमित पाणीपुरवठा',
      submittedBy: 'सुनीता देशमुख',
      mobile: '+91 9876543211',
      address: 'मुख्य रस्ता',
      priority: 'urgent',
      status: 'in-progress',
      adminStatus: 'approved',
      submissionDate: '2024-01-08',
      assignedWorker: 'WRK001',
      response: 'Water connection team has been notified',
      photos: []
    },
    {
      id: 'GRV003',
      title: 'Road Repair Needed',
      titleMr: 'रस्ता दुरुस्तीची गरज',
      category: 'Roads',
      categoryMr: 'रस्ते',
      description: 'Main road has potholes causing inconvenience',
      descriptionMr: 'मुख्य रस्त्यावर खड्डे असल्यामुळे अडचण होत आहे',
      submittedBy: 'मोहन शर्मा',
      mobile: '+91 9876543212',
      address: 'शिवाजी चौक',
      priority: 'normal',
      status: 'resolved',
      adminStatus: 'approved',
      submissionDate: '2024-01-05',
      assignedWorker: 'WRK002',
      response: 'Road repair work completed successfully',
      photos: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96']
    }
  ]);

  const [workers, setWorkers] = useState([
    {
      id: 'WRK001',
      name: 'सुरेश जादव',
      department: 'Water & Sanitation',
      departmentMr: 'पाणी आणि स्वच्छता',
      phone: '+91 9876501235',
      email: 'suresh.jadav@rampur.gov.in',
      specialization: 'Water Supply Management',
      status: 'active'
    },
    {
      id: 'WRK002',
      name: 'अनिल पवार',
      department: 'Roads & Transportation',
      departmentMr: 'रस्ते आणि वाहतूक',
      phone: '+91 9876501236',
      email: 'anil.pawar@rampur.gov.in',
      specialization: 'Road Maintenance',
      status: 'active'
    },
    {
      id: 'WRK003',
      name: 'विजय इंजिनीअर',
      department: 'Electricity',
      departmentMr: 'वीज विभाग',
      phone: '+91 9876501234',
      email: 'vijay.engineer@rampur.gov.in',
      specialization: 'Electrical Systems',
      status: 'active'
    }
  ]);

  // Grievance management UI states
  const [grievanceSearchTerm, setGrievanceSearchTerm] = useState('');
  const [grievanceStatusFilter, setGrievanceStatusFilter] = useState('All');
  const [grievanceAdminStatusFilter, setGrievanceAdminStatusFilter] = useState('All');
  const [grievanceCategoryFilter, setGrievanceCategoryFilter] = useState('All');
  const [grievanceCurrentPage, setGrievanceCurrentPage] = useState(1);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [isGrievanceDetailOpen, setIsGrievanceDetailOpen] = useState(false);
  const [isWorkerManagementOpen, setIsWorkerManagementOpen] = useState(false);
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [newWorker, setNewWorker] = useState({
    name: '',
    department: '',
    departmentMr: '',
    phone: '',
    email: '',
    specialization: ''
  });

  // Villager management UI states
  const [villagerSearchTerm, setVillagerSearchTerm] = useState('');
  const [villagerStatusFilter, setVillagerStatusFilter] = useState('All');
  const [villagerRequestTypeFilter, setVillagerRequestTypeFilter] = useState('All');
  const [villagerGenderFilter, setVillagerGenderFilter] = useState('All');
  const [villagerCurrentPage, setVillagerCurrentPage] = useState(1);
  const [selectedVillager, setSelectedVillager] = useState(null);
  const [isVillagerDetailOpen, setIsVillagerDetailOpen] = useState(false);
  const [isAddVillagerOpen, setIsAddVillagerOpen] = useState(false);
  const [newVillager, setNewVillager] = useState({
    fullName: '',
    address: '',
    mobile: '',
    gender: '',
    dateOfBirth: '',
    aadharNumber: '',
    idProofPhoto: null
  });

  // Committee management states
  const [committeeMembers, setCommitteeMembers] = useState([
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
      photo: 'https://images.unsplash.com/photo-1667564790635-0f560121359e',
      color: 'bg-purple-500',
      isActive: true,
      joinDate: '2020-01-15',
      termEnd: '2025-01-15'
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
      photo: null,
      color: 'bg-blue-500',
      isActive: true,
      joinDate: '2021-06-10',
      termEnd: '2025-06-10'
    }
  ]);

  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: { en: 'Revenue Department', mr: 'महसूल विभाग' },
      head: { en: 'Shri Anil Khade', mr: 'श्री अनिल खडे' },
      phone: '+91 9876543215',
      email: 'revenue.rampur@gov.in',
      services: [
        { en: 'Land Records', mr: 'जमीन नोंदी' },
        { en: 'Property Tax', mr: 'मालमत्ता कर' },
        { en: 'Revenue Certificates', mr: 'महसूल प्रमाणपत्रे' }
      ],
      isActive: true
    },
    {
      id: 2,
      name: { en: 'Development Department', mr: 'विकास विभाग' },
      head: { en: 'Smt. Priya Kulkarni', mr: 'श्रीमती प्रिया कुलकर्णी' },
      phone: '+91 9876543216',
      email: 'development.rampur@gov.in',
      services: [
        { en: 'Infrastructure Projects', mr: 'पायाभूत सुविधा प्रकल्प' },
        { en: 'Road Maintenance', mr: 'रस्ता देखभाल' },
        { en: 'Public Facilities', mr: 'सार्वजनिक सुविधा' }
      ],
      isActive: true
    }
  ]);

  const [officeInfo, setOfficeInfo] = useState({
    address: {
      en: 'Village Panchayat Building\nMain Road, Rampur\nTaluka: Pune, District: Pune\nMaharashtra - 412345',
      mr: 'ग्राम पंचायत इमारत\nमुख्य रस्ता, रामपूर\nतालुका: पुणे, जिल्हा: पुणे\nमहाराष्ट्र - ४१२३४५'
    },
    phone: '+91 20 1234 5678',
    email: 'office.rampur@gov.in',
    emergencyContact: '+91 9876543210',
    publicMeeting: {
      en: 'Every first Monday of the month at 10:00 AM',
      mr: 'दर महिन्याच्या पहिल्या सोमवारी सकाळी १०:०० वाजता'
    }
  });

  const [officeHours, setOfficeHours] = useState([
    { day: { en: 'Monday', mr: 'सोमवार' }, hours: '9:00 AM - 5:00 PM', available: true },
    { day: { en: 'Tuesday', mr: 'मंगळवार' }, hours: '9:00 AM - 5:00 PM', available: true },
    { day: { en: 'Wednesday', mr: 'बुधवार' }, hours: '9:00 AM - 5:00 PM', available: true },
    { day: { en: 'Thursday', mr: 'गुरुवार' }, hours: '9:00 AM - 5:00 PM', available: true },
    { day: { en: 'Friday', mr: 'शुक्रवार' }, hours: '9:00 AM - 5:00 PM', available: true },
    { day: { en: 'Saturday', mr: 'शनिवार' }, hours: '9:00 AM - 1:00 PM', available: true },
    { day: { en: 'Sunday', mr: 'रविवार' }, hours: 'Closed', available: false }
  ]);

  // Committee management UI states
  const [selectedCommitteeMember, setSelectedCommitteeMember] = useState(null);
  const [isCommitteeMemberDetailOpen, setIsCommitteeMemberDetailOpen] = useState(false);
  const [isAddCommitteeMemberOpen, setIsAddCommitteeMemberOpen] = useState(false);
  const [isEditCommitteeMemberOpen, setIsEditCommitteeMemberOpen] = useState(false);
  const [isDepartmentManagementOpen, setIsDepartmentManagementOpen] = useState(false);
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [isOfficeInfoEditOpen, setIsOfficeInfoEditOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [newCommitteeMember, setNewCommitteeMember] = useState({
    name: { en: '', mr: '' },
    position: { en: '', mr: '' },
    ward: '',
    phone: '',
    email: '',
    experience: { en: '', mr: '' },
    education: { en: '', mr: '' },
    achievements: [],
    photo: null,
    color: 'bg-blue-500',
    joinDate: '',
    termEnd: ''
  });
  const [newDepartment, setNewDepartment] = useState({
    name: { en: '', mr: '' },
    head: { en: '', mr: '' },
    phone: '',
    email: '',
    services: []
  });

  // Media management states
  const [mediaItems, setMediaItems] = useState([
    {
      id: 1,
      type: 'photo',
      title: { en: 'Ganesh Festival Celebration', mr: 'गणेश उत्सव साजरा' },
      description: { en: 'Annual Ganesh festival celebrated with great enthusiasm', mr: 'वार्षिक गणेश उत्सव मोठ्या उत्साहाने साजरा केला' },
      url: 'https://images.unsplash.com/photo-1745988583865-2249654d864c',
      thumbnail: 'https://images.unsplash.com/photo-1745988583865-2249654d864c',
      category: 'festivals',
      tags: ['festival', 'ganesh', 'celebration'],
      date: '2024-08-25',
      uploadDate: '2024-08-26',
      views: 245,
      likes: 32,
      fileSize: '2.3 MB',
      dimensions: '1920x1080',
      isActive: true,
      isFeatured: true,
      uploadedBy: 'admin'
    },
    {
      id: 2,
      type: 'photo',
      title: { en: 'New Road Construction', mr: 'नवीन रस्ता बांधकाम' },
      description: { en: 'Construction of new concrete road connecting to main highway', mr: 'मुख्य महामार्गाला जोडणारा नवीन काँक्रीट रस्ता बांधकाम' },
      url: 'https://images.unsplash.com/photo-1683633570715-dce2fd5dfe90',
      thumbnail: 'https://images.unsplash.com/photo-1683633570715-dce2fd5dfe90',
      category: 'development',
      tags: ['development', 'road', 'construction'],
      date: '2024-07-15',
      uploadDate: '2024-07-16',
      views: 189,
      likes: 28,
      fileSize: '1.8 MB',
      dimensions: '1920x1080',
      isActive: true,
      isFeatured: false,
      uploadedBy: 'admin'
    },
    {
      id: 3,
      type: 'video',
      title: { en: 'Village Development Documentary', mr: 'गाव विकास माहितीपट' },
      description: { en: '10-minute documentary showcasing village transformation', mr: 'गावातील परिवर्तन दाखवणारा १० मिनिटांचा माहितीपट' },
      url: 'https://example.com/video1.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1683633570715-dce2fd5dfe90',
      category: 'development',
      tags: ['documentary', 'development', 'transformation'],
      date: '2024-07-20',
      uploadDate: '2024-07-21',
      views: 1240,
      likes: 89,
      duration: '10:23',
      fileSize: '85.4 MB',
      resolution: '1920x1080',
      isActive: true,
      isFeatured: true,
      uploadedBy: 'admin'
    }
  ]);

  const [mediaCategories, setMediaCategories] = useState([
    { id: 'festivals', label: { en: 'Festivals', mr: 'सण-उत्सव' }, count: 15 },
    { id: 'development', label: { en: 'Development', mr: 'विकास' }, count: 12 },
    { id: 'education', label: { en: 'Education', mr: 'शिक्षण' }, count: 8 },
    { id: 'agriculture', label: { en: 'Agriculture', mr: 'शेती' }, count: 10 },
    { id: 'events', label: { en: 'Events', mr: 'कार्यक्रम' }, count: 3 }
  ]);

  // Media management UI states
  const [mediaSearchTerm, setMediaSearchTerm] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('All');
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState('All');
  const [mediaStatusFilter, setMediaStatusFilter] = useState('All');
  const [mediaCurrentPage, setMediaCurrentPage] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isMediaDetailOpen, setIsMediaDetailOpen] = useState(false);
  const [isAddMediaOpen, setIsAddMediaOpen] = useState(false);
  const [isEditMediaOpen, setIsEditMediaOpen] = useState(false);
  const [isCategoryManagementOpen, setIsCategoryManagementOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mediaViewMode, setMediaViewMode] = useState('grid');
  const [newMediaItem, setNewMediaItem] = useState({
    type: 'photo',
    title: { en: '', mr: '' },
    description: { en: '', mr: '' },
    category: '',
    tags: [],
    file: null,
    isFeatured: false
  });
  const [newMediaCategory, setNewMediaCategory] = useState({
    label: { en: '', mr: '' }
  });

  // News management states
  const [newsItems, setNewsItems] = useState([
    {
      id: 1,
      category: 'alerts',
      priority: 'high',
      title: { en: 'Water Supply Disruption Notice', mr: 'पाणी पुरवठा खंडित होण्याची सूचना' },
      content: { 
        en: 'Water supply will be disrupted on January 25th from 6 AM to 4 PM due to pipeline maintenance work. Residents are advised to store water in advance.',
        mr: 'पाइपलाइन देखभाल कामामुळे २५ जानेवारी सकाळी ६ ते दुपारी ४ वाजेपर्यंत पाणी पुरवठा खंडित राहील. रहिवाशांना आगाऊ पाणी साठवण्याचा सल्ला दिला जातो.'
      },
      summary: {
        en: 'Water disruption on Jan 25th from 6 AM to 4 PM',
        mr: '२५ जानेवारी सकाळी ६ ते दुपारी ४ वाजेपर्यंत पाणी खंडित'
      },
      date: '2024-01-22',
      time: '09:30 AM',
      publishDate: '2024-01-22T09:30:00',
      expiryDate: '2024-01-26T00:00:00',
      isPublished: true,
      isFeatured: true,
      isBreaking: true,
      image: null,
      tags: ['water', 'maintenance', 'alert'],
      author: 'Admin',
      readCount: 245,
      iconType: 'Droplets',
      colorScheme: {
        text: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200'
      }
    },
    {
      id: 2,
      category: 'announcements',
      priority: 'medium',
      title: { en: 'Village Gram Sabha Meeting', mr: 'गाव ग्राम सभा बैठक' },
      content: { 
        en: 'Monthly Gram Sabha meeting scheduled for January 28th at 10 AM at the Village Panchayat Hall. All villagers are requested to attend.',
        mr: '२८ जानेवारी सकाळी १० वाजता गाव पंचायत हॉलमध्ये मासिक ग्राम सभा बैठक नियोजित आहे. सर्व गावकऱ्यांना उपस्थित राहण्याची विनंती.'
      },
      summary: {
        en: 'Monthly Gram Sabha meeting on Jan 28th at 10 AM',
        mr: '२८ जानेवारी सकाळी १० वाजता मासिक ग्राम सभा बैठक'
      },
      date: '2024-01-20',
      time: '02:15 PM',
      publishDate: '2024-01-20T14:15:00',
      expiryDate: '2024-01-29T00:00:00',
      isPublished: true,
      isFeatured: false,
      isBreaking: false,
      image: 'https://images.unsplash.com/photo-1667564790635-0f560121359e',
      tags: ['meeting', 'gram-sabha', 'announcement'],
      author: 'Sarpanch Office',
      readCount: 156,
      iconType: 'Megaphone',
      colorScheme: {
        text: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200'
      }
    },
    {
      id: 3,
      category: 'utilities',
      priority: 'medium',
      title: { en: 'Electricity Maintenance Work', mr: 'वीज देखभाल कार्य' },
      content: { 
        en: 'Scheduled power outage on January 26th from 11 AM to 3 PM in Ward 2 and Ward 3 for transformer maintenance.',
        mr: 'ट्रान्सफॉर्मर देखभालीसाठी २६ जानेवारी सकाळी ११ ते दुपारी ३ वाजेपर्यंत वार्ड २ आणि वार्ड ३ मध्ये नियोजित वीज खंडित.'
      },
      summary: {
        en: 'Power outage on Jan 26th from 11 AM to 3 PM in Ward 2 & 3',
        mr: '२६ जानेवारी सकाळी ११ ते दुपारी ३ वार्ड २ आणि ३ मध्ये वीज खंडित'
      },
      date: '2024-01-19',
      time: '11:00 AM',
      publishDate: '2024-01-19T11:00:00',
      expiryDate: '2024-01-27T00:00:00',
      isPublished: true,
      isFeatured: false,
      isBreaking: false,
      image: null,
      tags: ['electricity', 'maintenance', 'ward2', 'ward3'],
      author: 'Electricity Department',
      readCount: 98,
      iconType: 'Zap',
      colorScheme: {
        text: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200'
      }
    }
  ]);

  const [newsCategories, setNewsCategories] = useState([
    { id: 'announcements', label: { en: 'Announcements', mr: 'घोषणा' }, icon: 'Megaphone', count: 5 },
    { id: 'events', label: { en: 'Events', mr: 'कार्यक्रम' }, icon: 'Calendar', count: 3 },
    { id: 'alerts', label: { en: 'Alerts', mr: 'सूचना' }, icon: 'AlertTriangle', count: 2 },
    { id: 'utilities', label: { en: 'Utilities', mr: 'सुविधा' }, icon: 'Zap', count: 4 },
    { id: 'general', label: { en: 'General News', mr: 'सामान्य बातम्या' }, icon: 'Newspaper', count: 6 }
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      date: '28',
      month: 'Jan',
      year: '2024',
      title: { en: 'Gram Sabha Meeting', mr: 'ग्राम सभा बैठक' },
      time: '10:00 AM',
      location: { en: 'Village Panchayat Hall', mr: 'गाव पंचायत हॉल' },
      description: { en: 'Monthly village meeting', mr: 'मासिक गाव बैठक' },
      isActive: true
    },
    {
      id: 2,
      date: '26',
      month: 'Jan', 
      year: '2024',
      title: { en: 'Republic Day', mr: 'प्रजासत्ताक दिन' },
      time: '08:00 AM',
      location: { en: 'Village Ground', mr: 'गाव मैदान' },
      description: { en: 'National celebration', mr: 'राष्ट्रीय सण' },
      isActive: true
    }
  ]);

  // News management UI states
  const [newsSearchTerm, setNewsSearchTerm] = useState('');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState('All');
  const [newsPriorityFilter, setNewsPriorityFilter] = useState('All');
  const [newsStatusFilter, setNewsStatusFilter] = useState('All');
  const [newsCurrentPage, setNewsCurrentPage] = useState(1);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isNewsDetailOpen, setIsNewsDetailOpen] = useState(false);
  const [isAddNewsOpen, setIsAddNewsOpen] = useState(false);
  const [isEditNewsOpen, setIsEditNewsOpen] = useState(false);
  const [isNewsPreviewOpen, setIsNewsPreviewOpen] = useState(false);
  const [isEventManagementOpen, setIsEventManagementOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isNewsCategoryManagementOpen, setIsNewsCategoryManagementOpen] = useState(false);
  const [isAddNewsCategoryOpen, setIsAddNewsCategoryOpen] = useState(false);
  const [newsViewMode, setNewsViewMode] = useState('grid');
  const [newNewsItem, setNewNewsItem] = useState({
    category: '',
    priority: 'medium',
    title: { en: '', mr: '' },
    content: { en: '', mr: '' },
    summary: { en: '', mr: '' },
    tags: [],
    image: null,
    isFeatured: false,
    isBreaking: false,
    publishDate: '',
    expiryDate: '',
    iconType: 'Newspaper'
  });
  const [newEvent, setNewEvent] = useState({
    title: { en: '', mr: '' },
    description: { en: '', mr: '' },
    location: { en: '', mr: '' },
    date: '',
    time: '',
    isActive: true
  });
  const [newNewsCategory, setNewNewsCategory] = useState({
    label: { en: '', mr: '' },
    icon: 'Newspaper'
  });

  // New record form state
  const [newRecord, setNewRecord] = useState({
    houseNumber: '',
    ownerName: '',
    taxType: '',
    amountDue: '',
    dueDate: ''
  });

  const recordsPerPage = 10;

  // Filter and search logic
  const filteredRecords = taxRecords.filter(record => {
    const matchesSearch = record.houseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = taxStatusFilter === 'All' || record.status === taxStatusFilter;
    const matchesType = taxTypeFilter === 'All' || record.taxType === taxTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + recordsPerPage);

  // Grievance filter and search logic
  const filteredGrievances = grievances.filter(grievance => {
    const matchesSearch = grievance.title.toLowerCase().includes(grievanceSearchTerm.toLowerCase()) ||
                         grievance.submittedBy.toLowerCase().includes(grievanceSearchTerm.toLowerCase()) ||
                         grievance.id.toLowerCase().includes(grievanceSearchTerm.toLowerCase());
    const matchesStatus = grievanceStatusFilter === 'All' || grievance.status === grievanceStatusFilter;
    const matchesAdminStatus = grievanceAdminStatusFilter === 'All' || grievance.adminStatus === grievanceAdminStatusFilter;
    const matchesCategory = grievanceCategoryFilter === 'All' || grievance.category === grievanceCategoryFilter;
    
    return matchesSearch && matchesStatus && matchesAdminStatus && matchesCategory;
  });

  // Grievance pagination logic
  const grievancesPerPage = 10;
  const totalGrievancePages = Math.ceil(filteredGrievances.length / grievancesPerPage);
  const grievanceStartIndex = (grievanceCurrentPage - 1) * grievancesPerPage;
  const paginatedGrievances = filteredGrievances.slice(grievanceStartIndex, grievanceStartIndex + grievancesPerPage);

  // Villager filter and search logic
  const filteredVillagers = villagers.filter(villager => {
    const matchesSearch = villager.fullName.toLowerCase().includes(villagerSearchTerm.toLowerCase()) ||
                         villager.mobile.includes(villagerSearchTerm) ||
                         villager.id.toLowerCase().includes(villagerSearchTerm.toLowerCase()) ||
                         villager.aadharNumber.includes(villagerSearchTerm);
    const matchesStatus = villagerStatusFilter === 'All' || villager.status === villagerStatusFilter;
    const matchesRequestType = villagerRequestTypeFilter === 'All' || villager.requestType === villagerRequestTypeFilter;
    const matchesGender = villagerGenderFilter === 'All' || villager.gender === villagerGenderFilter;
    
    return matchesSearch && matchesStatus && matchesRequestType && matchesGender;
  });

  // Villager pagination logic
  const villagersPerPage = 10;
  const totalVillagerPages = Math.ceil(filteredVillagers.length / villagersPerPage);
  const villagerStartIndex = (villagerCurrentPage - 1) * villagersPerPage;
  const paginatedVillagers = filteredVillagers.slice(villagerStartIndex, villagerStartIndex + villagersPerPage);

  // Villager statistics
  const villagerStats = {
    total: villagers.filter(v => v.status === 'approved').length,
    pending: villagers.filter(v => v.status === 'pending').length,
    male: villagers.filter(v => v.status === 'approved' && v.gender === 'male').length,
    female: villagers.filter(v => v.status === 'approved' && v.gender === 'female').length,
    other: villagers.filter(v => v.status === 'approved' && v.gender === 'other').length
  };

  // Media filter and search logic
  const filteredMedia = mediaItems.filter(media => {
    const matchesSearch = media.title.en.toLowerCase().includes(mediaSearchTerm.toLowerCase()) ||
                         media.title.mr.toLowerCase().includes(mediaSearchTerm.toLowerCase()) ||
                         media.tags.some(tag => tag.toLowerCase().includes(mediaSearchTerm.toLowerCase()));
    const matchesType = mediaTypeFilter === 'All' || media.type === mediaTypeFilter;
    const matchesCategory = mediaCategoryFilter === 'All' || media.category === mediaCategoryFilter;
    const matchesStatus = mediaStatusFilter === 'All' || 
                         (mediaStatusFilter === 'Active' && media.isActive) ||
                         (mediaStatusFilter === 'Inactive' && !media.isActive) ||
                         (mediaStatusFilter === 'Featured' && media.isFeatured);
    
    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  // Media pagination logic
  const mediaPerPage = 12;
  const totalMediaPages = Math.ceil(filteredMedia.length / mediaPerPage);
  const mediaStartIndex = (mediaCurrentPage - 1) * mediaPerPage;
  const paginatedMedia = filteredMedia.slice(mediaStartIndex, mediaStartIndex + mediaPerPage);

  // Media statistics
  const mediaStats = {
    total: mediaItems.length,
    photos: mediaItems.filter(m => m.type === 'photo').length,
    videos: mediaItems.filter(m => m.type === 'video').length,
    featured: mediaItems.filter(m => m.isFeatured).length,
    active: mediaItems.filter(m => m.isActive).length,
    totalViews: mediaItems.reduce((sum, m) => sum + m.views, 0),
    totalLikes: mediaItems.reduce((sum, m) => sum + m.likes, 0)
  };

  // News filter and search logic
  const filteredNews = newsItems.filter(news => {
    const matchesSearch = news.title.en.toLowerCase().includes(newsSearchTerm.toLowerCase()) ||
                         news.title.mr.toLowerCase().includes(newsSearchTerm.toLowerCase()) ||
                         news.content.en.toLowerCase().includes(newsSearchTerm.toLowerCase()) ||
                         news.tags.some(tag => tag.toLowerCase().includes(newsSearchTerm.toLowerCase()));
    const matchesCategory = newsCategoryFilter === 'All' || news.category === newsCategoryFilter;
    const matchesPriority = newsPriorityFilter === 'All' || news.priority === newsPriorityFilter;
    const matchesStatus = newsStatusFilter === 'All' || 
                         (newsStatusFilter === 'Published' && news.isPublished) ||
                         (newsStatusFilter === 'Draft' && !news.isPublished) ||
                         (newsStatusFilter === 'Featured' && news.isFeatured) ||
                         (newsStatusFilter === 'Breaking' && news.isBreaking);
    
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  // News pagination logic
  const newsPerPage = 10;
  const totalNewsPages = Math.ceil(filteredNews.length / newsPerPage);
  const newsStartIndex = (newsCurrentPage - 1) * newsPerPage;
  const paginatedNews = filteredNews.slice(newsStartIndex, newsStartIndex + newsPerPage);

  // News statistics
  const newsStats = {
    total: newsItems.length,
    published: newsItems.filter(n => n.isPublished).length,
    draft: newsItems.filter(n => !n.isPublished).length,
    featured: newsItems.filter(n => n.isFeatured).length,
    breaking: newsItems.filter(n => n.isBreaking).length,
    highPriority: newsItems.filter(n => n.priority === 'high').length,
    totalReads: newsItems.reduce((sum, n) => sum + n.readCount, 0),
    events: upcomingEvents.filter(e => e.isActive).length
  };

  // Helper functions
  const getStatusBadge = (status) => {
    const configs = {
      'Pending': { color: 'bg-orange-500 text-white', icon: AlertTriangle },
      'Paid': { color: 'bg-green-500 text-white', icon: CheckCircle },
      'Overdue': { color: 'bg-red-500 text-white', icon: AlertTriangle }
    };
    
    const config = configs[status] || configs['Pending'];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} border-0 flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus('Error: Please upload only Excel (.xlsx) or CSV files');
      return;
    }

    // Simulate file processing
    setUploadStatus('Processing file...');
    setTimeout(() => {
      setUploadStatus('Success: 15 new tax records have been uploaded and added to the database');
      // Here you would typically process the file and update taxRecords
    }, 2000);
  };

  const handleAddRecord = () => {
    if (!newRecord.houseNumber || !newRecord.ownerName || !newRecord.taxType || !newRecord.amountDue || !newRecord.dueDate) {
      alert('Please fill all required fields');
      return;
    }

    const record = {
      id: `TAX${String(Date.now()).slice(-3)}`,
      ...newRecord,
      amountDue: parseFloat(newRecord.amountDue),
      status: 'Pending',
      createdDate: new Date().toISOString().split('T')[0],
      paidDate: null,
      receiptNumber: null
    };

    setTaxRecords([...taxRecords, record]);
    setNewRecord({ houseNumber: '', ownerName: '', taxType: '', amountDue: '', dueDate: '' });
    setIsAddRecordDialogOpen(false);
  };

  const handleEditRecord = () => {
    if (!selectedRecord) return;
    
    setTaxRecords(taxRecords.map(record => 
      record.id === selectedRecord.id ? selectedRecord : record
    ));
    setIsEditDialogOpen(false);
    setSelectedRecord(null);
  };

  const handleMarkAsPaid = (record) => {
    const confirmed = window.confirm(`Mark tax record for ${record.ownerName} (${record.houseNumber}) as Paid?`);
    if (!confirmed) return;

    const receiptNumber = `RCP${String(Date.now()).slice(-6)}`;
    setTaxRecords(taxRecords.map(r => 
      r.id === record.id 
        ? { ...r, status: 'Paid', paidDate: new Date().toISOString().split('T')[0], receiptNumber }
        : r
    ));
  };

  const handleDeleteRecord = (record) => {
    const confirmed = window.confirm(`Are you sure you want to permanently delete this tax record for ${record.ownerName}? This action cannot be undone.`);
    if (!confirmed) return;

    setTaxRecords(taxRecords.filter(r => r.id !== record.id));
  };

  // Grievance management helper functions
  const getGrievanceStatusBadge = (status) => {
    const configs = {
      'pending': { color: 'bg-orange-500 text-white', icon: Clock },
      'in-progress': { color: 'bg-blue-500 text-white', icon: MessageSquare },
      'resolved': { color: 'bg-green-500 text-white', icon: CheckCircle },
      'rejected': { color: 'bg-red-500 text-white', icon: XCircle }
    };
    
    const config = configs[status] || configs['pending'];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} border-0 flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getAdminStatusBadge = (adminStatus) => {
    const configs = {
      'unapproved': { color: 'bg-gray-500 text-white', label: 'Unapproved' },
      'approved': { color: 'bg-green-500 text-white', label: 'Approved' },
      'rejected': { color: 'bg-red-500 text-white', label: 'Rejected' }
    };
    
    const config = configs[adminStatus] || configs['unapproved'];
    
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const configs = {
      'urgent': { color: 'bg-red-500 text-white', icon: AlertTriangle },
      'high': { color: 'bg-orange-500 text-white', icon: AlertTriangle },
      'normal': { color: 'bg-blue-500 text-white', icon: Clock },
      'low': { color: 'bg-gray-500 text-white', icon: Clock }
    };
    
    const config = configs[priority] || configs['normal'];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} border-0 flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const handleApproveGrievance = (grievance) => {
    const confirmed = window.confirm(`Approve grievance "${grievance.title}" by ${grievance.submittedBy}?`);
    if (!confirmed) return;

    setGrievances(grievances.map(g => 
      g.id === grievance.id ? { ...g, adminStatus: 'approved' } : g
    ));
  };

  const handleRejectGrievance = (grievance) => {
    const confirmed = window.confirm(`Reject grievance "${grievance.title}" by ${grievance.submittedBy}?`);
    if (!confirmed) return;

    setGrievances(grievances.map(g => 
      g.id === grievance.id ? { ...g, adminStatus: 'rejected', status: 'rejected' } : g
    ));
  };

  const handleAssignWorker = (grievanceId, workerId) => {
    setGrievances(grievances.map(g => 
      g.id === grievanceId ? { ...g, assignedWorker: workerId, status: 'in-progress' } : g
    ));
  };

  const handleUpdateGrievanceStatus = (grievanceId, newStatus) => {
    setGrievances(grievances.map(g => 
      g.id === grievanceId ? { ...g, status: newStatus } : g
    ));
  };

  const handleAddWorker = () => {
    if (!newWorker.name || !newWorker.department || !newWorker.phone) {
      alert('Please fill all required fields');
      return;
    }

    const worker = {
      id: `WRK${String(Date.now()).slice(-3)}`,
      ...newWorker,
      status: 'active'
    };

    setWorkers([...workers, worker]);
    setNewWorker({ name: '', department: '', departmentMr: '', phone: '', email: '', specialization: '' });
    setIsAddWorkerOpen(false);
  };

  const handleUpdateWorker = () => {
    if (!selectedWorker) return;
    
    setWorkers(workers.map(w => 
      w.id === selectedWorker.id ? selectedWorker : w
    ));
    setSelectedWorker(null);
  };

  // Villager management helper functions
  const getVillagerStatusBadge = (status) => {
    const configs = {
      'pending': { color: 'bg-orange-500 text-white', icon: Clock },
      'approved': { color: 'bg-green-500 text-white', icon: CheckCircle },
      'rejected': { color: 'bg-red-500 text-white', icon: XCircle }
    };
    
    const config = configs[status] || configs['pending'];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} border-0 flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRequestTypeBadge = (requestType) => {
    const configs = {
      'registration': { color: 'bg-blue-500 text-white', label: 'New Registration' },
      'edit': { color: 'bg-purple-500 text-white', label: 'Edit Request' }
    };
    
    const config = configs[requestType] || configs['registration'];
    
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  const handleApproveVillager = (villager) => {
    const confirmed = window.confirm(`Approve ${villager.requestType} for "${villager.fullName}"?`);
    if (!confirmed) return;

    const approvedDate = new Date().toISOString().split('T')[0];
    setVillagers(villagers.map(v => 
      v.id === villager.id ? { ...v, status: 'approved', approvedDate } : v
    ));
  };

  const handleRejectVillager = (villager) => {
    const reason = window.prompt(`Enter rejection reason for "${villager.fullName}"`);
    if (!reason) return;

    setVillagers(villagers.map(v => 
      v.id === villager.id ? { ...v, status: 'rejected', rejectionReason: reason } : v
    ));
  };

  const handleAddVillager = () => {
    if (!newVillager.fullName || !newVillager.mobile || !newVillager.gender || !newVillager.aadharNumber) {
      alert('Please fill all required fields');
      return;
    }

    const villager = {
      id: `V${String(Date.now()).slice(-3)}`,
      ...newVillager,
      status: 'approved',
      requestType: 'manual',
      submittedBy: 'admin',
      submissionDate: new Date().toISOString().split('T')[0],
      approvedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setVillagers([...villagers, villager]);
    setNewVillager({
      fullName: '',
      address: '',
      mobile: '',
      gender: '',
      dateOfBirth: '',
      aadharNumber: '',
      idProofPhoto: null
    });
    setIsAddVillagerOpen(false);
  };

  const exportVillagersToCSV = () => {
    const headers = [
      'ID', 'Full Name', 'Address', 'Mobile', 'Gender', 'Date of Birth', 
      'Aadhar Number', 'Status', 'Request Type', 'Submission Date', 'Approved Date'
    ];
    
    const csvContent = [
      headers.join(','),
      ...villagers.map(v => [
        v.id,
        `"${v.fullName}"`,
        `"${v.address}"`,
        v.mobile,
        v.gender,
        v.dateOfBirth,
        v.aadharNumber,
        v.status,
        v.requestType,
        v.submissionDate,
        v.approvedDate || ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `villagers_data_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Committee management helper functions
  const handleAddCommitteeMember = () => {
    if (!newCommitteeMember.name.en || !newCommitteeMember.position.en || !newCommitteeMember.phone) {
      alert('Please fill all required fields');
      return;
    }

    const member = {
      id: Date.now(),
      ...newCommitteeMember,
      isActive: true
    };

    setCommitteeMembers([...committeeMembers, member]);
    setNewCommitteeMember({
      name: { en: '', mr: '' },
      position: { en: '', mr: '' },
      ward: '',
      phone: '',
      email: '',
      experience: { en: '', mr: '' },
      education: { en: '', mr: '' },
      achievements: [],
      photo: null,
      color: 'bg-blue-500',
      joinDate: '',
      termEnd: ''
    });
    setIsAddCommitteeMemberOpen(false);
  };

  const handleUpdateCommitteeMember = () => {
    if (!selectedCommitteeMember) return;
    
    setCommitteeMembers(committeeMembers.map(m => 
      m.id === selectedCommitteeMember.id ? selectedCommitteeMember : m
    ));
    setSelectedCommitteeMember(null);
    setIsEditCommitteeMemberOpen(false);
  };

  const handleDeleteCommitteeMember = (member) => {
    const confirmed = window.confirm(`Are you sure you want to remove ${member.name.en} from the committee?`);
    if (!confirmed) return;

    setCommitteeMembers(committeeMembers.filter(m => m.id !== member.id));
  };

  const handleAddDepartment = () => {
    if (!newDepartment.name.en || !newDepartment.head.en || !newDepartment.phone) {
      alert('Please fill all required fields');
      return;
    }

    const department = {
      id: Date.now(),
      ...newDepartment,
      isActive: true
    };

    setDepartments([...departments, department]);
    setNewDepartment({
      name: { en: '', mr: '' },
      head: { en: '', mr: '' },
      phone: '',
      email: '',
      services: []
    });
    setIsAddDepartmentOpen(false);
  };

  const handleUpdateDepartment = () => {
    if (!selectedDepartment) return;
    
    setDepartments(departments.map(d => 
      d.id === selectedDepartment.id ? selectedDepartment : d
    ));
    setSelectedDepartment(null);
  };

  const handleDeleteDepartment = (department) => {
    const confirmed = window.confirm(`Are you sure you want to delete the ${department.name.en}?`);
    if (!confirmed) return;

    setDepartments(departments.filter(d => d.id !== department.id));
  };

  const exportCommitteeToCSV = () => {
    const headers = [
      'ID', 'Name (English)', 'Name (Marathi)', 'Position (English)', 'Position (Marathi)', 
      'Ward', 'Phone', 'Email', 'Join Date', 'Term End', 'Status'
    ];
    
    const csvContent = [
      headers.join(','),
      ...committeeMembers.map(m => [
        m.id,
        `"${m.name.en}"`,
        `"${m.name.mr}"`,
        `"${m.position.en}"`,
        `"${m.position.mr}"`,
        `"${m.ward}"`,
        m.phone,
        m.email,
        m.joinDate || '',
        m.termEnd || '',
        m.isActive ? 'Active' : 'Inactive'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `committee_members_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Media management helper functions
  const handleAddMedia = () => {
    if (!newMediaItem.title.en || !newMediaItem.category || !newMediaItem.file) {
      alert('Please fill all required fields and upload a file');
      return;
    }

    // Simulate file upload URL
    const fileUrl = URL.createObjectURL(newMediaItem.file);
    
    const mediaItem = {
      id: Date.now(),
      type: newMediaItem.type,
      title: newMediaItem.title,
      description: newMediaItem.description,
      url: fileUrl,
      thumbnail: fileUrl,
      category: newMediaItem.category,
      tags: newMediaItem.tags,
      date: new Date().toISOString().split('T')[0],
      uploadDate: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0,
      fileSize: `${(newMediaItem.file.size / (1024 * 1024)).toFixed(1)} MB`,
      dimensions: newMediaItem.type === 'photo' ? '1920x1080' : undefined,
      resolution: newMediaItem.type === 'video' ? '1920x1080' : undefined,
      duration: newMediaItem.type === 'video' ? '0:00' : undefined,
      isActive: true,
      isFeatured: newMediaItem.isFeatured,
      uploadedBy: 'admin'
    };

    setMediaItems([...mediaItems, mediaItem]);
    
    // Update category count
    setMediaCategories(prevCategories => 
      prevCategories.map(cat => 
        cat.id === newMediaItem.category 
          ? { ...cat, count: cat.count + 1 }
          : cat
      )
    );

    setNewMediaItem({
      type: 'photo',
      title: { en: '', mr: '' },
      description: { en: '', mr: '' },
      category: '',
      tags: [],
      file: null,
      isFeatured: false
    });
    setIsAddMediaOpen(false);
  };

  const handleUpdateMedia = () => {
    if (!selectedMedia) return;
    
    setMediaItems(mediaItems.map(m => 
      m.id === selectedMedia.id ? selectedMedia : m
    ));
    setSelectedMedia(null);
    setIsEditMediaOpen(false);
  };

  const handleDeleteMedia = (media) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${media.title.en}"?`);
    if (!confirmed) return;

    setMediaItems(mediaItems.filter(m => m.id !== media.id));
    
    // Update category count
    setMediaCategories(prevCategories => 
      prevCategories.map(cat => 
        cat.id === media.category 
          ? { ...cat, count: Math.max(0, cat.count - 1) }
          : cat
      )
    );
  };

  const handleToggleMediaStatus = (media) => {
    setMediaItems(mediaItems.map(m => 
      m.id === media.id ? { ...m, isActive: !m.isActive } : m
    ));
  };

  const handleToggleFeatured = (media) => {
    setMediaItems(mediaItems.map(m => 
      m.id === media.id ? { ...m, isFeatured: !m.isFeatured } : m
    ));
  };

  const handleAddCategory = () => {
    if (!newMediaCategory.label.en) {
      alert('Please fill the category name');
      return;
    }

    const category = {
      id: newMediaCategory.label.en.toLowerCase().replace(/\s+/g, '-'),
      label: newMediaCategory.label,
      count: 0
    };

    setMediaCategories([...mediaCategories, category]);
    setNewMediaCategory({ label: { en: '', mr: '' } });
    setIsAddCategoryOpen(false);
  };

  const handleDeleteCategory = (categoryId) => {
    const confirmed = window.confirm('Are you sure you want to delete this category?');
    if (!confirmed) return;

    setMediaCategories(mediaCategories.filter(cat => cat.id !== categoryId));
  };

  const exportMediaToCSV = () => {
    const headers = [
      'ID', 'Type', 'Title (English)', 'Title (Marathi)', 'Category', 'Date', 'Upload Date',
      'Views', 'Likes', 'File Size', 'Status', 'Featured', 'Uploaded By'
    ];
    
    const csvContent = [
      headers.join(','),
      ...mediaItems.map(m => [
        m.id,
        m.type,
        `"${m.title.en}"`,
        `"${m.title.mr}"`,
        m.category,
        m.date,
        m.uploadDate,
        m.views,
        m.likes,
        m.fileSize,
        m.isActive ? 'Active' : 'Inactive',
        m.isFeatured ? 'Yes' : 'No',
        m.uploadedBy
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `media_items_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // News management helper functions
  const handleAddNews = () => {
    if (!newNewsItem.title.en || !newNewsItem.category || !newNewsItem.content.en) {
      alert('Please fill all required fields');
      return;
    }

    const newsItem = {
      id: Date.now(),
      category: newNewsItem.category,
      priority: newNewsItem.priority,
      title: newNewsItem.title,
      content: newNewsItem.content,
      summary: newNewsItem.summary,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' }),
      publishDate: newNewsItem.publishDate || new Date().toISOString(),
      expiryDate: newNewsItem.expiryDate,
      isPublished: true,
      isFeatured: newNewsItem.isFeatured,
      isBreaking: newNewsItem.isBreaking,
      image: newNewsItem.image,
      tags: newNewsItem.tags,
      author: 'Admin',
      readCount: 0,
      iconType: newNewsItem.iconType,
      colorScheme: getColorSchemeForCategory(newNewsItem.category)
    };

    setNewsItems([newsItem, ...newsItems]);
    
    // Update category count
    setNewsCategories(prevCategories => 
      prevCategories.map(cat => 
        cat.id === newNewsItem.category 
          ? { ...cat, count: cat.count + 1 }
          : cat
      )
    );

    setNewNewsItem({
      category: '',
      priority: 'medium',
      title: { en: '', mr: '' },
      content: { en: '', mr: '' },
      summary: { en: '', mr: '' },
      tags: [],
      image: null,
      isFeatured: false,
      isBreaking: false,
      publishDate: '',
      expiryDate: '',
      iconType: 'Newspaper'
    });
    setIsAddNewsOpen(false);
  };

  const handleUpdateNews = () => {
    if (!selectedNews) return;
    
    setNewsItems(newsItems.map(n => 
      n.id === selectedNews.id ? selectedNews : n
    ));
    setSelectedNews(null);
    setIsEditNewsOpen(false);
  };

  const handleDeleteNews = (news) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${news.title.en}"?`);
    if (!confirmed) return;

    setNewsItems(newsItems.filter(n => n.id !== news.id));
    
    // Update category count
    setNewsCategories(prevCategories => 
      prevCategories.map(cat => 
        cat.id === news.category 
          ? { ...cat, count: Math.max(0, cat.count - 1) }
          : cat
      )
    );
  };

  const handleToggleNewsStatus = (news) => {
    setNewsItems(newsItems.map(n => 
      n.id === news.id ? { ...n, isPublished: !n.isPublished } : n
    ));
  };

  const handleToggleBreaking = (news) => {
    setNewsItems(newsItems.map(n => 
      n.id === news.id ? { ...n, isBreaking: !n.isBreaking } : n
    ));
  };

  const handleToggleNewsFeatured = (news) => {
    setNewsItems(newsItems.map(n => 
      n.id === news.id ? { ...n, isFeatured: !n.isFeatured } : n
    ));
  };

  const getColorSchemeForCategory = (category) => {
    const schemes = {
      'announcements': { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
      'alerts': { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
      'events': { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
      'utilities': { text: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
      'general': { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' }
    };
    return schemes[category] || schemes['general'];
  };

  const handleAddEvent = () => {
    if (!newEvent.title.en || !newEvent.date || !newEvent.time) {
      alert('Please fill all required fields');
      return;
    }

    const event = {
      id: Date.now(),
      date: new Date(newEvent.date).getDate().toString(),
      month: new Date(newEvent.date).toLocaleDateString('en-US', { month: 'short' }),
      year: new Date(newEvent.date).getFullYear().toString(),
      title: newEvent.title,
      time: newEvent.time,
      location: newEvent.location,
      description: newEvent.description,
      isActive: newEvent.isActive
    };

    setUpcomingEvents([...upcomingEvents, event]);
    setNewEvent({
      title: { en: '', mr: '' },
      description: { en: '', mr: '' },
      location: { en: '', mr: '' },
      date: '',
      time: '',
      isActive: true
    });
    setIsAddEventOpen(false);
  };

  const handleDeleteEvent = (eventId) => {
    const confirmed = window.confirm('Are you sure you want to delete this event?');
    if (!confirmed) return;

    setUpcomingEvents(upcomingEvents.filter(e => e.id !== eventId));
  };

  const handleAddNewsCategory = () => {
    if (!newNewsCategory.label.en) {
      alert('Please fill the category name');
      return;
    }

    const category = {
      id: newNewsCategory.label.en.toLowerCase().replace(/\s+/g, '-'),
      label: newNewsCategory.label,
      icon: newNewsCategory.icon,
      count: 0
    };

    setNewsCategories([...newsCategories, category]);
    setNewNewsCategory({ label: { en: '', mr: '' }, icon: 'Newspaper' });
    setIsAddNewsCategoryOpen(false);
  };

  const handleDeleteNewsCategory = (categoryId) => {
    const confirmed = window.confirm('Are you sure you want to delete this category?');
    if (!confirmed) return;

    setNewsCategories(newsCategories.filter(cat => cat.id !== categoryId));
  };

  const exportNewsToCSV = () => {
    const headers = [
      'ID', 'Category', 'Priority', 'Title (English)', 'Title (Marathi)', 'Date', 'Published',
      'Featured', 'Breaking', 'Read Count', 'Author', 'Tags'
    ];
    
    const csvContent = [
      headers.join(','),
      ...newsItems.map(n => [
        n.id,
        n.category,
        n.priority,
        `"${n.title.en}"`,
        `"${n.title.mr}"`,
        n.date,
        n.isPublished ? 'Yes' : 'No',
        n.isFeatured ? 'Yes' : 'No',
        n.isBreaking ? 'Yes' : 'No',
        n.readCount,
        n.author,
        `"${n.tags.join(', ')}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `news_items_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadTemplate = () => {
    // Create a sample CSV template
    const csvContent = `House Number,Owner Name,Tax Type,Amount Due,Due Date
H-001,John Doe,Property Tax,5000,2024-03-31
H-002,Jane Smith,Water Tax,1200,2024-03-31`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tax_records_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Content management helper functions
  const handleContentEdit = (item, type) => {
    setCurrentContentItem({ ...item, type });
    setContentFormData(item);
    setIsContentDialogOpen(true);
  };

  const handleContentAdd = (type) => {
    setCurrentContentItem({ type, id: Date.now() });
    setContentFormData({});
    setIsContentDialogOpen(true);
  };

  const handleContentSave = () => {
    const updatedItem = { ...contentFormData, id: currentContentItem.id };
    
    switch (currentContentItem.type) {
      case 'statistic':
        if (currentContentItem.id && statistics.find(s => s.id === currentContentItem.id)) {
          setStatistics(statistics.map(s => s.id === currentContentItem.id ? updatedItem : s));
        } else {
          setStatistics([...statistics, updatedItem]);
        }
        break;
      case 'facility':
        if (currentContentItem.id && facilities.find(f => f.id === currentContentItem.id)) {
          setFacilities(facilities.map(f => f.id === currentContentItem.id ? updatedItem : f));
        } else {
          setFacilities([...facilities, updatedItem]);
        }
        break;
      case 'development':
        if (currentContentItem.id && developments.find(d => d.id === currentContentItem.id)) {
          setDevelopments(developments.map(d => d.id === currentContentItem.id ? updatedItem : d));
        } else {
          setDevelopments([...developments, updatedItem]);
        }
        break;
      case 'achievement':
        if (currentContentItem.id && achievements.find(a => a.id === currentContentItem.id)) {
          setAchievements(achievements.map(a => a.id === currentContentItem.id ? updatedItem : a));
        } else {
          setAchievements([...achievements, updatedItem]);
        }
        break;
    }
    
    setIsContentDialogOpen(false);
    setCurrentContentItem(null);
    setContentFormData({});
  };

  const handleContentDelete = (id, type) => {
    switch (type) {
      case 'statistic':
        setStatistics(statistics.filter(s => s.id !== id));
        break;
      case 'facility':
        setFacilities(facilities.filter(f => f.id !== id));
        break;
      case 'development':
        setDevelopments(developments.filter(d => d.id !== id));
        break;
      case 'achievement':
        setAchievements(achievements.filter(a => a.id !== id));
        break;
    }
  };

  const renderContentFormFields = () => {
    if (!currentContentItem) return null;

    switch (currentContentItem.type) {
      case 'statistic':
        return (
          <div className="space-y-4">
            <div>
              <Label>{t({ en: 'Label (English)', mr: 'लेबल (इंग्रजी)' })}</Label>
              <Input
                value={contentFormData.label?.en || ''}
                onChange={(e) => setContentFormData({
                  ...contentFormData,
                  label: { ...contentFormData.label, en: e.target.value }
                })}
                placeholder="Enter English label"
              />
            </div>
            <div>
              <Label>{t({ en: 'Label (Marathi)', mr: 'लेबल (मराठी)' })}</Label>
              <Input
                value={contentFormData.label?.mr || ''}
                onChange={(e) => setContentFormData({
                  ...contentFormData,
                  label: { ...contentFormData.label, mr: e.target.value }
                })}
                placeholder="मराठी लेबल टाका"
              />
            </div>
            <div>
              <Label>{t({ en: 'Value', mr: 'मूल्य' })}</Label>
              <Input
                value={contentFormData.value || ''}
                onChange={(e) => setContentFormData({ ...contentFormData, value: e.target.value })}
                placeholder="Enter value"
              />
            </div>
          </div>
        );

      case 'facility':
        return (
          <div className="space-y-4">
            <div>
              <Label>{t({ en: 'Name (English)', mr: 'नाव (इंग्र���ी)' })}</Label>
              <Input
                value={contentFormData.name?.en || ''}
                onChange={(e) => setContentFormData({
                  ...contentFormData,
                  name: { ...contentFormData.name, en: e.target.value }
                })}
                placeholder="Enter English name"
              />
            </div>
            <div>
              <Label>{t({ en: 'Name (Marathi)', mr: 'नाव (मराठी)' })}</Label>
              <Input
                value={contentFormData.name?.mr || ''}
                onChange={(e) => setContentFormData({
                  ...contentFormData,
                  name: { ...contentFormData.name, mr: e.target.value }
                })}
                placeholder="मराठी नाव टाका"
              />
            </div>
            <div>
              <Label>{t({ en: 'Description (English)', mr: 'वर्णन (इंग्रजी)' })}</Label>
              <Textarea
                value={contentFormData.description?.en || ''}
                onChange={(e) => setContentFormData({
                  ...contentFormData,
                  description: { ...contentFormData.description, en: e.target.value }
                })}
                placeholder="Enter English description"
              />
            </div>
            <div>
              <Label>{t({ en: 'Description (Marathi)', mr: 'वर्णन (मराठी)' })}</Label>
              <Textarea
                value={contentFormData.description?.mr || ''}
                onChange={(e) => setContentFormData({
                  ...contentFormData,
                  description: { ...contentFormData.description, mr: e.target.value }
                })}
                placeholder="मराठी वर्णन टाका"
              />
            </div>
          </div>
        );

      case 'development':
        return (
          <div className="space-y-4">
            <div>
              <Label>{t({ en: 'Title (English)', mr: 'शीर्षक (इंग्रजी)' })}</Label>
              <Input
                value={contentFormData.title?.en || ''}
                onChange={(e) => setContentFormData({
                  ...contentFormData,
                  title: { ...contentFormData.title, en: e.target.value }
                })}
                placeholder="Enter English title"
              />
            </div>
            <div>
              <Label>{t({ en: 'Title (Marathi)', mr: 'शीर्षक (मराठी)' })}</Label>
              <Input
                value={contentFormData.title?.mr || ''}
                onChange={(e) => setContentFormData({
                  ...contentFormData,
                  title: { ...contentFormData.title, mr: e.target.value }
                })}
                placeholder="मराठी शीर्षक टाका"
              />
            </div>
            <div>
              <Label>{t({ en: 'Date', mr: 'दिनांक' })}</Label>
              <Input
                value={contentFormData.date || ''}
                onChange={(e) => setContentFormData({ ...contentFormData, date: e.target.value })}
                placeholder="Enter date"
              />
            </div>
            <div>
              <Label>{t({ en: 'Category (English)', mr: 'श्रेणी (इंग्रजी)' })}</Label>
              <Input
                value={contentFormData.category?.en || ''}
                onChange={(e) => setContentFormData({
                  ...contentFormData,
                  category: { ...contentFormData.category, en: e.target.value }
                })}
                placeholder="Enter English category"
              />
            </div>
            <div>
              <Label>{t({ en: 'Category (Marathi)', mr: 'श्रेणी (मराठी)' })}</Label>
              <Input
                value={contentFormData.category?.mr || ''}
                onChange={(e) => setContentFormData({
                  ...contentFormData,
                  category: { ...contentFormData.category, mr: e.target.value }
                })}
                placeholder="मराठी श्रेणी टाका"
              />
            </div>
            <div>
              <Label>{t({ en: 'Image URL', mr: 'प्रतिमा URL' })}</Label>
              <Input
                value={contentFormData.image || ''}
                onChange={(e) => setContentFormData({ ...contentFormData, image: e.target.value })}
                placeholder="Enter image URL"
              />
            </div>
          </div>
        );

      case 'achievement':
        return (
          <div className="space-y-4">
            <div>
              <Label>{t({ en: 'Title (English)', mr: 'शीर्षक (इंग्रजी)' })}</Label>
              <Input
                value={contentFormData.title?.en || ''}
                onChange={(e) => setContentFormData({
                  ...contentFormData,
                  title: { ...contentFormData.title, en: e.target.value }
                })}
                placeholder="Enter English title"
              />
            </div>
            <div>
              <Label>{t({ en: 'Title (Marathi)', mr: 'शीर्षक (मराठी)' })}</Label>
              <Input
                value={contentFormData.title?.mr || ''}
                onChange={(e) => setContentFormData({
                  ...contentFormData,
                  title: { ...contentFormData.title, mr: e.target.value }
                })}
                placeholder="मराठी शीर्षक टाका"
              />
            </div>
            <div>
              <Label>{t({ en: 'Description (English)', mr: 'वर्णन (इंग्रजी)' })}</Label>
              <Textarea
                value={contentFormData.description?.en || ''}
                onChange={(e) => setContentFormData({
                  ...contentFormData,
                  description: { ...contentFormData.description, en: e.target.value }
                })}
                placeholder="Enter English description"
              />
            </div>
            <div>
              <Label>{t({ en: 'Description (Marathi)', mr: 'वर्णन (मराठी)' })}</Label>
              <Textarea
                value={contentFormData.description?.mr || ''}
                onChange={(e) => setContentFormData({
                  ...contentFormData,
                  description: { ...contentFormData.description, mr: e.target.value }
                })}
                placeholder="मराठी वर्णन टाका"
              />
            </div>
            <div>
              <Label>{t({ en: 'Icon (Emoji)', mr: 'चिन्ह (इमोजी)' })}</Label>
              <Input
                value={contentFormData.icon || ''}
                onChange={(e) => setContentFormData({ ...contentFormData, icon: e.target.value })}
                placeholder="Enter emoji"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                {t({ en: 'Admin Dashboard', mr: 'प्रशासन डॅशबोर्ड' })}
              </h1>
              <p className="text-gray-600 mt-1">
                {t({ en: 'Smart Village Portal Management', mr: 'स्मार्ट व्हिलेज पोर्टल व्यवस्थापन' })}
              </p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="hover-scale"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t({ en: 'Back to Portal', mr: 'पोर्टलवर परत' })}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="home">
              <Home className="h-4 w-4 mr-2" />
              {t({ en: 'Home Content', mr: 'होम सामग्री' })}
            </TabsTrigger>
            <TabsTrigger value="tax">
              <CreditCard className="h-4 w-4 mr-2" />
              {t({ en: 'Tax Management', mr: 'कर व्यवस्थापन' })}
            </TabsTrigger>
            <TabsTrigger value="grievances">
              <MessageSquare className="h-4 w-4 mr-2" />
              {t({ en: 'Grievances', mr: 'तक्रारी' })}
            </TabsTrigger>
            <TabsTrigger value="villagers">
              <User className="h-4 w-4 mr-2" />
              {t({ en: 'Villagers', mr: 'गावकरी' })}
            </TabsTrigger>
            <TabsTrigger value="committee">
              <UserCheck className="h-4 w-4 mr-2" />
              {t({ en: 'Committee', mr: 'समिती' })}
            </TabsTrigger>
            <TabsTrigger value="media">
              <Camera className="h-4 w-4 mr-2" />
              {t({ en: 'Media', mr: 'मीडिया' })}
            </TabsTrigger>
            <TabsTrigger value="news">
              <Newspaper className="h-4 w-4 mr-2" />
              {t({ en: 'News', mr: 'वार्ता' })}
            </TabsTrigger>
          </TabsList>

          {/* Villager Management Tab */}
          <TabsContent value="villagers" className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t({ en: 'Villager Management', mr: 'गावकरी व्यवस्थापन' })}
                </h2>
                <p className="text-gray-600">
                  {t({ en: 'Manage villager registrations and approvals', mr: 'गावकरी नोंदणी आणि मंजुरी व्यवस्थापित करा' })}
                </p>
                          </div>
                          <div className="flex gap-2">
                <Button onClick={handleOpenAddModal} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                  {t({ en: 'Add Villager', mr: 'गावकरी जोडा' })}
                  </Button>
                <Button onClick={handleExportCsv} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  {t({ en: 'Export CSV', mr: 'CSV एक्सपोर्ट करा' })}
                            </Button>
                          </div>
                        </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {(() => {
                const stats = getVillagerStats();
                return (
                  <>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{stats.totalApproved}</div>
                          <div className="text-sm text-gray-600 mt-1">{t({ en: 'Total Approved', mr: 'एकूण मंजूर' })}</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                          <div className="text-sm text-gray-600 mt-1">{t({ en: 'Pending', mr: 'प्रलंबित' })}</div>
                </div>
              </CardContent>
            </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{stats.male}</div>
                          <div className="text-sm text-gray-600 mt-1">{t({ en: 'Male', mr: 'पुरुष' })}</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-pink-600">{stats.female}</div>
                          <div className="text-sm text-gray-600 mt-1">{t({ en: 'Female', mr: 'महिला' })}</div>
                </div>
              </CardContent>
            </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{stats.other}</div>
                          <div className="text-sm text-gray-600 mt-1">{t({ en: 'Other', mr: 'इतर' })}</div>
                  </div>
              </CardContent>
            </Card>
                  </>
                );
              })()}
              </div>
              
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder={t({ en: 'Search by name, mobile, or Aadhar...', mr: 'नाव, मोबाइल किंवा आधाराने शोधा...' })}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="sm:w-48">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder={t({ en: 'Filter by status', mr: 'स्थितीनुसार फिल्टर करा' })} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t({ en: 'All Status', mr: 'सर्व स्थिती' })}</SelectItem>
                        <SelectItem value="Pending">{t({ en: 'Pending', mr: 'प्रलंबित' })}</SelectItem>
                        <SelectItem value="Approved">{t({ en: 'Approved', mr: 'मंजूर' })}</SelectItem>
                        <SelectItem value="Rejected">{t({ en: 'Rejected', mr: 'नाकारले' })}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Villagers Table */}
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">{t({ en: 'Loading villagers...', mr: 'गावकरी लोड करत आहे...' })}</p>
                              </div>
                </div>
                ) : (
                  <Table>
                    <TableHeader>
                    <TableRow>
                      <TableHead>{t({ en: 'Name', mr: 'नाव' })}</TableHead>
                      <TableHead>{t({ en: 'Mobile', mr: 'मोबाइल' })}</TableHead>
                      <TableHead>{t({ en: 'Gender', mr: 'लिंग' })}</TableHead>
                      <TableHead>{t({ en: 'Aadhar', mr: 'आधार' })}</TableHead>
                      <TableHead>{t({ en: 'Status', mr: 'स्थिती' })}</TableHead>
                      <TableHead>{t({ en: 'Request Type', mr: 'विनंती प्रकार' })}</TableHead>
                      <TableHead>{t({ en: 'Submitted At', mr: 'सबमिट केले' })}</TableHead>
                      <TableHead className="text-right">{t({ en: 'Actions', mr: 'क्रिया' })}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {villagers.length === 0 ? (
                        <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="text-gray-500">
                            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>{t({ en: 'No villagers found', mr: 'कोणतेही गावकरी सापडले नाहीत' })}</p>
                                </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                      villagers.map((villager) => (
                        <TableRow key={villager._id}>
                          <TableCell className="font-medium">{villager.fullName}</TableCell>
                          <TableCell>{villager.mobileNumber}</TableCell>
                          <TableCell>{villager.gender}</TableCell>
                          <TableCell>{villager.aadharNumber}</TableCell>
                            <TableCell>
                            <Badge 
                              className={
                                villager.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                villager.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {villager.status === 'Approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {villager.status === 'Rejected' && <XCircle className="h-3 w-3 mr-1" />}
                              {villager.status === 'Pending' && <Clock className="h-3 w-3 mr-1" />}
                              {t({ 
                                en: villager.status, 
                                mr: villager.status === 'Approved' ? 'मंजूर' : 
                                    villager.status === 'Rejected' ? 'नाकारले' : 'प्रलंबित' 
                                })}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                              {t({ 
                                en: villager.requestType, 
                                mr: villager.requestType === 'New Registration' ? 'नवीन नोंदणी' :
                                    villager.requestType === 'Edit Request' ? 'संपादन विनंती' : 'प्रशासक जोडले' 
                              })}
                              </Badge>
                            </TableCell>
                            <TableCell>
                            {new Date(villager.submittedAt).toLocaleDateString()}
                            </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                onClick={() => handleOpenEditModal(villager)}
                              >
                              <Edit className="h-4 w-4" />
                                </Button>
                              {villager.status === 'Pending' && (
                                <>
                        <Button
                          variant="outline"
                          size="sm"
                                    onClick={() => handleApprove(villager._id)}
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                                    <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                                    onClick={() => handleReject(villager._id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                                    <XCircle className="h-4 w-4" />
                        </Button>
                                </>
                              )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

          {/* Add/Edit Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
                  {editingVillager?._id ? 
                    t({ en: 'Edit Villager', mr: 'गावकरी संपादित करा' }) : 
                    t({ en: 'Add New Villager', mr: 'नवीन गावकरी जोडा' })
              }
            </DialogTitle>
                <DialogDescription>
                  {editingVillager?._id ? 
                    t({ en: 'Update villager information', mr: 'गावकरी माहिती अद्ययावत करा' }) : 
                    t({ en: 'Add a new villager to the system', mr: 'सिस्टममध्ये नवीन गावकरी जोडा' })
                  }
                </DialogDescription>
          </DialogHeader>
          
              {editingVillager && (
                <form onSubmit={handleModalSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="fullName">{t({ en: 'Full Name', mr: 'पूर्ण नाव' })} *</Label>
              <Input
                        id="fullName"
                        value={editingVillager.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        required
              />
            </div>
            
              <div>
                      <Label htmlFor="mobileNumber">{t({ en: 'Mobile Number', mr: 'मोबाइल नंबर' })} *</Label>
                <Input
                        id="mobileNumber"
                        value={editingVillager.mobileNumber}
                        onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                        required
                    />
            </div>
            
              <div>
                      <Label htmlFor="gender">{t({ en: 'Gender', mr: 'लिंग' })} *</Label>
                      <Select value={editingVillager.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                          <SelectValue placeholder={t({ en: 'Select gender', mr: 'लिंग निवडा' })} />
                  </SelectTrigger>
                  <SelectContent>
                          <SelectItem value="Male">{t({ en: 'Male', mr: 'पुरुष' })}</SelectItem>
                          <SelectItem value="Female">{t({ en: 'Female', mr: 'महिला' })}</SelectItem>
                          <SelectItem value="Other">{t({ en: 'Other', mr: 'इतर' })}</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            
            <div>
                      <Label htmlFor="dateOfBirth">{t({ en: 'Date of Birth', mr: 'जन्मतारीख' })}</Label>
              <Input
                        id="dateOfBirth"
                  type="date"
                        value={editingVillager.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
            </div>

              <div>
                      <Label htmlFor="aadharNumber">{t({ en: 'Aadhar Number', mr: 'आधार नंबर' })} *</Label>
                  <Input
                        id="aadharNumber"
                        value={editingVillager.aadharNumber}
                        onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                        required
                      />
              </div>

                <div>
                      <Label htmlFor="idProofPhoto">{t({ en: 'ID Proof Photo URL', mr: 'ओळखपत्र फोटो URL' })} *</Label>
                  <Input
                        id="idProofPhoto"
                        value={editingVillager.idProofPhoto}
                        onChange={(e) => handleInputChange('idProofPhoto', e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        required
                  />
                </div>
              </div>

              <div>
                    <Label htmlFor="address">{t({ en: 'Address', mr: 'पत्ता' })} *</Label>
              <Textarea
                      id="address"
                      value={editingVillager.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                      required
                    />
            </div>

                  {editingVillager._id && (
            <div>
                      <Label htmlFor="status">{t({ en: 'Status', mr: 'स्थिती' })}</Label>
                      <Select value={editingVillager.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                        <SelectItem value="Pending">{t({ en: 'Pending', mr: 'प्रलंबित' })}</SelectItem>
                          <SelectItem value="Approved">{t({ en: 'Approved', mr: 'मंजूर' })}</SelectItem>
                          <SelectItem value="Rejected">{t({ en: 'Rejected', mr: 'नाकारले' })}</SelectItem>
                  </SelectContent>
                </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              {t({ en: 'Cancel', mr: 'रद्द करा' })}
            </Button>
                    <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
                      {editingVillager._id ? 
                        t({ en: 'Update', mr: 'अद्ययावत करा' }) : 
                        t({ en: 'Add', mr: 'जोडा' })
                      }
            </Button>
          </div>
                </form>
                      )}
        </DialogContent>
      </Dialog>

            {/* Floating Contracts Button */}
            <AdminFloatingContractsButton />
          </TabsContent>

          {/* Other Tab Contents */}
          <TabsContent value="home">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                {t({ en: 'Home Content Management', mr: 'होम सामग्री व्यवस्थापन' })}
              </h3>
              <p className="text-gray-600">
                {t({ en: 'Manage website homepage content', mr: 'वेबसाइट होमपेज सामग्री व्यवस्थापित करा' })}
              </p>
              </div>
          </TabsContent>

          <TabsContent value="tax">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                {t({ en: 'Tax Management', mr: 'कर व्यवस्थापन' })}
              </h3>
              <p className="text-gray-600">
                {t({ en: 'Manage village tax records and collections', mr: 'गाव कर रेकॉर्ड आणि वसुली व्यवस्थापित करा' })}
              </p>
              </div>
          </TabsContent>

          <TabsContent value="grievances">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                {t({ en: 'Grievance Management', mr: 'तक्रार व्यवस्थापन' })}
              </h3>
              <p className="text-gray-600">
                {t({ en: 'Handle village grievances and complaints', mr: 'गाव तक्रार आणि शिकायतींचे निराकरण करा' })}
              </p>
              </div>
          </TabsContent>

          <TabsContent value="committee">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                {t({ en: 'Committee Management', mr: 'समिती व्यवस्थापन' })}
              </h3>
              <p className="text-gray-600">
                {t({ en: 'Manage village committee members', mr: 'गाव समिती सदस्यांचे व्यवस्थापन करा' })}
              </p>
              </div>
          </TabsContent>

          <TabsContent value="media">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                {t({ en: 'Media Management', mr: 'मीडिया व्यवस्थापन' })}
              </h3>
              <p className="text-gray-600">
                {t({ en: 'Manage village photos and videos', mr: 'गाव फोटो आणि व्हिडिओ व्यवस्थापित करा' })}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="news">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                {t({ en: 'News Management', mr: 'वार्ता व्यवस्थापन' })}
              </h3>
              <p className="text-gray-600">
                {t({ en: 'Manage village news and announcements', mr: 'गाव वार्ता आणि घोषणांचे व्यवस्थापन करा' })}
              </p>
              </div>
          </TabsContent>
        </Tabs>
              </div>
    </div>
  );
}