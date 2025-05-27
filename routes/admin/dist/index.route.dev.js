"use strict";

var express = require('express');

var router = express.Router();

var dashboardRoutes = require('./dashboard.route');

var pathAdmin = require('../../config/system.config');

var productsRoutes = require('./products.route');

var productsCategoryRoutes = require('./products-category.route');

var rolesRoutes = require('./roles.route');

var accountRoutes = require('./account.route');

var authRoutes = require('./auth.route');

var authMiddleware = require('../../middleware/admin/authRequire.middleware');

var my_accountRoutes = require('../../routes/admin/my-account.route');

var settingsRoutes = require('../../routes/admin/settings.route');

var settingsGeneral = require('../../middleware/admin/settingsGeneral.middleware');

var ordersRoutes = require('../../routes/admin/orders.route');

var brandRoutes = require('../../routes/admin/brand.route');

var adsRoutes = require('../../routes/admin/ads.route');

module.exports = function (app) {
  app.use(settingsGeneral.settingsGeneral);
  app.use(pathAdmin.prefixAdmin + '/dashboard', authMiddleware.authRequire, dashboardRoutes);
  app.use(pathAdmin.prefixAdmin + '/products', authMiddleware.authRequire, productsRoutes);
  app.use(pathAdmin.prefixAdmin + '/products-category', authMiddleware.authRequire, productsCategoryRoutes);
  app.use(pathAdmin.prefixAdmin + '/roles', authMiddleware.authRequire, rolesRoutes);
  app.use(pathAdmin.prefixAdmin + '/accounts', authMiddleware.authRequire, accountRoutes);
  app.use(pathAdmin.prefixAdmin + '/auth', authRoutes);
  app.use(pathAdmin.prefixAdmin + '/my-account', authMiddleware.authRequire, my_accountRoutes);
  app.use(pathAdmin.prefixAdmin + '/settings', authMiddleware.authRequire, settingsRoutes);
  app.use(pathAdmin.prefixAdmin + '/orders', authMiddleware.authRequire, ordersRoutes);
  app.use(pathAdmin.prefixAdmin + '/brands', authMiddleware.authRequire, brandRoutes);
  app.use(pathAdmin.prefixAdmin + '/ads', authMiddleware.authRequire, adsRoutes);
};