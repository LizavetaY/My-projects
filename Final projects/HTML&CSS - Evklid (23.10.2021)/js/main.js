// HEADER - Burger
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('.burger').addEventListener('click', function () {
    document.querySelector('.burger__line').classList.toggle('burger__line-active');
    document.querySelector('.header__list').classList.toggle('burger__list');
    document.querySelectorAll('.header__item').forEach(item => item.classList.toggle('burger__item'));
    document.querySelectorAll('.header__item-link').forEach(link => link.classList.toggle('burger__item-link'));
  });
});

// HEADER - Search
document.addEventListener('DOMContentLoaded', function () {
  const buttonClose = document.querySelector('.search__btn-close');

  document.querySelector('.search__container').addEventListener('click', function (event) {
    const elementTarget = event.target;

    if (elementTarget.outerHTML != buttonClose.outerHTML) {
      document.querySelector('.search__container').classList.add('search__container-active');
      document.querySelector('.search__wrapper').classList.add('search__wrapper-active');
      document.querySelector('.search__btn').classList.add('search__btn-active');
      buttonClose.classList.add('search__btn-close-active');

      document.querySelector('.burger').classList.add('opacity-hide');
    }
  });

  buttonClose.addEventListener('click', function () {
    document.querySelector('.search__container').classList.remove('search__container-active');
    document.querySelector('.search__wrapper').classList.remove('search__wrapper-active');
    document.querySelector('.search__btn').classList.remove('search__btn-active');
    buttonClose.classList.remove('search__btn-close-active');

    document.querySelector('.burger').classList.remove('opacity-hide');
  });
});

// HERO - Swiper
const swiper = new Swiper('.swiper', {
  loop: true,

  pagination: {
    el: '.swiper-pagination',
    clickable: true
  }
});

// STAGES - Tabs
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.stages__btn').forEach(function (tab) {
    tab.addEventListener('click', function (event) {
      const path = event.currentTarget.dataset.path;

      document.querySelectorAll('.stages__btn').forEach(tab => tab.classList.remove('stages__btn-active'));
      event.target.classList.add('stages__btn-active');

      document.querySelectorAll('.stages__item').forEach(tabContent => tabContent.classList.remove('stages__item-active'));
      document.querySelector(`[data-target="${path}"]`).classList.add('stages__item-active');
    });
  });
});

// FAQ - Accordion
$(function () {
  $("#accordion").accordion({
    active: false,
    heightStyle: "content",
    collapsible: true
  });
});

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.faq__item').forEach(function (element) {
    element.addEventListener('click', function (event) {
      const question = event.currentTarget,
        questionHeader = question.children[0],
        headerTarget = questionHeader.outerHTML,
        elementTarget = event.target.outerHTML;

      if (question.classList.contains('faq__item-active') && headerTarget == elementTarget) {
        question.classList.toggle('faq__item-active');
        questionHeader.classList.toggle('faq__item-title-active');
        return;
      }

      document.querySelectorAll('.faq__item').forEach(el => el.classList.remove('faq__item-active'));
      document.querySelectorAll('.faq__item-title').forEach(el => el.classList.remove('faq__item-title-active'));
      question.classList.add('faq__item-active');
      questionHeader.classList.add('faq__item-title-active');
    })
  });
});