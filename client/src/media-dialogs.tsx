      {/* Media Detail Dialog */}
      <Dialog open={isMediaDetailOpen} onOpenChange={setIsMediaDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t({ en: 'Media Details', mr: 'मीडिया तपशील' })}</DialogTitle>
          </DialogHeader>

          {selectedMedia && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="aspect-video relative overflow-hidden rounded-lg">
                    <img 
                      src={selectedMedia.url} 
                      alt={selectedMedia.title.en}
                      className="w-full h-full object-cover"
                    />
                    {selectedMedia.type === 'video' && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="font-semibold">{t({ en: 'Title', mr: 'शीर्षक' })}</Label>
                    <p className="font-medium">{selectedMedia.title.en}</p>
                    <p className="text-sm text-gray-600">{selectedMedia.title.mr}</p>
                  </div>
                  
                  <div>
                    <Label className="font-semibold">{t({ en: 'Description', mr: 'वर्णन' })}</Label>
                    <p className="text-sm">{selectedMedia.description.en}</p>
                    <p className="text-sm text-gray-600">{selectedMedia.description.mr}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">{t({ en: 'Type', mr: 'प्रकार' })}</Label>
                      <Badge className={selectedMedia.type === 'photo' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'}>
                        {selectedMedia.type === 'photo' ? (
                          <Camera className="h-3 w-3 mr-1" />
                        ) : (
                          <Video className="h-3 w-3 mr-1" />
                        )}
                        {selectedMedia.type}
                      </Badge>
                    </div>
                    <div>
                      <Label className="font-semibold">{t({ en: 'Category', mr: 'श्रेणी' })}</Label>
                      <p>{t(mediaCategories.find(cat => cat.id === selectedMedia.category)?.label || { en: '', mr: '' })}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">{t({ en: 'Date', mr: 'तारीख' })}</Label>
                      <p>{selectedMedia.date}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">{t({ en: 'Upload Date', mr: 'अपलोड तारीख' })}</Label>
                      <p>{selectedMedia.uploadDate}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">{t({ en: 'Views', mr: 'दृश्ये' })}</Label>
                      <p>{selectedMedia.views}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">{t({ en: 'Likes', mr: 'लाईक' })}</Label>
                      <p>{selectedMedia.likes}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">{t({ en: 'File Size', mr: 'फाइल साइज' })}</Label>
                      <p>{selectedMedia.fileSize}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">{t({ en: 'Uploaded By', mr: 'अपलोड केले' })}</Label>
                      <p>{selectedMedia.uploadedBy}</p>
                    </div>
                  </div>

                  {selectedMedia.tags && selectedMedia.tags.length > 0 && (
                    <div>
                      <Label className="font-semibold">{t({ en: 'Tags', mr: 'टॅग' })}</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedMedia.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Label className="font-semibold">{t({ en: 'Status', mr: 'स्थिती' })}</Label>
                    <Badge className={selectedMedia.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                      {selectedMedia.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {selectedMedia.isFeatured && (
                      <Badge className="bg-orange-500 text-white">Featured</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsMediaDetailOpen(false)}>
              {t({ en: 'Close', mr: 'बंद करा' })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Media Dialog */}
      <Dialog open={isAddMediaOpen} onOpenChange={setIsAddMediaOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t({ en: 'Add New Media', mr: 'नवीन मीडिया जोडा' })}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>{t({ en: 'Media Type', mr: 'मीडिया प्रकार' })} *</Label>
              <Select value={newMediaItem.type} onValueChange={(value) => setNewMediaItem({ ...newMediaItem, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photo">{t({ en: 'Photo', mr: 'फोटो' })}</SelectItem>
                  <SelectItem value="video">{t({ en: 'Video', mr: 'व्हिडिओ' })}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>{t({ en: 'Title (English)', mr: 'शीर्षक (इंग्रजी)' })} *</Label>
                <Input
                  value={newMediaItem.title.en}
                  onChange={(e) => setNewMediaItem({ ...newMediaItem, title: { ...newMediaItem.title, en: e.target.value } })}
                  placeholder="Enter title in English"
                />
              </div>
              <div>
                <Label>{t({ en: 'Title (Marathi)', mr: 'शीर्षक (मराठी)' })}</Label>
                <Input
                  value={newMediaItem.title.mr}
                  onChange={(e) => setNewMediaItem({ ...newMediaItem, title: { ...newMediaItem.title, mr: e.target.value } })}
                  placeholder="मराठीत शीर्षक टाका"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>{t({ en: 'Description (English)', mr: 'वर्णन (इंग्रजी)' })}</Label>
                <Textarea
                  value={newMediaItem.description.en}
                  onChange={(e) => setNewMediaItem({ ...newMediaItem, description: { ...newMediaItem.description, en: e.target.value } })}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
              <div>
                <Label>{t({ en: 'Description (Marathi)', mr: 'वर्णन (मराठी)' })}</Label>
                <Textarea
                  value={newMediaItem.description.mr}
                  onChange={(e) => setNewMediaItem({ ...newMediaItem, description: { ...newMediaItem.description, mr: e.target.value } })}
                  placeholder="वर्णन टाका"
                  rows={3}
                />
              </div>
            </div>

            <div>
              <Label>{t({ en: 'Category', mr: 'श्रेणी' })} *</Label>
              <Select value={newMediaItem.category} onValueChange={(value) => setNewMediaItem({ ...newMediaItem, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {mediaCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {t(category.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t({ en: 'Tags', mr: 'टॅग' })}</Label>
              <Input
                placeholder="Enter tags separated by commas"
                onChange={(e) => setNewMediaItem({ ...newMediaItem, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) })}
              />
            </div>

            <div>
              <Label>{t({ en: 'Upload File', mr: 'फाइल अपलोड करा' })} *</Label>
              <Input
                type="file"
                accept={newMediaItem.type === 'photo' ? 'image/*' : 'video/*'}
                onChange={(e) => setNewMediaItem({ ...newMediaItem, file: e.target.files?.[0] || null })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={newMediaItem.isFeatured}
                onChange={(e) => setNewMediaItem({ ...newMediaItem, isFeatured: e.target.checked })}
              />
              <Label htmlFor="featured">{t({ en: 'Mark as Featured', mr: 'फीचर्ड म्हणून चिन्हांकित करा' })}</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsAddMediaOpen(false)}>
              {t({ en: 'Cancel', mr: 'रद्द करा' })}
            </Button>
            <Button onClick={handleAddMedia} className="bg-media hover:bg-media/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              {t({ en: 'Add Media', mr: 'मीडिया जोडा' })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category Management Dialog */}
      <Dialog open={isCategoryManagementOpen} onOpenChange={setIsCategoryManagementOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{t({ en: 'Category Management', mr: 'श्रेणी व्यवस्थापन' })}</DialogTitle>
              <Button onClick={() => setIsAddCategoryOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                {t({ en: 'Add Category', mr: 'श्रेणी जोडा' })}
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {mediaCategories.map((category) => (
              <Card key={category.id} className="border-0 shadow-lg glass-effect">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{category.label.en}</h3>
                      <p className="text-gray-600">{category.label.mr}</p>
                      <p className="text-sm text-gray-500">{category.count} items</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t({ en: 'Add New Category', mr: 'नवीन श्रेणी जोडा' })}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>{t({ en: 'Category Name (English)', mr: 'श्रेणीचे नाव (इंग्रजी)' })} *</Label>
              <Input
                value={newMediaCategory.label.en}
                onChange={(e) => setNewMediaCategory({ label: { ...newMediaCategory.label, en: e.target.value } })}
                placeholder="Enter category name"
              />
            </div>
            
            <div>
              <Label>{t({ en: 'Category Name (Marathi)', mr: 'श्रेणीचे नाव (मराठी)' })}</Label>
              <Input
                value={newMediaCategory.label.mr}
                onChange={(e) => setNewMediaCategory({ label: { ...newMediaCategory.label, mr: e.target.value } })}
                placeholder="श्रेणीचे नाव टाका"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
              {t({ en: 'Cancel', mr: 'रद्द करा' })}
            </Button>
            <Button onClick={handleAddCategory} className="bg-blue-500 hover:bg-blue-600 text-white">
              <Save className="h-4 w-4 mr-2" />
              {t({ en: 'Add Category', mr: 'श्रेणी जोडा' })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>