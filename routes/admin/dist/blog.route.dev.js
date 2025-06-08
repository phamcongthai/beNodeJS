"use strict";

var express = require('express');

var router = express.Router();

var blogController = require('../../controllers/admin/blog.controller'); // [GET] : Trang danh sách bài viết


router.get('/', blogController.blog); // [GET] : Trang tạo bài viết

router.get('/create', blogController.create); // [POST] : Xử lý tạo bài viết

router.post('/create', blogController.createBE); // [GET] : Trang chi tiết bài viết

router.get('/detail/:id', blogController.detail); // [GET] : Trang chỉnh sửa bài viết

router.get('/edit/:id', blogController.edit); // [PATCH] : Xử lý chỉnh sửa bài viết

router.patch('/edit/:id', blogController.editBE); // [DELETE] : Xóa bài viết

router.get('/delete/:id', blogController["delete"]);
module.exports = router;