"use strict";

var mongoose = require('mongoose');

var settingsGeneralSchema = new mongoose.Schema({
  websiteName: String,
  logo: String,
  phone: String,
  email: String,
  address: String,
  copyright: String
}, {
  timestamps: true
}); // Thêm trường createAt và updateAtupdateAt

var settingsGeneralModel = mongoose.model('settingsGeneral', settingsGeneralSchema, 'settingsGeneral');
module.exports = settingsGeneralModel;