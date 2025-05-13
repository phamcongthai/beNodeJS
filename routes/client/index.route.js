const express = require('express');
const router = express.Router();
const productsRoutes  = require('./products.route');
const homeRoutes = require('./home.route');
const categorySubmenu = require('../../middleware/client/category.middleware');
const searchRoutes = require('../../routes/client/search.route')
const cartMiddleware = require('../../middleware/client/cart.middleware')
const cartRoutes = require('../../routes/client/cart.route')
module.exports = (app) => {
    app.use(categorySubmenu.categorySubmenu);// Chỉ dùng cách gọi 1 lần như này bên client
    app.use(cartMiddleware.cart);
    app.use('/', homeRoutes);
    app.use('/products', productsRoutes);
    app.use('/search', searchRoutes)
    app.use('/cart', cartRoutes)
}