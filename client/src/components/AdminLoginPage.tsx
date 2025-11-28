import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { useLanguage } from './LanguageProvider';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { Shield, User, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login(formData); // assume login returns { success: boolean, user?: { role: string } , ... }

      if (response && response.success) {
        const role = response.user?.role ?? '';
        if (role === 'admin') {
          toast.success(
            t({
              en: 'Admin login successful!',
              mr: 'प्रशासक लॉगिन यशस्वी!',
            })
          );
          // Navigate to admin dashboard
          navigate('/admin/dashboard', { replace: true });
        } else {
          setError(
            t({
              en: 'Access denied. Admin role required.',
              mr: 'प्रकार नाकारले. प्रशासक भूमिका आवश्यक.',
            })
          );
        }
      } else {
        setError(
          t({
            en: 'Invalid credentials',
            mr: 'अवैध प्रमाणपत्र',
          })
        );
      }
    } catch (err) {
      // normalize unknown error
      const message =
        (err as Error)?.message ||
        t({
          en: 'Login failed. Please try again.',
          mr: 'लॉगिन अयशस्वी. कृपया पुन्हा प्रयत्न करा.',
        });
      console.error('Admin login error:', err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white/70 px-4 py-10">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="w-fit text-slate-600 hover:text-slate-800"
          aria-label={t({ en: 'Back to Home', mr: 'होमवर परत' })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t({ en: 'Back to Home', mr: 'होमवर परत' })}
        </Button>

        <Card className="shadow-2xl border-none bg-white/95 backdrop-blur-md rounded-2xl">
          <CardHeader className="text-center space-y-3 px-6 pt-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <Shield className="h-7 w-7" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
              {t({ en: 'Village Administration System', mr: 'गाव प्रशासन प्रणाली' })}
            </p>
            <CardTitle className="text-2xl font-semibold text-slate-900">
              {t({ en: 'Admin Portal', mr: 'प्रशासक पोर्टल' })}
            </CardTitle>
            <p className="text-sm text-slate-600 px-4">
              {t({
                en: 'Sign in with administrator credentials to manage village services.',
                mr: 'गाव सेवा व्यवस्थापित करण्यासाठी प्रशासक प्रमाणपत्रांसह साइन इन करा.',
              })}
            </p>
          </CardHeader>

          <CardContent className="space-y-5 px-6 pb-8">
            {error && (
              <Alert variant="destructive" role="alert" className="mb-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  {t({ en: 'Admin Email', mr: 'प्रशासक ईमेल' })}
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="admin@village.com"
                    required
                    disabled={isLoading}
                    aria-label={t({ en: 'Admin Email', mr: 'प्रशासक ईमेल' })}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  {t({ en: 'Password', mr: 'पासवर्ड' })}
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-12"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    aria-label={t({ en: 'Password', mr: 'पासवर्ड' })}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-200 rounded"
                    aria-pressed={showPassword}
                    aria-label={showPassword ? t({ en: 'Hide password', mr: 'पासवर्ड लपवा' }) : t({ en: 'Show password', mr: 'पासवर्ड दाखवा' })}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className={
                  'w-full bg-indigo-600 text-white font-medium shadow-md transform transition-transform duration-200 ' +
                  (isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105')
                }
                disabled={isLoading}
                aria-disabled={isLoading}
                aria-label={t({ en: 'Access Admin Panel', mr: 'प्रशासक पॅनेलमध्ये प्रवेश करा' })}
              >
                {isLoading
                  ? t({ en: 'Signing in...', mr: 'साइन इन करत आहे...' })
                  : t({ en: 'Access Admin Panel', mr: 'प्रशासक पॅनेलमध्ये प्रवेश करा' })}
              </Button>
            </form>

            <div className="rounded-lg bg-slate-50 p-4 text-left">
              <p className="text-sm font-semibold text-slate-700">
                {t({ en: 'Default credentials (demo only)', mr: 'डिफॉल्ट प्रमाणपत्र (फक्त डेमो)' })}
              </p>
              <dl className="mt-2 space-y-1 text-sm font-mono text-slate-600">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">{t({ en: 'Email', mr: 'ईमेल' })}</dt>
                  <dd>admin@village.com</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">{t({ en: 'Password', mr: 'पासवर्ड' })}</dt>
                  <dd>admin123</dd>
                </div>
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
