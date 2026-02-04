const cloudinary = require('../lib/cloudinary');

/**
 * Uploads a file buffer to Cloudinary
 * @param {Buffer} buffer
 * @param {string} folder
 * @returns {Promise<string>} secure_url
 */

function uploadToCloudinary(buffer, folder = 'suvidha/complaints') {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 1024, height: 1024, crop: 'limit' },
            { quality: 'auto' },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}

module.exports = { uploadToCloudinary };
