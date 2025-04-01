const express = require('express');
const router = express.Router()
const dashboardController = require('../../controllers/admin/dashboard.controller')
router.get('/', dashboardController.index);

module.exports = router;// viết như này là để sau này thêm được nhiều route hơn.