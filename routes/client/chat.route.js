const express = require('express');
const router = express.Router()
const chatController = require('../../controllers/client/chat.controller')
const auth = require('../../middleware/client/authRequire.middleware')
//[GET] : Trang chat
router.get('/', auth.authRequire, chatController.formChat)
module.exports = router;// viết như này là để sau này thêm được nhiều route hơn.