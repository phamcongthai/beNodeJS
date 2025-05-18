"use strict";

var UserModel = require('../../models/user.model');

module.exports.userMiddleware = function _callee(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!req.cookies.token_user) {
            _context.next = 5;
            break;
          }

          _context.next = 3;
          return regeneratorRuntime.awrap(UserModel.findOne({
            token_user: req.cookies.token_user,
            deleted: false,
            status: "active"
          }));

        case 3:
          user = _context.sent;

          if (user) {
            console.log(user);
            res.locals.user = user;
          }

        case 5:
          next();

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
};