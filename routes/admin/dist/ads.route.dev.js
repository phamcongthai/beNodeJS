"use strict";

var express = require('express');

var router = express.Router();

var uploadClould = require('../../middleware/admin/uploadClould.middleware');

var multer = require('multer');

var upload = multer();

var adsController = require('../../controllers/admin/ads.controller'); // [GET] : Trang danh sách quảng cáo


router.get('/', adsController.ads); // [GET] : Trang tạo quảng cáo

router.get('/create', adsController.create); // [POST] : Xử lý tạo quảng cáo

router.post('/create', upload.single('image'), uploadClould.uploadToClould, adsController.createBE); // [GET] : Trang chi tiết quảng cáo

router.get('/detail/:id', adsController.detail); // [GET] : Trang chỉnh sửa quảng cáo

router.get('/edit/:id', adsController.edit); // [PATCH] : Xử lý chỉnh sửa quảng cáo

router.patch('/edit/:id', upload.single('image'), uploadClould.uploadToClould, adsController.editBE); // [PATCH] : Thay đổi trạng thái quảng cáo

router.patch('/change-status/:status/:id', adsController.changeStatus); // [DELETE] : Xóa quảng cáo

router.get('/delete/:id', adsController["delete"]);
module.exports = router;