"use strict";

var express = require('express');

var router = express.Router();

var ordersController = require('../../controllers/admin/orders.controller'); //Trang quản lí đơn hàng : 


router.get('/', ordersController.orders); //Trang chi tiết đơn hàng :

router.get('/detail/:id', ordersController.detail); //Trang chỉnh sửa đơn hàng :

router.get('/edit/:id', ordersController.edit);
router.patch('/edit/:id', ordersController.editBE);
module.exports = router; // viết như này là để sau này thêm được nhiều route hơn.