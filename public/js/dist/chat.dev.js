"use strict";

var formChat = document.querySelector('form[class="inner-form"]'); //CLIENT gửi tin nhắn lên server :

if (formChat) {
  formChat.addEventListener("submit", function (event) {
    event.preventDefault();
    var input = document.querySelector('input[name="content"]');

    if (input) {
      var content = input.value;
      socket.emit("CLIENT_SEND_MSG", content);
      input.value = "";
    }
  });
} //CLIENT nhậnt tin từ server :


socket.on("SERVER_SEND_MSG", function _callee(data) {
  var chatDiv, user_id, body, wrapper;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(data);
          chatDiv = document.querySelector('div.chat');

          if (chatDiv) {
            _context.next = 5;
            break;
          }

          console.error('Không tìm thấy div.chat');
          return _context.abrupt("return");

        case 5:
          user_id = chatDiv.getAttribute("user_id");
          console.log(user_id);
          body = document.querySelector('div.inner-body');

          if (body) {
            _context.next = 11;
            break;
          }

          console.error('Không tìm thấy div.inner-body');
          return _context.abrupt("return");

        case 11:
          wrapper = document.createElement('div');

          if (String(data.user_id) !== String(user_id)) {
            wrapper.innerHTML = "\n            <div class=\"inner-incoming\">\n                <div class=\"inner-name\">".concat(data.userName, "</div>\n                <div class=\"inner-content\">").concat(data.content, "</div>\n            </div>\n        ");
          } else {
            wrapper.innerHTML = "\n            <div class=\"inner-outgoing\">\n                <div class=\"inner-name\">".concat(data.userName, "</div>\n                <div class=\"inner-content\">").concat(data.content, "</div>\n            </div>\n        ");
          }

          body.appendChild(wrapper);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  });
});