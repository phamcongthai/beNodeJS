const ProductsModel = require('../../models/products.model');
const CategoryModel = require('../../models/products-category.model');
//[GET] : /products
module.exports.products = async (req, res) => { //Không cần /products vì bên kia nó có rồi. 
    const productData = await ProductsModel.find({deleted : false, status : 'active'}).sort({position : "desc"});
    
    res.render('client/pages/products/index', 
        {
            pageTitle : "Trang sản phẩm",
            productData : productData
        }
    );
}
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

    const rootCategory = await CategoryModel.findOne({
        deleted: false,
        status: "active",
        slug: slugCategory
    });

    if (!rootCategory) {
        return res.status(404).send("Category not found");
    }

    // Hàm đệ quy lấy tất cả _id con cháu
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

    // Lấy tất cả _id con cháu + chính nó
    const childrenIds = await getAllChildrenIds(rootCategory._id);
    childrenIds.push(rootCategory._id); // Thêm chính nó

    const productData = await ProductsModel.find({
        deleted: false,
        status: "active",
        category_id: { $in: childrenIds }
    });

    res.render("client/pages/products/index", {
        title: rootCategory.title,
        productData
    });
};
