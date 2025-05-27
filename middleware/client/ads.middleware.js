const AdsModel = require('../../models/ads.model');

module.exports.adsMiddleware = async (req, res, next) => {
  try {
    const now = new Date();

    const ads = await AdsModel.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
      status : "active",
      deleted : false
    });

    res.locals.ads = ads;
    next();
  } catch (err) {
    console.error('Error loading ads:', err);
    next(err); // hoặc next(new Error('...')) nếu muốn custom lỗi
  }
};
