const CartModel = require('../../models/cart.model');

module.exports.cart = async (req, res, next) => {
    if(!req.cookies.cartId){
        const newCart = new CartModel();
        await newCart.save();
        res.cookie("cartId", newCart._id, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)});
    }else{
        // res.clearCookie('cartId');
    }
    next();
}