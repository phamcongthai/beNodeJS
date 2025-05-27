"use strict";

var AdsModel = require('../../models/ads.model');

module.exports.adsMiddleware = function _callee(req, res, next) {
  var now, ads;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          now = new Date();
          _context.next = 4;
          return regeneratorRuntime.awrap(AdsModel.find({
            startDate: {
              $lte: now
            },
            endDate: {
              $gte: now
            },
            status: "active",
            deleted: false
          }));

        case 4:
          ads = _context.sent;
          res.locals.ads = ads;
          next();
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error('Error loading ads:', _context.t0);
          next(_context.t0); // hoặc next(new Error('...')) nếu muốn custom lỗi

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};