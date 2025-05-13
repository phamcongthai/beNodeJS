const express = require('express');
const router = express.Router()
const accountController = require('../../controllers/admin/accounts.controller');
const uploadClould = require('../../middleware/admin/uploadClould.middleware');
const validate = require('../../validates/admin/accounts.validate')
const multer = require('multer');
const upload = multer();
//Trang tài khoản : 
//[GET] : Trang tài khoản : 
router.get('/', accountController.account);

//Trang tạo mới tài khoản : 
//[GET] : Trang tạo mới tài khoản :
router.get('/create', accountController.accountCreate);
//[POST] : Tạo mới tài khoản :
router.post('/create', upload.single('avatar'),uploadClould.uploadToClould, validate.validateAccounts, accountController.accountCreateBE);

//Trang chỉnh sửa tài khoản :
//[GET] : Lấy ra trang chỉnh sửa tài khoản
router.get('/edit/:id', accountController.accountEdit);
router.patch('/edit/:id', upload.single('avatar'),uploadClould.uploadToClould, validate.validateAccounts,accountController.accountEditBE);
module.exports = router;// viết như này là để sau này thêm được nhiều route hơn.