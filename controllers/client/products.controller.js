const ProductsModel = require('../../models/products.model')
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
    console.log(req.params.slug);
    try {
        //Tìm sản phẩm đó :
        const find = {
            deleted: false,
            slug: req.params.slug
        }
        const product = await ProductsModel.findOne(find); //Dùng find thì nó trả về 1 mảng, findOne thì trả về 1 obj thôi.
        console.log(product);
        
        res.render("client/pages/products/detailProducts", {
            pageTitle: product.title,
            product: product
        })
    } catch (error) {
        res.redirect("/products");

    }
}