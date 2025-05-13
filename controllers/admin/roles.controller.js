//TRANG NHÓM QUYỀN :
//[GET] : Lấy ra trang nhóm quyền :
const RolesModel = require('../../models/roles.model');
module.exports.roles = async (req, res) => {
    const find = {
        deleted: false
    }
    const roles = await RolesModel.find(find);
    res.render('admin/pages/roles/index', {
        title: "Trang nhóm quyền",
        roles: roles
    })
}
// TẠO MƠÍ NHÓM QUYỀN :
//[GET] : Lấy ra trang tạo mới nhóm quyền :
module.exports.rolesCreate = async (req, res) => {
    res.render('admin/pages/roles/create', {
        title: "Trang tạo mới nhóm quyền"
    })
}
//[POST] : Taọ mới nhóm quyền :
module.exports.rolesCreateBE = async (req, res) => {
    const record = new RolesModel(req.body);
    await record.save();
    res.redirect("/admin/roles");
}
//Trang chi tiết nhóm quyền :
//[GET] : Trang chi tiết nhóm quyền :
module.exports.rolesDetail = async (req, res) => {
    const find = {
        deleted: false,
        _id: req.params.id
    }

    const roles = await RolesModel.findOne(find);
    res.render(`admin/pages/roles/detail`, {
        title: "Trang chi tiết nhóm quyền",
        roles: roles
    })
}
//Trang sửa nhóm quyền :
//[GET] : Trang sửa nhóm quyền :
module.exports.rolesEdit = async (req, res) => {
    const find = {
        deleted: false,
        _id: req.params.id
    }
    const roles = await RolesModel.findOne(find);
    res.render(`admin/pages/roles/edit`, {
        title: "Trang chỉnh sửa nhóm quyền",
        roles: roles
    })
}
//[PATCH] : Chỉnh sửa nhóm quyền :
module.exports.rolesEditBE = async (req, res) => {
    try {
        await RolesModel.updateOne({
            _id: req.params.id
        }, req.body);
    } catch (error) {
        console.log(error);

    }
    res.redirect("/admin/roles");
}
//Trang phân quyền :
//[GET] : Trang phân quyền :
module.exports.rolesPermissions = async (req, res) => {
    let find = {
        deleted: false
    }
    const roles = await RolesModel.find(find);
    
    res.render('admin/pages/roles/permissions', {
        title: "Trang phân quyền",
        roles: roles
    })
}
//[PATCH] : Trang phân quyền :
module.exports.rolesPermissionsBE = async (req, res) => {
    const result = JSON.parse(req.body.permissions);
    //Vì ô input nó không chứa mảng được nên phải chuyển sang json và ở bên đây phải chuyển lại.
    for (const item of result) {
        await RolesModel.updateOne(
          { _id: item.id },
          { permissions: item.permissions }
        );
      }
   //For of hỗ trợ bất đồng bộ
   req.flash('success', "Phân quyền thành công !")
    res.redirect("back");
}