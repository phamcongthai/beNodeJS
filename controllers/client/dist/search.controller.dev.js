"use strict";

var searchHelper = require('../../helpers/search');

var ProductsModel = require('../../models/products.model');

module.exports.search = function _callee(req, res) {
  var keyword, searchRegex, productData;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          keyword = req.query.keyword;

          if (!(!keyword || keyword.trim() === "")) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.redirect('back'));

        case 3:
          // Tạo regex từ keyword (giống searchHelper)
          searchRegex = searchHelper.search(keyword);
          _context.next = 6;
          return regeneratorRuntime.awrap(ProductsModel.find({
            deleted: false,
            status: "active",
            $or: [{
              title: searchRegex
            }, {
              tags: searchRegex
            } // tags là mảng, dùng regex để kiểm tra từng phần tử
            ]
          }));

        case 6:
          productData = _context.sent;
          res.render("client/pages/search/index", {
            title: "Kết quả tìm kiếm cho: " + keyword,
            productData: productData,
            keyword: keyword
          });

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
};