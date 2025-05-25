const mongoose = require('mongoose')
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const orderSchema = new mongoose.Schema({
    user_id: String,
    userInfo: { //userInfo cần vì nếu chưa đăng nhập thì vẫn cần lưu thông tin user điền vào.
        fullName: String,
        phone: String,
        address: String
    },
    prevStatus : String,
    paymentMethod: String,
    paymentStatus: {
        type: String,
        default: 'unpaid'
    },
    status: {
        type: String,
        default: "pending"
    },
    products: [{
        title : String,
        product_id: String,
        price: Number,
        discountPercentage: Number,
        quantity: Number,
        thumbnail : String,
        slug : String,
        newPrice : Number
    }],
    completedAt :{
        type : Date, 
        default : null
    },
    deliveredAt :{
        type : Date, 
        default : null
    },
    cancelRequest :{
        type : Boolean,
        default : false
    },
    totalPrice : Number,
    cart_id: String, //Có cart_id rồi mà vẫn cần products vì khi đặt đơn hàng thành công 
    //thì phải xóa giỏ hàng đi, nên nếu không lưu products thì sẽ không 
    //có thông tin về hàng, cart_id đóng vai trò để truy vết xem nằm ở giỏ hàng nào.
    deleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});
const OrdersModel = mongoose.model('Orders', orderSchema, 'orders');

module.exports = OrdersModel;