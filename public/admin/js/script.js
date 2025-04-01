const buttons = document.querySelectorAll('[button-status]');
const url = new URL(window.location.href);
buttons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
        const status = event.target.getAttribute("button-status");
        if(status){
            url.searchParams.set("status", status);
        }else{
            url.searchParams.delete("status");
        }
        window.location.href = url;
    });
});
//form search : 
const formSearch = document.querySelector("#form-search");
if(formSearch){
    formSearch.addEventListener("submit", (event)=>{
       event.preventDefault();
       console.log(event.target.elements.keyword.value);
       const find = event.target.elements.keyword.value;
       if(find){
        url.searchParams.set("keyword", find);
       }else{
        url.searchParams.delete("keyword")
       }
       window.location.href = url;
        
    })
}
//pagination : 
const paginationButton = document.querySelectorAll("[button-page]");
if(paginationButton){
    paginationButton.forEach((button)=>{
        button.addEventListener("click", (event)=>{
            const page = button.getAttribute("button-page"); //Cách lấy ra page từ trong thuộc tính của button, để có thể gọi các nút tiến lùi;
            if(page){
                url.searchParams.set("page", page);
            }else{
                url.searchParams.delete("page")
            }
            window.location.href = url;
        })
    })
}
//Change status : 
const statusProduct = document.querySelectorAll("[handle-status]");
const formChangeStatus = document.querySelector("#form-change-status");
//Tại sao lại dùng form ở đây ?
//Vì ta xuất mỗi item là 1 phần tử của mảng, nên mỗi item không thể có form riêng được.
//=> Dùng form chung. Vậy tại sao không gắn luôn id , status cho action luôn mà phải thông qua data path.
//=> Vì ta còn phải lấy riêng mỗi id , status của mỗi item riêng, thay đổi status rồi mới gắn vào.
// Rồi submit, đây là cách dài dòng , bản chất, dùng form để đẩy lên db bằng patch , giúp bảo mật hơn,
//Nhưng cái liên quan tới thay đổi thông tin sản phẩm thì user không nên có quyền, những cái tìm kiếm, xem sản phẩm , lọc thì nên để get (có thể lấy trên url).
if(statusProduct){
    statusProduct.forEach((item) => {
        item.addEventListener("click", (event) => {
            event.preventDefault();
            const status = item.getAttribute("data-status");
            const id     = item.getAttribute("data-id");
            let dataPath = formChangeStatus.getAttribute("data-path");
            //Thay đổi status :
            const statusChange = status === "active" ? "inactive" : "active";
            dataPath  += `/${statusChange}/${id}?_method=PATCH`;
            formChangeStatus.action = dataPath;
            console.log(formChangeStatus.action);
            
            formChangeStatus.submit();
            
        })
    })
}
//Xử lí ô check box : 

//Lấy ra bảng danh sách trước :
const tableCheckBox = document.querySelector("[table-checkall]");
if(tableCheckBox){
    //Lấy các phần tử con của nó  :
    //1-Lấy ra ô check all :
    const checkAll = tableCheckBox.querySelector("input[name='checkall']");
    //Lấy ra các ô check con :
    const checkBox = tableCheckBox.querySelectorAll("input[name='id']");//một tập hợp.
    //Nếu ấn vào nút check all thì tất cả check box cũng được tích :
    checkAll.addEventListener("click", (event)=>{
        console.log(checkAll.checked);
        
        if(checkAll.checked){
            checkBox.forEach((item)=>{
                item.checked = true;
            })
        }else{
            checkBox.forEach((item)=>{
                item.checked = false;
            })
        }

    });
    checkBox.forEach((item)=>{
        item.addEventListener("click", (event)=>{
            // Tìm kiếm thẻ input chứa trong tableCheckBox có name là id và được tíchc chọn.
            const countChecked = tableCheckBox.querySelectorAll("input[name='id']:checked").length;
            //So sánh giữa số lượng checkbox và count :
            if(countChecked == checkBox.length){
                checkAll.checked = true;
            }else{
                checkAll.checked = false;
            }
            console.log(countChecked, checkBox.length);
            
        })
    })
    
}
//Phần form :
const formChangeMulti = document.querySelector("#form-change-multi");
if(formChangeMulti){
    formChangeMulti.addEventListener("submit", (event)=>{
        event.preventDefault();
        const boxChecked = tableCheckBox.querySelectorAll("input[name='id']:checked");
        const typeChange = formChangeMulti.querySelector('select[name="type"]').value;
        console.log(typeChange);
        
        if(boxChecked.length > 0){
            let ids = [];
            boxChecked.forEach((item) => {
                if(typeChange == "changePosition"){
                    const position = item.closest("tr").querySelector("input[name='position']").value;
                    ids.push(`${item.id}-${position}`);  
                }else{
                    ids.push(item.id);
                }
            });
            console.log(ids);
            
            const inputIds = document.querySelector("#selected-ids"); // Đưa vào input ẩn
            inputIds.value = JSON.stringify(ids);//input không nhận mảng, nên chuyển thành json cho ez.
            formChangeMulti.submit();
        }else{
            alert("Vui lòng chọn 1 ô !");
        }
        
    })
}
//Kết thúc phần check box.
//Phần xóa :
//1- Xóa vĩnh viễn :
const delButton = document.querySelectorAll("[button-del]");
const formDeleteT = document.querySelector("#form-deleteT")

if(delButton){
    delButton.forEach((item)=>{
        item.addEventListener("click", (event)=>{
            const isConfirm = confirm("Bạn có muốn xóa sản phẩm này không ?");
            if(isConfirm){
                if(formDeleteT ){
                    event.preventDefault();
                    let path = formDeleteT.getAttribute("data-path");
                    formDeleteT.action = path + `/${item.id}?_method=DELETE`;
                    console.log(formDeleteT.action);
                    formDeleteT.submit();
                }
                
            }
        })
    })
}
//2-Xóa tạm thời: 
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
//Thêm mới sản phẩm :
const createBtn = document.querySelector("[createBtn]");
if(createBtn){
    createBtn.addEventListener("click", (event)=>{
        window.location.href = "/admin/products/create";
    })
}
//Xem trước ảnh :
const inputUploadImg = document.querySelector("[input-upload-img]");
const imgUpload = document.querySelector("[img-upload]");
if(inputUploadImg){
    inputUploadImg.addEventListener("change", (event)=>{
        const [file] = inputUploadImg.files;
        if(file){
            if(imgUpload){
                imgUpload.src = URL.createObjectURL(file);
            }
        }
    })
}
//Sửa sản phẩm :
const btnEdit = document.querySelectorAll("[button-edit]");
if(btnEdit){
    btnEdit.forEach((item)=>{
        item.addEventListener("click", (event)=>{
            const id = item.id;
            window.location.href = `/admin/products/edit/${id}`;
        })
    })
}
//Xem chi tiết sản phẩm :
const btnDetail = document.querySelectorAll("[button-detail]");
if(btnDetail){
    btnDetail.forEach((item)=>{
        item.addEventListener("click", (event)=>{
            const id = item.id;
            window.location.href = `/admin/products/detail/${id}`;
        })
    })
}