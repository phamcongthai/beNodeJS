const ProductsCategoryModel = require('../../models/products-category.model');
const searchHelper = require('../../helpers/search');
const filterStatusHelper = require('../../helpers/filterStatus.helper');
const createTreeHelper = require('../../helpers/createTree.helper');
//[GET] : Lấy ra trang danh mục sản phẩm:
module.exports.products_category = async (req, res) => {
    const find = { deleted: false };
    const keySearch = req.query.keyword;

    if (keySearch) {
        find.title = searchHelper.search(keySearch);
    }

    let filterStatus = filterStatusHelper.filterStatus();
    const status = req.query.status;
    if (status) {
        find.status = status;
        filterStatus = filterStatusHelper.filterStatus(status);
    }

    const sort = {};
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    if (sortKey && sortValue) {
        sort[sortKey] = sortValue;
    } else {
        sort.position = "asc";
    }

    const category = await ProductsCategoryModel.find(find).sort(sort);
    const newCategory = createTreeHelper(category);

    res.render('admin/pages/products-category/index', {
        title: "Trang danh mục sản phẩm",
        category: newCategory,
        keySearch,
        filterStatus
    });
};


////Change multi :
module.exports.changeMulti = async (req, res) => {
    try {
        const status = req.body.type;
        let ids = req.body.ids;


        if (status === "changePosition") {
            ids = JSON.parse(ids);
            let tmp = [];

            // Tạo danh sách cập nhật
            ids.forEach(item => {
                const [id, position] = item.split('-');
                tmp.push({
                    id,
                    position: parseInt(position)
                });
            });

            // Dùng for...of để chờ từng lần cập nhật hoàn tất
            for (const item of tmp) {
                await ProductsCategoryModel.updateOne({
                    _id: item.id
                }, {
                    position: item.position
                });
            }
        } else if (status !== "deleteAll") {
            ids = JSON.parse(ids);
            await ProductsCategoryModel.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: status
            });
        } else {
            ids = JSON.parse(ids);
            await ProductsCategoryModel.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                deleted: true,
                deletedTime: new Date()
            });
        }

        res.redirect("back");
    } catch (error) {
        console.error("Lỗi trong changeMulti:", error);
        res.status(500).send("Lỗi server");
    }
};

//Xóa tạm thời  :
module.exports.deleteCategory = async (req, res) => {
    await ProductsCategoryModel.updateOne({_id : req.params.id}, {deleted : true});
    res.redirect("/admin/products-category");
} 
//Tạo mới danh mục sản phẩm :
module.exports.products_categoryCreate = async (req, res) => {
    try {
        const find = { deleted: false };
        const category = await ProductsCategoryModel.find(find);

        const newCategory = category.length > 0 ? createTreeHelper(category) : [];

        res.render("admin/pages/products-category/createCategory", {
            title: "Trang tạo mới danh mục sản phẩm",
            category: newCategory
        });
    } catch (error) {
        console.error("Lỗi khi tạo cây phân cấp:", error);
        res.status(500).send("Lỗi server");
    }
};

//[POST] : Đẩy lên db :
module.exports.products_categoryCreateBE = async (req, res) => {

    //Tự động thêm data vào cho thuộc tính position :
    if (req.body.position == "") {
        req.body.position = await ProductsCategoryModel.countDocuments() + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const productCategory = new ProductsCategoryModel(req.body);
    await productCategory.save();
    res.redirect('/admin/products-category');

}
//[POST] : Thay đổi trạng thái 1 danh mục sản phẩm :
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    //Cập nhật trạng thái sản phẩm :
    await ProductsCategoryModel.updateOne({
        _id: id
    }, {
        status: status
    });
    req.flash('success', 'Cập nhật trạng thái thành công !');
    res.redirect("back");
}
module.exports.editCategory = async (req, res) => {
    try {
        const allCategory = await ProductsCategoryModel.find({ deleted: false });
        const categoryCurr = await ProductsCategoryModel.findOne({ _id: req.params.id, deleted: false });

        if (!allCategory || allCategory.length === 0 || !categoryCurr) {
            return res.status(404).send("Không tìm thấy danh mục.");
        }
        const newCategory = createTreeHelper(allCategory);
        
        res.render("admin/pages/products-category/editCategory", {
            title: "Trang chỉnh sửa danh mục sản phẩm",
            category: newCategory,
            categoryCurr: categoryCurr
        });
    
    } catch (error) {
        console.error("Lỗi khi tạo cây phân cấp:", error);
        res.status(500).send("Lỗi server");
    }
};
module.exports.editCategoryBE = async (req, res) => {
    req.body.position = parseInt(req.body.position);
    await ProductsCategoryModel.updateOne({
        _id: req.params.id
    }, req.body);
    res.redirect("/admin/products-category");
}