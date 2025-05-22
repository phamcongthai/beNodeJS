const btn = document.querySelectorAll('button[btn-order]');
const url = new URL(window.location.href);
if (btn) {
    console.log("hehe");
    btn.forEach((item) => {
        item.addEventListener("click", (event) => {
            const status = event.target.getAttribute("data-status");
            if (status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }
            window.location.href = url;
        })
    })
}