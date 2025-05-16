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
        res.redirect(`/checkout/success/${order._id}`);

    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error);
        res.redirect("back");
    }
};
//[GET] : Thành công !
module.exports.success = async (req, res) => {
    const order_id = req.params.order_id;
    const order = await OrderModel.findById(order_id);
    const products = [];
    let totalOrderPrice = 0;

    for (const item of order.products) {
        const product = await ProductModel.findById(item.product_id);
        if (product) {
            const quantity = item.quantity;

            // Sử dụng discountPercentage thay vì discount
            const discountPercentage = product.discountPercentage || 0;
            const newPrice = product.price - (product.price * discountPercentage / 100);

            const totalPrice = newPrice * quantity;
            totalOrderPrice += totalPrice;

            product.quantity = quantity;
            product.newPrice = newPrice;
            product.totalPrice = totalPrice;

            products.push(product);
        }
    }
    const userInfo = order.userInfo;
    res.render('client/pages/order/success', {
        title: "Trang đặt hàng thành công",
        products,
        totalOrderPrice,
        userInfo
    });
};
