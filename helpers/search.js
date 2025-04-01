module.exports.search = (keyword) => {
        return { $regex: keyword, $options: "i" };
}