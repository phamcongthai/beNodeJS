const ProductsModel = require('../../models/products.model');
const CategoryModel = require('../../models/products-category.model');
const BrandModel = require('../../models/brand.model');
//[GET] : Lấy ra sản phẩm
module.exports.products = async (req, res) => {
    try {
        // Lấy sản phẩm còn hoạt động và chưa bị xóa
        const products = await ProductsModel.find({
            deleted: false,
            status: 'active'
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
            data: {
                products: productsWithBrandName,
                brandList,
                brandMap
            }
        });
    } catch (err) {
        console.error('Lỗi controller:', err);
        res.status(500).send('Lỗi tải trang sản phẩm');
    }
};
//Chi tiết sản phẩm :
module.exports.productsDetail = async (req, res) => {
    try {
        //Tìm sản phẩm đó :
        const find = {
            deleted: false,
            slug: req.params.slug
        }
        const product = await ProductsModel.findOne(find); //Dùng find thì nó trả về 1 mảng, findOne thì trả về 1 obj thôi.

        res.render("client/pages/products/detailProducts", {
            pageTitle: product.title,
            product: product
        })
    } catch (error) {
        res.redirect("/products");

    }
}
//Danh mục :
module.exports.productsCategory = async (req, res) => {
    const slugCategory = req.params.slug;

    try {
        // Lấy danh mục gốc dựa trên slug
        const rootCategory = await CategoryModel.findOne({
            deleted: false,
            status: "active",
            slug: slugCategory
        });

        if (!rootCategory) {
            return res.status(404).send("Danh mục không tồn tại");
        }

        // Hàm đệ quy lấy tất cả _id của danh mục con
        const getAllChildrenIds = async (parentId) => {
            const children = await CategoryModel.find({
                deleted: false,
                status: "active",
                parent_id: parentId
            }).select('_id');

            let ids = children.map(c => c._id);

            for (const child of children) {
                const subChildren = await getAllChildrenIds(child._id);
                ids = ids.concat(subChildren);
            }

            return ids;
        };

        // Lấy tất cả _id của danh mục con + chính nó
        const childrenIds = await getAllChildrenIds(rootCategory._id);
        childrenIds.push(rootCategory._id); // Thêm chính nó vào danh sách

        // Lấy các sản phẩm từ danh mục này
        const products = await ProductsModel.find({
            deleted: false,
            status: 'active',
            category_id: {
                $in: childrenIds
            }
        }).sort({
            position: -1 // Sắp xếp sản phẩm theo vị trí
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
            data: {
                products: productsWithBrandName,
                brandList,
                brandMap,
                categoryTitle: rootCategory.title
            }
        });

    } catch (err) {
        console.error('Lỗi controller:', err);
        res.status(500).send('Lỗi tải trang danh mục');
    }
};
