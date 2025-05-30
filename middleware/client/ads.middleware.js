const AdsModel = require('../../models/ads.model');
const ProductModel = require('../../models/products.model');

module.exports.adsMiddleware = async (req, res, next) => {
  try {
    const now = new Date();

    // Lấy quảng cáo đang hoạt động
    const ads = await AdsModel.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
      status: "active",
      deleted: false
    });

    // Lấy sản phẩm nổi bật
    const featuredProducts = await ProductModel.find({
      isFeatured: true,
      status: "active",
      deleted: false
    }).select('tags');

    // Tạo mảng tags duy nhất
    const tagsSet = new Set();
    for (const product of featuredProducts) {
      if (Array.isArray(product.tags)) {
        product.tags.forEach(tag => tagsSet.add(tag));
      }
    }

    const tags = Array.from(tagsSet);

    // Gán vào res.locals
    res.locals.ads = ads;
    res.locals.tags = tags;

    next();
  } catch (err) {
    console.error('Error in adsMiddleware:', err);
    next(err);
  }
};
