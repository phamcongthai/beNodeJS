"use strict";

var CartModel = require('../../models/cart.model');

var OrderModel = require('../../models/cart.model');

var ProductsModel = require('../../models/products.model');

module.exports.cart = function _callee(req, res, next) {
  var newCart, cart, total;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.cookies.cartId) {
            _context.next = 7;
            break;
          }

          newCart = new CartModel();
          _context.next = 4;
          return regeneratorRuntime.awrap(newCart.save());

        case 4:
          res.cookie("cartId", newCart._id, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
          });
          _context.next = 14;
          break;

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(CartModel.findOne({
            _id: req.cookies.cartId
          }));

        case 9:
          cart = _context.sent;
          console.log(cart);
          total = cart.products.reduce(function (sum, item) {
            return sum + item.quantity;
          }, 0);
          res.locals.total = total;
          res.locals.miniCart = cart;

        case 14:
          next();

        case 15:
        case "end":
          return _context.stop();
      }
    }
  });
};