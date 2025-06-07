const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/admin/comment.controller');
const uploadClould = require('../../middleware/admin/uploadClould.middleware');
const validate = require('../../validates/admin/accounts.validate')
const multer = require('multer');
const upload = multer();
//[POST] : Trả lời bình luận của khách : 
router.post('/add/:productId', commentController.add);

module.exports = router; // viết như này là để sau này thêm được nhiều route hơn.