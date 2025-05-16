"use strict";

var CartModel = require('../../models/cart.model');

var ProductModel = require('../../models/products.model');

var OrderModel = require('../../models/order.model'); //[GET] : Kiểm tra thông tin trước khi đặt hàng


module.exports.checkout = function _callee(req, res) {
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
          res.render("client/pages/order/index", {
            title: "Trang đặt hàng",
            products: products
          });

        case 34:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[8, 21, 25, 33], [26,, 28, 32]]);
};

module.exports.order = function _callee2(req, res) {
  var userInfo, cart, products, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, item, product, cart_id, order;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userInfo = req.body;
          cart = res.locals.miniCart; // Lấy giỏ hàng

          products = []; // Lấy thông tin sản phẩm trong giỏ hàng

          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context2.prev = 7;
          _iterator2 = cart.products[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context2.next = 18;
            break;
          }

          item = _step2.value;
          _context2.next = 13;
          return regeneratorRuntime.awrap(ProductModel.findById(item.products_id));

        case 13:
          product = _context2.sent;

          if (product) {
            products.push({
              product_id: product._id,
              price: product.price,
              discountPercentage: product.discountPercentage,
              quantity: item.quantity
            });
          }

        case 15:
          _iteratorNormalCompletion2 = true;
          _context2.next = 9;
          break;

        case 18:
          _context2.next = 24;
          break;

        case 20:
          _context2.prev = 20;
          _context2.t0 = _context2["catch"](7);
          _didIteratorError2 = true;
          _iteratorError2 = _context2.t0;

        case 24:
          _context2.prev = 24;
          _context2.prev = 25;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 27:
          _context2.prev = 27;

          if (!_didIteratorError2) {
            _context2.next = 30;
            break;
          }

          throw _iteratorError2;

        case 30:
          return _context2.finish(27);

        case 31:
          return _context2.finish(24);

        case 32:
          cart_id = cart._id; // Tạo đơn hàng

          order = new OrderModel({
            userInfo: userInfo,
            products: products,
            cart_id: cart_id
          });
          _context2.next = 36;
          return regeneratorRuntime.awrap(order.save());

        case 36:
          _context2.next = 38;
          return regeneratorRuntime.awrap(CartModel.findByIdAndDelete(cart._id));

        case 38:
          res.clearCookie("cartId");
          res.redirect("/checkout/success/".concat(order._id));
          _context2.next = 46;
          break;

        case 42:
          _context2.prev = 42;
          _context2.t1 = _context2["catch"](0);
          console.error("Lỗi khi tạo đơn hàng:", _context2.t1);
          res.redirect("back");

        case 46:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 42], [7, 20, 24, 32], [25,, 27, 31]]);
}; //[GET] : Thành công !


module.exports.success = function _callee3(req, res) {
  var order_id, order, products, totalOrderPrice, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, item, product, quantity, discountPercentage, newPrice, totalPrice, userInfo;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          order_id = req.params.order_id;
          _context3.next = 3;
          return regeneratorRuntime.awrap(OrderModel.findById(order_id));

        case 3:
          order = _context3.sent;
          products = [];
          totalOrderPrice = 0;
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context3.prev = 9;
          _iterator3 = order.products[Symbol.iterator]();

        case 11:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context3.next = 20;
            break;
          }

          item = _step3.value;
          _context3.next = 15;
          return regeneratorRuntime.awrap(ProductModel.findById(item.product_id));

        case 15:
          product = _context3.sent;

          if (product) {
            quantity = item.quantity; // Sử dụng discountPercentage thay vì discount

            discountPercentage = product.discountPercentage || 0;
            newPrice = product.price - product.price * discountPercentage / 100;
            totalPrice = newPrice * quantity;
            totalOrderPrice += totalPrice;
            product.quantity = quantity;
            product.newPrice = newPrice;
            product.totalPrice = totalPrice;
            products.push(product);
          }

        case 17:
          _iteratorNormalCompletion3 = true;
          _context3.next = 11;
          break;

        case 20:
          _context3.next = 26;
          break;

        case 22:
          _context3.prev = 22;
          _context3.t0 = _context3["catch"](9);
          _didIteratorError3 = true;
          _iteratorError3 = _context3.t0;

        case 26:
          _context3.prev = 26;
          _context3.prev = 27;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 29:
          _context3.prev = 29;

          if (!_didIteratorError3) {
            _context3.next = 32;
            break;
          }

          throw _iteratorError3;

        case 32:
          return _context3.finish(29);

        case 33:
          return _context3.finish(26);

        case 34:
          userInfo = order.userInfo;
          res.render('client/pages/order/success', {
            title: "Trang đặt hàng thành công",
            products: products,
            totalOrderPrice: totalOrderPrice,
            userInfo: userInfo
          });

        case 36:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[9, 22, 26, 34], [27,, 29, 33]]);
};