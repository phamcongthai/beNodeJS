"use strict";

var express = require('express');

var router = express.Router();

var chatController = require('../../controllers/client/chat.controller');

var auth = require('../../middleware/client/authRequire.middleware'); //[GET] : Trang chat


router.get('/', auth.authRequire, chatController.formChat);
module.exports = router; // viết như này là để sau này thêm được nhiều route hơn.