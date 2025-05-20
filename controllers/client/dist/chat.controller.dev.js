"use strict";

var ChatModel = require('../../models/chat.model');

var UserModel = require('../../models/user.model'); //[GET] : Lấy ra giao diện chat :


module.exports.formChat = function _callee2(req, res) {
  var user_id, userName, msg, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, _userName;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          user_id = res.locals.user._id;
          userName = res.locals.user.fullName;

          _io.once('connection', function (socket) {
            console.log('ID của user kết nối', socket.id); //Lưu vào db :

            socket.on("CLIENT_SEND_MSG", function _callee(content) {
              var chat;
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      chat = new ChatModel({
                        user_id: user_id,
                        content: content
                      });
                      _context.next = 3;
                      return regeneratorRuntime.awrap(chat.save());

                    case 3:
                      //Trả lại tin nhắn cho tất cả các client :
                      _io.emit("SERVER_SEND_MSG", {
                        user_id: user_id,
                        userName: userName,
                        content: content
                      });

                    case 4:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            });
          }); //Lấy tin nhắn cũ đưa ra giao diện (không có thì thôi)


          _context2.next = 5;
          return regeneratorRuntime.awrap(ChatModel.find({}).lean());

        case 5:
          msg = _context2.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 9;
          _iterator = msg[Symbol.iterator]();

        case 11:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context2.next = 20;
            break;
          }

          item = _step.value;
          _context2.next = 15;
          return regeneratorRuntime.awrap(UserModel.findOne({
            _id: item.user_id
          }).select("fullName"));

        case 15:
          _userName = _context2.sent;
          item.userName = _userName.fullName;

        case 17:
          _iteratorNormalCompletion = true;
          _context2.next = 11;
          break;

        case 20:
          _context2.next = 26;
          break;

        case 22:
          _context2.prev = 22;
          _context2.t0 = _context2["catch"](9);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 26:
          _context2.prev = 26;
          _context2.prev = 27;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 29:
          _context2.prev = 29;

          if (!_didIteratorError) {
            _context2.next = 32;
            break;
          }

          throw _iteratorError;

        case 32:
          return _context2.finish(29);

        case 33:
          return _context2.finish(26);

        case 34:
          res.render("client/pages/chat/index", {
            title: "Chat",
            msg: msg
          });

        case 35:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[9, 22, 26, 34], [27,, 29, 33]]);
};