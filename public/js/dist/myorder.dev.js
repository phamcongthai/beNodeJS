"use strict";

var btn = document.querySelectorAll('button[btn-order]');
var url = new URL(window.location.href); //Lọc theo trạng thái :

if (btn) {
  console.log("hehe");
  btn.forEach(function (item) {
    item.addEventListener("click", function (event) {
      var status = event.target.getAttribute("data-status");

      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams["delete"]("status");
      }

      window.location.href = url;
    });
  });
} //Tìm kiếm :


var formSearch = document.querySelector("#search-order");

if (formSearch) {
  formSearch.addEventListener('keydown', function (event) {
    if (event.key == 'Enter') {
      var keyword = formSearch.value;

      if (keyword) {
        url.searchParams.set("keywordOrder", keyword);
      } else {
        url.searchParams["delete"]("keywordOrder");
      }

      window.location.href = url;
    }
  });
}