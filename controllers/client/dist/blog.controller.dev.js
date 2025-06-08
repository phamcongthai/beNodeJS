"use strict";

var BlogsModel = require('../../models/blog.model');

module.exports.blog = function _callee(req, res) {
  var blogs, slug, blog;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(BlogsModel.find({
            deleted: false,
            status: "published"
          }));

        case 3:
          blogs = _context.sent;
          // Nếu có slug trong URL, tìm bài viết theo slug
          slug = req.params.slug;

          if (!slug) {
            _context.next = 9;
            break;
          }

          _context.next = 8;
          return regeneratorRuntime.awrap(BlogsModel.findOne({
            slug: slug,
            deleted: false,
            status: "published"
          }));

        case 8:
          blog = _context.sent;

        case 9:
          // Render trang với danh sách các bài viết
          res.render('client/pages/blogs/index', {
            title: "Trang bài viết",
            blogs: blogs,
            blog: blog // Truyền blog cần hiển thị vào view

          });
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).send('Lỗi khi lấy dữ liệu blog');

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
};