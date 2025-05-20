const UserModel = require('../../models/user.model');
module.exports.userMiddleware = async (req, res, next) => {
    if(req.cookies.token_user){
        const user = await UserModel.findOne({
            token_user : req.cookies.token_user,
            deleted : false,
            status : "active"
        })
        if(user){
            res.locals.user = user;
        }
        
    }
    next();
}