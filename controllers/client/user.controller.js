const UserModel = require('../../models/user.model');
var md5 = require('md5');
//[GET] : Lấy ra trang đăng kí 
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register",{
        title : "Trang đăng kí"
    })
}
//[POST] : Đăng kí user 
module.exports.registerBE = async (req, res) => {
    //Phải kiểm tra xem email đó đã tồn tại chưa, nếu tồn tại rồi nhưng tài khoản chưa xóa thì không cho tạo.
    const emailExist = await UserModel.findOne({
        email: req.body.email,
        deleted: false
    })
    if (emailExist) {
        req.flash('error', "Email đã tồn tại !");
        res.redirect("back");
    } else {
        req.body.password = md5(req.body.password);
        const User = new UserModel(req.body);
        await User.save();
         req.flash('success', "Đăng ký thành công !");
        res.redirect("/");
    }
}
//[GET] : Trang đăng nhập :
module.exports.login = async (req, res) => {
    res.render('client/pages/user/login', {
        title : "Trang đăng nhập"
    })
}
//[GET] : Trang đăng nhập :
module.exports.loginBE = async (req, res) => {
   const email = req.body.email;
   const password = req.body.password;
   //Xác thực xem email tồn tại không :
   const userExist = await UserModel.findOne({email : email});
   if(!userExist){
    req.flash("error", "Email không tồn tại !");
    return res.redirect("back");
   }else{
    //Kiểm tra mật khẩu :
    if(userExist.password != md5(password)){
        req.flash("error", "Mật khẩu sai !");
        return res.redirect("back");
    }else{
        //Kiểm tra xem tài khoản active không
        if(userExist.status != "active"){
                req.flash('error', "Tài khoản đã bị khóa !");
                return res.redirect("back");
            }else{
                req.flash('success', "Đăng nhập thành công !");
                res.cookie("token_user", userExist.token_user)
                return res.redirect("/");
            }
    }
   }
   
}
//[GET] : Đăng xuất :
module.exports.logout = async (req, res)  => {
    res.clearCookie("token_user");
    res.redirect("/");
}