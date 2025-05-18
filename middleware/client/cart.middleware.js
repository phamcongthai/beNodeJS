const CartModel = require('../../models/cart.model');
const UserModel = require('../../models/user.model');
module.exports.cart = async (req, res, next) => {
    let cartId = req.cookies.cartId;
    let cart = null;

    const token = req.cookies.token_user;
    let user = null;

    if (token) {
        user = await UserModel.findOne({ token_user: token });
    }

    // Nếu có cartId từ cookie thì tìm theo ID
    if (cartId) {
        cart = await CartModel.findById(cartId);
    }

    // Nếu không tìm được cart từ cookie, và có user thì tìm theo user_id
    if (!cart && user) {
        cart = await CartModel.findOne({ user_id: user._id });
    }

    // ❗️CHỈ tạo mới cart nếu có user (đã đăng nhập)
    if (!cart && user) {
        cart = new CartModel({
            user_id: user._id,
            products: []
        });
        await cart.save();
    }

    // Nếu có cart (đã tìm được hoặc tạo mới), cập nhật cookie nếu cần
    if (cart) {
        if (!cartId || cartId !== cart._id.toString()) {
            res.cookie("cartId", cart._id.toString(), {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
            });
        }

        // Gửi thông tin cart ra frontend
        const total = cart.products.reduce((sum, item) => sum + item.quantity, 0);
        res.locals.total = total;
        res.locals.miniCart = cart;
    } else {
        // Nếu không có cart, gán mặc định
        res.locals.total = 0;
        res.locals.miniCart = { products: [] };
        // ❗️Xóa luôn cookie cartId nếu chưa đăng nhập
        if (cartId) {
            res.clearCookie("cartId");
        }
    }

    next();
};
