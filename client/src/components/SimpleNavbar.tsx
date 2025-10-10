import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useLanguage, translations } from './LanguageProvider';
import { useAuth } from './AuthContext';
import { 
  Home,
  CreditCard, 
  FileText, 
  Users, 
  Languages,
  Menu,
  X,
  Building2,
  Camera,
  Newspaper,
  FileBarChart,
  LogIn,
  LogOut,
  UserCircle,
  Settings,
  User
} from 'lucide-react';

interface SimpleNavbarProps {
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

export function SimpleNavbar({ currentPage, onPageChange }: SimpleNavbarProps) {
  const { language, setLanguage, t } = useLanguage();
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Get current page from URL if not provided
  const getCurrentPage = () => {
    if (currentPage) return currentPage;
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/tax') return 'tax';
    if (path === '/grievance') return 'grievance';
    if (path === '/villager') return 'villager';
    if (path === '/committee') return 'committee';
    if (path === '/media') return 'media';
    if (path === '/news') return 'news';
    if (path === '/contracts') return 'contracts';
    return 'home';
  };

  const activePage = getCurrentPage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'mr' : 'en');
  };

  const handleLogout = () => {
    logout();
    if (onPageChange) {
      onPageChange('home');
    } else {
      navigate('/');
    }
  };

  const handleNavigation = (page: string) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      const routes: Record<string, string> = {
        'home': '/',
        'tax': '/tax',
        'grievance': '/grievance',
        'villager': '/villager',
        'committee': '/committee',
        'media': '/media',
        'news': '/news',
        'contracts': '/contracts',
        'profile': '/profile',
      };
      const route = routes[page];
      if (route) {
        navigate(route);
      }
    }
  };

  const navItems = [
    {
      id: 'home',
      label: { en: 'Home', mr: 'मुख्यपृष्ठ' },
      icon: Home,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'tax',
      label: { en: 'Tax Payment', mr: 'कर भरणा' },
      icon: CreditCard,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'grievance',
      label: { en: 'Grievance', mr: 'तक्रार' },
      icon: FileText,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'villager',
      label: { en: 'Manage Villager', mr: 'गावकरी व्यवस्थापन' },
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      requiresAuth: true
    },

    {
      id: 'committee',
      label: { en: 'Committee', mr: 'समिती' },
      icon: Building2,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'media',
      label: { en: 'Media', mr: 'मीडिया' },
      icon: Camera,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'news',
      label: { en: 'News', mr: 'बातम्या' },
      icon: Newspaper,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'contracts',
      label: { en: 'Contracts', mr: 'कंत्राटे' },
      icon: FileBarChart,
      gradient: 'from-blue-500 to-blue-600'
    },
  ];

  const NavItemButton = ({ item, isMobile = false }: { item: typeof navItems[0], isMobile?: boolean }) => {
    // Check if item requires authentication
    if (item.requiresAuth && !isLoggedIn) {
      return null;
    }

    const handleClick = () => {
      // If item requires auth and user is not logged in, redirect to login
      if (item.requiresAuth && !isLoggedIn) {
        if (onPageChange) {
          onPageChange('login');
        } else {
          navigate('/login');
        }
        return;
      }
      
      handleNavigation(item.id);
      if (isMobile) setIsMobileMenuOpen(false);
    };

    return (
      <Button
        variant={activePage === item.id ? 'default' : 'ghost'}
        onClick={handleClick}
        className={`navbar-button ${isMobile ? 'justify-start w-full' : ''} gap-2 relative overflow-hidden group transition-all duration-500 transform ${ 
          activePage === item.id 
            ? `bg-gradient-to-r ${item.gradient} text-white shadow-xl hover-lift animate-glow scale-105` 
            : 'glass-effect border-0 hover:scale-105 hover:!bg-blue-500 hover:!bg-gradient-to-r hover:!from-blue-500 hover:!to-blue-600 hover:!text-white hover:shadow-lg'
        }`}
        title={item.requiresAuth && !isLoggedIn ? t({ en: 'Login required', mr: 'लॉगिन आवश्यक' }) : undefined}
      >
        {activePage === item.id && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-60 animate-shimmer"></div>
        )}
        <item.icon className={`h-4 w-4 transition-all duration-300 ${
          activePage === item.id ? 'animate-pulse-slow scale-110' : 'group-hover:scale-125 group-hover:rotate-12'
        }`} />
        <span className="font-medium relative z-10">{t(item.label)}</span>
        {item.requiresAuth && !isLoggedIn && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
        )}
      </Button>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-effect border-b border-white/30 shadow-2xl backdrop-blur-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/90 via-purple-50/90 to-cyan-50/90"></div>
      <div className="container mx-auto px-6 relative">
        <div className="flex h-16 items-center">
          {/* Left Navigation Items */}
          <div className="flex items-center gap-2">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 animate-scale-in">
              {navItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <NavItemButton item={item} />
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="glass-effect hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-blue-600 transition-all duration-300 hover-scale"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3 ml-auto animate-slide-in-left">

            {/* User Menu */}
            {isLoggedIn ? (
              <div className="hidden sm:flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => handleNavigation('profile')}
                  className="navbar-button flex items-center gap-2 glass-effect px-4 py-2 rounded-lg hover:!bg-blue-500 hover:!bg-gradient-to-r hover:!from-blue-500 hover:!to-blue-600 hover:!text-white transition-all duration-300 hover:scale-105"
                  title={t({ en: 'View Profile', mr: 'प्रोफाइल पहा' })}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center animate-pulse-slow shadow-lg">
                    <UserCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-800 font-medium">{user?.name?.split(' ')[0] || 'User'}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 glass-effect border-red-200 text-red-600 hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-600 hover:text-white hover:border-transparent transition-all duration-300 hover-scale transform hover:rotate-1"
                  title={t({ en: 'Logout from your account', mr: 'आपल्या खात्यातून लॉगआउट करा' })}
                >
                  <LogOut className="h-4 w-4" />
                  {t({ en: 'Logout', mr: 'लॉगआउट' })}
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (onPageChange) {
                      onPageChange('register');
                    } else {
                      navigate('/register');
                    }
                  }}
                  className="gap-2 glass-effect border-green-200 text-green-600 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-white hover:border-transparent transition-all duration-300 hover-scale transform hover:rotate-1"
                  title={t({ en: 'Create a new account', mr: 'नवीन खाते तयार करा' })}
                >
                  <User className="h-4 w-4" />
                  {t({ en: 'Register', mr: 'नोंदणी' })}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (onPageChange) {
                      onPageChange('login');
                    } else {
                      navigate('/login');
                    }
                  }}
                  className="gap-2 glass-effect border-blue-200 text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:border-transparent transition-all duration-300 hover-scale transform hover:rotate-1"
                  title={t({ en: 'Sign in to your account', mr: 'आपल्या खात्यात साइन इन करा' })}
                >
                  <LogIn className="h-4 w-4" />
                  {t({ en: 'Login', mr: 'लॉगिन' })}
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="gap-2 glass-effect border-purple-200 text-purple-600 hover:bg-gradient-to-r hover:from-purple-500 hover:to-violet-600 hover:text-white hover:border-transparent transition-all duration-300 hover-scale transform hover:rotate-1"
              title={t({ en: 'Switch language', mr: 'भाषा बदला' })}
            >
              <Languages className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">
                {language === 'en' ? 'मराठी' : 'English'}
              </span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/30 glass-effect rounded-b-xl mt-2 animate-fade-in-up">
            <div className="flex flex-col gap-2">
              {navItems.map((item, index) => (
                <div 
                  key={item.id}
                  className="animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <NavItemButton item={item} isMobile />
                </div>
              ))}
              
              
              {/* Mobile Auth Buttons */}
              <div className="pt-3 border-t border-white/30 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleNavigation('profile');
                        setIsMobileMenuOpen(false);
                      }}
                      className="navbar-button w-full justify-start gap-3 glass-effect hover:!bg-blue-500 hover:!bg-gradient-to-r hover:!from-blue-500 hover:!to-blue-600 hover:!text-white transition-all duration-300"
                      title={t({ en: 'View Profile', mr: 'प्रोफाइल पहा' })}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
                        <UserCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-800 font-medium">{user?.name || 'User'}</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start gap-3 glass-effect border-red-200 text-red-600 hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-600 hover:text-white hover:border-transparent transition-all duration-300"
                    >
                      <LogOut className="h-4 w-4" />
                      {t({ en: 'Logout', mr: 'लॉगआउट' })}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (onPageChange) {
                          onPageChange('register');
                        } else {
                          navigate('/register');
                        }
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start gap-3 glass-effect border-green-200 text-green-600 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-blue-600 hover:border-transparent transition-all duration-300"
                    >
                      <User className="h-4 w-4" />
                      {t({ en: 'Register', mr: 'नोंदणी' })}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (onPageChange) {
                          onPageChange('login');
                        } else {
                          navigate('/login');
                        }
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start gap-3 glass-effect border-blue-200 text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:border-transparent transition-all duration-300"
                    >
                      <LogIn className="h-4 w-4" />
                      {t({ en: 'Login', mr: 'लॉगिन' })}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}