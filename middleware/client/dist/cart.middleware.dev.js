"use strict";

var CartModel = require('../../models/cart.model');

var OrderModel = require('../../models/cart.model');

var ProductsModel = require('../../models/products.model');

module.exports.cart = function _callee(req, res, next) {
  var cartId, cart, total;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          cartId = req.cookies.cartId;

          if (cartId) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", next());

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(CartModel.findById(cartId));

        case 5:
          cart = _context.sent;

          if (cart) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", next());

        case 8:
          total = cart.products.reduce(function (sum, item) {
            return sum + item.quantity;
          }, 0);
          res.locals.total = total;
          res.locals.miniCart = cart;
          next();

        case 12:
        case "end":
          return _context.stop();
      }
    }
  });
};