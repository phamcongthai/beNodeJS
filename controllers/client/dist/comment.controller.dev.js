"use strict";

var ProductsModel = require('../../models/products.model');

module.exports.addComment = function _callee(req, res) {
  var productSlug, _req$body, comment, rating, user, product, newComment;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          productSlug = req.params.productSlug; // Lấy slug từ URL

          _req$body = req.body, comment = _req$body.comment, rating = _req$body.rating; // Lấy comment và rating từ form
          // Lấy thông tin người dùng từ res.locals.user (được set qua middleware)

          user = res.locals.user; // Kiểm tra người dùng đã đăng nhập chưa

          if (user) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", res.status(401).send('Bạn cần đăng nhập để bình luận'));

        case 6:
          if (!(!comment || !rating)) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.status(400).send('Bạn phải nhập đầy đủ bình luận và đánh giá'));

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(ProductsModel.findOne({
            slug: productSlug
          }));

        case 10:
          product = _context.sent;

          if (product) {
            _context.next = 13;
            break;
          }

          return _context.abrupt("return", res.status(404).send('Sản phẩm không tồn tại'));

        case 13:
          // Tạo đối tượng bình luận mới
          newComment = {
            user_id: user._id,
            // ID của người dùng hiện tại
            role: 'user',
            // Mặc định role là user
            comment: comment,
            // Nội dung bình luận
            rating: rating,
            // Đánh giá
            create_at: new Date() // Thời gian tạo bình luận

          };
          console.log(newComment); // Thêm bình luận vào mảng comments của sản phẩm

          product.comments.push(newComment); // Lưu sản phẩm với bình luận mới

          _context.next = 18;
          return regeneratorRuntime.awrap(product.save());

        case 18:
          // Chuyển hướng lại về trang chi tiết sản phẩm
          res.redirect("/products/detail/".concat(productSlug)); // Sử dụng slug trong URL

          _context.next = 25;
          break;

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).send('Có lỗi khi thêm bình luận');

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 21]]);
};