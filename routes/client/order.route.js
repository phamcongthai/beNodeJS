const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/client/order.controller')
const auth = require('../../middleware/client/authRequire.middleware')
//[GET] : Check thông tin trước khi xử lí đặt hàng :
router.get('/', auth.authRequire, orderController.checkout);
router.post('/order', auth.authRequire, orderController.order);
//[GET] : Trang đặt hàng thành công :
router.get('/success/:order_id', auth.authRequire, orderController.success);
module.exports = router;// viết như này là để sau này thêm được nhiều route hơn.