import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { useLanguage } from './LanguageProvider';
import { useAuth } from './AuthContext';
import { authService } from '../services/authService';
import { toast } from 'sonner';
import { Shield, User, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export function AdminLoginPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Use AuthContext login function
      const response = await login(formData);
      
      if (response && response.success) {
        // Check if user is admin
        if (response.user && response.user.role === 'admin') {
          toast.success(t({ 
            en: 'Admin login successful!', 
            mr: 'प्रशासक लॉगिन यशस्वी!' 
          }));
          // Navigate to admin dashboard immediately
          // Force navigation with replace
          window.location.href = '/admin/dashboard';
        } else {
          setError(t({ 
            en: 'Access denied. Admin role required.', 
            mr: 'प्रकार नाकारले. प्रशासक भूमिका आवश्यक.' 
          }));
        }
      } else {
        setError(t({ 
          en: 'Invalid credentials', 
          mr: 'अवैध प्रमाणपत्र' 
        }));
      }
    } catch (error: any) {
      console.error('Admin login error:', error);
      setError(error.message || t({ 
        en: 'Login failed. Please try again.', 
        mr: 'लॉगिन अयशस्वी. कृपया पुन्हा प्रयत्न करा.' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back to Home Button */}
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mb-6 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t({ en: 'Back to Home', mr: 'होमवर परत' })}
          </Button>

          <Card className="bg-gray-800 border-gray-700 shadow-xl">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-white">
                  {t({ en: 'Admin Portal', mr: 'प्रशासक पोर्टल' })}
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  {t({ en: 'Village Administration System', mr: 'गाव प्रशासन प्रणाली' })}
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 px-6 pb-6">
              {error && (
                <Alert className="bg-red-900/30 border-red-700 text-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">
                    {t({ en: 'Admin Email', mr: 'प्रशासक ईमेल' })}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 h-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="admin@village.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-medium">
                    {t({ en: 'Password', mr: 'पासवर्ड' })}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 h-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {t({ en: 'Signing in...', mr: 'साइन इन करत आहे...' })}
                    </div>
                  ) : (
                    t({ en: 'Access Admin Panel', mr: 'प्रशासक पॅनेलमध्ये प्रवेश करा' })
                  )}
                </Button>
              </form>

              <div className="text-center pt-4 border-t border-gray-700">
                <p className="text-white text-sm mb-3">
                  {t({ en: 'Default Admin Credentials:', mr: 'डिफॉल्ट प्रशासक प्रमाणपत्र:' })}
                </p>
                <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                  <p className="text-white text-sm font-mono mb-1">
                    Email: admin@village.com
                  </p>
                  <p className="text-white text-sm font-mono">
                    Password: admin123
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}