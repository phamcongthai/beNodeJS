"use strict";

var express = require('express');

var router = express.Router();

var blogController = require('../../controllers/client/blog.controller'); // [GET] : Trang danh sách bài viết


router.get('/:slug', blogController.blog);
module.exports = router;