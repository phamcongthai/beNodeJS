const ChatModel = require('../../models/chat.model');
const UserModel = require('../../models/user.model');
//[GET] : Lấy ra giao diện chat :
module.exports.formChat = async (req, res) => {
    _io.once('connection', (socket) => {
        console.log('ID của user kết nối', socket.id);
        //Lưu vào db :
        socket.on("CLIENT_SEND_MSG", async (content) => {
            const chat = new ChatModel({
                user_id: res.locals.user.id,
                content: content
            });
            await chat.save();
            //Trả lại tin nhắn cho tất cả các client :
            _io.emit("SERVER_SEND_MSG", {
                user_id: res.locals.user._id,
                userName: res.locals.user.fullName,
                content: content
            })
        })
    })
    //Lấy tin nhắn cũ đưa ra giao diện (không có thì thôi)
    const user = res.locals.user;
    const msg = await ChatModel.find({}).lean();
    for (const item of msg) {
        const userName = await UserModel.findOne({
            _id: user._id
        }).select("fullName");
        item.userName = userName.fullName;
    }

    res.render("client/pages/chat/index", {
        title: "Chat",
        msg
    });
}