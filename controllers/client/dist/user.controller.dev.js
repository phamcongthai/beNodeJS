"use strict";

var UserModel = require('../../models/user.model');

var ForgotPassModel = require('../../models/forgot-password');

var genToken = require('../../helpers/generateToken.helper');

var sendMailHelper = require('../../helpers/sendMail.helper');

var CartModel = require('../../models/cart.model');

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
  var _req$body, email, password, user, cart, cartId;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, password = _req$body.password;
          _context4.next = 3;
          return regeneratorRuntime.awrap(UserModel.findOne({
            email: email
          }));

        case 3:
          user = _context4.sent;

          if (!(!user || user.password !== md5(password))) {
            _context4.next = 7;
            break;
          }

          req.flash("error", "Thông tin đăng nhập sai!");
          return _context4.abrupt("return", res.redirect("back"));

        case 7:
          if (!(user.status !== "active")) {
            _context4.next = 10;
            break;
          }

          req.flash("error", "Tài khoản bị khóa!");
          return _context4.abrupt("return", res.redirect("back"));

        case 10:
          res.cookie("token_user", user.token_user); // Nếu đã có cartId cookie nhưng cart không tồn tại nữa, thì tìm hoặc tạo

          cart = null;
          cartId = req.cookies.cartId;

          if (!cartId) {
            _context4.next = 17;
            break;
          }

          _context4.next = 16;
          return regeneratorRuntime.awrap(CartModel.findById(cartId));

        case 16:
          cart = _context4.sent;

        case 17:
          if (cart) {
            _context4.next = 25;
            break;
          }

          _context4.next = 20;
          return regeneratorRuntime.awrap(CartModel.findOne({
            user_id: user._id
          }));

        case 20:
          cart = _context4.sent;

          if (cart) {
            _context4.next = 25;
            break;
          }

          cart = new CartModel({
            user_id: user._id,
            products: []
          });
          _context4.next = 25;
          return regeneratorRuntime.awrap(cart.save());

        case 25:
          res.cookie("cartId", cart._id.toString(), {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
          });
          req.flash("success", "Đăng nhập thành công!");
          res.redirect("/");

        case 28:
        case "end":
          return _context4.stop();
      }
    }
  });
}; //[GET] : Đăng xuất :


module.exports.logout = function (req, res) {
  res.clearCookie("token_user");
  res.clearCookie("cartId");
  res.redirect("/");
}; //[GET] : Quên mật khẩu :


module.exports.forgot = function _callee5(req, res) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          res.render('client/pages/user/forgot-password', {
            title: "Trang đổi mật khẩu"
          });

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
}; //[POST] : Quên mật khẩu :


module.exports.forgotBE = function _callee6(req, res) {
  var email, userExist, otp, data, foPass, subject, content;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          email = req.body.email;
          _context6.next = 3;
          return regeneratorRuntime.awrap(UserModel.findOne({
            email: email
          }));

        case 3:
          userExist = _context6.sent;

          if (userExist) {
            _context6.next = 7;
            break;
          }

          req.flash("error", "Email không tồn tại !");
          return _context6.abrupt("return", res.redirect("back"));

        case 7:
          otp = genToken.generateRandomNumber(8);
          data = {
            email: email,
            opt: otp // Không cần đặt expireAt nữa

          };
          foPass = new ForgotPassModel(data);
          _context6.next = 12;
          return regeneratorRuntime.awrap(foPass.save());

        case 12:
          //Gửi mail :
          subject = "Mã OTP lấy lại mật khẩu : ";
          content = "M\xE3 OTP l\xE0 <b>".concat(otp, "</b>");
          sendMailHelper.sendMail(email, subject, content);
          res.redirect("/user/password/otp?email=".concat(email));

        case 16:
        case "end":
          return _context6.stop();
      }
    }
  });
}; //[GET] : Trang nhập mã otp :


module.exports.opt = function _callee7(req, res) {
  var email;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          email = req.query.email;
          res.render("client/pages/user/otp", {
            title: "Trang otp",
            email: email
          });

        case 2:
        case "end":
          return _context7.stop();
      }
    }
  });
}; //[POST] : Trang nhập mã otp :


module.exports.optBE = function _callee8(req, res) {
  var otp, userExist, user;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          otp = req.body.otp;
          _context8.next = 3;
          return regeneratorRuntime.awrap(ForgotPassModel.findOne({
            opt: otp
          }));

        case 3:
          userExist = _context8.sent;

          if (userExist) {
            _context8.next = 9;
            break;
          }

          req.flash("error", "Mã OTP không hợp lệ !");
          res.redirect("back");
          _context8.next = 13;
          break;

        case 9:
          _context8.next = 11;
          return regeneratorRuntime.awrap(UserModel.findOne({
            email: req.body.email
          }));

        case 11:
          user = _context8.sent;

          if (user) {
            res.cookie("token_user", user.token_user);
            res.redirect('/user/password/reset');
          }

        case 13:
        case "end":
          return _context8.stop();
      }
    }
  });
}; //[GET] : Trang nhập reset mật khẩu :


module.exports.reset = function _callee9(req, res) {
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          res.render("client/pages/user/reset", {
            title: "Trang reset mật khẩu"
          });

        case 1:
        case "end":
          return _context9.stop();
      }
    }
  });
}; //[POST] : Trang nhập reset mật khẩu :


module.exports.resetBE = function _callee10(req, res) {
  var newPass, confirmPass, tokenUser;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          newPass = req.body.password;
          confirmPass = req.body.confirmPassword;

          if (newPass) {
            _context10.next = 7;
            break;
          }

          req.flash("error", "Vui lòng nhập mật khẩu mới");
          res.redirect("back");
          _context10.next = 21;
          break;

        case 7:
          if (confirmPass) {
            _context10.next = 12;
            break;
          }

          req.flash("error", "Vui lòng nhập mật khẩu xác nhận");
          res.redirect("back");
          _context10.next = 21;
          break;

        case 12:
          if (!(newPass != confirmPass)) {
            _context10.next = 17;
            break;
          }

          req.flash("error", "Mật khẩu xác nhận không đúng");
          res.redirect("back");
          _context10.next = 21;
          break;

        case 17:
          //Đổi mật khẩu 
          tokenUser = req.cookies.token_user;
          _context10.next = 20;
          return regeneratorRuntime.awrap(UserModel.updateOne({
            token_user: tokenUser
          }, {
            password: md5(newPass)
          }));

        case 20:
          res.redirect("/products");

        case 21:
        case "end":
          return _context10.stop();
      }
    }
  });
}; //[GET] : Lấy ra trang thông tin tài khoản :


module.exports.profile = function _callee11(req, res) {
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          res.render("client/pages/user/profile", {
            title: "Trang tài khoản"
          });

        case 1:
        case "end":
          return _context11.stop();
      }
    }
  });
};