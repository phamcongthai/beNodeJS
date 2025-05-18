"use strict";

var SettingsGeneralModel = require('../../models/settingsGeneral.model'); //Trang cài đặt chung :
//[GET] : Trang cài đặt chung:


module.exports.general = function _callee(req, res) {
  var settingsGeneral;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(SettingsGeneralModel.findOne({}));

        case 2:
          settingsGeneral = _context.sent;
          res.render("admin/pages/settings/general", {
            title: "Cài đặt chung",
            settingsGeneral: settingsGeneral
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}; //[PATCH] : Trang cài đặt chung :


module.exports.generalBE = function _callee2(req, res) {
  var settingsGeneral, settingsGeneralRec;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(SettingsGeneralModel.findOne({}));

        case 2:
          settingsGeneral = _context2.sent;

          if (settingsGeneral) {
            _context2.next = 9;
            break;
          }

          settingsGeneralRec = new SettingsGeneralModel(req.body);
          _context2.next = 7;
          return regeneratorRuntime.awrap(settingsGeneralRec.save());

        case 7:
          _context2.next = 11;
          break;

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(SettingsGeneralModel.updateOne({
            _id: settingsGeneral._id
          }, req.body));

        case 11:
          res.redirect("back");

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  });
};