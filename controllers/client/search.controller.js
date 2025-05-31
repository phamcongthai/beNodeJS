const searchHelper = require('../../helpers/search');
const ProductsModel = require('../../models/products.model');

module.exports.search = async (req, res) => {
    const keyword = req.query.keyword;
    
    if (!keyword || keyword.trim() === "") {
        return res.redirect('back');
    }

    // Tạo regex từ keyword (giống searchHelper)
    const searchRegex = searchHelper.search(keyword);

    const productData = await ProductsModel.find({
        deleted: false,
        status: "active",
        $or: [
            { title: searchRegex },
            { tags: searchRegex } // tags là mảng, dùng regex để kiểm tra từng phần tử
        ]
    });

    res.render("client/pages/search/index", {
        title: "Kết quả tìm kiếm cho: " + keyword,
        productData,
        keyword
    });
};
