const express = require('express');
const router = express.Router()
const searchController = require('../../controllers/client/search.controller');
router.get('/', searchController.search); //Không cần đưa ? keyword vào
router.post('/suggest', searchController.suggest);
module.exports = router;