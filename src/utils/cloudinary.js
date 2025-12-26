const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier'); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary using streams.
 * @param {Object} file - The file object from Multer (contains .buffer)
 * @param {String} folder - The folder in Cloudinary
 */
const uploadToCloudinary = (file, folder = 'guest-guard') => {
    return new Promise((resolve, reject) => {
        // create a stream that uploads to Cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'auto',
            },
            (error, result) => {
                if (error) return reject(error);
                resolve({
                    public_id: result.public_id,
                    url: result.secure_url,
                    fieldname: file.fieldname // for knowing which is which 
                });
            }
        );
        // Pipe the buffer (file data) into the upload stream
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
};

// Keep existing exports if you use them elsewhere, but add the new helper
const configureCloudinary = () => {
};

module.exports = { cloudinary, uploadToCloudinary, configureCloudinary };