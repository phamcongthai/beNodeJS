const express = require('express');
const router = express.Router()
const authController = require('../../controllers/admin/auth.controller');
//Trang login :
//[GET] : Lấy ra trang login :
router.get('/login', authController.login);
//[POST] : Login :
router.post('/login', authController.loginBE);
//Trang logout :
//[GET] : Logout :
router.get('/logout', authController.logout);
module.exports = router;// viết như này là để sau này thêm được nhiều route hơn.