"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var ProductsModel = require('../../models/products.model');

var CategoryModel = require('../../models/products-category.model');

var BrandModel = require('../../models/brand.model');

module.exports.products = function _callee(req, res) {
  var products, brandIds, brandDocs, brandMap, brandList, data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(ProductsModel.find({
            deleted: false,
            status: 'active'
          }).sort({
            position: "desc"
          }));

        case 2:
          products = _context.sent;
          // Tập hợp brand_id duy nhất
          brandIds = _toConsumableArray(new Set(products.map(function (p) {
            return p.brand_id.toString();
          }))); // Lấy tên brand từ brand_id

          _context.next = 6;
          return regeneratorRuntime.awrap(BrandModel.find({
            _id: {
              $in: brandIds
            }
          }));

        case 6:
          brandDocs = _context.sent;
          brandMap = Object.fromEntries(brandDocs.map(function (b) {
            return [b._id.toString(), b.name];
          }));
          brandList = brandDocs.map(function (b) {
            return b.name;
          }); // Hoặc bạn có thể dùng từ `brandMap`

          data = {
            name: 'Trang sản phẩm',
            // 👈 CHÍNH là cái dòng gây lỗi nếu thiếu!
            products: products,
            brandList: brandList,
            brandMap: brandMap // Dùng để hiển thị tên brand theo ID trong mixin nếu cần

          };
          console.log(data);
          res.render('client/pages/products/index', {
            data: data
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  });
}; //Chi tiết sản phẩm :


module.exports.productsDetail = function _callee2(req, res) {
  var find, product;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          //Tìm sản phẩm đó :
          find = {
            deleted: false,
            slug: req.params.slug
          };
          _context2.next = 4;
          return regeneratorRuntime.awrap(ProductsModel.findOne(find));

        case 4:
          product = _context2.sent;
          //Dùng find thì nó trả về 1 mảng, findOne thì trả về 1 obj thôi.
          res.render("client/pages/products/detailProducts", {
            pageTitle: product.title,
            product: product
          });
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          res.redirect("/products");

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; //Danh mục :


module.exports.productsCategory = function _callee3(req, res) {
  var slugCategory, rootCategory, getAllChildrenIds, childrenIds, productData;
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          slugCategory = req.params.slug;
          _context4.next = 3;
          return regeneratorRuntime.awrap(CategoryModel.findOne({
            deleted: false,
            status: "active",
            slug: slugCategory
          }));

        case 3:
          rootCategory = _context4.sent;

          if (rootCategory) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(404).send("Category not found"));

        case 6:
          // Hàm đệ quy lấy tất cả _id con cháu
          getAllChildrenIds = function getAllChildrenIds(parentId) {
            var children, ids, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, child, subChildren;

            return regeneratorRuntime.async(function getAllChildrenIds$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return regeneratorRuntime.awrap(CategoryModel.find({
                      deleted: false,
                      status: "active",
                      parent_id: parentId
                    }).select('_id'));

                  case 2:
                    children = _context3.sent;
                    ids = children.map(function (c) {
                      return c._id;
                    });
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context3.prev = 7;
                    _iterator = children[Symbol.iterator]();

                  case 9:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                      _context3.next = 18;
                      break;
                    }

                    child = _step.value;
                    _context3.next = 13;
                    return regeneratorRuntime.awrap(getAllChildrenIds(child._id));

                  case 13:
                    subChildren = _context3.sent;
                    ids = ids.concat(subChildren);

                  case 15:
                    _iteratorNormalCompletion = true;
                    _context3.next = 9;
                    break;

                  case 18:
                    _context3.next = 24;
                    break;

                  case 20:
                    _context3.prev = 20;
                    _context3.t0 = _context3["catch"](7);
                    _didIteratorError = true;
                    _iteratorError = _context3.t0;

                  case 24:
                    _context3.prev = 24;
                    _context3.prev = 25;

                    if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                      _iterator["return"]();
                    }

                  case 27:
                    _context3.prev = 27;

                    if (!_didIteratorError) {
                      _context3.next = 30;
                      break;
                    }

                    throw _iteratorError;

                  case 30:
                    return _context3.finish(27);

                  case 31:
                    return _context3.finish(24);

                  case 32:
                    return _context3.abrupt("return", ids);

                  case 33:
                  case "end":
                    return _context3.stop();
                }
              }
            }, null, null, [[7, 20, 24, 32], [25,, 27, 31]]);
          }; // Lấy tất cả _id con cháu + chính nó


          _context4.next = 9;
          return regeneratorRuntime.awrap(getAllChildrenIds(rootCategory._id));

        case 9:
          childrenIds = _context4.sent;
          childrenIds.push(rootCategory._id); // Thêm chính nó

          _context4.next = 13;
          return regeneratorRuntime.awrap(ProductsModel.find({
            deleted: false,
            status: "active",
            category_id: {
              $in: childrenIds
            }
          }));

        case 13:
          productData = _context4.sent;
          res.render("client/pages/products/index", {
            title: rootCategory.title,
            productData: productData
          });

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  });
};