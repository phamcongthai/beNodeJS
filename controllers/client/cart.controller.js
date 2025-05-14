const CartModel = require('../../models/cart.model');
const ProductModel = require('../../models/products.model');
//[GET] : Trang giỏ hàng :
module.exports.cart = async (req, res) => {
    const cartId = req.cookies.cartId;
    const cart = await CartModel.findById(cartId);
    const products = [];
    for (const item of cart.products) {
        const product = await ProductModel.findOne({
            _id: item.products_id
        });
        if (product) {
            product.quantity = item.quantity;
            products.push(product)
        }
    }


    res.render("client/pages/cart/index", {
        title: "Trang giỏ hàng",
        products
    })
}
//[POST] : Thêm vào giỏ hàng
module.exports.addCart = async (req, res) => {
    try {
        const productId = req.params.id;
        const quantity = parseInt(req.body.quantity, 10);
        const cartId = req.cookies.cartId;

        if (!cartId) {
            req.flash('error', 'Không tìm thấy giỏ hàng!');
            return res.redirect('back');
        }

        const cart = await CartModel.findById(cartId);
        if (!cart) {
            req.flash('error', 'Giỏ hàng không tồn tại!');
            return res.redirect('back');
        }

        const existingProduct = cart.products.find(p => p.products_id == productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({
                products_id: productId,
                quantity: quantity
            });
        }

        await cart.save();

        req.flash('success', "Đã thêm vào giỏ hàng!");
        res.redirect('back');

    } catch (err) {
        console.error(err);
        req.flash('error', 'Đã có lỗi xảy ra!');
        res.redirect('back');
    }
};
//[GET] : Xóa sản phẩm khỏi giỏ hàng :
module.exports.deleteProducts = async (req, res) => {
    const productId = req.params.id;
    const cartId = req.cookies.cartId;
    await CartModel.updateOne({
        _id: cartId
    }, {
        $pull: {
            products: {
                products_id: productId
            }
        }
    })
    req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng !")
    res.redirect("back");
}
//[GET] : Cập nhật sản phẩm :
module.exports.updateProducts = async (req, res) => {
    const quantity = req.params.quantity;
    const productId = req.params.productId;
    const cartId = req.cookies.cartId;
    await CartModel.updateOne({
        _id: cartId,
        "products.products_id": productId
    }, {
        $set: {
            "products.$.quantity": quantity
        }
    })
    req.flash("success", "Cập nhật số lượng thành công !")
    res.redirect("back")
}