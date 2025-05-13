const express = require('express');
const router = express.Router()
const rolesController = require('../../controllers/admin/roles.controller');
//Trang nhóm quyền : 
router.get('/', rolesController.roles);
//Trang tạo mới nhóm quyền và BE :
router.get('/create', rolesController.rolesCreate);
router.post('/create', rolesController.rolesCreateBE);
//Trang chi tiết nhóm quyền :
router.get('/detail/:id', rolesController.rolesDetail);
//Trang chỉnh sửa nhóm quyền và BE :
router.get('/edit/:id', rolesController.rolesEdit);
router.patch('/edit/:id', rolesController.rolesEditBE);
//Trang phân quyền :
router.get('/permissions', rolesController.rolesPermissions)
router.patch('/permissions', rolesController.rolesPermissionsBE)

module.exports = router;// viết như này là để sau này thêm được nhiều route hơn.