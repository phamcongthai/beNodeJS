const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/client/order.controller')
const auth = require('../../middleware/client/authRequire.middleware')
//[GET] : Check thông tin trước khi xử lí đặt hàng :
router.get('/', auth.authRequire, orderController.checkout);
router.post('/order', auth.authRequire, orderController.order);
//[GET] : Trang đơn hàng của client :
router.get('/myorder', auth.authRequire, orderController.myOrders);
//[GET] : Trang đặt hàng thành công :
router.get('/success/:order_id', auth.authRequire, orderController.success);
//[PATCH] : Hủy đơn hàng :
router.patch('/cancel/:id', auth.authRequire, orderController.cancel);
//[PATCH] : Hoàn hủy đơn :
router.patch('/undo-cancel/:id', auth.authRequire, orderController.undoCancel);
//[PATCH] : Xác nhận đã nhận hàng :
router.patch('/confirm-delivery/:id', auth.authRequire, orderController.confirm);
module.exports = router;// viết như này là để sau này thêm được nhiều route hơn.