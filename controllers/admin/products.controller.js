//[GET] : /admin/products
const productsModel = require('../../models/products.model');
const filterStatusHelper = require('../../helpers/filterStatus.helper');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination.helper');
const ProductsModel = require('../../models/products.model');
module.exports.products = async (req, res) => {
    const find = {
        deleted: false
    }
    //Lọc theo trạng thái sản phẩm : 
    const status = req.query.status;
    let filterStatus = filterStatusHelper.filterStatus(status);
    if (status) {
        //Lọc sản phẩm theo status : 
        find.status = req.query.status;
        filterStatus = filterStatusHelper.filterStatus(status);
    }

    //Tìm kiếm theo từ khóa : 
    const keyword = req.query.keyword; //Vừa để gán cho giá trị cho ô input, vừa là 1 thuộc tính để tìm kiếm (title)
    if (keyword) {
        find.title = searchHelper.search(keyword);
    }

    //Phân trang : 
    let pagination = {};
    const page = parseInt(req.query.page) || 1;
    if (page) {
        pagination = await paginationHelper.pagination(page);
    }
    //Kết thúc phân trang
    const productData = await productsModel.find(find).sort({
        position: "asc"
    }).limit(pagination.limit).skip(pagination.skip);
    res.render('admin/pages/products/index', {
        title: "Trang sản phẩm",
        productData: productData,
        filterStatus: filterStatus,
        keyword: keyword,
        pagination: pagination
    })
}
module.exports.changeStatus = async (req, res) => {
    console.log(req.params);

    const status = req.params.status;
    const id = req.params.id;

    //Cập nhật trạng thái sản phẩm :
    await productsModel.updateOne({
        _id: id
    }, {
        status: status
    });
    req.flash('success', 'Cập nhật trạng thái thành công !');
    res.redirect("back");
}
//Change multi :
module.exports.changeMulti = async (req, res) => {
    try {
        const status = req.body.type;
        let ids = req.body.ids;
        console.log(req.body);

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
                await productsModel.updateOne({
                    _id: item.id
                }, {
                    position: item.position
                });
            }
        } else if (status !== "deleteAll") {
            ids = JSON.parse(ids);
            await productsModel.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: status
            });
        } else {
            ids = JSON.parse(ids);
            await productsModel.updateMany({
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
module.exports.deleteT = async (req, res) => {
    const id = req.params.id;
    await productsModel.updateOne({
        _id: id
    }, {
        deleted: true,
        deletedTime: new Date()
    }); //Xóa kèm thời gian
    res.redirect("back");
}
//Thêm mới sản phẩm : 
module.exports.createProducts = async (req, res) => {
    res.render('admin/pages/products/createProducts', {
        title: "Trang tạo mới sản phẩm",
    })
}
module.exports.createProductsBE = async (req, res) => {
    //Validate dữ liệu :
    //Trước hết là phải nhập tiêu đề, yêu cầu tiêu đề phải trên 8 kí tự :
    //Phải nhập tiêu đề :
    if (!req.body.title) {
        req.flash('error', 'Vui lòng nhập tiêu đề');
        res.redirect("back");
        return; //Đóng luôn các câu lênh ở phía sau
    }
    if (req.body.title.length < 8) {
        req.flash('error', 'Vui lòng nhập ít nhất 8 kí tự');
        res.redirect("back")
        return;
    }
    //format dữ liệu, bên mongoDB chỉ nhận đúng dạng data :
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    //Tự động thêm data vào cho thuộc tính position :
    if (req.body.position == "") {
        req.body.position = await ProductsModel.countDocuments() + 1;
    }
    // console.log(req.file); có thể lấy ra được file bằng req.file 
    //Xử lí cho phần ảnh :
    //Phần hình ảnh đã được edit bên router
    const product = new ProductsModel(req.body);
    await product.save();
    res.redirect('/admin/products');
}
//Chỉnh sửa sản phẩm :
module.exports.editProduct = async (req, res) => {
    //Dùng try catch để nếu mà người dùng họ nhập linh tinh thì ko bị hỏng server
    try {
        //Tìm sản phẩm đó :
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await ProductsModel.findOne(find); //Dùng find thì nó trả về 1 mảng, findOne thì trả về 1 obj thôi.

        res.render('admin/pages/products/editProducts', {
            title: "Trang chỉnh sửa sản phẩm",
            product: product
        })
    } catch (error) {
        res.redirect("/admin/products");

    }

}
module.exports.editProductBE = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);
    console.log(req.body);
    const id = req.params.id;
    //Phần hình ảnh đã được edit bên router
   try {
    await ProductsModel.updateOne({_id : id}, req.body);
   } catch (error) {
    console.log(error);
    
   }
    res.redirect("back");
}
//Xem chi tiết :
module.exports.detailProducts = async (req, res) => {
    //Dùng try catch để nếu mà người dùng họ nhập linh tinh thì ko bị hỏng server
    try {
        //Tìm sản phẩm đó :
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await ProductsModel.findOne(find); //Dùng find thì nó trả về 1 mảng, findOne thì trả về 1 obj thôi.

        res.render('admin/pages/products/detailProducts', {
            title: product.title,
            product: product
        })
    } catch (error) {
        res.redirect("/admin/products");

    }

}