document.addEventListener('DOMContentLoaded', () => {
  const lsKey = 'gamePairsInfo';
  const mainContainer = document.getElementsByClassName('main__container')[0];
  const mainTitle = document.getElementsByClassName('main__menu-title')[0];
  const gameForm = document.getElementsByClassName('form')[0];
  const cardsInRowQtyInput = document.getElementsByClassName('form__item-input')[0];
  const cardsInRowQtyText = document.getElementById('input-qty-text');
  const timerOnInput = document.getElementsByClassName('form__item-timeron-input')[0];
  const startGameButton = document.getElementById('start-game-btn');
  const gameWrapper = document.getElementsByClassName('game__wrapper')[0];
  const gameCardsWrapper = document.getElementsByClassName('game__cards-wrapper')[0];
  const gameTimerWrapper = document.getElementsByClassName('game__info-timer-wrapper')[0];
  const timerContainer = document.getElementsByClassName('game__info-timer')[0];
  const pauseGameButton = document.getElementsByClassName('game__info-wrapper')[0].children[1];
  const finishGameButton = document.getElementsByClassName('game__info-btn-finish')[0];
  const gameFinishStatusText = document.getElementsByClassName('game__repeat-status-text')[0];
  const repeatGameWrapper = document.getElementsByClassName('game__repeat-wrapper')[0];
  const yesRepeatGameButton = document.getElementsByClassName('game__repeat-btn-wrapper')[0].children[0];
  const noRepeatGameButton = document.getElementsByClassName('game__repeat-btn-wrapper')[0].children[1];
  const resumeGameWrapper = document.getElementsByClassName('game__resume-wrapper')[0];
  const yesResumeGameButton = document.getElementsByClassName('game__resume-btn-wrapper')[0].children[0];
  let lsGamePairsInfoObj = {};
  let randomCardsArray = [];
  let cardsInfo = [];
  let openedCardsArr = [];
  let showCards = true;
  let gameOnPause = false;
  let inactivatedCardsPairsQty = 0;
  let cardsIndexCounter = 0;
  let timerId = null;
  let timerValue = 0;

  if (localStorage.getItem(lsKey) &&
    Object.keys(JSON.parse(localStorage.getItem(lsKey))).length > 0 &&
    Object.keys(JSON.parse(localStorage.getItem(lsKey))).includes('cardsInfo') &&
    JSON.parse(localStorage.getItem(lsKey)).gameOn) {
    lsGamePairsInfoObj = JSON.parse(localStorage.getItem(lsKey));

    let counter = 0;
    lsGamePairsInfoObj.cardsInfo.forEach(el => {
      if (el.cardClasses.toString().split(' ').includes('game__card-opened-done')) {
        counter += 1;
      }
    });
    inactivatedCardsPairsQty += parseInt(counter / 2);
    if (lsGamePairsInfoObj.timerValue) {
      timerValue = lsGamePairsInfoObj.timerValue;
    } else {
      timerValue = chooseTimerValue(lsGamePairsInfoObj.qtyRows);
    }
    lsGamePairsInfoObj.timerValue = timerValue;
    showCards = lsGamePairsInfoObj.showCards;
    gameOnPause = lsGamePairsInfoObj.gameOnPause;

    if (gameOnPause) {
      pauseGame();
    }

    startGame();
  }

  // Main events
  cardsInRowQtyInput.addEventListener('input', getCardsInRowQtyInputValue);
  gameForm.addEventListener('submit', event => {
    event.preventDefault();
  });
  gameForm.addEventListener('submit', () => {
    startGame();
  });
  pauseGameButton.addEventListener('click', pauseGame);
  finishGameButton.addEventListener('click', finishGameDuringGame);

  // Events for internal buttons
  yesRepeatGameButton.addEventListener('click', () => {
    repeatGameWrapper.classList.remove('flex');
    repeatGameWrapper.classList.add('hidden');

    lsGamePairsInfoObj.gameOn = true;
    randomCardsArray = randomizeCards(createRandomArray(lsGamePairsInfoObj.qtyRows));
    lsGamePairsInfoObj.randomCardsArray = randomCardsArray;
    lsGamePairsInfoObj.cardsInfo.forEach((el, i) => {
      let cardIdIndex = el.cardId.toString().split('-')[0];
      let newCardIdImg = randomCardsArray[i];
      let newCardClasses = el.cardClasses.toString().split(' ');

      newCardClasses.length = 2;

      el.cardId = `${cardIdIndex}-${newCardIdImg}`;
      el.cardClasses = newCardClasses.join(' ');
    });

    if (lsGamePairsInfoObj.qtyRows != 2) {
      showCards = true;
    } else {
      showCards = false;
    }

    lsGamePairsInfoObj.showCards = showCards;
    lsGamePairsInfoObj.timerValue = 0;

    localStorage.setItem(lsKey, JSON.stringify(lsGamePairsInfoObj));

    location.reload();
  });

  noRepeatGameButton.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
  });
  yesResumeGameButton.addEventListener('click', () => {
    resumeGameWrapper.classList.remove('flex');
    resumeGameWrapper.classList.add('hidden');

    clearInterval(timerId);

    timerId = setInterval(timerIteration, 1000);
  });


  // Functions
  function startGame() {
    if (Object.keys(lsGamePairsInfoObj).length == 0 ||
      !Object.keys(JSON.parse(localStorage.getItem(lsKey))).includes('cardsInfo')) {
      lsGamePairsInfoObj.qtyRows = getCardsInRowQtyInputValue();
      lsGamePairsInfoObj.timerOn = timerOnInput.checked;
      lsGamePairsInfoObj.gameOn = true;
      lsGamePairsInfoObj.cardsInfo = cardsInfo;
      randomCardsArray = randomizeCards(createRandomArray(lsGamePairsInfoObj.qtyRows));
      lsGamePairsInfoObj.randomCardsArray = randomCardsArray;
      lsGamePairsInfoObj.timerId = timerId;
      timerValue = chooseTimerValue(lsGamePairsInfoObj.qtyRows);
      lsGamePairsInfoObj.timerValue = timerValue;

      if (lsGamePairsInfoObj.qtyRows != 2) {
        showCards = true;
      } else {
        showCards = false;
      }

      lsGamePairsInfoObj.showCards = showCards;
      lsGamePairsInfoObj.gameOnPause = gameOnPause;
    }

    hideMainMenu();
    showGame();

    localStorage.setItem(lsKey, JSON.stringify(lsGamePairsInfoObj));
  }

  function checkCardsInRowQtyInputValue(value) {
    if (!isNaN(value) &&
      value % 2 == 0 &&
      value >= 2 &&
      value <= 10) {
      return true;
    }

    return false;
  }

  function getCardsInRowQtyInputValue() {
    let cardsInRowQtyInputValue = parseInt(cardsInRowQtyInput.value);

    if (checkCardsInRowQtyInputValue(cardsInRowQtyInputValue)) {
      cardsInRowQtyText.textContent = cardsInRowQtyInputValue;
      startGameButton.removeAttribute('disabled');

      return cardsInRowQtyInputValue;
    } else if (cardsInRowQtyInput.value == '') {
      cardsInRowQtyInputValue = 0;
      cardsInRowQtyText.textContent = cardsInRowQtyInputValue;
      startGameButton.setAttribute('disabled', '');

      return;
    }

    cardsInRowQtyInputValue = 4;
    cardsInRowQtyText.textContent = cardsInRowQtyInputValue;
    startGameButton.removeAttribute('disabled');

    return cardsInRowQtyInputValue;
  }

  function chooseTimerValue(cardsInRowQty) {
    switch (cardsInRowQty) {
      case 2:
        return timerValue = 5;
      case 4:
        return timerValue = 25;
      case 6:
        return timerValue = 50;
      case 8:
        return timerValue = 85;
      case 10:
        return timerValue = 130;
    }
  }

  function createRandomArray(cardsInRowQty) {
    const allCardsArray = [];
    let imgNumbersArrays = [];
    let cardsPairsQty = parseInt(Math.pow(cardsInRowQty, 2) / 2);

    for (let imgNumber = 1; imgNumber <= 50; imgNumber++) {
      imgNumbersArrays.push(imgNumber);
    }

    for (let i = 1; i <= cardsPairsQty; i++) {
      let randomIndexNumber = Math.round(Math.random() * (50 - i));

      allCardsArray.push(imgNumbersArrays[randomIndexNumber]);
      allCardsArray.push(imgNumbersArrays[randomIndexNumber]);

      imgNumbersArrays = imgNumbersArrays.filter((el, i) => {
        return i != randomIndexNumber;
      });
    }

    return allCardsArray;
  }

  function randomizeCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));

      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  function hideMainMenu() {
    mainTitle.classList.add('visually-hidden');
    gameForm.classList.add('hidden');
  }

  function createCard({ cardId, cardClasses }) {
    const cardLi = document.createElement('li');
    const cardBack = document.createElement('div');
    const cardFront = document.createElement('div');
    const cardImgBack = document.createElement('img');
    const cardImgFront = document.createElement('img');

    if (lsGamePairsInfoObj.cardsInfo.length != cardsIndexCounter) {
      cardsInfo.push({ cardId, cardClasses });
    }

    cardClasses.toString().split(' ').forEach(el => {
      cardLi.classList.add(el);
    });
    cardLi.dataset.cardId = cardId;
    cardBack.classList.add('game__card-back');
    cardFront.classList.add('game__card-front');
    cardImgBack.setAttribute('src', './img/main/card-back.jpeg');
    cardImgBack.setAttribute('alt', 'Back of the card');
    cardImgFront.setAttribute('src', `./img/main/card-front-${cardId.toString().split('-')[1]}.png`);
    cardImgFront.setAttribute('alt', 'Front of the card');

    if (cardClasses.toString().split(' ').includes('game__card-opened')) {
      openedCardsArr.push(cardLi);
    }

    if (!cardLi.classList.contains('game__card-opened-done')) {
      cardLi.addEventListener('click', () => {
        cardLi.classList.toggle('game__card-opened');

        if (cardLi.classList.contains('game__card-opened') &&
          !openedCardsArr.includes(cardLi)) {
          openedCardsArr.push(cardLi);
        }

        closeCards();
        inactivateSameCards();

        lsGamePairsInfoObj.gameOn = checkGameIsOn();

        repeatOrStopGame();

        lsGamePairsInfoObj.cardsInfo.forEach(el => {
          if (cardLi.dataset.cardId == el.cardId) {
            el.cardClasses = cardLi.getAttribute('class');
          }
        });

        localStorage.setItem(lsKey, JSON.stringify(lsGamePairsInfoObj));
      });
    }

    cardLi.append(cardBack);
    cardBack.append(cardImgBack);
    cardLi.append(cardFront);
    cardFront.append(cardImgFront);

    lsGamePairsInfoObj.gameOn = checkGameIsOn();

    repeatOrStopGame();

    lsGamePairsInfoObj.cardsInfo.forEach(el => {
      if (cardLi.dataset.cardId == el.cardId) {
        el.cardClasses = cardLi.getAttribute('class');
      }
    });

    localStorage.setItem(lsKey, JSON.stringify(lsGamePairsInfoObj));

    return cardLi;
  }

  function showGame() {
    let cardsInRowQty = lsGamePairsInfoObj.qtyRows;
    let randomCardsArrayCopy = [];

    lsGamePairsInfoObj.randomCardsArray.forEach(el => {
      randomCardsArrayCopy.push(el);
    });

    mainContainer.classList.add('game');
    gameWrapper.classList.remove('hidden');
    gameWrapper.classList.add('flex');

    timerContainer.textContent = timerValue;

    if (timerValue <= 10 &&
      timerValue >= 0) {
      timerContainer.classList.add('game__info-timer-less');
    }

    if (lsGamePairsInfoObj.timerOn) {
      gameTimerWrapper.classList.remove('hidden');
      gameTimerWrapper.classList.add('flex');
      pauseGameButton.classList.remove('hidden');

      clearInterval(timerId);

      if (showCards) {
        setTimeout(() => {
          timerId = setInterval(timerIteration, 1000);
        }, 3000);
      } else {
        timerId = setInterval(timerIteration, 1000);
      }
    }

    for (let row = 0; row < cardsInRowQty; row++) {
      const rowUl = document.createElement('ul');

      rowUl.classList.add('game__cards', 'list-reset', 'flex');
      gameCardsWrapper.append(rowUl);

      for (let column = 0; column < cardsInRowQty; column++) {
        let cardId = `${++cardsIndexCounter}-${randomCardsArrayCopy.shift()}`;
        let cardClasses;

        if (lsGamePairsInfoObj.cardsInfo.length == lsGamePairsInfoObj.randomCardsArray.length) {
          lsGamePairsInfoObj.cardsInfo.forEach(el => {
            if (el.cardId == cardId) {
              cardClasses = el.cardClasses;
            }
          });
        } else {
          cardClasses = `game__card game__card-${cardsInRowQty}`;
        }

        rowUl.append(createCard({ cardId: cardId, cardClasses: cardClasses }));
      }
    }

    if (showCards) {
      let cardsArray = document.querySelectorAll('li.game__card')

      cardsArray.forEach(el => {
        el.classList.add('game__card-opened');
      });

      setTimeout(() => {
        cardsArray.forEach(el => {
          el.classList.remove('game__card-opened');
        });
      }, 2000);

      showCards = false;

      lsGamePairsInfoObj.showCards = showCards;
      localStorage.setItem(lsKey, JSON.stringify(lsGamePairsInfoObj));
    }

  }

  function closeCards() {
    if (openedCardsArr.length != 0) {
      openedCardsArr = openedCardsArr.filter(el => {
        return el.classList.contains('game__card-opened');
      });
    }

    if (openedCardsArr.length > 2 &&
      openedCardsArr[0].dataset.cardId.toString().split('-')[1] != openedCardsArr[1].dataset.cardId.toString().split('-')[1]) {
      openedCardsArr[0].classList.remove('game__card-opened');
      openedCardsArr[1].classList.remove('game__card-opened');

      lsGamePairsInfoObj.cardsInfo.forEach(el => {
        if (el.cardId == openedCardsArr[0].dataset.cardId) {
          el.cardClasses = openedCardsArr[0].getAttribute('class');
        } else if (el.cardId == openedCardsArr[1].dataset.cardId) {
          el.cardClasses = openedCardsArr[1].getAttribute('class');
        }
      });

      openedCardsArr.shift();
      openedCardsArr.shift();
    }
  }

  function inactivateSameCards() {
    if (openedCardsArr.length == 2 &&
      openedCardsArr[0].dataset.cardId.toString().split('-')[1] == openedCardsArr[1].dataset.cardId.toString().split('-')[1]) {
      openedCardsArr[0].classList.add('game__card-opened-done');
      openedCardsArr[0].classList.remove('game__card-opened');
      openedCardsArr[0].parentNode.replaceChild(openedCardsArr[0].cloneNode(true), openedCardsArr[0]);

      openedCardsArr[1].classList.add('game__card-opened-done');
      openedCardsArr[1].classList.remove('game__card-opened');
      openedCardsArr[1].parentNode.replaceChild(openedCardsArr[1].cloneNode(true), openedCardsArr[1]);
      inactivatedCardsPairsQty += 1;

      lsGamePairsInfoObj.cardsInfo.forEach(el => {
        if (el.cardId == openedCardsArr[0].dataset.cardId) {
          el.cardClasses = openedCardsArr[0].getAttribute('class');
        } else if (el.cardId == openedCardsArr[1].dataset.cardId) {
          el.cardClasses = openedCardsArr[1].getAttribute('class');
        }
      });

      openedCardsArr.length = 0;
    }
  }

  function checkGameIsOn() {
    let cardsPairsQty = parseInt(Math.pow(lsGamePairsInfoObj.qtyRows, 2) / 2);

    if (cardsPairsQty == inactivatedCardsPairsQty) {
      return false;
    }

    return true;
  }

  function pauseGame() {
    if (lsGamePairsInfoObj.gameOn) {
      clearInterval(timerId);

      resumeGameWrapper.classList.remove('hidden');
      resumeGameWrapper.classList.add('flex');

      gameOnPause = true;

      lsGamePairsInfoObj.gameOnPause = gameOnPause;
      localStorage.setItem(lsKey, JSON.stringify(lsGamePairsInfoObj));
    }
  }

  function timerIteration() {
    timerValue--;

    if (timerValue <= 0 ||
      !lsGamePairsInfoObj.gameOn) {
      clearInterval(timerId);
      lsGamePairsInfoObj.gameOn = false;

      repeatOrStopGame();
    } else if (timerValue <= 10 &&
      timerValue >= 0 &&
      lsGamePairsInfoObj.gameOn) {
      timerContainer.classList.add('game__info-timer-less');
    }

    timerContainer.textContent = timerValue;

    lsGamePairsInfoObj.timerId = timerId;
    lsGamePairsInfoObj.timerValue = timerValue;

    localStorage.setItem(lsKey, JSON.stringify(lsGamePairsInfoObj));
  }

  function finishGameDuringGame() {
    if (lsGamePairsInfoObj.gameOn &&
      confirm('Are you sure?')) {
      clearInterval(timerId);
      localStorage.clear();
      location.reload();
    }
  }

  function repeatOrStopGame() {
    if (!lsGamePairsInfoObj.gameOn) {
      repeatGameWrapper.classList.remove('hidden');
      repeatGameWrapper.classList.add('flex');

      if (lsGamePairsInfoObj.timerOn &&
        lsGamePairsInfoObj.timerValue == 1) {
        gameFinishStatusText.classList.remove('hidden');
        gameFinishStatusText.textContent = 'You failed';
        gameFinishStatusText.classList.add('game__repeat-status-text-lose');
      } else if (lsGamePairsInfoObj.timerOn &&
        lsGamePairsInfoObj.timerValue > 0) {
        gameFinishStatusText.classList.remove('hidden');
        gameFinishStatusText.textContent = 'You won';
        gameFinishStatusText.classList.add('game__repeat-status-text-win');
      }
    }
  }
});