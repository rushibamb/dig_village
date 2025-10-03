import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useLanguage } from './LanguageProvider';
import { useAuth } from './AuthContext';
import { 
  LogIn, 
  User, 
  Lock, 
  Phone, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Shield,
  CheckCircle,
  Timer,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface AuthenticationPageProps {
  onNavigate?: (page: string) => void;
}

type AuthMode = 'login' | 'register' | 'forgot-password' | 'otp-verification' | 'reset-password';

export function AuthenticationPage({ onNavigate }: AuthenticationPageProps) {
  const { t } = useLanguage();
  const { login, register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Determine auth mode from URL
  const [authMode, setAuthMode] = useState<AuthMode>(() => {
    const path = location.pathname;
    if (path === '/register') return 'register';
    if (path === '/login') return 'login';
    return 'login';
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    otp: ''
  });

  // OTP Timer effect
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (validationErrors[field]) {
      clearFieldError(field);
    }
    
    // Real-time validation for specific fields
    if (field === 'email' && value && !validateEmail(value)) {
      setFieldError(field, t({ en: 'Invalid email/phone format', mr: 'अवैध ईमेल/फोन फॉर्मेट' }));
    }
    
    if (field === 'phone' && value && !validatePhone(value)) {
      setFieldError(field, t({ en: 'Invalid phone number format', mr: 'अवैध फोन नंबर फॉर्मेट' }));
    }
    
    if (field === 'password' && value && !validatePassword(value)) {
      setFieldError(field, t({ en: 'Password too short', mr: 'पासवर्ड खूप लहान' }));
    }
    
    if (field === 'confirmPassword' && value && formData.password && value !== formData.password) {
      setFieldError(field, t({ en: 'Passwords do not match', mr: 'पासवर्ड जुळत नाहीत' }));
    }
    
    if (field === 'otp' && value && (value.length > 6 || !/^\d*$/.test(value))) {
      // Prevent invalid OTP input
      return;
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[0-9]{10,}$/;
    return emailRegex.test(email) || phoneRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[+]?[0-9]{10,}$/;
    return phoneRegex.test(phone);
  };

  const clearValidationErrors = () => {
    setValidationErrors({});
  };

  const setFieldError = (field: string, message: string) => {
    setValidationErrors(prev => ({ ...prev, [field]: message }));
  };

  const clearFieldError = (field: string) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const navigateToMode = (mode: AuthMode, resetFormData = true) => {
    setAuthMode(mode);
    clearValidationErrors();
    setSuccessMessage('');
    clearError();
    if (resetFormData) {
      resetForm();
    }
    // Update URL based on mode
    const url = mode === 'login' ? '/login' : `/${mode}`;
    navigate(url);
  };

  const navigateBack = () => {
    switch (authMode) {
      case 'register':
        navigateToMode('login');
        break;
      case 'forgot-password':
        navigateToMode('login');
        break;
      case 'otp-verification':
        navigateToMode('forgot-password', false);
        break;
      case 'reset-password':
        navigateToMode('forgot-password', false);
        break;
      default:
        if (onNavigate) {
          onNavigate('home');
        } else {
          navigate('/');
        }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearValidationErrors();
    clearError();

    // Client-side validation
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = t({ en: 'Email is required', mr: 'ईमेल आवश्यक आहे' });
    } else if (!validateEmail(formData.email)) {
      errors.email = t({ en: 'Please enter a valid email', mr: 'कृपया वैध ईमेल टाका' });
    }

    if (!formData.password.trim()) {
      errors.password = t({ en: 'Password is required', mr: 'पासवर्ड आवश्यक आहे' });
    } else if (!validatePassword(formData.password)) {
      errors.password = t({ en: 'Password must be at least 6 characters', mr: 'पासवर्ड किमान 6 अक्षरांचा असावा' });
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const response = await login({
        email: formData.email,
        password: formData.password
      });

      if (response.success) {
        setSuccessMessage(t({ en: 'Login successful!', mr: 'लॉगिन यशस्वी!' }));
        toast.success(t({ en: 'Welcome back!', mr: 'परत स्वागत आहे!' }));
        
        // Navigate to home page after successful login
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (error: any) {
      const errorMessage = error.message || t({ en: 'Login failed. Please try again.', mr: 'लॉगिन अयशस्वी. कृपया पुन्हा प्रयत्न करा.' });
      setFieldError('password', errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearValidationErrors();
    clearError();

    const { name, email, password, confirmPassword } = formData;
    const errors: Record<string, string> = {};

    // Comprehensive validation
    if (!name.trim()) {
      errors.name = t({ en: 'Full name is required', mr: 'पूर्ण नाव आवश्यक आहे' });
    } else if (name.trim().length < 2) {
      errors.name = t({ en: 'Name must be at least 2 characters', mr: 'नाव किमान 2 अक्षरांचे असावे' });
    }

    if (!email.trim()) {
      errors.email = t({ en: 'Email is required', mr: 'ईमेल आवश्यक आहे' });
    } else if (!validateEmail(email)) {
      errors.email = t({ en: 'Please enter a valid email', mr: 'कृपया वैध ईमेल टाका' });
    }

    if (!password) {
      errors.password = t({ en: 'Password is required', mr: 'पासवर्ड आवश्यक आहे' });
    } else if (!validatePassword(password)) {
      errors.password = t({ en: 'Password must be at least 6 characters', mr: 'पासवर्ड किमान 6 अक्षरांचा असावा' });
    }

    if (!confirmPassword) {
      errors.confirmPassword = t({ en: 'Please confirm your password', mr: 'कृपया आपला पासवर्ड पुष्टी करा' });
    } else if (password !== confirmPassword) {
      errors.confirmPassword = t({ en: 'Passwords do not match', mr: 'पासवर्ड जुळत नाहीत' });
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.success) {
        setSuccessMessage(t({ en: 'Registration successful!', mr: 'नोंदणी यशस्वी!' }));
        toast.success(t({ en: 'Welcome to Smart Village Portal!', mr: 'स्मार्ट व्हिलेज पोर्टलमध्ये स्वागत आहे!' }));
        
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (error: any) {
      const errorMessage = error.message || t({ en: 'Registration failed. Please try again.', mr: 'नोंदणी अयशस्वी. कृपया पुन्हा प्रयत्न करा.' });
      setFieldError('email', errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearValidationErrors();

    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = t({ en: 'Email or phone number is required', mr: 'ईमेल किंवा फोन नंबर आवश्यक आहे' });
    } else if (!validateEmail(formData.email)) {
      errors.email = t({ en: 'Please enter a valid email or phone number', mr: 'कृपया वैध ईमेल किंवा फोन नंबर टाका' });
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      // Simulate checking if user exists
      const registeredUsers = ['admin@village.com', 'user@village.com', 'demo@test.com', '+91 9876543210', '+91 9876543211'];
      
      if (!registeredUsers.includes(formData.email)) {
        setFieldError('email', t({ en: 'No account found with this email/phone', mr: 'या ईमेल/फोनसह कोणतेही खाते आढळले नाही' }));
        toast.error(t({ en: 'Account not found', mr: 'खाते सापडले नाही' }));
        setIsLoading(false);
        return;
      }

      // Simulate sending OTP
      await new Promise(resolve => setTimeout(resolve, 1500));

      setOtpTimer(60);
      navigateToMode('otp-verification', false);
      setSuccessMessage(t({ 
        en: 'OTP sent successfully! Check your messages.', 
        mr: 'OTP यशस्वीरीत्या पाठवला! आपले संदेश तपासा.' 
      }));
      toast.success(t({ 
        en: `OTP sent to ${formData.email}`, 
        mr: `${formData.email} वर OTP पाठवला` 
      }));
    } catch (error) {
      toast.error(t({ en: 'Failed to send OTP. Please try again.', mr: 'OTP पाठवणे अयशस्वी. कृपया पुन्हा प्रयत्न करा.' }));
    }

    setIsLoading(false);
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearValidationErrors();

    const errors: Record<string, string> = {};

    if (!formData.otp.trim()) {
      errors.otp = t({ en: 'OTP is required', mr: 'OTP आवश्यक आहे' });
    } else if (formData.otp.length !== 6) {
      errors.otp = t({ en: 'OTP must be 6 digits', mr: 'OTP 6 अंकांचा असावा' });
    } else if (!/^\d{6}$/.test(formData.otp)) {
      errors.otp = t({ en: 'OTP must contain only numbers', mr: 'OTP मध्ये फक्त अंक असावेत' });
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo, accept 123456 or any 6-digit OTP for testing
      const validOtps = ['123456', '000000'];
      
      if (validOtps.includes(formData.otp) || /^\d{6}$/.test(formData.otp)) {
        navigateToMode('reset-password', false);
        setSuccessMessage(t({ en: 'OTP verified successfully!', mr: 'OTP यशस्वीरीत्या सत्यापित झाला!' }));
        toast.success(t({ en: 'OTP verified! Create new password.', mr: 'OTP सत्यापित! नवीन पासवर्ड तयार करा.' }));
      } else {
        setFieldError('otp', t({ en: 'Invalid OTP', mr: 'अवैध OTP' }));
        toast.error(t({ en: 'Invalid OTP. Please try again.', mr: 'अवैध OTP. कृपया पुन्हा प्रयत्न करा.' }));
      }
    } catch (error) {
      toast.error(t({ en: 'OTP verification failed. Please try again.', mr: 'OTP सत्यापन अयशस्वी. कृपया पुन्हा प्रयत्न करा.' }));
    }

    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearValidationErrors();

    const { password, confirmPassword } = formData;
    const errors: Record<string, string> = {};

    if (!password) {
      errors.password = t({ en: 'New password is required', mr: 'नवीन पासवर्ड आवश्यक आहे' });
    } else if (!validatePassword(password)) {
      errors.password = t({ en: 'Password must be at least 6 characters', mr: 'पासवर्ड किमान 6 अक्षरांचा असावा' });
    }

    if (!confirmPassword) {
      errors.confirmPassword = t({ en: 'Please confirm your new password', mr: 'कृपया आपला नवीन पासवर्ड पुष्टी करा' });
    } else if (password !== confirmPassword) {
      errors.confirmPassword = t({ en: 'Passwords do not match', mr: 'पासवर्ड जुळत नाहीत' });
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      // Simulate password reset
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccessMessage(t({ en: 'Password reset successful!', mr: 'पासवर्ड रीसेट यशस्वी!' }));
      toast.success(t({ en: 'Password updated! Please login with new password.', mr: 'पासवर्ड अपडेट झाला! कृपया नवीन पासवर्डसह लॉगिन करा.' }));
      
      setTimeout(() => {
        navigateToMode('login');
      }, 1500);
    } catch (error) {
      toast.error(t({ en: 'Password reset failed. Please try again.', mr: 'पासवर्ड रीसेट अयशस्वी. कृपया पुन्हा प्रयत्न करा.' }));
    }

    setIsLoading(false);
  };

  const resendOtp = async () => {
    if (isLoading || otpTimer > 0) return;
    
    setIsLoading(true);
    clearValidationErrors();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpTimer(60);
      setFormData(prev => ({ ...prev, otp: '' }));
      toast.success(t({ en: 'OTP resent successfully!', mr: 'OTP पुन्हा पाठवला!' }));
    } catch (error) {
      toast.error(t({ en: 'Failed to resend OTP', mr: 'OTP पुन्हा पाठवणे अयशस्वी' }));
    }
    
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      otp: ''
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const getAuthIcon = () => {
    switch (authMode) {
      case 'login':
        return <LogIn className="h-8 w-8 text-white" />;
      case 'register':
        return <User className="h-8 w-8 text-white" />;
      case 'forgot-password':
        return <Lock className="h-8 w-8 text-white" />;
      case 'otp-verification':
        return <Shield className="h-8 w-8 text-white" />;
      case 'reset-password':
        return <CheckCircle className="h-8 w-8 text-white" />;
      default:
        return <LogIn className="h-8 w-8 text-white" />;
    }
  };

  const getAuthTitle = () => {
    switch (authMode) {
      case 'login':
        return t({ en: 'Welcome Back', mr: 'परत स्वागत आहे' });
      case 'register':
        return t({ en: 'Create Account', mr: 'खाते तयार करा' });
      case 'forgot-password':
        return t({ en: 'Reset Password', mr: 'पासवर्ड रीसेट करा' });
      case 'otp-verification':
        return t({ en: 'Verify OTP', mr: 'OTP सत्यापित करा' });
      case 'reset-password':
        return t({ en: 'New Password', mr: 'नवीन पासवर्ड' });
      default:
        return t({ en: 'Welcome', mr: 'स्वागत' });
    }
  };

  const getAuthSubtitle = () => {
    switch (authMode) {
      case 'login':
        return t({ en: 'Sign in to access your village services', mr: 'आपल्या गावातील सेवांमध्ये प्रवेश करण्यासाठी साइन इन करा' });
      case 'register':
        return t({ en: 'Register to access village services', mr: 'गावातील सेवांमध्ये प्रवेश करण्यासाठी नोंदणी करा' });
      case 'forgot-password':
        return t({ en: 'Enter your email to receive OTP', mr: 'OTP मिळविण्यासाठी आपला ईमेल टाका' });
      case 'otp-verification':
        return t({ en: 'Enter the 6-digit code sent to your device', mr: 'आपल्या डिव्हाइसवर पाठवलेला 6-अंकी कोड टाका' });
      case 'reset-password':
        return t({ en: 'Create a new password for your account', mr: 'आपल्या खात्यासाठी नवीन पासवर्ड तयार करा' });
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full animate-pulse-slow"></div>
      </div>

      <Card className="w-full max-w-md glass-card border-0 shadow-2xl animate-scale-in relative z-10">
        <CardHeader className="text-center pb-6">
          {/* Back Button */}
          {authMode !== 'login' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={navigateBack}
              className="absolute left-4 top-4 hover-lift"
              disabled={isLoading}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
            {getAuthIcon()}
          </div>

          <CardTitle className="text-3xl gradient-text-primary mb-2">
            {getAuthTitle()}
          </CardTitle>
          
          <p className="text-muted-foreground text-sm leading-relaxed">
            {getAuthSubtitle()}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 animate-scale-in">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{successMessage}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4 text-primary" />
                  {t({ en: 'Email / Mobile', mr: 'ईमेल / मोबाइल' })} *
                </Label>
                <Input
                  id="email"
                  type="text"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={t({ en: 'Enter email or mobile number', mr: 'ईमेल किंवा मोबाइल नंबर टाका' })}
                  className={`h-12 bg-white/80 border-white/50 hover-glow focus:border-primary/50 transition-all duration-300 ${
                    validationErrors.email ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
                {validationErrors.email && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.email}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="h-4 w-4 text-primary" />
                  {t({ en: 'Password', mr: 'पासवर्ड' })} *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder={t({ en: 'Enter password', mr: 'पासवर्ड टाका' })}
                    className={`h-12 bg-white/80 border-white/50 hover-glow focus:border-primary/50 transition-all duration-300 pr-12 ${
                      validationErrors.password ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {validationErrors.password && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.password}
                  </div>
                )}
              </div>

              {/* Demo credentials info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <div className="font-medium text-blue-700 mb-1">
                  {t({ en: 'Demo Credentials:', mr: 'डेमो ओळखपत्रे:' })}
                </div>
                <div className="space-y-1 text-blue-600">
                  <div>Admin: admin@village.com / admin123</div>
                  <div>User: user@village.com / user123</div>
                  <div>Demo: demo@test.com / demo123</div>
                </div>
              </div>

              <div className="text-right">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigateToMode('forgot-password')}
                  className="text-primary hover:text-primary/80 p-0 h-auto text-sm"
                >
                  {t({ en: 'Forgot Password?', mr: 'पासवर्ड विसरलात?' })}
                </Button>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium hover-lift transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {t({ en: 'Signing In...', mr: 'साइन इन करत आहे...' })}
                  </div>
                ) : (
                  t({ en: 'Sign In', mr: 'साइन इन करा' })
                )}
              </Button>
            </form>
          )}

          {/* Register Form */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4 text-primary" />
                  {t({ en: 'Full Name', mr: 'पूर्ण नाव' })} *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t({ en: 'Enter your full name', mr: 'आपले पूर्ण नाव टाका' })}
                  className="h-11 bg-white/80 border-white/50 hover-glow focus:border-primary/50 transition-all duration-300"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-register" className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4 text-primary" />
                  {t({ en: 'Email', mr: 'ईमेल' })} *
                </Label>
                <Input
                  id="email-register"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={t({ en: 'Enter your email', mr: 'आपला ईमेल टाका' })}
                  className="h-11 bg-white/80 border-white/50 hover-glow focus:border-primary/50 transition-all duration-300"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone-register" className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4 text-primary" />
                  {t({ en: 'Mobile Number', mr: 'मोबाइल नंबर' })} *
                </Label>
                <Input
                  id="phone-register"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder={t({ en: 'Enter mobile number', mr: 'मोबाइल नंबर टाका' })}
                  className="h-11 bg-white/80 border-white/50 hover-glow focus:border-primary/50 transition-all duration-300"
                  disabled={isLoading}
                />
              </div>



              <div className="space-y-2">
                <Label htmlFor="password-register" className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="h-4 w-4 text-primary" />
                  {t({ en: 'Password', mr: 'पासवर्ड' })} *
                </Label>
                <div className="relative">
                  <Input
                    id="password-register"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder={t({ en: 'Create password (min 6 characters)', mr: 'पासवर्ड तयार करा (किमान 6 अक्षरे)' })}
                    className="h-11 bg-white/80 border-white/50 hover-glow focus:border-primary/50 transition-all duration-300 pr-12"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-transparent"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="h-4 w-4 text-primary" />
                  {t({ en: 'Confirm Password', mr: 'पासवर्ड पुष्टी करा' })} *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder={t({ en: 'Confirm your password', mr: 'आपला पासवर्ड पुष्टी करा' })}
                    className="h-11 bg-white/80 border-white/50 hover-glow focus:border-primary/50 transition-all duration-300 pr-12"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-transparent"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium hover-lift transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {t({ en: 'Creating Account...', mr: 'खाते तयार करत आहे...' })}
                  </div>
                ) : (
                  t({ en: 'Create Account', mr: 'खाते तयार करा' })
                )}
              </Button>
            </form>
          )}

          {/* Forgot Password Form */}
          {authMode === 'forgot-password' && (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email-forgot" className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4 text-primary" />
                  {t({ en: 'Email / Mobile Number', mr: 'ईमेल / मोबाइल नंबर' })} *
                </Label>
                <Input
                  id="email-forgot"
                  type="text"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={t({ en: 'Enter your email or mobile number', mr: 'आपला ईमेल किंवा मोबाइल नंबर टाका' })}
                  className="h-12 bg-white/80 border-white/50 hover-glow focus:border-primary/50 transition-all duration-300"
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium hover-lift transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {t({ en: 'Sending OTP...', mr: 'OTP पाठवत आहे...' })}
                  </div>
                ) : (
                  <>
                    <Smartphone className="h-4 w-4 mr-2" />
                    {t({ en: 'Send OTP', mr: 'OTP पाठवा' })}
                  </>
                )}
              </Button>
            </form>
          )}

          {/* OTP Verification Form */}
          {authMode === 'otp-verification' && (
            <form onSubmit={handleOtpVerification} className="space-y-5">
              <div className="text-center space-y-2">
                <div className="bg-primary/10 rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t({ 
                    en: `OTP sent to ${formData.email}`, 
                    mr: `${formData.email} वर OTP पाठवला` 
                  })}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp" className="flex items-center gap-2 text-sm font-medium justify-center">
                  <Shield className="h-4 w-4 text-primary" />
                  {t({ en: 'Enter 6-Digit OTP', mr: '6-अंकी OTP टाका' })} *
                </Label>
                <Input
                  id="otp"
                  type="text"
                  value={formData.otp}
                  onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="h-12 bg-white/80 border-white/50 hover-glow focus:border-primary/50 transition-all duration-300 text-center text-lg tracking-widest"
                  disabled={isLoading}
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground text-center">
                  {t({ en: 'For demo, use: 123456', mr: 'डेमोसाठी वापरा: 123456' })}
                </p>
              </div>

              {otpTimer > 0 ? (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Timer className="h-4 w-4" />
                    {t({ en: `Resend OTP in ${otpTimer}s`, mr: `${otpTimer}s मध्ये OTP पुन्हा पाठवा` })}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={resendOtp}
                    className="text-primary hover:text-primary/80 p-0 h-auto text-sm"
                    disabled={isLoading}
                  >
                    {t({ en: 'Resend OTP', mr: 'OTP पुन्हा पाठवा' })}
                  </Button>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium hover-lift transition-all duration-300"
                disabled={isLoading || formData.otp.length !== 6}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {t({ en: 'Verifying...', mr: 'सत्यापित करत आहे...' })}
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {t({ en: 'Verify OTP', mr: 'OTP सत्यापित करा' })}
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Reset Password Form */}
          {authMode === 'reset-password' && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="h-4 w-4 text-primary" />
                  {t({ en: 'New Password', mr: 'नवीन पासवर्ड' })} *
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder={t({ en: 'Enter new password (min 6 characters)', mr: 'नवीन पासवर्ड टाका (किमान 6 अक्षरे)' })}
                    className="h-12 bg-white/80 border-white/50 hover-glow focus:border-primary/50 transition-all duration-300 pr-12"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-new-password" className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="h-4 w-4 text-primary" />
                  {t({ en: 'Confirm New Password', mr: 'नवीन पासवर्ड पुष्टी करा' })} *
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-new-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder={t({ en: 'Confirm your new password', mr: 'आपला नवीन पासवर्ड पुष्टी करा' })}
                    className="h-12 bg-white/80 border-white/50 hover-glow focus:border-primary/50 transition-all duration-300 pr-12"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium hover-lift transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {t({ en: 'Resetting Password...', mr: 'पासवर्ड रीसेट करत आहे...' })}
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {t({ en: 'Reset Password', mr: 'पासवर्ड रीसेट करा' })}
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Footer */}
          {authMode === 'login' && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">
                  {t({ en: "Don't have an account?", mr: 'खाते नाही?' })}
                </p>
                <Button 
                  variant="link" 
                  onClick={() => navigateToMode('register')}
                  className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
                >
                  {t({ en: 'Create Account', mr: 'खाते तयार करा' })}
                </Button>
              </div>
              
              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={() => onNavigate('home')}
                  className="bg-white/50 border-white/50 hover:bg-white/70 hover-lift transition-all duration-300"
                >
                  {t({ en: 'Continue as Guest', mr: 'अतिथी म्हणून सुरू ठेवा' })}
                </Button>
              </div>
            </div>
          )}

          {authMode === 'register' && (
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                {t({ en: 'Already have an account?', mr: 'आधीच खाते आहे?' })}
              </p>
              <Button 
                variant="link" 
                onClick={() => {
                  setAuthMode('login');
                  resetForm();
                }}
                className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
              >
                {t({ en: 'Sign In', mr: 'साइन इन करा' })}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}