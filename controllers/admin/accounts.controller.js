const AccountsModel = require("../../models/account.model");
const RolesModel = require("../../models/roles.model");
//Mã hóa mật khẩu :
var md5 = require('md5');
//Trang danh sách tài khoản :
module.exports.account = async (req, res) => {
    const accounts = await AccountsModel.find({deleted : false}).lean();
    for (const item of accounts) {
        const role = await RolesModel.findOne({_id : item.role_id});
        item.role_title = role.title;
        
    }
    
    res.render("admin/pages/accounts/index", {
        title: "Trang tài khoản", 
        accounts : accounts
    })
}
//Trang tạo mới tài khoản :
//[GET] : Lấy ra trang tạo mới tài khoản :
module.exports.accountCreate = async (req, res) => {
    let find = {
        deleted: false
    }
    const roles = await RolesModel.find(find);

    res.render("admin/pages/accounts/create", {
        title: "Trang tạo mới tài khoản",
        roles: roles
    })
}
//[POST] : Tạo mới tài khoản :
module.exports.accountCreateBE = async (req, res) => {
    //Phải kiểm tra xem email đó đã tồn tại chưa, nếu tồn tại rồi nhưng tài khoản chưa xóa thì không cho tạo.
    const emailExist = await AccountsModel.findOne({
        email: req.body.email,
        deleted: false
    })
    if (emailExist) {
        req.flash('error', "Email đã tồn tại !");
        res.redirect("back");
    } else {
        req.body.password = md5(req.body.password);
        const Account = new AccountsModel(req.body);
        await Account.save();
        res.redirect("/admin/accounts");
    }

}
//Trang chỉnh sửa tài khoản :
//[GET] : Chỉnh sửa tài khoản :
module.exports.accountEdit = async (req, res) => {
    const account = await AccountsModel.findOne({
        deleted : false,
        _id : req.params.id
    });
    const roles = await RolesModel.find({deleted : false});
    res.render("admin/pages/accounts/edit", {
        title : "Trang chỉnh sửa tài khoản",
        account : account,
        roles : roles
    })
}
//[PATCH] : Chỉnh sửa tài khoản :
module.exports.accountEditBE = async (req, res) => {
    //Xử lí phần email : Nếu người dùng nhập email trùng với email của người khác (trừ họ ra) thì ko cho :
    const emailExist = await AccountsModel.findOne({
        _id: {$ne: req.params.id},
        email: req.body.email,
        deleted: false
    });
    
    if (emailExist) {
        req.flash('error', "Email đã tồn tại !");
        res.redirect("back");
    } else {
         //Xử lí phần mật khẩu (bỏ trống nếu không muốn đổi) :
    if(req.body.password){
        req.body.password = md5(req.body.password);
    }else{
        delete req.body.password; //Không thì xóa trường này đi trong obj, tránh bị ghi đè chuỗi rỗng
    }
    
        
        await AccountsModel.updateOne({_id : req.params.id}, req.body)
        res.redirect("/admin/accounts");
    }
}