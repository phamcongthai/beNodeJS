"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var path = require('path');

var _require = require('@google-analytics/data'),
    BetaAnalyticsDataClient = _require.BetaAnalyticsDataClient;

var ProductsCategoryModel = require('../../models/products-category.model');

var ProductModel = require('../../models/products.model');

var AccountsModel = require('../../models/account.model');

var UserModel = require('../../models/user.model'); // Đường dẫn tới service account file JSON


var KEY_FILE_PATH = path.join(__dirname, '../../config/service-account.json'); // GA4 Property ID - KHÔNG phải là Measurement ID

var PROPERTY_ID = '481189639'; // Thay đúng GA4 Property ID của bạn
// Tạo client GA4

var analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: KEY_FILE_PATH
});

function getRealtimeUsers() {
  var _ref, _ref2, response;

  return regeneratorRuntime.async(function getRealtimeUsers$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(analyticsDataClient.runRealtimeReport({
            property: "properties/".concat(PROPERTY_ID),
            metrics: [{
              name: 'activeUsers'
            }]
          }));

        case 3:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 1);
          response = _ref2[0];

          if (!(response.rows && response.rows.length > 0)) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", parseInt(response.rows[0].metricValues[0].value, 10));

        case 8:
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error('GA4 Realtime error:', _context.t0.message);

        case 13:
          return _context.abrupt("return", 0);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

function getTodayPageviews() {
  var _ref3, _ref4, response;

  return regeneratorRuntime.async(function getTodayPageviews$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(analyticsDataClient.runReport({
            property: "properties/".concat(PROPERTY_ID),
            dateRanges: [{
              startDate: 'today',
              endDate: 'today'
            }],
            metrics: [{
              name: 'screenPageViews'
            }]
          }));

        case 3:
          _ref3 = _context2.sent;
          _ref4 = _slicedToArray(_ref3, 1);
          response = _ref4[0];

          if (!(response.rows && response.rows.length > 0)) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", parseInt(response.rows[0].metricValues[0].value, 10));

        case 8:
          _context2.next = 13;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error('GA4 Pageviews error:', _context2.t0.message);

        case 13:
          return _context2.abrupt("return", 0);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

module.exports.index = function _callee(req, res) {
  var statistic;
  return regeneratorRuntime.async(function _callee$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          statistic = {
            categoryProduct: {
              total: 0,
              active: 0,
              inactive: 0
            },
            product: {
              total: 0,
              active: 0,
              inactive: 0
            },
            account: {
              total: 0,
              active: 0,
              inactive: 0
            },
            user: {
              total: 0,
              active: 0,
              inactive: 0
            },
            googleAnalytics: {
              realtimeUsers: 0,
              todayPageviews: 0
            }
          };
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(ProductsCategoryModel.countDocuments());

        case 4:
          statistic.categoryProduct.total = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(ProductsCategoryModel.countDocuments({
            status: "active"
          }));

        case 7:
          statistic.categoryProduct.active = _context3.sent;
          _context3.next = 10;
          return regeneratorRuntime.awrap(ProductsCategoryModel.countDocuments({
            status: "inactive"
          }));

        case 10:
          statistic.categoryProduct.inactive = _context3.sent;
          _context3.next = 13;
          return regeneratorRuntime.awrap(ProductModel.countDocuments());

        case 13:
          statistic.product.total = _context3.sent;
          _context3.next = 16;
          return regeneratorRuntime.awrap(ProductModel.countDocuments({
            status: "active"
          }));

        case 16:
          statistic.product.active = _context3.sent;
          _context3.next = 19;
          return regeneratorRuntime.awrap(ProductModel.countDocuments({
            status: "inactive"
          }));

        case 19:
          statistic.product.inactive = _context3.sent;
          _context3.next = 22;
          return regeneratorRuntime.awrap(AccountsModel.countDocuments());

        case 22:
          statistic.account.total = _context3.sent;
          _context3.next = 25;
          return regeneratorRuntime.awrap(AccountsModel.countDocuments({
            status: "active"
          }));

        case 25:
          statistic.account.active = _context3.sent;
          _context3.next = 28;
          return regeneratorRuntime.awrap(AccountsModel.countDocuments({
            status: "inactive"
          }));

        case 28:
          statistic.account.inactive = _context3.sent;
          _context3.next = 31;
          return regeneratorRuntime.awrap(UserModel.countDocuments());

        case 31:
          statistic.user.total = _context3.sent;
          _context3.next = 34;
          return regeneratorRuntime.awrap(UserModel.countDocuments({
            status: "active"
          }));

        case 34:
          statistic.user.active = _context3.sent;
          _context3.next = 37;
          return regeneratorRuntime.awrap(UserModel.countDocuments({
            status: "inactive"
          }));

        case 37:
          statistic.user.inactive = _context3.sent;
          _context3.next = 40;
          return regeneratorRuntime.awrap(getRealtimeUsers());

        case 40:
          statistic.googleAnalytics.realtimeUsers = _context3.sent;
          _context3.next = 43;
          return regeneratorRuntime.awrap(getTodayPageviews());

        case 43:
          statistic.googleAnalytics.todayPageviews = _context3.sent;
          _context3.next = 49;
          break;

        case 46:
          _context3.prev = 46;
          _context3.t0 = _context3["catch"](1);
          console.error('Lỗi khi tính thống kê:', _context3.t0.message);

        case 49:
          res.render('admin/pages/dashboard/index', {
            title: "Trang tổng quan",
            statistic: statistic
          });

        case 50:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 46]]);
};