const express = require('express');
const router = express.Router()
const userController = require('../../controllers/client/user.controller')

//Đăng kí :
router.get('/register', userController.register);
//Đăng kí : 
router.post('/register', userController.registerBE);
//Đăng nhập :
router.get('/login', userController.login);
router.post('/login', userController.loginBE);
module.exports = router;// viết như này là để sau này thêm được nhiều route hơn.