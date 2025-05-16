"use strict";

var UserModel = require('../../models/user.model');

var md5 = require('md5'); //[GET] : Lấy ra trang đăng kí 


module.exports.register = function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          res.render("client/pages/user/register", {
            title: "Trang đăng kí"
          });

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
}; //[POST] : Đăng kí user 


module.exports.registerBE = function _callee2(req, res) {
  var emailExist, User;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(UserModel.findOne({
            email: req.body.email,
            deleted: false
          }));

        case 2:
          emailExist = _context2.sent;

          if (!emailExist) {
            _context2.next = 8;
            break;
          }

          req.flash('error', "Email đã tồn tại !");
          res.redirect("back");
          _context2.next = 14;
          break;

        case 8:
          req.body.password = md5(req.body.password);
          User = new UserModel(req.body);
          _context2.next = 12;
          return regeneratorRuntime.awrap(User.save());

        case 12:
          req.flash('success', "Đăng ký thành công !");
          res.redirect("/");

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  });
}; //[GET] : Trang đăng nhập :


module.exports.login = function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          res.render('client/pages/user/login', {
            title: "Trang đăng nhập"
          });

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
}; //[GET] : Trang đăng nhập :


module.exports.loginBE = function _callee4(req, res) {
  var email, password, userExist;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          email = req.body.email;
          password = req.body.password; //Xác thực xem email tồn tại không :

          _context4.next = 4;
          return regeneratorRuntime.awrap(UserModel.findOne({
            email: email
          }));

        case 4:
          userExist = _context4.sent;

          if (userExist) {
            _context4.next = 10;
            break;
          }

          req.flash("error", "Email không tồn tại !");
          return _context4.abrupt("return", res.redirect("back"));

        case 10:
          if (!(userExist.password != md5(password))) {
            _context4.next = 15;
            break;
          }

          req.flash("error", "Mật khẩu sai !");
          return _context4.abrupt("return", res.redirect("back"));

        case 15:
          if (!(userExist.status != "active")) {
            _context4.next = 20;
            break;
          }

          req.flash('error', "Tài khoản đã bị khóa !");
          return _context4.abrupt("return", res.redirect("back"));

        case 20:
          req.flash('success', "Đăng nhập thành công !");
          res.cookie("token_user", userExist.token_user);
          return _context4.abrupt("return", res.redirect("/"));

        case 23:
        case "end":
          return _context4.stop();
      }
    }
  });
};