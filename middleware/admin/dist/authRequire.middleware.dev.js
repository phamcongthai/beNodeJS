"use strict";

var systemConfig = require('../../config/system.config');

var AccountsModel = require('../../models/account.model');

var RolesModel = require('../../models/roles.model');

module.exports.authRequire = function _callee(req, res, next) {
  var user, role;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.cookies.token) {
            _context.next = 4;
            break;
          }

          res.redirect("".concat(systemConfig.prefixAdmin, "/auth/login"));
          _context.next = 17;
          break;

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(AccountsModel.findOne({
            token: req.cookies.token
          }).select("-password"));

        case 6:
          user = _context.sent;

          if (user) {
            _context.next = 11;
            break;
          }

          res.redirect("".concat(systemConfig.prefixAdmin, "/auth/login"));
          _context.next = 17;
          break;

        case 11:
          res.locals.currentUser = user; // Tạo một biến toàn cục luôn.

          _context.next = 14;
          return regeneratorRuntime.awrap(RolesModel.findOne({
            _id: user.role_id
          }).select("title permissions"));

        case 14:
          role = _context.sent;
          res.locals.currentRole = role;
          next();

        case 17:
        case "end":
          return _context.stop();
      }
    }
  });
};