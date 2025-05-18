"use strict";

var express = require('express');

var router = express.Router();

var cartController = require('../../controllers/client/cart.controller');

var auth = require('../../middleware/client/authRequire.middleware'); //[GET] : Trang giỏ hàng :


router.get('/', auth.authRequire, cartController.cart); //[POST] : Thêm sản phẩm vào giỏ hàng : 

router.post('/add/:id', auth.authRequire, cartController.addCart); //[GET] : Xóa sản phẩm khỏi giỏ hàng : (Dùng get cho dễ)

router.get('/delete/:id', auth.authRequire, cartController.deleteProducts); //[GET] : Cập nhật sản phẩm : (Dùng get cho dễ)

router.get('/update/:productId/:quantity', auth.authRequire, cartController.updateProducts);
module.exports = router; // viết như này là để sau này thêm được nhiều route hơn.