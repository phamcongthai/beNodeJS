"use strict";

var express = require('express');

var router = express.Router();

var searchController = require('../../controllers/client/search.controller');

router.get('/', searchController.search); //Không cần đưa ? keyword vào

router.post('/suggest', searchController.suggest);
module.exports = router;