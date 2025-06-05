const searchHelper = require('../../helpers/search');
const ProductsModel = require('../../models/products.model');
const CategoryModel = require('../../models/products-category.model');
const BrandModel = require('../../models/brand.model');

module.exports.search = async (req, res) => {
    const keyword = req.query.keyword;
    
    if (!keyword || keyword.trim() === "") {
        return res.redirect('back');
    }

    try {
        // Tạo regex từ keyword
        const searchRegex = searchHelper.search(keyword);

        // Lấy sản phẩm dựa trên từ khóa tìm kiếm
        const products = await ProductsModel.find({
            deleted: false,
            status: "active",
            $or: [
                { title: searchRegex },
                { tags: searchRegex } // tags là mảng, dùng regex để kiểm tra từng phần tử
            ]
        }).sort({
            position: -1
        });

        // Lấy danh sách brand_id duy nhất từ sản phẩm
        const brandIds = [...new Set(products.map(p => p.brand_id?.toString()))];

        // Tìm tên thương hiệu từ danh sách ID
        const brandDocs = await BrandModel.find({
            _id: {
                $in: brandIds
            }
        });
        const brandMap = Object.fromEntries(brandDocs.map(b => [b._id.toString(), b.name]));

        // Thêm brandName vào mỗi sản phẩm
        const productsWithBrandName = products.map(p => ({
            ...p.toObject(),
            brandName: brandMap[p.brand_id?.toString()] || 'Không rõ'
        }));

        // Danh sách tên thương hiệu (dùng cho bộ lọc)
        const brandList = brandDocs.map(b => b.name);

        // Gửi dữ liệu ra view
        res.render('client/pages/products/index', {
            title: "Kết quả tìm kiếm cho: " + keyword,
            data: {
                products: productsWithBrandName,
                brandList,
                brandMap
            },
            keyword
        });
        
    } catch (err) {
        console.error('Lỗi khi tìm kiếm:', err);
        res.status(500).send('Lỗi tải trang tìm kiếm');
    }
};
