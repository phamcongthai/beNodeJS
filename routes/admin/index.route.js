const express = require('express');
const router = express.Router();
const dashboardRoutes = require('./dashboard.route')
const pathAdmin = require('../../config/system.config')
const productsRoutes = require('./products.route')

module.exports = (app) => {
    app.use(pathAdmin.prefixAdmin+'/dashboard', dashboardRoutes);
    app.use(pathAdmin.prefixAdmin+'/products', productsRoutes);
}