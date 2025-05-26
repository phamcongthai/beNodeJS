const BrandModel = require('../../models/brand.model');
const AccountModel = require('../../models/account.model');
const filterStatusHelper = require('../../helpers/filterStatus.helper');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination.helper');

// [GET] /admin/brands
module.exports.brand = async (req, res) => {
    const find = { deleted: false };
    const status = req.query.status;
    let filterStatus = filterStatusHelper.filterStatus();

    if (status) {
        find.status = status;
        filterStatus = filterStatusHelper.filterStatus(status);
    }

    const keyword = req.query.keyword;
    if (keyword) {
        find.name = searchHelper.search(keyword);
    }

    const page = parseInt(req.query.page) || 1;
    const pagination = await paginationHelper.pagination(BrandModel, page, find);

    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.name = "asc"; // Thêm điều kiện sắp xếp mặc định nếu cần
    }

    const brandData = await BrandModel.find(find)
        .sort(sort)
        .limit(pagination.limit)
        .skip(pagination.skip)
        .lean();

    for (const item of brandData) {
        if (item.createBy?.account_id) {
            item.account = await AccountModel.findOne({
                deleted: false,
                _id: item.createBy.account_id
            }).lean();
        } else {
            item.account = { fullName: "Không rõ" };
        }
    }
    
    res.render('admin/pages/brand/index', {
        title: "Trang quản lý thương hiệu",
        brandData,
        filterStatus,
        keyword,
        pagination,
    });
};
module.exports.changeStatus = async (req, res) => {
    const {
        status,
        id
    } = req.params;
    await BrandModel.updateOne({
        _id: id
    }, {
        status
    });
    req.flash('success', 'Cập nhật trạng thái thành công!');
    res.redirect("back");
}
//[GET] : /admin/brands/create 
module.exports.create = async (req, res) => {
    res.render('admin/pages/brand/create', {
        title : "Trang thêm thương hiệu"
    })
}
//[POST] : /admin/brands/create
module.exports.createBE = async (req, res) => {
    try {
        let data = {...req.body};
        data.createBy = {
            account_id: res.locals.currentUser._id,
            createAt: new Date()
        }
        const newBrand = new BrandModel(data);
        await newBrand.save();
        req.flash('success', 'Thêm thương hiệu thành công!');
        res.redirect('/admin/brands');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Thêm thương hiệu thất bại!');
        res.redirect('/admin/brands/create');
    }
}
// [GET] /admin/brands/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const brand = await BrandModel.findOne({
            _id: id,
            deleted: false
        }).lean();

        if (!brand) {
            req.flash('error', 'Thương hiệu không tồn tại!');
            return res.redirect('/admin/brands');
        }

        if (brand.createBy?.account_id) {
            const account = await AccountModel.findOne({
                _id: brand.createBy.account_id,
                deleted: false
            }).lean();

            if (account) {
                brand.createBy.account_id = account.fullName || account.email || "Không rõ";
            } else {
                brand.createBy.account_id = "Không rõ";
            }
        }

        res.render('admin/pages/brand/detail', {
            title: `Chi tiết thương hiệu - ${brand.name}`,
            brand
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Có lỗi xảy ra khi hiển thị chi tiết thương hiệu!');
        res.redirect('/admin/brands');
    }
};
//[GET] : /admin/brands/edit/:id :
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const brand = await BrandModel.findOne({ _id: id, deleted: false }).lean();

        if (!brand) {
            req.flash('error', 'Thương hiệu không tồn tại!');
            return res.redirect('/admin/brands');
        }

        res.render('admin/pages/brand/edit', {
            title: 'Chỉnh sửa thương hiệu',
            brand
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Lỗi khi truy cập trang chỉnh sửa!');
        res.redirect('/admin/brands');
    }
}
//[PATCH] : /admin/brands/edit/:id :
// [PATCH] /admin/brands/edit/:id
module.exports.editBE = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = { ...req.body };
        await BrandModel.updateOne({ _id: id }, updateData);
        req.flash('success', 'Cập nhật thương hiệu thành công!');
        res.redirect('/admin/brands');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Cập nhật thương hiệu thất bại!');
        res.redirect('back');
    }
};
// [PATCH] /admin/brands/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        await BrandModel.updateOne(
            { _id: id },
            { deleted: true }
        );

        req.flash('success', 'Xóa thương hiệu thành công!');
        res.redirect('/admin/brands');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Xóa thương hiệu thất bại!');
        res.redirect('back');
    }
};

