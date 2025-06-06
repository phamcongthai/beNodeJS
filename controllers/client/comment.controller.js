const ProductsModel = require('../../models/products.model');

module.exports.addComment = async (req, res) => {
  try {
    const { productSlug } = req.params;  // Lấy slug từ URL
    const { comment, rating } = req.body;  // Lấy comment và rating từ form

    // Lấy thông tin người dùng từ res.locals.user (được set qua middleware)
    const user = res.locals.user;

    // Kiểm tra người dùng đã đăng nhập chưa
    if (!user) {
      return res.status(401).send('Bạn cần đăng nhập để bình luận');
    }

    // Kiểm tra các trường comment và rating đã được nhập chưa
    if (!comment || !rating) {
      return res.status(400).send('Bạn phải nhập đầy đủ bình luận và đánh giá');
    }

    // Tìm sản phẩm theo slug
    const product = await ProductsModel.findOne({ slug: productSlug });  // Sử dụng slug thay vì productId
    if (!product) {
      return res.status(404).send('Sản phẩm không tồn tại');
    }

    // Tạo đối tượng bình luận mới
    const newComment = {
      user_id: user._id,  // ID của người dùng hiện tại
      role: 'user',  // Mặc định role là user
      comment: comment,  // Nội dung bình luận
      rating: rating,  // Đánh giá
      create_at: new Date()  // Thời gian tạo bình luận
    };
    console.log(newComment);
    
    // Thêm bình luận vào mảng comments của sản phẩm
    product.comments.push(newComment);

    // Lưu sản phẩm với bình luận mới
    await product.save();

    // Chuyển hướng lại về trang chi tiết sản phẩm
    res.redirect(`/products/detail/${productSlug}`);  // Sử dụng slug trong URL
  } catch (error) {
    console.error(error);
    res.status(500).send('Có lỗi khi thêm bình luận');
  }
};
