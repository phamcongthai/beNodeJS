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
//Sắp xếp sản phẩm :
const sortSelect = document.querySelector("select[name='sort']");
const clearSort = document.querySelector("button[sort-clear]")
if(sortSelect){
    sortSelect.addEventListener("change", (event)=>{
        const [sortKey, sortValue] = sortSelect.value.split('-');
        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);   
        window.location.href = url;     
    })
}
if(clearSort){
    clearSort.addEventListener("click", (event)=>{
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");
        window.location.href = url;
    })
}
  //Gán giá trị selected cho ô select :
const sortKey = url.searchParams.get("sortKey");
const sortValue = url.searchParams.get("sortValue");

if(sortKey && sortValue){
    const sortString = `${sortKey}-${sortValue}`;
    const opt = document.querySelectorAll("option[opt]");
    opt.forEach((item)=>{
            if(item.value == sortString){
                item.selected = true;
            }else{
                item.selected = false;
            }
    })
}

//Trang danh mục sản phẩm :
const createCategoryBtn = document.querySelector("[createCategoryBtn]");
if(createCategoryBtn){
    createCategoryBtn.addEventListener("click", (event)=>{
        window.location.href = `/admin/products-category/create`
    })
}
 //Sắp xếp :
const formSearchCategory = document.querySelector("#form-search-category");
if(formSearchCategory){
    formSearchCategory.addEventListener("submit", (event)=>{
       event.preventDefault();
       const find = event.target.elements.keyword.value;
       if(find){
        url.searchParams.set("keyword", find);
       }else{
        url.searchParams.delete("keyword")
       }
       window.location.href = url;
    })
}
//Xử lí ô check box : 

//Lấy ra bảng danh sách trước :
const tableCheckBoxCategory = document.querySelector("[table-checkall-category]");
if(tableCheckBoxCategory){
    
    //Lấy các phần tử con của nó  :
    //1-Lấy ra ô check all :
    const checkAll = tableCheckBoxCategory.querySelector("input[name='checkallCategory']");
    //Lấy ra các ô check con :
    const checkBox = tableCheckBoxCategory.querySelectorAll("input[name='idCategory']");//một tập hợp.
    //Nếu ấn vào nút check all thì tất cả check box cũng được tích :
    checkAll.addEventListener("click", (event)=>{
        
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
            console.log("hehe");
            // Tìm kiếm thẻ input chứa trong tableCheckBox có name là id và được tíchc chọn.
            const countChecked = tableCheckBoxCategory.querySelectorAll("input[name='idCategory']:checked").length;
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
const formChangeMultiCategory = document.querySelector("#form-change-multi-category");
if(formChangeMultiCategory){
    formChangeMultiCategory.addEventListener("submit", (event)=>{
        event.preventDefault();
        const boxChecked = tableCheckBoxCategory.querySelectorAll("input[name='idCategory']:checked");
        const typeChange = formChangeMultiCategory.querySelector('select[name="type"]').value;
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
            
            const inputIds = document.querySelector("#selected-ids-category"); // Đưa vào input ẩn
            inputIds.value = JSON.stringify(ids);//input không nhận mảng, nên chuyển thành json cho ez.
            formChangeMultiCategory.submit();
        }else{
            alert("Vui lòng chọn 1 ô !");
        }
        
    })
}
//Kết thúc phần check box.
//Phần thay đổi trạng thái trên sản phẩm :
const handleStatusCategory = document.querySelectorAll("[handle-status-category]");
const formChangeStatusCategory = document.querySelector("#form-change-status-category");
if(handleStatusCategory){
    handleStatusCategory.forEach((item)=>{
        item.addEventListener("click", (event)=>{
           
            
            event.preventDefault();
            let status = item.getAttribute("data-status");
            status = status == "active" ? "inactive" : "active";
            const id = item.getAttribute("data-id");
            
            
            if(formChangeStatusCategory){
                console.log("hehe");
                formChangeStatusCategory.action = `/admin/products-category/change-status/${status}/${id}?_method=PATCH`;
                formChangeStatusCategory.submit();
            }
        })
    })
    
}
//Kết thúc phần thay đổi trạng thái sản phẩm.
//Trang tạo danh mục sản phẩm : 
const btnCreateCategory = document.querySelector("[btn-create-category]");
const formCreateCategory = document.querySelector("[form-create-category]");
if(btnCreateCategory){
    
}
//Trang chỉnh sửa danh mục sản phẩm :
//Lấy ra :
const  btnEditCategory = document.querySelectorAll("[button-edit-category]")
if(btnEditCategory){

    
    btnEditCategory.forEach((item)=>{
        item.addEventListener("click", (event)=>{
            const id = item.getAttribute("id")
            window.location.href = `/admin/products-category/edit/${id}`;
        })
    })
}
//Cập nhật :
const btnUpdateCategory = document.querySelector("[btn-update-category]");
if(btnUpdateCategory){
    
    
}
//Xóa danh mục : 
const btnDeleleCategory = document.querySelectorAll("[button-del-category]");
if(btnDeleleCategory){
    btnDeleleCategory.forEach((item)=>{
        item.addEventListener("click", (event)=>{
            const id = item.getAttribute("id")
            window.location.href = `/admin/products-category/delete/${id}`;
        })
    })
}

//Thương hiệu :
const createBtnBrand = document.querySelector('button[createBtnBrand]');
if(createBtnBrand){
    createBtnBrand.addEventListener("click", (event)=>{
         window.location.href = `/admin/brands/create`;
    })
}
const buttondetailBrand = document.querySelectorAll('button[button-detailBrand]');
if(buttondetailBrand){
    buttondetailBrand.forEach((item)=>{
        item.addEventListener("click", (event)=>{
            const id = item.getAttribute("id")
            window.location.href = `/admin/brands/detail/${id}`;
        })
    })
}
const buttoneditBrand = document.querySelectorAll('button[button-editBrand]');
if(buttoneditBrand){
    buttoneditBrand.forEach((item)=>{
        item.addEventListener("click", (event)=>{
            const id = item.getAttribute("id")
            window.location.href = `/admin/brands/edit/${id}`;
        })
    })
}
const buttondelBrand = document.querySelectorAll('button[button-delBrand]');
if (buttondelBrand) {
    buttondelBrand.forEach((item) => {
        item.addEventListener("click", (event) => {
            const id = item.getAttribute("id");
            const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa thương hiệu này?");
            if (confirmDelete) {
                window.location.href = `/admin/brands/delete/${id}`;
            }
        });
    });
}

//Quảng cáo :
const createBtnAds = document.querySelector('button[createBtnAds]');
if(createBtnAds){
    createBtnAds.addEventListener("click", (event)=>{
         window.location.href = `/admin/ads/create`;
    })
}
const buttondetailAds = document.querySelectorAll('button[button-detailAds]');
if(buttondetailAds){
    buttondetailAds.forEach((item)=>{
        item.addEventListener("click", (event)=>{
            const id = item.getAttribute("id")
            window.location.href = `/admin/ads/detail/${id}`;
        })
    })
}
const buttoneditAds = document.querySelectorAll('button[button-editAds]');
if(buttoneditAds){
    buttoneditAds.forEach((item)=>{
        item.addEventListener("click", (event)=>{
            const id = item.getAttribute("id")
            window.location.href = `/admin/ads/edit/${id}`;
        })
    })
}
const buttondelAds = document.querySelectorAll('button[button-delAds]');
if (buttondelAds) {
    buttondelAds.forEach((item) => {
        item.addEventListener("click", (event) => {
            const id = item.getAttribute("id");
            const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa quảng cáo này?");
            if (confirmDelete) {
                window.location.href = `/admin/ads/delete/${id}`;
            }
        });
    });
}
// public/admin/js/script.js
document.addEventListener("DOMContentLoaded", () => {
  const multiImgInput = document.querySelector("[input-upload-img-multi]");
  const previewContainer = document.querySelector("#preview-multiple-images");

  if (multiImgInput && previewContainer) {
    // Mảng lưu các file đã chọn (File objects)
    let filesArray = [];

    // Hàm render ảnh + nút xóa
    function renderPreview() {
      previewContainer.innerHTML = "";
      filesArray.forEach((file, index) => {
        if (file.type.startsWith("image/")) {
          const wrapper = document.createElement("div");
          wrapper.style.position = "relative";
          wrapper.style.display = "inline-block";
          wrapper.style.marginRight = "10px";

          const img = document.createElement("img");
          img.src = URL.createObjectURL(file);
          img.style.width = "100px";
          img.style.height = "100px";
          img.style.objectFit = "cover";
          img.style.borderRadius = "5px";
          wrapper.appendChild(img);

          // Nút xóa ảnh
          const btnRemove = document.createElement("button");
          btnRemove.textContent = "×";
          btnRemove.type = "button";
          btnRemove.style.position = "absolute";
          btnRemove.style.top = "2px";
          btnRemove.style.right = "2px";
          btnRemove.style.background = "rgba(0,0,0,0.5)";
          btnRemove.style.color = "white";
          btnRemove.style.border = "none";
          btnRemove.style.borderRadius = "50%";
          btnRemove.style.width = "20px";
          btnRemove.style.height = "20px";
          btnRemove.style.cursor = "pointer";
          btnRemove.addEventListener("click", () => {
            filesArray.splice(index, 1);
            renderPreview();
            updateInputFiles();
          });
          wrapper.appendChild(btnRemove);

          previewContainer.appendChild(wrapper);
        }
      });
    }

    // Cập nhật lại file list của input (không thể gán trực tiếp, tạo DataTransfer)
    function updateInputFiles() {
      const dataTransfer = new DataTransfer();
      filesArray.forEach(file => dataTransfer.items.add(file));
      multiImgInput.files = dataTransfer.files;
    }

    multiImgInput.addEventListener("change", (event) => {
      // Thêm các file mới vào mảng
      const selectedFiles = Array.from(event.target.files);
      filesArray = filesArray.concat(selectedFiles);
      renderPreview();

      // Reset input để có thể chọn lại ảnh nếu muốn
      multiImgInput.value = "";
      updateInputFiles();
    });

    // Nếu muốn, có thể load ảnh có sẵn từ server (product.thumbnail) vào đây (không thể xóa client-side)
  }
});
