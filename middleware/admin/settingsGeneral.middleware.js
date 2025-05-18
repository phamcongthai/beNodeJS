const SettingsGeneralModel = require('../../models/settingsGeneral.model');

module.exports.settingsGeneral = async (req, res, next) => {
    const settingsGeneralData = await SettingsGeneralModel.findOne({});
    res.locals.settingsGeneralData = settingsGeneralData;
    next();
}