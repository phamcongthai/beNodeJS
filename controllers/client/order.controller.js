const CartModel = require('../../models/cart.model');
const ProductModel = require('../../models/products.model');
const OrderModel = require('../../models/order.model');
const createPayment = require('../../helpers/vnpay.helper');
const {
    VNPay,
    ignoreLogger
} = require('vnpay');
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
//[GET] : Trang tạo đơn hàng 
// [POST] : Tạo đơn hàng
module.exports.order = async (req, res) => {
    try {
        const {
            fullName,
            phone,
            address,
            paymentMethod
        } = req.body;
        const userInfo = { fullName, phone, address };
        const cart = res.locals.miniCart;
        const products = [];
        let totalPrice = 0;

        // Tính tổng tiền và lấy thông tin chi tiết sản phẩm
        for (const item of cart.products) {
            const product = await ProductModel.findById(item.products_id);
            if (product) {
                const discountPercentage = product.discountPercentage || 0;
                const newPrice = product.price * (1 - discountPercentage / 100);
                const priceAfterDiscount = Math.round(newPrice * item.quantity);
                totalPrice += priceAfterDiscount;

                products.push({
                    product_id: product._id,
                    title: product.title,
                    price: product.price,
                    discountPercentage,
                    newPrice,
                    quantity: item.quantity,
                    thumbnail: product.thumbnail,
                    slug: product.slug,
                });
            }
        }

        // Tạo đơn hàng mới
        const order = new OrderModel({
            user_id: res.locals.user._id,
            userInfo,
            products,
            cart_id: cart._id,
            paymentMethod,
            totalPrice,
        });

        await order.save();

        // ✅ Nếu là COD thì xoá giỏ hàng ngay
        if (paymentMethod === 'cod') {
            await CartModel.findByIdAndDelete(cart._id);
            res.clearCookie('cartId');

            if (cart.user_id) {
                const newCart = new CartModel({ user_id: cart.user_id, products: [] });
                await newCart.save();
                res.cookie('cartId', newCart._id.toString(), {
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
                });
            }

            return res.redirect(`/checkout/success/${order._id}`);
        }

        // Nếu là thanh toán online, redirect tới cổng VNPAY
        const vnpUrl = await createPayment(Math.round(totalPrice), order._id.toString(), req.ip || '127.0.0.1');
        return res.redirect(vnpUrl);

    } catch (error) {
        console.error('Lỗi khi tạo đơn hàng:', error);
        res.redirect('back');
    }
};

//[GET] : Thành công !
// [GET] : Trang thanh toán thành công
module.exports.success = async (req, res) => {
    const order_id = req.params.order_id;
    const order = await OrderModel.findById(order_id).lean();
    const paymentMethod = order.paymentMethod;

    if (paymentMethod === "online") {
        const vnpay = new VNPay({
            tmnCode: process.env.vnp_TmnCode,
            secureSecret: process.env.vnp_HashSecret,
            testMode: true,
            enableLog: true,
        });

        const verify = vnpay.verifyReturnUrl(req.query);

        if (!verify.isVerified) {
            return res.send('Xác thực tính toàn vẹn dữ liệu thất bại');
        }

        if (!verify.isSuccess) {
            return res.send('Đơn hàng thanh toán thất bại');
        }
    }

    // Tính tổng từng sản phẩm
    for (const item of order.products) {
        item.total = item.quantity * item.newPrice;
    }

    res.render('client/pages/order/success', {
        title: "Trang đặt hàng thành công",
        order,
    });
};

//[POST] : IPN thanh toán :
module.exports.vnpayIpn = async (req, res) => {
    try {
        const vnpay = new VNPay({
            tmnCode: process.env.vnp_TmnCode,
            secureSecret: process.env.vnp_HashSecret,
            testMode: true,
            enableLog: true,
        });

        const verify = vnpay.verifyIpnCall(req.query);

        // Lấy mã đơn hàng từ URL
        const orderId = req.query.vnp_TxnRef;
        const responseCode = req.query.vnp_ResponseCode;

        if (!verify.isVerified) {
            return res.status(400).json({ RspCode: '97', Message: 'Sai checksum' });
        }

        const order = await OrderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ RspCode: '01', Message: 'Không tìm thấy đơn hàng' });
        }

        if (order.paymentStatus === 'paid') {
            return res.status(200).json({ RspCode: '02', Message: 'Đơn hàng đã được thanh toán' });
        }

        if (responseCode === '00') {
            order.paymentStatus = 'paid';

            // Xoá giỏ hàng nếu thanh toán thành công
            if (order.cart_id) {
                await CartModel.findByIdAndDelete(order.cart_id);
            }
        } else {
            order.paymentStatus = 'fail';
        }

        await order.save();
        return res.status(200).json({ RspCode: '00', Message: 'Xác nhận thành công' });
    } catch (error) {
        console.error("Lỗi IPN:", error);
        return res.status(500).json({ RspCode: '99', Message: 'Lỗi server' });
    }
};


//[GET]: Lấy ra đơn hàng người dùng
module.exports.myOrders = async (req, res) => {
    let find = {
        user_id: res.locals.user._id // Lọc theo user_id của người dùng
    }

    // Lọc theo trạng thái nếu có
    const status = req.query.status;
    if (status) {
        find.status = status;
    }

    // Lọc theo từ khóa tìm kiếm (ID đơn hàng hoặc tên sản phẩm)
    const keywordOrder = req.query.keywordOrder;
    if (keywordOrder) {
        // Kiểm tra xem từ khóa có phải là ObjectId hợp lệ không
        if (/^[0-9a-fA-F]{24}$/.test(keywordOrder)) {
            // Nếu là ObjectId hợp lệ, tìm theo _id
            find._id = keywordOrder;
        } else {
            // Nếu không phải ObjectId, tìm theo tên sản phẩm
            find['products.title'] = {
                $regex: keywordOrder,
                $options: 'i'
            };
        }
    }

    // Tìm kiếm đơn hàng theo điều kiện
    const orders = await OrderModel.find(find);

    // Render kết quả tìm kiếm
    res.render('client/pages/order/myorders', {
        title: "Trang đơn hàng",
        orders,
        keywordOrder
    });
};
//[PATCH] : Hủy đơn hàng :
module.exports.cancel = async (req, res) => {
    const order = await OrderModel.findById(req.params.id);
    if (order.status === "pending") {
        order.prevStatus = order.status;
        await OrderModel.updateOne({
            _id: req.params.id
        }, {
            status: "cancelled",
            prevStatus: order.prevStatus
        })
        req.flash("success", "Bạn đã hủy đơn hàng thành công !");
        res.redirect("back");
    }

}
//[PATCH] : Hoàn hủy đơn hàng :
module.exports.undoCancel = async (req, res) => {
    const order = await OrderModel.findById(req.params.id);
    await OrderModel.updateOne({
        _id: req.params.id
    }, {
        status: order.prevStatus
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
        await OrderModel.updateOne({
            _id: req.params.id
        }, {
            status: "completed",
            completedAt: new Date()
        });

        req.flash('success', 'Xác nhận đã nhận hàng thành công!');
        res.redirect('back');

    } catch (err) {
        console.error('Lỗi xác nhận đơn hàng:', err);
        req.flash('error', 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
        res.redirect('back');
    }
};
//[PATCH] : Yêu cầu hủy khi đang ở trạng thái đang chuẩn bị hàng :
module.exports.requestCancel = async (req, res) => {
    try {
        const order = await OrderModel.findById(req.params.id);
        if (order) {
            if (order.status === "preparing" && order.cancelRequest === false) {
                await OrderModel.updateOne({
                    _id: req.params.id
                }, {
                    cancelRequest: true
                })
                req.flash('success', "Đã gửi thông báo thành công !");
            }
        }
        res.redirect("back");
    } catch (error) {
        console.log(error);
        req.flash('error', 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
        res.redirect("back");
    }
}