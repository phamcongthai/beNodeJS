const BlogsModel = require('../../models/blog.model');

module.exports.blog = async (req, res) => {
    try {
        const blogs = await BlogsModel.find({ deleted: false, status: 'published' });
        const { slug } = req.params;

        const blogActive = await BlogsModel.findOne({ slug, deleted: false, status: 'published' });

        res.render('client/pages/blogs/index', {
            title: blogActive?.title || 'Trang bài viết',
            blogs,
            blogActive
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi lấy dữ liệu blog');
    }
};
