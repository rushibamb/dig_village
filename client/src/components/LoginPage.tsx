import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useLanguage } from './LanguageProvider';
import useAuthStore from '../store/authStore';
import { LogIn, User, Lock, Phone, Home } from 'lucide-react';
import { toast } from 'sonner';

interface LoginPageProps {
  onNavigate?: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { login, register } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [wardNumber, setWardNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        // Login logic
        if (!email || !password) {
          toast.error(t({ en: 'Please fill all fields', mr: 'कृपया सर्व फील्ड भरा' }));
          return;
        }

        const response = await login({ email, password });
        
        if (response.success) {
          toast.success(t({ en: 'Login successful!', mr: 'लॉगिन यशस्वी!' }));
          if (onNavigate) {
            onNavigate('home');
          } else {
            navigate('/');
          }
        }
      } else {
        // Registration logic
        if (!name || !email || !password) {
          toast.error(t({ en: 'Please fill all required fields', mr: 'कृपया सर्व आवश्यक फील्ड भरा' }));
          return;
        }

        const response = await register({ name, email, password });
        
        if (response.success) {
          toast.success(t({ en: 'Registration successful!', mr: 'नोंदणी यशस्वी!' }));
          if (onNavigate) {
            onNavigate('home');
          } else {
            navigate('/');
          }
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.message || t({ en: 'Authentication failed', mr: 'प्रमाणीकरण अयशस्वी' }));
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">
            {isLogin 
              ? t({ en: 'Welcome Back', mr: 'परत स्वागत आहे' })
              : t({ en: 'Create Account', mr: 'खाते तयार करा' })
            }
          </CardTitle>
          <p className="text-gray-600">
            {isLogin 
              ? t({ en: 'Sign in to access your village services', mr: 'आपल्या गावातील सेवांमध्ये प्रवेश करण्यासाठी साइन इन करा' })
              : t({ en: 'Register to access village services', mr: 'गावातील सेवांमध्ये प्रवेश करण्यासाठी नोंदणी करा' })
            }
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t({ en: 'Full Name', mr: 'पूर्ण नाव' })} *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t({ en: 'Enter your full name', mr: 'आपले पूर्ण नाव टाका' })}
                  className="mt-1"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                {t({ en: 'Email / Mobile', mr: 'ईमेल / मोबाइल' })} *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t({ en: 'Enter email address', mr: 'ईमेल पत्ता टाका' })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {t({ en: 'Password', mr: 'पासवर्ड' })} *
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t({ en: 'Enter password', mr: 'पासवर्ड टाका' })}
                className="mt-1"
              />
            </div>
            
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {t({ en: 'Mobile Number', mr: 'मोबाइल नंबर' })} *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t({ en: 'Enter mobile number', mr: 'मोबाइल नंबर टाका' })}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="houseNumber" className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      {t({ en: 'House No.', mr: 'घर क्र.' })} *
                    </Label>
                    <Input
                      id="houseNumber"
                      type="text"
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                      placeholder={t({ en: 'House No.', mr: 'घर क्र.' })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="wardNumber" className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      {t({ en: 'Ward No.', mr: 'वार्ड क्र.' })} *
                    </Label>
                    <Input
                      id="wardNumber"
                      type="text"
                      value={wardNumber}
                      onChange={(e) => setWardNumber(e.target.value)}
                      placeholder={t({ en: 'Ward No.', mr: 'वार्ड क्र.' })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </>
            )}
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              {isLogin 
                ? t({ en: 'Sign In', mr: 'साइन इन करा' })
                : t({ en: 'Create Account', mr: 'खाते तयार करा' })
              }
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin 
                ? t({ en: "Don't have an account?", mr: 'खाते नाही?' })
                : t({ en: 'Already have an account?', mr: 'आधीच खाते आहे?' })
              }
            </p>
            <Button 
              variant="link" 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary"
            >
              {isLogin 
                ? t({ en: 'Create Account', mr: 'खाते तयार करा' })
                : t({ en: 'Sign In', mr: 'साइन इन करा' })
              }
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => {
                if (onNavigate) {
                  onNavigate('home');
                } else {
                  navigate('/');
                }
              }}
              className="text-gray-600"
            >
              {t({ en: 'Continue as Guest', mr: 'अतिथी म्हणून सुरू ठेवा' })}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}