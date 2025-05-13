const productsCategoryModel = require('../../models/products-category.model');
const createTree = require('../../helpers/createTreeClient.helper');
module.exports.categorySubmenu = async (req, res, next) => {
    const categories = await productsCategoryModel.find({deleted : false}).lean();
    const categoryTree = createTree(categories); 
    res.locals.categories = categoryTree;
    next();
}