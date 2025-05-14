const express = require('express');
const router = express.Router()
const cartController = require('../../controllers/client/cart.controller')

//[GET] : Trang giỏ hàng :
router.get('/', cartController.cart)
//[POST] : Thêm sản phẩm vào giỏ hàng : 
router.post('/add/:id', cartController.addCart);
//[GET] : Xóa sản phẩm khỏi giỏ hàng : (Dùng get cho dễ)
router.get('/delete/:id', cartController.deleteProducts);
//[GET] : Cập nhật sản phẩm : (Dùng get cho dễ)
router.get('/update/:productId/:quantity', cartController.updateProducts)
module.exports = router;// viết như này là để sau này thêm được nhiều route hơn.