"use strict";

module.exports.validateCreateProducts = function (req, res, next) {
  if (!req.body.title) {
    req.flash('error', 'Vui lòng nhập tiêu đề');
    res.redirect("back");
    return; //Đóng luôn các câu lênh ở phía sau
  }

  next(); //Đặt next ở đây
};