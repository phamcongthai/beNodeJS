const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const flash = require('express-flash');
const moment = require("moment");
var path = require('path');//Đi kèm với tiny mce
//Cấu hình slug :
var slug = require('mongoose-slug-updater');
//Cài multer để tải ảnh lên từ máy :

const app = express();

// Cấu hình cookie-parser
app.use(cookieParser());

// Cấu hình session (bắt buộc để dùng express-flash)
app.use(session({
    secret: 'keyboard cat', // Chuỗi bí mật (có thể đặt trong .env)
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } // 60 giây
}));

// Cấu hình express-flash
app.use(flash());



// Method override
app.use(methodOverride('_method'));

// Body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Load env
require('dotenv').config();
const port = process.env.PORT;

// Import routes
const routeClient = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');
//
//Cấu hình tiny MCE :
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// Cấu hình thư mục public
//Nhưng khi deploy online thì nó sẽ không hiểu public là gì => phải dùng _dirname
app.use(express.static(`${__dirname}/public`));

// Cấu hình pug
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

// Lấy route
routeClient(app);
routeAdmin(app);
//Cấu hình moment :
app.locals.moment = moment;
// Cấu hình mongoose
const database = require("./config/database.config");
database.connect();

// Biến local toàn cục
const systemConfig = require('./config/system.config');
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Chạy server
app.listen(port, () => {
    console.log(`App đang chạy tại cổng ${port}`);
});
