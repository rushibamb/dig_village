import React, { useState, useEffect } from 'react';
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
import { Shield, User, Lock, Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react';

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <div className="admin-login-container">
      {/* Animated gradient background */}
      <div className="admin-login-bg"></div>
      
      {/* Floating particles */}
      <div className="floating-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}></div>
        ))}
      </div>

      {/* Mouse follower glow */}
      <div 
        className="mouse-glow"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      ></div>

      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md admin-login-content">
          {/* Back to Home Button with enhanced styling */}
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mb-6 glass-button back-button group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            {t({ en: 'Back to Home', mr: 'होमवर परत' })}
          </Button>

          <Card className="glass-card admin-card animate-fadeInUp">
            <CardHeader className="text-center space-y-4 pb-6">
              {/* Animated shield icon */}
              <div className="mx-auto shield-container">
                <div className="shield-glow"></div>
                <div className="shield-icon-wrapper">
                  <Shield className="h-8 w-8 text-white shield-icon" />
                  <Sparkles className="h-4 w-4 text-yellow-300 absolute top-0 right-0 sparkle-icon" />
                </div>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold text-white title-gradient animate-slideDown">
                  {t({ en: 'Admin Portal', mr: 'प्रशासक पोर्टल' })}
                </CardTitle>
                <p className="text-gray-300 text-sm font-medium animate-slideDown" style={{ animationDelay: '0.1s' }}>
                  {t({ en: 'Village Administration System', mr: 'गाव प्रशासन प्रणाली' })}
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 px-6 pb-6">
              {error && (
                <Alert className="error-alert animate-shake">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                  <Label htmlFor="email" className="text-white font-medium text-sm">
                    {t({ en: 'Admin Email', mr: 'प्रशासक ईमेल' })}
                  </Label>
                  <div className="relative input-wrapper">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5 z-10 icon-pulse" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="modern-input pl-11 h-12"
                      placeholder="admin@village.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                  <Label htmlFor="password" className="text-white font-medium text-sm">
                    {t({ en: 'Password', mr: 'पासवर्ड' })}
                  </Label>
                  <div className="relative input-wrapper">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5 z-10 icon-pulse" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="modern-input pl-11 pr-12 h-12"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-300 z-10 hover:scale-110"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 modern-button group animate-slideUp"
                  style={{ animationDelay: '0.4s' }}
                >
                  <span className="relative z-10 font-semibold flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="spinner"></div>
                        {t({ en: 'Signing in...', mr: 'साइन इन करत आहे...' })}
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 transition-transform group-hover:scale-110" />
                        {t({ en: 'Access Admin Panel', mr: 'प्रशासक पॅनेलमध्ये प्रवेश करा' })}
                      </>
                    )}
                  </span>
                </Button>
              </form>

              <div className="text-center pt-4 border-t border-white/10 animate-slideUp" style={{ animationDelay: '0.5s' }}>
                <p className="text-gray-300 text-sm mb-3 font-medium">
                  {t({ en: 'Default Admin Credentials:', mr: 'डिफॉल्ट प्रशासक प्रमाणपत्र:' })}
                </p>
                <div className="credentials-box">
                  <p className="text-white text-sm font-mono mb-1 credential-item">
                    <span className="text-blue-400">Email:</span> admin@village.com
                  </p>
                  <p className="text-white text-sm font-mono credential-item">
                    <span className="text-blue-400">Password:</span> admin123
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        .admin-login-container {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .admin-login-bg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(-45deg, #0f172a, #1e1b4b, #1e3a8a, #0c4a6e);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .floating-particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: float linear infinite;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .mouse-glow {
          position: fixed;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: opacity 0.3s;
          z-index: 1;
        }

        .admin-login-content {
          animation: fadeInScale 0.6s ease-out;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .glass-button {
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: white !important;
          transition: all 0.3s ease;
        }

        .glass-button:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
        }

        .glass-card {
          background: rgba(15, 23, 42, 0.7) !important;
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
                      0 0 80px rgba(59, 130, 246, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6),
                      0 0 100px rgba(59, 130, 246, 0.2),
                      inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .shield-container {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .shield-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }

        .shield-icon-wrapper {
          position: relative;
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.5),
                      inset 0 2px 10px rgba(255, 255, 255, 0.2);
          animation: rotate3d 10s linear infinite;
        }

        @keyframes rotate3d {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }

        .shield-icon {
          animation: iconFloat 3s ease-in-out infinite;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .sparkle-icon {
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.5) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        .title-gradient {
          background: linear-gradient(135deg, #ffffff, #93c5fd, #3b82f6);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientText 3s ease infinite;
        }

        @keyframes gradientText {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out backwards;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .error-alert {
          background: rgba(220, 38, 38, 0.2) !important;
          border: 1px solid rgba(239, 68, 68, 0.5) !important;
          color: #fecaca !important;
          backdrop-filter: blur(10px);
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .input-wrapper {
          position: relative;
        }

        .modern-input {
          background: rgba(30, 41, 59, 0.6) !important;
          border: 1px solid rgba(148, 163, 184, 0.3) !important;
          color: white !important;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .modern-input::placeholder {
          color: rgba(148, 163, 184, 0.6) !important;
        }

        .modern-input:focus {
          background: rgba(30, 41, 59, 0.8) !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1),
                      0 0 20px rgba(59, 130, 246, 0.2),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .icon-pulse {
          animation: iconPulse 2s ease-in-out infinite;
        }

        @keyframes iconPulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        .modern-button {
          position: relative;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
          border: none !important;
          color: white !important;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .modern-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .modern-button:hover::before {
          left: 100%;
        }

        .modern-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4),
                      0 0 40px rgba(59, 130, 246, 0.3);
        }

        .modern-button:active {
          transform: translateY(0);
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .credentials-box {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s ease;
        }

        .credentials-box:hover {
          background: rgba(30, 41, 59, 0.8);
          border-color: rgba(59, 130, 246, 0.4);
          transform: scale(1.02);
          box-shadow: 0 5px 20px rgba(59, 130, 246, 0.2);
        }

        .credential-item {
          transition: all 0.2s ease;
          padding: 4px;
          border-radius: 4px;
        }

        .credential-item:hover {
          background: rgba(59, 130, 246, 0.1);
          padding-left: 8px;
        }

        @media (max-width: 640px) {
          .mouse-glow {
            display: none;
          }
          
          .particle {
            width: 2px;
            height: 2px;
          }
        }
      `}</style>
    </div>
  );
}