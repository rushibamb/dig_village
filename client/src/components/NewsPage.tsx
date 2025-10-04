import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageProvider';
import {
  getPublicNews,
  getPublicCategories,
  getUpcomingEvents,
  getBreakingNews,
  getCurrentWeatherAlert
} from '../services/newsService';
import { 
  Newspaper, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertTriangle,
  Info,
  Megaphone,
  Zap,
  Droplets,
  Construction,
  Bell,
  ArrowRight,
  Share2,
  Bookmark
} from 'lucide-react';

export function NewsPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newsCategories, setNewsCategories] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [breakingNews, setBreakingNews] = useState(null);
  const [weatherAlert, setWeatherAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isWeatherAlertModalOpen, setIsWeatherAlertModalOpen] = useState(false);

  // Handler functions
  const handleReadMore = (article) => {
    setSelectedArticle(article);
    setIsArticleModalOpen(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleShare = async (article) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title ? t(article.title) : 'News Article',
          text: article?.summary ? t(article.summary) : 'Check out this news article',
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `${article?.title ? t(article.title) : 'News Article'}\n\n${article?.summary ? t(article.summary) : ''}\n\n${window.location.href}`;
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Article link copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  // Fetch data function
  const fetchNewsData = async () => {
    setLoading(true);
    try {
      // Fetch news articles based on selected category
      const categoryFilter = selectedCategory === 'all' ? undefined : selectedCategory;
      console.log('Fetching news with category filter:', categoryFilter, 'selectedCategory:', selectedCategory);
      
      const [newsRes, categoriesRes, eventsRes, breakingRes, weatherRes] = await Promise.all([
        getPublicNews({ category: categoryFilter }),
        getPublicCategories(),
        getUpcomingEvents(),
        getBreakingNews(),
        getCurrentWeatherAlert()
      ]);
      
      console.log('News API Response:', newsRes);
      console.log('Categories API Response:', categoriesRes);
      console.log('Events API Response:', eventsRes);
      console.log('Breaking News API Response:', breakingRes);
      console.log('Weather Alert API Response:', weatherRes);
      
      // Debug weather alert specifically
      if (weatherRes) {
        console.log('Weather Alert Details:', {
          success: weatherRes.success,
          data: weatherRes.data,
          message: weatherRes.message
        });
        
        // Log the actual weather alert data structure
        if (weatherRes.data) {
          console.log('Raw Weather Alert Data:', JSON.stringify(weatherRes.data, null, 2));
        }
      }
      
      setNewsItems(newsRes.data || newsRes || []);
      setNewsCategories(categoriesRes.data || categoriesRes || []);
      setUpcomingEvents(eventsRes.data || eventsRes || []);
      setBreakingNews(breakingRes.data || breakingRes || null);
      setWeatherAlert(weatherRes.data || weatherRes || null);
    } catch (error) {
      console.error('Failed to fetch news data:', error);
      alert('Failed to fetch news data. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or selectedCategory changes
  useEffect(() => {
    fetchNewsData();
  }, [selectedCategory]);

  // No need to filter here since the API already filters by category
  const filteredNews = newsItems;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Newspaper className="h-8 w-8 text-white" />
          </div>
            <div className="flex justify-center items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
            {t({ en: 'Village News & Updates', mr: 'गाव बातम्या आणि अपडेट्स' })}
          </h1>
              <Button 
                onClick={fetchNewsData} 
                disabled={loading}
                variant="outline" 
                size="sm"
                className="text-xs"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
          <p className="text-gray-600 text-base">
            {t({ en: 'Stay informed about village events, announcements and alerts', mr: 'गावातील कार्यक्रम, घोषणा आणि सूचनांबद्दल माहिती मिळवा' })}
          </p>
        </div>

        {/* Breaking News Banner */}
        {breakingNews && (
          <Card 
            className="mb-6 bg-gradient-to-r from-red-500 to-red-600 border-0 text-white cursor-pointer hover:from-red-600 hover:to-red-700 transition-colors"
            onClick={() => handleReadMore(breakingNews)}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 rounded-full p-1.5">
                  <Bell className="h-4 w-4 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <span className="font-bold text-sm">
                  {t({ en: 'BREAKING:', mr: 'तातडीची:' })}
                </span>
                <span className="ml-2">
                    {breakingNews?.title ? t(breakingNews.title) : 'Breaking News'}
                </span>
              </div>
              <ArrowRight className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-1 mb-4">
              {/* All News Button */}
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className={`gap-1 text-xs ${selectedCategory === 'all' ? 'bg-indigo-600 text-white' : ''}`}
              >
                <Newspaper className="h-3 w-3" />
                {t({ en: 'All News', mr: 'सर्व बातम्या' })}
              </Button>
              
              {/* Dynamic Categories */}
              {newsCategories.map((category) => (
                <Button
                  key={category._id}
                  variant={selectedCategory === category._id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category._id)}
                  className={`gap-1 text-xs ${selectedCategory === category._id ? 'bg-indigo-600 text-white' : ''}`}
                >
                  <Newspaper className="h-3 w-3" />
                  {category?.name ? t(category.name) : 'Category'}
                </Button>
              ))}
            </div>

            {/* News Items */}
            <div className="space-y-4">
              {filteredNews.map((item) => (
                <Card key={item._id} className="hover:shadow-lg transition-shadow border-l-4 border-indigo-200 bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-indigo-50">
                        <Newspaper className="h-5 w-5 text-indigo-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {(() => {
                                  const category = newsCategories.find(cat => cat._id === item.category);
                                  return category?.name ? t(category.name) : 'News';
                                })()}
                              </Badge>
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(item.priority)}`}></div>
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 mb-1">{item?.title ? t(item.title) : 'News Title'}</h2>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => handleShare(item)}
                              title="Share article"
                            >
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {item.imageUrl && (
                          <div className="mb-3">
                            <ImageWithFallback
                              src={item.imageUrl}
                              alt={item?.title ? t(item.title) : 'News Image'}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        
                        <p className="text-gray-700 mb-3 leading-relaxed">{item?.summary ? t(item.summary) : 'News summary'}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(item.publishDate).toLocaleDateString('en-GB')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {new Date(item.publishDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          <Button 
                            variant="link" 
                            className="text-indigo-600 p-0 h-auto"
                            onClick={() => handleReadMore(item)}
                          >
                            {t({ en: 'Read more', mr: 'अधिक वाचा' })}
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  {t({ en: 'Upcoming Events', mr: 'आगामी कार्यक्रम' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div 
                      key={event._id} 
                      className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">
                          {new Date(event.eventDate).getDate()}
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{event?.title ? t(event.title) : 'Event Title'}</h4>
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.eventTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weather Alert */}
            {weatherAlert ? (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="h-5 w-5" />
                    {t({ en: 'Weather Alert', mr: 'हवामान इशारा' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700 text-sm mb-3">
                    {weatherAlert?.title ? t(weatherAlert.title) : 'Weather Alert'}
                  </p>
                  {weatherAlert?.message && (
                    <p className="text-yellow-700 text-xs mb-3">
                      {t(weatherAlert.message)}
                    </p>
                  )}
                  <div className="text-xs text-yellow-600 mb-3">
                    <span className="font-semibold">Severity:</span> {weatherAlert.severity} • 
                    <span className="ml-2">
                      Valid until: {weatherAlert.endDate ? new Date(weatherAlert.endDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-yellow-300 text-yellow-700 w-full"
                    onClick={() => setIsWeatherAlertModalOpen(true)}
                  >
                    {t({ en: 'View Details', mr: 'तपशील पहा' })}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-600">
                    <AlertTriangle className="h-5 w-5" />
                    {t({ en: 'Weather Status', mr: 'हवामान स्थिती' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    {t({ en: 'No active weather alerts at this time', mr: 'या वेळी कोणताही सक्रिय हवामान इशारा नाही' })}
                  </p>
                </CardContent>
              </Card>
            )}


            {/* Subscribe Newsletter */}
            <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-80" />
                <h3 className="font-bold mb-2">
                  {t({ en: 'Stay Updated', mr: 'अपडेट राहा' })}
                </h3>
                <p className="text-sm mb-4 opacity-90">
                  {t({ 
                    en: 'Get instant notifications for important village updates',
                    mr: 'महत्त्वाच्या गाव अपडेट्ससाठी त्वरित सूचना मिळवा'
                  })}
                </p>
                <Button className="bg-white text-indigo-600 hover:bg-gray-100 w-full">
                  {t({ en: 'Enable Notifications', mr: 'सूचना सक्षम करा' })}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Article Detail Modal */}
        <Dialog open={isArticleModalOpen} onOpenChange={setIsArticleModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {selectedArticle?.title ? t(selectedArticle.title) : 'News Article'}
              </DialogTitle>
            </DialogHeader>
            
            {selectedArticle && (
              <div className="space-y-4">
                {/* Article Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500 border-b pb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedArticle.publishDate).toLocaleDateString('en-GB')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(selectedArticle.publishDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Newspaper className="h-4 w-4" />
                      Read Count: {selectedArticle.readCount || 0}
                    </span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleShare(selectedArticle)}
                    className="gap-1"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>

                {/* Article Image */}
                {selectedArticle.imageUrl && (
                  <div className="w-full">
                    <ImageWithFallback
                      src={selectedArticle.imageUrl}
                      alt={selectedArticle?.title ? t(selectedArticle.title) : 'News Image'}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Article Summary */}
                {selectedArticle.summary && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {t({ en: 'Summary', mr: 'सारांश' })}
                    </h3>
                    <p className="text-gray-700">
                      {t(selectedArticle.summary)}
                    </p>
                  </div>
                )}

                {/* Article Content */}
                {selectedArticle.content && (
                  <div className="prose prose-gray max-w-none">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      {t({ en: 'Full Article', mr: 'संपूर्ण लेख' })}
                    </h3>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {t(selectedArticle.content)}
                    </div>
                  </div>
                )}

                {/* Article Tags */}
                {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="font-medium text-gray-900">
                      {t({ en: 'Tags:', mr: 'टॅग्स:' })}
                    </span>
                    {selectedArticle.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Event Detail Modal */}
        <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {selectedEvent?.title ? t(selectedEvent.title) : 'Event Details'}
              </DialogTitle>
            </DialogHeader>
            
            {selectedEvent && (
              <div className="space-y-4">
                {/* Event Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500 border-b pb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedEvent.eventDate).toLocaleDateString('en-GB')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedEvent.eventTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedEvent?.location ? t(selectedEvent.location) : 'Location TBD'}
                    </span>
                  </div>
                </div>

                {/* Event Description */}
                {selectedEvent.description && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {t({ en: 'Event Description', mr: 'कार्यक्रम वर्णन' })}
                    </h3>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {t(selectedEvent.description)}
                    </div>
                  </div>
                )}

                {/* Event Location */}
                {selectedEvent.location && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {t({ en: 'Event Location', mr: 'कार्यक्रम स्थान' })}
                    </h3>
                    <p className="text-gray-700">
                      {t(selectedEvent.location)}
                    </p>
                  </div>
                )}

                {/* Event Date & Time */}
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t({ en: 'Event Schedule', mr: 'कार्यक्रम वेळापत्रक' })}
                  </h3>
                  <div className="text-gray-700">
                    <p><strong>{t({ en: 'Date:', mr: 'तारीख:' })}</strong> {new Date(selectedEvent.eventDate).toLocaleDateString('en-GB', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                    <p><strong>{t({ en: 'Time:', mr: 'वेळ:' })}</strong> {selectedEvent.eventTime}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Weather Alert Detail Modal */}
        <Dialog open={isWeatherAlertModalOpen} onOpenChange={setIsWeatherAlertModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                {t({ en: 'Weather Alert Details', mr: 'हवामान सूचना तपशील' })}
              </DialogTitle>
            </DialogHeader>
            
            {weatherAlert && (
              <div className="space-y-4">
                {/* Alert Title */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    {t({ en: 'Alert Title', mr: 'सूचना शीर्षक' })}
                  </h3>
                  <p className="text-yellow-700 font-medium">
                    {weatherAlert?.title ? t(weatherAlert.title) : 'Weather Alert'}
                  </p>
                </div>

                {/* Alert Message */}
                {weatherAlert?.message && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {t({ en: 'Alert Message', mr: 'सूचना संदेश' })}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {t(weatherAlert.message)}
                    </p>
                  </div>
                )}

                {/* Alert Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {t({ en: 'Alert Type', mr: 'सूचना प्रकार' })}
                    </h3>
                    <p className="text-blue-700 capitalize">
                      {weatherAlert.alertType || 'Warning'}
                    </p>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-900 mb-2">
                      {t({ en: 'Severity Level', mr: 'गंभीरता स्तर' })}
                    </h3>
                    <p className="text-red-700 capitalize font-medium">
                      {weatherAlert.severity || 'Medium'}
                    </p>
                  </div>
                </div>

                {/* Validity Period */}
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t({ en: 'Validity Period', mr: 'वैधता कालावधी' })}
                  </h3>
                  <div className="text-indigo-700 space-y-1">
                    <p>
                      <strong>{t({ en: 'Start Date:', mr: 'प्रारंभ तारीख:' })}</strong> 
                      {' '}{weatherAlert.startDate ? new Date(weatherAlert.startDate).toLocaleDateString('en-GB', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'N/A'}
                    </p>
                    <p>
                      <strong>{t({ en: 'End Date:', mr: 'समाप्ती तारीख:' })}</strong> 
                      {' '}{weatherAlert.endDate ? new Date(weatherAlert.endDate).toLocaleDateString('en-GB', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Safety Recommendations */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">
                    {t({ en: 'Safety Recommendations', mr: 'सुरक्षा शिफारसी' })}
                  </h3>
                  <ul className="text-green-700 space-y-1 text-sm">
                    <li>• {t({ en: 'Stay indoors during severe weather conditions', mr: 'गंभीर हवामान परिस्थितीत घरात रहा' })}</li>
                    <li>• {t({ en: 'Keep emergency supplies ready', mr: 'आपत्कालीन सामग्री तयार ठेवा' })}</li>
                    <li>• {t({ en: 'Monitor local weather updates', mr: 'स्थानिक हवामान अपडेट्स लक्षात ठेवा' })}</li>
                    <li>• {t({ en: 'Follow official guidelines and advisories', mr: 'अधिकृत दिशानिर्देश आणि सल्ल्यांचे पालन करा' })}</li>
                  </ul>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}