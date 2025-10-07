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
import { searchTaxRecords, createPaymentOrder, verifyPayment, downloadReceipt } from '../services/taxService';
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
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [paymentSuccessRecord, setPaymentSuccessRecord] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTaxForPayment, setSelectedTaxForPayment] = useState<TaxRecord | null>(null);

  // Mock database of tax records
  const taxDatabase: TaxRecord[] = [
    {
      id: 'PTAX001',
      ownerName: 'राम शर्मा',
      houseNumber: '123',
      type: 'property',
      amount: 2500,
      dueDate: '31 Jan 2024',
      status: 'pending',
      details: {
        area: '1200 sq ft',
        assessmentYear: '2023-24',
        wardNumber: '2',
        propertyType: 'Residential'
      }
    },
    {
      id: 'WTAX001',
      ownerName: 'राम शर्मा',
      houseNumber: '123',
      type: 'water',
      amount: 850,
      dueDate: '15 Feb 2024',
      status: 'pending',
      details: {
        connectionNumber: 'WC123456',
        consumption: '15,000 liters',
        billingPeriod: 'Jan 2024',
        meterReading: '45230'
      }
    },
    {
      id: 'PTAX002',
      ownerName: 'सीता पटेल',
      houseNumber: '456',
      type: 'property',
      amount: 3200,
      dueDate: '31 Jan 2024',
      status: 'overdue',
      details: {
        area: '1500 sq ft',
        assessmentYear: '2023-24',
        wardNumber: '3',
        propertyType: 'Commercial'
      }
    },
    {
      id: 'WTAX002',
      ownerName: 'मोहन कुमार',
      houseNumber: '789',
      type: 'water',
      amount: 1200,
      dueDate: '15 Feb 2024',
      status: 'paid',
      details: {
        connectionNumber: 'WC789012',
        consumption: '22,000 liters',
        billingPeriod: 'Jan 2024',
        meterReading: '67890'
      }
    }
  ];

  const handleSearch = async () => {
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

    try {
      setIsLoading(true);
      setHasSearched(true);
      
      const response = await searchTaxRecords(searchQuery.trim());
      
      // Transform the API response to match the expected TaxRecord interface
      const transformedResults = response.data.map((record: any) => ({
        id: record._id,
        ownerName: record.ownerName,
        houseNumber: record.houseNumber,
        type: record.taxType.toLowerCase().includes('property') ? 'property' as const : 'water' as const,
        amount: record.amountDue,
        dueDate: record.dueDate,
        status: record.status.toLowerCase() as 'pending' | 'paid' | 'overdue',
        details: {
          taxType: record.taxType,
          receiptNumber: record.paymentDetails?.receiptNumber || null
        }
      }));

      setSearchResults(transformedResults);

      if (transformedResults.length === 0) {
        toast.info(t({ 
          en: 'No pending tax records found for the given criteria', 
          mr: 'दिलेल्या निकषानुसार कोणतेही प्रलंबित कर रेकॉर्ड सापडले नाहीत' 
        }));
      } else {
        toast.success(t({ 
          en: `Found ${transformedResults.length} tax record(s)`, 
          mr: `${transformedResults.length} कर रेकॉर्ड सापडले` 
        }));
      }
    } catch (error) {
      console.error('Error searching tax records:', error);
      toast.error(t({ 
        en: 'Failed to search tax records. Please try again.', 
        mr: 'कर रेकॉर्ड शोधण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.' 
      }));
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (record) => {
    if (!isLoggedIn) {
      toast.error(t({ 
        en: 'Please login to make payments', 
        mr: 'पेमेंट करण्यासाठी कृपया लॉगिन करा' 
      }));
      return;
    }

    try {
      console.log('[Payment] Record data:', record);
      console.log('[Payment] Record ID:', record.id);
      
      // Validate record ID
      if (!record.id) {
        toast.error(t({ 
          en: 'Invalid tax record. Please try searching again.', 
          mr: 'अवैध कर रेकॉर्ड. कृपया पुन्हा शोधा.' 
        }));
        return;
      }
      
      console.log('[Payment] Sending request with taxRecordId:', record.id);
      const order = await createPaymentOrder({ taxRecordId: record.id });
      
      // Check if this is a development order (starts with 'dev_order_')
      const isDevelopmentOrder = order.data.orderId.startsWith('dev_order_');
      
      if (isDevelopmentOrder) {
        // Simulate payment success for development
        console.log('[Payment] Development mode - simulating payment success');
        toast.success(t({ 
          en: 'Payment simulated successfully (Development Mode)', 
          mr: 'पेमेंट यशस्वीरित्या सिम्युलेट केले (डेव्हलपमेंट मोड)' 
        }));
        
        // Simulate payment verification
        try {
          await verifyPayment({
            razorpay_order_id: order.data.orderId,
            razorpay_payment_id: 'dev_payment_' + Date.now(),
            razorpay_signature: 'dev_signature_' + Date.now(),
            taxRecordId: record.id
          });
          
          setPaymentSuccessRecord(record);
          handleSearch();
        } catch (err) {
          console.error("Simulated payment verification failed:", err);
        }
        return;
      }
      
      // Real Razorpay payment flow
      const options = {
        key: order.data.key,
        amount: order.data.amount,
        currency: "INR",
        name: "Digital Village Tax Payment",
        description: `Payment for ${record.details.taxType}`,
        order_id: order.data.orderId,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              taxRecordId: record.id
            });
            // On success, show the success message and download button
            setPaymentSuccessRecord(record);
            handleSearch(); // Refresh the list of dues
            toast.success(t({ 
              en: 'Payment Successful!', 
              mr: 'पेमेंट यशस्वी!' 
            }));
          } catch (err) {
            console.error("Payment verification failed:", err);
            toast.error(t({ 
              en: 'Payment successful, but verification failed. Please contact support.', 
              mr: 'पेमेंट यशस्वी, परंतु सत्यापन अयशस्वी. कृपया सपोर्टशी संपर्क साधा.' 
            }));
          }
        },
        prefill: {
          name: record.ownerName,
        },
        theme: {
          color: "#dc2626" // Tax color theme
        },
        modal: {
          ondismiss: () => {
            toast.info(t({ 
              en: 'Payment cancelled', 
              mr: 'पेमेंट रद्द झाले' 
            }));
          }
        }
      };
      
      console.log("RAZORPAY OPTIONS BEING SENT:", options);
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error creating payment order:", error);
      toast.error(t({ 
        en: 'Failed to initiate payment. Please try again.', 
        mr: 'पेमेंट सुरू करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.' 
      }));
    }
  };

  const handleDownloadReceipt = async (recordId) => {
    try {
      const response = await downloadReceipt(recordId);
      // Create a Blob from the PDF stream
      const file = new Blob([response.data], { type: 'application/pdf' });
      // Build a URL from the file
      const fileURL = URL.createObjectURL(file);
      // Open the URL on new Window
      window.open(fileURL);
      toast.success(t({ 
        en: 'Receipt downloaded successfully!', 
        mr: 'रसीद यशस्वीरित्या डाउनलोड झाली!' 
      }));
    } catch (error) {
      console.error("Failed to download receipt:", error);
      toast.error(t({ 
        en: 'Failed to download receipt. Please try again.', 
        mr: 'रसीद डाउनलोड करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.' 
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
                    : 'text-gray-600 hover:bg-gradient-to-r hover:' + type.gradient + ' hover:text-white glass-effect'
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
                    disabled={isLoading}
                    className="bg-gradient-to-r from-tax-color to-red-600 text-white border-0 hover-scale hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    {isLoading ? t({ en: 'Searching...', mr: 'शोधत आहे...' }) : t({ en: 'Search', mr: 'शोधा' })}
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

            {/* Payment Success Message */}
            {paymentSuccessRecord && (
              <Card className="glass-card border-0 shadow-xl animate-fade-in-up bg-green-50 border-green-200" style={{ animationDelay: '0.3s' }}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-green-800 mb-2">
                    {t({ en: 'Payment Successful!', mr: 'पेमेंट यशस्वी!' })}
                  </h3>
                  <p className="text-green-700 mb-4">
                    {t({ en: 'Your payment for', mr: 'तुमचे पेमेंट' })} {paymentSuccessRecord.details.taxType} {t({ en: 'has been received.', mr: 'यशस्वीरित्या प्राप्त झाले.' })}
                  </p>
                  <Button 
                    onClick={() => handleDownloadReceipt(paymentSuccessRecord.id)} 
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t({ en: 'Download Receipt', mr: 'रसीद डाउनलोड करा' })}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setPaymentSuccessRecord(null)}
                    className="ml-3"
                  >
                    {t({ en: 'Close', mr: 'बंद करा' })}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Search Results */}
            {hasSearched && (
              <Card className="glass-card border-0 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <CardHeader>
                  <CardTitle className="text-tax flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    {t({ en: 'Search Results', mr: 'शोध परिणाम' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tax mx-auto mb-4"></div>
                      <p className="text-gray-600">
                        {t({ en: 'Searching tax records...', mr: 'कर रेकॉर्ड शोधत आहे...' })}
                      </p>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-gray-700 mb-2 font-semibold">
                        {t({ en: 'No Pending Tax Records Found', mr: 'कोणतेही प्रलंबित कर रेकॉर्ड सापडले नाही' })}
                      </h3>
                      <p className="text-gray-600">
                        {t({ 
                          en: 'No pending or overdue tax records found for your search criteria. All your taxes might be paid up!', 
                          mr: 'तुमच्या शोध निकषानुसार कोणतेही प्रलंबित किंवा ओव्हरड्यू कर रेकॉर्ड सापडले नाही. तुमचे सर्व कर भरले असू शकतात!' 
                        })}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {searchResults.map((record) => (
                        <div key={record.id} className="glass-effect p-4 rounded-lg border border-gray-200 hover:border-tax/30 transition-all duration-300">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-tax-color to-red-600 rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-800">{record.ownerName}</h4>
                                  <p className="text-sm text-gray-600">
                                    {t({ en: 'House Number:', mr: 'घर क्रमांक:' })} {record.houseNumber}
                                  </p>
                                </div>
                              </div>
                              <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">{t({ en: 'Tax Type:', mr: 'कर प्रकार:' })}</span>
                                  <p className="font-medium">{record.details.taxType}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">{t({ en: 'Amount Due:', mr: 'देय रक्कम:' })}</span>
                                  <p className="font-bold text-tax">₹{record.amount.toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">{t({ en: 'Due Date:', mr: 'देय तारीख:' })}</span>
                                  <p className="font-medium">{new Date(record.dueDate).toLocaleDateString('en-IN')}</p>
                                </div>
                              </div>
                              <div className="mt-3">
                                <Badge 
                                  variant={record.status === 'paid' ? 'default' : record.status === 'overdue' ? 'destructive' : 'secondary'}
                                  className="text-xs"
                                >
                                  {record.status === 'paid' ? t({ en: 'Paid', mr: 'पैसे दिले' }) :
                                   record.status === 'overdue' ? t({ en: 'Overdue', mr: 'ओव्हरड्यू' }) :
                                   t({ en: 'Pending', mr: 'प्रलंबित' })}
                                </Badge>
                              </div>
                            </div>
                            {record.status !== 'paid' && (
                              <div className="ml-4">
                                <Button
                                  onClick={() => handlePayment(record)}
                                  className="bg-gradient-to-r from-tax-color to-red-600 text-white border-0 hover-scale hover:shadow-xl transition-all duration-300"
                                >
                                  <CreditCard className="h-4 w-4 mr-2" />
                                  {t({ en: 'Pay Now', mr: 'आत्ता पैसे द्या' })}
                                </Button>
                              </div>
                            )}
                            {record.status === 'paid' && (
                              <div className="ml-4">
                                <Button
                                  onClick={() => handleDownloadReceipt(record.id)}
                                  variant="outline"
                                  className="border-tax text-tax hover:bg-tax hover:text-white transition-all duration-300"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  {t({ en: 'Download Receipt', mr: 'रसीद डाउनलोड करा' })}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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