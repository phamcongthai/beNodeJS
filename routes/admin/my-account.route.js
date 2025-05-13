const express = require('express');
const router = express.Router()
const my_accountController = require('../../controllers/admin/my_account.controller')
const uploadClould = require('../../middleware/admin/uploadClould.middleware');
const validate = require('../../validates/admin/accounts.validate')
const multer = require('multer');
const upload = multer();
//Trang tài khoản : 
//[GET] : Trang tài khoản : 
router.get('/', my_accountController.account);
//[GET] : Trang chỉnh sửa thông tin cá nhân :
router.get('/edit', upload.single('avatar'),uploadClould.uploadToClould, my_accountController.accountEdit);
router.patch('/edit', upload.single('avatar'),uploadClould.uploadToClould, my_accountController.accountEditBE);
module.exports = router;