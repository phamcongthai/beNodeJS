"use strict";

var express = require('express');

var router = express.Router();

var settingController = require('../../controllers/admin/settings.controller');

var uploadClould = require('../../middleware/admin/uploadClould.middleware');

var validate = require('../../validates/admin/accounts.validate');

var multer = require('multer');

var upload = multer(); //Trang cài đặt chung : 
//[GET] : Trang cài đặt chung : 

router.get('/general', settingController.general);
router.patch('/general', upload.single('logo'), uploadClould.uploadToClould, settingController.generalBE);
module.exports = router;