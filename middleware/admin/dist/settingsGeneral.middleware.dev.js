"use strict";

var SettingsGeneralModel = require('../../models/settingsGeneral.model');

module.exports.settingsGeneral = function _callee(req, res, next) {
  var settingsGeneralData;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(SettingsGeneralModel.findOne({}));

        case 2:
          settingsGeneralData = _context.sent;
          res.locals.settingsGeneralData = settingsGeneralData;
          next();

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};