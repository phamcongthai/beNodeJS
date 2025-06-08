const BlogsModel = require('../../models/blog.model');
const AccountModel = require('../../models/account.model');
const filterStatusHelper = require('../../helpers/filterStatus.helper');
const searchHelper = require('../../helpers/search');

// [GET] /admin/blogs
module.exports.blog = async (req, res) => {
    const find = { deleted: false };

    // Lọc theo trạng thái nếu có
    const status = req.query.status;
    if (status) {
        find.status = status;
    }

    // Tìm kiếm theo tiêu đề nếu có
    const keyword = req.query.keyword;
    if (keyword) {
        find.title = searchHelper.search(keyword); // Tìm kiếm theo tiêu đề bài viết
    }

    // Sắp xếp theo các tham số sortKey và sortValue nếu có
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.title = "asc"; // Sắp xếp mặc định theo tiêu đề bài viết
    }

    try {
        // Lấy dữ liệu bài viết
        const blogsData = await BlogsModel.find(find)
            .sort(sort)
            .lean();

        // Thêm thông tin người tạo bài viết vào dữ liệu
        for (const item of blogsData) {
            if (item.author?.id) {
                const account = await AccountModel.findOne({
                    deleted: false,
                    _id: item.author.id
                }).lean();
                
                item.account = account ? account : { fullName: "Không rõ" };
            } else {
                item.account = { fullName: "Không rõ" };
            }
        }

        // Trả về trang với dữ liệu bài viết
        res.render('admin/pages/blogs/index', {
            title: "Trang quản lý bài viết",
            blogsData,
            keyword,
            status
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Có lỗi xảy ra khi lấy dữ liệu bài viết!');
        res.redirect('/admin/blogs');
    }
};



// [GET] /admin/blogs/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/blogs/create', {
        title: "Trang thêm bài viết"
    });
};

// [POST] /admin/blogs/create
module.exports.createBE = async (req, res) => {
    try {
        const data = { ...req.body };

        // Gán thông tin tác giả vào bài viết (sử dụng author.id từ currentUser)
        data.author = {
            id: res.locals.currentUser._id  // Lấy _id của người dùng hiện tại từ `res.locals.currentUser`
        };

        // Tạo mới một bài viết
        const newBlog = new BlogsModel(data);
        await newBlog.save();

        req.flash('success', 'Thêm bài viết thành công!');
        res.redirect('/admin/blogs');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Thêm bài viết thất bại!');
        res.redirect('/admin/blogs/create');
    }
};

// [GET] /admin/blogs/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const blog = await BlogsModel.findOne({
            _id: id,
            deleted: false
        }).lean();

        if (!blog) {
            req.flash('error', 'Bài viết không tồn tại!');
            return res.redirect('/admin/blogs');
        }

        // Tìm người tạo (author)
        let authorInfo = "Không rõ";
        if (blog.author?.id) {
            const account = await AccountModel.findOne({
                _id: blog.author.id,
                deleted: false
            }).lean();

            if (account) {
                authorInfo = account.fullName || account.email || "Không rõ";
            }
        }

        res.render('admin/pages/blogs/detail', {
            title: `Chi tiết bài viết - ${blog.title}`,
            blog,
            authorInfo
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Có lỗi xảy ra khi hiển thị chi tiết bài viết!');
        res.redirect('/admin/blogs');
    }
};

// [GET] /admin/blogs/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const blog = await BlogsModel.findOne({ _id: id, deleted: false }).lean();

        if (!blog) {
            req.flash('error', 'Bài viết không tồn tại!');
            return res.redirect('/admin/blogs');
        }

        res.render('admin/pages/blogs/edit', {
            title: 'Chỉnh sửa bài viết',
            blog
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Lỗi khi truy cập trang chỉnh sửa!');
        res.redirect('/admin/blogs');
    }
};

// [PATCH] /admin/blogs/edit/:id
module.exports.editBE = async (req, res) => {
    try {
        const id = req.params.id;

        const updateData = {
            title: req.body.title,
            content: req.body.content,
            summary: req.body.summary,
            tags: req.body.tags?.split(',').map(tag => tag.trim()) || [],
            status: req.body.status,
            updatedAt: new Date()
        };

        await BlogsModel.updateOne({ _id: id }, updateData);
        req.flash('success', 'Cập nhật bài viết thành công!');
        res.redirect('/admin/blogs');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Cập nhật bài viết thất bại!');
        res.redirect('back');
    }
};


// [GET] /admin/blogs/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        await BlogsModel.updateOne(
            { _id: id },
            { deleted: true }
        );

        req.flash('success', 'Xóa bài viết thành công!');
        res.redirect('/admin/blogs');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Xóa bài viết thất bại!');
        res.redirect('back');
    }
};
