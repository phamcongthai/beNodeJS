const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

module.exports.uploadMultipleToCloud = async (req, res, next) => {
  // Upload 1 file buffer lên Cloudinary, trả về Promise
  const streamUpload = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
      streamifier.createReadStream(fileBuffer).pipe(stream);
    });
  };

  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return next();
    }

    const uploadResults = await Promise.all(
      req.files.map(file => streamUpload(file.buffer))
    );

    const fieldname = req.files[0].fieldname;
    // Lưu mảng URL ảnh vào req.body[fieldname]
    req.body[fieldname] = uploadResults.map(result => result.secure_url || result.url);

    next();
  } catch (error) {
    next(error);
  }
};
