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
const chatRoutes = require('../../routes/client/chat.route');
const adsMiddleware = require('../../middleware/client/ads.middleware');
const commentRoutes = require('../../routes/client/comment.route');
const blogsRoutes = require('../../routes/client/blogs.route')
module.exports = (app) => {
    app.use(express.json());
    app.use(categorySubmenu.categorySubmenu);// Chỉ dùng cách gọi 1 lần như này bên client
    app.use(cartMiddleware.cart);
    app.use(userMiddleware.userMiddleware);
    app.use(settingsGeneral.settingsGeneral);
    app.use('/', adsMiddleware.adsMiddleware, homeRoutes);
    app.use('/products', productsRoutes);
    app.use('/search', searchRoutes);
    app.use('/cart', cartRoutes);
    app.use('/checkout', orderRoutes);
    app.use('/user', userRoutes);
    app.use('/chat', chatRoutes);
    app.use('/comment', commentRoutes);
    app.use('/blogs', blogsRoutes);
}