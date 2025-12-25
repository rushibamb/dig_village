import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageProvider';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { 
  CreditCard, 
  AlertCircle, 
  AlertTriangle,
  CheckCircle, 
  Download, 
  History, 
  Search, 
  Droplets, 
  Home as HomeIcon,
  Phone,
  Sparkles,
  Calculator,
  Receipt,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Star,
  ArrowRight,
  User,
  MapPin,
  Calendar
} from 'lucide-react';

interface TaxRecord {
  id: string;
  ownerName: string;
  houseNumber: string;
  type: 'property' | 'water';
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  details: any;
}

export function TaxPaymentPage() {
  const { t } = useLanguage();
  const { isLoggedIn } = useAuth();
  const [selectedTaxType, setSelectedTaxType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TaxRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTaxForPayment, setSelectedTaxForPayment] = useState<TaxRecord | null>(null);

  // Tax records will be fetched from API
  const [taxDatabase, setTaxDatabase] = useState<TaxRecord[]>([]);

  const handleSearch = () => {
    if (!isLoggedIn) {
      toast.error(t({ 
        en: 'Please login to search tax records', 
        mr: 'कर रेकॉर्ड शोधण्यासाठी कृपया लॉगिन करा' 
      }));
      return;
    }

    if (!searchQuery.trim()) {
      toast.error(t({ 
        en: 'Please enter search criteria', 
        mr: 'कृपया शोध निकष टाका' 
      }));
      return;
    }

    const results = taxDatabase.filter(record => 
      record.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.houseNumber === searchQuery.trim()
    );

    setSearchResults(results);
    setHasSearched(true);

    if (results.length === 0) {
      toast.error(t({ 
        en: 'No tax records found for the given criteria', 
        mr: 'दिलेल्या निकषानुसार कोणतेही कर रेकॉर्ड सापडले नाहीत' 
      }));
    } else {
      toast.success(t({ 
        en: `Found ${results.length} tax record(s)`, 
        mr: `${results.length} कर रेकॉर्ड सापडले` 
      }));
    }
  };

  const handlePayNow = (taxRecord: TaxRecord) => {
    if (!isLoggedIn) {
      toast.error(t({ 
        en: 'Please login to make payments', 
        mr: 'पेमेंट करण्यासाठी कृपया लॉगिन करा' 
      }));
      return;
    }
    setSelectedTaxForPayment(taxRecord);
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    if (!selectedPaymentMethod) {
      toast.error(t({ 
        en: 'Please select a payment method', 
        mr: 'कृपया पेमेंट पद्धत निवडा' 
      }));
      return;
    }

    toast.success(t({ 
      en: 'Payment processed successfully!', 
      mr: 'पेमेंट यशस्वीरित्या प्रक्रिया झाली!' 
    }));

    // Update the tax record status
    if (selectedTaxForPayment) {
      const updatedResults = searchResults.map(record =>
        record.id === selectedTaxForPayment.id 
          ? { ...record, status: 'paid' as const }
          : record
      );
      setSearchResults(updatedResults);
    }

    setShowPaymentModal(false);
    setSelectedPaymentMethod('');
    setSelectedTaxForPayment(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gradient-to-r from-yellow-500 to-amber-600';
      case 'paid': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'overdue': return 'bg-gradient-to-r from-red-500 to-rose-600';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'paid': return CheckCircle;
      case 'overdue': return AlertCircle;
      default: return Clock;
    }
  };

  const paymentMethods = [
    {
      id: 'upi',
      name: { en: 'UPI Payment', mr: 'UPI पेमेंट' },
      description: { en: 'Pay using UPI apps like PhonePe, GPay', mr: 'PhonePe, GPay सारख्या UPI अॅप्स वापरा' },
      icon: '📱',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'card',
      name: { en: 'Credit/Debit Card', mr: 'क्रेडिट/डेबिट कार्ड' },
      description: { en: 'Secure card payment', mr: 'सुरक्षित कार्ड पेमेंट' },
      icon: '💳',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'netbanking',
      name: { en: 'Net Banking', mr: 'नेट बँकिंग' },
      description: { en: 'Online banking', mr: 'ऑनलाइन बँकिंग' },
      icon: '🏦',
      color: 'from-green-500 to-emerald-600'
    }
  ];

  const taxTypes = [
    { id: 'all', label: { en: 'All Taxes', mr: 'सर्व कर' }, icon: CreditCard, gradient: 'from-tax-color to-red-600' },
    { id: 'property', label: { en: 'Property Tax', mr: 'मालमत्ता कर' }, icon: HomeIcon, gradient: 'from-orange-500 to-red-600' },
    { id: 'water', label: { en: 'Water Tax', mr: 'पाणी कर' }, icon: Droplets, gradient: 'from-blue-500 to-cyan-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-red-400/20 to-orange-500/20 rounded-full animate-float"></div>
      <div className="absolute top-40 right-16 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-red-500/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 left-32 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-yellow-500/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto max-w-6xl p-4 relative">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-tax-color to-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl animate-glow hover-float">
              <CreditCard className="h-10 w-10 text-white animate-pulse-slow" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse-slow">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>
          <h1 className="mb-2 gradient-text animate-scale-in">
            {t({ en: 'Tax Payment Portal', mr: 'कर भरणा पोर्टल' })}
          </h1>
          <p className="text-gray-600 animate-slide-in-right">
            {t({ en: 'Pay your village taxes online securely and conveniently', mr: 'आपले गावचे कर ऑनलाइन सुरक्षित आणि सोयीस्करपणे भरा' })}
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-8 animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="relative h-64 rounded-3xl overflow-hidden shadow-2xl hover-lift">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXglMjBwYXltZW50JTIwb25saW5lfGVufDF8fHx8MTc1NTQ1NDM1MXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Online tax payment"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-red/20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <h2 className="mb-2 font-bold bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full">
                  {t({ en: 'Digital Tax Collection', mr: 'डिजिटल कर संकलन' })}
                </h2>
                <p className="opacity-90">
                  {t({ en: 'Transparent • Secure • Instant', mr: 'पारदर्शक • सुरक्षित • तत्काळ' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Type Filter */}
        <div className="flex justify-center mb-8 animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <div className="inline-flex glass-card p-2 rounded-2xl shadow-lg">
            {taxTypes.map((type, index) => (
              <Button
                key={type.id}
                variant={selectedTaxType === type.id ? 'default' : 'ghost'}
                onClick={() => setSelectedTaxType(type.id)}
                className={`gap-2 transition-all duration-300 hover-scale ${
                  selectedTaxType === type.id 
                    ? `bg-gradient-to-r ${type.gradient} text-white shadow-lg animate-glow` 
                    : 'text-gray-600 hover:bg-gradient-to-r hover:' + type.gradient + ' hover:text-black glass-effect'
                } animate-slide-in-right`}
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <type.icon className="h-4 w-4" />
                {t(type.label)}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Search Section */}
            <Card className="mb-6 glass-card border-0 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="text-tax flex items-center gap-2">
                  <Search className="h-5 w-5 animate-pulse-slow" />
                  {t({ en: 'Find Tax Records', mr: 'कर रेकॉर्ड शोधा' })}
                </CardTitle>
                <p className="text-gray-600">
                  {t({ en: 'Search by full name or house number to view your tax dues', mr: 'तुमचे कर देणे पाहण्यासाठी पूर्ण नाव किंवा घर क्रमांकाने शोधा' })}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t({ en: 'Enter full name or house number (e.g., राम शर्मा, 123)', mr: 'पूर्ण नाव किंवा घर क्रमांक टाका (उदा., राम शर्मा, 123)' })}
                      className="glass-effect border-tax/20 focus:border-tax hover-glow transition-all duration-300"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button 
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-tax-color to-red-600 text-white border-0 hover-scale hover:shadow-xl transition-all duration-300"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {t({ en: 'Search', mr: 'शोधा' })}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Authentication Warning */}
            {!isLoggedIn && (
              <Card className="mb-6 glass-card border-0 shadow-xl border-red-200 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center animate-pulse-slow">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-red-700 mb-1">
                        {t({ en: 'Login Required', mr: 'लॉगिन आवश्यक' })}
                      </h3>
                      <p className="text-red-600 text-sm mb-3">
                        {t({ 
                          en: 'You need to login to search tax records and make payments. Please login to access all features.',
                          mr: 'कर रेकॉर्ड शोधण्यासाठी आणि पेमेंट करण्यासाठी तुम्हाला लॉगिन करावे लागेल. सर्व वैशिष्ट्ये वापरण्यासाठी कृपया लॉगिन करा.'
                        })}
                      </p>
                      <Button 
                        onClick={() => window.location.href = '/login'}
                        className="bg-gradient-to-r from-red-500 to-orange-600 text-white border-0 hover-scale hover:shadow-xl transition-all duration-300"
                        size="sm"
                      >
                        <User className="h-4 w-4 mr-2" />
                        {t({ en: 'Login Now', mr: 'आता लॉगिन करा' })}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Default Information when no search performed */}
            {!hasSearched && (
              <Card className="glass-card border-0 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
                    <Calculator className="h-8 w-8 text-white animate-pulse-slow" />
                  </div>
                  <h3 className="text-blue-800 mb-4 font-bold">
                    {t({ en: 'Tax Information Center', mr: 'कर माहिती केंद्र' })}
                  </h3>
                  <div className="glass-effect p-6 rounded-xl mb-6">
                    <h4 className="font-bold mb-4 gradient-text">{t({ en: 'Tax Rates & Information', mr: 'कर दर आणि माहिती' })}</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="glass-effect p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <HomeIcon className="h-5 w-5 text-orange-600" />
                          <h5 className="font-semibold text-orange-600">{t({ en: 'Property Tax', mr: 'मालमत्ता कर' })}</h5>
                        </div>
                        <ul className="text-gray-600 space-y-1 text-left">
                          <li>• {t({ en: 'Residential: ₹25/sq ft annually', mr: 'निवासी: ₹२५/चौ.फुट वार्षिक' })}</li>
                          <li>• {t({ en: 'Commercial: ₹40/sq ft annually', mr: 'व्यावसायिक: ₹४०/चौ.फुट वार्षिक' })}</li>
                          <li>• {t({ en: 'Due: 31st January every year', mr: 'मुदत: दर वर्षी ३१ जानेवारी' })}</li>
                        </ul>
                      </div>
                      <div className="glass-effect p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Droplets className="h-5 w-5 text-blue-600" />
                          <h5 className="font-semibold text-blue-600">{t({ en: 'Water Tax', mr: 'पाणी कर' })}</h5>
                        </div>
                        <ul className="text-gray-600 space-y-1 text-left">
                          <li>• {t({ en: 'Usage: ₹2/1000 liters', mr: 'वापर: ₹२/१००० लिटर' })}</li>
                          <li>• {t({ en: 'Fixed charge: ₹200/month', mr: 'निश्चित शुल्क: ₹२००/महिना' })}</li>
                          <li>• {t({ en: 'Due: 15th of every month', mr: 'मुदत: दर महिन्याच्या १५ तारखेला' })}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {t({ 
                      en: 'To view your specific tax dues and payment history, please search using your full name or house number above',
                      mr: 'तुमचे विशिष्ट कर देणे आणि पेमेंट इतिहास पाहण्यासाठी, कृपया वरील तुमचे पूर्ण नाव किंवा घर क्रमांक वापरून शोधा'
                    })}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Tips */}
            <Card className="glass-card border-0 shadow-xl animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600 animate-pulse-slow" />
                  {t({ en: 'Quick Tips', mr: 'द्रुत टिप्स' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="glass-effect p-3 rounded-lg hover-lift">
                    <p className="text-gray-700">
                      💡 {t({ en: 'Search with exact house number for faster results', mr: 'जलद परिणामांसाठी अचूक घर क्रमांकाने शोधा' })}
                    </p>
                  </div>
                  <div className="glass-effect p-3 rounded-lg hover-lift">
                    <p className="text-gray-700">
                      🏠 {t({ en: 'Property tax is calculated per square foot', mr: 'मालमत्ता कर प्रति चौरस फुट मोजला जातो' })}
                    </p>
                  </div>
                  <div className="glass-effect p-3 rounded-lg hover-lift">
                    <p className="text-gray-700">
                      💧 {t({ en: 'Water tax includes usage + fixed charges', mr: 'पाणी करात वापर + निश्चित शुल्क समाविष्ट आहे' })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}