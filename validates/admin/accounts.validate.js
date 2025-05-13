module.exports.validateAccounts = (req, res, next) => {
    if(!req.body.fullName){
        req.flash('error', 'Vui lòng nhập tên');
        res.redirect("back");
        return;//Đóng luôn các câu lênh ở phía sau
     }
     next(); //Đặt next ở đây
}