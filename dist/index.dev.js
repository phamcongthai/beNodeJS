"use strict";

var express = require('express');

var session = require('express-session');

var cookieParser = require('cookie-parser');

var methodOverride = require('method-override');

var flash = require('express-flash');

var moment = require("moment");

var path = require('path'); //Đi kèm với tiny mce
//Cấu hình slug :


var slug = require('mongoose-slug-updater'); //Cài multer để tải ảnh lên từ máy :


var app = express(); // Cấu hình cookie-parser

app.use(cookieParser()); // Cấu hình session (bắt buộc để dùng express-flash)

app.use(session({
  secret: 'keyboard cat',
  // Chuỗi bí mật (có thể đặt trong .env)
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000
  } // 60 giây

})); // Cấu hình express-flash

app.use(flash()); // Method override

app.use(methodOverride('_method')); // Body parser

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: false
})); // Load env

require('dotenv').config();

var port = process.env.PORT; // Import routes

var routeClient = require('./routes/client/index.route');

var routeAdmin = require('./routes/admin/index.route'); //
//Cấu hình tiny MCE :


app.use('/tinymce', express["static"](path.join(__dirname, 'node_modules', 'tinymce'))); // Cấu hình thư mục public
//Nhưng khi deploy online thì nó sẽ không hiểu public là gì => phải dùng _dirname

app.use(express["static"]("".concat(__dirname, "/public"))); // Cấu hình pug

app.set('view engine', 'pug');
app.set('views', "".concat(__dirname, "/views")); // Lấy route

routeClient(app);
routeAdmin(app); //Cấu hình moment :

app.locals.moment = moment; // Cấu hình mongoose

var database = require("./config/database.config");

database.connect(); // Biến local toàn cục

var systemConfig = require('./config/system.config');

app.locals.prefixAdmin = systemConfig.prefixAdmin; // Chạy server

app.listen(port, function () {
  console.log("App \u0111ang ch\u1EA1y t\u1EA1i c\u1ED5ng ".concat(port));
});