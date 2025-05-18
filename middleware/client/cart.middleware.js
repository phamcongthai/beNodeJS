const CartModel = require('../../models/cart.model');
const OrderModel = require('../../models/cart.model');
const ProductsModel = require('../../models/products.model')
module.exports.cart = async (req, res, next) => {
    const cartId = req.cookies.cartId;
    if (!cartId) return next();

    const cart = await CartModel.findById(cartId);
    if (!cart) return next();

    const total = cart.products.reduce((sum, item) => sum + item.quantity, 0);
    res.locals.total = total;
    res.locals.miniCart = cart;
    next();
}