"use strict";

var express = require('express');

var router = express.Router();

var commentController = require('../../controllers/admin/comment.controller');

var uploadClould = require('../../middleware/admin/uploadClould.middleware');

var validate = require('../../validates/admin/accounts.validate');

var multer = require('multer');

var upload = multer(); //[POST] : Trả lời bình luận của khách : 

router.post('/add/:productId', commentController.add);
module.exports = router; // viết như này là để sau này thêm được nhiều route hơn.