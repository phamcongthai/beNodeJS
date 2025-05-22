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
const ordersRoutes = require('../../routes/admin/orders.route')
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
}