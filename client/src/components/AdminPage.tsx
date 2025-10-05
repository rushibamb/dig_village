import React, { useState, useRef, useEffect } from 'react';
import { adminGetAllMediaItems, adminGetAllMediaCategories, adminCreateMediaItem, adminUpdateMediaItem, adminDeleteMediaItem, adminCreateMediaCategory, adminDeleteMediaCategory } from '../services/mediaService';
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
import {
  adminGetAllGrievances,
  getAllWorkers,
  addWorker,
  updateWorker,
  deleteWorker,
  adminUpdateGrievanceAdminStatus,
  adminAssignWorkerToGrievance,
  adminUpdateGrievanceProgressStatus,
  adminUpdateGrievanceProgress
} from '../services/grievanceService';
import {
  adminGetAllNewsArticles,
  adminGetAllCategories,
  adminGetAllEvents,
  adminGetNewsStats,
  adminCreateNewsArticle,
  adminUpdateNewsArticle,
  adminDeleteNewsArticle,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminCreateEvent,
  adminUpdateEvent,
  adminDeleteEvent,
  adminGetAllWeatherAlerts,
  adminCreateWeatherAlert,
  adminUpdateWeatherAlert,
  adminDeleteWeatherAlert,
  adminGetWeatherAlertStats
} from '../services/newsService';
import {
  adminGetAllCommitteeMembers,
  adminGetAllDepartments,
  adminGetOfficeInfo,
  adminCreateCommitteeMember,
  adminUpdateCommitteeMember,
  adminDeleteCommitteeMember,
  adminCreateDepartment,
  adminUpdateDepartment,
  adminDeleteDepartment,
  adminUpdateOfficeInfo
} from '../services/committeeService';

import { formatDateForAPI } from '../utils/dateUtils';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Plus,
  Edit,
  Trash2,
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
  Folder,
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
  Building2,
  Award,
  Users,
  Badge as BadgeIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  X,
  Check,
  Save
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

  // Grievance management states
  const [grievances, setGrievances] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [grievanceLoading, setGrievanceLoading] = useState(true);

  // Media management states
  const [mediaItems, setMediaItems] = useState([]);
  const [mediaCategories, setMediaCategories] = useState([]);
  const [isAddMediaOpen, setIsAddMediaOpen] = useState(false);
  const [isEditMediaOpen, setIsEditMediaOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [newMediaItem, setNewMediaItem] = useState({
    mediaType: 'Photo',
    title: { en: '', mr: '' },
    description: { en: '', mr: '' },
    category: '',
    tags: [],
    fileUrl: '',
    thumbnailUrl: '',
    isFeatured: false
  });
  
  // Media filtering and pagination states
  const [mediaSearchTerm, setMediaSearchTerm] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('All');
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState('All');
  const [mediaStatusFilter, setMediaStatusFilter] = useState('All');
  const [mediaCurrentPage, setMediaCurrentPage] = useState(1);
  
  // Category management states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newMediaCategory, setNewMediaCategory] = useState({
    name: { en: '', mr: '' }
  });

  // Worker management states
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null); // Will hold worker data for editing
  const [workerFormData, setWorkerFormData] = useState({ 
    name: '', 
    department: '', 
    phone: '', 
    email: '',
    status: 'active'
  });

  // Grievance detail modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [resolutionPhotos, setResolutionPhotos] = useState([]);


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
      const params: any = {};
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

  // Reusable function to fetch grievances
  const fetchGrievances = async () => {
    try {
      setGrievanceLoading(true);
      const grievanceRes = await adminGetAllGrievances();
      setGrievances(grievanceRes.data);
    } catch (error) {
      console.error("Failed to fetch grievances:", error);
    } finally {
      setGrievanceLoading(false);
    }
  };
  
  // Reusable function to fetch workers
  const fetchWorkers = async () => {
    try {
      const workerRes = await getAllWorkers();
      setWorkers(workerRes.data);
    } catch (error) {
      console.error("Failed to fetch workers:", error);
    }
  };

  // Reusable function to fetch media items
  const fetchMediaItems = async () => {
    try {
      const mediaRes = await adminGetAllMediaItems();
      setMediaItems(mediaRes.data);
    } catch (error) {
      console.error("Failed to fetch media items:", error);
    }
  };

  // Reusable function to fetch media categories
  const fetchMediaCategories = async () => {
    try {
      const categoriesRes = await adminGetAllMediaCategories();
      setMediaCategories(categoriesRes.data);
    } catch (error) {
      console.error("Failed to fetch media categories:", error);
    }
  };

  // File upload handler for server-side Cloudinary upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    
    try {
      // Check if file is too large (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size too large. Please select a file smaller than 10MB.');
        setUploading(false);
        return;
      }
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload to server endpoint
      const response = await fetch('/api/upload/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setNewMediaItem(prev => ({
          ...prev,
          fileUrl: result.data.fileUrl,
          thumbnailUrl: result.data.thumbnailUrl
        }));
        
        toast.success('File uploaded successfully to Cloudinary!');
      } else {
        throw new Error(result.message || 'Upload failed');
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      
      // Fallback to a working placeholder URL
      const placeholderUrl = 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop';
      
      setNewMediaItem(prev => ({
        ...prev,
        fileUrl: placeholderUrl,
        thumbnailUrl: placeholderUrl
      }));
      
      toast.error('Upload failed. Using placeholder image.');
    } finally {
      setUploading(false);
    }
  };

  // Form submit handler for adding new media
  const handleAddMediaSubmit = async () => {
    try {
      // Validate required fields
      if (!newMediaItem.title.en || !newMediaItem.category || !newMediaItem.fileUrl) {
        toast.error('Please fill in all required fields');
        return;
      }

      await adminCreateMediaItem(newMediaItem);
      
      // Reset form
      setNewMediaItem({
        mediaType: 'Photo',
        title: { en: '', mr: '' },
        description: { en: '', mr: '' },
        category: '',
        tags: [],
        fileUrl: '',
        thumbnailUrl: '',
        isFeatured: false
      });
      
      // Close modal
      setIsAddMediaOpen(false);
      
      // Refresh media list
      await fetchMediaItems();
      
      toast.success('Media item added successfully');
    } catch (error) {
      console.error('Failed to add media item:', error);
      toast.error('Failed to add media item');
    }
  };

  // Update media item handler
  const handleUpdateMedia = async () => {
    try {
      if (!selectedMedia) return;

      // Validate required fields
      if (!selectedMedia.title.en || !selectedMedia.category) {
        toast.error('Please fill in all required fields');
        return;
      }

      await adminUpdateMediaItem(selectedMedia._id, selectedMedia);
      
      // Close modal
      setIsEditMediaOpen(false);
      setSelectedMedia(null);
      
      // Refresh media list
      await fetchMediaItems();
      
      toast.success('Media item updated successfully');
    } catch (error) {
      console.error('Failed to update media item:', error);
      toast.error('Failed to update media item');
    }
  };

  // Delete media item handler
  const handleDeleteMediaItem = async (mediaId) => {
    if (window.confirm('Are you sure you want to delete this media item?')) {
      try {
        await adminDeleteMediaItem(mediaId);
        
        // Refresh media list
        await fetchMediaItems();
        
        toast.success('Media item deleted successfully');
      } catch (error) {
        console.error('Failed to delete media item:', error);
        toast.error('Failed to delete media item');
      }
    }
  };

  // Add category handler
  const handleAddCategory = async () => {
    try {
      // Validate required fields
      if (!newMediaCategory.name.en || !newMediaCategory.name.mr) {
        toast.error('Please fill in both English and Marathi names');
        return;
      }

      await adminCreateMediaCategory(newMediaCategory);
      
      // Reset form
      setNewMediaCategory({
        name: { en: '', mr: '' }
      });
      
      // Refresh categories list
      await fetchMediaCategories();
      
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Failed to add category:', error);
      toast.error('Failed to add category');
    }
  };

  // Delete category handler
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all media items in this category.')) {
      try {
        await adminDeleteMediaCategory(categoryId);
        
        // Refresh categories list
        await fetchMediaCategories();
        
        toast.success('Category deleted successfully');
      } catch (error) {
        console.error('Failed to delete category:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  // Reusable function to fetch news data
  const fetchNewsData = async () => {
    try {
      const [newsRes, statsRes] = await Promise.all([
        adminGetAllNewsArticles(),
        adminGetNewsStats()
      ]);
      
      setNewsItems(newsRes.data);
      setNewsStats(statsRes.data);
    } catch (error) {
      console.error("Failed to fetch news data:", error);
      toast.error("Failed to load news data");
    }
  };

  // Reusable function to fetch categories
  const fetchCategories = async () => {
    try {
      const categoriesRes = await adminGetAllCategories();
      console.log("Categories response:", categoriesRes);
      setNewsCategories(categoriesRes.data || categoriesRes || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories");
    }
  };

  // Reusable function to fetch events
  const fetchEvents = async () => {
    try {
      const eventsRes = await adminGetAllEvents();
      setUpcomingEvents(eventsRes.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Failed to load events");
    }
  };


  // Fetch committee members
  const fetchCommitteeMembers = async () => {
    try {
      const committeeMembersRes = await adminGetAllCommitteeMembers();
      setCommitteeMembers(committeeMembersRes.data || []);
    } catch (error) {
      console.error('Failed to fetch committee members:', error);
      toast.error('Failed to load committee members');
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const departmentsRes = await adminGetAllDepartments();
      setDepartments(departmentsRes.data || []);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      toast.error('Failed to load departments');
    }
  };

  // Fetch office information
  const fetchOfficeInfo = async () => {
    try {
      const officeInfoRes = await adminGetOfficeInfo();
      setOfficeInfo(officeInfoRes.data || {});
      
      // Set office hours if available in office info
      if (officeInfoRes.data?.officeHours) {
        setOfficeHours(officeInfoRes.data.officeHours);
      }
    } catch (error) {
      console.error('Failed to fetch office info:', error);
      toast.error('Failed to load office information');
    }
  };

  // Fetch grievance, worker, news, and media data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
        fetchGrievances(), 
        fetchWorkers(), 
        fetchNewsData(),
        fetchCategories(),
        fetchEvents(),
        fetchWeatherAlerts(),
        fetchCommitteeMembers(),
        fetchDepartments(),
        fetchOfficeInfo(),
        fetchMediaItems(),
        fetchMediaCategories()
      ]);
    };
    fetchInitialData();
  }, []);

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

  // Worker management handler functions
  const handleOpenWorkerModal = () => {
    setIsWorkerModalOpen(true);
  };

  const handleEditWorkerClick = (worker) => {
    setEditingWorker(worker);
    setWorkerFormData({
      name: worker.name || '',
      department: worker.department || '',
      phone: worker.phone || '',
      email: worker.email || '',
      status: worker.status || 'active'
    });
    setIsWorkerModalOpen(true);
  };

  const handleAddNewWorkerClick = () => {
    setEditingWorker(null);
    setWorkerFormData({
      name: '',
      department: '',
      phone: '',
      email: '',
      status: 'active'
    });
    setIsWorkerModalOpen(true);
  };

  const handleDeleteWorker = async (workerId) => {
    if (window.confirm(t({ 
      en: 'Are you sure you want to delete this worker?', 
      mr: 'तुम्ही या कामगाराला हटवू इच्छिता का?' 
    }))) {
      try {
        const response = await deleteWorker(workerId);
        if (response.success) {
          toast.success(t({ 
            en: 'Worker deleted successfully', 
            mr: 'कामगार यशस्वीरित्या हटवला' 
          }));
          await fetchWorkers(); // Refresh the list
        }
      } catch (error) {
        console.error('Error deleting worker:', error);
        toast.error(t({ 
          en: 'Failed to delete worker', 
          mr: 'कामगार हटवण्यात अयशस्वी' 
        }));
      }
    }
  };

  const handleWorkerFormChange = (e) => {
    const { name, value } = e.target;
    setWorkerFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWorkerFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!workerFormData.name || !workerFormData.department) {
      toast.error(t({ 
        en: 'Please fill in name and department', 
        mr: 'कृपया नाव आणि विभाग भरा' 
      }));
      return;
    }

    try {
      let response;
      if (editingWorker) {
        response = await updateWorker(editingWorker._id, workerFormData);
      } else {
        response = await addWorker(workerFormData);
      }

      if (response.success) {
        toast.success(t({ 
          en: editingWorker ? 'Worker updated successfully' : 'Worker added successfully',
          mr: editingWorker ? 'कामगार यशस्वीरित्या अद्यतनित केला' : 'कामगार यशस्वीरित्या जोडला'
        }));
        
        await fetchWorkers(); // Refresh the list
        setIsWorkerModalOpen(false); // Close modal
        setEditingWorker(null); // Reset editing state
        setWorkerFormData({ name: '', department: '', phone: '', email: '', status: 'active' }); // Reset form
      }
    } catch (error) {
      console.error('Error saving worker:', error);
      toast.error(t({ 
        en: editingWorker ? 'Failed to update worker' : 'Failed to add worker',
        mr: editingWorker ? 'कामगार अद्यतनित करण्यात अयशस्वी' : 'कामगार जोडण्यात अयशस्वी'
      }));
    }
  };


  // Grievance action handler functions
  const handleOpenDetailModal = (grievance) => {
    console.log('Opening detail modal with grievance:', grievance);
    setSelectedGrievance(grievance);
    setIsDetailModalOpen(true);
  };

  const handleUpdateAdminStatus = async (grievanceId, status) => {
    try {
      const response = await adminUpdateGrievanceAdminStatus(grievanceId, status);
      if (response.success) {
        toast.success(t({ 
          en: `Grievance ${status.toLowerCase()} successfully`, 
          mr: `तक्रार ${status.toLowerCase()} यशस्वीरित्या ${status === 'Approved' ? 'मंजूर' : 'नाकारली'}` 
        }));
        await fetchGrievances(); // Refresh the grievances list
        // Update the selectedGrievance if it's the same grievance
        if (selectedGrievance && selectedGrievance._id === grievanceId) {
          setSelectedGrievance(prev => ({
            ...prev,
            adminStatus: status
          }));
        }
      }
    } catch (error) {
      console.error('Error updating grievance admin status:', error);
      toast.error(t({ 
        en: `Failed to ${status.toLowerCase()} grievance`, 
        mr: `तक्रार ${status.toLowerCase()} करण्यात अयशस्वी` 
      }));
    }
  };

  const handleAssignWorker = async (workerId) => {
    if (!selectedGrievance) {
      toast.error(t({ 
        en: 'No grievance selected', 
        mr: 'कोणतीही तक्रार निवडलेली नाही' 
      }));
      return;
    }

    try {
      // Handle unassignment case
      const actualWorkerId = workerId === 'unassigned' ? null : workerId;
      
      const response = await adminAssignWorkerToGrievance(selectedGrievance._id, actualWorkerId);
      if (response.success) {
        const assignedWorker = actualWorkerId ? workers.find(w => w._id === actualWorkerId) : null;
        
        toast.success(t({ 
          en: actualWorkerId ? 'Worker assigned successfully' : 'Worker unassigned successfully',
          mr: actualWorkerId ? 'कामगार यशस्वीरित्या नियुक्त केला' : 'कामगार नियुक्तता रद्द केली'
        }));
        await fetchGrievances(); // Refresh the grievances list
        // Update the selectedGrievance locally
        setSelectedGrievance(prev => ({
          ...prev,
          assignedWorker: assignedWorker
        }));
      }
    } catch (error) {
      console.error('Error assigning worker:', error);
      toast.error(t({ 
        en: 'Failed to assign worker', 
        mr: 'कामगार नियुक्त करण्यात अयशस्वी' 
      }));
    }
  };

  const handleUpdateProgress = async (newStatus) => {
    if (!selectedGrievance) {
      toast.error(t({ 
        en: 'No grievance selected', 
        mr: 'कोणतीही तक्रार निवडलेली नाही' 
      }));
      return;
    }

    try {
      const response = await adminUpdateGrievanceProgressStatus(selectedGrievance._id, newStatus);
      if (response.success) {
        toast.success(t({ 
          en: 'Grievance status updated successfully', 
          mr: 'तक्रार स्थिती यशस्वीरित्या अद्यतनित केली' 
        }));
        await fetchGrievances(); // Refresh the grievances list
        // Update the selectedGrievance locally
        setSelectedGrievance(prev => ({
          ...prev,
          progressStatus: newStatus
        }));
      }
    } catch (error) {
      console.error('Error updating grievance progress:', error);
      toast.error(t({ 
        en: 'Failed to update grievance status', 
        mr: 'तक्रार स्थिती अद्यतनित करण्यात अयशस्वी' 
      }));
    }
  };

  // Image compression function
  const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, file.type, quality);
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle resolution Photo upload (Development version)
  const handleResolutionUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(t({ 
        en: 'Please select only image files', 
        mr: 'कृपया फक्त फोटो निवडा' 
      }));
      return;
    }

    try {
      // Compress image if it's too large (> 1MB)
      let processedFile = file;
      if (file.size > 1024 * 1024) { // 1MB
        processedFile = await compressImage(file);
      }

      // Convert file to base64 data URL for persistent storage
      const reader = new FileReader();
      reader.onload = (e) => {
        setResolutionPhotos(prev => [...prev, e.target?.result]);
        toast.success(t({ 
          en: 'Resolution photo uploaded successfully', 
          mr: 'निराकरण फोटो यशस्वीरित्या अपलोड केला' 
        }));
      };
      reader.onerror = () => {
        console.error('Error reading resolution photo');
        toast.error(t({ 
          en: 'Failed to upload resolution photo', 
          mr: 'निराकरण फोटो अपलोड करणे अयशस्वी' 
        }));
      };
      reader.readAsDataURL(processedFile);
    } catch (error) {
      console.error('Error uploading resolution photo:', error);
      toast.error(t({ 
        en: 'Please select only image files', 
        mr: 'कृपया फक्त फोटो निवडा' 
      }));
    }
  };

  // Handle marking grievance as resolved with photos
  const handleMarkAsResolved = async () => {
    if (!selectedGrievance || resolutionPhotos.length === 0) {
      toast.error(t({ 
        en: 'Please upload resolution photos before marking as resolved', 
        mr: 'निराकरण केलेला चिन्हांकित करण्यापूर्वी कृपया निराकरण फोटो अपलोड करा' 
      }));
      return;
    }

    try {
      const response = await adminUpdateGrievanceProgress(selectedGrievance._id, 'Resolved', resolutionPhotos);
      if (response.success) {
        toast.success(t({ 
          en: 'Grievance marked as resolved with photos', 
          mr: 'फोटोसह तक्रारीचे निराकरण केले' 
        }));
        await fetchGrievances(); // Refresh the grievances list
        setResolutionPhotos([]); // Clear photos
        setIsDetailModalOpen(false); // Close modal
      }
    } catch (error) {
      console.error('Error marking grievance as resolved:', error);
      toast.error(t({ 
        en: 'Failed to mark grievance as resolved', 
        mr: 'तक्रारीचे निराकरण चिन्हांकित करण्यात अयशस्वी' 
      }));
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

  const [grievanceSearchTerm, setGrievanceSearchTerm] = useState('');
  const [grievanceStatusFilter, setGrievanceStatusFilter] = useState('All');
  const [grievanceAdminStatusFilter, setGrievanceAdminStatusFilter] = useState('All');
  const [grievanceCategoryFilter, setGrievanceCategoryFilter] = useState('All');
  const [grievanceCurrentPage, setGrievanceCurrentPage] = useState(1);
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
  const [committeeMembers, setCommitteeMembers] = useState([]);

  const [departments, setDepartments] = useState([]);

  const [officeInfo, setOfficeInfo] = useState({});

  const [officeHours, setOfficeHours] = useState([]);

  // Committee management UI states
  const [selectedCommitteeMember, setSelectedCommitteeMember] = useState(null);
  const [isCommitteeMemberDetailOpen, setIsCommitteeMemberDetailOpen] = useState(false);
  const [isAddCommitteeMemberOpen, setIsAddCommitteeMemberOpen] = useState(false);
  const [isEditCommitteeMemberOpen, setIsEditCommitteeMemberOpen] = useState(false);
  const [isDepartmentManagementOpen, setIsDepartmentManagementOpen] = useState(false);
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [isOfficeInfoEditOpen, setIsOfficeInfoEditOpen] = useState(false);
  const [isOfficeHoursEditOpen, setIsOfficeHoursEditOpen] = useState(false);
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


  // News management states
  const [newsItems, setNewsItems] = useState([]);

  const [newsCategories, setNewsCategories] = useState([]);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [newsStats, setNewsStats] = useState({});

  // News management UI states
  const [newsSearchTerm, setNewsSearchTerm] = useState('');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState('All');
  const [newsPriorityFilter, setNewsPriorityFilter] = useState('All');
  const [newsStatusFilter, setNewsStatusFilter] = useState('All');
  const [newsCurrentPage, setNewsCurrentPage] = useState(1);
  const [newsViewMode, setNewsViewMode] = useState('list');
  const [selectedNews, setSelectedNews] = useState(null);
  const [isNewsDetailOpen, setIsNewsDetailOpen] = useState(false);
  const [isAddNewsOpen, setIsAddNewsOpen] = useState(false);
  const [isEditNewsOpen, setIsEditNewsOpen] = useState(false);
  const [isNewsPreviewOpen, setIsNewsPreviewOpen] = useState(false);
  const [isEventManagementOpen, setIsEventManagementOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isNewsCategoryManagementOpen, setIsNewsCategoryManagementOpen] = useState(false);
  const [isAddNewsCategoryOpen, setIsAddNewsCategoryOpen] = useState(false);
  const [isWeatherManagementOpen, setIsWeatherManagementOpen] = useState(false);
  const [isAddWeatherAlertOpen, setIsAddWeatherAlertOpen] = useState(false);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [weatherStats, setWeatherStats] = useState({});
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
    eventDate: '',
    eventTime: '',
    isActive: true
  });
  const [newWeatherAlert, setNewWeatherAlert] = useState({
    title: { en: '', mr: '' },
    message: { en: '', mr: '' },
    alertType: 'warning',
    severity: 'medium',
    startDate: '',
    endDate: '',
    isActive: true,
    icon: 'AlertTriangle'
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

  // News statistics are now fetched from the API and stored in newsStats state

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

  const handleTaxFileUpload = (event) => {
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
  const handleAddCommitteeMember = async () => {
    if (!newCommitteeMember.name.en || !newCommitteeMember.position.en || !newCommitteeMember.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await adminCreateCommitteeMember(newCommitteeMember);
      toast.success('Committee member added successfully');
      
      // Refresh the committee members list
      await fetchCommitteeMembers();
      
      // Reset form and close modal
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
    } catch (error) {
      console.error('Failed to add committee member:', error);
      toast.error('Failed to add committee member');
    }
  };

  const handleUpdateCommitteeMember = async () => {
    if (!selectedCommitteeMember) return;
    
    try {
      await adminUpdateCommitteeMember(selectedCommitteeMember._id, selectedCommitteeMember);
      toast.success('Committee member updated successfully');
      
      // Refresh the committee members list
      await fetchCommitteeMembers();
      
      // Clear selection and close modal
      setSelectedCommitteeMember(null);
      setIsEditCommitteeMemberOpen(false);
    } catch (error) {
      console.error('Failed to update committee member:', error);
      toast.error('Failed to update committee member');
    }
  };

  const handleDeleteCommitteeMember = async (memberId) => {
    const confirmed = window.confirm('Are you sure you want to delete this committee member?');
    if (!confirmed) return;

    try {
      await adminDeleteCommitteeMember(memberId);
      toast.success('Committee member deleted successfully');
      
      // Refresh the committee members list
      await fetchCommitteeMembers();
    } catch (error) {
      console.error('Failed to delete committee member:', error);
      toast.error('Failed to delete committee member');
    }
  };

  const handleAddDepartment = async () => {
    if (!newDepartment.name.en || !newDepartment.head.en || !newDepartment.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await adminCreateDepartment(newDepartment);
      toast.success('Department added successfully');
      
      // Refresh the departments list
      await fetchDepartments();
      
      // Reset form and close modal
      setNewDepartment({
        name: { en: '', mr: '' },
        head: { en: '', mr: '' },
        phone: '',
        email: '',
        services: []
      });
      setIsAddDepartmentOpen(false);
    } catch (error) {
      console.error('Failed to add department:', error);
      toast.error('Failed to add department');
    }
  };

  const handleUpdateDepartment = async () => {
    if (!selectedDepartment) return;
    
    try {
      await adminUpdateDepartment(selectedDepartment._id, selectedDepartment);
      toast.success('Department updated successfully');
      
      // Refresh the departments list
      await fetchDepartments();
      
      // Clear selection
      setSelectedDepartment(null);
    } catch (error) {
      console.error('Failed to update department:', error);
      toast.error('Failed to update department');
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    const confirmed = window.confirm('Are you sure you want to delete this department?');
    if (!confirmed) return;

    try {
      await adminDeleteDepartment(departmentId);
      toast.success('Department deleted successfully');
      
      // Refresh the departments list
      await fetchDepartments();
    } catch (error) {
      console.error('Failed to delete department:', error);
      toast.error('Failed to delete department');
    }
  };

  // Office Information Management
  const handleUpdateOfficeInfo = async () => {
    try {
      await adminUpdateOfficeInfo(officeInfo);
      toast.success('Office information updated successfully');
      setIsOfficeInfoEditOpen(false);
    } catch (error) {
      console.error('Failed to update office info:', error);
      toast.error('Failed to update office information');
    }
  };

  const handleExportMembersCsv = () => {
    exportCommitteeToCSV();
    toast.success(t({ en: 'Committee members CSV exported successfully', mr: 'समिती सदस्य CSV यशस्वीरित्या एक्सपोर्ट झाला' }));
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
  const handleAddNews = async () => {
    if (!newNewsItem.title.en || !newNewsItem.category || !newNewsItem.content.en) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      // Prepare the data for the API call
      const newsData = {
        title: newNewsItem.title,
        summary: newNewsItem.summary,
        content: newNewsItem.content,
        category: newNewsItem.category,
        priority: newNewsItem.priority,
        tags: newNewsItem.tags,
        imageUrl: newNewsItem.image,
        publishDate: newNewsItem.publishDate || new Date(),
        expiryDate: newNewsItem.expiryDate || undefined,
        isPublished: true,
        isFeatured: newNewsItem.isFeatured,
        isBreaking: newNewsItem.isBreaking
      };

      // Call the API to create the news article
      console.log('Creating news article with data:', newsData);
      const response = await adminCreateNewsArticle(newsData);
      console.log('News article creation response:', response);
      
      // Show success message
      toast.success('News article created successfully!');
      
      // Refresh the news data from the backend
      await fetchNewsData();
      
      // Reset the form
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
      
      // Close the modal
      setIsAddNewsOpen(false);
    } catch (error) {
      console.error('Failed to create news article:', error);
      toast.error('Failed to create news article. Please try again.');
    }
  };

  const handleUpdateNews = async () => {
    if (!selectedNews) return;

    try {
      // Call the API to update the news article
      await adminUpdateNewsArticle(selectedNews._id, selectedNews);
      
      // Show success message
      toast.success('News article updated successfully!');
      
      // Refresh the news data from the backend
      await fetchNewsData();
      
      // Close the modal and reset selection
      setIsEditNewsOpen(false);
      setSelectedNews(null);
    } catch (error) {
      console.error('Failed to update news article:', error);
      toast.error('Failed to update news article. Please try again.');
    }
  };

  const handleDeleteNews = async (newsId) => {
    const confirmed = window.confirm('Are you sure you want to delete this news article? This action cannot be undone.');
    if (!confirmed) return;

    try {
      // Call the API to delete the news article
      await adminDeleteNewsArticle(newsId);
      
      // Show success message
      toast.success('News article deleted successfully!');
      
      // Refresh the news data from the backend
      await fetchNewsData();
    } catch (error) {
      console.error('Failed to delete news article:', error);
      toast.error('Failed to delete news article. Please try again.');
    }
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

  const handleAddEvent = async () => {
    if (!newEvent.title.en || !newEvent.title.mr || !newEvent.eventDate || !newEvent.eventTime) {
      toast.error('Please fill all required fields (Title in both languages, Date, and Time)');
      return;
    }

    try {
      // Prepare the data for the API call
      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        location: newEvent.location,
        eventDate: newEvent.eventDate,
        eventTime: newEvent.eventTime,
        isActive: newEvent.isActive
      };

      console.log('Creating event with data:', eventData);

      // Call the API to create the event
      const response = await adminCreateEvent(eventData);
      console.log('Event creation response:', response);
      
      // Show success message
      toast.success('Event created successfully!');
      
      // Refresh the events data from the backend
      await fetchEvents();
      
      // Reset the form
      setNewEvent({
        title: { en: '', mr: '' },
        description: { en: '', mr: '' },
        location: { en: '', mr: '' },
        eventDate: '',
        eventTime: '',
        isActive: true
      });
      
      // Close the modal
      setIsAddEventOpen(false);
    } catch (error) {
      console.error('Failed to create event:', error);
      toast.error(`Failed to create event: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const confirmed = window.confirm('Are you sure you want to delete this event? This action cannot be undone.');
    if (!confirmed) return;

    try {
      // Call the API to delete the event
      await adminDeleteEvent(eventId);
      
      // Show success message
      toast.success('Event deleted successfully!');
      
      // Refresh the events data from the backend
      await fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event. Please try again.');
    }
  };

  // Weather Alert handlers
  const fetchWeatherAlerts = async () => {
    try {
      const [alertsRes, statsRes] = await Promise.all([
        adminGetAllWeatherAlerts(),
        adminGetWeatherAlertStats()
      ]);
      setWeatherAlerts(alertsRes.data);
      setWeatherStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch weather alerts:', error);
      toast.error('Failed to fetch weather alerts');
    }
  };

  const handleAddWeatherAlert = async () => {
    if (!newWeatherAlert.title.en || !newWeatherAlert.title.mr || !newWeatherAlert.startDate || !newWeatherAlert.endDate) {
      toast.error('Please fill all required fields (Title in both languages, Start Date, and End Date)');
      return;
    }

    try {
      const alertData = {
        title: newWeatherAlert.title,
        message: newWeatherAlert.message,
        alertType: newWeatherAlert.alertType,
        severity: newWeatherAlert.severity,
        startDate: newWeatherAlert.startDate,
        endDate: newWeatherAlert.endDate,
        isActive: newWeatherAlert.isActive,
        icon: newWeatherAlert.icon
      };

      console.log('Creating weather alert with data:', alertData);

      const response = await adminCreateWeatherAlert(alertData);
      console.log('Weather alert creation response:', response);
      
      toast.success('Weather alert created successfully!');
      
      await fetchWeatherAlerts();
      
      setNewWeatherAlert({
        title: { en: '', mr: '' },
        message: { en: '', mr: '' },
        alertType: 'warning',
        severity: 'medium',
        startDate: '',
        endDate: '',
        isActive: true,
        icon: 'AlertTriangle'
      });
      
      setIsAddWeatherAlertOpen(false);
    } catch (error) {
      console.error('Failed to create weather alert:', error);
      toast.error(`Failed to create weather alert: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteWeatherAlert = async (alertId) => {
    const confirmed = window.confirm('Are you sure you want to delete this weather alert? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await adminDeleteWeatherAlert(alertId);
      
      toast.success('Weather alert deleted successfully!');
      
      await fetchWeatherAlerts();
    } catch (error) {
      console.error('Failed to delete weather alert:', error);
      toast.error('Failed to delete weather alert. Please try again.');
    }
  };

  const handleAddNewsCategory = async () => {
    if (!newNewsCategory.label.en) {
      toast.error('Please fill the category name');
      return;
    }

    try {
      // Prepare the data for the API call
      const categoryData = {
        name: newNewsCategory.label,
        icon: newNewsCategory.icon
      };

      // Call the API to create the category
      await adminCreateCategory(categoryData);
      
      // Show success message
      toast.success('News category created successfully!');
      
      // Refresh the categories data from the backend
      await fetchCategories();
      
      // Reset the form
      setNewNewsCategory({ label: { en: '', mr: '' }, icon: 'Newspaper' });
      
      // Close the modal
      setIsAddNewsCategoryOpen(false);
    } catch (error) {
      console.error('Failed to create news category:', error);
      toast.error('Failed to create news category. Please try again.');
    }
  };

  const handleDeleteNewsCategory = async (categoryId) => {
    const confirmed = window.confirm('Are you sure you want to delete this category? This action cannot be undone.');
    if (!confirmed) return;

    try {
      // Call the API to delete the category
      await adminDeleteCategory(categoryId);
      
      // Show success message
      toast.success('News category deleted successfully!');
      
      // Refresh the categories data from the backend
      await fetchCategories();
    } catch (error) {
      console.error('Failed to delete news category:', error);
      toast.error('Failed to delete news category. Please try again.');
    }
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
          <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <TabsList className="grid w-full grid-cols-1 h-auto p-0 bg-white">
              <div className="flex flex-wrap w-full">
                <TabsTrigger value="home" className="flex-1 min-w-0 justify-center px-3 py-3 border-r border-gray-200 last:border-r-0 hover:bg-gray-50 transition-colors">
                  <Home className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t({ en: 'Home Content', mr: 'होम सामग्री' })}</span>
                </TabsTrigger>
                <TabsTrigger value="tax" className="flex-1 min-w-0 justify-center px-3 py-3 border-r border-gray-200 last:border-r-0 hover:bg-gray-50 transition-colors">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t({ en: 'Tax Management', mr: 'कर व्यवस्थापन' })}</span>
                </TabsTrigger>
                <TabsTrigger value="grievances" className="flex-1 min-w-0 justify-center px-3 py-3 border-r border-gray-200 last:border-r-0 hover:bg-gray-50 transition-colors">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t({ en: 'Grievances', mr: 'तक्रारी' })}</span>
                </TabsTrigger>
                <TabsTrigger value="villagers" className="flex-1 min-w-0 justify-center px-3 py-3 border-r border-gray-200 last:border-r-0 hover:bg-gray-50 transition-colors">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t({ en: 'Villagers', mr: 'गावकरी' })}</span>
                </TabsTrigger>
                <TabsTrigger value="committee" className="flex-1 min-w-0 justify-center px-3 py-3 border-r border-gray-200 last:border-r-0 hover:bg-gray-50 transition-colors">
                  <UserCheck className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t({ en: 'Committee', mr: 'समिती' })}</span>
                </TabsTrigger>
                <TabsTrigger value="media" className="flex-1 min-w-0 justify-center px-3 py-3 border-r border-gray-200 last:border-r-0 hover:bg-gray-50 transition-colors">
                  <Camera className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t({ en: 'Media', mr: 'मीडिया' })}</span>
                </TabsTrigger>
                <TabsTrigger value="news" className="flex-1 min-w-0 justify-center px-3 py-3 border-r border-gray-200 last:border-r-0 hover:bg-gray-50 transition-colors">
                  <Newspaper className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t({ en: 'News', mr: 'वार्ता' })}</span>
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

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
                <Button onClick={handleOpenAddModal} className="bg-gray-800 hover:bg-gray-900 text-white">
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
            <div className="space-y-6">
              {/* Grievance Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{t({ en: 'Pending Approval', mr: 'प्रलंबित मंजुरी' })}</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {grievanceLoading ? '-' : grievances.filter(g => g.adminStatus === 'Unapproved').length}
                        </p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{t({ en: 'In Progress', mr: 'प्रगतीपथावर' })}</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {grievanceLoading ? '-' : grievances.filter(g => g.progressStatus === 'In-progress').length}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{t({ en: 'Resolved', mr: 'निराकरण झाले' })}</p>
                        <p className="text-2xl font-bold text-green-600">
                          {grievanceLoading ? '-' : grievances.filter(g => g.progressStatus === 'Resolved').length}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{t({ en: 'Total Workers', mr: 'एकूण कामगार' })}</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {grievanceLoading ? '-' : workers.filter(w => w.status === 'active').length}
                        </p>
                      </div>
                      <BadgeIcon className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Worker Management Button */}
              <div className="flex justify-end mb-4">
                <Dialog open={isWorkerModalOpen} onOpenChange={setIsWorkerModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleOpenWorkerModal} className="bg-gray-800 hover:bg-gray-900 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      {t({ en: 'Manage Workers', mr: 'कामगार व्यवस्थापन' })}
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">
                        {t({ en: 'Worker Management', mr: 'कामगार व्यवस्थापन' })}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {/* Current Workers List */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          {t({ en: 'Current Workers', mr: 'वर्तमान कामगार' })}
              </h3>
                        <div className="grid gap-4">
                          {workers.map((worker) => (
                            <div key={worker._id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-semibold">{worker.name}</h4>
                                  <p className="text-sm text-gray-600">{worker.department}</p>
                                  <div className="flex gap-4 mt-1 text-sm">
                                    {worker.phone && <span>📞 {worker.phone}</span>}
                                    {worker.email && <span>📧 {worker.email}</span>}
                                    <span className={
                                      worker.status === 'active' 
                                        ? 'text-green-600 font-medium' 
                                        : 'text-gray-500'
                                    }>
                                      {worker.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleEditWorkerClick(worker)}
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    {t({ en: 'Edit', mr: 'सुधारा' })}
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => handleDeleteWorker(worker._id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    {t({ en: 'Delete', mr: 'हटवा' })}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                          {workers.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              {t({ en: 'No workers found', mr: 'कोणत्याही कामगारांचा दिसत नाही' })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Worker Form */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          {editingWorker 
                            ? t({ en: 'Edit Worker', mr: 'कामगार सुधारा' })
                            : t({ en: 'Add New Worker', mr: 'नवीन कामगार जोडा' })
                          }
                        </h3>
                        
                        <form onSubmit={handleWorkerFormSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name">{t({ en: 'Name', mr: 'नाव' })} *</Label>
                              <Input
                                id="name"
                                name="name"
                                value={workerFormData.name}
                                onChange={handleWorkerFormChange}
                                placeholder={t({ en: 'Enter worker name', mr: 'कामगाराचे नाव टाका' })}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="department">{t({ en: 'Department', mr: 'विभाग' })} *</Label>
                              <Input
                                id="department"
                                name="department"
                                value={workerFormData.department}
                                onChange={handleWorkerFormChange}
                                placeholder={t({ en: 'Enter department', mr: 'विभाग टाका' })}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">{t({ en: 'Phone', mr: 'फोन' })}</Label>
                              <Input
                                id="phone"
                                name="phone"
                                value={workerFormData.phone}
                                onChange={handleWorkerFormChange}
                                placeholder={t({ en: 'Enter phone number', mr: 'फोन नंबर टाका' })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">{t({ en: 'Email', mr: 'ईमेल' })}</Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={workerFormData.email}
                                onChange={handleWorkerFormChange}
                                placeholder={t({ en: 'Enter email address', mr: 'ईमेल पत्ता टाका' })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="status">{t({ en: 'Status', mr: 'स्थिती' })}</Label>
                              <Select
                                name="status"
                                value={workerFormData.status}
                                onValueChange={(value) => 
                                  setWorkerFormData(prev => ({ ...prev, status: value }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={t({ en: 'Select status', mr: 'स्थिती निवडा' })} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">{t({ en: 'Active', mr: 'सक्रिय' })}</SelectItem>
                                  <SelectItem value="inactive">{t({ en: 'Inactive', mr: 'निष्क्रिय' })}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="flex gap-3 pt-4">
                            <Button 
                              type="submit" 
                              className="bg-gray-800 hover:bg-gray-900 text-white flex-1"
                            >
                              {editingWorker 
                                ? t({ en: 'Update Worker', mr: 'कामगार अद्यतनित करा' })
                                : t({ en: 'Add Worker', mr: 'कामगार जोडा' })
                              }
                            </Button>
                            <Button 
                              type="button"
                              variant="outline" 
                              onClick={() => setIsWorkerModalOpen(false)}
                            >
                              {t({ en: 'Cancel', mr: 'रद्द करा' })}
                            </Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Grievances Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{t({ en: 'All Grievances', mr: 'सर्व तक्रारी' })}</CardTitle>
                </CardHeader>
                <CardContent>
                  {grievanceLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t({ en: 'ID', mr: 'आयडी' })}</TableHead>
                            <TableHead>{t({ en: 'Title', mr: 'विषय' })}</TableHead>
                            <TableHead>{t({ en: 'Submitted By', mr: 'सबमिट केले' })}</TableHead>
                            <TableHead>{t({ en: 'Category', mr: 'श्रेणी' })}</TableHead>
                            <TableHead>{t({ en: 'Priority', mr: 'प्राधान्यता' })}</TableHead>
                            <TableHead>{t({ en: 'Admin Status', mr: 'व्यवस्थापक स्थिती' })}</TableHead>
                            <TableHead>{t({ en: 'Progress Status', mr: 'प्रगती स्थिती' })}</TableHead>
                            <TableHead>{t({ en: 'Assigned Worker', mr: 'नियुक्त कामगार' })}</TableHead>
                            <TableHead>{t({ en: 'Action', mr: 'क्रिया' })}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {grievances.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                                {t({ en: 'No grievances found', mr: 'कोणत्याही तक्रारी नाही' })}
                              </TableCell>
                            </TableRow>
                          ) : (
                            grievances.map((grievance) => (
                              <TableRow key={grievance._id}>
                                <TableCell className="font-medium">{grievance._id.substring(0, 8)}...</TableCell>
                                <TableCell className="max-w-xs truncate">{grievance.title}</TableCell>
                                <TableCell>{grievance.submittedBy?.name || 'N/A'}</TableCell>
                                <TableCell>
                                  <Badge variant="secondary">{grievance.category}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={
                                    grievance.priority === 'Urgent' ? 'destructive' : 
                                    grievance.priority === 'High' ? 'default' : 'secondary'
                                  }>
                                    {grievance.priority}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={
                                    grievance.adminStatus === 'Approved' ? 'default' : 
                                    grievance.adminStatus === 'Rejected' ? 'destructive' : 'secondary'
                                  }>
                                    {grievance.adminStatus}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={
                                    grievance.progressStatus === 'Resolved' ? 'default' : 
                                    grievance.progressStatus === 'In-progress' ? 'secondary' : '_outline'
                                  }>
                                    {grievance.progressStatus}
                                  </Badge>
                                </TableCell>
                                <TableCell>{grievance.assignedWorker?.name || 'Unassigned'}</TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleOpenDetailModal(grievance)}
                                    >
                                      {t({ en: 'View', mr: 'पहा' })}
                                    </Button>
                                    {grievance.adminStatus === 'Unapproved' && (
                                      <>
                                        <Button 
                                          size="sm" 
                                          style={{ backgroundColor: '#18d235', color: 'white' }}
                                          onClick={() => handleUpdateAdminStatus(grievance._id, 'Approved')}
                                        >
                                          {t({ en: 'Approve', mr: 'मंजूर' })}
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="destructive"
                                          onClick={() => handleUpdateAdminStatus(grievance._id, 'Rejected')}
                                        >
                                          {t({ en: 'Reject', mr: 'नकार' })}
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
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Grievance Detail Modal */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    {t({ en: 'Grievance Details', mr: 'तक्रार तपशील' })}
                  </DialogTitle>
                  <DialogDescription>
                    {t({ en: 'View and manage grievance information', mr: 'तक्रार माहिती पहा आणि व्यवस्थापित करा' })}
                  </DialogDescription>
                </DialogHeader>
                
                {selectedGrievance ? (
                  <div className="flex-1 overflow-y-auto">
                    <div className="space-y-6 p-1">
                      {/* Header Notice */}
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-md">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-blue-700">
                              <strong>Scroll down to view all grievance information, including photos and management actions.</strong>
                              <br />
                              <span className="text-xs text-blue-600">🔧 Photos are compressed & stored efficiently - images will load reliably after page refresh!</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    
                    {/* Grievance Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">{t({ en: 'Basic Information', mr: 'मूलभूत माहिती' })}</h3>
                        <div className="space-y-3">
                          <div>
                            <Label className="font-medium">{t({ en: 'ID', mr: 'आयडी' })}</Label>
                            <p className="text-gray-700 text-xs">{selectedGrievance._id}</p>
                          </div>
                          <div>
                            <Label className="font-medium">{t({ en: 'Photo Summary', mr: 'फोटो सारांश' })}</Label>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div className="flex gap-4">
                                <span><strong>{t({ en: 'Submitted Photos:', mr: 'सबमिट केलेले फोटो:' })}</strong> {selectedGrievance.photos ? selectedGrievance.photos.length : 0}</span>
                                <span><strong>{t({ en: 'Resolution Photos:', mr: 'निराकरण फोटो:' })}</strong> {selectedGrievance.resolutionPhotos ? selectedGrievance.resolutionPhotos.length : 0}</span>
                              </div>
                              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
                                {t({ en: '📸 Photos loaded successfully', mr: '📸 फोटो यशस्वीरित्या लोड झाले' })}
                              </div>
                            </div>
                          </div>
                          <div>
                            <Label className="font-medium">{t({ en: 'Title', mr: 'विषय' })}</Label>
                            <p className="text-gray-700">{selectedGrievance.title || 'No title provided'}</p>
                          </div>
                          <div>
                            <Label className="font-medium">{t({ en: 'Description', mr: 'वर्णन' })}</Label>
                            <p className="text-gray-700">{selectedGrievance.description || 'No description provided'}</p>
                          </div>
                          <div>
                            <Label className="font-medium">{t({ en: 'Category', mr: 'श्रेणी' })}</Label>
                            <Badge variant="secondary">{selectedGrievance.category || 'No category'}</Badge>
                          </div>
                          <div>
                            <Label className="font-medium">{t({ en: 'Priority', mr: 'प्राधान्यता' })}</Label>
                            <Badge variant={
                              selectedGrievance.priority === 'Urgent' ? 'destructive' : 
                              selectedGrievance.priority === 'High' ? 'default' : 'secondary'
                            }>
                              {selectedGrievance.priority || 'Normal'}
                            </Badge>
                          </div>
                          {selectedGrievance.location && (
                            <div>
                              <Label className="font-medium">{t({ en: 'Location', mr: 'स्थान' })}</Label>
                              <p className="text-gray-700">📍 {selectedGrievance.location}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">{t({ en: 'Status & Assignment', mr: 'स्थिती आणि नियुक्ती' })}</h3>
                        <div className="space-y-3">
                          <div>
                            <Label className="font-medium">{t({ en: 'Admin Status', mr: 'व्यवस्थापक स्थिती' })}</Label>
                            <Badge variant={
                              selectedGrievance.adminStatus === 'Approved' ? 'default' : 
                              selectedGrievance.adminStatus === 'Rejected' ? 'destructive' : 'secondary'
                            }>
                              {selectedGrievance.adminStatus}
                            </Badge>
                          </div>
                          <div>
                            <Label className="font-medium">{t({ en: 'Progress Status', mr: 'प्रगती स्थिती' })}</Label>
                            <Badge variant={
                              selectedGrievance.progressStatus === 'Resolved' ? 'default' : 
                              selectedGrievance.progressStatus === 'In-progress' ? 'secondary' : '_outline'
                            }>
                              {selectedGrievance.progressStatus}
                            </Badge>
                          </div>
                          <div>
                            <Label className="font-medium">{t({ en: 'Assigned Worker', mr: 'नियुक्त कामगार' })}</Label>
                            <p className="text-gray-700">
                              {selectedGrievance.assignedWorker?.name || t({ en: 'Unassigned', mr: 'नियुक्त नाही' })}
                            </p>
                            {selectedGrievance.assignedWorker && (
                              <p className="text-sm text-gray-500">
                                {selectedGrievance.assignedWorker.department}
                              </p>
                            )}
              </div>
                          <div>
                            <Label className="font-medium">{t({ en: 'Submitted By', mr: 'सबमिट केले' })}</Label>
                            <p className="text-gray-700">{selectedGrievance.submittedBy?.name || 'N/A'}</p>
                            {selectedGrievance.adminStatus === 'Approved' && selectedGrievance.submittedBy?.email && (
                              <p className="text-sm text-gray-500">{selectedGrievance.submittedBy.email}</p>
                            )}
                          </div>
                          <div>
                            <Label className="font-medium">{t({ en: 'Submitted Date', mr: 'सबमिट दिनांक' })}</Label>
                            <p className="text-gray-700">
                              {new Date(selectedGrievance.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    {selectedGrievance.adminStatus === 'Unapproved' && (
                      <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-3">{t({ en: 'Admin Actions', mr: 'प्रशासक क्रिया' })}</h3>
                        <div className="flex gap-3">
                          <Button 
                            style={{ backgroundColor: '#18d235', color: 'white' }}
                            onClick={() => handleUpdateAdminStatus(selectedGrievance._id, 'Approved')}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {t({ en: 'Approve', mr: 'मंजूर' })}
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={() => handleUpdateAdminStatus(selectedGrievance._id, 'Rejected')}
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            {t({ en: 'Reject', mr: 'नकार' })}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Worker Assignment */}
                    {selectedGrievance.adminStatus === 'Approved' && (
                      <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-3">{t({ en: 'Worker Assignment', mr: 'कामगार नियुक्ती' })}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="worker-select">{t({ en: 'Assign Worker', mr: 'कामगार नियुक्त करा' })}</Label>
                            <Select
                              value={selectedGrievance.assignedWorker?._id || 'unassigned'}
                              onValueChange={(workerId) => handleAssignWorker(workerId)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={t({ en: 'Select a worker', mr: 'कामगार निवडा' })} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unassigned">{t({ en: 'Unassigned', mr: 'नियुक्त नाही' })}</SelectItem>
                                {workers.map((worker) => (
                                  <SelectItem key={worker._id} value={worker._id}>
                                    {worker.name} - {worker.department}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="status-select">{t({ en: 'Update Status', mr: 'स्थिती अद्यतनित करा' })}</Label>
                            <Select
                              value={selectedGrievance.progressStatus || 'Pending'}
                              onValueChange={(status) => handleUpdateProgress(status)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={t({ en: 'Select status', mr: 'स्थिती निवडा' })} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">{t({ en: 'Pending', mr: 'प्रलंबित' })}</SelectItem>
                                <SelectItem value="In-progress">{t({ en: 'In Progress', mr: 'प्रगतीपथावर' })}</SelectItem>
                                <SelectItem value="Resolved">{t({ en: 'Resolved', mr: 'निराकरण झाले' })}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Resolution Photos Section */}
                    {selectedGrievance?.adminStatus === 'Approved' && selectedGrievance?.progressStatus === 'In-progress' && (
                      <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-3">{t({ en: 'Proof of Resolution', mr: 'निराकरणाचा पुरावा' })}</h3>
                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <div>
                              <Label htmlFor="resolution-photos">{t({ en: 'Upload Resolution Photos', mr: 'निराकरण फोटो अपलोड करा' })}</Label>
                              <input
                                id="resolution-photos"
                                type="file"
                                accept="image/*"
                                onChange={handleResolutionUpload}
                                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                            </div>
                          </div>
                          
                          {resolutionPhotos.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">{t({ en: 'Uploaded Resolution Photos', mr: 'अपलोड केलेले निराकरण फोटो' })}</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                {resolutionPhotos.map((photo, index) => (
                                  <div key={index} className="aspect-square overflow-hidden rounded-lg border">
                                    <ImageWithFallback 
                                      src={photo} 
                                      alt={`Resolution photo ${index + 1}`} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                              <Button 
                                onClick={handleMarkAsResolved}
                                className="bg-gray-800 hover:bg-gray-900 text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {t({ en: 'Mark as Resolved', mr: 'निराकरण चिन्हांकित करा' })}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Resolution Photos Display */}
                    {selectedGrievance.resolutionPhotos && selectedGrievance.resolutionPhotos.length > 0 && (
                      <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-3">{t({ en: 'Resolution Photos', mr: 'निराकरण फोटो' })}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {selectedGrievance.resolutionPhotos.map((photo, index) => (
                            <div key={index} className="aspect-square overflow-hidden rounded-lg border">
                              <ImageWithFallback 
                                src={photo} 
                                alt={`Resolution photo ${index + 1}`} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Submitted Photos Section */}
                    {selectedGrievance.photos && selectedGrievance.photos.length > 0 && (
                      <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-3">{t({ en: 'Submitted Photos', mr: 'सबमिट केलेले फोटो' })}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {selectedGrievance.photos.map((photo, index) => (
                            <div key={index} className="aspect-square overflow-hidden rounded-lg border">
                              <ImageWithFallback 
                                src={photo} 
                                alt={`Grievance photo ${index + 1}`} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    </div>
                  </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">{t({ en: 'Loading grievance details...', mr: 'तक्रार तपशील लोड करत आहे...' })}</p>
                      </div>
                    )}
                
                <div className="flex justify-end pt-4 border-t mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDetailModalOpen(false)}
                  >
                    {t({ en: 'Close', mr: 'बंद करा' })}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="committee">
            <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
              {/* Committee Management Header */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {t({ en: 'Committee Management', mr: 'समिती व्यवस्थापन' })}
                    </h1>
                    <p className="text-gray-600 text-lg">
                      {t({ en: 'Manage committee members, departments, and office information', mr: 'समिती सदस्य, विभाग आणि कार्यालय माहिती व्यवस्थापित करा' })}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => setIsAddCommitteeMemberOpen(true)} 
                      className="bg-teal-600 hover:bg-teal-700 text-blue
                       px-6 py-3 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t({ en: 'Add Member', mr: 'सदस्य जोडा' })}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                      onClick={handleExportMembersCsv}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t({ en: 'Export CSV', mr: 'CSV एक्सपोर्ट करा' })}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <CardContent className="pt-6 pb-6 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {committeeMembers.filter(m => m.isActive).length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t({ en: 'Active Members', mr: 'सक्रिय सदस्य' })}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <CardContent className="pt-6 pb-6 text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      {departments.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t({ en: 'Departments', mr: 'विभाग' })}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <CardContent className="pt-6 pb-6 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {committeeMembers.filter(m => m.ward && m.ward !== 'Administrative').length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t({ en: 'Ward Members', mr: 'वार्ड सदस्य' })}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <CardContent className="pt-6 pb-6 text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {committeeMembers.filter(m => m.position?.en?.toLowerCase().includes('sarpanch') || m.position?.en?.toLowerCase().includes('deputy')).length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t({ en: 'Key Positions', mr: 'मुख्य पदे' })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card 
                  className="bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1" 
                  onClick={() => setIsDepartmentManagementOpen(true)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                        <Settings className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {t({ en: 'Manage Departments', mr: 'विभाग व्यवस्थापित करा' })}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t({ en: 'Add, edit, or remove departments', mr: 'विभाग जोडा, संपादित करा किंवा काढा' })}
                    </p>
                  </CardContent>
                </Card>

                <Card 
                  className="bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1" 
                  onClick={() => setIsOfficeInfoEditOpen(true)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                        <MapPin className="h-6 w-6 text-green-600" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {t({ en: 'Office Information', mr: 'कार्यालय माहिती' })}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t({ en: 'Update contact details and hours', mr: 'संपर्क माहिती आणि वेळा अपडेट करा' })}
                    </p>
                  </CardContent>
                </Card>

                <Card 
                  className="bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1" 
                  onClick={() => setIsOfficeHoursEditOpen(true)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                        <Calendar className="h-6 w-6 text-purple-600" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {t({ en: 'Office Hours', mr: 'कार्यालयीन वेळा' })}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {officeInfo?.officeHours && officeInfo.officeHours.length > 0 
                        ? `${t({ en: 'Monday - Saturday', mr: 'सोमवार - शनिवार' })}: ${officeInfo.officeHours[0]?.hours || '9 AM - 5 PM'}`
                        : t({ en: 'Monday - Saturday: 9 AM - 5 PM', mr: 'सोमवार - शनिवार: 9 AM - 5 PM' })
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Committee Members Table */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {t({ en: 'Committee Members', mr: 'समिती सदस्य' })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow className="border-b border-gray-200">
                          <TableHead className="font-semibold text-gray-700 py-4 px-6">{t({ en: 'Name', mr: 'नाव' })}</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-4 px-6">{t({ en: 'Position', mr: 'पद' })}</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-4 px-6">{t({ en: 'Ward/Department', mr: 'वार्ड/विभाग' })}</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-4 px-6">{t({ en: 'Contact', mr: 'संपर्क' })}</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-4 px-6">{t({ en: 'Term', mr: 'कार्यकाळ' })}</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-4 px-6">{t({ en: 'Status', mr: 'स्थिती' })}</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-4 px-6 text-right">{t({ en: 'Actions', mr: 'क्रिया' })}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {committeeMembers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-16 text-gray-500">
                              <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                  <User className="h-10 w-10 text-gray-400" />
                                </div>
                                <p className="text-xl font-semibold text-gray-700 mb-2">{t({ en: 'No committee members found', mr: 'कोणतेही समिती सदस्य नाही' })}</p>
                                <p className="text-gray-500 mb-4">{t({ en: 'Add your first committee member to get started', mr: 'सुरुवात करण्यासाठी आपला पहिला समिती सदस्य जोडा' })}</p>
                                <Button 
                                  onClick={() => setIsAddCommitteeMemberOpen(true)}
                                  className="bg-teal-600 hover:bg-teal-700 text-white"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  {t({ en: 'Add First Member', mr: 'पहिला सदस्य जोडा' })}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          committeeMembers.map((member, index) => (
                            <TableRow 
                              key={member._id || member.id} 
                              className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                            >
                              <TableCell className="py-4 px-6">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <span className="text-purple-600 font-bold text-base">
                                      {member.name?.en?.charAt(0) || member.name?.mr?.charAt(0) || 'M'}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-900">{member.name?.en || ''}</div>
                                    <div className="text-sm text-gray-500">{member.name?.mr || ''}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-4 px-6">
                                <div>
                                  <div className="font-medium text-gray-900">{member.position?.en || ''}</div>
                                  <div className="text-sm text-gray-500">{member.position?.mr || ''}</div>
                                </div>
                              </TableCell>
                              <TableCell className="py-4 px-6">
                                {member.ward && member.ward !== 'Administrative' ? (
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
                                    {member.ward}
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="bg-gray-100 text-gray-800 font-medium">
                                    {t({ en: 'Administrative', mr: 'प्रशासकीय' })}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="py-4 px-6">
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm font-medium">{member.phone || '-'}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">{member.email || '-'}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-4 px-6">
                                <div className="text-sm space-y-1">
                                  <div className="font-medium text-gray-900">{t({ en: 'From', mr: 'पासून' })}: {member.joinDate ? new Date(member.joinDate).toLocaleDateString() : '-'}</div>
                                  <div className="text-gray-600">{t({ en: 'Until', mr: 'पर्यंत' })}: {member.termEnd ? new Date(member.termEnd).toLocaleDateString() : '-'}</div>
                                </div>
                              </TableCell>
                              <TableCell className="py-4 px-6">
                                <Badge 
                                  variant={member.isActive ? 'default' : 'secondary'}
                                  className={`font-medium ${member.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                                >
                                  {member.isActive 
                                    ? t({ en: 'Active', mr: 'सक्रिय' })
                                    : t({ en: 'Inactive', mr: 'निष्क्रिय' })
                                  }
                                </Badge>
                              </TableCell>
                              <TableCell className="py-4 px-6 text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedCommitteeMember(member);
                                      setIsCommitteeMemberDetailOpen(true);
                                    }}
                                    className="hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedCommitteeMember(member);
                                      setIsEditCommitteeMemberOpen(true);
                                    }}
                                    className="hover:bg-yellow-50 hover:border-yellow-300 transition-colors duration-200"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteCommitteeMember(member._id)}
                                    className="hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

            </div>
          </TabsContent>


          <TabsContent value="news">
            <div className="space-y-6">
              {/* News Management Header */}
              <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{t({ en: 'News Management', mr: 'बातम्या व्यवस्थापन' })}</h2>
                  <p className="text-gray-600 mt-1">{t({ en: 'Manage village news, announcements, alerts and events', mr: 'गावातील बातम्या, घोषणा, सूचना आणि कार्यक्रम व्यवस्थापित करा' })}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setIsAddNewsOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    {t({ en: 'Add News', mr: 'बातमी जोडा' })}
                  </Button>
                  <Button onClick={() => {
                    // CSV Export functionality
                    const csvContent = [
                      ['Title (EN)', 'Title (MR)', 'Category', 'Priority', 'Status', 'Featured', 'Breaking', 'Reads', 'Published Date'].join(','),
                      ...newsItems.map(news => [
                        `"${news.title?.en || ''}"`,
                        `"${news.title?.mr || ''}"`,
                        `"${newsCategories.find(cat => cat._id === news.category)?.name?.en || ''}"`,
                        `"${news.priority || ''}"`,
                        `"${news.isPublished ? 'Published' : 'Draft'}"`,
                        `"${news.isFeatured ? 'Yes' : 'No'}"`,
                        `"${news.isBreaking ? 'Yes' : 'No'}"`,
                        `"${news.readCount || 0}"`,
                        `"${new Date(news.publishDate).toLocaleDateString()}"`
                      ].join(','))
                    ].join('\n');
                    
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement('a');
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', `news_export_${new Date().toISOString().split('T')[0]}.csv`);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }} variant="outline" className="border-indigo-500 text-indigo-600 hover:bg-indigo-50">
                    <Download className="h-4 w-4 mr-2" />
                    {t({ en: 'Export CSV', mr: 'CSV एक्सपोर्ट' })}
                  </Button>
                </div>
              </div>

              {/* News Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-indigo-600">{newsStats.articles?.total || 0}</div>
                    <div className="text-sm text-gray-600">{t({ en: 'Total News', mr: 'एकूण बातम्या' })}</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{newsStats.articles?.published || 0}</div>
                    <div className="text-sm text-gray-600">{t({ en: 'Published', mr: 'प्रकाशित' })}</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-gray-600">{newsStats.articles?.draft || 0}</div>
                    <div className="text-sm text-gray-600">{t({ en: 'Draft', mr: 'मसौदा' })}</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{newsStats.articles?.featured || 0}</div>
                    <div className="text-sm text-gray-600">{t({ en: 'Featured', mr: 'विशेष' })}</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{newsStats.articles?.breaking || 0}</div>
                    <div className="text-sm text-gray-600">{t({ en: 'Breaking', mr: 'तातडीची' })}</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{newsItems.filter(n => n.priority === 'high').length}</div>
                    <div className="text-sm text-gray-600">{t({ en: 'High Priority', mr: 'उच्च प्राधान्य' })}</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{newsItems.reduce((sum, n) => sum + (n.readCount || 0), 0)}</div>
                    <div className="text-sm text-gray-600">{t({ en: 'Total Reads', mr: 'एकूण वाचन' })}</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-teal-600">{upcomingEvents.filter(e => e.isActive).length}</div>
                    <div className="text-sm text-gray-600">{t({ en: 'Active Events', mr: 'सक्रिय कार्यक्रम' })}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow" onClick={() => setIsEventManagementOpen(true)}>
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-blue-600" />
                    <h3 className="font-bold mb-2">{t({ en: 'Manage Events', mr: 'कार्यक्रम व्यवस्थापन' })}</h3>
                    <p className="text-sm text-gray-600">{t({ en: 'Add, edit, or remove upcoming events', mr: 'आगामी कार्यक्रम जोडा, संपादित करा किंवा काढा' })}</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow" onClick={() => setIsNewsCategoryManagementOpen(true)}>
                  <CardContent className="p-6 text-center">
                    <Tag className="h-12 w-12 mx-auto mb-3 text-green-600" />
                    <h3 className="font-bold mb-2">{t({ en: 'News Categories', mr: 'बातम्या श्रेणी' })}</h3>
                    <p className="text-sm text-gray-600">{t({ en: 'Manage news categories and types', mr: 'बातम्या श्रेणी आणि प्रकार व्यवस्थापित करा' })}</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow" onClick={() => setIsWeatherManagementOpen(true)}>
                  <CardContent className="p-6 text-center">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-yellow-600" />
                    <h3 className="font-bold mb-2">{t({ en: 'Weather Alerts', mr: 'हवामान सूचना' })}</h3>
                    <p className="text-sm text-gray-600">{t({ en: 'Manage weather alerts and warnings', mr: 'हवामान सूचना आणि चेतावणी व्यवस्थापित करा' })}</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Bell className="h-12 w-12 mx-auto mb-3 text-orange-600" />
                    <h3 className="font-bold mb-2">{t({ en: 'Notification Settings', mr: 'सूचना सेटिंग्ज' })}</h3>
                    <p className="text-sm text-gray-600">{t({ en: 'Configure notification preferences', mr: 'सूचना प्राथमिकता कॉन्फिगर करा' })}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Search and Filter Controls */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder={t({ en: 'Search by title, content, tags...', mr: 'शीर्षक, सामग्री, टॅगने शोधा...' })}
                          value={newsSearchTerm}
                          onChange={(e) => setNewsSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Select value={newsCategoryFilter} onValueChange={setNewsCategoryFilter}>
                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">{t({ en: 'All Categories', mr: 'सर्व श्रेणी' })}</SelectItem>
                          {newsCategories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name.en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={newsPriorityFilter} onValueChange={setNewsPriorityFilter}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">{t({ en: 'All Priority', mr: 'सर्व प्राधान्य' })}</SelectItem>
                          <SelectItem value="high">{t({ en: 'High', mr: 'उच्च' })}</SelectItem>
                          <SelectItem value="medium">{t({ en: 'Medium', mr: 'मध्यम' })}</SelectItem>
                          <SelectItem value="low">{t({ en: 'Low', mr: 'कमी' })}</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={newsStatusFilter} onValueChange={setNewsStatusFilter}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">{t({ en: 'All Status', mr: 'सर्व स्थिती' })}</SelectItem>
                          <SelectItem value="Published">{t({ en: 'Published', mr: 'प्रकाशित' })}</SelectItem>
                          <SelectItem value="Draft">{t({ en: 'Draft', mr: 'मसौदा' })}</SelectItem>
                          <SelectItem value="Featured">{t({ en: 'Featured', mr: 'विशेष' })}</SelectItem>
                          <SelectItem value="Breaking">{t({ en: 'Breaking', mr: 'तातडीची' })}</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant={newsViewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setNewsViewMode('grid')}>
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button variant={newsViewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setNewsViewMode('list')}>
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* News List */}
              {newsViewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedNews.map((news) => (
                    <Card key={news._id} className="border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-all">
                      <CardContent className="p-0">
                        {news.imageUrl && (
                          <div className="h-48 bg-gray-200 overflow-hidden">
                            <img src={news.imageUrl} alt={news.title.en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                        )}
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {newsCategories.find(cat => cat._id === news.category)?.name?.en || 'News'}
                            </Badge>
                            <Badge 
                              variant={news.priority === 'high' ? 'destructive' : 
                                       news.priority === 'medium' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {news.priority}
                            </Badge>
                            {news.isFeatured && (
                              <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                                Featured
                              </Badge>
                            )}
                            {news.isBreaking && (
                              <Badge variant="destructive" className="text-xs">
                                Breaking
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {news.title.en}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                            {news.summary.en}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <span>{new Date(news.publishDate).toLocaleDateString()}</span>
                            <span>{news.readCount} reads</span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedNews(news);
                                setIsEditNewsOpen(true);
                              }}
                              className="flex-1"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteNews(news._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-0 shadow-xl">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t({ en: 'Title', mr: 'शीर्षक' })}</TableHead>
                            <TableHead>{t({ en: 'Category', mr: 'श्रेणी' })}</TableHead>
                            <TableHead>{t({ en: 'Priority', mr: 'प्राधान्य' })}</TableHead>
                            <TableHead>{t({ en: 'Date', mr: 'तारीख' })}</TableHead>
                            <TableHead>{t({ en: 'Status', mr: 'स्थिती' })}</TableHead>
                            <TableHead>{t({ en: 'Reads', mr: 'वाचन' })}</TableHead>
                            <TableHead>{t({ en: 'Actions', mr: 'क्रिया' })}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedNews.map((news) => (
                            <TableRow key={news._id} className="hover:bg-gray-50">
                              <TableCell>
                                <div>
                                  <div className="font-medium">{news.title.en}</div>
                                  <div className="text-sm text-gray-500 line-clamp-1">{news.summary.en}</div>
                                  <div className="flex gap-1 mt-1">
                                    {news.isFeatured && (
                                      <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                                        Featured
                                      </Badge>
                                    )}
                                    {news.isBreaking && (
                                      <Badge variant="destructive" className="text-xs">
                                        Breaking
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="text-xs">
                                  {newsCategories.find(cat => cat._id === news.category)?.name?.en || 'News'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={news.priority === 'high' ? 'destructive' : 
                                           news.priority === 'medium' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {news.priority}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>{new Date(news.publishDate).toLocaleDateString()}</div>
                                  <div className="text-gray-500">{new Date(news.publishDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                                  Published
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {news.readCount}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedNews(news);
                                      setIsNewsDetailOpen(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedNews(news);
                                      setIsEditNewsOpen(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDeleteNews(news._id)}
                                    className="text-red-600 hover:text-red-700"
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
              )}

              {/* Pagination */}
              {totalNewsPages > 1 && (
                <div className="flex justify-center">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewsCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={newsCurrentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <span className="flex items-center px-3 text-sm text-gray-600">
                      Page {newsCurrentPage} of {totalNewsPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewsCurrentPage(prev => Math.min(prev + 1, totalNewsPages))}
                      disabled={newsCurrentPage === totalNewsPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Media Management Tab */}
          <TabsContent value="media" className="space-y-6">
            <div className="space-y-6">
              {/* Media Management Header */}
              <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{t({ en: 'Media Management', mr: 'मीडिया व्यवस्थापन' })}</h2>
                  <p className="text-gray-600 mt-1">{t({ en: 'Manage photos, videos, and media categories', mr: 'फोटो, व्हिडिओ आणि मीडिया श्रेण्या व्यवस्थापित करा' })}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => setIsAddMediaOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t({ en: 'Add Media', mr: 'मीडिया जोडा' })}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                    onClick={() => setIsCategoryModalOpen(true)}
                  >
                    <Folder className="h-4 w-4 mr-2" />
                    {t({ en: 'Manage Categories', mr: 'श्रेण्या व्यवस्थापित करा' })}
                  </Button>
                </div>
              </div>

              {/* Media Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{t({ en: 'Total Media', mr: 'एकूण मीडिया' })}</p>
                        <p className="text-2xl font-bold text-gray-900">{mediaItems.length}</p>
                      </div>
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Camera className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{t({ en: 'Photos', mr: 'फोटो' })}</p>
                        <p className="text-2xl font-bold text-gray-900">{mediaItems.filter(item => item.mediaType === 'Photo').length}</p>
                      </div>
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Image className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{t({ en: 'Videos', mr: 'व्हिडिओ' })}</p>
                        <p className="text-2xl font-bold text-gray-900">{mediaItems.filter(item => item.mediaType === 'Video').length}</p>
                      </div>
                      <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Video className="h-4 w-4 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{t({ en: 'Categories', mr: 'श्रेण्या' })}</p>
                        <p className="text-2xl font-bold text-gray-900">{mediaCategories.length}</p>
                      </div>
                      <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <Folder className="h-4 w-4 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{t({ en: 'Featured', mr: 'विशेष' })}</p>
                        <p className="text-2xl font-bold text-gray-900">{mediaItems.filter(item => item.isFeatured).length}</p>
                      </div>
                      <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{t({ en: 'Total Views', mr: 'एकूण दृश्ये' })}</p>
                        <p className="text-2xl font-bold text-gray-900">{mediaItems.reduce((sum, item) => sum + (item.views || 0), 0)}</p>
                      </div>
                      <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Eye className="h-4 w-4 text-indigo-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{t({ en: 'Total Likes', mr: 'एकूण लाइक्स' })}</p>
                        <p className="text-2xl font-bold text-gray-900">{mediaItems.reduce((sum, item) => sum + (item.likes || 0), 0)}</p>
                      </div>
                      <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                        <Heart className="h-4 w-4 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{t({ en: 'This Month', mr: 'या महिन्यात' })}</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {mediaItems.filter(item => {
                            const itemDate = new Date(item.createdAt);
                            const now = new Date();
                            return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
                          }).length}
                        </p>
                      </div>
                      <div className="h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-teal-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Media Items Table */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    {t({ en: 'All Media Items', mr: 'सर्व मीडिया आयटम' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t({ en: 'Thumbnail', mr: 'थंबनेल' })}</TableHead>
                          <TableHead>{t({ en: 'Title', mr: 'शीर्षक' })}</TableHead>
                          <TableHead>{t({ en: 'Type', mr: 'प्रकार' })}</TableHead>
                          <TableHead>{t({ en: 'Category', mr: 'श्रेणी' })}</TableHead>
                          <TableHead>{t({ en: 'Date', mr: 'तारीख' })}</TableHead>
                          <TableHead>{t({ en: 'Views', mr: 'दृश्ये' })}</TableHead>
                          <TableHead>{t({ en: 'Likes', mr: 'लाइक्स' })}</TableHead>
                          <TableHead>{t({ en: 'Actions', mr: 'क्रिया' })}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mediaItems.map((item) => (
                          <TableRow key={item._id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                {item.thumbnailUrl ? (
                                  <img 
                                    src={item.thumbnailUrl} 
                                    alt={item.title.en}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src = 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop';
                                    }}
                                  />
                                ) : item.mediaType === 'Photo' ? (
                                  <img 
                                    src={item.fileUrl || 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop'} 
                                    alt={item.title.en}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src = 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop';
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <Video className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{item.title.en}</div>
                                {item.title.mr && (
                                  <div className="text-sm text-gray-500">{item.title.mr}</div>
                                )}
                                {item.isFeatured && (
                                  <Badge variant="outline" className="text-xs border-purple-200 text-purple-700 mt-1">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={item.mediaType === 'Photo' ? 'secondary' : 'default'}
                                className="text-xs"
                              >
                                {item.mediaType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {item.category?.name?.en || 'Uncategorized'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                                <div className="text-gray-500">{new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {item.views || 0}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {item.likes || 0}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => window.open(item.fileUrl, '_blank')}
                                  title="View Media"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedMedia(item);
                                    setIsEditMediaOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleDeleteMediaItem(item._id)}
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
            </div>
          </TabsContent>
        </Tabs>

        {/* News Detail Modal */}
        <Dialog open={isNewsDetailOpen} onOpenChange={setIsNewsDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle>{t({ en: 'News Article Details', mr: 'लेख तपशील' })}</DialogTitle>
            
            {selectedNews && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedNews.title.en}</h3>
                    {selectedNews.title.mr && (
                      <h4 className="text-base text-gray-600 mb-2">{selectedNews.title.mr}</h4>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsNewsDetailOpen(false);
                        setIsEditNewsOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setIsNewsDetailOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
                
                {selectedNews.imageUrl && (
                  <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={selectedNews.imageUrl} 
                      alt={selectedNews.title.en} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Category</Label>
                    <p className="text-sm text-gray-600">
                      {newsCategories.find(cat => cat._id === selectedNews.category)?.name?.en || 'News'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Priority</Label>
                    <p className="text-sm text-gray-600">{selectedNews.priority}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Read Count</Label>
                    <p className="text-sm text-gray-600">{selectedNews.readCount}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Summary</Label>
                  <p className="text-sm text-gray-600 mt-1">{selectedNews.summary.en}</p>
                  {selectedNews.summary.mr && (
                    <p className="text-sm text-gray-600 mt-1">{selectedNews.summary.mr}</p>
                  )}
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Content</Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{selectedNews.content.en}</p>
                    {selectedNews.content.mr && (
                      <p className="text-sm text-gray-800 whitespace-pre-wrap mt-4">{selectedNews.content.mr}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Published Date</Label>
                    <p className="text-sm text-gray-600">{new Date(selectedNews.publishDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Author</Label>
                    <p className="text-sm text-gray-600">{selectedNews.author?.name || 'Admin'}</p>
                  </div>
                </div>
                
                {selectedNews.tags && selectedNews.tags.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedNews.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* News Category Management Modal */}
        <Dialog open={isNewsCategoryManagementOpen} onOpenChange={setIsNewsCategoryManagementOpen}>
          <DialogContent className="max-w-2xl">
            <DialogTitle>{t({ en: 'Manage News Categories', mr: 'वार्ता वर्ग व्यवस्थापन' })}</DialogTitle>
            
            {/* Categories List */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {newsCategories.length > 0 ? (
                newsCategories.map((category) => (
                  <div key={category._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 rounded-full">
                        <Newspaper className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <span className="font-medium">{category.name.en}</span>
                        {category.name.mr && (
                          <span className="text-gray-500 ml-2">({category.name.mr})</span>
                        )}
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleDeleteNewsCategory(category._id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="mb-2">No categories created yet</p>
                  <p className="text-sm">Create your first news category below</p>
                </div>
              )}
            </div>
            
            {/* Add Category Form */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{t({ en: 'Add New Category', mr: 'नवीन वर्ग जोडा' })}</h3>
                {newsCategories.length === 0 && (
                  <div className="flex gap-2">
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setNewNewsCategory({
                          label: { en: 'General News', mr: 'सामान्य बातम्या' },
                          icon: 'Newspaper'
                        });
                      }}
                      className="text-xs"
                    >
                      General
                    </Button>
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setNewNewsCategory({
                          label: { en: 'Announcements', mr: 'घोषणा' },
                          icon: 'Megaphone'
                        });
                      }}
                      className="text-xs"
                    >
                      Announcements
                    </Button>
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setNewNewsCategory({
                          label: { en: 'Events', mr: 'कार्यक्रम' },
                          icon: 'Calendar'
                        });
                      }}
                      className="text-xs"
                    >
                      Events
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t({ en: 'Category Name (English)', mr: 'वर्ग नाव (इंग्रजी)' })}</Label>
                  <Input
                    value={newNewsCategory.label.en}
                    onChange={(e) => setNewNewsCategory({
                      ...newNewsCategory,
                      label: { ...newNewsCategory.label, en: e.target.value }
                    })}
                    placeholder="Enter category name"
                  />
                </div>
                
                <div>
                  <Label>{t({ en: 'Category Name (Marathi)', mr: 'वर्ग नाव (मराठी)' })}</Label>
                  <Input
                    value={newNewsCategory.label.mr}
                    onChange={(e) => setNewNewsCategory({
                      ...newNewsCategory,
                      label: { ...newNewsCategory.label, mr: e.target.value }
                    })}
                    placeholder="वर्ग नाव प्रविष्ट करा"
                  />
                </div>
              </div>
              
              <div>
                <Label>{t({ en: 'Icon Name', mr: 'आयकॉन नाव' })}</Label>
                <Input
                  value={newNewsCategory.icon}
                  onChange={(e) => setNewNewsCategory({
                    ...newNewsCategory,
                    icon: e.target.value
                  })}
                  placeholder="e.g., Newspaper, Calendar, AlertTriangle"
                />
              </div>
              
              <Button onClick={handleAddNewsCategory} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {t({ en: 'Add Category', mr: 'वर्ग जोडा' })}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Event Management Modal */}
        <Dialog open={isEventManagementOpen} onOpenChange={setIsEventManagementOpen}>
          <DialogContent className="max-w-2xl">
            <DialogTitle>{t({ en: 'Manage Events', mr: 'कार्यक्रम व्यवस्थापन' })}</DialogTitle>
            
            {/* Events List */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {upcomingEvents.map((event) => (
                <div key={event._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-full">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <span className="font-medium">{event.title.en}</span>
                      {event.title.mr && (
                        <span className="text-gray-500 ml-2">({event.title.mr})</span>
                      )}
                      <div className="text-sm text-gray-500">
                        {new Date(event.eventDate).toLocaleDateString()} at {event.eventTime}
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleDeleteEvent(event._id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            {/* Add Event Form */}
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold">{t({ en: 'Add New Event', mr: 'नवीन कार्यक्रम जोडा' })}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t({ en: 'Event Title (English)', mr: 'कार्यक्रम शीर्षक (इंग्रजी)' })} *</Label>
                  <Input
                    value={newEvent.title.en}
                    onChange={(e) => setNewEvent({
                      ...newEvent,
                      title: { ...newEvent.title, en: e.target.value }
                    })}
                    placeholder="Enter event title"
                    required
                  />
                </div>
                
                <div>
                  <Label>{t({ en: 'Event Title (Marathi)', mr: 'कार्यक्रम शीर्षक (मराठी)' })} *</Label>
                  <Input
                    value={newEvent.title.mr}
                    onChange={(e) => setNewEvent({
                      ...newEvent,
                      title: { ...newEvent.title, mr: e.target.value }
                    })}
                    placeholder="कार्यक्रम शीर्षक प्रविष्ट करा"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t({ en: 'Event Date', mr: 'कार्यक्रम तारीख' })} *</Label>
                  <Input
                    type="date"
                    value={newEvent.eventDate}
                    onChange={(e) => setNewEvent({
                      ...newEvent,
                      eventDate: e.target.value
                    })}
                    required
                  />
                </div>
                
                <div>
                  <Label>{t({ en: 'Event Time', mr: 'कार्यक्रम वेळ' })} *</Label>
                  <Input
                    type="time"
                    value={newEvent.eventTime}
                    onChange={(e) => setNewEvent({
                      ...newEvent,
                      eventTime: e.target.value
                    })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t({ en: 'Location (English)', mr: 'स्थान (इंग्रजी)' })}</Label>
                  <Input
                    value={newEvent.location.en}
                    onChange={(e) => setNewEvent({
                      ...newEvent,
                      location: { ...newEvent.location, en: e.target.value }
                    })}
                    placeholder="Enter event location"
                  />
                </div>
                
                <div>
                  <Label>{t({ en: 'Location (Marathi)', mr: 'स्थान (मराठी)' })}</Label>
                  <Input
                    value={newEvent.location.mr}
                    onChange={(e) => setNewEvent({
                      ...newEvent,
                      location: { ...newEvent.location, mr: e.target.value }
                    })}
                    placeholder="कार्यक्रम स्थान प्रविष्ट करा"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t({ en: 'Description (English)', mr: 'वर्णन (इंग्रजी)' })}</Label>
                  <Textarea
                    value={newEvent.description.en}
                    onChange={(e) => setNewEvent({
                      ...newEvent,
                      description: { ...newEvent.description, en: e.target.value }
                    })}
                    placeholder="Enter event description"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label>{t({ en: 'Description (Marathi)', mr: 'वर्णन (मराठी)' })}</Label>
                  <Textarea
                    value={newEvent.description.mr}
                    onChange={(e) => setNewEvent({
                      ...newEvent,
                      description: { ...newEvent.description, mr: e.target.value }
                    })}
                    placeholder="कार्यक्रम वर्णन प्रविष्ट करा"
                    rows={3}
                  />
                </div>
              </div>
              
              <Button onClick={handleAddEvent} className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                {t({ en: 'Add Event', mr: 'कार्यक्रम जोडा' })}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Weather Alert Management Modal */}
        <Dialog open={isWeatherManagementOpen} onOpenChange={setIsWeatherManagementOpen}>
          <DialogContent className="max-w-2xl">
            <DialogTitle>{t({ en: 'Manage Weather Alerts', mr: 'हवामान सूचना व्यवस्थापन' })}</DialogTitle>
            
            {/* Weather Alerts List */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {weatherAlerts.map((alert) => (
                <div key={alert._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-50 rounded-full">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <span className="font-medium">{alert.title.en}</span>
                      {alert.title.mr && (
                        <span className="text-gray-500 ml-2">({alert.title.mr})</span>
                      )}
                      <div className="text-sm text-gray-500">
                        {alert.severity} • {new Date(alert.startDate).toLocaleDateString()} - {new Date(alert.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleDeleteWeatherAlert(alert._id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            {/* Add Weather Alert Form */}
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold">{t({ en: 'Add New Weather Alert', mr: 'नवीन हवामान सूचना जोडा' })}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t({ en: 'Alert Title (English)', mr: 'सूचना शीर्षक (इंग्रजी)' })} *</Label>
                  <Input
                    value={newWeatherAlert.title.en}
                    onChange={(e) => setNewWeatherAlert({
                      ...newWeatherAlert,
                      title: { ...newWeatherAlert.title, en: e.target.value }
                    })}
                    placeholder="Enter alert title"
                    required
                  />
                </div>
                
                <div>
                  <Label>{t({ en: 'Alert Title (Marathi)', mr: 'सूचना शीर्षक (मराठी)' })} *</Label>
                  <Input
                    value={newWeatherAlert.title.mr}
                    onChange={(e) => setNewWeatherAlert({
                      ...newWeatherAlert,
                      title: { ...newWeatherAlert.title, mr: e.target.value }
                    })}
                    placeholder="सूचना शीर्षक प्रविष्ट करा"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t({ en: 'Alert Message (English)', mr: 'सूचना संदेश (इंग्रजी)' })}</Label>
                  <Textarea
                    value={newWeatherAlert.message.en}
                    onChange={(e) => setNewWeatherAlert({
                      ...newWeatherAlert,
                      message: { ...newWeatherAlert.message, en: e.target.value }
                    })}
                    placeholder="Enter alert message"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label>{t({ en: 'Alert Message (Marathi)', mr: 'सूचना संदेश (मराठी)' })}</Label>
                  <Textarea
                    value={newWeatherAlert.message.mr}
                    onChange={(e) => setNewWeatherAlert({
                      ...newWeatherAlert,
                      message: { ...newWeatherAlert.message, mr: e.target.value }
                    })}
                    placeholder="सूचना संदेश प्रविष्ट करा"
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>{t({ en: 'Alert Type', mr: 'सूचना प्रकार' })}</Label>
                  <Select value={newWeatherAlert.alertType} onValueChange={(value) => setNewWeatherAlert({
                    ...newWeatherAlert,
                    alertType: value
                  })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warning">{t({ en: 'Warning', mr: 'चेतावणी' })}</SelectItem>
                      <SelectItem value="info">{t({ en: 'Info', mr: 'माहिती' })}</SelectItem>
                      <SelectItem value="severe">{t({ en: 'Severe', mr: 'गंभीर' })}</SelectItem>
                      <SelectItem value="advisory">{t({ en: 'Advisory', mr: 'सल्ला' })}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t({ en: 'Severity', mr: 'गंभीरता' })}</Label>
                  <Select value={newWeatherAlert.severity} onValueChange={(value) => setNewWeatherAlert({
                    ...newWeatherAlert,
                    severity: value
                  })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{t({ en: 'Low', mr: 'कमी' })}</SelectItem>
                      <SelectItem value="medium">{t({ en: 'Medium', mr: 'मध्यम' })}</SelectItem>
                      <SelectItem value="high">{t({ en: 'High', mr: 'उच्च' })}</SelectItem>
                      <SelectItem value="critical">{t({ en: 'Critical', mr: 'गंभीर' })}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t({ en: 'Icon', mr: 'आयकॉन' })}</Label>
                  <Select value={newWeatherAlert.icon} onValueChange={(value) => setNewWeatherAlert({
                    ...newWeatherAlert,
                    icon: value
                  })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AlertTriangle">Warning</SelectItem>
                      <SelectItem value="CloudRain">Rain</SelectItem>
                      <SelectItem value="Sun">Sun</SelectItem>
                      <SelectItem value="Cloud">Cloud</SelectItem>
                      <SelectItem value="Zap">Lightning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t({ en: 'Start Date', mr: 'प्रारंभ तारीख' })} *</Label>
                  <Input
                    type="date"
                    value={newWeatherAlert.startDate}
                    onChange={(e) => setNewWeatherAlert({
                      ...newWeatherAlert,
                      startDate: e.target.value
                    })}
                    required
                  />
                </div>
                
                <div>
                  <Label>{t({ en: 'End Date', mr: 'समाप्ती तारीख' })} *</Label>
                  <Input
                    type="date"
                    value={newWeatherAlert.endDate}
                    onChange={(e) => setNewWeatherAlert({
                      ...newWeatherAlert,
                      endDate: e.target.value
                    })}
                    required
                  />
                </div>
              </div>
              
              <Button onClick={handleAddWeatherAlert} className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                {t({ en: 'Add Weather Alert', mr: 'हवामान सूचना जोडा' })}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add News Article Modal */}
        <Dialog open={isAddNewsOpen} onOpenChange={setIsAddNewsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle>{t({ en: 'Add News Article', mr: 'नवीन लेख जोडा' })}</DialogTitle>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t({ en: 'Title (English)', mr: 'शीर्षक (इंग्रजी)' })} *</Label>
                  <Input
                    value={newNewsItem.title.en}
                    onChange={(e) => setNewNewsItem({
                      ...newNewsItem,
                      title: { ...newNewsItem.title, en: e.target.value }
                    })}
                    placeholder="Enter article title"
                  />
                </div>
                
                <div>
                  <Label>{t({ en: 'Title (Marathi)', mr: 'शीर्षक (मराठी)' })}</Label>
                  <Input
                    value={newNewsItem.title.mr}
                    onChange={(e) => setNewNewsItem({
                      ...newNewsItem,
                      title: { ...newNewsItem.title, mr: e.target.value }
                    })}
                    placeholder="लेख शीर्षक प्रविष्ट करा"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t({ en: 'Summary (English)', mr: 'सारांश (इंग्रजी)' })}</Label>
                  <Textarea
                    value={newNewsItem.summary.en}
                    onChange={(e) => setNewNewsItem({
                      ...newNewsItem,
                      summary: { ...newNewsItem.summary, en: e.target.value }
                    })}
                    placeholder="Enter article summary"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label>{t({ en: 'Summary (Marathi)', mr: 'सारांश (मराठी)' })}</Label>
                  <Textarea
                    value={newNewsItem.summary.mr}
                    onChange={(e) => setNewNewsItem({
                      ...newNewsItem,
                      summary: { ...newNewsItem.summary, mr: e.target.value }
                    })}
                    placeholder="लेख सारांश प्रविष्ट करा"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t({ en: 'Content (English)', mr: 'सामग्री (इंग्रजी)' })} *</Label>
                  <Textarea
                    value={newNewsItem.content.en}
                    onChange={(e) => setNewNewsItem({
                      ...newNewsItem,
                      content: { ...newNewsItem.content, en: e.target.value }
                    })}
                    placeholder="Enter article content"
                    rows={5}
                  />
                </div>
                
                <div>
                  <Label>{t({ en: 'Content (Marathi)', mr: 'सामग्री (मराठी)' })}</Label>
                  <Textarea
                    value={newNewsItem.content.mr}
                    onChange={(e) => setNewNewsItem({
                      ...newNewsItem,
                      content: { ...newNewsItem.content, mr: e.target.value }
                    })}
                    placeholder="लेख सामग्री प्रविष्ट करा"
                    rows={5}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>{t({ en: 'Category', mr: 'वर्ग' })} *</Label>
                    {newsCategories.length === 0 && (
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setIsAddNewsOpen(false);
                          setIsNewsCategoryManagementOpen(true);
                        }}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Create Category
                      </Button>
                    )}
                  </div>
                  <Select value={newNewsItem.category} onValueChange={(value) => setNewNewsItem({
                    ...newNewsItem,
                    category: value
                  })}>
                    <SelectTrigger>
                      <SelectValue placeholder={newsCategories.length === 0 ? "No categories - Create one first" : "Select category"} />
                    </SelectTrigger>
                    <SelectContent>
                      {newsCategories.length > 0 ? (
                        newsCategories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name.en}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-categories" disabled>
                          No categories available - Click "Create Category" button above
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>{t({ en: 'Priority', mr: 'प्राधान्य' })}</Label>
                  <Select value={newNewsItem.priority} onValueChange={(value) => setNewNewsItem({
                    ...newNewsItem,
                    priority: value
                  })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{t({ en: 'Low', mr: 'कमी' })}</SelectItem>
                      <SelectItem value="medium">{t({ en: 'Medium', mr: 'मध्यम' })}</SelectItem>
                      <SelectItem value="high">{t({ en: 'High', mr: 'उच्च' })}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>{t({ en: 'Image', mr: 'छायाचित्र' })}</Label>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Compress and convert to base64
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            setNewNewsItem({
                              ...newNewsItem,
                              image: result
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    <Input
                      value={newNewsItem.image}
                      onChange={(e) => setNewNewsItem({
                        ...newNewsItem,
                        image: e.target.value
                      })}
                      placeholder="Or paste image URL here..."
                      className="text-sm"
                    />
                    {newNewsItem.image && (
                      <div className="mt-2">
                        <img 
                          src={newNewsItem.image} 
                          alt="Preview" 
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <p className="text-xs text-gray-500 mt-1">Image preview</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newNewsItem.isFeatured}
                    onChange={(e) => setNewNewsItem({
                      ...newNewsItem,
                      isFeatured: e.target.checked
                    })}
                  />
                  <Label htmlFor="featured">{t({ en: 'Featured Article', mr: 'विशेष लेख' })}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="breaking"
                    checked={newNewsItem.isBreaking}
                    onChange={(e) => setNewNewsItem({
                      ...newNewsItem,
                      isBreaking: e.target.checked
                    })}
                  />
                  <Label htmlFor="breaking">{t({ en: 'Breaking News', mr: 'तातडीची बातमी' })}</Label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddNewsOpen(false)}>
                  {t({ en: 'Cancel', mr: 'रद्द करा' })}
                </Button>
                <Button onClick={handleAddNews} className="bg-indigo-600 hover:bg-indigo-700">
                  {t({ en: 'Create Article', mr: 'लेख तयार करा' })}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit News Article Modal */}
        <Dialog open={isEditNewsOpen} onOpenChange={setIsEditNewsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle>{t({ en: 'Edit News Article', mr: 'लेख संपादित करा' })}</DialogTitle>
            
            {selectedNews && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t({ en: 'Title (English)', mr: 'शीर्षक (इंग्रजी)' })} *</Label>
                    <Input
                      value={selectedNews.title?.en || ''}
                      onChange={(e) => setSelectedNews({
                        ...selectedNews,
                        title: { ...selectedNews.title, en: e.target.value }
                      })}
                      placeholder="Enter article title"
                    />
                  </div>
                  
                  <div>
                    <Label>{t({ en: 'Title (Marathi)', mr: 'शीर्षक (मराठी)' })}</Label>
                    <Input
                      value={selectedNews.title?.mr || ''}
                      onChange={(e) => setSelectedNews({
                        ...selectedNews,
                        title: { ...selectedNews.title, mr: e.target.value }
                      })}
                      placeholder="लेख शीर्षक प्रविष्ट करा"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t({ en: 'Summary (English)', mr: 'सारांश (इंग्रजी)' })}</Label>
                    <Textarea
                      value={selectedNews.summary?.en || ''}
                      onChange={(e) => setSelectedNews({
                        ...selectedNews,
                        summary: { ...selectedNews.summary, en: e.target.value }
                      })}
                      placeholder="Enter article summary"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label>{t({ en: 'Summary (Marathi)', mr: 'सारांश (मराठी)' })}</Label>
                    <Textarea
                      value={selectedNews.summary?.mr || ''}
                      onChange={(e) => setSelectedNews({
                        ...selectedNews,
                        summary: { ...selectedNews.summary, mr: e.target.value }
                      })}
                      placeholder="लेख सारांश प्रविष्ट करा"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t({ en: 'Content (English)', mr: 'सामग्री (इंग्रजी)' })} *</Label>
                    <Textarea
                      value={selectedNews.content?.en || ''}
                      onChange={(e) => setSelectedNews({
                        ...selectedNews,
                        content: { ...selectedNews.content, en: e.target.value }
                      })}
                      placeholder="Enter article content"
                      rows={5}
                    />
                  </div>
                  
                  <div>
                    <Label>{t({ en: 'Content (Marathi)', mr: 'सामग्री (मराठी)' })}</Label>
                    <Textarea
                      value={selectedNews.content?.mr || ''}
                      onChange={(e) => setSelectedNews({
                        ...selectedNews,
                        content: { ...selectedNews.content, mr: e.target.value }
                      })}
                      placeholder="लेख सामग्री प्रविष्ट करा"
                      rows={5}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>{t({ en: 'Category', mr: 'वर्ग' })} *</Label>
                      {newsCategories.length === 0 && (
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setIsEditNewsOpen(false);
                            setIsNewsCategoryManagementOpen(true);
                          }}
                          className="text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Create Category
                        </Button>
                      )}
                    </div>
                    <Select value={selectedNews.category} onValueChange={(value) => setSelectedNews({
                      ...selectedNews,
                      category: value
                    })}>
                      <SelectTrigger>
                        <SelectValue placeholder={newsCategories.length === 0 ? "No categories - Create one first" : "Select category"} />
                      </SelectTrigger>
                      <SelectContent>
                        {newsCategories.length > 0 ? (
                          newsCategories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name.en}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-categories" disabled>
                            No categories available - Click "Create Category" button above
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>{t({ en: 'Priority', mr: 'प्राधान्य' })}</Label>
                    <Select value={selectedNews.priority} onValueChange={(value) => setSelectedNews({
                      ...selectedNews,
                      priority: value
                    })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{t({ en: 'Low', mr: 'कमी' })}</SelectItem>
                        <SelectItem value="medium">{t({ en: 'Medium', mr: 'मध्यम' })}</SelectItem>
                        <SelectItem value="high">{t({ en: 'High', mr: 'उच्च' })}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>{t({ en: 'Image', mr: 'छायाचित्र' })}</Label>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Compress and convert to base64
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const result = event.target?.result as string;
                              setSelectedNews({
                                ...selectedNews,
                                imageUrl: result
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      <Input
                        value={selectedNews.imageUrl || ''}
                        onChange={(e) => setSelectedNews({
                          ...selectedNews,
                          imageUrl: e.target.value
                        })}
                        placeholder="Or paste image URL here..."
                        className="text-sm"
                      />
                      {selectedNews.imageUrl && (
                        <div className="mt-2">
                          <img 
                            src={selectedNews.imageUrl} 
                            alt="Preview" 
                            className="w-20 h-20 object-cover rounded border"
                          />
                          <p className="text-xs text-gray-500 mt-1">Image preview</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-featured"
                      checked={selectedNews.isFeatured || false}
                      onChange={(e) => setSelectedNews({
                        ...selectedNews,
                        isFeatured: e.target.checked
                      })}
                    />
                    <Label htmlFor="edit-featured">{t({ en: 'Featured Article', mr: 'विशेष लेख' })}</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-breaking"
                      checked={selectedNews.isBreaking || false}
                      onChange={(e) => setSelectedNews({
                        ...selectedNews,
                        isBreaking: e.target.checked
                      })}
                    />
                    <Label htmlFor="edit-breaking">{t({ en: 'Breaking News', mr: 'तातडीची बातमी' })}</Label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditNewsOpen(false)}>
                    {t({ en: 'Cancel', mr: 'रद्द करा' })}
                  </Button>
                  <Button onClick={handleUpdateNews} className="bg-indigo-600 hover:bg-indigo-700">
                    {t({ en: 'Save Changes', mr: 'बदल जतन करा' })}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Department Management Modal */}
        <Dialog open={isDepartmentManagementOpen} onOpenChange={setIsDepartmentManagementOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle>{t({ en: 'Department Management', mr: 'विभाग व्यवस्थापन' })}</DialogTitle>
            
            <div className="space-y-6">
              {/* Add Department Button */}
              <div className="flex justify-end">
                <Button onClick={() => setIsAddDepartmentOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t({ en: 'Add Department', mr: 'विभाग जोडा' })}
                </Button>
              </div>

              {/* Departments List */}
              <div className="space-y-4">
                {departments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {t({ en: 'No departments found', mr: 'कोणतेही विभाग नाही' })}
                  </p>
                ) : (
                  departments.map((dept) => (
                    <div key={dept._id || dept.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold">{dept.name?.en || ''}</h3>
                            <Badge variant={dept.isActive ? 'default' : 'secondary'}>
                              {dept.isActive 
                                ? t({ en: 'Active', mr: 'सक्रिय' })
                                : t({ en: 'Inactive', mr: 'निष्क्रिय' })
                              }
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div><strong>{t({ en: 'Head', mr: 'प्रमुख' })}:</strong> {dept.head?.en || ''}</div>
                            <div><strong>{t({ en: 'Phone', mr: 'फोन' })}:</strong> {dept.phone || '-'}</div>
                            <div><strong>{t({ en: 'Email', mr: 'ईमेल' })}:</strong> {dept.email || '-'}</div>
                            {dept.services && dept.services.length > 0 && (
                              <div>
                                <strong>{t({ en: 'Services', mr: 'सेवा' })}:</strong>
                                <ul className="list-disc list-inside ml-2">
                                  {dept.services.map((service, index) => (
                                    <li key={index}>{service.en}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDepartment(dept);
                              setIsAddDepartmentOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDepartment(dept._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Department Modal */}
        <Dialog open={isAddDepartmentOpen} onOpenChange={setIsAddDepartmentOpen}>
          <DialogContent className="max-w-2xl">
            <DialogTitle>
              {selectedDepartment 
                ? t({ en: 'Edit Department', mr: 'विभाग संपादित करा' })
                : t({ en: 'Add Department', mr: 'विभाग जोडा' })
              }
            </DialogTitle>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dept-name-en">{t({ en: 'Department Name (English)', mr: 'विभाग नाव (इंग्रजी)' })} *</Label>
                  <Input
                    id="dept-name-en"
                    value={selectedDepartment ? selectedDepartment.name?.en : newDepartment.name.en}
                    onChange={(e) => {
                      if (selectedDepartment) {
                        setSelectedDepartment({
                          ...selectedDepartment,
                          name: { ...selectedDepartment.name, en: e.target.value }
                        });
                      } else {
                        setNewDepartment({
                          ...newDepartment,
                          name: { ...newDepartment.name, en: e.target.value }
                        });
                      }
                    }}
                    placeholder="Department name in English"
                  />
                </div>
                <div>
                  <Label htmlFor="dept-name-mr">{t({ en: 'Department Name (Marathi)', mr: 'विभाग नाव (मराठी)' })}</Label>
                  <Input
                    id="dept-name-mr"
                    value={selectedDepartment ? selectedDepartment.name?.mr : newDepartment.name.mr}
                    onChange={(e) => {
                      if (selectedDepartment) {
                        setSelectedDepartment({
                          ...selectedDepartment,
                          name: { ...selectedDepartment.name, mr: e.target.value }
                        });
                      } else {
                        setNewDepartment({
                          ...newDepartment,
                          name: { ...newDepartment.name, mr: e.target.value }
                        });
                      }
                    }}
                    placeholder="विभाग नाव मराठीत"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dept-head-en">{t({ en: 'Head (English)', mr: 'प्रमुख (इंग्रजी)' })} *</Label>
                  <Input
                    id="dept-head-en"
                    value={selectedDepartment ? selectedDepartment.head?.en : newDepartment.head.en}
                    onChange={(e) => {
                      if (selectedDepartment) {
                        setSelectedDepartment({
                          ...selectedDepartment,
                          head: { ...selectedDepartment.head, en: e.target.value }
                        });
                      } else {
                        setNewDepartment({
                          ...newDepartment,
                          head: { ...newDepartment.head, en: e.target.value }
                        });
                      }
                    }}
                    placeholder="Head name in English"
                  />
                </div>
                <div>
                  <Label htmlFor="dept-head-mr">{t({ en: 'Head (Marathi)', mr: 'प्रमुख (मराठी)' })}</Label>
                  <Input
                    id="dept-head-mr"
                    value={selectedDepartment ? selectedDepartment.head?.mr : newDepartment.head.mr}
                    onChange={(e) => {
                      if (selectedDepartment) {
                        setSelectedDepartment({
                          ...selectedDepartment,
                          head: { ...selectedDepartment.head, mr: e.target.value }
                        });
                      } else {
                        setNewDepartment({
                          ...newDepartment,
                          head: { ...newDepartment.head, mr: e.target.value }
                        });
                      }
                    }}
                    placeholder="प्रमुख नाव मराठीत"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dept-phone">{t({ en: 'Phone', mr: 'फोन' })} *</Label>
                  <Input
                    id="dept-phone"
                    value={selectedDepartment ? selectedDepartment.phone : newDepartment.phone}
                    onChange={(e) => {
                      if (selectedDepartment) {
                        setSelectedDepartment({ ...selectedDepartment, phone: e.target.value });
                      } else {
                        setNewDepartment({ ...newDepartment, phone: e.target.value });
                      }
                    }}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <Label htmlFor="dept-email">{t({ en: 'Email', mr: 'ईमेल' })}</Label>
                  <Input
                    id="dept-email"
                    value={selectedDepartment ? selectedDepartment.email : newDepartment.email}
                    onChange={(e) => {
                      if (selectedDepartment) {
                        setSelectedDepartment({ ...selectedDepartment, email: e.target.value });
                      } else {
                        setNewDepartment({ ...newDepartment, email: e.target.value });
                      }
                    }}
                    placeholder="department@village.gov.in"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDepartmentOpen(false);
                    setSelectedDepartment(null);
                  }}
                >
                  {t({ en: 'Cancel', mr: 'रद्द करा' })}
                </Button>
                <Button onClick={selectedDepartment ? handleUpdateDepartment : handleAddDepartment}>
                  {selectedDepartment 
                    ? t({ en: 'Update Department', mr: 'विभाग अद्यतनित करा' })
                    : t({ en: 'Add Department', mr: 'विभाग जोडा' })
                  }
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Office Information Edit Modal */}
        <Dialog open={isOfficeInfoEditOpen} onOpenChange={setIsOfficeInfoEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogTitle>{t({ en: 'Edit Office Information', mr: 'कार्यालय माहिती संपादित करा' })}</DialogTitle>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="office-address-en">{t({ en: 'Address (English)', mr: 'पत्ता (इंग्रजी)' })}</Label>
                <Textarea
                  id="office-address-en"
                  value={officeInfo.address?.en || ''}
                  onChange={(e) => setOfficeInfo({
                    ...officeInfo,
                    address: { ...officeInfo.address, en: e.target.value }
                  })}
                  placeholder="Office address in English"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="office-address-mr">{t({ en: 'Address (Marathi)', mr: 'पत्ता (मराठी)' })}</Label>
                <Textarea
                  id="office-address-mr"
                  value={officeInfo.address?.mr || ''}
                  onChange={(e) => setOfficeInfo({
                    ...officeInfo,
                    address: { ...officeInfo.address, mr: e.target.value }
                  })}
                  placeholder="कार्यालय पत्ता मराठीत"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="office-phone">{t({ en: 'Phone', mr: 'फोन' })}</Label>
                  <Input
                    id="office-phone"
                    value={officeInfo.phone || ''}
                    onChange={(e) => setOfficeInfo({ ...officeInfo, phone: e.target.value })}
                    placeholder="+91 20 1234 5678"
                  />
                </div>
                <div>
                  <Label htmlFor="office-email">{t({ en: 'Email', mr: 'ईमेल' })}</Label>
                  <Input
                    id="office-email"
                    value={officeInfo.email || ''}
                    onChange={(e) => setOfficeInfo({ ...officeInfo, email: e.target.value })}
                    placeholder="office@village.gov.in"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="office-emergency">{t({ en: 'Emergency Contact', mr: 'आपत्कालीन संपर्क' })}</Label>
                <Input
                  id="office-emergency"
                  value={officeInfo.emergencyContact || ''}
                  onChange={(e) => setOfficeInfo({ ...officeInfo, emergencyContact: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <Label htmlFor="office-meeting-en">{t({ en: 'Public Meeting Info (English)', mr: 'सार्वजनिक सभा माहिती (इंग्रजी)' })}</Label>
                <Textarea
                  id="office-meeting-en"
                  value={officeInfo.publicMeetingInfo?.en || ''}
                  onChange={(e) => setOfficeInfo({
                    ...officeInfo,
                    publicMeetingInfo: { ...officeInfo.publicMeetingInfo, en: e.target.value }
                  })}
                  placeholder="Public meeting information in English"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="office-meeting-mr">{t({ en: 'Public Meeting Info (Marathi)', mr: 'सार्वजनिक सभा माहिती (मराठी)' })}</Label>
                <Textarea
                  id="office-meeting-mr"
                  value={officeInfo.publicMeetingInfo?.mr || ''}
                  onChange={(e) => setOfficeInfo({
                    ...officeInfo,
                    publicMeetingInfo: { ...officeInfo.publicMeetingInfo, mr: e.target.value }
                  })}
                  placeholder="सार्वजनिक सभा माहिती मराठीत"
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsOfficeInfoEditOpen(false)}
                >
                  {t({ en: 'Cancel', mr: 'रद्द करा' })}
                </Button>
                <Button onClick={handleUpdateOfficeInfo}>
                  {t({ en: 'Save Changes', mr: 'बदल जतन करा' })}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Committee Member Modal */}
        <Dialog open={isAddCommitteeMemberOpen} onOpenChange={setIsAddCommitteeMemberOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {t({ en: 'Add Committee Member', mr: 'समिती सदस्य जोडा' })}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  {t({ en: 'Basic Information', mr: 'मूलभूत माहिती' })}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name-en" className="text-sm font-medium text-gray-700">
                      {t({ en: 'Name (English)', mr: 'नाव (इंग्रजी)' })} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name-en"
                      value={newCommitteeMember.name.en}
                      onChange={(e) => setNewCommitteeMember({
                        ...newCommitteeMember,
                        name: { ...newCommitteeMember.name, en: e.target.value }
                      })}
                      placeholder={t({ en: 'Enter name in English', mr: 'इंग्रजीत नाव टाका' })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="name-mr" className="text-sm font-medium text-gray-700">
                      {t({ en: 'Name (Marathi)', mr: 'नाव (मराठी)' })}
                    </Label>
                    <Input
                      id="name-mr"
                      value={newCommitteeMember.name.mr}
                      onChange={(e) => setNewCommitteeMember({
                        ...newCommitteeMember,
                        name: { ...newCommitteeMember.name, mr: e.target.value }
                      })}
                      placeholder={t({ en: 'मराठीत नाव टाका', mr: 'मराठीत नाव टाका' })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="position-en" className="text-sm font-medium text-gray-700">
                      {t({ en: 'Position (English)', mr: 'पद (इंग्रजी)' })} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="position-en"
                      value={newCommitteeMember.position.en}
                      onChange={(e) => setNewCommitteeMember({
                        ...newCommitteeMember,
                        position: { ...newCommitteeMember.position, en: e.target.value }
                      })}
                      placeholder={t({ en: 'e.g., Ward Member', mr: 'जसे, वार्ड सदस्य' })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="position-mr" className="text-sm font-medium text-gray-700">
                      {t({ en: 'Position (Marathi)', mr: 'पद (मराठी)' })}
                    </Label>
                    <Input
                      id="position-mr"
                      value={newCommitteeMember.position.mr}
                      onChange={(e) => setNewCommitteeMember({
                        ...newCommitteeMember,
                        position: { ...newCommitteeMember.position, mr: e.target.value }
                      })}
                      placeholder={t({ en: 'जसे, वार्ड सदस्य', mr: 'जसे, वार्ड सदस्य' })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ward" className="text-sm font-medium text-gray-700">
                      {t({ en: 'Ward/Department', mr: 'वार्ड/विभाग' })}
                    </Label>
                    <Input
                      id="ward"
                      value={newCommitteeMember.ward}
                      onChange={(e) => setNewCommitteeMember({
                        ...newCommitteeMember,
                        ward: e.target.value
                      })}
                      placeholder={t({ en: 'e.g., Ward 1 or Administrative', mr: 'जसे, वार्ड 1 किंवा प्रशासकीय' })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      {t({ en: 'Phone', mr: 'फोन' })} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      value={newCommitteeMember.phone}
                      onChange={(e) => setNewCommitteeMember({
                        ...newCommitteeMember,
                        phone: e.target.value
                      })}
                      placeholder={t({ en: '+91 9876543210', mr: '+91 9876543210' })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    {t({ en: 'Email', mr: 'ईमेल' })}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCommitteeMember.email}
                    onChange={(e) => setNewCommitteeMember({
                      ...newCommitteeMember,
                      email: e.target.value
                    })}
                    placeholder={t({ en: 'email@example.com', mr: 'email@example.com' })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  {t({ en: 'Term Information', mr: 'कार्यकाळ माहिती' })}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="join-date" className="text-sm font-medium text-gray-700">
                      {t({ en: 'Join Date', mr: 'सामील होण्याची तारीख' })}
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="join-date"
                        type="date"
                        value={newCommitteeMember.joinDate}
                        onChange={(e) => setNewCommitteeMember({
                          ...newCommitteeMember,
                          joinDate: e.target.value
                        })}
                        className="pr-10"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="term-end" className="text-sm font-medium text-gray-700">
                      {t({ en: 'Term End Date', mr: 'कार्यकाळ संपण्याची तारीख' })}
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="term-end"
                        type="date"
                        value={newCommitteeMember.termEnd}
                        onChange={(e) => setNewCommitteeMember({
                          ...newCommitteeMember,
                          termEnd: e.target.value
                        })}
                        className="pr-10"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Education and Experience */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  {t({ en: 'Background Information', mr: 'पार्श्वभूमी माहिती' })}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="education-en" className="text-sm font-medium text-gray-700">
                      {t({ en: 'Education (English)', mr: 'शिक्षण (इंग्रजी)' })}
                    </Label>
                    <Input
                      id="education-en"
                      value={newCommitteeMember.education.en}
                      onChange={(e) => setNewCommitteeMember({
                        ...newCommitteeMember,
                        education: { ...newCommitteeMember.education, en: e.target.value }
                      })}
                      placeholder={t({ en: 'Educational qualifications', mr: 'शैक्षणिक पात्रता' })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="experience-en" className="text-sm font-medium text-gray-700">
                      {t({ en: 'Experience (English)', mr: 'अनुभव (इंग्रजी)' })}
                    </Label>
                    <Input
                      id="experience-en"
                      value={newCommitteeMember.experience.en}
                      onChange={(e) => setNewCommitteeMember({
                        ...newCommitteeMember,
                        experience: { ...newCommitteeMember.experience, en: e.target.value }
                      })}
                      placeholder={t({ en: 'Professional experience', mr: 'व्यावसायिक अनुभव' })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddCommitteeMemberOpen(false);
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
                  }}
                  className="px-6 py-2"
                >
                  {t({ en: 'Cancel', mr: 'रद्द करा' })}
                </Button>
                <Button
                  onClick={handleAddCommitteeMember}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t({ en: 'Add Member', mr: 'सदस्य जोडा' })}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Committee Member Detail Modal */}
        <Dialog open={isCommitteeMemberDetailOpen} onOpenChange={setIsCommitteeMemberDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {t({ en: 'Committee Member Details', mr: 'समिती सदस्य तपशील' })}
              </DialogTitle>
            </DialogHeader>
            
            {selectedCommitteeMember && (
              <div className="space-y-6 py-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    {t({ en: 'Basic Information', mr: 'मूलभूत माहिती' })}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        {t({ en: 'Name (English)', mr: 'नाव (इंग्रजी)' })}
                      </Label>
                      <p className="text-gray-900 font-medium mt-1">
                        {selectedCommitteeMember.name?.en || '-'}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        {t({ en: 'Name (Marathi)', mr: 'नाव (मराठी)' })}
                      </Label>
                      <p className="text-gray-900 font-medium mt-1">
                        {selectedCommitteeMember.name?.mr || '-'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        {t({ en: 'Position (English)', mr: 'पद (इंग्रजी)' })}
                      </Label>
                      <p className="text-gray-900 font-medium mt-1">
                        {selectedCommitteeMember.position?.en || '-'}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        {t({ en: 'Position (Marathi)', mr: 'पद (मराठी)' })}
                      </Label>
                      <p className="text-gray-900 font-medium mt-1">
                        {selectedCommitteeMember.position?.mr || '-'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        {t({ en: 'Ward/Department', mr: 'वार्ड/विभाग' })}
                      </Label>
                      <p className="text-gray-900 font-medium mt-1">
                        {selectedCommitteeMember.ward || '-'}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        {t({ en: 'Phone', mr: 'फोन' })}
                      </Label>
                      <p className="text-gray-900 font-medium mt-1">
                        {selectedCommitteeMember.phone || '-'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      {t({ en: 'Email', mr: 'ईमेल' })}
                    </Label>
                    <p className="text-gray-900 font-medium mt-1">
                      {selectedCommitteeMember.email || '-'}
                    </p>
                  </div>
                </div>

                {/* Term Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    {t({ en: 'Term Information', mr: 'कार्यकाळ माहिती' })}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        {t({ en: 'Join Date', mr: 'सामील होण्याची तारीख' })}
                      </Label>
                      <p className="text-gray-900 font-medium mt-1">
                        {selectedCommitteeMember.joinDate ? new Date(selectedCommitteeMember.joinDate).toLocaleDateString() : '-'}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        {t({ en: 'Term End Date', mr: 'कार्यकाळ संपण्याची तारीख' })}
                      </Label>
                      <p className="text-gray-900 font-medium mt-1">
                        {selectedCommitteeMember.termEnd ? new Date(selectedCommitteeMember.termEnd).toLocaleDateString() : '-'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      {t({ en: 'Status', mr: 'स्थिती' })}
                    </Label>
                    <div className="mt-1">
                      <Badge 
                        variant={selectedCommitteeMember.isActive ? 'default' : 'secondary'}
                        className={`font-medium ${selectedCommitteeMember.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {selectedCommitteeMember.isActive 
                          ? t({ en: 'Active', mr: 'सक्रिय' })
                          : t({ en: 'Inactive', mr: 'निष्क्रिय' })
                        }
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Background Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    {t({ en: 'Background Information', mr: 'पार्श्वभूमी माहिती' })}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        {t({ en: 'Education (English)', mr: 'शिक्षण (इंग्रजी)' })}
                      </Label>
                      <p className="text-gray-900 font-medium mt-1">
                        {selectedCommitteeMember.education?.en || '-'}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        {t({ en: 'Experience (English)', mr: 'अनुभव (इंग्रजी)' })}
                      </Label>
                      <p className="text-gray-900 font-medium mt-1">
                        {selectedCommitteeMember.experience?.en || '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsCommitteeMemberDetailOpen(false)}
                    className="px-6 py-2"
                  >
                    {t({ en: 'Close', mr: 'बंद करा' })}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsCommitteeMemberDetailOpen(false);
                      setIsEditCommitteeMemberOpen(true);
                    }}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {t({ en: 'Edit Member', mr: 'सदस्य संपादित करा' })}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Committee Member Modal */}
        <Dialog open={isEditCommitteeMemberOpen} onOpenChange={setIsEditCommitteeMemberOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {t({ en: 'Edit Committee Member', mr: 'समिती सदस्य संपादित करा' })}
              </DialogTitle>
            </DialogHeader>
            
            {selectedCommitteeMember && (
              <div className="space-y-6 py-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    {t({ en: 'Basic Information', mr: 'मूलभूत माहिती' })}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-name-en" className="text-sm font-medium text-gray-700">
                        {t({ en: 'Name (English)', mr: 'नाव (इंग्रजी)' })} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="edit-name-en"
                        value={selectedCommitteeMember.name?.en || ''}
                        onChange={(e) => setSelectedCommitteeMember({
                          ...selectedCommitteeMember,
                          name: { ...selectedCommitteeMember.name, en: e.target.value }
                        })}
                        placeholder={t({ en: 'Enter name in English', mr: 'इंग्रजीत नाव टाका' })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-name-mr" className="text-sm font-medium text-gray-700">
                        {t({ en: 'Name (Marathi)', mr: 'नाव (मराठी)' })}
                      </Label>
                      <Input
                        id="edit-name-mr"
                        value={selectedCommitteeMember.name?.mr || ''}
                        onChange={(e) => setSelectedCommitteeMember({
                          ...selectedCommitteeMember,
                          name: { ...selectedCommitteeMember.name, mr: e.target.value }
                        })}
                        placeholder={t({ en: 'मराठीत नाव टाका', mr: 'मराठीत नाव टाका' })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-position-en" className="text-sm font-medium text-gray-700">
                        {t({ en: 'Position (English)', mr: 'पद (इंग्रजी)' })} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="edit-position-en"
                        value={selectedCommitteeMember.position?.en || ''}
                        onChange={(e) => setSelectedCommitteeMember({
                          ...selectedCommitteeMember,
                          position: { ...selectedCommitteeMember.position, en: e.target.value }
                        })}
                        placeholder={t({ en: 'e.g., Ward Member', mr: 'जसे, वार्ड सदस्य' })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-position-mr" className="text-sm font-medium text-gray-700">
                        {t({ en: 'Position (Marathi)', mr: 'पद (मराठी)' })}
                      </Label>
                      <Input
                        id="edit-position-mr"
                        value={selectedCommitteeMember.position?.mr || ''}
                        onChange={(e) => setSelectedCommitteeMember({
                          ...selectedCommitteeMember,
                          position: { ...selectedCommitteeMember.position, mr: e.target.value }
                        })}
                        placeholder={t({ en: 'जसे, वार्ड सदस्य', mr: 'जसे, वार्ड सदस्य' })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-ward" className="text-sm font-medium text-gray-700">
                        {t({ en: 'Ward/Department', mr: 'वार्ड/विभाग' })}
                      </Label>
                      <Input
                        id="edit-ward"
                        value={selectedCommitteeMember.ward || ''}
                        onChange={(e) => setSelectedCommitteeMember({
                          ...selectedCommitteeMember,
                          ward: e.target.value
                        })}
                        placeholder={t({ en: 'e.g., Ward 1 or Administrative', mr: 'जसे, वार्ड 1 किंवा प्रशासकीय' })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-phone" className="text-sm font-medium text-gray-700">
                        {t({ en: 'Phone', mr: 'फोन' })} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="edit-phone"
                        value={selectedCommitteeMember.phone || ''}
                        onChange={(e) => setSelectedCommitteeMember({
                          ...selectedCommitteeMember,
                          phone: e.target.value
                        })}
                        placeholder={t({ en: '+91 9876543210', mr: '+91 9876543210' })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-email" className="text-sm font-medium text-gray-700">
                      {t({ en: 'Email', mr: 'ईमेल' })}
                    </Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={selectedCommitteeMember.email || ''}
                      onChange={(e) => setSelectedCommitteeMember({
                        ...selectedCommitteeMember,
                        email: e.target.value
                      })}
                      placeholder={t({ en: 'email@example.com', mr: 'email@example.com' })}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    {t({ en: 'Term Information', mr: 'कार्यकाळ माहिती' })}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-join-date" className="text-sm font-medium text-gray-700">
                        {t({ en: 'Join Date', mr: 'सामील होण्याची तारीख' })}
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="edit-join-date"
                          type="date"
                          value={selectedCommitteeMember.joinDate ? selectedCommitteeMember.joinDate.split('T')[0] : ''}
                          onChange={(e) => setSelectedCommitteeMember({
                            ...selectedCommitteeMember,
                            joinDate: e.target.value
                          })}
                          className="pr-10"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-term-end" className="text-sm font-medium text-gray-700">
                        {t({ en: 'Term End Date', mr: 'कार्यकाळ संपण्याची तारीख' })}
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="edit-term-end"
                          type="date"
                          value={selectedCommitteeMember.termEnd ? selectedCommitteeMember.termEnd.split('T')[0] : ''}
                          onChange={(e) => setSelectedCommitteeMember({
                            ...selectedCommitteeMember,
                            termEnd: e.target.value
                          })}
                          className="pr-10"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      {t({ en: 'Status', mr: 'स्थिती' })}
                    </Label>
                    <div className="mt-1">
                      <Select
                        value={selectedCommitteeMember.isActive ? 'active' : 'inactive'}
                        onValueChange={(value) => setSelectedCommitteeMember({
                          ...selectedCommitteeMember,
                          isActive: value === 'active'
                        })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">{t({ en: 'Active', mr: 'सक्रिय' })}</SelectItem>
                          <SelectItem value="inactive">{t({ en: 'Inactive', mr: 'निष्क्रिय' })}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Education and Experience */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    {t({ en: 'Background Information', mr: 'पार्श्वभूमी माहिती' })}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-education-en" className="text-sm font-medium text-gray-700">
                        {t({ en: 'Education (English)', mr: 'शिक्षण (इंग्रजी)' })}
                      </Label>
                      <Input
                        id="edit-education-en"
                        value={selectedCommitteeMember.education?.en || ''}
                        onChange={(e) => setSelectedCommitteeMember({
                          ...selectedCommitteeMember,
                          education: { ...selectedCommitteeMember.education, en: e.target.value }
                        })}
                        placeholder={t({ en: 'Educational qualifications', mr: 'शैक्षणिक पात्रता' })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-experience-en" className="text-sm font-medium text-gray-700">
                        {t({ en: 'Experience (English)', mr: 'अनुभव (इंग्रजी)' })}
                      </Label>
                      <Input
                        id="edit-experience-en"
                        value={selectedCommitteeMember.experience?.en || ''}
                        onChange={(e) => setSelectedCommitteeMember({
                          ...selectedCommitteeMember,
                          experience: { ...selectedCommitteeMember.experience, en: e.target.value }
                        })}
                        placeholder={t({ en: 'Professional experience', mr: 'व्यावसायिक अनुभव' })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditCommitteeMemberOpen(false);
                      setSelectedCommitteeMember(null);
                    }}
                    className="px-6 py-2"
                  >
                    {t({ en: 'Cancel', mr: 'रद्द करा' })}
                  </Button>
                  <Button
                    onClick={handleUpdateCommitteeMember}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {t({ en: 'Save Changes', mr: 'बदल जतन करा' })}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Office Hours Management Modal */}
        <Dialog open={isOfficeHoursEditOpen} onOpenChange={setIsOfficeHoursEditOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {t({ en: 'Manage Office Hours', mr: 'कार्यालयीन वेळा व्यवस्थापित करा' })}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  {t({ en: 'Weekly Schedule', mr: 'साप्ताहिक वेळापत्रक' })}
                </h3>
                
                <div className="space-y-4">
                  {officeInfo?.officeHours && officeInfo.officeHours.length > 0 ? (
                    officeInfo.officeHours.map((schedule, index) => (
                      <div key={index} className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <Calendar className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{schedule.day?.en || ''}</p>
                            <p className="text-sm text-gray-600">{schedule.day?.mr || ''}</p>
                          </div>
                        </div>
                        
                        <div className="lg:col-span-2">
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            {t({ en: 'Office Hours', mr: 'कार्यालयीन वेळा' })}
                          </Label>
                          {schedule.available ? (
                            <div className="flex items-center space-x-2">
                              <Input
                                value={schedule.hours || ''}
                                onChange={(e) => {
                                  const updatedHours = [...officeInfo.officeHours];
                                  updatedHours[index].hours = e.target.value;
                                  setOfficeInfo({
                                    ...officeInfo,
                                    officeHours: updatedHours
                                  });
                                }}
                                placeholder={t({ en: 'e.g., 9:00 AM - 5:00 PM', mr: 'जसे, 9:00 AM - 5:00 PM' })}
                                className="text-sm"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Input
                                value="Closed"
                                disabled
                                className="text-sm bg-gray-100 text-gray-500"
                              />
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            {t({ en: 'Status', mr: 'स्थिती' })}
                          </Label>
                          <Badge 
                            variant={schedule.available ? 'default' : 'secondary'}
                            className={`font-medium ${schedule.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {schedule.available 
                              ? t({ en: 'Open', mr: 'उघडे' })
                              : t({ en: 'Closed', mr: 'बंद' })
                            }
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Toggle availability
                              const updatedHours = [...officeInfo.officeHours];
                              updatedHours[index].available = !updatedHours[index].available;
                              // Set default hours when opening
                              if (!updatedHours[index].available) {
                                updatedHours[index].hours = 'Closed';
                              } else if (updatedHours[index].hours === 'Closed' || !updatedHours[index].hours) {
                                // Set default hours based on day
                                if (updatedHours[index].day?.en === 'Saturday') {
                                  updatedHours[index].hours = '10:00 AM - 2:00 PM';
                                } else if (updatedHours[index].day?.en === 'Sunday') {
                                  updatedHours[index].hours = 'Closed';
                                  updatedHours[index].available = false;
                                } else {
                                  updatedHours[index].hours = '9:00 AM - 5:00 PM';
                                }
                              }
                              setOfficeInfo({
                                ...officeInfo,
                                officeHours: updatedHours
                              });
                            }}
                            className={schedule.available ? "hover:bg-red-50 hover:border-red-300" : "hover:bg-green-50 hover:border-green-300"}
                          >
                            {schedule.available ? (
                              <>
                                <X className="h-4 w-4 mr-1" />
                                {t({ en: 'Close', mr: 'बंद करा' })}
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                {t({ en: 'Open', mr: 'उघडा' })}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 mb-4">
                        {t({ en: 'No office hours configured', mr: 'कोणतेही कार्यालयीन वेळा सेट केले नाहीत' })}
                      </p>
                      <Button 
                        onClick={() => {
                          // Create default office hours
                          const defaultHours = [
                            { day: { en: 'Monday', mr: 'सोमवार' }, hours: '9:00 AM - 5:00 PM', available: true },
                            { day: { en: 'Tuesday', mr: 'मंगळवार' }, hours: '9:00 AM - 5:00 PM', available: true },
                            { day: { en: 'Wednesday', mr: 'बुधवार' }, hours: '9:00 AM - 5:00 PM', available: true },
                            { day: { en: 'Thursday', mr: 'गुरुवार' }, hours: '9:00 AM - 5:00 PM', available: true },
                            { day: { en: 'Friday', mr: 'शुक्रवार' }, hours: '9:00 AM - 5:00 PM', available: true },
                            { day: { en: 'Saturday', mr: 'शनिवार' }, hours: '10:00 AM - 2:00 PM', available: true },
                            { day: { en: 'Sunday', mr: 'रविवार' }, hours: 'Closed', available: false }
                          ];
                          setOfficeInfo({
                            ...officeInfo,
                            officeHours: defaultHours
                          });
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {t({ en: 'Add Default Hours', mr: 'डिफॉल्ट वेळा जोडा' })}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  {t({ en: 'Quick Actions', mr: 'त्वरित क्रिया' })}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const updatedHours = officeInfo.officeHours.map(hour => {
                        if (hour.day?.en === 'Saturday') {
                          return { ...hour, available: true, hours: '10:00 AM - 2:00 PM' };
                        } else if (hour.day?.en === 'Sunday') {
                          return { ...hour, available: false, hours: 'Closed' };
                        } else {
                          return { ...hour, available: true, hours: '9:00 AM - 5:00 PM' };
                        }
                      });
                      setOfficeInfo({
                        ...officeInfo,
                        officeHours: updatedHours
                      });
                    }}
                    className="hover:bg-green-50 hover:border-green-300"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {t({ en: 'Set Standard Hours', mr: 'मानक वेळा सेट करा' })}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      const updatedHours = officeInfo.officeHours.map(hour => ({
                        ...hour,
                        available: true,
                        hours: hour.hours === 'Closed' ? '9:00 AM - 5:00 PM' : hour.hours
                      }));
                      setOfficeInfo({
                        ...officeInfo,
                        officeHours: updatedHours
                      });
                    }}
                    className="hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {t({ en: 'Open All Days', mr: 'सर्व दिवस उघडा' })}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      const updatedHours = officeInfo.officeHours.map(hour => ({
                        ...hour,
                        available: false,
                        hours: 'Closed'
                      }));
                      setOfficeInfo({
                        ...officeInfo,
                        officeHours: updatedHours
                      });
                    }}
                    className="hover:bg-red-50 hover:border-red-300"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {t({ en: 'Close All Days', mr: 'सर्व दिवस बंद करा' })}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Reset to default hours
                      const defaultHours = [
                        { day: { en: 'Monday', mr: 'सोमवार' }, hours: '9:00 AM - 5:00 PM', available: true },
                        { day: { en: 'Tuesday', mr: 'मंगळवार' }, hours: '9:00 AM - 5:00 PM', available: true },
                        { day: { en: 'Wednesday', mr: 'बुधवार' }, hours: '9:00 AM - 5:00 PM', available: true },
                        { day: { en: 'Thursday', mr: 'गुरुवार' }, hours: '9:00 AM - 5:00 PM', available: true },
                        { day: { en: 'Friday', mr: 'शुक्रवार' }, hours: '9:00 AM - 5:00 PM', available: true },
                        { day: { en: 'Saturday', mr: 'शनिवार' }, hours: '10:00 AM - 2:00 PM', available: true },
                        { day: { en: 'Sunday', mr: 'रविवार' }, hours: 'Closed', available: false }
                      ];
                      setOfficeInfo({
                        ...officeInfo,
                        officeHours: defaultHours
                      });
                    }}
                    className="hover:bg-purple-50 hover:border-purple-300"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {t({ en: 'Reset to Default', mr: 'डिफॉल्ट वर रीसेट करा' })}
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsOfficeHoursEditOpen(false)}
                  className="px-6 py-2"
                >
                  {t({ en: 'Cancel', mr: 'रद्द करा' })}
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      await adminUpdateOfficeInfo(officeInfo);
                      toast.success('Office hours updated successfully');
                      setIsOfficeHoursEditOpen(false);
                    } catch (error) {
                      console.error('Failed to update office hours:', error);
                      toast.error('Failed to update office hours');
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t({ en: 'Save Changes', mr: 'बदल जतन करा' })}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Media Modal */}
        <Dialog open={isAddMediaOpen} onOpenChange={setIsAddMediaOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogTitle>{t({ en: 'Add New Media', mr: 'नवीन मीडिया जोडा' })}</DialogTitle>
            <DialogDescription>
              {t({ en: 'Upload and add new media items to your village gallery', mr: 'आपल्या गाव गॅलरीमध्ये नवीन मीडिया आयटम अपलोड आणि जोडा' })}
            </DialogDescription>
            
            <div className="space-y-6">
              {/* Media Type */}
              <div className="space-y-2">
                <Label>{t({ en: 'Media Type', mr: 'मीडिया प्रकार' })}</Label>
                <Select 
                  value={newMediaItem.mediaType} 
                  onValueChange={(value) => setNewMediaItem(prev => ({ ...prev, mediaType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Photo">{t({ en: 'Photo', mr: 'फोटो' })}</SelectItem>
                    <SelectItem value="Video">{t({ en: 'Video', mr: 'व्हिडिओ' })}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>{t({ en: 'Upload File', mr: 'फाइल अपलोड करा' })}</Label>
                <Input
                  type="file"
                  accept={newMediaItem.mediaType === 'Photo' ? 'image/*' : 'video/*'}
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                {uploading && (
                  <p className="text-sm text-blue-600">{t({ en: 'Uploading...', mr: 'अपलोड होत आहे...' })}</p>
                )}
                {newMediaItem.fileUrl && (
                  <div className="mt-2">
                    {newMediaItem.mediaType === 'Photo' ? (
                      <img src={newMediaItem.fileUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                    ) : (
                      <video src={newMediaItem.fileUrl} className="w-32 h-32 object-cover rounded-lg" controls />
                    )}
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label>{t({ en: 'Title (English)', mr: 'शीर्षक (इंग्रजी)' })} *</Label>
                <Input
                  value={newMediaItem.title.en}
                  onChange={(e) => setNewMediaItem(prev => ({ 
                    ...prev, 
                    title: { ...prev.title, en: e.target.value }
                  }))}
                  placeholder={t({ en: 'Enter title in English', mr: 'इंग्रजीत शीर्षक प्रविष्ट करा' })}
                />
              </div>

              <div className="space-y-2">
                <Label>{t({ en: 'Title (Marathi)', mr: 'शीर्षक (मराठी)' })}</Label>
                <Input
                  value={newMediaItem.title.mr}
                  onChange={(e) => setNewMediaItem(prev => ({ 
                    ...prev, 
                    title: { ...prev.title, mr: e.target.value }
                  }))}
                  placeholder={t({ en: 'Enter title in Marathi', mr: 'मराठीत शीर्षक प्रविष्ट करा' })}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>{t({ en: 'Description (English)', mr: 'वर्णन (इंग्रजी)' })}</Label>
                <Textarea
                  value={newMediaItem.description.en}
                  onChange={(e) => setNewMediaItem(prev => ({ 
                    ...prev, 
                    description: { ...prev.description, en: e.target.value }
                  }))}
                  placeholder={t({ en: 'Enter description in English', mr: 'इंग्रजीत वर्णन प्रविष्ट करा' })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>{t({ en: 'Description (Marathi)', mr: 'वर्णन (मराठी)' })}</Label>
                <Textarea
                  value={newMediaItem.description.mr}
                  onChange={(e) => setNewMediaItem(prev => ({ 
                    ...prev, 
                    description: { ...prev.description, mr: e.target.value }
                  }))}
                  placeholder={t({ en: 'Enter description in Marathi', mr: 'मराठीत वर्णन प्रविष्ट करा' })}
                  rows={3}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>{t({ en: 'Category', mr: 'श्रेणी' })} *</Label>
                <Select 
                  value={newMediaItem.category} 
                  onValueChange={(value) => setNewMediaItem(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t({ en: 'Select a category', mr: 'श्रेणी निवडा' })} />
                  </SelectTrigger>
                  <SelectContent>
                    {mediaCategories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>{t({ en: 'Tags', mr: 'टॅग' })}</Label>
                <Input
                  value={newMediaItem.tags.join(', ')}
                  onChange={(e) => setNewMediaItem(prev => ({ 
                    ...prev, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  }))}
                  placeholder={t({ en: 'Enter tags separated by commas', mr: 'स्वल्पविरामाने विभक्त टॅग प्रविष्ट करा' })}
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={newMediaItem.isFeatured}
                  onChange={(e) => setNewMediaItem(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="isFeatured">{t({ en: 'Mark as Featured', mr: 'विशेष म्हणून चिन्हांकित करा' })}</Label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAddMediaOpen(false)}
                  disabled={uploading}
                >
                  {t({ en: 'Cancel', mr: 'रद्द करा' })}
                </Button>
                <Button
                  onClick={handleAddMediaSubmit}
                  disabled={uploading || !newMediaItem.title.en || !newMediaItem.category || !newMediaItem.fileUrl}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t({ en: 'Uploading...', mr: 'अपलोड होत आहे...' })}
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      {t({ en: 'Add Media', mr: 'मीडिया जोडा' })}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Media Modal */}
        <Dialog open={isEditMediaOpen} onOpenChange={setIsEditMediaOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogTitle>{t({ en: 'Edit Media', mr: 'मीडिया संपादित करा' })}</DialogTitle>
            <DialogDescription>
              {t({ en: 'Update media item details and information', mr: 'मीडिया आयटम तपशील आणि माहिती अपडेट करा' })}
            </DialogDescription>
            
            {selectedMedia && (
              <div className="space-y-6">
                {/* Media Type */}
                <div className="space-y-2">
                  <Label>{t({ en: 'Media Type', mr: 'मीडिया प्रकार' })}</Label>
                  <Select 
                    value={selectedMedia.mediaType} 
                    onValueChange={(value) => setSelectedMedia(prev => ({ ...prev, mediaType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Photo">{t({ en: 'Photo', mr: 'फोटो' })}</SelectItem>
                      <SelectItem value="Video">{t({ en: 'Video', mr: 'व्हिडिओ' })}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Current Media Preview */}
                <div className="space-y-2">
                  <Label>{t({ en: 'Current Media', mr: 'सध्याचे मीडिया' })}</Label>
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                    {selectedMedia.thumbnailUrl ? (
                      <img 
                        src={selectedMedia.thumbnailUrl} 
                        alt={selectedMedia.title.en}
                        className="w-full h-full object-cover"
                      />
                    ) : selectedMedia.mediaType === 'Photo' ? (
                      <img 
                        src={selectedMedia.fileUrl} 
                        alt={selectedMedia.title.en}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Video className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label>{t({ en: 'Title (English)', mr: 'शीर्षक (इंग्रजी)' })} *</Label>
                  <Input
                    value={selectedMedia.title.en}
                    onChange={(e) => setSelectedMedia(prev => ({ 
                      ...prev, 
                      title: { ...prev.title, en: e.target.value }
                    }))}
                    placeholder={t({ en: 'Enter title in English', mr: 'इंग्रजीत शीर्षक प्रविष्ट करा' })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t({ en: 'Title (Marathi)', mr: 'शीर्षक (मराठी)' })}</Label>
                  <Input
                    value={selectedMedia.title.mr || ''}
                    onChange={(e) => setSelectedMedia(prev => ({ 
                      ...prev, 
                      title: { ...prev.title, mr: e.target.value }
                    }))}
                    placeholder={t({ en: 'Enter title in Marathi', mr: 'मराठीत शीर्षक प्रविष्ट करा' })}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>{t({ en: 'Description (English)', mr: 'वर्णन (इंग्रजी)' })}</Label>
                  <Textarea
                    value={selectedMedia.description?.en || ''}
                    onChange={(e) => setSelectedMedia(prev => ({ 
                      ...prev, 
                      description: { ...prev.description, en: e.target.value }
                    }))}
                    placeholder={t({ en: 'Enter description in English', mr: 'इंग्रजीत वर्णन प्रविष्ट करा' })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t({ en: 'Description (Marathi)', mr: 'वर्णन (मराठी)' })}</Label>
                  <Textarea
                    value={selectedMedia.description?.mr || ''}
                    onChange={(e) => setSelectedMedia(prev => ({ 
                      ...prev, 
                      description: { ...prev.description, mr: e.target.value }
                    }))}
                    placeholder={t({ en: 'Enter description in Marathi', mr: 'मराठीत वर्णन प्रविष्ट करा' })}
                    rows={3}
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>{t({ en: 'Category', mr: 'श्रेणी' })} *</Label>
                  <Select 
                    value={selectedMedia.category} 
                    onValueChange={(value) => setSelectedMedia(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t({ en: 'Select a category', mr: 'श्रेणी निवडा' })} />
                    </SelectTrigger>
                    <SelectContent>
                      {mediaCategories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>{t({ en: 'Tags', mr: 'टॅग' })}</Label>
                  <Input
                    value={selectedMedia.tags?.join(', ') || ''}
                    onChange={(e) => setSelectedMedia(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    }))}
                    placeholder={t({ en: 'Enter tags separated by commas', mr: 'स्वल्पविरामाने विभक्त टॅग प्रविष्ट करा' })}
                  />
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="editIsFeatured"
                    checked={selectedMedia.isFeatured || false}
                    onChange={(e) => setSelectedMedia(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="editIsFeatured">{t({ en: 'Mark as Featured', mr: 'विशेष म्हणून चिन्हांकित करा' })}</Label>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditMediaOpen(false);
                      setSelectedMedia(null);
                    }}
                  >
                    {t({ en: 'Cancel', mr: 'रद्द करा' })}
                  </Button>
                  <Button
                    onClick={handleUpdateMedia}
                    disabled={!selectedMedia.title.en || !selectedMedia.category}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {t({ en: 'Update Media', mr: 'मीडिया अपडेट करा' })}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Category Management Modal */}
        <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogTitle>{t({ en: 'Manage Media Categories', mr: 'मीडिया श्रेण्या व्यवस्थापित करा' })}</DialogTitle>
            <DialogDescription>
              {t({ en: 'Add, edit, and delete media categories for organizing your content', mr: 'आपली सामग्री व्यवस्थापित करण्यासाठी मीडिया श्रेण्या जोडा, संपादित करा आणि हटवा' })}
            </DialogDescription>
            
            <div className="space-y-6">
              {/* Add New Category Form */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">{t({ en: 'Add New Category', mr: 'नवीन श्रेणी जोडा' })}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t({ en: 'Category Name (English)', mr: 'श्रेणी नाव (इंग्रजी)' })} *</Label>
                    <Input
                      value={newMediaCategory.name.en}
                      onChange={(e) => setNewMediaCategory(prev => ({ 
                        ...prev, 
                        name: { ...prev.name, en: e.target.value }
                      }))}
                      placeholder={t({ en: 'Enter category name in English', mr: 'इंग्रजीत श्रेणी नाव प्रविष्ट करा' })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>{t({ en: 'Category Name (Marathi)', mr: 'श्रेणी नाव (मराठी)' })} *</Label>
                    <Input
                      value={newMediaCategory.name.mr}
                      onChange={(e) => setNewMediaCategory(prev => ({ 
                        ...prev, 
                        name: { ...prev.name, mr: e.target.value }
                      }))}
                      placeholder={t({ en: 'Enter category name in Marathi', mr: 'मराठीत श्रेणी नाव प्रविष्ट करा' })}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={handleAddCategory}
                    disabled={!newMediaCategory.name.en || !newMediaCategory.name.mr}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t({ en: 'Add Category', mr: 'श्रेणी जोडा' })}
                  </Button>
                </div>
              </div>

              {/* Existing Categories List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t({ en: 'Existing Categories', mr: 'अस्तित्वातील श्रेण्या' })}</h3>
                
                {mediaCategories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{t({ en: 'No categories found', mr: 'कोणतीही श्रेणी सापडली नाही' })}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mediaCategories.map((category) => (
                      <div key={category._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="font-medium">{category.name.en}</div>
                          {category.name.mr && (
                            <div className="text-sm text-gray-600">{category.name.mr}</div>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            {t({ en: 'Created', mr: 'तयार केले' })}: {new Date(category.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {category.mediaCount || 0} {t({ en: 'items', mr: 'आयटम' })}
                          </Badge>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteCategory(category._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsCategoryModalOpen(false)}
                >
                  {t({ en: 'Close', mr: 'बंद करा' })}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

              </div>
    </div>
  );
}