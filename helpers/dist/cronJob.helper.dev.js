"use strict";

var cron = require('node-cron');

var OrderModel = require('../models/order.model');

module.exports.cronCheckCompleted = function () {
  cron.schedule('* * * * *', function _callee() {
    var orders, now, twoDays, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, order, deliveredAt;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('⏰ Cron job kiểm tra đơn hàng đã giao (test 2 ngày)...');
            _context.prev = 1;
            _context.next = 4;
            return regeneratorRuntime.awrap(OrderModel.find({
              status: 'delivered'
            }));

          case 4:
            orders = _context.sent;
            now = new Date();
            twoDays = 48 * 60 * 60 * 1000; // 2 ngày

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 10;
            _iterator = orders[Symbol.iterator]();

          case 12:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 26;
              break;
            }

            order = _step.value;

            if (order.deliveredAt) {
              _context.next = 16;
              break;
            }

            return _context.abrupt("continue", 23);

          case 16:
            deliveredAt = new Date(order.deliveredAt);

            if (!(now - deliveredAt >= twoDays)) {
              _context.next = 23;
              break;
            }

            order.status = 'completed';
            order.completedAt = now;
            _context.next = 22;
            return regeneratorRuntime.awrap(order.save());

          case 22:
            console.log("\u2705 \u0110\u01A1n h\xE0ng ".concat(order._id, " \u0111\xE3 t\u1EF1 chuy\u1EC3n sang 'completed' sau 2 ng\xE0y"));

          case 23:
            _iteratorNormalCompletion = true;
            _context.next = 12;
            break;

          case 26:
            _context.next = 32;
            break;

          case 28:
            _context.prev = 28;
            _context.t0 = _context["catch"](10);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 32:
            _context.prev = 32;
            _context.prev = 33;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 35:
            _context.prev = 35;

            if (!_didIteratorError) {
              _context.next = 38;
              break;
            }

            throw _iteratorError;

          case 38:
            return _context.finish(35);

          case 39:
            return _context.finish(32);

          case 40:
            _context.next = 45;
            break;

          case 42:
            _context.prev = 42;
            _context.t1 = _context["catch"](1);
            console.error('❌ Lỗi khi cập nhật trạng thái đơn hàng:', _context.t1);

          case 45:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 42], [10, 28, 32, 40], [33,, 35, 39]]);
  });
};