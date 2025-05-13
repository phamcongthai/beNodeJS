function createTree(arr, parentId = "") {
    const tree = [];

    arr.forEach((item) => {
        if (item.parent_id?.toString() === parentId.toString()) {
            const newItem = {
                ...item._doc
            };
            const children = createTree(arr, item._id);

            if (children.length > 0) {
                newItem.children = children;
            }

            tree.push(newItem);
        }
    });

    return tree;
}
module.exports = createTree;