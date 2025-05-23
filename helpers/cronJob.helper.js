const cron = require('node-cron');
const OrderModel = require('../models/order.model');

module.exports.cronCheckCompleted = () => {
  cron.schedule('* * * * *', async () => {
    console.log('⏰ Cron job kiểm tra đơn hàng đã giao (test 3 phút)...');

    try {
      const orders = await OrderModel.find({ status: 'delivered' });

      const now = new Date();
      const threeMinutes = 3 * 60 * 1000; // 3 phút

      for (const order of orders) {
        if (!order.deliveredAt) continue;

        const deliveredAt = new Date(order.deliveredAt);

        if (now - deliveredAt >= threeMinutes) {
          order.status = 'completed';
          order.completedAt = now;

          await order.save();
          console.log(`✅ Đơn hàng ${order._id} đã tự chuyển sang 'completed' sau 3 phút`);
        }
      }
    } catch (err) {
      console.error('❌ Lỗi khi cập nhật trạng thái đơn hàng:', err);
    }
  });
};
