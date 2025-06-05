const searchHelper = require('../../helpers/search');
const ProductsModel = require('../../models/products.model');
const BrandModel = require('../../models/brand.model');

module.exports.search = async (req, res) => {
    const keyword = req.query.keyword?.trim();
    const { brand, price } = req.query;

    if (!keyword) {
        return res.redirect('back');
    }

    try {
        const searchRegex = searchHelper.search(keyword);

        // Xây dựng điều kiện tìm kiếm cơ bản
        const query = {
            deleted: false,
            status: 'active',
            $or: [
                { title: searchRegex },
                { tags: searchRegex }
            ]
        };

        // Lọc theo thương hiệu (brand)
        if (brand) {
            const brandDoc = await BrandModel.findOne({ name: brand });
            if (brandDoc) {
                query.brand_id = brandDoc._id;
            }
        }

        // Lọc theo khoảng giá
        if (price) {
            const [min, max] = price.split('-').map(Number);
            if (!isNaN(min)) query.price = { ...query.price, $gte: min };
            if (!isNaN(max)) query.price = { ...query.price, $lte: max };
        }

        // Tìm sản phẩm phù hợp
        const products = await ProductsModel.find(query).sort({ position: -1 });

        // Tìm brand liên quan
        const brandIds = [...new Set(products.map(p => p.brand_id?.toString()))];
        const brandDocs = await BrandModel.find({ _id: { $in: brandIds } });
        const brandMap = Object.fromEntries(brandDocs.map(b => [b._id.toString(), b.name]));

        // Gắn brandName cho mỗi sản phẩm
        const productsWithBrandName = products.map(p => ({
            ...p.toObject(),
            brandName: brandMap[p.brand_id?.toString()] || 'Không rõ'
        }));

        // Lấy toàn bộ danh sách thương hiệu để render lọc
        const allBrands = await BrandModel.find();
        const brandList = allBrands.map(b => b.name);

        // Tính các khoảng giá
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
                    label: end === Infinity
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
            title: "Kết quả tìm kiếm cho: " + keyword,
            keyword,
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
        console.error('Lỗi khi tìm kiếm:', err);
        res.status(500).send('Lỗi tải trang tìm kiếm');
    }
};
