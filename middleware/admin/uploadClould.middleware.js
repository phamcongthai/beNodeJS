const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
cloudinary.config({ //Cấu hình cloud để lưu ảnh
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY ,
  api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
});
module.exports.uploadToClould = async (req, res, next) => {
        let streamUpload = (req) => {
          return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );
    
            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
        };
    
        async function upload(req) {
          if(!req.file){
            return next();
          }else{
            
            
            let result = await streamUpload(req); //Trả ra 1 result có thông tin của url
          req.body[req.file.fieldname] = result.url;
          next();
          }
    
        }
    
        upload(req);
}
