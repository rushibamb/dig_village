import api from './api';

/**
 * Upload image to Cloudinary via server
 * @param {File} file - Image file to upload
 * @param {string} folder - Cloudinary folder (optional)
 * @returns {Promise} API response with image URL and details
 */
export const uploadImageToCloudinary = async (file, folder = 'village-portal/villagers') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await api.post('/upload/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise} API response
 */
export const deleteImageFromCloudinary = async (publicId) => {
  try {
    const response = await api.delete(`/upload/delete/${publicId}`);
    return response.data;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * Upload villager ID proof photo
 * @param {File} file - Image file
 * @returns {Promise} API response with image URL
 */
export const uploadVillagerPhoto = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'village-portal/villagers/id-proofs');

    const response = await api.post('/upload/villager-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Villager photo upload error:', error);
    throw error.response?.data || error.message;
  }
};

export default {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  uploadVillagerPhoto
};
