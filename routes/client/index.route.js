const express = require('express');
const router = express.Router();
const productsRoutes  = require('./products.route');
const homeRoutes = require('./home.route')
module.exports = (app) => {
    app.get('/', homeRoutes);
    app.use('/products', productsRoutes);
}