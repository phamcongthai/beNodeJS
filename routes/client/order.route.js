const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/client/order.controller')

//[GET] : Check thông tin trước khi xử lí đặt hàng :
router.get('/', orderController.checkout);
router.post('/order', orderController.order)
module.exports = router;// viết như này là để sau này thêm được nhiều route hơn.