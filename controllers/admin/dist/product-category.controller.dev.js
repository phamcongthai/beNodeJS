"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ProductsCategoryModel = require('../../models/products-category.model');

var searchHelper = require('../../helpers/search');

var filterStatusHelper = require('../../helpers/filterStatus.helper');

var createTreeHelper = require('../../helpers/createTree.helper'); //[GET] : Lấy ra trang danh mục sản phẩm:


module.exports.products_category = function _callee(req, res) {
  var find, keySearch, filterStatus, status, sortKey, sortValue, sort, category, newCategory;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          find = {
            deleted: false
          }; //Tìm kiếm :

          keySearch = req.query.keyword;

          if (keySearch) {
            find.title = searchHelper.search(keySearch);
          }

          filterStatus = filterStatusHelper.filterStatus();
          status = req.query.status;

          if (status) {
            //Lọc sản phẩm theo status : 
            find.status = req.query.status;
            filterStatus = filterStatusHelper.filterStatus(status);
          } //Phần sắp xếp :


          sortKey = req.query.sortKey;
          sortValue = req.query.sortValue;
          sort = {};

          if (sortKey && sortValue) {
            sort[sortKey] = sortValue;
          } else {
            sort.position = "asc";
          }

          _context.next = 12;
          return regeneratorRuntime.awrap(ProductsCategoryModel.find(find).sort(sort));

        case 12:
          category = _context.sent;
          newCategory = createTreeHelper(category);
          res.render('admin/pages/products-category/index', {
            title: "Trang danh mục sản phẩm",
            category: newCategory,
            keySearch: keySearch,
            filterStatus: filterStatus
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  });
}; ////Change multi :


module.exports.changeMulti = function _callee2(req, res) {
  var status, ids, tmp, _i2, _tmp, item;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          status = req.body.type;
          ids = req.body.ids;

          if (!(status === "changePosition")) {
            _context2.next = 17;
            break;
          }

          ids = JSON.parse(ids);
          tmp = []; // Tạo danh sách cập nhật

          ids.forEach(function (item) {
            var _item$split = item.split('-'),
                _item$split2 = _slicedToArray(_item$split, 2),
                id = _item$split2[0],
                position = _item$split2[1];

            tmp.push({
              id: id,
              position: parseInt(position)
            });
          }); // Dùng for...of để chờ từng lần cập nhật hoàn tất

          _i2 = 0, _tmp = tmp;

        case 8:
          if (!(_i2 < _tmp.length)) {
            _context2.next = 15;
            break;
          }

          item = _tmp[_i2];
          _context2.next = 12;
          return regeneratorRuntime.awrap(ProductsCategoryModel.updateOne({
            _id: item.id
          }, {
            position: item.position
          }));

        case 12:
          _i2++;
          _context2.next = 8;
          break;

        case 15:
          _context2.next = 26;
          break;

        case 17:
          if (!(status !== "deleteAll")) {
            _context2.next = 23;
            break;
          }

          ids = JSON.parse(ids);
          _context2.next = 21;
          return regeneratorRuntime.awrap(ProductsCategoryModel.updateMany({
            _id: {
              $in: ids
            }
          }, {
            status: status
          }));

        case 21:
          _context2.next = 26;
          break;

        case 23:
          ids = JSON.parse(ids);
          _context2.next = 26;
          return regeneratorRuntime.awrap(ProductsCategoryModel.updateMany({
            _id: {
              $in: ids
            }
          }, {
            deleted: true,
            deletedTime: new Date()
          }));

        case 26:
          res.redirect("back");
          _context2.next = 33;
          break;

        case 29:
          _context2.prev = 29;
          _context2.t0 = _context2["catch"](0);
          console.error("Lỗi trong changeMulti:", _context2.t0);
          res.status(500).send("Lỗi server");

        case 33:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 29]]);
}; //Xóa tạm thời  :


module.exports.deleteCategory = function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(ProductsCategoryModel.updateOne({
            _id: req.params.id
          }, {
            deleted: true
          }));

        case 2:
          res.redirect("/admin/products-category");

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
}; //Tạo mới danh mục sản phẩm :


module.exports.products_categoryCreate = function _callee4(req, res) {
  var find, category, newCategory;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          find = {
            deleted: false
          };
          _context4.next = 4;
          return regeneratorRuntime.awrap(ProductsCategoryModel.find(find));

        case 4:
          category = _context4.sent;
          newCategory = category.length > 0 ? createTreeHelper(category) : [];
          res.render("admin/pages/products-category/createCategory", {
            title: "Trang tạo mới danh mục sản phẩm",
            category: newCategory
          });
          _context4.next = 13;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.error("Lỗi khi tạo cây phân cấp:", _context4.t0);
          res.status(500).send("Lỗi server");

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; //[POST] : Đẩy lên db :


module.exports.products_categoryCreateBE = function _callee5(req, res) {
  var productCategory;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (!(req.body.position == "")) {
            _context5.next = 7;
            break;
          }

          _context5.next = 3;
          return regeneratorRuntime.awrap(ProductsCategoryModel.countDocuments());

        case 3:
          _context5.t0 = _context5.sent;
          req.body.position = _context5.t0 + 1;
          _context5.next = 8;
          break;

        case 7:
          req.body.position = parseInt(req.body.position);

        case 8:
          productCategory = new ProductsCategoryModel(req.body);
          _context5.next = 11;
          return regeneratorRuntime.awrap(productCategory.save());

        case 11:
          res.redirect('/admin/products-category');

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  });
}; //[POST] : Thay đổi trạng thái 1 danh mục sản phẩm :


module.exports.changeStatus = function _callee6(req, res) {
  var status, id;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          status = req.params.status;
          id = req.params.id; //Cập nhật trạng thái sản phẩm :

          _context6.next = 4;
          return regeneratorRuntime.awrap(ProductsCategoryModel.updateOne({
            _id: id
          }, {
            status: status
          }));

        case 4:
          req.flash('success', 'Cập nhật trạng thái thành công !');
          res.redirect("back");

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  });
};

module.exports.editCategory = function _callee7(req, res) {
  var allCategory, categoryCurr, newCategory;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(ProductsCategoryModel.find({
            deleted: false
          }));

        case 3:
          allCategory = _context7.sent;
          _context7.next = 6;
          return regeneratorRuntime.awrap(ProductsCategoryModel.findOne({
            _id: req.params.id,
            deleted: false
          }));

        case 6:
          categoryCurr = _context7.sent;

          if (!(!allCategory || allCategory.length === 0 || !categoryCurr)) {
            _context7.next = 9;
            break;
          }

          return _context7.abrupt("return", res.status(404).send("Không tìm thấy danh mục."));

        case 9:
          newCategory = createTreeHelper(allCategory);
          res.render("admin/pages/products-category/editCategory", {
            title: "Trang chỉnh sửa danh mục sản phẩm",
            category: newCategory,
            categoryCurr: categoryCurr
          });
          _context7.next = 17;
          break;

        case 13:
          _context7.prev = 13;
          _context7.t0 = _context7["catch"](0);
          console.error("Lỗi khi tạo cây phân cấp:", _context7.t0);
          res.status(500).send("Lỗi server");

        case 17:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

module.exports.editCategoryBE = function _callee8(req, res) {
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          req.body.position = parseInt(req.body.position);
          _context8.next = 3;
          return regeneratorRuntime.awrap(ProductsCategoryModel.updateOne({
            _id: req.params.id
          }, req.body));

        case 3:
          res.redirect("/admin/products-category");

        case 4:
        case "end":
          return _context8.stop();
      }
    }
  });
};