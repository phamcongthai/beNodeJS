const systemConfig = require('../../config/system.config');
const AccountsModel = require('../../models/account.model');
const RolesModel = require('../../models/roles.model')
module.exports.authRequire = async (req, res, next) => {
    //Lấy ra token trong cookie và so sánh nếu đúng thì next() sai thì đăng nhập lại
    if(!req.cookies.token){
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }else{
    const user = await AccountsModel.findOne({token : req.cookies.token}).select("-password");
    if(!user){
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }else{
        res.locals.currentUser = user;// Tạo một biến toàn cục luôn.
        const role = await RolesModel.findOne({
            _id : user.role_id
        }).select("title permissions")
        
        res.locals.currentRole = role;
      
        
        next();
    }
    }
}