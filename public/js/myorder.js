const btn = document.querySelectorAll('button[btn-order]');
const url = new URL(window.location.href);
//Lọc theo trạng thái :
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
//Tìm kiếm :
const formSearch = document.querySelector("#search-order");
if(formSearch){
    formSearch.addEventListener('keydown', (event)=>{
        if(event.key == 'Enter'){
            const keyword = formSearch.value
            if (keyword) {
                url.searchParams.set("keywordOrder", keyword);
            } else {
                url.searchParams.delete("keywordOrder");
            }
            window.location.href = url
            
        }
    })
    
}