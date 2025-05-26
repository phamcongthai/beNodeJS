const cron = require('node-cron');
const OrderModel = require('../models/order.model');

module.exports.cronCheckCompleted = () => {
  cron.schedule('* * * * *', async () => {
    console.log('⏰ Cron job kiểm tra đơn hàng đã giao (test 2 ngày)...');

    try {
      const orders = await OrderModel.find({ status: 'delivered' });

      const now = new Date();
      const twoDays = 48 * 60 * 60 * 1000; // 2 ngày

      for (const order of orders) {
        if (!order.deliveredAt) continue;

        const deliveredAt = new Date(order.deliveredAt);

        if (now - deliveredAt >= twoDays) {
          order.status = 'completed';
          order.completedAt = now;

          await order.save();
          console.log(`✅ Đơn hàng ${order._id} đã tự chuyển sang 'completed' sau 2 ngày`);
        }
      }
    } catch (err) {
      console.error('❌ Lỗi khi cập nhật trạng thái đơn hàng:', err);
    }
  });
};
