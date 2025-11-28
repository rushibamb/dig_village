import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageProvider';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { 
  submitNewVillager,
  generateEditOtp,
  verifyEditOtp,
  submitVillagerEdits,
  getVillagerStats,
  uploadVillagerImage
} from '../services/villagerService';
import { 
  Users, 
  UserPlus, 
  UserCheck,
  Phone, 
  Upload,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  Edit3,
  Sparkles,
  Star,
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react';

interface VillagerProfile {
  id: string;
  fullName: string;
  address: string;
  mobile: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  aadharNumber: string;
  idProofPhoto?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export function ManageVillagerPage() {
  const { t } = useLanguage();
  const { isLoggedIn, user } = useAuth();
  
  // View state to control what is displayed
  const [view, setView] = useState('initial');
  
  // Form data for new villager
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    gender: '',
    dateOfBirth: '',
    aadharNumber: '',
    idProofPhoto: '',
    address: ''
  });

  // Edit flow state variables
  const [editMobile, setEditMobile] = useState('');
  const [editOtp, setEditOtp] = useState('');
  const [editingVillagerData, setEditingVillagerData] = useState(null);
  const [villagerIdToEdit, setVillagerIdToEdit] = useState('');
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Dynamic villager statistics
  const [villagerStats, setVillagerStats] = useState({
    total: 0,
    male: 0,
    female: 0,
    other: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch villager statistics
  useEffect(() => {
    const fetchVillagerStats = async () => {
      try {
        setStatsLoading(true);
        const response = await getVillagerStats();
        if (response.success) {
          setVillagerStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching villager stats:', error);
        // Keep default values (0) on error
      } finally {
        setStatsLoading(false);
      }
    };

    fetchVillagerStats();
  }, []);

  // Function to refresh villager statistics
  const refreshVillagerStats = async () => {
    try {
      const response = await getVillagerStats();
      if (response.success) {
        setVillagerStats(response.data);
      }
    } catch (error) {
      console.error('Error refreshing villager stats:', error);
    }
  };

  // Mock data for recent submissions (admin view only)
  const recentSubmissions = [
    
  ];

  // Handler for Add Villager form submission
  const handleAddSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Basic validation
      if (!formData.fullName || !formData.mobileNumber || !formData.gender || !formData.aadharNumber || !formData.address) {
        toast.error(t({ 
          en: 'Please fill all required fields', 
          mr: 'कृपया सर्व आवश्यक फील्ड भरा' 
        }));
        return;
      }

      const response = await submitNewVillager(formData);
      
      if (response.success) {
        toast.success(t({ 
          en: 'Villager request submitted successfully! Admin will review and approve.', 
          mr: 'गावकरी विनंती यशस्वीरित्या सबमिट झाली! प्रशासक तपासून मंजूर करेल.' 
        }));
        
        // Refresh villager statistics
        await refreshVillagerStats();
        
        // Reset form and view
        setFormData({
          fullName: '',
          mobileNumber: '',
          gender: '',
          dateOfBirth: '',
          aadharNumber: '',
          idProofPhoto: '',
          address: ''
        });
        setView('initial');
      }
    } catch (error: any) {
      console.error('Error submitting villager:', error);
      toast.error(error.message || t({ 
        en: 'Failed to submit villager request', 
        mr: 'गावकरी विनंती सबमिट करण्यात अयशस्वी' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Get OTP form submission
  const handleGetOtpSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!editMobile) {
        toast.error(t({ 
          en: 'Please enter mobile number', 
          mr: 'कृपया मोबाइल नंबर टाका' 
        }));
        return;
      }

      const response = await generateEditOtp(editMobile);
      
      if (response.success) {
        toast.success(t({ 
          en: 'OTP sent to your mobile number', 
          mr: 'तुमच्या मोबाइल नंबरवर OTP पाठवला आहे' 
        }));
        setView('editStep2_verifyOtp');
      }
    } catch (error: any) {
      console.error('Error generating OTP:', error);
      toast.error(error.message || t({ 
        en: 'Failed to send OTP', 
        mr: 'OTP पाठवण्यात अयशस्वी' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for OTP verification
  const handleVerifyOtpSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!editOtp || editOtp.length !== 6) {
        toast.error(t({ 
          en: 'Please enter a valid 6-digit OTP', 
          mr: 'कृपया वैध ६ अंकी OTP टाका' 
        }));
        return;
      }

      const response = await verifyEditOtp(editMobile, editOtp);
      
      if (response.success) {
        setEditingVillagerData(response.data);
        setVillagerIdToEdit(response.data._id);
        
        // Pre-fill form with villager data
        setFormData({
          fullName: response.data.fullName,
          mobileNumber: response.data.mobileNumber,
          gender: response.data.gender,
          dateOfBirth: response.data.dateOfBirth ? 
            (typeof response.data.dateOfBirth === 'string' ? 
              response.data.dateOfBirth.split('T')[0] : 
              new Date(response.data.dateOfBirth).toISOString().split('T')[0]) : '',
          aadharNumber: response.data.aadharNumber,
          idProofPhoto: response.data.idProofPhoto,
          address: response.data.address
        });
        
        toast.success(t({ 
          en: 'OTP verified successfully', 
          mr: 'OTP यशस्वीरित्या पडताळला' 
        }));
        setView('editStep3_editForm');
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast.error(error.message || t({ 
        en: 'Invalid OTP. Please try again.', 
        mr: 'चुकीचा OTP. कृपया पुन्हा प्रयत्न करा.' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Edit Villager form submission
  const handleEditSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Basic validation
      if (!formData.fullName || !formData.mobileNumber || !formData.gender || !formData.aadharNumber || !formData.address) {
        toast.error(t({ 
          en: 'Please fill all required fields', 
          mr: 'कृपया सर्व आवश्यक फील्ड भरा' 
        }));
        return;
      }

      const response = await submitVillagerEdits(villagerIdToEdit, formData);
      
      if (response.success) {
        toast.success(t({ 
          en: 'Villager edit request submitted successfully! Admin will review and approve.', 
          mr: 'गावकरी संपादन विनंती यशस्वीरित्या सबमिट झाली! प्रशासक तपासून मंजूर करेल.' 
        }));
        
        // Refresh villager statistics
        await refreshVillagerStats();
        
        // Reset all states and return to initial view
        setFormData({
          fullName: '',
          mobileNumber: '',
          gender: '',
          dateOfBirth: '',
          aadharNumber: '',
          idProofPhoto: '',
          address: ''
        });
        setEditMobile('');
        setEditOtp('');
        setEditingVillagerData(null);
        setVillagerIdToEdit('');
        setView('initial');
      }
    } catch (error: any) {
      console.error('Error submitting villager edit:', error);
      toast.error(error.message || t({ 
        en: 'Failed to submit villager edit request', 
        mr: 'गावकरी संपादन विनंती सबमिट करण्यात अयशस्वी' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to go back to previous view
  const handleGoBack = () => {
    switch (view) {
      case 'addForm':
      case 'editStep1_enterMobile':
        setView('initial');
        break;
      case 'editStep2_verifyOtp':
        setView('editStep1_enterMobile');
        break;
      case 'editStep3_editForm':
        setView('editStep2_verifyOtp');
        break;
      default:
        setView('initial');
    }
  };

  // Helper function to handle file upload
  const handleFileUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(t({ 
        en: 'Please select an image file', 
        mr: 'कृपया एक प्रतिमा फाइल निवडा' 
      }));
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t({ 
        en: 'File size must be less than 5MB', 
        mr: 'फाइल आकार 5MB पेक्षा कमी असावा' 
      }));
      return;
    }

    setIsUploadingImage(true);
    
    try {
      console.log('Starting image upload for file:', file.name);
      const response = await uploadVillagerImage(file);
      console.log('Upload response:', response);
      
      if (response.success) {
        console.log('Image URL:', response.data.fileUrl);
        setFormData(prev => ({ ...prev, idProofPhoto: response.data.fileUrl }));
        toast.success(t({ 
          en: 'Photo uploaded successfully', 
          mr: 'फोटो यशस्वीरित्या अपलोड झाला' 
        }));
      }
    } catch (error: any) {
      console.error('Image upload error:', error);
      toast.error(error.message || t({ 
        en: 'Failed to upload photo', 
        mr: 'फोटो अपलोड करण्यात अयशस्वी' 
      }));
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Conditional rendering based on view state
  if (view === 'initial') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-32 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto max-w-6xl p-4 relative">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-villager-color to-cyan-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl animate-glow hover-float">
                <Users className="h-10 w-10 text-white animate-pulse-slow" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse-slow">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
            <h1 className="mb-2 gradient-text-villager animate-scale-in">
              {t({ en: 'Manage Villagers', mr: 'गावकरी व्यवस्थापन' })}
            </h1>
            <p className="text-gray-600 animate-slide-in-right">
              {t({ en: 'Register and manage villager information', mr: 'गावकऱ्यांची नोंदणी आणि माहिती व्यवस्थापित करा' })}
            </p>
          </div>

          {/* Hero Image */}
          <div className="mb-8 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative h-64 rounded-3xl overflow-hidden shadow-2xl hover-lift">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1740477138822-906f6b845579?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2aWxsYWdlJTIwcGVvcGxlJTIwY29tbXVuaXR5fGVufDF8fHx8MTc1NTQ1NDM1MXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Village community"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-purple/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <h2 className="mb-2 font-bold bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full">
                    {t({ en: 'Our Village Community', mr: 'आमचा गाव समुदाय' })}
                  </h2>
                  <p className="opacity-90">
                    {t({ en: 'Together we build a stronger village', mr: 'आम्ही मिळून एक मजबूत गाव बनवतो' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Villager Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card hover-lift hover-glow animate-scale-in border-0 shadow-xl" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full -mr-8 -mt-8"></div>
                <div className="relative">
                  <Users className="h-8 w-8 mx-auto mb-2 text-cyan-600 animate-pulse-slow" />
                  <div className="mb-1 gradient-text-villager font-bold animate-pulse">
                    {statsLoading ? '...' : villagerStats.total}
                  </div>
                  <p className="text-gray-700 font-medium">{t({ en: 'Total Villagers', mr: 'एकूण गावकरी' })}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-lift hover-glow animate-scale-in border-0 shadow-xl" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full -mr-8 -mt-8"></div>
                <div className="relative">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600 animate-pulse-slow" />
                  <div className="mb-1 text-blue-600 font-bold animate-pulse">
                    {statsLoading ? '...' : villagerStats.male}
                  </div>
                  <p className="text-gray-700 font-medium">{t({ en: 'Male', mr: 'पुरुष' })}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-lift hover-glow animate-scale-in border-0 shadow-xl" style={{ animationDelay: '0.5s' }}>
              <CardContent className="p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-rose-500/20 rounded-full -mr-8 -mt-8"></div>
                <div className="relative">
                  <Star className="h-8 w-8 mx-auto mb-2 text-pink-600 animate-pulse-slow" />
                  <div className="mb-1 text-pink-600 font-bold animate-pulse">
                    {statsLoading ? '...' : villagerStats.female}
                  </div>
                  <p className="text-gray-700 font-medium">{t({ en: 'Female', mr: 'महिला' })}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-lift hover-glow animate-scale-in border-0 shadow-xl" style={{ animationDelay: '0.6s' }}>
              <CardContent className="p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-violet-500/20 rounded-full -mr-8 -mt-8"></div>
                <div className="relative">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-purple-600 animate-pulse-slow" />
                  <div className="mb-1 text-purple-600 font-bold animate-pulse">
                    {statsLoading ? '...' : villagerStats.other}
                  </div>
                  <p className="text-gray-700 font-medium">{t({ en: 'Other', mr: 'इतर' })}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {!isLoggedIn ? (
            <Card className="glass-card border-0 shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <CardContent className="p-8 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-glow">
                    <Shield className="h-8 w-8 text-white animate-pulse-slow" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-blue-800 mb-2 font-bold">
                  {t({ en: 'Login Required', mr: 'लॉगिन आवश्यक' })}
                </h3>
                <p className="text-blue-700 mb-4">
                  {t({ 
                    en: 'Please login to add or edit villager information',
                    mr: 'गावकऱ्यांची माहिती जोडण्यासाठी किंवा संपादित करण्यासाठी कृपया लॉगिन करा'
                  })}
                </p>
                <Button className="btn-gradient hover-scale">
                  {t({ en: 'Login Now', mr: 'आता लॉगिन करा' })}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* User Actions */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="glass-card hover-lift hover-glow cursor-pointer border-0 shadow-xl animate-slide-in-left transition-all duration-500 hover:shadow-2xl group" 
                      style={{ animationDelay: '0.8s' }}
                      onClick={() => setView('addForm')}>
                  <CardContent className="p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-villager-color/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-villager-color to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-float group-hover:animate-glow">
                        <UserPlus className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-villager mb-2 font-bold">
                        {t({ en: 'Add New Villager', mr: 'नवीन गावकरी जोडा' })}
                      </h3>
                      <p className="text-gray-600">
                        {t({ en: 'Register a new villager with complete details', mr: 'संपूर्ण तपशीलांसह नवीन गावकरी नोंदवा' })}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card hover-lift hover-glow cursor-pointer border-0 shadow-xl animate-slide-in-right transition-all duration-500 hover:shadow-2xl group"
                      style={{ animationDelay: '0.9s' }}
                      onClick={() => setView('editStep1_enterMobile')}>
                  <CardContent className="p-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-float group-hover:animate-glow" style={{ animationDelay: '1s' }}>
                        <Edit3 className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-orange-600 mb-2 font-bold">
                        {t({ en: 'Edit Villager Info', mr: 'गावकरी माहिती संपादित करा' })}
                      </h3>
                      <p className="text-gray-600">
                        {t({ en: 'Update existing villager information', mr: 'विद्यमान गावकरी माहिती अद्ययावत करा' })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Admin Only: Recent Submissions */}
              {user?.role === 'admin' && (
                <Card className="glass-card border-0 shadow-xl animate-fade-in-up" style={{ animationDelay: '1s' }}>
                  <CardHeader>
                    <CardTitle className="text-villager flex items-center gap-2">
                      <Zap className="h-5 w-5 animate-pulse-slow" />
                      {t({ en: 'Recent Submissions', mr: 'अलीकडील सबमिशन' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentSubmissions.map((submission, index) => (
                        <div key={submission.id} 
                             className="flex items-center justify-between p-4 glass-effect rounded-xl hover-lift animate-slide-in-right"
                             style={{ animationDelay: `${1.1 + index * 0.1}s` }}>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                              submission.type === 'add' ? 'bg-gradient-to-br from-villager-color to-cyan-600' : 'bg-gradient-to-br from-orange-500 to-red-600'
                            } animate-pulse-slow`}>
                              {submission.type === 'add' ? (
                                <UserPlus className="h-5 w-5 text-white" />
                              ) : (
                                <Edit3 className="h-5 w-5 text-white" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{submission.name}</p>
                              <p className="text-gray-600 text-sm">{submission.mobile}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={`shadow-md ${
                              submission.status === 'pending' ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
                              submission.status === 'approved' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'
                            } text-white border-0 animate-pulse-slow`}>
                              {submission.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                              {submission.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {submission.status === 'rejected' && <AlertCircle className="h-3 w-3 mr-1" />}
                              {t({ 
                                en: submission.status,
                                mr: submission.status === 'pending' ? 'प्रलंबित' : 
                                    submission.status === 'approved' ? 'मंजूर' : 'नाकारले' 
                              })}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Add Villager Form View
  if (view === 'addForm') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-villager-color/20 to-cyan-600/20 rounded-full animate-float"></div>
        
        <div className="container mx-auto max-w-4xl p-4 relative">
          <Card className="glass-card border-0 shadow-2xl animate-scale-in">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={handleGoBack} className="hover-scale glass-effect">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-villager flex items-center gap-2">
                    <UserPlus className="h-5 w-5 animate-pulse-slow" />
                    {t({ en: 'Add New Villager', mr: 'नवीन गावकरी जोडा' })}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    {t({ en: 'Fill all required information for villager registration', mr: 'गावकरी नोंदणीसाठी सर्व आवश्यक माहिती भरा' })}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-villager" />
                      {t({ en: 'Full Name *', mr: 'पूर्ण नाव *' })}
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder={t({ en: 'Enter full name', mr: 'पूर्ण नाव टाका' })}
                      className="glass-effect border-villager/20 focus:border-villager hover-glow transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                    <Label htmlFor="mobile" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-villager" />
                      {t({ en: 'Mobile Number *', mr: 'मोबाइल नंबर *' })}
                    </Label>
                    <Input
                      id="mobile"
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      placeholder={t({ en: '+91 9876543210', mr: '+91 9876543210' })}
                      className="glass-effect border-villager/20 focus:border-villager hover-glow transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-2 animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                    <Label htmlFor="gender" className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-villager" />
                      {t({ en: 'Gender *', mr: 'लिंग *' })}
                    </Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger className="glass-effect border-villager/20 focus:border-villager hover-glow transition-all duration-300">
                        <SelectValue placeholder={t({ en: 'Select gender', mr: 'लिंग निवडा' })} />
                      </SelectTrigger>
                      <SelectContent className="glass-effect">
                        <SelectItem value="Male">{t({ en: 'Male', mr: 'पुरुष' })}</SelectItem>
                        <SelectItem value="Female">{t({ en: 'Female', mr: 'महिला' })}</SelectItem>
                        <SelectItem value="Other">{t({ en: 'Other', mr: 'इतर' })}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
                    <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-villager" />
                      {t({ en: 'Date of Birth', mr: 'जन्मतारीख' })}
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="glass-effect border-villager/20 focus:border-villager hover-glow transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2 animate-slide-in-left" style={{ animationDelay: '0.5s' }}>
                    <Label htmlFor="aadharNumber" className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-villager" />
                      {t({ en: 'Aadhar Number *', mr: 'आधार नंबर *' })}
                    </Label>
                    <Input
                      id="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                      placeholder={t({ en: '1234 5678 9012', mr: '1234 5678 9012' })}
                      className="glass-effect border-villager/20 focus:border-villager hover-glow transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
                    <Label htmlFor="idProof" className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-villager" />
                      {t({ en: 'ID Proof Photo', mr: 'ओळखपत्र फोटो' })}
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="idProof"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('idProof')?.click()}
                        disabled={isUploadingImage}
                        className="glass-effect border-villager/20 hover:bg-villager hover:text-black transition-all duration-300 hover-scale"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {isUploadingImage ? t({ en: 'Uploading...', mr: 'अपलोड करत आहे...' }) : t({ en: 'Upload Photo', mr: 'फोटो अपलोड करा' })}
                      </Button>
                      {formData.idProofPhoto && (
                        <div className="flex items-center gap-2 animate-fade-in-up">
                          <span className="text-green-600 font-medium">✓</span>
                          <span className="text-green-600 font-medium">
                            {formData.idProofPhoto.includes('http') ? t({ en: 'Photo uploaded', mr: 'फोटो अपलोड झाला' }) : formData.idProofPhoto}
                          </span>
                          {formData.idProofPhoto.includes('http') && (
                            <img 
                              src={formData.idProofPhoto} 
                              alt="ID Proof" 
                              className="w-8 h-8 rounded border object-cover"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-villager" />
                    {t({ en: 'Address', mr: 'पत्ता' })}
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder={t({ en: 'Enter complete address', mr: 'संपूर्ण पत्ता टाका' })}
                    rows={3}
                    className="glass-effect border-villager/20 focus:border-villager hover-glow transition-all duration-300"
                    required
                  />
                </div>

                <div className="flex gap-4 animate-scale-in" style={{ animationDelay: '0.8s' }}>
                  <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-villager-color to-cyan-600 text-white border-0 hover-scale hover:shadow-xl transition-all duration-300">
                    <UserCheck className="h-4 w-4 mr-2" />
                    {isLoading ? t({ en: 'Submitting...', mr: 'सबमिट करत आहे...' }) : t({ en: 'Submit Application', mr: 'अर्ज सबमिट करा' })}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleGoBack} className="glass-effect hover-scale">
                    {t({ en: 'Cancel', mr: 'रद्द करा' })}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Edit Step 1: Enter Mobile Number
  if (view === 'editStep1_enterMobile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden">
        <div className="absolute top-32 left-20 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full animate-float"></div>
        
        <div className="container mx-auto max-w-2xl p-4 relative">
          <Card className="glass-card border-0 shadow-2xl animate-scale-in">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={handleGoBack} className="hover-scale glass-effect">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-orange-600 flex items-center gap-2">
                    <Phone className="h-5 w-5 animate-pulse-slow" />
                    {t({ en: 'Verify Mobile Number', mr: 'मोबाइल नंबर पडताळा' })}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    {t({ en: 'Enter mobile number to find and edit villager profiles', mr: 'गावकरी प्रोफाइल शोधण्यासाठी आणि संपादित करण्यासाठी मोबाइल नंबर टाका' })}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <Label htmlFor="mobileEdit" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-orange-600" />
                  {t({ en: 'Mobile Number', mr: 'मोबाइल नंबर' })}
                </Label>
                <Input
                  id="mobileEdit"
                  type="tel"
                  value={editMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                  placeholder={t({ en: '+91 9876543210', mr: '+91 9876543210' })}
                  className="glass-effect border-orange-500/20 focus:border-orange-500 hover-glow transition-all duration-300"
                  required
                />
              </div>

              <form onSubmit={handleGetOtpSubmit} className="space-y-4">
                <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 hover-scale hover:shadow-xl transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.2s' }}>
                  <Phone className="h-4 w-4 mr-2" />
                  {isLoading ? t({ en: 'Sending...', mr: 'पाठवत आहे...' }) : t({ en: 'Send OTP', mr: 'OTP पाठवा' })}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Edit Step 2: Verify OTP
  if (view === 'editStep2_verifyOtp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden">
        <div className="absolute top-32 left-20 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full animate-float"></div>
        
        <div className="container mx-auto max-w-2xl p-4 relative">
          <Card className="glass-card border-0 shadow-2xl animate-scale-in">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={handleGoBack} className="hover-scale glass-effect">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-orange-600 flex items-center gap-2">
                    <Phone className="h-5 w-5 animate-pulse-slow" />
                    {t({ en: 'Verify OTP', mr: 'OTP पडताळा' })}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    {t({ en: 'Enter the 6-digit OTP sent to your mobile number', mr: 'तुमच्या मोबाइल नंबरवर पाठवलेला ६ अंकी OTP टाका' })}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <Label htmlFor="otp" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-orange-600" />
                    {t({ en: 'OTP Code', mr: 'OTP कोड' })}
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    value={editOtp}
                    onChange={(e) => setEditOtp(e.target.value)}
                    placeholder={t({ en: 'Enter 6-digit OTP', mr: '६ अंकी OTP टाका' })}
                    maxLength={6}
                    className="glass-effect border-orange-500/20 focus:border-orange-500 hover-glow transition-all duration-300 text-center text-lg tracking-widest"
                    required
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 hover-scale hover:shadow-xl transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.2s' }}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isLoading ? t({ en: 'Verifying...', mr: 'पडताळत आहे...' }) : t({ en: 'Verify OTP', mr: 'OTP पडताळा' })}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Edit Step 3: Edit Form
  if (view === 'editStep3_editForm') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-600/20 rounded-full animate-float"></div>
        
        <div className="container mx-auto max-w-4xl p-4 relative">
          <Card className="glass-card border-0 shadow-2xl animate-scale-in">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={handleGoBack} className="hover-scale glass-effect">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-orange-600 flex items-center gap-2">
                    <Edit3 className="h-5 w-5 animate-pulse-slow" />
                    {t({ en: 'Edit Villager Information', mr: 'गावकरी माहिती संपादित करा' })}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    {t({ en: 'Update the villager information as needed', mr: 'आवश्यकतेनुसार गावकरी माहिती अद्ययावत करा' })}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                    <Label htmlFor="editFullName" className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-orange-600" />
                      {t({ en: 'Full Name *', mr: 'पूर्ण नाव *' })}
                    </Label>
                    <Input
                      id="editFullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder={t({ en: 'Enter full name', mr: 'पूर्ण नाव टाका' })}
                      className="glass-effect border-orange-500/20 focus:border-orange-500 hover-glow transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                    <Label htmlFor="editMobile" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-orange-600" />
                      {t({ en: 'Mobile Number *', mr: 'मोबाइल नंबर *' })}
                    </Label>
                    <Input
                      id="editMobile"
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      placeholder={t({ en: '+91 9876543210', mr: '+91 9876543210' })}
                      className="glass-effect border-orange-500/20 focus:border-orange-500 hover-glow transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-2 animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                    <Label htmlFor="editGender" className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-orange-600" />
                      {t({ en: 'Gender *', mr: 'लिंग *' })}
                    </Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger className="glass-effect border-orange-500/20 focus:border-orange-500 hover-glow transition-all duration-300">
                        <SelectValue placeholder={t({ en: 'Select gender', mr: 'लिंग निवडा' })} />
                      </SelectTrigger>
                      <SelectContent className="glass-effect">
                        <SelectItem value="Male">{t({ en: 'Male', mr: 'पुरुष' })}</SelectItem>
                        <SelectItem value="Female">{t({ en: 'Female', mr: 'महिला' })}</SelectItem>
                        <SelectItem value="Other">{t({ en: 'Other', mr: 'इतर' })}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
                    <Label htmlFor="editDateOfBirth" className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-orange-600" />
                      {t({ en: 'Date of Birth', mr: 'जन्मतारीख' })}
                    </Label>
                    <Input
                      id="editDateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="glass-effect border-orange-500/20 focus:border-orange-500 hover-glow transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2 animate-slide-in-left" style={{ animationDelay: '0.5s' }}>
                    <Label htmlFor="editAadharNumber" className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-orange-600" />
                      {t({ en: 'Aadhar Number *', mr: 'आधार नंबर *' })}
                    </Label>
                    <Input
                      id="editAadharNumber"
                      value={formData.aadharNumber}
                      onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                      placeholder={t({ en: '1234 5678 9012', mr: '1234 5678 9012' })}
                      className="glass-effect border-orange-500/20 focus:border-orange-500 hover-glow transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-2 animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
                    <Label htmlFor="editIdProof" className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-orange-600" />
                      {t({ en: 'ID Proof Photo', mr: 'ओळखपत्र फोटो' })}
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="editIdProof"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('editIdProof')?.click()}
                        disabled={isUploadingImage}
                        className="glass-effect border-orange-500/20 hover:bg-orange-500 hover:text-black transition-all duration-300 hover-scale"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {isUploadingImage ? t({ en: 'Uploading...', mr: 'अपलोड करत आहे...' }) : t({ en: 'Upload Photo', mr: 'फोटो अपलोड करा' })}
                      </Button>
                      {formData.idProofPhoto && (
                        <div className="flex items-center gap-2 animate-fade-in-up">
                          <span className="text-green-600 font-medium">✓</span>
                          <span className="text-green-600 font-medium">
                            {formData.idProofPhoto.includes('http') ? t({ en: 'Photo uploaded', mr: 'फोटो अपलोड झाला' }) : formData.idProofPhoto}
                          </span>
                          {formData.idProofPhoto.includes('http') && (
                            <img 
                              src={formData.idProofPhoto} 
                              alt="ID Proof" 
                              className="w-8 h-8 rounded border object-cover"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                  <Label htmlFor="editAddress" className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-orange-600" />
                    {t({ en: 'Address', mr: 'पत्ता' })}
                  </Label>
                  <Textarea
                    id="editAddress"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder={t({ en: 'Enter complete address', mr: 'संपूर्ण पत्ता टाका' })}
                    rows={3}
                    className="glass-effect border-orange-500/20 focus:border-orange-500 hover-glow transition-all duration-300"
                    required
                  />
                </div>

                <div className="flex gap-4 animate-scale-in" style={{ animationDelay: '0.8s' }}>
                  <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 hover-scale hover:shadow-xl transition-all duration-300">
                    <Edit3 className="h-4 w-4 mr-2" />
                    {isLoading ? t({ en: 'Submitting...', mr: 'सबमिट करत आहे...' }) : t({ en: 'Submit Edit Request', mr: 'संपादन विनंती सबमिट करा' })}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleGoBack} className="glass-effect hover-scale">
                    {t({ en: 'Cancel', mr: 'रद्द करा' })}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <Card className="glass-card border-0 shadow-2xl">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t({ en: 'Something went wrong', mr: 'काहीतरी चुकीचे झाले' })}
          </h2>
          <Button onClick={() => setView('initial')} className="btn-gradient hover-scale">
            {t({ en: 'Go Back', mr: 'मागे जा' })}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}