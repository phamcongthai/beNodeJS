const AccountModel = require('../../models/account.model')
//[GET] : Lấy ra trang tài khoản cá nhân :
module.exports.account = async (req, res) => {
    res.render('admin/pages/my-account/index', {
        title : "Trang tài khoản cá nhân"
    })
}
//[GET] : Lấy ra trang chỉnh sửa tài khoản cá nhân :
module.exports.accountEdit = async (req, res) => {
    res.render('admin/pages/my-account/edit', {
        title : "Trang chỉnh sửa"
    })
}
//[PATCH] : Chỉnh sửa tài khoản : 
const md5 = require("md5");

module.exports.accountEditBE = async (req, res) => {
    try {
        // Kiểm tra email đã tồn tại (trừ chính user đang chỉnh sửa)
        const emailExist = await AccountModel.findOne({
            _id: { $ne: res.locals.currentUser._id },
            email: req.body.email,
            deleted: false
        });

        if (emailExist) {
            req.flash('error', "Email đã tồn tại !");
            return res.redirect("back");
        }

        // Xử lý mật khẩu nếu có nhập
        if (req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }

        // Tách updateBy để xử lý riêng
        const currentUpdate = {
            account_id: res.locals.currentUser._id,
            updateAt: new Date()
        };
        const updateData = { ...req.body };
        delete updateData.updateBy;

        // Thực hiện cập nhật
        await AccountModel.updateOne(
            { _id: res.locals.currentUser._id },
            {
                $set: updateData,
                $push: { updateBy: currentUpdate }
            }
        );

        res.redirect("back");
    } catch (err) {
        console.error(err);
        req.flash('error', "Đã có lỗi xảy ra khi cập nhật tài khoản.");
        res.redirect("back");
    }
};
