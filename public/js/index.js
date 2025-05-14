//Phần alert :
const alertForm = document.querySelector("[showAlert]");
const hidenAlert = document.querySelector("[close-alert]");
if(alertForm){
    setTimeout(()=>{
        alertForm.classList.add("alert-hidden");
    }, alertForm.getAttribute("data-time"))
    if(hidenAlert){
        hidenAlert.addEventListener("click", (event)=>{
            alertForm.classList.add("alert-hidden");
        })
    }
}
//Cập nhật sản phẩm : 
const inputQuantity = document.querySelectorAll("input[input-quantity]");
if(inputQuantity){
    inputQuantity.forEach((item)=>{
        item.addEventListener("change", (event)=>{
            const productId = item.getAttribute("product-id");
            const quantity = item.value;
            console.log(productId, quantity);
            window.location.href = `/cart/update/${productId}/${quantity}`
        })
    })
}