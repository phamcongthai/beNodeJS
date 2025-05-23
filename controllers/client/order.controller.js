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
            user_id : res.locals.user._id,
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
//[GET] : Trang đơn hàng của client :
module.exports.myOrders = async (req, res) => {
    let find = {
        user_id : res.locals.user._id
    }
    const status = req.query.status;
    if(status){
        find.status = status;
    }
    
    const orders = await OrderModel.find(find)
    res.render('client/pages/order/myorders', {
        title : "Trang đơn hàng",
        orders
    })
}
//[PATCH] : Hủy đơn hàng :
module.exports.cancel = async (req, res) => {
    const order = await OrderModel.findById(req.params.id);
    if(order.status === "pending"){
        order.prevStatus = order.status;
        await OrderModel.updateOne({_id : req.params.id}, {
            status : "cancelled",
            prevStatus : order.prevStatus
        })
        req.flash("success", "Bạn đã hủy đơn hàng thành công !");
        res.redirect("back");
    }
    
}
//[PATCH] : Hoàn hủy đơn hàng :
module.exports.undoCancel = async (req, res) => {
    const order = await OrderModel.findById(req.params.id);
    await OrderModel.updateOne({_id : req.params.id}, {
            status : order.prevStatus
    })
    res.redirect("back");
} 
//[PATCH : Xác nhận đơn hàng :
module.exports.confirm = async (req, res) => {
    try {
        // Chỉ cho xác nhận nếu đơn hàng đã ở trạng thái "delivered"
        if (order.status !== 'delivered') {
            req.flash('error', 'Chỉ có thể xác nhận khi đơn hàng đã được giao.');
            return res.redirect('back');
        }

        // Cập nhật trạng thái và thời gian xác nhận
        await OrderModel.updateOne(
            { _id: req.params.id },
            {
                status: "completed",
                completedAt: new Date()
            }
        );

        req.flash('success', 'Xác nhận đã nhận hàng thành công!');
        res.redirect('back');

    } catch (err) {
        console.error('Lỗi xác nhận đơn hàng:', err);
        req.flash('error', 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
        res.redirect('back');
    }
};
