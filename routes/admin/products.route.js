const express = require('express');
const router = express.Router()
const productController = require('../../controllers/admin/products.controller')
//Upload ảnh
const multer = require('multer');
const upload = multer();
//

const validateProducts = require('../../validates/admin/products.validate');
//
const uploadClould = require('../../middleware/admin/uploadClould.middleware');
//
const uploadMultilClould = require("../../middleware/admin/uploadMultiImg.middleware");
router.get('/', productController.products);
router.patch('/change-status/:status/:id', productController.changeStatus);
router.patch('/change-multi', productController.changeMulti);
router.delete('/deleteT/:id', productController.deleteT);

//Tạo mới sản phẩm.
router.get('/create', productController.createProducts);
router.post(
  '/create',
  upload.single('thumbnail'),
  uploadClould.uploadToClould,
  validateProducts.validateCreateProducts,
  productController.createProductsBE
);
//Chỉnh sửa sản phẩm.
router.get('/edit/:id', productController.editProduct);
// router.patch(
//   '/edit/:id',
//   upload.single('thumbnail'),
//   uploadClould.uploadToClould,
//   validateProducts.validateCreateProducts,
//   productController.editProductBE);
router.patch(
  '/edit/:id',
  upload.array('thumbnail[]'), // multer nhận nhiều ảnh trong field 'thumbnail'
  uploadMultilClould.uploadMultipleToCloud, // middleware upload mảng ảnh lên Cloudinary
  validateProducts.validateCreateProducts,
  productController.editProductBE
);

module.exports = router; // viết như này là để sau này thêm được nhiều route hơn.
//Chi tiết sản phẩm :
router.get('/detail/:id', productController.detailProducts);