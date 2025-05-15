const CartModel = require('../../models/cart.model');
const ProductModel = require('../../models/products.model');
const OrderModel = require('../../models/order.model');
//[GET] : Kiểm tra thông tin trước khi đặt hàng
module.exports.checkout = async (req, res) => {
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


    res.render("client/pages/order/index", {
        title: "Trang đặt hàng",
        products
    })
}
module.exports.order = async (req, res) => {
    try {
        const userInfo = req.body;

        const cart = res.locals.miniCart; // Lấy giỏ hàng
        const products = [];

        // Lấy thông tin sản phẩm trong giỏ hàng
        for (const item of cart.products) {
            const product = await ProductModel.findById(item.products_id);
            if (product) {
                products.push({
                    product_id: product._id,
                    price: product.price,
                    discountPercentage: product.discountPercentage,
                    quantity: item.quantity
                });
            }
        }

        const cart_id = cart._id;
        

        // Tạo đơn hàng
        const order = new OrderModel({
            userInfo: userInfo,
            products: products,
            cart_id: cart_id
        });

        await order.save();

        // Thêm thông báo vào flash trước khi render

        // Sau khi render xong thì mới xóa giỏ hàng và cookie
        await CartModel.findByIdAndDelete(cart._id);
        res.clearCookie("cartId");
        res.redirect("/products")

    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error);
        res.redirect("back");
    }
};
