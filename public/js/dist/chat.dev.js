"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var Popper = _interopRequireWildcard(require("https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var formChat = document.querySelector('form[class="inner-form"]'); //Khi vào phần chat mặc định sẽ scroll xuống tin nhắn mới nhất :

var body = document.querySelector('div.inner-body');

if (body) {
  body.scrollTop = body.scrollHeight;
} //CLIENT gửi tin nhắn lên server :


if (formChat) {
  ;
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

          if (!(!data.content || data.content.trim() === "")) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return");

        case 3:
          chatDiv = document.querySelector('div.chat');

          if (chatDiv) {
            _context.next = 7;
            break;
          }

          console.error('Không tìm thấy div.chat');
          return _context.abrupt("return");

        case 7:
          user_id = chatDiv.getAttribute("user_id");
          console.log(user_id);
          body = document.querySelector('div.inner-body');

          if (body) {
            _context.next = 13;
            break;
          }

          console.error('Không tìm thấy div.inner-body');
          return _context.abrupt("return");

        case 13:
          wrapper = document.createElement('div');

          if (String(data.user_id) !== String(user_id)) {
            wrapper.innerHTML = "\n            <div class=\"inner-incoming\">\n                <div class=\"inner-name\">".concat(data.userName, "</div>\n                <div class=\"inner-content\">").concat(data.content, "</div>\n            </div>\n        ");
          } else {
            wrapper.innerHTML = "\n            <div class=\"inner-outgoing\">\n                <div class=\"inner-name\">".concat(data.userName, "</div>\n                <div class=\"inner-content\">").concat(data.content, "</div>\n            </div>\n        ");
          }

          body.appendChild(wrapper);
          body.scrollTop = body.scrollHeight;

        case 17:
        case "end":
          return _context.stop();
      }
    }
  });
}); //Emoji :

var emoji = document.querySelector('emoji-picker');

if (emoji) {
  emoji.addEventListener('emoji-click', function (event) {
    var input = document.querySelector('input[name="content"]');
    input.value = input.value + event.detail.unicode;
  });
} //Show icon :


var button_emoji = document.querySelector('.button-emoji');

if (button_emoji) {
  var tooltip = document.querySelector('.tooltip');
  Popper.createPopper(button_emoji, tooltip);

  button_emoji.onclick = function () {
    tooltip.classList.toggle('shown');
  };
}