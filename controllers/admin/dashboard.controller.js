const path = require('path');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const ProductsCategoryModel = require('../../models/products-category.model');
const ProductModel = require('../../models/products.model');
const AccountsModel = require('../../models/account.model');
const UserModel = require('../../models/user.model');

// Đường dẫn tới service account file JSON
const KEY_FILE_PATH = path.join(__dirname, '../../config/service-account.json');

// GA4 Property ID - KHÔNG phải là Measurement ID
const PROPERTY_ID = '481189639'; // Thay đúng GA4 Property ID của bạn

// Tạo client GA4
const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: KEY_FILE_PATH,
});

async function getRealtimeUsers() {
  try {
    const [response] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${PROPERTY_ID}`,
      metrics: [{ name: 'activeUsers' }],
    });

    if (response.rows && response.rows.length > 0) {
      return parseInt(response.rows[0].metricValues[0].value, 10);
    }
  } catch (err) {
    console.error('GA4 Realtime error:', err.message);
  }
  return 0;
}

async function getTodayPageviews() {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: 'today', endDate: 'today' }],
      metrics: [{ name: 'screenPageViews' }],
    });

    if (response.rows && response.rows.length > 0) {
      return parseInt(response.rows[0].metricValues[0].value, 10);
    }
  } catch (err) {
    console.error('GA4 Pageviews error:', err.message);
  }
  return 0;
}

module.exports.index = async (req, res) => {
  const statistic = {
    categoryProduct: { total: 0, active: 0, inactive: 0 },
    product: { total: 0, active: 0, inactive: 0 },
    account: { total: 0, active: 0, inactive: 0 },
    user: { total: 0, active: 0, inactive: 0 },
    googleAnalytics: {
      realtimeUsers: 0,
      todayPageviews: 0,
    }
  };

  try {
    // Đếm MongoDB
    statistic.categoryProduct.total = await ProductsCategoryModel.countDocuments();
    statistic.categoryProduct.active = await ProductsCategoryModel.countDocuments({ status: "active" });
    statistic.categoryProduct.inactive = await ProductsCategoryModel.countDocuments({ status: "inactive" });

    statistic.product.total = await ProductModel.countDocuments();
    statistic.product.active = await ProductModel.countDocuments({ status: "active" });
    statistic.product.inactive = await ProductModel.countDocuments({ status: "inactive" });

    statistic.account.total = await AccountsModel.countDocuments();
    statistic.account.active = await AccountsModel.countDocuments({ status: "active" });
    statistic.account.inactive = await AccountsModel.countDocuments({ status: "inactive" });

    statistic.user.total = await UserModel.countDocuments();
    statistic.user.active = await UserModel.countDocuments({ status: "active" });
    statistic.user.inactive = await UserModel.countDocuments({ status: "inactive" });

    // Lấy dữ liệu GA4
    statistic.googleAnalytics.realtimeUsers = await getRealtimeUsers();
    statistic.googleAnalytics.todayPageviews = await getTodayPageviews();

  } catch (err) {
    console.error('Lỗi khi tính thống kê:', err.message);
  }

  res.render('admin/pages/dashboard/index', {
    title: "Trang tổng quan",
    statistic
  });
};
