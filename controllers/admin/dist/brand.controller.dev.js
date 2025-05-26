"use strict";

var BrandModel = require('../../models/brand.model'); //[GET] : Trang thương hiệu :


module.exports.brand = function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          res.render('admin/pages/brand/index', {
            title: "Trang quản lý thương hiệu"
          });

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};