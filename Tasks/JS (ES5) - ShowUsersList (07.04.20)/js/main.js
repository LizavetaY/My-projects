// Elements from HTML
var button = document.getElementsByClassName('button')[0];
var buttonClose = document.getElementsByClassName('buttonClose')[0];
var userBlock = document.getElementsByClassName('userBlock')[0];
var userTab = document.getElementsByClassName('userTab')[0];
var userInfo = document.getElementsByClassName('userInfo')[0];


// Add Users info
button.addEventListener('click', addUsers);

// Close Users info
buttonClose.addEventListener('click', function () {
    userBlock.classList.add('userBlockHide');
});


// FUNCTIONS
function addUsers() {
    userBlock.classList.remove('userBlockHide');

    if (localStorage.length) {
        var usersArr = [];

        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);

            usersArr[i] = JSON.parse(localStorage[key]);
        }

        createUserList(usersArr);
        return;
    }

    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'https://reqres.in/api/users?page=2');
    xhr.send();

    xhr.onload = function () {
        var statusNum = +String(this.status)[0];

        if (statusNum === 2 || statusNum === 3) {
            var usersData = JSON.parse(this.response).data;

            createUserList(usersData);
        } else if (statusNum === 4) {
            window.location.pathname = "/page404.html";
        }
    };

    xhr.onerror = function () {
        console.error(this.status);
    };

    xhr.onloadend = function () {
        console.log('Request is finished');
    };
}

function createUserList(arr) {
    var usersCounter = 0;

    var tagsAll = document.querySelectorAll('div.userTabEl');
    var isTagCounter = 0;

    tagsAll.forEach(function (el) {
        var elId = el.getAttribute('id');

        for (var i = 0; i < localStorage.length; i++) {
            if (elId === localStorage.key(i)) isTagCounter++;
        }
    });

    if (isTagCounter !== 0 && isTagCounter === localStorage.length) return;

    for (var i = 0; i < arr.length; i++) {
        usersCounter++;

        var userId = arr[i].id;

        localStorage['user' + userId] = JSON.stringify(arr[i]);

        var userFirstName = arr[i]['first_name'];
        var userLastName = arr[i]['last_name'];
        var userPhoto = arr[i].avatar;

        // Create User Card Tab
        var userTabEl = document.createElement('div');

        userTabEl.setAttribute('id', 'user' + userId);
        userTabEl.classList.add('userTabEl');
        userTabEl.innerText = 'User ' + usersCounter;
        userTab.appendChild(userTabEl);

        // Create User Card Info
        var userInfoEl = document.createElement('div');

        userInfoEl.classList.add('user' + userId);
        userInfoEl.classList.add('userInfoEl');
        userInfoEl.classList.add('userInfoElUnactive');
        userInfo.appendChild(userInfoEl);

        // Create User Card Info - Photo
        var userInfoPhoto = document.createElement('img');

        userInfoPhoto.setAttribute('src', userPhoto);
        userInfoEl.appendChild(userInfoPhoto);

        // Create User Card Info - Name
        var userInfoName = document.createElement('span');

        userInfoName.innerHTML = 'User First Name: ' + userFirstName + '<br>User Last Name: ' + userLastName;
        userInfoEl.appendChild(userInfoName);
    }

    var userTagsAll = document.querySelectorAll('div.userTabEl');
    var userCardsAll = document.querySelectorAll('div.userInfoEl');

    userTagsAll[0].classList.add('userTabElActive');
    userCardsAll[0].classList.remove('userInfoElUnactive');

    userTab.onclick = function (event) {
        var target = event.target;

        if (target.tagName !== 'DIV') return;

        for (var i = 0; i < userTagsAll.length; i++) {
            userTagsAll[i].classList.remove('userTabElActive');
            userCardsAll[i].classList.add('userInfoElUnactive');

            if (userCardsAll[i].classList.contains(target.getAttribute('id'))) userCardsAll[i].classList.remove('userInfoElUnactive');
        }

        target.classList.add('userTabElActive');
    }
}