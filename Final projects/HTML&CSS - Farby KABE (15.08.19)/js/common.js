// POPUP - SHOW / HIDE
var popup = document.querySelector(".jsPopup");
var popupShow = document.querySelector(".jsPopupShow");
var popupClose = document.querySelectorAll(".jsPopupClose");

console.log(popupClose);

popupShow.addEventListener('click', function () {
    popup.classList.add("active");
});

popupClose.forEach(function (item) {
    item.addEventListener('click', function () {
        popup.classList.remove("active");
    });
});

// PHONE - PATTERN
$(function () {
    $("#popup-input-phone").mask("+375(99) 999-99-99");
});