// Elements from HTML
var button = document.getElementsByTagName('button')[0];
var conteiner = document.getElementById('conteinerJS');


// Elements are created
var paragraphNew1 = document.createElement('p');
var paragraphNew2 = document.createElement('p');

paragraphNew1.innerHTML = 'You can visit the <a href="https://www.google.com">Link1</a> or <a href="https://www.google.com">Link2</a>';
paragraphNew2.innerHTML = 'You can visit the <a href="https://www.google.com">Link3</a> or <a href="https://www.google.com">Link4</a>';

conteiner.appendChild(paragraphNew1);
conteiner.appendChild(paragraphNew2);


// Change Links color and weigth
button.addEventListener('click', changeLinks);


// FUNCTIONS
function changeLinks() {
    var childsLinks1 = conteiner.firstElementChild;

    childsLinks1.classList.toggle('linksEdit');
}


// TASK 14 + 15
// Change Links behaviour
var childsLinks2 = conteiner.lastElementChild;

localStorage.clear();

childsLinks2.onclick = function (event) {
    var target = event.target;
    var obj = {};

    if (target.tagName != 'A') return;

    event.preventDefault();

    obj.path = target.getAttribute('href');

    if (localStorage[target.innerText]) {
        alert('The address is: ' + JSON.parse(localStorage[target.innerText]).path);
    } else {
        localStorage[target.innerText] = JSON.stringify(obj);
        alert('The link was saved');
    }
};