const express = require('express');
const router = express.Router();
const dashboardRoutes = require('./dashboard.route')
const pathAdmin = require('../../config/system.config')
const productsRoutes = require('./products.route')
const productsCategoryRoutes = require('./products-category.route');
const rolesRoutes = require('./roles.route');
const accountRoutes = require('./account.route');
const authRoutes = require('./auth.route');
const authMiddleware = require('../../middleware/admin/authRequire.middleware');
const my_accountRoutes = require('../../routes/admin/my-account.route');
const settingsRoutes = require('../../routes/admin/settings.route');
const settingsGeneral = require('../../middleware/admin/settingsGeneral.middleware');
const ordersRoutes = require('../../routes/admin/orders.route');
const brandRoutes = require('../../routes/admin/brand.route');
const adsRoutes = require('../../routes/admin/ads.route');
const cmtRoutes = require('../../routes/admin/comment.route');
const blogRoutes = require('../../routes/admin/blog.route');
module.exports = (app) => {
    app.use(settingsGeneral.settingsGeneral);
    app.use(pathAdmin.prefixAdmin+'/dashboard', authMiddleware.authRequire, dashboardRoutes);
    app.use(pathAdmin.prefixAdmin+'/products', authMiddleware.authRequire, productsRoutes);
    app.use(pathAdmin.prefixAdmin+'/products-category', authMiddleware.authRequire, productsCategoryRoutes);
    app.use(pathAdmin.prefixAdmin+'/roles', authMiddleware.authRequire, rolesRoutes);
    app.use(pathAdmin.prefixAdmin+'/accounts', authMiddleware.authRequire, accountRoutes);
    app.use(pathAdmin.prefixAdmin+'/auth', authRoutes);
    app.use(pathAdmin.prefixAdmin+'/my-account', authMiddleware.authRequire, my_accountRoutes);
    app.use(pathAdmin.prefixAdmin+'/settings', authMiddleware.authRequire, settingsRoutes);
    app.use(pathAdmin.prefixAdmin+'/orders', authMiddleware.authRequire, ordersRoutes);
    app.use(pathAdmin.prefixAdmin+'/brands', authMiddleware.authRequire, brandRoutes);
    app.use(pathAdmin.prefixAdmin+'/ads', authMiddleware.authRequire, adsRoutes);
    app.use(pathAdmin.prefixAdmin+'/comment', authMiddleware.authRequire, cmtRoutes);
    app.use(pathAdmin.prefixAdmin+'/blogs', authMiddleware.authRequire, blogRoutes);
}