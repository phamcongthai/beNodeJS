"use strict";

var btn = document.querySelectorAll('button[btn-order]');
var url = new URL(window.location.href);

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
}