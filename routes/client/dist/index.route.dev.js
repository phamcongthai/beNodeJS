"use strict";

var express = require('express');

var router = express.Router();

var productsRoutes = require('./products.route');

var homeRoutes = require('./home.route');

var categorySubmenu = require('../../middleware/client/category.middleware');

var searchRoutes = require('../../routes/client/search.route');

var cartMiddleware = require('../../middleware/client/cart.middleware');

var cartRoutes = require('../../routes/client/cart.route');

var orderRoutes = require('../../routes/client/order.route');

var userRoutes = require('../../routes/client/user.route');

var userMiddleware = require('../../middleware/client/user.middleware');

var auth = require('../../middleware/client/authRequire.middleware');

var settingsGeneral = require('../../middleware/admin/settingsGeneral.middleware');

var chatRoutes = require('../../routes/client/chat.route');

module.exports = function (app) {
  app.use(categorySubmenu.categorySubmenu); // Chỉ dùng cách gọi 1 lần như này bên client

  app.use(cartMiddleware.cart);
  app.use(userMiddleware.userMiddleware);
  app.use(settingsGeneral.settingsGeneral);
  app.use('/', homeRoutes);
  app.use('/products', productsRoutes);
  app.use('/search', searchRoutes);
  app.use('/cart', cartRoutes);
  app.use('/checkout', orderRoutes);
  app.use('/user', userRoutes);
  app.use('/chat', chatRoutes);
};