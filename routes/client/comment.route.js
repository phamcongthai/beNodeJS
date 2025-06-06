const express = require('express');
const router = express.Router()
const commentController = require('../../controllers/client/comment.controller');
const auth = require('../../middleware/client/authRequire.middleware')
//[POST : Thêm bình luận :
router.post('/add/:productSlug', auth.authRequire, commentController.addComment);
module.exports = router;// viết như này là để sau này thêm được nhiều route hơn.