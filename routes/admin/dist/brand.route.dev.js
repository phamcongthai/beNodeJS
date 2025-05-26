"use strict";

var express = require('express');

var router = express.Router();

var brandController = require('../../controllers/admin/brand.controller');

var uploadClould = require('../../middleware/admin/uploadClould.middleware');

var validate = require('../../validates/admin/accounts.validate');

var multer = require('multer');

var upload = multer(); //Trang thương hiệu : 
//[GET] : Trang thương hiệu : 

router.get('/', brandController.brand); //[PATCH] : Thay đổi trạng thái :

router.patch('/change-status/:status/:id', brandController.changeStatus); //[GET] : Trang tạo thương hiệu :

router.get('/create', brandController.create); //[POST] : Trang tạo thương hiệu :

router.post('/create', upload.single('logo'), uploadClould.uploadToClould, brandController.createBE); //[GET] : Trang chi tiết thương hiệu :

router.get('/detail/:id', brandController.detail); //[GET] : Trang chỉnh sửa thương hiệu : 

router.get('/edit/:id', brandController.edit);
router.patch('/edit/:id', upload.single('logo'), uploadClould.uploadToClould, brandController.editBE); //[DELETE] : Xóa thương hiệu :

router.get('/delete/:id', brandController["delete"]);
module.exports = router; // viết như này là để sau này thêm được nhiều route hơn.