const express = require('express');
const router = express.Router()
const productController = require('../../controllers/admin/products.controller')
const multer  = require('multer');
const upload = multer({ dest: './public/uploads/' });//nó đứng từ thư mục gốc to nhất ngoài cùng.
const validateProducts = require('../../validates/admin/products.validate');
router.get('/', productController.products);
router.patch('/change-status/:status/:id',productController.changeStatus );
router.patch('/change-multi', productController.changeMulti);
router.delete('/deleteT/:id', productController.deleteT);

//Tạo mới sản phẩm.
router.get('/create', productController.createProducts);
router.post(
    '/create', 
    upload.single('thumbnail'), 
    validateProducts.validateCreateProducts,
    productController.createProductsBE
);
//Chỉnh sửa sản phẩm.
router.get('/edit/:id', productController.editProduct);
router.patch(
    '/edit/:id', 
    upload.single('thumbnail'), 
    validateProducts.validateCreateProducts,
    productController.editProductBE);
module.exports = router;// viết như này là để sau này thêm được nhiều route hơn.
//Chi tiết sản phẩm :
router.get('/detail/:id', productController.detailProducts);