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
//Đăng kí :
router.get('/logout', userController.logout);
//Quên mật khẩu :
router.get('/password/forgot', userController.forgot);
router.post('/password/forgot', userController.forgotBE);
router.get('/password/otp', userController.opt);
router.post('/password/otp', userController.optBE);
router.get('/password/reset', userController.reset);
router.post('/password/reset', userController.resetBE);
module.exports = router;// viết như này là để sau này thêm được nhiều route hơn.