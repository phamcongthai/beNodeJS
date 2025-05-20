import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
const formChat = document.querySelector('form[class="inner-form"]');
//Khi vào phần chat mặc định sẽ scroll xuống tin nhắn mới nhất :
const body = document.querySelector('div.inner-body');
if(body){
    body.scrollTop = body.scrollHeight;
}
//CLIENT gửi tin nhắn lên server :
if (formChat) {;
    formChat.addEventListener("submit", (event) => {
        event.preventDefault()
        const input = document.querySelector('input[name="content"]');
        if (input) {
            const content = input.value;
            socket.emit("CLIENT_SEND_MSG", content);
            input.value = "";
        }
    })

}
//CLIENT nhậnt tin từ server :
socket.on("SERVER_SEND_MSG", async (data) => {
    console.log(data);

    if (!data.content || data.content.trim() === "") {
        return; // Không xử lý tin nhắn rỗng
    }

    const chatDiv = document.querySelector('div.chat');
    if (!chatDiv) {
        console.error('Không tìm thấy div.chat');
        return;
    }
    
    const user_id = chatDiv.getAttribute("user_id");
    console.log(user_id);
    
    const body = document.querySelector('div.inner-body');
    if (!body) {
        console.error('Không tìm thấy div.inner-body');
        return;
    }

    const wrapper = document.createElement('div');

    if (String(data.user_id) !== String(user_id)) {
        wrapper.innerHTML = `
            <div class="inner-incoming">
                <div class="inner-name">${data.userName}</div>
                <div class="inner-content">${data.content}</div>
            </div>
        `;
    } else {
        wrapper.innerHTML = `
            <div class="inner-outgoing">
                <div class="inner-name">${data.userName}</div>
                <div class="inner-content">${data.content}</div>
            </div>
        `;
    }

    body.appendChild(wrapper);
    body.scrollTop = body.scrollHeight;
});

//Emoji :
const emoji = document.querySelector('emoji-picker');
if(emoji){
    emoji.addEventListener('emoji-click', (event)=>{
        const input = document.querySelector('input[name="content"]');
        input.value = input.value + event.detail.unicode;
    });

}
//Show icon :
const button_emoji = document.querySelector('.button-emoji');
if(button_emoji){
    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(button_emoji, tooltip)
    button_emoji.onclick = () => {
    tooltip.classList.toggle('shown')
  }
    
}