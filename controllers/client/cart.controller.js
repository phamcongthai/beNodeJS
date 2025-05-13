const CartModel = require('../../models/cart.model')
module.exports.cart = async (req, res) => {
    const productId = req.params.id;
    const quantity = req.body.quantity
    const cartId = req.cookies.cartId
    const existingProduct = cart.products.find(p => p.products_id == productId);

    if (existingProduct) {
        // Nếu có, tăng số lượng
        existingProduct.quantity += quantity;
    } else {
        // Nếu chưa có, thêm mới
        cart.products.push({
            products_id: productId,
            quantity: quantity
        });
    }
    await cart.save();
    req.flash('success', "Đã thêm vào giỏ hàng !");
    res.redirect("back");
}