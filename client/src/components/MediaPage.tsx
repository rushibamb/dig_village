import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageProvider';
import { 
  Camera, 
  Video, 
  Play, 
  Download, 
  Share2, 
  Calendar,
  MapPin,
  Filter,
  Grid3X3,
  List,
  Eye,
  Heart,
  MoreHorizontal
} from 'lucide-react';

export function MediaPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('photos');
  const [viewMode, setViewMode] = useState('grid');

  const mediaCategories = [
    { id: 'all', label: { en: 'All Media', mr: 'सर्व मीडिया' }, count: 48 },
    { id: 'festivals', label: { en: 'Festivals', mr: 'सण-उत्सव' }, count: 15 },
    { id: 'development', label: { en: 'Development', mr: 'विकास' }, count: 12 },
    { id: 'education', label: { en: 'Education', mr: 'शिक्षण' }, count: 8 },
    { id: 'agriculture', label: { en: 'Agriculture', mr: 'शेती' }, count: 10 },
    { id: 'events', label: { en: 'Events', mr: 'कार्यक्रम' }, count: 3 }
  ];

  const photos = [
    {
      id: 1,
      title: { en: 'Ganesh Festival Celebration', mr: 'गणेश उत्सव साजरा' },
      description: { en: 'Annual Ganesh festival celebrated with great enthusiasm', mr: 'वार्षिक गणेश उत्सव मोठ्या उत्साहाने साजरा केला' },
      image: 'https://images.unsplash.com/photo-1745988583865-2249654d864c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2aWxsYWdlJTIwZmVzdGl2YWwlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NTU0NTU0NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'festivals',
      date: '2024-08-25',
      views: 245,
      likes: 32
    },
    {
      id: 2,
      title: { en: 'New Road Construction', mr: 'नवीन रस्ता बांधकाम' },
      description: { en: 'Construction of new concrete road connecting to main highway', mr: 'मुख्य महामार्गाला जोडणारा नवीन काँक्रीट रस्ता बांधकाम' },
      image: 'https://images.unsplash.com/photo-1683633570715-dce2fd5dfe90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBydXJhbCUyMGRldmVsb3BtZW50JTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc1NTQ1NTQ2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'development',
      date: '2024-07-15',
      views: 189,
      likes: 28
    },
    {
      id: 3,
      title: { en: 'School Children Learning', mr: 'शाळकरी मुले शिकताना' },
      description: { en: 'Students engaged in interactive learning at village school', mr: 'गावातील शाळेत विद्यार्थी संवादात्मक शिक्षणात गुंतलेले' },
      image: 'https://images.unsplash.com/photo-1600792174277-8d734290a61f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2aWxsYWdlJTIwZWR1Y2F0aW9uJTIwc2Nob29sJTIwY2hpbGRyZW58ZW58MXx8fHwxNzU1NDU1NDc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'education',
      date: '2024-06-10',
      views: 156,
      likes: 45
    },
    {
      id: 4,
      title: { en: 'Farmers Market Day', mr: 'शेतकरी बाजार दिवस' },
      description: { en: 'Weekly farmers market showcasing local produce', mr: 'स्थानिक उत्पादनांचे प्रदर्शन करणारा साप्ताहिक शेतकरी बाजार' },
      image: 'https://images.unsplash.com/photo-1745988583865-2249654d864c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2aWxsYWdlJTIwZmVzdGl2YWwlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NTU0NTU0NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'agriculture',
      date: '2024-05-20',
      views: 134,
      likes: 19
    },
    {
      id: 5,
      title: { en: 'Independence Day Celebration', mr: 'स्वातंत्र्य दिन साजरा' },
      description: { en: 'Village celebrates 77th Independence Day with patriotic fervor', mr: 'गावाने ७७ वा स्वातंत्र्य दिन देशभक्तीच्या उत्साहाने साजरा केला' },
      image: 'https://images.unsplash.com/photo-1683633570715-dce2fd5dfe90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBydXJhbCUyMGRldmVsb3BtZW50JTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc1NTQ1NTQ2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'events',
      date: '2024-08-15',
      views: 298,
      likes: 67
    },
    {
      id: 6,
      title: { en: 'Water Harvesting Project', mr: 'जल संधारण प्रकल्प' },
      description: { en: 'Community rainwater harvesting system installation', mr: 'सामुदायिक पावसाळी पाणी संधारण प्रणाली स्थापना' },
      image: 'https://images.unsplash.com/photo-1600792174277-8d734290a61f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2aWxsYWdlJTIwZWR1Y2F0aW9uJTIwc2Nob29sJTIwY2hpbGRyZW58ZW58MXx8fHwxNzU1NDU1NDc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'development',
      date: '2024-04-08',
      views: 212,
      likes: 34
    }
  ];

  const videos = [
    {
      id: 1,
      title: { en: 'Village Development Documentary', mr: 'गाव विकास माहितीपट' },
      description: { en: '10-minute documentary showcasing village transformation', mr: 'गावातील परिवर्तन दाखवणारा १० मिनिटांचा माहितीपट' },
      thumbnail: 'https://images.unsplash.com/photo-1683633570715-dce2fd5dfe90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBydXJhbCUyMGRldmVsb3BtZW50JTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc1NTQ1NTQ2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      duration: '10:23',
      views: 1240,
      date: '2024-07-20'
    },
    {
      id: 2,
      title: { en: 'Ganesh Festival Highlights', mr: 'गणेश उत्सव ठळक' },
      description: { en: 'Best moments from the annual Ganesh festival celebration', mr: 'वार्षिक गणेश उत्सव साजरीकरणातील सर्वोत्तम क्षण' },
      thumbnail: 'https://images.unsplash.com/photo-1745988583865-2249654d864c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2aWxsYWdlJTIwZmVzdGl2YWwlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NTU0NTU0NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      duration: '5:45',
      views: 892,
      date: '2024-08-28'
    },
    {
      id: 3,
      title: { en: 'Digital Literacy Program', mr: 'डिजिटल साक्षरता कार्यक्रम' },
      description: { en: 'Teaching digital skills to village women and elderly', mr: 'गावातील महिला आणि वयोवृद्धांना डिजिटल कौशल्य शिकवणे' },
      thumbnail: 'https://images.unsplash.com/photo-1600792174277-8d734290a61f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2aWxsYWdlJTIwZWR1Y2F0aW9uJTIwc2Nob29sJTIwY2hpbGRyZW58ZW58MXx8fHwxNzU1NDU1NDc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      duration: '7:12',
      views: 567,
      date: '2024-06-15'
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPhotos = selectedCategory === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  return (
    <div className="min-h-screen bg-pink-50 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t({ en: 'Village Media Gallery', mr: 'गाव मीडिया गॅलरी' })}
          </h1>
          <p className="text-gray-600 text-lg">
            {t({ en: 'Discover our village through photos and videos', mr: 'फोटो आणि व्हिडिओद्वारे आमचे गाव शोधा' })}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-xl p-2 shadow-sm border">
            <Button
              variant={activeTab === 'photos' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('photos')}
              className={`gap-2 ${activeTab === 'photos' ? 'bg-pink-600 text-white' : 'text-gray-600'}`}
            >
              <Camera className="h-4 w-4" />
              {t({ en: 'Photos', mr: 'फोटो' })} ({photos.length})
            </Button>
            <Button
              variant={activeTab === 'videos' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('videos')}
              className={`gap-2 ${activeTab === 'videos' ? 'bg-pink-600 text-white' : 'text-gray-600'}`}
            >
              <Video className="h-4 w-4" />
              {t({ en: 'Videos', mr: 'व्हिडिओ' })} ({videos.length})
            </Button>
          </div>
        </div>

        {/* Filters and View Controls */}
        {activeTab === 'photos' && (
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">
            <div className="flex flex-wrap gap-2">
              {mediaCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? 'bg-pink-600 text-white' : ''}
                >
                  {t(category.label)} ({category.count})
                </Button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === 'photos' ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <ImageWithFallback
                    src={photo.image}
                    alt={t(photo.title)}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Badge className="absolute top-3 left-3 bg-pink-600">
                    {t(mediaCategories.find(cat => cat.id === photo.category)?.label || { en: '', mr: '' })}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{t(photo.title)}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{t(photo.description)}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(photo.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {photo.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {photo.likes}
                      </span>
                    </div>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <ImageWithFallback
                    src={video.thumbnail}
                    alt={t(video.title)}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Button size="lg" className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                      <Play className="h-6 w-6 text-white" />
                    </Button>
                  </div>
                  <Badge className="absolute bottom-3 right-3 bg-black/70 text-white">
                    {video.duration}
                  </Badge>
                  <Badge className="absolute top-3 left-3 bg-pink-600">
                    {t({ en: 'Video', mr: 'व्हिडिओ' })}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{t(video.title)}</h3>
                  <p className="text-gray-600 text-sm mb-3">{t(video.description)}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(video.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {video.views}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Upload Section */}
        <Card className="mt-12 bg-pink-100 border-pink-200">
          <CardContent className="p-8 text-center">
            <Camera className="h-12 w-12 text-pink-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-pink-800 mb-2">
              {t({ en: 'Share Your Village Moments', mr: 'आपले गावचे क्षण शेअर करा' })}
            </h3>
            <p className="text-pink-700 mb-4">
              {t({ 
                en: 'Have photos or videos from village events? Share them with the community!',
                mr: 'आपल्याकडे गावातील कार्यक्रमांचे फोटो किंवा व्हिडिओ आहेत? ते समुदायासोबत शेअर करा!'
              })}
            </p>
            <div className="flex gap-3 justify-center">
              <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                <Camera className="h-4 w-4 mr-2" />
                {t({ en: 'Upload Photos', mr: 'फोटो अपलोड करा' })}
              </Button>
              <Button variant="outline" className="border-pink-300 text-pink-700">
                <Video className="h-4 w-4 mr-2" />
                {t({ en: 'Upload Videos', mr: 'व्हिडिओ अपलोड करा' })}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}