const express = require('express');
const router = express.Router()
const homeController = require('../../controllers/client/home.controller')
router.get('/', homeController.index);

module.exports = router;// viết như này là để sau này thêm được nhiều route hơn.