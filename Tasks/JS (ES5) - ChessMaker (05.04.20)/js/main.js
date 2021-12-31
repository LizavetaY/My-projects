// TABLE elements from HTML
var inputX = document.getElementById('xValue');
var inputY = document.getElementById('yValue');
var button = document.getElementById('button');
var table = document.getElementById('tableJS');
var val1,
    val2,
    editVal1,
    editVal2,
    resultX,
    resultY;

if (localStorage.val1) inputX.value = localStorage.val1;
if (localStorage.val2) inputY.value = localStorage.val2;


// Events for X
inputX.addEventListener('keyup', function () {
    val1 = inputX.value;
    editVal1 = val1.trim();

    localStorage.val1 = val1;

    if (!editVal1) {
        button.setAttribute('disabled', '');
        resultX = false;
        return;
    }

    resultX = true;

    if (resultX && resultY) button.removeAttribute('disabled');
    return;
})


// Events for Y
inputY.addEventListener('keyup', function () {
    val2 = inputY.value;
    editVal2 = val2.trim();

    localStorage.val2 = val2;

    if (!editVal2) {
        button.setAttribute('disabled', '');
        resultY = false;
        return;
    }

    resultY = true;

    if (resultX && resultY) button.removeAttribute('disabled');
    return;
})

button.addEventListener('click', addChess);


// FUNCTIONS
function addChess(event) {
    event.preventDefault();

    if (!parseInt(editVal1) || parseInt(editVal1) < 1 || parseInt(editVal1) > 10) {
        localStorage.val1 = '';
        alert('Enter a number for X: from 1 till 10');
    } else {
        var numberTDX = parseInt(editVal1);
    }

    if (!parseInt(editVal2) || parseInt(editVal2) < 1 || parseInt(editVal2) > 10) {
        localStorage.val2 = '';
        alert('Enter a number for Y: from 1 till 10');
    } else {
        var numberTDY = parseInt(editVal2);
    }

    if (table.children.length > 0) table.innerHTML = '';

    for (var i = 0; i < numberTDY; i++) {
        var newTRY = document.createElement('tr');

        table.appendChild(newTRY);

        for (var j = 0; j < numberTDX; j++) {
            var newTDX = document.createElement('td');

            newTRY.appendChild(newTDX);

            if ((i + j) % 2) newTDX.classList.toggle('black');
        }
    }

    var allTD = table.querySelectorAll('td');

    table.onclick = function (event) {
        var target = event.target;

        if (target.tagName != 'TD') return;

        allTD.forEach(function (el) {
            el.classList.toggle('black');
        });
    };
}