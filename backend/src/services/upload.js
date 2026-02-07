const cloudinary = require('../lib/cloudinary');

/**
 * Uploads a file buffer to Cloudinary
 * @param {Buffer} buffer
 * @param {string} folder
 * @param {string} resourceType - 'image' or 'raw' (for PDFs)
 * @returns {Promise<string>} secure_url
 */

function uploadToCloudinary(buffer, folder = 'suvidha/complaints', resourceType = 'image') {
  return new Promise((resolve, reject) => {
    const options = {
      folder,
      resource_type: resourceType,
    };

    // Only apply transformations for images
    if (resourceType === 'image') {
      options.transformation = [
        { width: 1024, height: 1024, crop: 'limit' },
        { quality: 'auto' },
      ];
    }

    cloudinary.uploader
      .upload_stream(
        options,
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}

module.exports = { uploadToCloudinary };
