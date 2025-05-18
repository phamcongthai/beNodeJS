"use strict";

var systemConfig = require('../../config/system.config');

var UserModel = require('../../models/user.model');

module.exports.authRequire = function _callee(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.cookies.token_user) {
            _context.next = 4;
            break;
          }

          res.redirect("/user/login");
          _context.next = 8;
          break;

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(UserModel.findOne({
            token_user: req.cookies.token_user
          }).select("-password"));

        case 6:
          user = _context.sent;

          if (!user) {
            res.redirect("/user/login");
          } else {
            next();
          }

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
};