"use strict";

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
} //Cập nhật sản phẩm : 


var inputQuantity = document.querySelectorAll("input[input-quantity]");

if (inputQuantity) {
  inputQuantity.forEach(function (item) {
    item.addEventListener("change", function (event) {
      var productId = item.getAttribute("product-id");
      var quantity = item.value;
      console.log(productId, quantity);
      window.location.href = "/cart/update/".concat(productId, "/").concat(quantity);
    });
  });
}

var btn_brand = document.querySelectorAll("btn-brand");
var priceCheckboxes = document.querySelectorAll("input[name='price']");

if (btn_brand) {
  btn_brand.forEach(function (item) {
    item.addEventListener("click", function (event) {
      var selectedBrand = item.getAttribute("data-brand");
      var selectedPrice = "";
      priceCheckboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
          selectedPrice = checkbox.value;
        }
      }); // Tạo URL với query

      var url = "/products?brand=".concat(encodeURIComponent(selectedBrand));

      if (selectedPrice) {
        url += "&price=".concat(selectedPrice);
      }

      window.location.href = url;
    });
  });
}