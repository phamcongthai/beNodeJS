"use strict";

var ProductModel = require('../../models/products.model');

var AccountModel = require('../../models/account.model');

var mongoose = require('mongoose');

module.exports.add = function _callee(req, res) {
  var user, productId, _req$body, comment, parent_id, product, parentComment, newReply;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          user = res.locals.currentUser; // admin user info

          productId = req.params.productId;
          _req$body = req.body, comment = _req$body.comment, parent_id = _req$body.parent_id;

          if (!(!comment || !parent_id)) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", res.status(400).send('Phải có nội dung trả lời và comment cha'));

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(ProductModel.findById(productId));

        case 8:
          product = _context.sent;

          if (product) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", res.status(404).send('Sản phẩm không tồn tại'));

        case 11:
          // Kiểm tra comment cha có tồn tại không
          parentComment = product.comments.id(parent_id);

          if (parentComment) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("return", res.status(404).send('Bình luận cha không tồn tại'));

        case 14:
          // Tạo đối tượng reply mới
          newReply = {
            _id: new mongoose.Types.ObjectId(),
            // tạo id mới cho reply
            user_id: user._id.toString(),
            // admin id
            role: 'admin',
            comment: comment,
            rating: null,
            // trả lời không cần rating
            create_at: new Date(),
            parent_id: parent_id
          }; // Thêm reply vào comments

          product.comments.push(newReply); // Lưu sản phẩm

          _context.next = 18;
          return regeneratorRuntime.awrap(product.save());

        case 18:
          res.redirect("back"); // hoặc url phù hợp

          _context.next = 25;
          break;

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).send('Lỗi khi lưu trả lời bình luận');

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 21]]);
};