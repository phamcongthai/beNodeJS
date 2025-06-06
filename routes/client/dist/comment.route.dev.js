"use strict";

var express = require('express');

var router = express.Router();

var commentController = require('../../controllers/client/comment.controller');

var auth = require('../../middleware/client/authRequire.middleware'); //[POST : Thêm bình luận :


router.post('/add/:productSlug', auth.authRequire, commentController.addComment);
module.exports = router; // viết như này là để sau này thêm được nhiều route hơn.