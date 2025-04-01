const productsModel = require('../models/products.model');
module.exports.pagination = async (page) => {
    let pagination = {
        limit: 4,
        pageTotal: 1,
        skip : 0,
        currentPage : 1
    }
    const totalProducts = await productsModel.countDocuments();
    pagination.pageTotal = Math.ceil(totalProducts / pagination.limit);
    if(page){
        pagination.skip = (page - 1) * pagination.limit;
        pagination.currentPage = page;
    }
    return pagination;
}