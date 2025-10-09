import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { authService } from '../services/authService';
import { useLanguage } from '../components/LanguageProvider';
import { 
  ArrowLeft, 
  Smartphone, 
  Key, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';

export function ForgotPasswordPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 1: Enter mobile number
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!mobileNumber.trim()) {
      setError('Mobile number is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.forgotPassword(mobileNumber.trim());
      
      if (response.success) {
        setSuccess(response.message);
        setStep(2);
      } else {
        setError(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      setError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Enter OTP and new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setError('OTP is required');
      return;
    }
    
    if (!newPassword.trim()) {
      setError('New password is required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.resetPassword({
        mobileNumber: mobileNumber.trim(),
        otp: otp.trim(),
        newPassword: newPassword.trim()
      });
      
      if (response.success) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (error) {
      setError(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess('');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t({ en: 'Reset Password', mr: 'पासवर्ड रीसेट करा' })}
          </h1>
          <p className="text-gray-600">
            {t({ 
              en: 'Enter your mobile number to receive a reset code', 
              mr: 'रीसेट कोड मिळविण्यासाठी तुमचा मोबाइल नंबर प्रविष्ट करा' 
            })}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 1 ? 'bg-pink-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 2 ? 'bg-pink-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
          </div>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              {step === 1 ? (
                <>
                  <Smartphone className="h-5 w-5" />
                  {t({ en: 'Enter Mobile Number', mr: 'मोबाइल नंबर प्रविष्ट करा' })}
                </>
              ) : (
                <>
                  <Key className="h-5 w-5" />
                  {t({ en: 'Enter OTP & New Password', mr: 'OTP आणि नवीन पासवर्ड प्रविष्ट करा' })}
                </>
              )}
            </CardTitle>
            <CardDescription>
              {step === 1 
                ? t({ en: 'We\'ll send you a verification code', mr: 'आम्ही तुम्हाला एक सत्यापन कोड पाठवू' })
                : t({ en: 'Enter the code sent to your mobile', mr: 'तुमच्या मोबाइलवर पाठवलेला कोड प्रविष्ट करा' })
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Error Alert */}
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Step 1: Mobile Number */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <Label htmlFor="mobileNumber">
                    {t({ en: 'Mobile Number', mr: 'मोबाइल नंबर' })}
                  </Label>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    placeholder={t({ en: 'Enter your mobile number', mr: 'तुमचा मोबाइल नंबर प्रविष्ट करा' })}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="mt-1"
                    disabled={loading}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t({ en: 'Sending...', mr: 'पाठवत आहे...' })}
                    </>
                  ) : (
                    t({ en: 'Send OTP', mr: 'OTP पाठवा' })
                  )}
                </Button>
              </form>
            )}

            {/* Step 2: OTP and New Password */}
            {step === 2 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="otp">
                    {t({ en: 'OTP Code', mr: 'OTP कोड' })}
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder={t({ en: 'Enter 6-digit OTP', mr: '6-अंकी OTP प्रविष्ट करा' })}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="mt-1"
                    disabled={loading}
                    maxLength={6}
                  />
                </div>
                
                <div>
                  <Label htmlFor="newPassword">
                    {t({ en: 'New Password', mr: 'नवीन पासवर्ड' })}
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder={t({ en: 'Enter new password', mr: 'नवीन पासवर्ड प्रविष्ट करा' })}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1"
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">
                    {t({ en: 'Confirm Password', mr: 'पासवर्ड पुष्टी करा' })}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t({ en: 'Confirm new password', mr: 'नवीन पासवर्ड पुष्टी करा' })}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1"
                    disabled={loading}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t({ en: 'Resetting...', mr: 'रीसेट करत आहे...' })}
                    </>
                  ) : (
                    t({ en: 'Reset Password', mr: 'पासवर्ड रीसेट करा' })
                  )}
                </Button>
              </form>
            )}

            {/* Back Button */}
            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={goBack}
                className="text-gray-600 hover:text-gray-800"
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t({ en: 'Back', mr: 'मागे' })}
              </Button>
            </div>

            {/* Login Link */}
            <div className="mt-4 text-center text-sm text-gray-600">
              {t({ en: 'Remember your password?', mr: 'तुमचा पासवर्ड आठवतो?' })}{' '}
              <Link 
                to="/login" 
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                {t({ en: 'Sign in', mr: 'साइन इन करा' })}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
