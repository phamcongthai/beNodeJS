"use strict";

var express = require('express');

var router = express.Router();

var userController = require('../../controllers/client/user.controller'); //Đăng kí :


router.get('/register', userController.register); //Đăng kí : 

router.post('/register', userController.registerBE); //Đăng nhập :

router.get('/login', userController.login);
router.post('/login', userController.loginBE); //Đăng kí :

router.get('/logout', userController.logout);
module.exports = router; // viết như này là để sau này thêm được nhiều route hơn.