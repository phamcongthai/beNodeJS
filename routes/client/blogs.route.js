const express = require('express');
const router = express.Router();
const blogController = require('../../controllers/client/blog.controller');

// [GET] : Trang danh sách bài viết
router.get('/:slug', blogController.blog);
module.exports = router;
