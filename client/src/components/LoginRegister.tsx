import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { BilingualFormField } from './BilingualFormField';
import { useLanguage, translations } from './LanguageProvider';
import useAuthStore from '../store/authStore';
import { Eye, EyeOff, Smartphone, Shield, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface LoginRegisterProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (userType: 'villager' | 'admin') => void;
}

export function LoginRegister({ isOpen, onClose, onSuccess }: LoginRegisterProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { login, register } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    useOTP: false
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    assistedRegistration: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOTP = async () => {
    const email = activeTab === 'login' ? loginForm.email : registerForm.email;
    
    if (!validateEmail(email)) {
      setErrors({ email: t({ en: 'Please enter a valid email address', mr: 'कृपया वैध ईमेल पत्ता टाका' }) });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setShowOTPDialog(true);
      setOtpTimer(60);
      setIsLoading(false);
      setErrors({});
    }, 1000);
  };

  const handleVerifyOTP = async () => {
    if (otpValue.length !== 6) {
      return;
    }

    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      setShowOTPDialog(false);
      setOtpValue('');
      
      // Determine user type based on email (demo logic)
      const userType = loginForm.email.includes('admin') ? 'admin' : 'villager';
      if (onSuccess) {
        onSuccess(userType);
      } else {
        navigate('/');
      }
      onClose();
    }, 1000);
  };

  const handleLogin = async () => {
    const newErrors: Record<string, string> = {};

    if (!validateEmail(loginForm.email)) {
      newErrors.email = t({ en: 'Please enter a valid email address', mr: 'कृपया वैध ईमेल पत्ता टाका' });
    }

    if (!loginForm.useOTP && !loginForm.password) {
      newErrors.password = t({ en: 'Password is required', mr: 'पासवर्ड आवश्यक आहे' });
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (loginForm.useOTP) {
        handleSendOTP();
      } else {
        // Regular login
        try {
          setIsLoading(true);
          const response = await login({ email: loginForm.email, password: loginForm.password });
          
          if (response.success) {
            toast.success(t({ en: 'Login successful!', mr: 'लॉगिन यशस्वी!' }));
            if (onSuccess) {
              const userType = loginForm.email.includes('admin') ? 'admin' : 'villager';
              onSuccess(userType);
            } else {
              navigate('/');
            }
            onClose();
          }
        } catch (error: any) {
          console.error('Login error:', error);
          toast.error(error.message || t({ en: 'Login failed', mr: 'लॉगिन अयशस्वी' }));
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleRegister = async () => {
    const newErrors: Record<string, string> = {};

    if (!registerForm.name.trim()) {
      newErrors.name = t({ en: 'Full name is required', mr: 'पूर्ण नाव आवश्यक आहे' });
    }

    if (!validateEmail(registerForm.email)) {
      newErrors.email = t({ en: 'Please enter a valid email address', mr: 'कृपया वैध ईमेल पत्ता टाका' });
    }

    if (registerForm.password.length < 6) {
      newErrors.password = t({ en: 'Password must be at least 6 characters', mr: 'पासवर्ड किमान ६ अक्षरांचा असावा' });
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = t({ en: 'Passwords do not match', mr: 'पासवर्ड जुळत नाहीत' });
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setIsLoading(true);
        const response = await register({ 
          name: registerForm.name, 
          email: registerForm.email, 
          password: registerForm.password 
        });
        
        if (response.success) {
          toast.success(t({ en: 'Registration successful!', mr: 'नोंदणी यशस्वी!' }));
          if (onSuccess) {
            onSuccess('villager');
          } else {
            navigate('/');
          }
          onClose();
        }
      } catch (error: any) {
        console.error('Registration error:', error);
        toast.error(error.message || t({ en: 'Registration failed', mr: 'नोंदणी अयशस्वी' }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {t(translations.smartVillagePortal)}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t({ en: 'Access village services securely', mr: 'गाव सेवांमध्ये सुरक्षितपणे प्रवेश करा' })}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t(translations.login)}</TabsTrigger>
              <TabsTrigger value="register">
                {t({ en: 'Register', mr: 'नोंदणी' })}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">{t(translations.login)}</CardTitle>
                  <CardDescription>
                    {t({ en: 'Enter your credentials to access services', mr: 'सेवांमध्ये प्रवेश करण्यासाठी आपली माहिती टाका' })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <BilingualFormField
                    id="login-email"
                    type="email"
                    label={{ en: 'Email Address', mr: 'ईमेल पत्ता' }}
                    placeholder={{ en: 'Enter your email address', mr: 'आपला ईमेल पत्ता टाका' }}
                    value={loginForm.email}
                    onChange={(value) => setLoginForm(prev => ({ ...prev, email: value }))}
                    error={errors.email}
                    required
                  />

                  {!loginForm.useOTP && (
                    <div className="relative">
                      <BilingualFormField
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        label={translations.password}
                        placeholder={{ en: 'Enter your password', mr: 'आपला पासवर्ड टाका' }}
                        value={loginForm.password}
                        onChange={(value) => setLoginForm(prev => ({ ...prev, password: value }))}
                        error={errors.password}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-8 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="use-otp"
                      checked={loginForm.useOTP}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, useOTP: e.target.checked }))}
                      className="rounded border-border"
                    />
                    <label htmlFor="use-otp" className="text-sm">
                      {t({ en: 'Use OTP instead', mr: 'त्याऐवजी ओटीपी वापरा' })}
                    </label>
                  </div>

                  <Button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      t(translations.loading)
                    ) : loginForm.useOTP ? (
                      <>
                        <Smartphone className="h-4 w-4 mr-2" />
                        {t(translations.sendOTP)}
                      </>
                    ) : (
                      t(translations.login)
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">
                    {t({ en: 'Register New Account', mr: 'नवीन खाते नोंदणी' })}
                  </CardTitle>
                  <CardDescription>
                    {t({ en: 'Create an account to access village services', mr: 'गाव सेवांसाठी खाते तयार करा' })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <BilingualFormField
                    id="register-name"
                    type="text"
                    label={translations.fullName}
                    placeholder={{ en: 'Enter your full name', mr: 'आपले पूर्ण नाव टाका' }}
                    value={registerForm.name}
                    onChange={(value) => setRegisterForm(prev => ({ ...prev, name: value }))}
                    error={errors.name}
                    required
                  />

                  <BilingualFormField
                    id="register-email"
                    type="email"
                    label={{ en: 'Email Address', mr: 'ईमेल पत्ता' }}
                    placeholder={{ en: 'Enter your email address', mr: 'आपला ईमेल पत्ता टाका' }}
                    value={registerForm.email}
                    onChange={(value) => setRegisterForm(prev => ({ ...prev, email: value }))}
                    error={errors.email}
                    required
                  />

                  <BilingualFormField
                    id="register-password"
                    type="password"
                    label={translations.password}
                    placeholder={{ en: 'Create a password (min 6 characters)', mr: 'पासवर्ड तयार करा (किमान ६ अक्षर)' }}
                    value={registerForm.password}
                    onChange={(value) => setRegisterForm(prev => ({ ...prev, password: value }))}
                    error={errors.password}
                    required
                  />

                  <BilingualFormField
                    id="register-confirm-password"
                    type="password"
                    label={{ en: 'Confirm Password', mr: 'पासवर्डची पुष्टी करा' }}
                    placeholder={{ en: 'Re-enter your password', mr: 'आपला पासवर्ड पुन्हा टाका' }}
                    value={registerForm.confirmPassword}
                    onChange={(value) => setRegisterForm(prev => ({ ...prev, confirmPassword: value }))}
                    error={errors.confirmPassword}
                    required
                  />

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="assisted-registration"
                      checked={registerForm.assistedRegistration}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, assistedRegistration: e.target.checked }))}
                      className="rounded border-border"
                    />
                    <label htmlFor="assisted-registration" className="text-sm">
                      {t({ en: 'Registering for someone else', mr: 'इतर व्यक्तीसाठी नोंदणी करत आहे' })}
                    </label>
                  </div>

                  <Button
                    onClick={handleRegister}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      t(translations.loading)
                    ) : (
                      <>
                        <Smartphone className="h-4 w-4 mr-2" />
                        {t({ en: 'Send OTP to Register', mr: 'नोंदणीसाठी ओटीपी पाठवा' })}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* OTP Verification Dialog */}
      <Dialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-center">
              {t({ en: 'Verify Email Address', mr: 'ईमेल पत्ता सत्यापित करा' })}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t({ 
                en: `Enter the 6-digit OTP sent to ${activeTab === 'login' ? loginForm.email : registerForm.email}`,
                mr: `${activeTab === 'login' ? loginForm.email : registerForm.email} वर पाठवलेला ६ अंकी ओटीपी टाका`
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={setOtpValue}
                autoFocus
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="text-center">
              {otpTimer > 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t({ en: `Resend OTP in ${otpTimer}s`, mr: `${otpTimer} सेकंदात ओटीपी पुन्हा पाठवा` })}
                </p>
              ) : (
                <Button variant="ghost" onClick={handleSendOTP} disabled={isLoading}>
                  {t({ en: 'Resend OTP', mr: 'ओटीपी पुन्हा पाठवा' })}
                </Button>
              )}
            </div>

            <Button
              onClick={handleVerifyOTP}
              disabled={otpValue.length !== 6 || isLoading}
              className="w-full"
            >
              {isLoading ? (
                t(translations.loading)
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t({ en: 'Verify & Continue', mr: 'सत्यापित करा आणि पुढे जा' })}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}