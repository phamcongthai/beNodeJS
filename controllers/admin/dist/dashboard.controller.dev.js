"use strict";

var ProductsCategoryModel = require('../../models/products-category.model');

var ProductModel = require('../../models/products.model');

var AccountsModel = require('../../models/account.model');

var UserModel = require('../../models/user.model');

module.exports.index = function _callee(req, res) {
  var statistic;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          statistic = {
            categoryProduct: {
              total: 0,
              active: 0,
              inactive: 0
            },
            product: {
              total: 0,
              active: 0,
              inactive: 0
            },
            account: {
              total: 0,
              active: 0,
              inactive: 0
            },
            user: {
              total: 0,
              active: 0,
              inactive: 0
            }
          }; // Category Product

          _context.next = 3;
          return regeneratorRuntime.awrap(ProductsCategoryModel.countDocuments());

        case 3:
          statistic.categoryProduct.total = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(ProductsCategoryModel.countDocuments({
            status: "active"
          }));

        case 6:
          statistic.categoryProduct.active = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(ProductsCategoryModel.countDocuments({
            status: "inactive"
          }));

        case 9:
          statistic.categoryProduct.inactive = _context.sent;
          _context.next = 12;
          return regeneratorRuntime.awrap(ProductModel.countDocuments());

        case 12:
          statistic.product.total = _context.sent;
          _context.next = 15;
          return regeneratorRuntime.awrap(ProductModel.countDocuments({
            status: "active"
          }));

        case 15:
          statistic.product.active = _context.sent;
          _context.next = 18;
          return regeneratorRuntime.awrap(ProductModel.countDocuments({
            status: "inactive"
          }));

        case 18:
          statistic.product.inactive = _context.sent;
          _context.next = 21;
          return regeneratorRuntime.awrap(AccountsModel.countDocuments());

        case 21:
          statistic.account.total = _context.sent;
          _context.next = 24;
          return regeneratorRuntime.awrap(AccountsModel.countDocuments({
            status: "active"
          }));

        case 24:
          statistic.account.active = _context.sent;
          _context.next = 27;
          return regeneratorRuntime.awrap(AccountsModel.countDocuments({
            status: "inactive"
          }));

        case 27:
          statistic.account.inactive = _context.sent;
          _context.next = 30;
          return regeneratorRuntime.awrap(UserModel.countDocuments());

        case 30:
          statistic.user.total = _context.sent;
          _context.next = 33;
          return regeneratorRuntime.awrap(UserModel.countDocuments({
            status: "active"
          }));

        case 33:
          statistic.user.active = _context.sent;
          _context.next = 36;
          return regeneratorRuntime.awrap(UserModel.countDocuments({
            status: "inactive"
          }));

        case 36:
          statistic.user.inactive = _context.sent;
          res.render('admin/pages/dashboard/index', {
            title: "Trang tổng quan",
            statistic: statistic
          });

        case 38:
        case "end":
          return _context.stop();
      }
    }
  });
};