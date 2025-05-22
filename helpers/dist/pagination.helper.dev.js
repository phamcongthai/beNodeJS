"use strict";

module.exports.pagination = function _callee(Model) {
  var page,
      filter,
      limit,
      pagination,
      totalItems,
      _args = arguments;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          page = _args.length > 1 && _args[1] !== undefined ? _args[1] : 1;
          filter = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
          limit = _args.length > 3 && _args[3] !== undefined ? _args[3] : 4;
          pagination = {
            limit: limit,
            pageTotal: 1,
            skip: 0,
            currentPage: page
          };
          _context.next = 6;
          return regeneratorRuntime.awrap(Model.countDocuments(filter));

        case 6:
          totalItems = _context.sent;
          pagination.pageTotal = Math.ceil(totalItems / limit);
          pagination.skip = (page - 1) * limit;
          return _context.abrupt("return", pagination);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
};