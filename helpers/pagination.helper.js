module.exports.pagination = async (Model, page = 1, filter = {}, limit = 4) => {
    const pagination = {
        limit,
        pageTotal: 1,
        skip: 0,
        currentPage: page
    };

    const totalItems = await Model.countDocuments(filter);
    pagination.pageTotal = Math.ceil(totalItems / limit);
    pagination.skip = (page - 1) * limit;

    return pagination;
};
