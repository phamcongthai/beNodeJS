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
//[GET] : Trang thanh toán 
module.exports.order = async (req, res) => {
    try {
        console.log(req.body);
        const userInfo = {
            fullName: req.body.fullName,
            phone: req.body.phone,
            address: req.body.address,
        };
        const paymentMethod = req.body.paymentMethod;
        const cart = res.locals.miniCart; // Lấy giỏ hàng
        const products = [];

        let totalPrice = 0; // Khởi tạo biến tổng tiền

        // Lấy thông tin sản phẩm trong giỏ hàng
        for (const item of cart.products) {
            const product = await ProductModel.findById(item.products_id);
            if (product) {
                const productTotal = product.price * item.quantity * (1 - (product.discountPercentage || 0) / 100);
                totalPrice += productTotal;

                products.push({
                    product_id: product._id,
                    title: product.title,               // Thêm trường title ở đây
                    price: product.price,
                    discountPercentage: product.discountPercentage,
                    quantity: item.quantity,
                    thumbnail: product.thumbnail        // Thêm trường thumbnail
                });
            }
        }

        const cart_id = cart._id;

        // Tạo đơn hàng, thêm trường totalPrice
        const order = new OrderModel({
            userInfo: userInfo,
            products: products,
            cart_id: cart_id,
            paymentMethod: paymentMethod,
            totalPrice: totalPrice  // Thêm trường totalPrice ở đây
        });

        await order.save();

        // Xử lý giỏ hàng và cookie như cũ
        await CartModel.findByIdAndDelete(cart._id);
        res.clearCookie("cartId");
        if (cart.user_id) {
            const newCart = new CartModel({
                user_id: cart.user_id,
                products: []
            });
            await newCart.save();

            res.cookie("cartId", newCart._id.toString(), {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
            });
        }
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
    const paymentMethod = order.paymentMethod;
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
        userInfo,
        paymentMethod
    });
};