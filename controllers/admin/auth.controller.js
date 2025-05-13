const AccountsModel = require("../../models/account.model");
const RolesModel = require("../../models/roles.model");
const systemConfig = require('../../config/system.config');
var md5 = require('md5');
//Trang đăng nhập :
//[GET] : Trang đăng nhập :
module.exports.login = async (req, res) => {
    //Trong trường hợp khi người dùng đăng nhập rồi
    //Thì sẽ không truy cập lại được đăng nhập nữa
    if(req.cookies.token){
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
    res.render("admin/pages/auth/login",{
        title : "Trang đăng nhập"
    })
}
//[POST] : Đăng nhập : 
module.exports.loginBE = async (req, res) => {
    
    //Kiểm tra xem email tồn tại không ?
    const userExist = await AccountsModel.findOne({
        deleted : false,
        email : req.body.email});
    if(!userExist){
        req.flash('error', "Email không tồn tại !");
        return res.redirect("back");
    }else{
        if(userExist.password != md5(req.body.password)){
            req.flash('error', "Mật khẩu không đúng !");
            return res.redirect("back");
        }else{
            //Kiểm tra xem tài khoản có được active không ? 
            if(userExist.status != "active"){
                req.flash('error', "Tài khoản đã bị khóa !");
                return res.redirect("back");
            }else{
                req.flash('succes', "Đăng nhập thành công !");
                res.cookie("token", userExist.token)
                return res.redirect("/admin/dashboard");
            }
        }
    }
}
//Trang đăng xuất :
module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.redirect("/admin/auth/login");
}