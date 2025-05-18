const express = require('express');
const router = express.Router();
const productsRoutes  = require('./products.route');
const homeRoutes = require('./home.route');
const categorySubmenu = require('../../middleware/client/category.middleware');
const searchRoutes = require('../../routes/client/search.route')
const cartMiddleware = require('../../middleware/client/cart.middleware')
const cartRoutes = require('../../routes/client/cart.route')
const orderRoutes = require('../../routes/client/order.route')
const userRoutes = require('../../routes/client/user.route')
const userMiddleware = require('../../middleware/client/user.middleware')
const auth = require('../../middleware/client/authRequire.middleware');
const settingsGeneral = require('../../middleware/admin/settingsGeneral.middleware');
module.exports = (app) => {
    app.use(categorySubmenu.categorySubmenu);// Chỉ dùng cách gọi 1 lần như này bên client
    app.use(cartMiddleware.cart);
    app.use(userMiddleware.userMiddleware);
     app.use(settingsGeneral.settingsGeneral);
    app.use('/', homeRoutes);
    app.use('/products', productsRoutes);
    app.use('/search', searchRoutes);
    app.use('/cart', cartRoutes);
    app.use('/checkout', orderRoutes);
    app.use('/user', userRoutes);
}