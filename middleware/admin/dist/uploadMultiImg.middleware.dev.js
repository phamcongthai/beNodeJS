"use strict";

var cloudinary = require('cloudinary').v2;

var streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

module.exports.uploadMultipleToCloud = function _callee(req, res, next) {
  var streamUpload, uploadResults, fieldname;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Upload 1 file buffer lên Cloudinary, trả về Promise
          streamUpload = function streamUpload(fileBuffer) {
            return new Promise(function (resolve, reject) {
              var stream = cloudinary.uploader.upload_stream(function (error, result) {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              });
              streamifier.createReadStream(fileBuffer).pipe(stream);
            });
          };

          _context.prev = 1;

          if (!(!req.files || !Array.isArray(req.files) || req.files.length === 0)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", next());

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(Promise.all(req.files.map(function (file) {
            return streamUpload(file.buffer);
          })));

        case 6:
          uploadResults = _context.sent;
          fieldname = req.files[0].fieldname; // Lưu mảng URL ảnh vào req.body[fieldname]

          req.body[fieldname] = uploadResults.map(function (result) {
            return result.secure_url || result.url;
          });
          next();
          _context.next = 15;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](1);
          next(_context.t0);

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 12]]);
};