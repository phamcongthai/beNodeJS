"use strict";

var CartModel = require('../../models/cart.model');

var UserModel = require('../../models/user.model');

module.exports.cart = function _callee(req, res, next) {
  var cartId, cart, token, user, total;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          cartId = req.cookies.cartId;
          cart = null;
          token = req.cookies.token_user;
          user = null;

          if (!token) {
            _context.next = 8;
            break;
          }

          _context.next = 7;
          return regeneratorRuntime.awrap(UserModel.findOne({
            token_user: token
          }));

        case 7:
          user = _context.sent;

        case 8:
          if (!cartId) {
            _context.next = 12;
            break;
          }

          _context.next = 11;
          return regeneratorRuntime.awrap(CartModel.findById(cartId));

        case 11:
          cart = _context.sent;

        case 12:
          if (!(!cart && user)) {
            _context.next = 16;
            break;
          }

          _context.next = 15;
          return regeneratorRuntime.awrap(CartModel.findOne({
            user_id: user._id
          }));

        case 15:
          cart = _context.sent;

        case 16:
          if (!(!cart && user)) {
            _context.next = 20;
            break;
          }

          cart = new CartModel({
            user_id: user._id,
            products: []
          });
          _context.next = 20;
          return regeneratorRuntime.awrap(cart.save());

        case 20:
          // Nếu có cart (đã tìm được hoặc tạo mới), cập nhật cookie nếu cần
          if (cart) {
            if (!cartId || cartId !== cart._id.toString()) {
              res.cookie("cartId", cart._id.toString(), {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
              });
            } // Gửi thông tin cart ra frontend


            total = cart.products.reduce(function (sum, item) {
              return sum + item.quantity;
            }, 0);
            res.locals.total = total;
            res.locals.miniCart = cart;
          } else {
            // Nếu không có cart, gán mặc định
            res.locals.total = 0;
            res.locals.miniCart = {
              products: []
            }; // ❗️Xóa luôn cookie cartId nếu chưa đăng nhập

            if (cartId) {
              res.clearCookie("cartId");
            }
          }

          next();

        case 22:
        case "end":
          return _context.stop();
      }
    }
  });
};