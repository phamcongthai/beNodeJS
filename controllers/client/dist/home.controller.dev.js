"use strict";

var ProductsModel = require('../../models/products.model'); // [GET] : /


module.exports.index = function _callee(req, res) {
  var FeaturedProducts, NewProducts, DisProducts;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(ProductsModel.find({
            deleted: false,
            status: "active",
            isFeatured: true
          }).limit(10));

        case 3:
          FeaturedProducts = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(ProductsModel.find({
            deleted: false,
            status: "active"
          }).sort({
            position: -1
          }).limit(10));

        case 6:
          NewProducts = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(ProductsModel.find({
            deleted: false,
            status: "active"
          }).sort({
            discountPercentage: -1
          }).limit(10));

        case 9:
          DisProducts = _context.sent;
          res.render('client/pages/home/index', {
            pageTitle: 'Trang chủ',
            FeaturedProducts: FeaturedProducts,
            NewProducts: NewProducts,
            DisProducts: DisProducts
          });
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.error('Lỗi lấy danh mục:', _context.t0);
          res.status(500).send('Lỗi máy chủ');

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};