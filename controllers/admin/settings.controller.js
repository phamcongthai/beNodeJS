const SettingsGeneralModel = require('../../models/settingsGeneral.model');
//Trang cài đặt chung :
//[GET] : Trang cài đặt chung:
module.exports.general = async (req, res) => {
    const settingsGeneral = await SettingsGeneralModel.findOne({});
    res.render("admin/pages/settings/general", {
        title: "Cài đặt chung",
        settingsGeneral
    })
}
//[PATCH] : Trang cài đặt chung :
module.exports.generalBE = async (req, res) => {
    const settingsGeneral = await SettingsGeneralModel.findOne({});
    if (!settingsGeneral) {
        const settingsGeneralRec = new SettingsGeneralModel(req.body);
        await settingsGeneralRec.save();
    }else{
        await SettingsGeneralModel.updateOne({_id : settingsGeneral._id}, req.body);
    }

    res.redirect("back");
}