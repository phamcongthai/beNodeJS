const express = require('express');
const router = express.Router()
const productsController = require('../../controllers/client/products.controller')
router.get('/', productsController.products);
//Chi tiết sản phẩm :
router.get('/detail/:slug', productsController.productsDetail);
//Chọn danh mục :
router.get('/:slug', productsController.productsCategory);
module.exports = router;// viết như này là để sau này thêm được nhiều route hơn.