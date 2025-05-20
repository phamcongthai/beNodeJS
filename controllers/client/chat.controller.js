const ChatModel = require('../../models/chat.model');
const UserModel = require('../../models/user.model');
//[GET] : Lấy ra giao diện chat :
module.exports.formChat = async (req, res) => {
    const user_id = res.locals.user._id;
    const userName = res.locals.user.fullName;
    _io.once('connection', (socket) => {
        console.log('ID của user kết nối', socket.id);
        //Lưu vào db :
        socket.on("CLIENT_SEND_MSG", async (content) => {
            const chat = new ChatModel({
                user_id: user_id,
                content: content
            });
            await chat.save();
            //Trả lại tin nhắn cho tất cả các client :
            _io.emit("SERVER_SEND_MSG", {
                user_id: user_id,
                userName: userName,
                content: content
            })
        })
    })
    //Lấy tin nhắn cũ đưa ra giao diện (không có thì thôi)
    const msg = await ChatModel.find({}).lean();
    for (const item of msg) {
        const userName = await UserModel.findOne({
            _id: item.user_id
        }).select("fullName");
        item.userName = userName.fullName;
    }

    res.render("client/pages/chat/index", {
        title: "Chat",
        msg
    });
}