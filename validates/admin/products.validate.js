module.exports.validateCreateProducts = (req, res, next) => {
    if(!req.body.title){
        req.flash('error', 'Vui lòng nhập tiêu đề');
        res.redirect("back");
        return;//Đóng luôn các câu lênh ở phía sau
     }
     if(req.body.title.length < 8){
        req.flash('error', 'Vui lòng nhập ít nhất 8 kí tự');
        res.redirect("back")
        return;
     }
     next(); //Đặt next ở đây
}