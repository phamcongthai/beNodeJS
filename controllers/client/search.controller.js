const searchHelper = require('../../helpers/search');
const ProductsModel = require('../../models/products.model');

module.exports.search = async (req, res) => {
    const keyword = req.query.keyword;

    // Nếu keyword trống, chuyển hướng về trang tìm kiếm không có keyword
    if (!keyword || keyword.trim() === "") {
        return res.redirect('back'); // Đổi '/search' thành route gốc phù hợp nếu cần
    }

    const productData = await ProductsModel.find({
        deleted: false,
        status: "active",
        title: searchHelper.search(keyword)
    });

    res.render("client/pages/search/index", {
        title: "Kết quả tìm kiếm cho: " + keyword,
        productData,
        keyword
    });
};
