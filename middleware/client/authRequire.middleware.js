const systemConfig = require('../../config/system.config');
const UserModel = require('../../models/user.model');
module.exports.authRequire = async (req, res, next) => {
    //Lấy ra token trong cookie và so sánh nếu đúng thì next() sai thì đăng nhập lại
    if(!req.cookies.token_user){
        res.redirect(`/user/login`);
    }else{
    const user = await UserModel.findOne({token_user : req.cookies.token_user}).select("-password");
    if(!user){
        res.redirect(`/user/login`);
    }else{
        next();
    }
    }
}