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
}; //[GET] : Trang thanh toán 


module.exports.order = function _callee2(req, res) {
  var userInfo, paymentMethod, cart, products, totalPrice, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, item, product, productTotal, cart_id, _order, newCart;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          console.log(req.body);
          userInfo = {
            fullName: req.body.fullName,
            phone: req.body.phone,
            address: req.body.address
          };
          paymentMethod = req.body.paymentMethod;
          cart = res.locals.miniCart; // Lấy giỏ hàng

          products = [];
          totalPrice = 0; // Khởi tạo biến tổng tiền
          // Lấy thông tin sản phẩm trong giỏ hàng

          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context2.prev = 10;
          _iterator2 = cart.products[Symbol.iterator]();

        case 12:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context2.next = 21;
            break;
          }

          item = _step2.value;
          _context2.next = 16;
          return regeneratorRuntime.awrap(ProductModel.findById(item.products_id));

        case 16:
          product = _context2.sent;

          if (product) {
            productTotal = product.price * item.quantity * (1 - (product.discountPercentage || 0) / 100);
            totalPrice += productTotal;
            products.push({
              product_id: product._id,
              title: product.title,
              // Thêm trường title ở đây
              price: product.price,
              discountPercentage: product.discountPercentage,
              quantity: item.quantity,
              thumbnail: product.thumbnail // Thêm trường thumbnail

            });
          }

        case 18:
          _iteratorNormalCompletion2 = true;
          _context2.next = 12;
          break;

        case 21:
          _context2.next = 27;
          break;

        case 23:
          _context2.prev = 23;
          _context2.t0 = _context2["catch"](10);
          _didIteratorError2 = true;
          _iteratorError2 = _context2.t0;

        case 27:
          _context2.prev = 27;
          _context2.prev = 28;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 30:
          _context2.prev = 30;

          if (!_didIteratorError2) {
            _context2.next = 33;
            break;
          }

          throw _iteratorError2;

        case 33:
          return _context2.finish(30);

        case 34:
          return _context2.finish(27);

        case 35:
          cart_id = cart._id; // Tạo đơn hàng, thêm trường totalPrice

          _order = new OrderModel({
            user_id: res.locals.user._id,
            userInfo: userInfo,
            products: products,
            cart_id: cart_id,
            paymentMethod: paymentMethod,
            totalPrice: totalPrice // Thêm trường totalPrice ở đây

          });
          _context2.next = 39;
          return regeneratorRuntime.awrap(_order.save());

        case 39:
          _context2.next = 41;
          return regeneratorRuntime.awrap(CartModel.findByIdAndDelete(cart._id));

        case 41:
          res.clearCookie("cartId");

          if (!cart.user_id) {
            _context2.next = 47;
            break;
          }

          newCart = new CartModel({
            user_id: cart.user_id,
            products: []
          });
          _context2.next = 46;
          return regeneratorRuntime.awrap(newCart.save());

        case 46:
          res.cookie("cartId", newCart._id.toString(), {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
          });

        case 47:
          res.redirect("/checkout/success/".concat(_order._id));
          _context2.next = 54;
          break;

        case 50:
          _context2.prev = 50;
          _context2.t1 = _context2["catch"](0);
          console.error("Lỗi khi tạo đơn hàng:", _context2.t1);
          res.redirect("back");

        case 54:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 50], [10, 23, 27, 35], [28,, 30, 34]]);
}; //[GET] : Thành công !


module.exports.success = function _callee3(req, res) {
  var order_id, order, products, totalOrderPrice, paymentMethod, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, item, product, quantity, discountPercentage, newPrice, totalPrice, userInfo;

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
          paymentMethod = order.paymentMethod;
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context3.prev = 10;
          _iterator3 = order.products[Symbol.iterator]();

        case 12:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context3.next = 21;
            break;
          }

          item = _step3.value;
          _context3.next = 16;
          return regeneratorRuntime.awrap(ProductModel.findById(item.product_id));

        case 16:
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

        case 18:
          _iteratorNormalCompletion3 = true;
          _context3.next = 12;
          break;

        case 21:
          _context3.next = 27;
          break;

        case 23:
          _context3.prev = 23;
          _context3.t0 = _context3["catch"](10);
          _didIteratorError3 = true;
          _iteratorError3 = _context3.t0;

        case 27:
          _context3.prev = 27;
          _context3.prev = 28;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 30:
          _context3.prev = 30;

          if (!_didIteratorError3) {
            _context3.next = 33;
            break;
          }

          throw _iteratorError3;

        case 33:
          return _context3.finish(30);

        case 34:
          return _context3.finish(27);

        case 35:
          userInfo = order.userInfo;
          res.render('client/pages/order/success', {
            title: "Trang đặt hàng thành công",
            products: products,
            totalOrderPrice: totalOrderPrice,
            userInfo: userInfo,
            paymentMethod: paymentMethod
          });

        case 37:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[10, 23, 27, 35], [28,, 30, 34]]);
}; //[GET] : Trang đơn hàng của client :


module.exports.myOrders = function _callee4(req, res) {
  var find, status, orders;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          find = {
            user_id: res.locals.user._id
          };
          status = req.query.status;

          if (status) {
            find.status = status;
          }

          _context4.next = 5;
          return regeneratorRuntime.awrap(OrderModel.find(find));

        case 5:
          orders = _context4.sent;
          res.render('client/pages/order/myorders', {
            title: "Trang đơn hàng",
            orders: orders
          });

        case 7:
        case "end":
          return _context4.stop();
      }
    }
  });
}; //[PATCH] : Hủy đơn hàng :


module.exports.cancel = function _callee5(req, res) {
  var order;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(OrderModel.findById(req.params.id));

        case 2:
          order = _context5.sent;

          if (!(order.status === "pending")) {
            _context5.next = 9;
            break;
          }

          order.prevStatus = order.status;
          _context5.next = 7;
          return regeneratorRuntime.awrap(OrderModel.updateOne({
            _id: req.params.id
          }, {
            status: "cancelled",
            prevStatus: order.prevStatus
          }));

        case 7:
          req.flash("success", "Bạn đã hủy đơn hàng thành công !");
          res.redirect("back");

        case 9:
        case "end":
          return _context5.stop();
      }
    }
  });
}; //[PATCH] : Hoàn hủy đơn hàng :


module.exports.undoCancel = function _callee6(req, res) {
  var order;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(OrderModel.findById(req.params.id));

        case 2:
          order = _context6.sent;
          _context6.next = 5;
          return regeneratorRuntime.awrap(OrderModel.updateOne({
            _id: req.params.id
          }, {
            status: order.prevStatus
          }));

        case 5:
          res.redirect("back");

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  });
}; //[PATCH : Xác nhận đơn hàng :


module.exports.confirm = function _callee7(req, res) {
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;

          if (!(order.status !== 'delivered')) {
            _context7.next = 4;
            break;
          }

          req.flash('error', 'Chỉ có thể xác nhận khi đơn hàng đã được giao.');
          return _context7.abrupt("return", res.redirect('back'));

        case 4:
          _context7.next = 6;
          return regeneratorRuntime.awrap(OrderModel.updateOne({
            _id: req.params.id
          }, {
            status: "completed",
            completedAt: new Date()
          }));

        case 6:
          req.flash('success', 'Xác nhận đã nhận hàng thành công!');
          res.redirect('back');
          _context7.next = 15;
          break;

        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](0);
          console.error('Lỗi xác nhận đơn hàng:', _context7.t0);
          req.flash('error', 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
          res.redirect('back');

        case 15:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 10]]);
};