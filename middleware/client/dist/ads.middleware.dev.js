"use strict";

var AdsModel = require('../../models/ads.model');

var ProductModel = require('../../models/products.model');

module.exports.adsMiddleware = function _callee2(req, res, next) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(function _callee() {
            var now, ads, featuredProducts, tagsSet, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, product, tags;

            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    now = new Date(); // Lấy quảng cáo đang hoạt động

                    _context.next = 3;
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

                  case 3:
                    ads = _context.sent;
                    _context.next = 6;
                    return regeneratorRuntime.awrap(ProductModel.find({
                      isFeatured: true,
                      status: "active",
                      deleted: false
                    }).select('tags'));

                  case 6:
                    featuredProducts = _context.sent;
                    // Tạo mảng tags duy nhất
                    tagsSet = new Set();
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context.prev = 11;

                    for (_iterator = featuredProducts[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      product = _step.value;

                      if (Array.isArray(product.tags)) {
                        product.tags.forEach(function (tag) {
                          return tagsSet.add(tag);
                        });
                      }
                    }

                    _context.next = 19;
                    break;

                  case 15:
                    _context.prev = 15;
                    _context.t0 = _context["catch"](11);
                    _didIteratorError = true;
                    _iteratorError = _context.t0;

                  case 19:
                    _context.prev = 19;
                    _context.prev = 20;

                    if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                      _iterator["return"]();
                    }

                  case 22:
                    _context.prev = 22;

                    if (!_didIteratorError) {
                      _context.next = 25;
                      break;
                    }

                    throw _iteratorError;

                  case 25:
                    return _context.finish(22);

                  case 26:
                    return _context.finish(19);

                  case 27:
                    tags = Array.from(tagsSet); // Gán vào res.locals

                    res.locals.ads = ads;
                    res.locals.tags = tags;
                    next();

                  case 31:
                  case "end":
                    return _context.stop();
                }
              }
            }, null, null, [[11, 15, 19, 27], [20,, 22, 26]]);
          }());

        case 3:
          _context2.next = 9;
          break;

        case 5:
          _context2.prev = 5;
          _context2.t0 = _context2["catch"](0);
          console.error('Error in adsMiddleware:', _context2.t0);
          next(_context2.t0);

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 5]]);
};