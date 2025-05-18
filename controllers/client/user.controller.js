const UserModel = require('../../models/user.model');
const ForgotPassModel = require('../../models/forgot-password');
const genToken = require('../../helpers/generateToken.helper');
const sendMailHelper = require('../../helpers/sendMail.helper');
const CartModel = require('../../models/cart.model');
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
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
        req.flash("error", "Email không tồn tại!");
        return res.redirect("back");
    }

    if (user.password !== md5(password)) {
        req.flash("error", "Mật khẩu sai!");
        return res.redirect("back");
    }

    if (user.status !== "active") {
        req.flash("error", "Tài khoản bị khóa!");
        return res.redirect("back");
    }

    // Đăng nhập thành công
    res.cookie("token_user", user.token_user);

    // Tìm hoặc tạo giỏ hàng theo user
    let cart = await CartModel.findOne({user_id : user._id });
    if (!cart) {
        cart = new CartModel({
            user_id : user._id,
            products: []
        });
        await cart.save();
    }

    res.cookie("cartId", cart._id, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
    });

    req.flash("success", "Đăng nhập thành công!");
    return res.redirect("/");
};
//[GET] : Đăng xuất :
module.exports.logout = (req, res) => {
    res.clearCookie("token_user");
    res.clearCookie("cartId");
    res.redirect("/");
};

//[GET] : Quên mật khẩu :
module.exports.forgot = async (req, res) => {
    res.render('client/pages/user/forgot-password',
        {
            title : "Trang đổi mật khẩu"
        }
    )
}
//[POST] : Quên mật khẩu :
module.exports.forgotBE = async (req, res) => {
    const email = req.body.email;

    const userExist = await UserModel.findOne({ email });
    if (!userExist) {
        req.flash("error", "Email không tồn tại !");
        return res.redirect("back");
    }
    const otp = genToken.generateRandomNumber(8)
    const data = {
        email,
        opt: otp
        // Không cần đặt expireAt nữa
    };
    const foPass = new ForgotPassModel(data);
    await foPass.save();
    //Gửi mail :
    const subject = "Mã OTP lấy lại mật khẩu : "
    const content = `Mã OTP là <b>${otp}</b>`
    sendMailHelper.sendMail(email, subject, content);
    res.redirect(`/user/password/otp?email=${email}`);
};

//[GET] : Trang nhập mã otp :
module.exports.opt = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp", {
        title : "Trang otp",
        email : email
    })
}
//[POST] : Trang nhập mã otp :
module.exports.optBE = async (req, res) => {
    const otp = req.body.otp;
    const userExist = await ForgotPassModel.findOne({opt : otp});
    //Nếu không tồn tại user :
    if(!userExist){
        req.flash("error", "Mã OTP không hợp lệ !");
        res.redirect("back");
    }else{
        //Nếu nó khớp , thì đăng nhập luôn :
        const user = await UserModel.findOne({email : req.body.email});
        if(user){
            res.cookie("token_user", user.token_user);
            res.redirect('/user/password/reset');
        }
    }
    
}
//[GET] : Trang nhập reset mật khẩu :
module.exports.reset = async (req, res) => {
    res.render("client/pages/user/reset", {
        title : "Trang reset mật khẩu",
    })
}
//[POST] : Trang nhập reset mật khẩu :
module.exports.resetBE = async (req, res) => {
    const newPass = req.body.password;
    const confirmPass = req.body.confirmPassword;
    if(!newPass){
        req.flash("error", "Vui lòng nhập mật khẩu mới");
        res.redirect("back");
    }else{
        if(!confirmPass){
            req.flash("error", "Vui lòng nhập mật khẩu xác nhận");
            res.redirect("back");
        }else{
            if(newPass != confirmPass){
                req.flash("error", "Mật khẩu xác nhận không đúng");
                res.redirect("back");
            }else{
                //Đổi mật khẩu 
                const tokenUser = req.cookies.token_user
                await UserModel.updateOne({token_user : tokenUser}, {password : md5(newPass)});
                res.redirect("/products");
            }
        }
    }
}
//[GET] : Lấy ra trang thông tin tài khoản :
module.exports.profile = async (req, res) => {
    res.render("client/pages/user/profile", {
        title : "Trang tài khoản",

    })
}