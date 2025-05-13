const ProductsModel = require('../../models/products.model');
// [GET] : /
module.exports.index = async (req, res) => {
  try {
    const FeaturedProducts = await ProductsModel.find({
      deleted : false,
      status : "active",
      isFeatured : true
    });
    res.render('client/pages/home/index', {
      pageTitle: 'Trang chủ',
      FeaturedProducts 
    });
  } catch (err) {
    console.error('Lỗi lấy danh mục:', err);
    res.status(500).send('Lỗi máy chủ');
  }
};
