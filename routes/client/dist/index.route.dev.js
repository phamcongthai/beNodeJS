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

module.exports = function (app) {
  app.use(categorySubmenu.categorySubmenu); // Chỉ dùng cách gọi 1 lần như này bên client

  app.use(cartMiddleware.cart);
  app.use('/', homeRoutes);
  app.use('/products', productsRoutes);
  app.use('/search', searchRoutes);
  app.use('/cart', cartRoutes);
  app.use('/checkout', orderRoutes);
};