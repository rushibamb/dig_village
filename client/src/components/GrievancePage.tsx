import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useLanguage } from './LanguageProvider';
import { useAuth } from './AuthContext';
import { toast } from 'sonner@2.0.3';
import { FileText, Plus, MessageCircle, Clock, CheckCircle, AlertTriangle, Camera, User } from 'lucide-react';
import { getMyGrievances, submitGrievance, getGrievanceStats } from '../services/grievanceService';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function GrievancePage() {
  const { t } = useLanguage();
  const { isLoggedIn } = useAuth();

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
  const [myGrievances, setMyGrievances] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [newGrievanceData, setNewGrievanceData] = useState({ 
    title: '', 
    description: '', 
    category: '', 
    priority: 'Normal', 
    location: '' 
  });
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Reusable function to fetch grievances
  const fetchGrievances = async () => {
    if (isLoggedIn) {
      try {
        const response = await getMyGrievances();
        if (response.success) {
          setMyGrievances(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching grievances:', error);
        toast.error(t({ 
          en: 'Failed to fetch your grievances', 
          mr: 'तुमच्या तक्रारी मिळवताना त्रुटी आली' 
        }));
      }
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await getGrievanceStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };


  // Fetch data on component mount and set up polling
  useEffect(() => {
    // Fetch all initial data
    fetchStats();
    if (isLoggedIn) {
      fetchGrievances();
    }
    
    // Set up polling every 15 seconds for grievances
    const griefIntervalId = isLoggedIn ? setInterval(fetchGrievances, 15000) : null;
    
    // Cleanup function to clear intervals
    return () => {
      if (griefIntervalId) clearInterval(griefIntervalId);
    };
  }, [isLoggedIn, t]);

  const handleNewGrievance = () => {
    if (!isLoggedIn) {
      toast.error(t({ 
        en: 'Please login to submit a grievance', 
        mr: 'तक्रार सबमिट करण्यासाठी कृपया लॉगिन करा' 
      }));
      return;
    }
    setIsModalOpen(true);
  };

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGrievanceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle view details for a grievance
  const handleViewDetails = (grievance) => {
    setSelectedGrievance(grievance);
    setIsDetailModalOpen(true);
  };

  // Handle photo upload for grievance
  const handleGrievancePhotoUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Convert images to base64 data URLs for persistent storage
    // In production, replace this with actual Cloudinary upload
    try {
      const uploadPromises = files.map(async (file) => {
        // Optimize and convert file to base64 data URL for persistent storage
        return new Promise(async (resolve, reject) => {
          if (!file.type.startsWith('image/')) {
            reject(new Error('File must be an image'));
            return;
          }
          
          // Compress image if it's too large (> 1MB)
          let processedFile = file;
          if (file.size > 1024 * 1024) { // 1MB
            processedFile = await compressImage(file);
          }
          
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target.result);
          };
          reader.onerror = () => {
            reject(new Error('Failed to read file'));
          };
          reader.readAsDataURL(processedFile);
        });
      });

      const uploadUrls = await Promise.all(uploadPromises);
      setUploadedPhotoUrls(prev => [...prev, ...uploadUrls]);
      
      toast.success(t({ 
        en: 'Photos uploaded successfully!', 
        mr: 'फोटो यशस्वीरित्या अपलोड केले!' 
      }));
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error(t({ 
        en: 'Please select only image files', 
        mr: 'कृपया फक्त फोटो निवडा' 
      }));
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!newGrievanceData.title || !newGrievanceData.description || !newGrievanceData.category) {
      toast.error(t({ 
        en: 'Please fill in all required fields', 
        mr: 'कृपया सर्व आवश्यक फील्ड भरा' 
      }));
      return;
    }

    try {
      const grievanceDataWithPhotos = {
        ...newGrievanceData,
        photos: uploadedPhotoUrls
      };
      
      const response = await submitGrievance(grievanceDataWithPhotos);
      if (response.success) {
        toast.success(t({ 
          en: 'Grievance submitted successfully!', 
          mr: 'तक्रार यशस्वीरित्या सबमिट केली!' 
        }));
        
        // Close modal and reset form
        setIsModalOpen(false);
        setNewGrievanceData({ 
          title: '', 
          description: '', 
          category: '', 
          priority: 'Normal', 
          location: '' 
        });
        setUploadedPhotoUrls([]);
        
        // Refresh grievances list
        await fetchGrievances();
      }
    } catch (error) {
      console.error('Error submitting grievance:', error);
      toast.error(t({ 
        en: 'Failed to submit grievance', 
        mr: 'तक्रार सबमिट करताना त्रुटी आली' 
      }));
    }
  };

  const grievances = [
    {
      id: 'GRV001',
      title: { en: 'Street Light Not Working', mr: 'रस्ता दिवा काम करत नाही' },
      category: { en: 'Infrastructure', mr: 'पायाभूत सुविधा' },
      description: { en: 'The street light near temple is not working since 3 days', mr: 'मंदिराजवळील रस्ता दिवा ३ दिवसांपासून काम करत नाही' },
      status: 'in-progress',
      date: '10 Jan 2024',
      response: { en: 'We have forwarded your complaint to electricity department', mr: 'आम्ही तुमची तक्रार वीज विभागाकडे पाठवली आहे' }
    },
    {
      id: 'GRV002',
      title: { en: 'Water Supply Issue', mr: 'पाणीपुरवठ्याची समस्या' },
      category: { en: 'Water', mr: 'पाणी' },
      description: { en: 'Irregular water supply in ward 3', mr: 'वार्ड ३ मध्ये अनियमित पाणीपुरवठा' },
      status: 'resolved',
      date: '5 Jan 2024',
      response: { en: 'Issue has been resolved. New water connection installed', mr: 'समस्येचे निराकरण झाले आहे. नवीन पाणी कनेक्शन बसवले आहे' }
    },
    {
      id: 'GRV003',
      title: { en: 'Road Repair Needed', mr: 'रस्ता दुरुस्तीची गरज' },
      category: { en: 'Roads', mr: 'रस्ते' },
      description: { en: 'Main road has potholes causing inconvenience', mr: 'मुख्य रस्त्यावर खड्डे असल्यामुळे अडचण होत आहे' },
      status: 'pending',
      date: '8 Jan 2024',
      response: null
    }
  ];

  const categories = [
    { en: 'Infrastructure', mr: 'पायाभूत सुविधा' },
    { en: 'Water', mr: 'पाणी' },
    { en: 'Roads', mr: 'रस्ते' },
    { en: 'Electricity', mr: 'वीज' },
    { en: 'Health', mr: 'आरोग्य' },
    { en: 'Education', mr: 'शिक्षण' },
    { en: 'Other', mr: 'इतर' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500 text-white';
      case 'In-progress': return 'bg-blue-500 text-white';
      case 'Resolved': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'In-progress': return <MessageCircle className="h-4 w-4" />;
      case 'Resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-grievance rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t({ en: 'Grievance Redressal', mr: 'तक्रार निवारण' })}
          </h1>
          <p className="text-gray-600 text-lg">
            {t({ en: 'Submit complaints and track their resolution', mr: 'तक्रारी सबमिट करा आणि त्यांच्या निराकरणाचा मागोवा घ्या' })}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* New Grievance Button */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <Card className="mb-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        {t({ en: 'Have a Complaint?', mr: 'तक्रार आहे?' })}
                      </h3>
                      <p className="opacity-90">
                        {t({ en: 'Submit your grievance and we will address it promptly', mr: 'आपली तक्रार सबमिट करा आणि आम्ही तिचे तातडीने निराकरण करू' })}
                      </p>
                    </div>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={handleNewGrievance}
                        className="bg-black text-white hover:bg-gray-800"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {t({ en: 'New Grievance', mr: 'नवीन तक्रार' })}
                      </Button>
                    </DialogTrigger>
                  </div>
                </CardContent>
              </Card>

              {/* Modal Form */}
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-grievance text-xl">
                    {t({ en: 'Submit New Grievance', mr: 'नवीन तक्रार सबमिट करा' })}
                  </DialogTitle>
                  <DialogDescription>
                    {t({ en: 'Fill in the details to submit your grievance', mr: 'तुमच्या तक्रारीची तपशील भरून सबमिट करा' })}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t({ en: 'Category', mr: 'श्रेणी' })} *
                      </label>
                      <select 
                        name="category"
                        value={newGrievanceData.category}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                        <option value="">{t({ en: 'Select Category', mr: 'श्रेणी निवडा' })}</option>
                        {categories.map((cat, index) => (
                          <option key={index} value={cat.en}>{t(cat)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t({ en: 'Priority', mr: 'प्राधान्यता' })}
                      </label>
                      <select 
                        name="priority"
                        value={newGrievanceData.priority}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Normal">{t({ en: 'Normal', mr: 'सामान्य' })}</option>
                        <option value="High">{t({ en: 'High', mr: 'उच्च' })}</option>
                        <option value="Urgent">{t({ en: 'Urgent', mr: 'तातडीची' })}</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t({ en: 'Subject', mr: 'विषय' })} *
                    </label>
                    <Input 
                      type="text" 
                      name="title"
                      value={newGrievanceData.title}
                      onChange={handleInputChange}
                      placeholder={t({ en: 'Brief description of your issue', mr: 'तुमच्या समस्येचे थोडक्यात वर्णन' })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t({ en: 'Description', mr: 'तपशील' })} *
                    </label>
                    <Textarea 
                      name="description"
                      value={newGrievanceData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder={t({ en: 'Provide detailed information about your grievance', mr: 'तुमच्या तक्रारीची तपशीलवार माहिती द्या' })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t({ en: 'Location', mr: 'स्थान' })}
                    </label>
                    <Input 
                      type="text" 
                      name="location"
                      value={newGrievanceData.location}
                      onChange={handleInputChange}
                      placeholder={t({ en: 'Specific location (optional)', mr: 'विशिष्ट स्थान (पर्यायी)' })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t({ en: 'Photos (Optional)', mr: 'फोटो (पर्यायी)' })}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGrievancePhotoUpload}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploadedPhotoUrls.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">{t({ en: 'Uploaded Photos:', mr: 'अपलोड केलेले फोटो:' })}</p>
                        <div className="grid grid-cols-3 gap-2">
                          {uploadedPhotoUrls.map((url, index) => (
                            <div key={index} className="aspect-square overflow-hidden rounded-lg border">
                              <img
                                src={url}
                                alt={`Uploaded photo ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="border-black text-black hover:bg-grey hover:text-black">
                      {t({ en: 'Submit Grievance', mr: 'तक्रार सबमिट करा' })}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setIsModalOpen(false)}
                      className="border-black text-black hover:bg-black hover:text-grey"
                    >
                      {t({ en: 'Cancel', mr: 'रद्द करा' })}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Authentication Warning */}
            {!isLoggedIn && (
              <Card className="mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center animate-pulse-slow">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-purple-700 mb-1">
                        {t({ en: 'Login Required', mr: 'लॉगिन आवश्यक' })}
                      </h3>
                      <p className="text-purple-600 text-sm mb-3">
                        {t({ 
                          en: 'You need to login to submit grievances and track their status. Please login to access all features.',
                          mr: 'तक्रारी सबमिट करण्यासाठी आणि त्यांची स्थिती पाहण्यासाठी तुम्हाला लॉगिन करावे लागेल. सर्व वैशिष्ट्ये वापरण्यासाठी कृपया लॉगिन करा.'
                        })}
                      </p>
                      <Button 
                        onClick={() => window.location.href = '/login'}
                        className="bg-black hover:bg-gray-800 text-white border-0 hover-scale hover:shadow-xl transition-all duration-300"
                        size="sm"
                      >
                        <User className="h-4 w-4 mr-2" />
                        {t({ en: 'Login Now', mr: 'आता लॉगिन करा' })}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}


            {/* Existing Grievances */}
            <Card>
              <CardHeader>
                <CardTitle className="text-grievance">
                  {t({ en: 'Your Grievances', mr: 'तुमच्या तक्रारी' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myGrievances.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>{t({ en: 'No grievances found', mr: 'कोणत्याही तक्रारी नाही' })}</p>
                    </div>
                  ) : (
                    myGrievances.map((grievance) => (
                      <div key={grievance._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {grievance.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {t({ en: `Category: ${grievance.category}`, mr: `श्रेणी: ${grievance.category}` })}
                            </p>
                            <p className="text-sm text-gray-600">
                              {t({ en: `Priority: ${grievance.priority}`, mr: `प्राधान्यता: ${grievance.priority}` })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={`border ${
                                grievance.progressStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                grievance.progressStatus === 'In-progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                grievance.progressStatus === 'Resolved' ? 'bg-green-100 text-green-800 border-green-200' :
                                'bg-gray-100 text-gray-800 border-gray-200'
                              }`}
                            >
                              {getStatusIcon(grievance.progressStatus)}
                              <span className="ml-1">
                                {t({ 
                                  en: grievance.progressStatus === 'Pending' ? 'Pending' : grievance.progressStatus === 'In-progress' ? 'In Progress' : 'Resolved',
                                  mr: grievance.progressStatus === 'Pending' ? 'प्रलंबित' : grievance.progressStatus === 'In-progress' ? 'प्रगतीपथावर' : 'निराकरण झाले'
                                })}
                              </span>
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-3">
                          {grievance.description}
                        </p>
                        
                        {grievance.location && (
                          <p className="text-sm text-gray-600 mb-3">
                            📍 {grievance.location}
                          </p>
                        )}
                        
                        {grievance.adminStatus === 'Approved' && grievance.assignedWorker && (
                          <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
                            <p className="text-sm font-medium text-green-800 mb-1">
                              {t({ en: 'Assigned to:', mr: 'नियुक्त केले:' })}
                            </p>
                            <p className="text-green-700 text-sm">
                              {grievance.assignedWorker.name} - {grievance.assignedWorker.department}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center mt-3 pt-3 border-t">
                          <span className="text-sm text-gray-500">
                            {t({ en: `Submitted on ${new Date(grievance.createdAt).toLocaleDateString()}`, mr: `${new Date(grievance.createdAt).toLocaleDateString()} रोजी सबमिट केले` })}
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(grievance)}
                            className="border-black text-black hover:bg-black hover:text-white"
                          >
                            {t({ en: 'View Details', mr: 'तपशील पहा' })}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Grievance Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-grievance">
                  {t({ en: 'Statistics', mr: 'आकडेवारी' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>{t({ en: 'Total Grievances', mr: 'एकूण तक्रारी' })}</span>
                    <span className="font-bold">{stats?.total || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t({ en: 'Resolved', mr: 'निराकरण झालेल्या' })}</span>
                    <span className="font-bold text-green-600">{stats?.resolved || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t({ en: 'In Progress', mr: 'प्रगतीपथावर' })}</span>
                    <span className="font-bold text-blue-600">{stats?.inProgress || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t({ en: 'Pending', mr: 'प्रलंबित' })}</span>
                    <span className="font-bold text-yellow-600">{stats?.pending || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-grievance">
                  {t({ en: 'Contact Information', mr: 'संपर्क माहिती' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">{t({ en: 'Contact Information', mr: 'संपर्क माहिती' })}</p>
                    <p>{t({ en: 'Gram Panchayat Office', mr: 'ग्राम पंचायत कार्यालय' })}</p>
                    <p>📞 {t({ en: 'Contact: +91-XXXX-XXXXXX', mr: 'संपर्क: +९१-XXXX-XXXXXX' })}</p>
                  </div>
                  <div>
                    <p className="font-medium">{t({ en: 'Office Hours', mr: 'कार्यालयीन वेळा' })}</p>
                    <p>{t({ en: 'Monday - Friday: 9 AM - 5 PM', mr: 'सोमवार - शुक्रवार: सकाळी ९ - संध्याकाळी ५' })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Grievance Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-2xl font-bold">
              {t({ en: 'Grievance Details', mr: 'तक्रार तपशील' })}
            </DialogTitle>
            <DialogDescription>
              {t({ en: 'View detailed information about your grievance', mr: 'तुमच्या तक्रारीची तपशीलवार माहिती पहा' })}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2">
            {selectedGrievance ? (
              <div className="space-y-6 p-1">
                {/* Scroll Notice */}
                <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-md mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        <strong>Scroll down to view all details including photos and submission information.</strong>
                        <br />
                        <span className="text-xs text-green-600">🔧 Photos are compressed & stored efficiently - images will load reliably after page refresh!</span>
                      </p>
                    </div>
                  </div>
                </div>
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t({ en: 'Basic Information', mr: 'मूलभूत माहिती' })}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="font-medium text-muted-foreground">{t({ en: 'Title', mr: 'विषय' })}</label>
                      <p className="text-foreground font-semibold">{selectedGrievance.title}</p>
                    </div>
                    <div>
                      <label className="font-medium text-muted-foreground">{t({ en: 'Description', mr: 'वर्णन' })}</label>
                      <p className="text-foreground font-semibold">{selectedGrievance.description}</p>
                    </div>
                    <div>
                      <label className="font-medium text-muted-foreground">{t({ en: 'Category', mr: 'श्रेणी' })}</label>
                      <Badge variant="secondary" className="ml-2">{selectedGrievance.category}</Badge>
                    </div>
                    <div>
                      <label className="font-medium text-muted-foreground">{t({ en: 'Priority', mr: 'प्राधान्यता' })}</label>
                      <Badge 
                        variant={
                          selectedGrievance.priority === 'Urgent' ? 'destructive' :
                          selectedGrievance.priority === 'High' ? 'default' : 'secondary'
                        }
                        className="ml-2"
                      >
                        {selectedGrievance.priority}
                      </Badge>
                    </div>
                    {selectedGrievance.location && (
                      <div>
                        <label className="font-medium text-muted-foreground">{t({ en: 'Location', mr: 'स्थान' })}</label>
                        <p className="text-foreground font-semibold">📍 {selectedGrievance.location}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">{t({ en: 'Status Information', mr: 'स्थिती माहिती' })}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="font-medium text-muted-foreground">{t({ en: 'Progress Status', mr: 'प्रगती स्थिती' })}</label>
                    <Badge 
                      className={`ml-2 ${
                        selectedGrievance.progressStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        selectedGrievance.progressStatus === 'In-progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        selectedGrievance.progressStatus === 'Resolved' ? 'bg-green-100 text-green-800 border-green-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      } border`}
                    >
                      {getStatusIcon(selectedGrievance.progressStatus)}
                      <span className="ml-1">
                        {t({ 
                          en: selectedGrievance.progressStatus === 'Pending' ? 'Pending' : 
                              selectedGrievance.progressStatus === 'In-progress' ? 'In Progress' : 'Resolved',
                          mr: selectedGrievance.progressStatus === 'Pending' ? 'प्रलंबित' : 
                              selectedGrievance.progressStatus === 'In-progress' ? 'प्रगतीपथावर' : 'निराकरण झाले'
                        })}
                      </span>
                    </Badge>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground">{t({ en: 'Admin Status', mr: 'व्यवस्थापक स्थिती' })}</label>
                    <Badge 
                      className={`ml-2 border ${
                        selectedGrievance.adminStatus === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                        selectedGrievance.adminStatus === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }`}
                    >
                      {selectedGrievance.adminStatus}
                    </Badge>
                  </div>
                  {selectedGrievance.assignedWorker && (
                    <div>
                      <label className="font-medium text-muted-foreground">{t({ en: 'Assigned Worker', mr: 'नियुक्त कामगार' })}</label>
                      <p className="text-foreground font-semibold">{selectedGrievance.assignedWorker.name} - {selectedGrievance.assignedWorker.department}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submission Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">{t({ en: 'Submission Details', mr: 'सबमिशन तपशील' })}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="font-medium text-muted-foreground">{t({ en: 'Submitted On', mr: 'सबमिट दिनांक' })}</label>
                    <p className="text-foreground font-semibold">{new Date(selectedGrievance.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground">{t({ en: 'Last Updated', mr: 'शेवटी अद्ययावत' })}</label>
                    <p className="text-foreground font-semibold">{new Date(selectedGrievance.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Resolution Photos Section */}
              {selectedGrievance.resolutionPhotos && selectedGrievance.resolutionPhotos.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">{t({ en: 'Resolution Photos', mr: 'निराकरण फोटो' })}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedGrievance.resolutionPhotos.map((photo, index) => (
                      <div 
                        key={index} 
                        className="aspect-square overflow-hidden rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedImage(photo)}
                      >
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
                      <div 
                        key={index} 
                        className="aspect-square overflow-hidden rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedImage(photo)}
                      >
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
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">{t({ en: 'Loading grievance details...', mr: 'तक्रार तपशील लोड करत आहे...' })}</p>
            </div>
          )}
          </div>

          <div className="flex justify-end pt-4 border-t flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
              className="border-black text-black hover:bg-black hover:text-white"
            >
              {t({ en: 'Close', mr: 'बंद करा' })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Viewer Modal */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl font-bold">
              {t({ en: 'Image Viewer', mr: 'प्रतिमा दर्शक' })}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 flex items-center justify-center p-4">
            {selectedImage && (
              <div className="relative w-full h-full flex items-center justify-center">
                <ImageWithFallback
                  src={selectedImage}
                  alt="Full size image"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end pt-4 border-t flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setSelectedImage(null)}
              className="border-black text-black hover:bg-black hover:text-white"
            >
              {t({ en: 'Close', mr: 'बंद करा' })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}