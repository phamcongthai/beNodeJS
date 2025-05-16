const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/client/order.controller')

//[GET] : Check thông tin trước khi xử lí đặt hàng :
router.get('/', orderController.checkout);
router.post('/order', orderController.order);
//[GET] : Trang đặt hàng thành công :
router.get('/success/:order_id', orderController.success);
module.exports = router;// viết như này là để sau này thêm được nhiều route hơn.