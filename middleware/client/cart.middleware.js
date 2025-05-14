const CartModel = require('../../models/cart.model');

module.exports.cart = async (req, res, next) => {
    if(!req.cookies.cartId){
        const newCart = new CartModel();
        await newCart.save();
        res.cookie("cartId", newCart._id, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)});
    }else{
        // res.clearCookie('cartId');
        const cart = await CartModel.findOne({
            _id : req.cookies.cartId
        })
        const total = cart.products.reduce((sum, item)=>{
            return sum + item.quantity
        }, 0)
        res.locals.total = total;
        res.locals.miniCart = cart;
    }
    next();
}