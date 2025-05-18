const ProductsCategoryModel = require('../../models/products-category.model');
const ProductModel = require('../../models/products.model');
const AccountsModel = require('../../models/account.model');
const UserModel = require('../../models/user.model');

module.exports.index = async (req, res) => {
  const statistic = {
    categoryProduct: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    product: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  };

  // Category Product
  statistic.categoryProduct.total = await ProductsCategoryModel.countDocuments();
  statistic.categoryProduct.active = await ProductsCategoryModel.countDocuments({ status: "active" });
  statistic.categoryProduct.inactive = await ProductsCategoryModel.countDocuments({ status: "inactive" });

  // Product
  statistic.product.total = await ProductModel.countDocuments();
  statistic.product.active = await ProductModel.countDocuments({ status: "active" });
  statistic.product.inactive = await ProductModel.countDocuments({ status: "inactive" });

  // Account
  statistic.account.total = await AccountsModel.countDocuments();
  statistic.account.active = await AccountsModel.countDocuments({ status: "active" });
  statistic.account.inactive = await AccountsModel.countDocuments({ status: "inactive" });

  // User
  statistic.user.total = await UserModel.countDocuments();
  statistic.user.active = await UserModel.countDocuments({ status: "active" });
  statistic.user.inactive = await UserModel.countDocuments({ status: "inactive" });

  res.render('admin/pages/dashboard/index', {
    title: "Trang tổng quan",
    statistic
  });
};
