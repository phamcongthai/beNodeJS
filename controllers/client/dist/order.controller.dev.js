"use strict";

var CartModel = require('../../models/cart.model');

var ProductModel = require('../../models/products.model');

var OrderModel = require('../../models/order.model');

var createPayment = require('../../helpers/vnpay.helper');

var _require = require('vnpay'),
    VNPay = _require.VNPay,
    ignoreLogger = _require.ignoreLogger; //[GET] : Kiểm tra thông tin trước khi đặt hàng


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
}; //[GET] : Trang tạo đơn hàng 
// [POST] : Tạo đơn hàng


module.exports.order = function _callee2(req, res) {
  var _req$body, fullName, phone, address, paymentMethod, userInfo, cart, products, totalPrice, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, item, product, discountPercentage, newPrice, priceAfterDiscount, order, newCart, vnpUrl;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, fullName = _req$body.fullName, phone = _req$body.phone, address = _req$body.address, paymentMethod = _req$body.paymentMethod;
          userInfo = {
            fullName: fullName,
            phone: phone,
            address: address
          };
          cart = res.locals.miniCart;
          products = [];
          totalPrice = 0; // Tính tổng tiền và lấy thông tin chi tiết sản phẩm

          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context2.prev = 9;
          _iterator2 = cart.products[Symbol.iterator]();

        case 11:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context2.next = 20;
            break;
          }

          item = _step2.value;
          _context2.next = 15;
          return regeneratorRuntime.awrap(ProductModel.findById(item.products_id));

        case 15:
          product = _context2.sent;

          if (product) {
            discountPercentage = product.discountPercentage || 0;
            newPrice = product.price * (1 - discountPercentage / 100);
            priceAfterDiscount = Math.round(newPrice * item.quantity);
            totalPrice += priceAfterDiscount;
            products.push({
              product_id: product._id,
              title: product.title,
              price: product.price,
              discountPercentage: discountPercentage,
              newPrice: newPrice,
              quantity: item.quantity,
              thumbnail: product.thumbnail,
              slug: product.slug
            });
          }

        case 17:
          _iteratorNormalCompletion2 = true;
          _context2.next = 11;
          break;

        case 20:
          _context2.next = 26;
          break;

        case 22:
          _context2.prev = 22;
          _context2.t0 = _context2["catch"](9);
          _didIteratorError2 = true;
          _iteratorError2 = _context2.t0;

        case 26:
          _context2.prev = 26;
          _context2.prev = 27;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 29:
          _context2.prev = 29;

          if (!_didIteratorError2) {
            _context2.next = 32;
            break;
          }

          throw _iteratorError2;

        case 32:
          return _context2.finish(29);

        case 33:
          return _context2.finish(26);

        case 34:
          // Tạo đơn hàng mới
          order = new OrderModel({
            user_id: res.locals.user._id,
            userInfo: userInfo,
            products: products,
            cart_id: cart._id,
            paymentMethod: paymentMethod,
            totalPrice: totalPrice
          });
          _context2.next = 37;
          return regeneratorRuntime.awrap(order.save());

        case 37:
          if (!(paymentMethod === 'cod')) {
            _context2.next = 47;
            break;
          }

          _context2.next = 40;
          return regeneratorRuntime.awrap(CartModel.findByIdAndDelete(cart._id));

        case 40:
          res.clearCookie('cartId');

          if (!cart.user_id) {
            _context2.next = 46;
            break;
          }

          newCart = new CartModel({
            user_id: cart.user_id,
            products: []
          });
          _context2.next = 45;
          return regeneratorRuntime.awrap(newCart.save());

        case 45:
          res.cookie('cartId', newCart._id.toString(), {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
          });

        case 46:
          return _context2.abrupt("return", res.redirect("/checkout/success/".concat(order._id)));

        case 47:
          _context2.next = 49;
          return regeneratorRuntime.awrap(createPayment(Math.round(totalPrice), order._id.toString(), req.ip || '127.0.0.1'));

        case 49:
          vnpUrl = _context2.sent;
          return _context2.abrupt("return", res.redirect(vnpUrl));

        case 53:
          _context2.prev = 53;
          _context2.t1 = _context2["catch"](0);
          console.error('Lỗi khi tạo đơn hàng:', _context2.t1);
          res.redirect('back');

        case 57:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 53], [9, 22, 26, 34], [27,, 29, 33]]);
}; //[GET] : Thành công !
// [GET] : Trang thanh toán thành công


module.exports.success = function _callee3(req, res) {
  var order_id, order, paymentMethod, vnpay, verify, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, item;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          order_id = req.params.order_id;
          _context3.next = 3;
          return regeneratorRuntime.awrap(OrderModel.findById(order_id).lean());

        case 3:
          order = _context3.sent;
          paymentMethod = order.paymentMethod;

          if (!(paymentMethod === "online")) {
            _context3.next = 12;
            break;
          }

          vnpay = new VNPay({
            tmnCode: process.env.vnp_TmnCode,
            secureSecret: process.env.vnp_HashSecret,
            testMode: true,
            enableLog: true
          });
          verify = vnpay.verifyReturnUrl(req.query);

          if (verify.isVerified) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.send('Xác thực tính toàn vẹn dữ liệu thất bại'));

        case 10:
          if (verify.isSuccess) {
            _context3.next = 12;
            break;
          }

          return _context3.abrupt("return", res.send('Đơn hàng thanh toán thất bại'));

        case 12:
          // Tính tổng từng sản phẩm
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context3.prev = 15;

          for (_iterator3 = order.products[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            item = _step3.value;
            item.total = item.quantity * item.newPrice;
          }

          _context3.next = 23;
          break;

        case 19:
          _context3.prev = 19;
          _context3.t0 = _context3["catch"](15);
          _didIteratorError3 = true;
          _iteratorError3 = _context3.t0;

        case 23:
          _context3.prev = 23;
          _context3.prev = 24;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 26:
          _context3.prev = 26;

          if (!_didIteratorError3) {
            _context3.next = 29;
            break;
          }

          throw _iteratorError3;

        case 29:
          return _context3.finish(26);

        case 30:
          return _context3.finish(23);

        case 31:
          res.render('client/pages/order/success', {
            title: "Trang đặt hàng thành công",
            order: order
          });

        case 32:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[15, 19, 23, 31], [24,, 26, 30]]);
}; //[POST] : IPN thanh toán :


module.exports.vnpayIpn = function _callee4(req, res) {
  var vnpay, verify, orderId, responseCode, order;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          vnpay = new VNPay({
            tmnCode: process.env.vnp_TmnCode,
            secureSecret: process.env.vnp_HashSecret,
            testMode: true,
            enableLog: true
          });
          verify = vnpay.verifyIpnCall(req.query); // Lấy mã đơn hàng từ URL

          orderId = req.query.vnp_TxnRef;
          responseCode = req.query.vnp_ResponseCode;

          if (verify.isVerified) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            RspCode: '97',
            Message: 'Sai checksum'
          }));

        case 7:
          _context4.next = 9;
          return regeneratorRuntime.awrap(OrderModel.findById(orderId));

        case 9:
          order = _context4.sent;

          if (order) {
            _context4.next = 12;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            RspCode: '01',
            Message: 'Không tìm thấy đơn hàng'
          }));

        case 12:
          if (!(order.paymentStatus === 'paid')) {
            _context4.next = 14;
            break;
          }

          return _context4.abrupt("return", res.status(200).json({
            RspCode: '02',
            Message: 'Đơn hàng đã được thanh toán'
          }));

        case 14:
          if (!(responseCode === '00')) {
            _context4.next = 21;
            break;
          }

          order.paymentStatus = 'paid'; // Xoá giỏ hàng nếu thanh toán thành công

          if (!order.cart_id) {
            _context4.next = 19;
            break;
          }

          _context4.next = 19;
          return regeneratorRuntime.awrap(CartModel.findByIdAndDelete(order.cart_id));

        case 19:
          _context4.next = 22;
          break;

        case 21:
          order.paymentStatus = 'fail';

        case 22:
          _context4.next = 24;
          return regeneratorRuntime.awrap(order.save());

        case 24:
          return _context4.abrupt("return", res.status(200).json({
            RspCode: '00',
            Message: 'Xác nhận thành công'
          }));

        case 27:
          _context4.prev = 27;
          _context4.t0 = _context4["catch"](0);
          console.error("Lỗi IPN:", _context4.t0);
          return _context4.abrupt("return", res.status(500).json({
            RspCode: '99',
            Message: 'Lỗi server'
          }));

        case 31:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 27]]);
}; //[GET]: Lấy ra đơn hàng người dùng


module.exports.myOrders = function _callee5(req, res) {
  var find, status, keywordOrder, orders;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          find = {
            user_id: res.locals.user._id // Lọc theo user_id của người dùng

          }; // Lọc theo trạng thái nếu có

          status = req.query.status;

          if (status) {
            find.status = status;
          } // Lọc theo từ khóa tìm kiếm (ID đơn hàng hoặc tên sản phẩm)


          keywordOrder = req.query.keywordOrder;

          if (keywordOrder) {
            // Kiểm tra xem từ khóa có phải là ObjectId hợp lệ không
            if (/^[0-9a-fA-F]{24}$/.test(keywordOrder)) {
              // Nếu là ObjectId hợp lệ, tìm theo _id
              find._id = keywordOrder;
            } else {
              // Nếu không phải ObjectId, tìm theo tên sản phẩm
              find['products.title'] = {
                $regex: keywordOrder,
                $options: 'i'
              };
            }
          } // Tìm kiếm đơn hàng theo điều kiện


          _context5.next = 7;
          return regeneratorRuntime.awrap(OrderModel.find(find));

        case 7:
          orders = _context5.sent;
          // Render kết quả tìm kiếm
          res.render('client/pages/order/myorders', {
            title: "Trang đơn hàng",
            orders: orders,
            keywordOrder: keywordOrder
          });

        case 9:
        case "end":
          return _context5.stop();
      }
    }
  });
}; //[PATCH] : Hủy đơn hàng :


module.exports.cancel = function _callee6(req, res) {
  var order;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(OrderModel.findById(req.params.id));

        case 2:
          order = _context6.sent;

          if (!(order.status === "pending")) {
            _context6.next = 9;
            break;
          }

          order.prevStatus = order.status;
          _context6.next = 7;
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
          return _context6.stop();
      }
    }
  });
}; //[PATCH] : Hoàn hủy đơn hàng :


module.exports.undoCancel = function _callee7(req, res) {
  var order;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(OrderModel.findById(req.params.id));

        case 2:
          order = _context7.sent;
          _context7.next = 5;
          return regeneratorRuntime.awrap(OrderModel.updateOne({
            _id: req.params.id
          }, {
            status: order.prevStatus
          }));

        case 5:
          res.redirect("back");

        case 6:
        case "end":
          return _context7.stop();
      }
    }
  });
}; //[PATCH : Xác nhận đơn hàng :


module.exports.confirm = function _callee8(req, res) {
  var order;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(OrderModel.findById(req.params.id));

        case 2:
          order = _context8.sent;
          _context8.prev = 3;

          if (!(order.status !== 'delivered')) {
            _context8.next = 7;
            break;
          }

          req.flash('error', 'Chỉ có thể xác nhận khi đơn hàng đã được giao.');
          return _context8.abrupt("return", res.redirect('back'));

        case 7:
          _context8.next = 9;
          return regeneratorRuntime.awrap(OrderModel.updateOne({
            _id: req.params.id
          }, {
            status: "completed",
            completedAt: new Date()
          }));

        case 9:
          req.flash('success', 'Xác nhận đã nhận hàng thành công!');
          res.redirect('back');
          _context8.next = 18;
          break;

        case 13:
          _context8.prev = 13;
          _context8.t0 = _context8["catch"](3);
          console.error('Lỗi xác nhận đơn hàng:', _context8.t0);
          req.flash('error', 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
          res.redirect('back');

        case 18:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[3, 13]]);
}; //[PATCH] : Yêu cầu hủy khi đang ở trạng thái đang chuẩn bị hàng :


module.exports.requestCancel = function _callee9(req, res) {
  var order;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(OrderModel.findById(req.params.id));

        case 3:
          order = _context9.sent;

          if (!order) {
            _context9.next = 9;
            break;
          }

          if (!(order.status === "preparing" && order.cancelRequest === false)) {
            _context9.next = 9;
            break;
          }

          _context9.next = 8;
          return regeneratorRuntime.awrap(OrderModel.updateOne({
            _id: req.params.id
          }, {
            cancelRequest: true
          }));

        case 8:
          req.flash('success', "Đã gửi thông báo thành công !");

        case 9:
          res.redirect("back");
          _context9.next = 17;
          break;

        case 12:
          _context9.prev = 12;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);
          req.flash('error', 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
          res.redirect("back");

        case 17:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 12]]);
};