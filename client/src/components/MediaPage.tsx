import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from './LanguageProvider';
import { getPublicMedia, getPublicCategories, incrementMediaViews } from '../services/mediaService';
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
  MoreHorizontal,
  X,
  ExternalLink
} from 'lucide-react';

export function MediaPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('photos');
  const [viewMode, setViewMode] = useState('grid');
  const [mediaCategories, setMediaCategories] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesRes = await getPublicCategories();
        setMediaCategories(categoriesRes.data);
        
        // Fetch photos
        const photosRes = await getPublicMedia({ mediaType: 'Photo' });
        setPhotos(photosRes.data);
        
        // Fetch videos
        const videosRes = await getPublicMedia({ mediaType: 'Video' });
        setVideos(videosRes.data);
        
      } catch (error) {
        console.error('Failed to fetch media data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Dynamic filtering based on selected category
  useEffect(() => {
    const fetchFilteredData = async () => {
      if (selectedCategory === 'all') {
        // If "all" is selected, fetch all media of the current type
        try {
          const mediaType = activeTab === 'photos' ? 'Photo' : 'Video';
          const response = await getPublicMedia({ mediaType });
          
          if (activeTab === 'photos') {
            setPhotos(response.data);
          } else {
            setVideos(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch filtered media:', error);
        }
      } else {
        // If a specific category is selected, fetch media filtered by category
        try {
          const mediaType = activeTab === 'photos' ? 'Photo' : 'Video';
          const response = await getPublicMedia({ 
            mediaType, 
            category: selectedCategory 
          });
          
          if (activeTab === 'photos') {
            setPhotos(response.data);
          } else {
            setVideos(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch filtered media:', error);
        }
      }
    };

    fetchFilteredData();
  }, [selectedCategory, activeTab]);

  // Handle media item click to open modal
  const handleMediaClick = async (mediaItem) => {
    console.log('Opening media item:', mediaItem);
    console.log('Media URL:', mediaItem.fileUrl);
    console.log('Media Type:', mediaItem.mediaType);
    
    setSelectedMedia(mediaItem);
    setIsModalOpen(true);
    setImageLoading(true);
    setImageError(false);
    
    // Increment view count
    try {
      await incrementMediaViews(mediaItem._id);
      // Update local state to reflect the new view count
      if (activeTab === 'photos') {
        setPhotos(prev => prev.map(item => 
          item._id === mediaItem._id 
            ? { ...item, views: item.views + 1 }
            : item
        ));
      } else {
        setVideos(prev => prev.map(item => 
          item._id === mediaItem._id 
            ? { ...item, views: item.views + 1 }
            : item
        ));
      }
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
  };

  // Handle download
  const handleDownload = async (mediaItem) => {
    try {
      console.log('Starting download for:', mediaItem.fileUrl);
      
      // For Unsplash URLs, we need to handle them differently
      if (mediaItem.fileUrl.includes('unsplash.com')) {
        // Open in new tab for Unsplash images (they have CORS restrictions)
        window.open(mediaItem.fileUrl, '_blank');
        return;
      }
      
      const response = await fetch(mediaItem.fileUrl, {
        mode: 'cors',
        headers: {
          'Accept': 'image/*,video/*'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      console.log('Blob created:', blob.type, blob.size);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Determine file extension
      let extension = 'jpg';
      if (mediaItem.mediaType === 'Video') {
        extension = 'mp4';
      } else if (blob.type.includes('png')) {
        extension = 'png';
      } else if (blob.type.includes('gif')) {
        extension = 'gif';
      }
      
      link.download = `${mediaItem.title.en || 'media'}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('Download completed successfully');
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      console.log('Opening in new tab as fallback');
      window.open(mediaItem.fileUrl, '_blank');
    }
  };

  // Handle share
  const handleShare = async (mediaItem) => {
    const shareData = {
      title: mediaItem.title.en,
      text: mediaItem.description?.en || '',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Clipboard copy failed:', clipboardError);
      }
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
    setImageLoading(false);
    setImageError(false);
  };

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
              {/* All Media Button */}
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' ? 'bg-pink-600 text-white' : ''}
              >
                {t({ en: 'All Media', mr: 'सर्व मीडिया' })}
              </Button>
              
              {/* Category Buttons */}
              {mediaCategories.map((category) => (
                <Button
                  key={category._id}
                  variant={selectedCategory === category._id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category._id)}
                  className={selectedCategory === category._id ? 'bg-pink-600 text-white' : ''}
                >
                  {t(category.name)} ({category.mediaCount || 0})
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
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading media...</div>
          </div>
        ) : activeTab === 'photos' ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {photos.map((photo) => (
              <Card key={photo._id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer" onClick={() => handleMediaClick(photo)}>
                <div className="relative">
                  <ImageWithFallback
                    src={photo.fileUrl || 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop'}
                    alt={t(photo.title)}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(photo);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(photo);
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Badge className="absolute top-3 left-3 bg-pink-600">
                    {photo.category?.name?.en || 'Uncategorized'}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{t(photo.title)}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{t(photo.description)}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(photo.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {photo.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {photo.likes || 0}
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
              <Card key={video._id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer" onClick={() => handleMediaClick(video)}>
                <div className="relative">
                  <ImageWithFallback
                    src={video.thumbnailUrl || video.fileUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop'}
                    alt={t(video.title)}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Button size="lg" className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                      <Play className="h-6 w-6 text-white" />
                    </Button>
                  </div>
                  {video.duration && (
                  <Badge className="absolute bottom-3 right-3 bg-black/70 text-white">
                    {video.duration}
                  </Badge>
                  )}
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
                        {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {video.views || 0}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(video);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(video);
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>

      {/* Media View Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">
                {selectedMedia && t(selectedMedia.title)}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {selectedMedia && t(selectedMedia.description)}
            </p>
          </DialogHeader>
          
          {selectedMedia && (
            <div className="flex flex-col lg:flex-row">
              {/* Media Display */}
              <div className="flex-1 bg-black flex items-center justify-center min-h-[400px] lg:min-h-[500px] p-4">
                {imageLoading && !imageError && (
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Loading image...</p>
                  </div>
                )}
                
                {imageError && (
                  <div className="text-white text-center">
                    <p className="text-red-400 mb-4">Failed to load image</p>
                    <Button 
                      onClick={() => {
                        setImageError(false);
                        setImageLoading(true);
                        // Force reload by updating the src
                        const img = document.querySelector('.modal-image');
                        if (img) {
                          img.src = selectedMedia.fileUrl + '?t=' + Date.now();
                        }
                      }}
                      variant="outline"
                      className="text-white border-white hover:bg-white hover:text-black"
                    >
                      Retry
                    </Button>
                  </div>
                )}
                
                {!imageLoading && !imageError && selectedMedia.mediaType === 'Photo' && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      className="modal-image max-w-full max-h-full object-contain"
                      src={selectedMedia.fileUrl}
                      alt={t(selectedMedia.title)}
                      onLoad={() => {
                        console.log('Image loaded successfully');
                        setImageLoading(false);
                        setImageError(false);
                      }}
                      onError={(e) => {
                        console.error('Image load error:', e);
                        console.log('Failed URL:', selectedMedia.fileUrl);
                        setImageLoading(false);
                        setImageError(true);
                      }}
                    />
                  </div>
                )}
                
                {!imageLoading && !imageError && selectedMedia.mediaType === 'Video' && (
                  <video
                    src={selectedMedia.fileUrl}
                    controls
                    className="max-w-full max-h-full"
                    autoPlay
                    onError={(e) => {
                      console.error('Video load error:', e);
                      setImageLoading(false);
                      setImageError(true);
                    }}
                    onLoadedData={() => {
                      setImageLoading(false);
                      setImageError(false);
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              
              {/* Media Details */}
              <div className="w-full lg:w-80 p-6 bg-white border-l">
                <div className="space-y-4">
                  {/* Title and Description */}
                  <div>
                    <h3 className="font-bold text-lg mb-2">{t(selectedMedia.title)}</h3>
                    {selectedMedia.description && (
                      <p className="text-gray-600 text-sm">{t(selectedMedia.description)}</p>
                    )}
                  </div>
                  
                  {/* Category */}
                  {selectedMedia.category && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Category:</span>
                      <Badge className="ml-2 bg-pink-600">
                        {selectedMedia.category.name?.en || 'Uncategorized'}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Tags */}
                  {selectedMedia.tags && selectedMedia.tags.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedMedia.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedMedia.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {selectedMedia.views || 0} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {selectedMedia.likes || 0} likes
                    </span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      onClick={() => handleDownload(selectedMedia)}
                      className="flex-1"
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={() => handleShare(selectedMedia)}
                      className="flex-1"
                      variant="outline"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      onClick={() => window.open(selectedMedia.fileUrl, '_blank')}
                      variant="outline"
                      size="sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
      </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}