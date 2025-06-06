const ProductsModel = require('../../models/products.model');
const ProductsCategoryModel = require('../../models/products-category.model');
const AccountModel = require('../../models/account.model');
const filterStatusHelper = require('../../helpers/filterStatus.helper');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination.helper');
const createTreeHelper = require('../../helpers/createTree.helper');
const {
    account
} = require('./accounts.controller');
const BrandModel = require('../../models/brand.model')
// [GET] /admin/products
module.exports.products = async (req, res) => {
    const find = {
        deleted: false
    };
    const status = req.query.status;
    let filterStatus = filterStatusHelper.filterStatus();

    if (status) {
        find.status = status;
        filterStatus = filterStatusHelper.filterStatus(status);
    }

    const keyword = req.query.keyword;
    if (keyword) {
        find.title = searchHelper.search(keyword);
    }

    const page = parseInt(req.query.page) || 1;
    const pagination = await paginationHelper.pagination(ProductsModel, page, find);

    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "asc";
    }

    const productData = await ProductsModel.find(find)
        .sort(sort)
        .limit(pagination.limit)
        .skip(pagination.skip)
        .lean();

    for (const item of productData) {
        // ✅ Thêm brand_name vào từng sản phẩm
        if (item.brand_id) {
            const brand = await BrandModel.findOne({
                _id: item.brand_id,
                deleted: false
            }).lean();

            item.brand_name = brand?.name || "Không rõ";
        } else {
            item.brand_name = "Không rõ";
        }

        // ✅ Thêm account tạo sản phẩm
        if (item.createBy?.account_id) {
            item.account = await AccountModel.findOne({
                deleted: false,
                _id: item.createBy.account_id
            }).lean();
        } else {
            item.account = {
                fullName: "Không rõ"
            };
        }
    }

    res.render('admin/pages/products/index', {
        title: "Trang sản phẩm",
        productData,
        filterStatus,
        keyword,
        pagination,
    });
};

// [GET] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const {
        status,
        id
    } = req.params;
    await ProductsModel.updateOne({
        _id: id
    }, {
        status
    });
    req.flash('success', 'Cập nhật trạng thái thành công!');
    res.redirect("back");
};

// [POST] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const status = req.body.type;
        let ids = req.body.ids;

        if (status === "changePosition") {
            ids = JSON.parse(ids);
            for (const item of ids) {
                const [id, position] = item.split('-');
                await ProductsModel.updateOne({
                    _id: id
                }, {
                    position: parseInt(position)
                });
            }
        } else if (status !== "deleteAll") {
            ids = JSON.parse(ids);
            await ProductsModel.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status
            });
        } else {
            ids = JSON.parse(ids);
            await ProductsModel.updateMany({
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

// [GET] /admin/products/delete/:id
module.exports.deleteT = async (req, res) => {
    const id = req.params.id;
    await ProductsModel.updateOne({
        _id: id
    }, {
        deleted: true,
        deleteBy: {
            account_id: res.locals.currentUser._id,
            deleteAt: new Date()
        }
    });
    res.redirect("back");
};

// [GET] /admin/products/create/:id
module.exports.createProducts = async (req, res) => {
    try {
        const categories = await ProductsCategoryModel.find({
            deleted: false
        });
        const brands = await BrandModel.find({
            deleted: false
        });

        if (!categories.length) {
            return res.status(404).send("Không có danh mục nào.");
        }

        const categoryTree = createTreeHelper(categories);

        res.render("admin/pages/products/createProducts", {
            title: "Trang tạo mới sản phẩm",
            category: categoryTree,
            brands, // truyền danh sách brand xuống pug
        });
    } catch (err) {
        console.error("GET createProducts error:", err);
        res.redirect("back");
    }
};

// [POST] /admin/products/create/:id
module.exports.createProductsBE = async (req, res) => {
    try {
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);

        req.body.position = req.body.position ?
            parseInt(req.body.position) :
            (await ProductsModel.countDocuments()) + 1;

        // ✅ Tách chuỗi tags thành mảng
        if (req.body.tags && typeof req.body.tags === "string") {
            req.body.tags = req.body.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag);
        }

        // ✅ Người tạo
        req.body.createBy = {
            account_id: res.locals.currentUser._id,
        };

        const product = new ProductsModel(req.body);
        await product.save();

        res.redirect("/admin/products");
    } catch (err) {
        console.error("POST createProductsBE error:", err);
        res.redirect("back");
    }
};

// [GET] /admin/products/edit/:id
module.exports.editProduct = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const product = await ProductsModel.findOne(find);
        const category = await ProductsCategoryModel.find({
            deleted: false
        });
        const newCategory = createTreeHelper(category);

        // Lấy danh sách brand không bị xoá
        const brands = await BrandModel.find({
            deleted: false
        }).lean();

        res.render('admin/pages/products/editProducts', {
            title: "Trang chỉnh sửa sản phẩm",
            product,
            category: newCategory,
            brands // thêm brands vào
        });
    } catch (error) {
        console.error(error);
        res.redirect("/admin/products");
    }
};
// [POST] /admin/products/edit/:id
// [POST] /admin/products/edit/:id
module.exports.editProductBE = async (req, res) => {
  try {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (req.body.tags) {
      req.body.tags = req.body.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    } else {
      req.body.tags = [];
    }

    const id = req.params.id;
    const currentUpdate = {
      account_id: res.locals.currentUser._id,
      updateAt: new Date(),
    };

    // Lấy dữ liệu update từ req.body
    const updateData = {
      ...req.body,
    };
    delete updateData.updateBy;

    // Lấy ảnh mới upload (nếu có)
    const newThumbnails = req.body['thumbnail[]'];

    if (newThumbnails && Array.isArray(newThumbnails)) {
      // Lấy product hiện tại để lấy thumbnail cũ
      const product = await ProductsModel.findById(id).lean();

      if (product && Array.isArray(product.thumbnail)) {
        // Nối mảng ảnh cũ với ảnh mới
        updateData.thumbnail = [...product.thumbnail, ...newThumbnails];
      } else {
        // Nếu chưa có thumbnail cũ thì lấy luôn ảnh mới
        updateData.thumbnail = newThumbnails;
      }
    }

    await ProductsModel.updateOne(
      { _id: id },
      {
        $set: updateData,
        $push: { updateBy: currentUpdate },
      }
    );

    res.redirect("/admin/products");
  } catch (error) {
    console.error(error);
    res.redirect("back");
  }
};


// [GET] /admin/products/detail/:id
module.exports.detailProducts = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const product = await ProductsModel.findOne(find);

        if (!product) {
            return res.redirect("/admin/products");
        }

        // Lấy brand theo brand_id trong product
        let brand = null;
        if (product.brand_id) {
            brand = await BrandModel.findOne({
                _id: product.brand_id,
                deleted: false
            });
        }

        res.render('admin/pages/products/detailProducts', {
            title: product.title,
            product,
            brand
        });
    } catch (error) {
        console.error(error);
        res.redirect("/admin/products");
    }
};