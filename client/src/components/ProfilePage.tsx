import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useLanguage } from './LanguageProvider';
import useAuthStore from '../store/authStore';
import { 
  User, 
  Mail, 
  Shield,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';

export function ProfilePage() {
  const { t } = useLanguage();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success(t({ 
      en: 'Logged out successfully', 
      mr: 'यशस्वीरित्या लॉग आउट केले' 
    }));
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t({ en: 'My Profile', mr: 'माझे प्रोफाइल' })}
          </h1>
          <p className="text-muted-foreground">
            {t({ en: 'View and manage your account information', mr: 'आपली खाते माहिती पहा आणि व्यवस्थापित करा' })}
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
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t({ en: 'Full Name', mr: 'पूर्ण नाव' })}
                  </p>
                  <p className="font-semibold text-lg">{user?.name || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t({ en: 'Email Address', mr: 'ईमेल पत्ता' })}
                  </p>
                  <p className="font-semibold text-lg">{user?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t({ en: 'Account Role', mr: 'खाते भूमिका' })}
                  </p>
                  <Badge variant="secondary" className="mt-1 font-semibold">
                    {user?.role === 'admin' 
                      ? t({ en: 'Administrator', mr: 'प्रशासक' })
                      : t({ en: 'Villager', mr: 'ग्रामीण' })
                    }
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
