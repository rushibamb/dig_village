import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useLanguage } from './LanguageProvider';
import useAuthStore from '../store/authStore';
import { getMyVillagerProfile } from '../services/villagerService';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Edit, 
  LogOut,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface VillagerProfile {
  _id: string;
  fullName: string;
  mobileNumber: string;
  gender: string;
  dateOfBirth: string;
  aadharNumber: string;
  address: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestType: string;
  submittedBy: {
    _id: string;
    name: string;
    email: string;
  };
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export function ProfilePage() {
  const { t } = useLanguage();
  const { user, logout } = useAuthStore();
  const [villagerProfile, setVillagerProfile] = useState<VillagerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getMyVillagerProfile();
        if (response.success) {
          setVillagerProfile(response.data);
        }
      } catch (error) {
        console.error('Error fetching villager profile:', error);
        toast.error(t({ 
          en: 'Failed to load profile data', 
          mr: 'प्रोफाइल डेटा लोड करण्यात अयशस्वी' 
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [t]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'Rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleLogout = () => {
    logout();
    toast.success(t({ 
      en: 'Logged out successfully', 
      mr: 'यशस्वीरित्या लॉग आउट केले' 
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                {t({ en: 'Loading profile...', mr: 'प्रोफाइल लोड होत आहे...' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t({ en: 'My Profile', mr: 'माझे प्रोफाइल' })}
          </h1>
          <p className="text-muted-foreground">
            {t({ en: 'View and manage your profile information', mr: 'आपली प्रोफाइल माहिती पहा आणि व्यवस्थापित करा' })}
          </p>
        </div>

        {/* User Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {t({ en: 'Account Information', mr: 'खाते माहिती' })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t({ en: 'Full Name', mr: 'पूर्ण नाव' })}
                  </p>
                  <p className="font-medium">{user?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t({ en: 'Email Address', mr: 'ईमेल पत्ता' })}
                  </p>
                  <p className="font-medium">{user?.email || 'N/A'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Villager Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {t({ en: 'Villager Profile', mr: 'ग्रामीण प्रोफाइल' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {villagerProfile ? (
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(villagerProfile.status)}
                    <span className="font-medium">
                      {t({ en: 'Profile Status', mr: 'प्रोफाइल स्थिती' })}
                    </span>
                  </div>
                  <Badge className={`${getStatusColor(villagerProfile.status)} border`}>
                    {villagerProfile.status}
                  </Badge>
                </div>

                <Separator />

                {/* Profile Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t({ en: 'Full Name', mr: 'पूर्ण नाव' })}
                        </p>
                        <p className="font-medium">{villagerProfile.fullName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t({ en: 'Mobile Number', mr: 'मोबाइल नंबर' })}
                        </p>
                        <p className="font-medium">+91 {villagerProfile.mobileNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t({ en: 'Date of Birth', mr: 'जन्म तारीख' })}
                        </p>
                        <p className="font-medium">
                          {new Date(villagerProfile.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t({ en: 'Aadhar Number', mr: 'आधार क्रमांक' })}
                        </p>
                        <p className="font-medium font-mono">
                          {villagerProfile.aadharNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t({ en: 'Gender', mr: 'लिंग' })}
                        </p>
                        <p className="font-medium">{villagerProfile.gender}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t({ en: 'Address', mr: 'पत्ता' })}
                        </p>
                        <p className="font-medium">{villagerProfile.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <Separator />
                <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                  <div>
                    <p><strong>{t({ en: 'Request Type:', mr: 'विनंती प्रकार:' })}</strong> {villagerProfile.requestType}</p>
                    <p><strong>{t({ en: 'Submitted At:', mr: 'सबमिट केले:' })}</strong> {new Date(villagerProfile.submittedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p><strong>{t({ en: 'Profile Created:', mr: 'प्रोफाइल तयार केले:' })}</strong> {new Date(villagerProfile.createdAt).toLocaleDateString()}</p>
                    <p><strong>{t({ en: 'Last Updated:', mr: 'शेवटचे अपडेट:' })}</strong> {new Date(villagerProfile.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t({ en: 'No Villager Profile Found', mr: 'कोणताही ग्रामीण प्रोफाइल सापडला नाही' })}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t({ 
                    en: 'Your villager profile is not yet approved or created.', 
                    mr: 'तुमचे ग्रामीण प्रोफाइल अद्याप मंजूर किंवा तयार केले गेले नाही.' 
                  })}
                </p>
                <Link to="/villager">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Edit className="h-4 w-4 mr-2" />
                    {t({ en: 'Create Profile', mr: 'प्रोफाइल तयार करा' })}
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/villager">
            <Button variant="outline" className="w-full sm:w-auto">
              <Edit className="h-4 w-4 mr-2" />
              {t({ en: 'Edit Profile', mr: 'प्रोफाइल संपादित करा' })}
            </Button>
          </Link>
          
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            className="w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t({ en: 'Logout', mr: 'लॉग आउट' })}
          </Button>
        </div>
      </div>
    </div>
  );
}
