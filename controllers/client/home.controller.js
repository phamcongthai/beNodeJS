const ProductsModel = require('../../models/products.model');
// [GET] : /
module.exports.index = async (req, res) => {
  try {
    const FeaturedProducts = await ProductsModel.find({
      deleted: false,
      status: "active",
      isFeatured: true
    });
    const NewProducts = await ProductsModel.find({
      deleted: false,
      status: "active",
    }).sort({
      position : -1
    });
    const DisProducts = await ProductsModel.find({
      deleted: false,
      status: "active",
    }).sort({
      discountPercentage: -1
    });

    res.render('client/pages/home/index', {
      pageTitle: 'Trang chủ',
      FeaturedProducts,
      NewProducts,
      DisProducts
    });
  } catch (err) {
    console.error('Lỗi lấy danh mục:', err);
    res.status(500).send('Lỗi máy chủ');
  }
};