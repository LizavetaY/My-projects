// TABLE elements from HTML
var table = document.getElementById('tableJS');
var tableBody = table.firstElementChild;
var tableRowAdd = document.getElementById('addRow');


// TABLE elements - events
tableBody.onclick = function (event) {
    var target = event.target;

    if (target.tagName != 'TD') return;

    addInput(target);
};

tableRowAdd.addEventListener('click', addRowNew);


// FUNCTIONS
function addRowNew() {
    var tableRowFirst = tableBody.firstElementChild;
    var tableRowNew = document.createElement('tr');
    var tableData1 = document.createElement('td');
    var tableData2 = document.createElement('td');
    var tableData3 = document.createElement('td');

    tableRowNew.appendChild(tableData1);
    tableRowNew.appendChild(tableData2);
    tableRowNew.appendChild(tableData3);

    tableBody.insertBefore(tableRowNew, tableRowFirst);
}

function addInput(node) {
    var inputNew = document.createElement('input');

    if (node.children.length > 0) return;
    if (node.id === 'addRow') return;

    inputNew.value = node.innerHTML;
    node.innerHTML = '';

    node.appendChild(inputNew);
    inputNew.focus();

    // Events
    inputNew.addEventListener('keypress', function (event) {
        if (event.keyCode == 0x0D) inputNew.blur();
    });

    inputNew.addEventListener('blur', function () {
        node.innerHTML = inputNew.value;
    });
}