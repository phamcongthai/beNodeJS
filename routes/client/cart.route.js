const express = require('express');
const router = express.Router()
const cartController = require('../../controllers/client/cart.controller')
router.post('/add/:id', cartController.cart);

module.exports = router;// viết như này là để sau này thêm được nhiều route hơn.