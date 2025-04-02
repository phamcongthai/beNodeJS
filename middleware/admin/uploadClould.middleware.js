const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
cloudinary.config({ //Cấu hình cloud để lưu ảnh
  cloud_name: 'dosrupfpz',
  api_key: '439722841751938',
  api_secret: 'LM85i4gttGC8synDzNQUHk8DyLQ' // Click 'View API Keys' above to copy your API secret
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
          console.log(result);
          req.body[req.file.fieldname] = result.url;
          next();
          }
    
        }
    
        upload(req);
}
