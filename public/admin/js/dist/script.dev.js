"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var buttons = document.querySelectorAll('[button-status]');
var url = new URL(window.location.href);
buttons.forEach(function (btn) {
  btn.addEventListener("click", function (event) {
    var status = event.target.getAttribute("button-status");

    if (status) {
      url.searchParams.set("status", status);
    } else {
      url.searchParams["delete"]("status");
    }

    window.location.href = url;
  });
}); //form search : 

var formSearch = document.querySelector("#form-search");

if (formSearch) {
  formSearch.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log(event.target.elements.keyword.value);
    var find = event.target.elements.keyword.value;

    if (find) {
      url.searchParams.set("keyword", find);
    } else {
      url.searchParams["delete"]("keyword");
    }

    window.location.href = url;
  });
} //pagination : 


var paginationButton = document.querySelectorAll("[button-page]");

if (paginationButton) {
  paginationButton.forEach(function (button) {
    button.addEventListener("click", function (event) {
      var page = button.getAttribute("button-page"); //Cách lấy ra page từ trong thuộc tính của button, để có thể gọi các nút tiến lùi;

      if (page) {
        url.searchParams.set("page", page);
      } else {
        url.searchParams["delete"]("page");
      }

      window.location.href = url;
    });
  });
} //Change status : 


var statusProduct = document.querySelectorAll("[handle-status]");
var formChangeStatus = document.querySelector("#form-change-status"); //Tại sao lại dùng form ở đây ?
//Vì ta xuất mỗi item là 1 phần tử của mảng, nên mỗi item không thể có form riêng được.
//=> Dùng form chung. Vậy tại sao không gắn luôn id , status cho action luôn mà phải thông qua data path.
//=> Vì ta còn phải lấy riêng mỗi id , status của mỗi item riêng, thay đổi status rồi mới gắn vào.
// Rồi submit, đây là cách dài dòng , bản chất, dùng form để đẩy lên db bằng patch , giúp bảo mật hơn,
//Nhưng cái liên quan tới thay đổi thông tin sản phẩm thì user không nên có quyền, những cái tìm kiếm, xem sản phẩm , lọc thì nên để get (có thể lấy trên url).

if (statusProduct) {
  statusProduct.forEach(function (item) {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      var status = item.getAttribute("data-status");
      var id = item.getAttribute("data-id");
      var dataPath = formChangeStatus.getAttribute("data-path"); //Thay đổi status :

      var statusChange = status === "active" ? "inactive" : "active";
      dataPath += "/".concat(statusChange, "/").concat(id, "?_method=PATCH");
      formChangeStatus.action = dataPath;
      console.log(formChangeStatus.action);
      formChangeStatus.submit();
    });
  });
} //Xử lí ô check box : 
//Lấy ra bảng danh sách trước :


var tableCheckBox = document.querySelector("[table-checkall]");

if (tableCheckBox) {
  //Lấy các phần tử con của nó  :
  //1-Lấy ra ô check all :
  var checkAll = tableCheckBox.querySelector("input[name='checkall']"); //Lấy ra các ô check con :

  var checkBox = tableCheckBox.querySelectorAll("input[name='id']"); //một tập hợp.
  //Nếu ấn vào nút check all thì tất cả check box cũng được tích :

  checkAll.addEventListener("click", function (event) {
    console.log(checkAll.checked);

    if (checkAll.checked) {
      checkBox.forEach(function (item) {
        item.checked = true;
      });
    } else {
      checkBox.forEach(function (item) {
        item.checked = false;
      });
    }
  });
  checkBox.forEach(function (item) {
    item.addEventListener("click", function (event) {
      // Tìm kiếm thẻ input chứa trong tableCheckBox có name là id và được tíchc chọn.
      var countChecked = tableCheckBox.querySelectorAll("input[name='id']:checked").length; //So sánh giữa số lượng checkbox và count :

      if (countChecked == checkBox.length) {
        checkAll.checked = true;
      } else {
        checkAll.checked = false;
      }

      console.log(countChecked, checkBox.length);
    });
  });
} //Phần form :


var formChangeMulti = document.querySelector("#form-change-multi");

if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", function (event) {
    event.preventDefault();
    var boxChecked = tableCheckBox.querySelectorAll("input[name='id']:checked");
    var typeChange = formChangeMulti.querySelector('select[name="type"]').value;
    console.log(typeChange);

    if (boxChecked.length > 0) {
      var ids = [];
      boxChecked.forEach(function (item) {
        if (typeChange == "changePosition") {
          var position = item.closest("tr").querySelector("input[name='position']").value;
          ids.push("".concat(item.id, "-").concat(position));
        } else {
          ids.push(item.id);
        }
      });
      console.log(ids);
      var inputIds = document.querySelector("#selected-ids"); // Đưa vào input ẩn

      inputIds.value = JSON.stringify(ids); //input không nhận mảng, nên chuyển thành json cho ez.

      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn 1 ô !");
    }
  });
} //Kết thúc phần check box.
//Phần xóa :
//1- Xóa vĩnh viễn :


var delButton = document.querySelectorAll("[button-del]");
var formDeleteT = document.querySelector("#form-deleteT");

if (delButton) {
  delButton.forEach(function (item) {
    item.addEventListener("click", function (event) {
      var isConfirm = confirm("Bạn có muốn xóa sản phẩm này không ?");

      if (isConfirm) {
        if (formDeleteT) {
          event.preventDefault();
          var path = formDeleteT.getAttribute("data-path");
          formDeleteT.action = path + "/".concat(item.id, "?_method=DELETE");
          console.log(formDeleteT.action);
          formDeleteT.submit();
        }
      }
    });
  });
} //2-Xóa tạm thời: 
//Phần alert :


var alertForm = document.querySelector("[showAlert]");
var hidenAlert = document.querySelector("[close-alert]");

if (alertForm) {
  setTimeout(function () {
    alertForm.classList.add("alert-hidden");
  }, alertForm.getAttribute("data-time"));

  if (hidenAlert) {
    hidenAlert.addEventListener("click", function (event) {
      alertForm.classList.add("alert-hidden");
    });
  }
} //Thêm mới sản phẩm :


var createBtn = document.querySelector("[createBtn]");

if (createBtn) {
  createBtn.addEventListener("click", function (event) {
    window.location.href = "/admin/products/create";
  });
} //Xem trước ảnh :


var inputUploadImg = document.querySelector("[input-upload-img]");
var imgUpload = document.querySelector("[img-upload]");

if (inputUploadImg) {
  inputUploadImg.addEventListener("change", function (event) {
    var _inputUploadImg$files = _slicedToArray(inputUploadImg.files, 1),
        file = _inputUploadImg$files[0];

    if (file) {
      if (imgUpload) {
        imgUpload.src = URL.createObjectURL(file);
      }
    }
  });
} //Sửa sản phẩm :


var btnEdit = document.querySelectorAll("[button-edit]");

if (btnEdit) {
  btnEdit.forEach(function (item) {
    item.addEventListener("click", function (event) {
      var id = item.id;
      window.location.href = "/admin/products/edit/".concat(id);
    });
  });
} //Xem chi tiết sản phẩm :


var btnDetail = document.querySelectorAll("[button-detail]");

if (btnDetail) {
  btnDetail.forEach(function (item) {
    item.addEventListener("click", function (event) {
      var id = item.id;
      window.location.href = "/admin/products/detail/".concat(id);
    });
  });
} //Sắp xếp sản phẩm :


var sortSelect = document.querySelector("select[name='sort']");
var clearSort = document.querySelector("button[sort-clear]");

if (sortSelect) {
  sortSelect.addEventListener("change", function (event) {
    var _sortSelect$value$spl = sortSelect.value.split('-'),
        _sortSelect$value$spl2 = _slicedToArray(_sortSelect$value$spl, 2),
        sortKey = _sortSelect$value$spl2[0],
        sortValue = _sortSelect$value$spl2[1];

    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);
    window.location.href = url;
  });
}

if (clearSort) {
  clearSort.addEventListener("click", function (event) {
    url.searchParams["delete"]("sortKey");
    url.searchParams["delete"]("sortValue");
    window.location.href = url;
  });
} //Gán giá trị selected cho ô select :


var sortKey = url.searchParams.get("sortKey");
var sortValue = url.searchParams.get("sortValue");

if (sortKey && sortValue) {
  var sortString = "".concat(sortKey, "-").concat(sortValue);
  var opt = document.querySelectorAll("option[opt]");
  opt.forEach(function (item) {
    if (item.value == sortString) {
      item.selected = true;
    } else {
      item.selected = false;
    }
  });
} //Trang danh mục sản phẩm :


var createCategoryBtn = document.querySelector("[createCategoryBtn]");

if (createCategoryBtn) {
  createCategoryBtn.addEventListener("click", function (event) {
    window.location.href = "/admin/products-category/create";
  });
} //Sắp xếp :


var formSearchCategory = document.querySelector("#form-search-category");

if (formSearchCategory) {
  formSearchCategory.addEventListener("submit", function (event) {
    event.preventDefault();
    var find = event.target.elements.keyword.value;

    if (find) {
      url.searchParams.set("keyword", find);
    } else {
      url.searchParams["delete"]("keyword");
    }

    window.location.href = url;
  });
} //Xử lí ô check box : 
//Lấy ra bảng danh sách trước :


var tableCheckBoxCategory = document.querySelector("[table-checkall-category]");

if (tableCheckBoxCategory) {
  //Lấy các phần tử con của nó  :
  //1-Lấy ra ô check all :
  var _checkAll = tableCheckBoxCategory.querySelector("input[name='checkallCategory']"); //Lấy ra các ô check con :


  var _checkBox = tableCheckBoxCategory.querySelectorAll("input[name='idCategory']"); //một tập hợp.
  //Nếu ấn vào nút check all thì tất cả check box cũng được tích :


  _checkAll.addEventListener("click", function (event) {
    if (_checkAll.checked) {
      _checkBox.forEach(function (item) {
        item.checked = true;
      });
    } else {
      _checkBox.forEach(function (item) {
        item.checked = false;
      });
    }
  });

  _checkBox.forEach(function (item) {
    item.addEventListener("click", function (event) {
      console.log("hehe"); // Tìm kiếm thẻ input chứa trong tableCheckBox có name là id và được tíchc chọn.

      var countChecked = tableCheckBoxCategory.querySelectorAll("input[name='idCategory']:checked").length; //So sánh giữa số lượng checkbox và count :

      if (countChecked == _checkBox.length) {
        _checkAll.checked = true;
      } else {
        _checkAll.checked = false;
      }

      console.log(countChecked, _checkBox.length);
    });
  });
} //Phần form :


var formChangeMultiCategory = document.querySelector("#form-change-multi-category");

if (formChangeMultiCategory) {
  formChangeMultiCategory.addEventListener("submit", function (event) {
    event.preventDefault();
    var boxChecked = tableCheckBoxCategory.querySelectorAll("input[name='idCategory']:checked");
    var typeChange = formChangeMultiCategory.querySelector('select[name="type"]').value;
    console.log(typeChange);

    if (boxChecked.length > 0) {
      var ids = [];
      boxChecked.forEach(function (item) {
        if (typeChange == "changePosition") {
          var position = item.closest("tr").querySelector("input[name='position']").value;
          ids.push("".concat(item.id, "-").concat(position));
        } else {
          ids.push(item.id);
        }
      });
      console.log(ids);
      var inputIds = document.querySelector("#selected-ids-category"); // Đưa vào input ẩn

      inputIds.value = JSON.stringify(ids); //input không nhận mảng, nên chuyển thành json cho ez.

      formChangeMultiCategory.submit();
    } else {
      alert("Vui lòng chọn 1 ô !");
    }
  });
} //Kết thúc phần check box.
//Phần thay đổi trạng thái trên sản phẩm :


var handleStatusCategory = document.querySelectorAll("[handle-status-category]");
var formChangeStatusCategory = document.querySelector("#form-change-status-category");

if (handleStatusCategory) {
  handleStatusCategory.forEach(function (item) {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      var status = item.getAttribute("data-status");
      status = status == "active" ? "inactive" : "active";
      var id = item.getAttribute("data-id");

      if (formChangeStatusCategory) {
        console.log("hehe");
        formChangeStatusCategory.action = "/admin/products-category/change-status/".concat(status, "/").concat(id, "?_method=PATCH");
        formChangeStatusCategory.submit();
      }
    });
  });
} //Kết thúc phần thay đổi trạng thái sản phẩm.
//Trang tạo danh mục sản phẩm : 


var btnCreateCategory = document.querySelector("[btn-create-category]");
var formCreateCategory = document.querySelector("[form-create-category]");

if (btnCreateCategory) {} //Trang chỉnh sửa danh mục sản phẩm :
//Lấy ra :


var btnEditCategory = document.querySelectorAll("[button-edit-category]");

if (btnEditCategory) {
  btnEditCategory.forEach(function (item) {
    item.addEventListener("click", function (event) {
      var id = item.getAttribute("id");
      window.location.href = "/admin/products-category/edit/".concat(id);
    });
  });
} //Cập nhật :


var btnUpdateCategory = document.querySelector("[btn-update-category]");

if (btnUpdateCategory) {} //Xóa danh mục : 


var btnDeleleCategory = document.querySelectorAll("[button-del-category]");

if (btnDeleleCategory) {
  btnDeleleCategory.forEach(function (item) {
    item.addEventListener("click", function (event) {
      var id = item.getAttribute("id");
      window.location.href = "/admin/products-category/delete/".concat(id);
    });
  });
} //Thương hiệu :


var createBtnBrand = document.querySelector('button[createBtnBrand]');

if (createBtnBrand) {
  createBtnBrand.addEventListener("click", function (event) {
    window.location.href = "/admin/brands/create";
  });
}

var buttondetailBrand = document.querySelectorAll('button[button-detailBrand]');

if (buttondetailBrand) {
  buttondetailBrand.forEach(function (item) {
    item.addEventListener("click", function (event) {
      var id = item.getAttribute("id");
      window.location.href = "/admin/brands/detail/".concat(id);
    });
  });
}

var buttoneditBrand = document.querySelectorAll('button[button-editBrand]');

if (buttoneditBrand) {
  buttoneditBrand.forEach(function (item) {
    item.addEventListener("click", function (event) {
      var id = item.getAttribute("id");
      window.location.href = "/admin/brands/edit/".concat(id);
    });
  });
}

var buttondelBrand = document.querySelectorAll('button[button-delBrand]');

if (buttondelBrand) {
  buttondelBrand.forEach(function (item) {
    item.addEventListener("click", function (event) {
      var id = item.getAttribute("id");
      var confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa thương hiệu này?");

      if (confirmDelete) {
        window.location.href = "/admin/brands/delete/".concat(id);
      }
    });
  });
} //Quảng cáo :


var createBtnAds = document.querySelector('button[createBtnAds]');

if (createBtnAds) {
  createBtnAds.addEventListener("click", function (event) {
    window.location.href = "/admin/ads/create";
  });
}

var buttondetailAds = document.querySelectorAll('button[button-detailAds]');

if (buttondetailAds) {
  buttondetailAds.forEach(function (item) {
    item.addEventListener("click", function (event) {
      var id = item.getAttribute("id");
      window.location.href = "/admin/ads/detail/".concat(id);
    });
  });
}

var buttoneditAds = document.querySelectorAll('button[button-editAds]');

if (buttoneditAds) {
  buttoneditAds.forEach(function (item) {
    item.addEventListener("click", function (event) {
      var id = item.getAttribute("id");
      window.location.href = "/admin/ads/edit/".concat(id);
    });
  });
}

var buttondelAds = document.querySelectorAll('button[button-delAds]');

if (buttondelAds) {
  buttondelAds.forEach(function (item) {
    item.addEventListener("click", function (event) {
      var id = item.getAttribute("id");
      var confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa quảng cáo này?");

      if (confirmDelete) {
        window.location.href = "/admin/ads/delete/".concat(id);
      }
    });
  });
} // public/admin/js/script.js


document.addEventListener("DOMContentLoaded", function () {
  var multiImgInput = document.querySelector("[input-upload-img-multi]");
  var previewContainer = document.querySelector("#preview-multiple-images");

  if (multiImgInput && previewContainer) {
    // Hàm render ảnh + nút xóa
    var renderPreview = function renderPreview() {
      previewContainer.innerHTML = "";
      filesArray.forEach(function (file, index) {
        if (file.type.startsWith("image/")) {
          var wrapper = document.createElement("div");
          wrapper.style.position = "relative";
          wrapper.style.display = "inline-block";
          wrapper.style.marginRight = "10px";
          var img = document.createElement("img");
          img.src = URL.createObjectURL(file);
          img.style.width = "100px";
          img.style.height = "100px";
          img.style.objectFit = "cover";
          img.style.borderRadius = "5px";
          wrapper.appendChild(img); // Nút xóa ảnh

          var btnRemove = document.createElement("button");
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
          btnRemove.addEventListener("click", function () {
            filesArray.splice(index, 1);
            renderPreview();
            updateInputFiles();
          });
          wrapper.appendChild(btnRemove);
          previewContainer.appendChild(wrapper);
        }
      });
    }; // Cập nhật lại file list của input (không thể gán trực tiếp, tạo DataTransfer)


    var updateInputFiles = function updateInputFiles() {
      var dataTransfer = new DataTransfer();
      filesArray.forEach(function (file) {
        return dataTransfer.items.add(file);
      });
      multiImgInput.files = dataTransfer.files;
    };

    // Mảng lưu các file đã chọn (File objects)
    var filesArray = [];
    multiImgInput.addEventListener("change", function (event) {
      // Thêm các file mới vào mảng
      var selectedFiles = Array.from(event.target.files);
      filesArray = filesArray.concat(selectedFiles);
      renderPreview(); // Reset input để có thể chọn lại ảnh nếu muốn

      multiImgInput.value = "";
      updateInputFiles();
    }); // Nếu muốn, có thể load ảnh có sẵn từ server (product.thumbnail) vào đây (không thể xóa client-side)
  }
});