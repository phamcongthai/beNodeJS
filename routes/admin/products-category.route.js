const express = require('express');
const router = express.Router()
const productsCategoryController = require('../../controllers/admin/product-category.controller');
const validateProducts = require('../../validates/admin/products.validate');
//
const uploadClould = require('../../middleware/admin/uploadClould.middleware');
//
const multer = require('multer');
const upload = multer();
//[GET] : Lấy ra giao diện trang danh mục sản phẩm.
router.get('/', productsCategoryController.products_category);
//[GET] : Lấy ra trang tạo mới danh mục sản phẩm.
router.get('/create', productsCategoryController.products_categoryCreate);
//[PATCH] : Thay đổi ở ô check box.
router.patch('/change-multi', productsCategoryController.changeMulti);
//[PATCH] : Thay đổi ở nút trạng thái
router.patch('/change-status/:status/:id', productsCategoryController.changeStatus);
//[POST] : Tạo mới danh mục sản phẩm
router.post(
  '/create',
  upload.single('thumbnail'),
  uploadClould.uploadToClould,
  validateProducts.validateCreateProducts,
  productsCategoryController.products_categoryCreateBE
);
//[GET] : Lấy ra giao diện trang chỉnh sửa danh mục sản phẩm
router.get('/edit/:id', 
  productsCategoryController.editCategory
)
//[PATCH] : Gửi data cập nhật chỉnh sửa danh mục sản phẩm 
router.patch('/edit/:id',
  upload.single('thumbnail'),
  uploadClould.uploadToClould,
  validateProducts.validateCreateProducts,
  productsCategoryController.editCategoryBE
)
//[GET] : Xóa :
router.get('/delete/:id', productsCategoryController.deleteCategory);
module.exports = router;
