const OrderModel = require('../../models/order.model');
const AccountModel = require('../../models/account.model');
const paginationHelper = require('../../helpers/pagination.helper');
const ProductModel = require('../../models/products.model');
// [GET] /admin/orders
module.exports.orders = async (req, res) => {
    try {
        const find = { deleted: false };
        const page = parseInt(req.query.page) || 1;
        const pagination = await paginationHelper.pagination(OrderModel, page, find);

        const ordersData = await OrderModel.find(find)
            .sort({ createdAt: -1 })
            .limit(pagination.limit)
            .skip(pagination.skip)
            .lean();

        for (const order of ordersData) {
            let fullName = "Không rõ";

            if (order.userInfo?.account_id) {
                const account = await AccountModel.findOne({
                    _id: order.userInfo.account_id,
                    deleted: false
                }).lean();

                fullName = account?.fullName || "Không rõ";
            } else if (order.userInfo?.fullName) {
                fullName = order.userInfo.fullName;
            }

            order.account = { fullName };
        }

        res.render('admin/pages/orders/index', {
            title: "Trang quản lý đơn hàng",
            ordersData,
            pagination
        });
    } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
        res.redirect('/admin');
    }
};

// [GET] /admin/orders/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await OrderModel.findById(orderId).lean();

    if (!order) {
      return res.status(404).send("Đơn hàng không tồn tại");
    }

    res.render("admin/pages/orders/detail", {
      order,
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    res.status(500).send("Lỗi server");
  }
};
//[GET] : Trang chỉnh sửa :
module.exports.edit = async (req, res) => {
    try {
        const { id } = req.params;

        // Lấy thông tin đơn hàng
        const order = await OrderModel.findById(id).lean();

        if (!order) {
            return res.status(404).send("Không tìm thấy đơn hàng.");
        }

        // Lấy thêm thông tin title của sản phẩm từ bảng Product
        const populatedProducts = await Promise.all(order.products.map(async (p) => {
            const productData = await ProductModel.findById(p.product_id).lean();
            return {
                ...p,
                title: productData?.title || "Sản phẩm không rõ",
            };
        }));

        // Gán lại vào order
        order.products = populatedProducts;

        // Render trang chỉnh sửa
        res.render('admin/pages/orders/edit',  {
            title : "Trang chỉnh sửa đơn hàng",
            order
        });
    } catch (error) {
        console.error("Lỗi khi hiển thị trang chỉnh sửa đơn hàng:", error);
        res.status(500).send("Có lỗi xảy ra.");
    }
};
// [POST] /admin/orders/:id/edit
// [PATCH] /admin/orders/edit/:id
module.exports.editBE = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await OrderModel.findById(id);
        if (!order) {
            return res.status(404).send("Không tìm thấy đơn hàng.");
        }

        // Cập nhật trạng thái đơn hàng
        order.status = status;

        // Nếu trạng thái là 'delivered' thì ghi thời gian giao hàng
        if (status === 'delivered') {
            order.deliveredAt = new Date();
        }

        // Nếu trạng thái là 'completed' thì đánh dấu đã thanh toán
        if (status === 'completed') {
            order.paymentStatus = 'paid';
        }

        await order.save();

        req.flash('success', 'Cập nhật trạng thái đơn hàng thành công.');
        res.redirect(`/admin/orders/detail/${id}`);
    } catch (error) {
        console.error("Lỗi khi cập nhật đơn hàng:", error);
        res.status(500).send("Có lỗi xảy ra khi cập nhật.");
    }
};
