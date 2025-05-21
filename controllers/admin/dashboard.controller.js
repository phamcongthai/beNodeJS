const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const ProductsCategoryModel = require('../../models/products-category.model');
const ProductModel = require('../../models/products.model');
const AccountsModel = require('../../models/account.model');
const UserModel = require('../../models/user.model');

// Lấy Property ID từ biến môi trường
const PROPERTY_ID = process.env.GA4_PROPERTY_ID;

// Khởi tạo GA4 client bằng credentials từ .env
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  projectId: process.env.GOOGLE_PROJECT_ID,
});

// Lấy realtime users
async function getRealtimeUsers() {
  try {
    const [response] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${PROPERTY_ID}`,
      metrics: [{ name: 'activeUsers' }],
    });

    if (response.rows?.length > 0) {
      return parseInt(response.rows[0].metricValues[0].value, 10);
    }
  } catch (err) {
    console.error('GA4 Realtime error:', err.message);
  }
  return 0;
}

// Lấy pageviews hôm nay
async function getTodayPageviews() {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: 'today', endDate: 'today' }],
      metrics: [{ name: 'screenPageViews' }],
    });

    if (response.rows?.length > 0) {
      return parseInt(response.rows[0].metricValues[0].value, 10);
    }
  } catch (err) {
    console.error('GA4 Pageviews error:', err.message);
  }
  return 0;
}

// Controller chính
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
    // MongoDB counts
    statistic.categoryProduct.total = await ProductsCategoryModel.countDocuments();
    statistic.categoryProduct.active = await ProductsCategoryModel.countDocuments({ status: 'active' });
    statistic.categoryProduct.inactive = await ProductsCategoryModel.countDocuments({ status: 'inactive' });

    statistic.product.total = await ProductModel.countDocuments();
    statistic.product.active = await ProductModel.countDocuments({ status: 'active' });
    statistic.product.inactive = await ProductModel.countDocuments({ status: 'inactive' });

    statistic.account.total = await AccountsModel.countDocuments();
    statistic.account.active = await AccountsModel.countDocuments({ status: 'active' });
    statistic.account.inactive = await AccountsModel.countDocuments({ status: 'inactive' });

    statistic.user.total = await UserModel.countDocuments();
    statistic.user.active = await UserModel.countDocuments({ status: 'active' });
    statistic.user.inactive = await UserModel.countDocuments({ status: 'inactive' });

    // Google Analytics data
    statistic.googleAnalytics.realtimeUsers = await getRealtimeUsers();
    statistic.googleAnalytics.todayPageviews = await getTodayPageviews();

  } catch (err) {
    console.error('Lỗi khi tính thống kê:', err.message);
  }

  res.render('admin/pages/dashboard/index', {
    title: 'Trang tổng quan',
    statistic
  });
};
