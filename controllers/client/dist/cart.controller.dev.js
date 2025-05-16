"use strict";

var CartModel = require('../../models/cart.model');

var ProductModel = require('../../models/products.model'); //[GET] : Trang giỏ hàng :


module.exports.cart = function _callee(req, res) {
  var cartId, cart, products, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, product;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          cartId = req.cookies.cartId;
          _context.next = 3;
          return regeneratorRuntime.awrap(CartModel.findById(cartId));

        case 3:
          cart = _context.sent;
          products = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 8;
          _iterator = cart.products[Symbol.iterator]();

        case 10:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 19;
            break;
          }

          item = _step.value;
          _context.next = 14;
          return regeneratorRuntime.awrap(ProductModel.findOne({
            _id: item.products_id
          }));

        case 14:
          product = _context.sent;

          if (product) {
            product.quantity = item.quantity;
            products.push(product);
          }

        case 16:
          _iteratorNormalCompletion = true;
          _context.next = 10;
          break;

        case 19:
          _context.next = 25;
          break;

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](8);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 25:
          _context.prev = 25;
          _context.prev = 26;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 28:
          _context.prev = 28;

          if (!_didIteratorError) {
            _context.next = 31;
            break;
          }

          throw _iteratorError;

        case 31:
          return _context.finish(28);

        case 32:
          return _context.finish(25);

        case 33:
          res.render("client/pages/cart/index", {
            title: "Trang giỏ hàng",
            products: products
          });

        case 34:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[8, 21, 25, 33], [26,, 28, 32]]);
}; //[POST] : Thêm vào giỏ hàng


module.exports.addCart = function _callee2(req, res) {
  var productId, quantity, cartId, cart, existingProduct;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          productId = req.params.id;
          quantity = parseInt(req.body.quantity, 10);
          cartId = req.cookies.cartId;

          if (cartId) {
            _context2.next = 7;
            break;
          }

          req.flash('error', 'Không tìm thấy giỏ hàng!');
          return _context2.abrupt("return", res.redirect('back'));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(CartModel.findById(cartId));

        case 9:
          cart = _context2.sent;

          if (cart) {
            _context2.next = 13;
            break;
          }

          req.flash('error', 'Giỏ hàng không tồn tại!');
          return _context2.abrupt("return", res.redirect('back'));

        case 13:
          existingProduct = cart.products.find(function (p) {
            return p.products_id == productId;
          });

          if (existingProduct) {
            existingProduct.quantity += quantity;
          } else {
            cart.products.push({
              products_id: productId,
              quantity: quantity
            });
          }

          _context2.next = 17;
          return regeneratorRuntime.awrap(cart.save());

        case 17:
          req.flash('success', "Đã thêm vào giỏ hàng!");
          res.redirect('back');
          _context2.next = 26;
          break;

        case 21:
          _context2.prev = 21;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          req.flash('error', 'Đã có lỗi xảy ra!');
          res.redirect('back');

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 21]]);
}; //[GET] : Xóa sản phẩm khỏi giỏ hàng :


module.exports.deleteProducts = function _callee3(req, res) {
  var productId, cartId;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          productId = req.params.id;
          cartId = req.cookies.cartId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(CartModel.updateOne({
            _id: cartId
          }, {
            $pull: {
              products: {
                products_id: productId
              }
            }
          }));

        case 4:
          req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng !");
          res.redirect("back");

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
}; //[GET] : Cập nhật sản phẩm :


module.exports.updateProducts = function _callee4(req, res) {
  var quantity, productId, cartId;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          quantity = req.params.quantity;
          productId = req.params.productId;
          cartId = req.cookies.cartId;
          _context4.next = 5;
          return regeneratorRuntime.awrap(CartModel.updateOne({
            _id: cartId,
            "products.products_id": productId
          }, {
            $set: {
              "products.$.quantity": quantity
            }
          }));

        case 5:
          req.flash("success", "Cập nhật số lượng thành công !");
          res.redirect("back");

        case 7:
        case "end":
          return _context4.stop();
      }
    }
  });
};