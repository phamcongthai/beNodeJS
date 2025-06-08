"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var searchInput = document.querySelector('form[action="/search"] input[name="keyword"]');

  if (searchInput) {
    searchInput.addEventListener('input', function _callee(e) {
      var keyword, response, data;
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              keyword = e.target.value.trim();
              console.log('Người dùng gõ:', keyword); // Gửi yêu cầu tìm kiếm gợi ý nếu từ khóa không trống

              if (!keyword) {
                _context.next = 21;
                break;
              }

              _context.prev = 3;
              _context.next = 6;
              return regeneratorRuntime.awrap(fetch('/search/suggest', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  keyword: keyword
                })
              }));

            case 6:
              response = _context.sent;

              if (!response.ok) {
                _context.next = 13;
                break;
              }

              _context.next = 10;
              return regeneratorRuntime.awrap(response.json());

            case 10:
              data = _context.sent;
              _context.next = 14;
              break;

            case 13:
              console.error('Không nhận được dữ liệu gợi ý từ server');

            case 14:
              _context.next = 19;
              break;

            case 16:
              _context.prev = 16;
              _context.t0 = _context["catch"](3);
              console.error('Lỗi khi gọi API gợi ý:', _context.t0);

            case 19:
              _context.next = 22;
              break;

            case 21:
              console.log('Không có từ khóa tìm kiếm');

            case 22:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[3, 16]]);
    });
  } else {
    console.warn('Không tìm thấy ô tìm kiếm!');
  }
});