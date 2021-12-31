// SWIPER
var mySwiper = new Swiper('.swiper-container', {
    loop: true,
    speed: 800,
    effect: "fade",

    autoplay: {
        delay: 3000,
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
})