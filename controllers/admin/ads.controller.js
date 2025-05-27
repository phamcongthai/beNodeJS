const AdsModel = require('../../models/ads.model');
const AccountModel = require('../../models/account.model');
const filterStatusHelper = require('../../helpers/filterStatus.helper');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination.helper');

// [GET] /admin/ads
module.exports.ads = async (req, res) => {
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
    const pagination = await paginationHelper.pagination(AdsModel, page, find);

    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.name = "asc";
    }

    const adsData = await AdsModel.find(find)
        .sort(sort)
        .limit(pagination.limit)
        .skip(pagination.skip)
        .lean();

    for (const item of adsData) {
        if (item.createBy?.account_id) {
            item.account = await AccountModel.findOne({
                deleted: false,
                _id: item.createBy.account_id
            }).lean();
        } else {
            item.account = { fullName: "Không rõ" };
        }
    }

    res.render('admin/pages/ads/index', {
        title: "Trang quản lý quảng cáo",
        adsData,
        filterStatus,
        keyword,
        pagination,
    });
};

// [PATCH] /admin/ads/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const { status, id } = req.params;
    await AdsModel.updateOne({ _id: id }, { status });
    req.flash('success', 'Cập nhật trạng thái thành công!');
    res.redirect("back");
};

// [GET] /admin/ads/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/ads/create', {
        title: "Trang thêm quảng cáo"
    });
};

// [POST] /admin/ads/create
const BASE_URL = process.env.BASE_URL; // Nhớ có biến này trong .env

module.exports.createBE = async (req, res) => {
    try {
        let data = { ...req.body };

        // Gắn URL đầy đủ nếu targetUrl không bắt đầu bằng http
        if (data.targetUrl && !data.targetUrl.startsWith('http')) {
            data.targetUrl = `${BASE_URL}${data.targetUrl}`;
        }
        if (req.file && req.file.pathCloud) {
            data.image = req.file.pathCloud;
        }

        data.createBy = {
            account_id: res.locals.currentUser._id,
            createdAt: new Date()
        };

        const newAds = new AdsModel(data);
        await newAds.save();

        req.flash('success', 'Thêm quảng cáo thành công!');
        res.redirect('/admin/ads');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Thêm quảng cáo thất bại!');
        res.redirect('/admin/ads/create');
    }
};

// [GET] /admin/ads/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const ads = await AdsModel.findOne({
            _id: id,
            deleted: false
        }).lean();

        if (!ads) {
            req.flash('error', 'Quảng cáo không tồn tại!');
            return res.redirect('/admin/ads');
        }

        if (ads.createBy?.account_id) {
            const account = await AccountModel.findOne({
                _id: ads.createBy.account_id,
                deleted: false
            }).lean();

            ads.createBy.account_id = account?.fullName || account?.email || "Không rõ";
        }

        res.render('admin/pages/ads/detail', {
            title: `Chi tiết quảng cáo - ${ads.name}`,
            ads
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Có lỗi xảy ra khi hiển thị chi tiết quảng cáo!');
        res.redirect('/admin/ads');
    }
};

// [GET] /admin/ads/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const ads = await AdsModel.findOne({ _id: id, deleted: false }).lean();

        if (!ads) {
            req.flash('error', 'Quảng cáo không tồn tại!');
            return res.redirect('/admin/ads');
        }

        res.render('admin/pages/ads/edit', {
            title: 'Chỉnh sửa quảng cáo',
            ads
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Lỗi khi truy cập trang chỉnh sửa!');
        res.redirect('/admin/ads');
    }
};

// [PATCH] /admin/ads/edit/:id
module.exports.editBE = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = { ...req.body };

        if (req.file && req.file.path) {
            updateData.image = req.file.path;
        }

        await AdsModel.updateOne({ _id: id }, updateData);
        req.flash('success', 'Cập nhật quảng cáo thành công!');
        res.redirect('/admin/ads');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Cập nhật quảng cáo thất bại!');
        res.redirect('back');
    }
};

// [GET] /admin/ads/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        await AdsModel.updateOne(
            { _id: id },
            { deleted: true }
        );

        req.flash('success', 'Xóa quảng cáo thành công!');
        res.redirect('/admin/ads');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Xóa quảng cáo thất bại!');
        res.redirect('back');
    }
};
