"use strict";

var OrderModel = require('../../models/order.model');

module.exports.orders = function _callee(req, res) {
  var orders;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(OrderModel.find({}).populate('userInfo') // nếu userInfo là ObjectId
          .sort({
            createdAt: -1
          }));

        case 3:
          orders = _context.sent;
          res.render("admin/pages/orders/index", {
            title: "Trang quản lý đơn hàng",
            orders: orders
          });
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error("Lỗi khi lấy danh sách đơn hàng:", _context.t0);
          res.status(500).send("Lỗi server");

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};