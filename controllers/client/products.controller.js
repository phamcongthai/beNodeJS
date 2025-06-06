const ProductsModel = require('../../models/products.model');
const CategoryModel = require('../../models/products-category.model');
const BrandModel = require('../../models/brand.model');
const UserModel = require('../../models/user.model');
//[GET] : Sản phẩm : 
module.exports.products = async (req, res) => {
  try {
    const { brand, price } = req.query;
    const query = {
      deleted: false,
      status: 'active'
    };

    // Xử lý lọc theo brand
    if (brand) {
      const brandDoc = await BrandModel.findOne({ name: brand });
      if (brandDoc) {
        query.brand_id = brandDoc._id;
      }
    }

    // Xử lý lọc theo khoảng giá
    if (price) {
      const [min, max] = price.split('-').map(Number);
      if (!isNaN(min)) query.price = { ...query.price, $gte: min };
      if (!isNaN(max)) query.price = { ...query.price, $lte: max };
    }

    // Lấy sản phẩm sau khi áp dụng bộ lọc
    const products = await ProductsModel.find(query).sort({ position: -1 });

    // Gán tên thương hiệu
    const brandIds = [...new Set(products.map(p => p.brand_id?.toString()))];
    const brandDocs = await BrandModel.find({ _id: { $in: brandIds } });
    const brandMap = Object.fromEntries(brandDocs.map(b => [b._id.toString(), b.name]));
    const productsWithBrandName = products.map(p => ({
      ...p.toObject(),
      brandName: brandMap[p.brand_id?.toString()] || 'Không rõ'
    }));

    // Danh sách thương hiệu
    const allBrands = await BrandModel.find();
    const brandList = allBrands.map(b => b.name);

    // Tính khoảng giá
    const prices = await ProductsModel.find({ deleted: false, status: 'active' }).distinct('price');
    let priceRanges = [], minPrice = 0, maxPrice = 0;

    if (prices.length > 0) {
      minPrice = Math.min(...prices);
      maxPrice = Math.max(...prices);
      const step = Math.ceil((maxPrice - minPrice) / 7);

      for (let i = 0; i < 7; i++) {
        const start = minPrice + i * step;
        const end = (i === 6) ? Infinity : minPrice + (i + 1) * step;
        priceRanges.push({
          label: (end === Infinity)
            ? `Trên ${formatPrice(start)}`
            : `Từ ${formatPrice(start)} - ${formatPrice(end)}`,
          min: start,
          max: end
        });
      }
    }

    function formatPrice(price) {
      return price >= 1_000_000
        ? `${(price / 1_000_000).toFixed(0)} triệu`
        : `${(price / 1000).toFixed(0)} nghìn`;
    }

    res.render('client/pages/products/index', {
      data: {
        products: productsWithBrandName,
        brandList,
        brandMap,
        priceRanges,
        minPrice,
        maxPrice
      }
    });
  } catch (err) {
    console.error('Lỗi controller:', err);
    res.status(500).send('Lỗi tải trang sản phẩm');
  }
};
//Chi tiết sản phẩm : 

module.exports.productsDetail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug
    };
    const product = await ProductsModel.findOne(find);

    if (!product) return res.redirect('/products');

    let enrichedComments = [];

    if (product.comments && product.comments.length > 0) {
      const userIds = product.comments.map(c => c.user_id);
      const users = await UserModel.find({ _id: { $in: userIds }, deleted: false })
        .select('_id fullName avatar');

      const userMap = {};
      users.forEach(user => {
        userMap[user._id.toString()] = user;
      });

      enrichedComments = product.comments.map(comment => {
        const user = userMap[comment.user_id] || {};
        return {
          ...comment._doc,
          fullName: user.fullName || 'Người dùng ẩn danh',
          avatar: user.avatar || '/images/default-avatar.png'
        };
      });
    }

    res.render('client/pages/products/detailProducts', {
      pageTitle: product.title,
      product,
      comments: enrichedComments
    });

  } catch (error) {
    console.error(error);
    res.redirect('/products');
  }
};
//Danh mục :
module.exports.productsCategory = async (req, res) => {
  const slugCategory = req.params.slug;
  const { brand, price } = req.query;

  try {
    // Lấy danh mục gốc dựa trên slug
    const rootCategory = await CategoryModel.findOne({
      deleted: false,
      status: "active",
      slug: slugCategory
    });

    if (!rootCategory) {
      return res.status(404).send("Danh mục không tồn tại");
    }

    // Đệ quy lấy ID danh mục con
    const getAllChildrenIds = async (parentId) => {
      const children = await CategoryModel.find({
        deleted: false,
        status: "active",
        parent_id: parentId
      }).select('_id');

      let ids = children.map(c => c._id);

      for (const child of children) {
        const subChildren = await getAllChildrenIds(child._id);
        ids = ids.concat(subChildren);
      }

      return ids;
    };

    const childrenIds = await getAllChildrenIds(rootCategory._id);
    childrenIds.push(rootCategory._id);

    // Khởi tạo điều kiện truy vấn
    const query = {
      deleted: false,
      status: 'active',
      category_id: { $in: childrenIds }
    };

    // Lọc theo brand (nếu có)
    if (brand) {
      const brandDoc = await BrandModel.findOne({ name: brand });
      if (brandDoc) {
        query.brand_id = brandDoc._id;
      }
    }

    // Lọc theo khoảng giá (nếu có)
    if (price) {
      const [min, max] = price.split('-').map(Number);
      if (!isNaN(min)) query.price = { ...query.price, $gte: min };
      if (!isNaN(max)) query.price = { ...query.price, $lte: max };
    }

    // Tìm sản phẩm
    const products = await ProductsModel.find(query).sort({ position: -1 });

    // Gắn brandName vào sản phẩm
    const brandIds = [...new Set(products.map(p => p.brand_id?.toString()))];
    const brandDocs = await BrandModel.find({ _id: { $in: brandIds } });
    const brandMap = Object.fromEntries(brandDocs.map(b => [b._id.toString(), b.name]));
    const productsWithBrandName = products.map(p => ({
      ...p.toObject(),
      brandName: brandMap[p.brand_id?.toString()] || 'Không rõ'
    }));

    // Danh sách brand để hiển thị bộ lọc
    const allBrandDocs = await BrandModel.find();
    const brandList = allBrandDocs.map(b => b.name);

    // Tính khoảng giá dựa trên toàn bộ sản phẩm trong danh mục
    const allPrices = await ProductsModel.find({
      deleted: false,
      status: 'active',
      category_id: { $in: childrenIds }
    }).distinct('price');

    let priceRanges = [], minPrice = 0, maxPrice = 0;

    if (allPrices.length > 0) {
      minPrice = Math.min(...allPrices);
      maxPrice = Math.max(...allPrices);
      const step = Math.ceil((maxPrice - minPrice) / 7);

      for (let i = 0; i < 7; i++) {
        const start = minPrice + i * step;
        const end = (i === 6) ? Infinity : minPrice + (i + 1) * step;
        priceRanges.push({
          label: (end === Infinity)
            ? `Trên ${formatPrice(start)}`
            : `Từ ${formatPrice(start)} - ${formatPrice(end)}`,
          min: start,
          max: end
        });
      }
    }

    function formatPrice(price) {
      return price >= 1_000_000
        ? `${(price / 1_000_000).toFixed(0)} triệu`
        : `${(price / 1000).toFixed(0)} nghìn`;
    }

    res.render('client/pages/products/index', {
      data: {
        products: productsWithBrandName,
        brandList,
        brandMap,
        categoryTitle: rootCategory.title,
        priceRanges,
        minPrice,
        maxPrice
      }
    });

  } catch (err) {
    console.error('Lỗi controller:', err);
    res.status(500).send('Lỗi tải trang danh mục');
  }
};
