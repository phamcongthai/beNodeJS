const ProductModel = require('../../models/products.model');
const AccountModel = require('../../models/account.model');
const mongoose = require('mongoose');

module.exports.add = async (req, res) => {
  try {
    const user = res.locals.currentUser; // admin user info
    const productId = req.params.productId;
    const { comment, parent_id } = req.body;

    if (!comment || !parent_id) {
      return res.status(400).send('Phải có nội dung trả lời và comment cha');
    }

    // Tìm sản phẩm theo _id (nên dùng ObjectId)
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).send('Sản phẩm không tồn tại');
    }

    // Kiểm tra comment cha có tồn tại không
    const parentComment = product.comments.id(parent_id);
    if (!parentComment) {
      return res.status(404).send('Bình luận cha không tồn tại');
    }

    // Tạo đối tượng reply mới
    const newReply = {
      _id: new mongoose.Types.ObjectId(),  // tạo id mới cho reply
      user_id: user._id.toString(), // admin id
      role: 'admin',
      comment: comment,
      rating: null, // trả lời không cần rating
      create_at: new Date(),
      parent_id: parent_id
    };

    // Thêm reply vào comments
    product.comments.push(newReply);

    // Lưu sản phẩm
    await product.save();

    res.redirect("back"); // hoặc url phù hợp
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi khi lưu trả lời bình luận');
  }
};
