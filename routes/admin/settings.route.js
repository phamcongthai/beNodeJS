const express = require('express');
const router = express.Router()
const settingController = require('../../controllers/admin/settings.controller')
const uploadClould = require('../../middleware/admin/uploadClould.middleware');
const validate = require('../../validates/admin/accounts.validate')
const multer = require('multer');
const upload = multer();
//Trang cài đặt chung : 
//[GET] : Trang cài đặt chung : 
router.get('/general', settingController.general);
router.patch('/general', upload.single('logo'),uploadClould.uploadToClould, settingController.generalBE);
module.exports = router;