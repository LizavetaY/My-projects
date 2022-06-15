document.addEventListener('DOMContentLoaded', () => {
  const lsKey = 'studentsLabData';
  const filterInputsNames = ['studentFullName', 'faculty', 'studyYearStart', 'studyYearLast'];
  const popupInputsNames = ['name', 'surname', 'middleName', 'dateOfBirth', 'studyYearStart', 'faculty'];
  const filterInputs = document.querySelectorAll('input.main__filter-item-input');
  const filterInputsInfoSpans = document.querySelectorAll('span.main__filter-item-info');
  const filterCloseButton = document.getElementsByClassName('main__filter-close-btn')[0];
  const addStudentButton = document.getElementById('add-student-button');
  const studentPopupWrapper = document.getElementsByClassName('main__popup-wrapper')[0];
  const studentPopupTitle = document.getElementsByClassName('popup__title')[0];
  const studentPopupCloseButton = document.getElementsByClassName('popup__btn-close')[0];
  const studentPopupInputs = document.querySelectorAll('input.popup__item-input');
  const studentPopupDateInput = document.querySelector('input[type="date"]');
  const studentPopupMistakesWrapper = document.getElementsByClassName('popup__mistakes-wrapper')[0];
  const studentPopupMistakeYear = document.querySelectorAll('li.popup__mistake-year')[0];
  const studentPopupMistakeInputs = document.querySelectorAll('li.popup__mistake-inputs')[0];
  const studentPopupCreateButton = document.getElementById('create-student-button');
  const studentPopupEditButton = document.getElementById('edit-student-button');
  const studentPopupDeleteButton = document.getElementById('delete-student-button');
  const studentsListTableHead = document.getElementsByClassName('main__table-head')[0];
  const studentsListTableBody = document.getElementsByClassName('main__table-body')[0];
  let lsStudentsLabData = {};
  let filtersData = {};
  let filteredStudentsData = [];
  let studentPopupData = {};
  let studentsData = [];
  let sortData = {
    'Full name': false,
    'Faculty': false,
    'Age': false,
    'Study years': false,
  };
  let dateTodayObj = new Date();
  let yearToday = dateTodayObj.getFullYear();
  let monthToday = dateTodayObj.getMonth() + 1;
  let dayToday = dateTodayObj.getDate();

  // Check LocalStorage info
  if (JSON.parse(localStorage.getItem(lsKey)) &&
    (JSON.parse(localStorage.getItem(lsKey)).studentPopupCreateIs ||
      JSON.parse(localStorage.getItem(lsKey)).studentPopupEditIs ||
      Object.keys(JSON.parse(JSON.parse(localStorage.getItem(lsKey)).filtersData)).length > 0 ||
      Object.keys(JSON.parse(JSON.parse(localStorage.getItem(lsKey)).studentPopupData)).length > 0 ||
      JSON.parse(JSON.parse(localStorage.getItem(lsKey)).studentsData).length > 0)) {
    lsStudentsLabData = JSON.parse(localStorage.getItem(lsKey));

    filtersData = JSON.parse(JSON.parse(localStorage.getItem(lsKey)).filtersData);
    sortData = JSON.parse(JSON.parse(localStorage.getItem(lsKey)).sortData);
    studentPopupData = JSON.parse(JSON.parse(localStorage.getItem(lsKey)).studentPopupData);
    studentsData = JSON.parse(JSON.parse(localStorage.getItem(lsKey)).studentsData);
    filteredStudentsData = JSON.parse(JSON.parse(localStorage.getItem(lsKey)).filteredStudentsData);
  } else {
    lsStudentsLabData.studentPopupCreateIs = false;
    lsStudentsLabData.studentPopupEditIs = false;
    lsStudentsLabData.filtersIs = false;
    lsStudentsLabData.editedStudentIndex = null;
    lsStudentsLabData.studentPopupData = JSON.stringify(studentPopupData);
    lsStudentsLabData.filtersData = JSON.stringify(filtersData);
    lsStudentsLabData.filteredStudentsData = JSON.stringify(filteredStudentsData);
    lsStudentsLabData.sortData = JSON.stringify(sortData);
    lsStudentsLabData.studentsData = JSON.stringify(studentsData);

    localStorage.setItem(lsKey, JSON.stringify(lsStudentsLabData));
  }

  startApp();

  // Events
  // for filter
  filterCloseButton.addEventListener('click', closeFilterStudentsData);

  filterInputs.forEach(el => {
    el.addEventListener('focus', () => {
      el.previousElementSibling.classList.add('main__filter-item-span-active');
    });

    el.addEventListener('blur', () => {
      if (!el.value) {
        el.previousElementSibling.classList.remove('main__filter-item-span-active');
      }
    });

    el.addEventListener('input', () => {
      filtersData[el.dataset.filterInputId] = el.value;

      lsStudentsLabData.filtersData = JSON.stringify(filtersData);

      localStorage.setItem(lsKey, JSON.stringify(lsStudentsLabData));

      if (checkFilterInputsValue(el)) {
        el.dataset.filterCheck = true;
      } else {
        el.dataset.filterCheck = false;
      }

      addOrRemoveFilterInputClasses(el);
      activateFilterCloseButton();
      filterStudentsData();

      lsStudentsLabData.filtersIs = true;

      localStorage.setItem(lsKey, JSON.stringify(lsStudentsLabData));
    });
  });

  // for 'Add a student' button
  addStudentButton.addEventListener('click', showStudentPopupCreateMode);
  addStudentButton.addEventListener('click', showStudentPopupForm);

  // for popup 'Create or Edit a student'
  studentPopupCloseButton.addEventListener('click', closeStudentPopupForm);

  studentPopupCreateButton.addEventListener('click', addStudentInPopup);
  studentPopupCreateButton.addEventListener('click', closeStudentPopupForm);

  studentPopupEditButton.addEventListener('click', editStudentInPopup);
  studentPopupEditButton.addEventListener('click', closeStudentPopupForm);

  studentPopupDeleteButton.addEventListener('click', deleteStudentInPopup);

  studentPopupInputs.forEach(el => {
    el.addEventListener('input', () => {

      if (el.dataset.inputId === 'studyYearStart') {
        studentPopupData[el.dataset.inputId] = parseInt(el.value.trim());
      } else if (el.dataset.inputId === 'dateOfBirth') {
        studentPopupData[el.dataset.inputId] = JSON.stringify(el.valueAsDate);
      } else {
        studentPopupData[el.dataset.inputId] = el.value.trim();
      }

      if (checkStudentPopupInputsValue(el)) {
        el.classList.remove('popup__item-input-wrong');
        el.classList.add('popup__item-input-correct');
      } else {
        el.classList.remove('popup__item-input-correct');
        el.classList.add('popup__item-input-wrong');
      }

      showStudentPopupMistakes();
      activateStudentPopupCreateOrEditButton();

      lsStudentsLabData.studentPopupData = JSON.stringify(studentPopupData);

      localStorage.setItem(lsKey, JSON.stringify(lsStudentsLabData));
    });
  });

  // for table head (sort)
  studentsListTableHead.addEventListener('click', () => {
    if (event.target.nodeName == 'TD' &&
      event.target.textContent != 'Edit') {
      sortStudentsData(event.target);
    }
  });

  // Functions
  function startApp() {
    studentPopupInputs.forEach((el, i) => {
      el.dataset.inputId = popupInputsNames[i];
    });

    setFilterInputsDataset();
    setFilterInputsInfoSpans();

    setStudentPopupDateInput();
    setStudentsDataSortClasses();

    showStudentsData();

    if (lsStudentsLabData.studentPopupCreateIs ||
      lsStudentsLabData.studentPopupEditIs) {
      showStudentPopupForm();
    }

    if (lsStudentsLabData.filtersIs) {
      showFilterInputsData();
      filterStudentsData();
    }
  }

  // for filters
  function setFilterInputsDataset() {
    filterInputs.forEach((el, i) => {
      el.dataset.filterInputId = [filterInputsNames[i]];
    });
  }

  function setFilterInputsInfoSpans() {
    let startYear = 2000;

    filterInputsInfoSpans[0].textContent = `* From ${startYear} till ${yearToday}`;
    filterInputsInfoSpans[1].textContent = `* From ${startYear + 4} till ${yearToday + 4}`;
  }

  function showFilterInputsData() {
    if (lsStudentsLabData.filtersIs) {
      filterInputs.forEach(el => {
        if (filtersData[el.dataset.filterInputId]) {
          el.value = filtersData[el.dataset.filterInputId];
        }

        if (el.value) {
          el.previousElementSibling.classList.add('main__filter-item-span-active');
        }

        if (checkFilterInputsValue(el)) {
          el.dataset.filterCheck = true;
        } else {
          el.dataset.filterCheck = false;
        }
      });
    }

    activateFilterCloseButton();
  }

  function checkFilterInputsValue(input) {
    let inputValue = input.value.trim();

    if (input.dataset.filterInputId == 'studyYearStart' &&
      /\d\d\d\d/.test(inputValue) &&
      inputValue >= 2000 &&
      inputValue <= yearToday) {
      return true;
    } else if (input.dataset.filterInputId == 'studyYearLast' &&
      /\d\d\d\d/.test(inputValue) &&
      inputValue >= 2004 &&
      inputValue <= (yearToday + 4)) {
      return true;
    } else if ((input.dataset.filterInputId == 'studentFullName' ||
      input.dataset.filterInputId == 'faculty') &&
      inputValue) {
      return true;
    } else {
      return false;
    }
  }

  function addOrRemoveFilterInputClasses(el) {
    if (el.value &&
      (el.dataset.filterInputId == 'studyYearStart' ||
        el.dataset.filterInputId == 'studyYearLast') &&
      el.dataset.filterCheck == 'false') {
      el.classList.add('main__filter-item-input-wrong');
    } else if (!el.value ||
      (el.value &&
        (el.dataset.filterInputId == 'studyYearStart' ||
          el.dataset.filterInputId == 'studyYearLast') &&
        el.dataset.filterCheck == 'true')) {
      el.classList.remove('main__filter-item-input-wrong');
    }
  }

  function filterStudentsData() {
    event.preventDefault();

    filteredStudentsData = JSON.parse(lsStudentsLabData.studentsData).slice();

    for (let key of filterInputsNames) {
      if (filtersData[key]) {
        filteredStudentsData = filteredStudentsData.filter(el => {
          if (key == 'studentFullName') {
            if (`${el.surname} ${el.name} ${el.middleName}`.toLowerCase().includes(filtersData[key].toLowerCase())) {
              return el;
            }
          } else if (key == 'faculty') {
            if (el.faculty.toLowerCase().includes(filtersData[key].toLowerCase())) {
              return el;
            }
          } else if (key == 'studyYearStart') {
            if (el.studyYearStart == filtersData[key]) {
              return el;
            }
          } else if (key == 'studyYearLast') {
            if ((el.studyYearStart + 4) == filtersData[key]) {
              return el;
            }
          } else {
            return;
          }
        });
      }
    }

    lsStudentsLabData.filteredStudentsData = JSON.stringify(filteredStudentsData);

    localStorage.setItem(lsKey, JSON.stringify(lsStudentsLabData));

    studentsData = filteredStudentsData;
    showStudentsData();
  }

  function activateFilterCloseButton() {
    let filterCorrectCounter = 0;

    for (let el of filterInputs) {
      if (el.value) {
        filterCorrectCounter++;
      }
    }

    if (filterCorrectCounter > 0) {
      filterCloseButton.removeAttribute('disabled');
    } else {
      filterCloseButton.setAttribute('disabled', '');
    }
  }

  function closeFilterStudentsData() {
    event.preventDefault();

    filterInputs.forEach(el => {
      el.value = null;
      el.previousElementSibling.classList.remove('main__filter-item-span-active');
      el.dataset.filterCheck = false;
      addOrRemoveFilterInputClasses(el);
    });

    activateFilterCloseButton();

    studentsData = JSON.parse(lsStudentsLabData.studentsData);

    lsStudentsLabData.filtersIs = false;

    filtersData = {};
    lsStudentsLabData.filtersData = JSON.stringify(filtersData);

    filteredStudentsData = [];
    lsStudentsLabData.filteredStudentsData = JSON.stringify(filteredStudentsData);

    localStorage.setItem(lsKey, JSON.stringify(lsStudentsLabData));

    showStudentsData();
  }

  // for popup 'Add or Edit a student'
  function setStudentPopupDateInput() {
    if (monthToday < 10) {
      monthToday = `0${monthToday}`;
    }

    if (dayToday < 10) {
      dayToday = `0${dayToday}`;
    }

    studentPopupDateInput.min = '1900-01-01';
    studentPopupDateInput.max = `${yearToday}-${monthToday}-${dayToday}`;
  }

  function showStudentPopupCreateMode() {
    studentPopupTitle.textContent = 'Add a new student:';
    studentPopupCreateButton.classList.remove('hidden');

    lsStudentsLabData.studentPopupCreateIs = true;

    localStorage.setItem(lsKey, JSON.stringify(lsStudentsLabData));
  }

  function showStudentPopupEditMode() {
    studentPopupTitle.textContent = 'Edit a student:';
    studentPopupEditButton.classList.remove('hidden');
    studentPopupDeleteButton.classList.remove('hidden');

    lsStudentsLabData.studentPopupEditIs = true;

    localStorage.setItem(lsKey, JSON.stringify(lsStudentsLabData));
  }

  function showStudentPopupMistakes() {
    let wrongInputsCounter = 0;
    let correctInputsCounter = 0;

    studentPopupInputs.forEach(el => {
      if (!el.classList.contains('popup__item-input-correct')) {
        wrongInputsCounter++;
      }

      if (el.classList.contains('popup__item-input-wrong') &&
        el.dataset.inputId === 'studyYearStart') {
        studentPopupMistakesWrapper.classList.remove('hidden');
        studentPopupMistakeYear.classList.remove('hidden');
      } else if (el.classList.contains('popup__item-input-correct') &&
        el.dataset.inputId === 'studyYearStart') {
        studentPopupMistakeYear.classList.add('hidden');
      }

      if (el.classList.contains('popup__item-input-correct')) {
        correctInputsCounter++;
      }
    });

    if (wrongInputsCounter > 0) {
      studentPopupMistakesWrapper.classList.remove('hidden');
      studentPopupMistakesWrapper.classList.add('flex');
      studentPopupMistakeInputs.classList.remove('hidden');
    }

    if (correctInputsCounter == popupInputsNames.length) {
      studentPopupMistakeInputs.classList.add('hidden');
      studentPopupMistakesWrapper.classList.remove('flex');
      studentPopupMistakesWrapper.classList.add('hidden');
    }
  }

  function showStudentPopupForm() {
    studentPopupWrapper.classList.remove('hidden');
    studentPopupWrapper.classList.add('flex');

    if (lsStudentsLabData.studentPopupCreateIs) {
      showStudentPopupCreateMode();
    } else if (lsStudentsLabData.studentPopupEditIs) {
      showStudentPopupEditMode();
    }

    if (Object.keys(studentPopupData).length > 0) {
      for (let key in studentPopupData) {
        let inputIndex = popupInputsNames.indexOf(key);

        if (studentPopupInputs[inputIndex].dataset.inputId == 'dateOfBirth') {
          let dateOfBirth = new Date(JSON.parse(studentPopupData[key]));
          let dateOfBirthYear = dateOfBirth.getFullYear();
          let dateOfBirthMonth = dateOfBirth.getMonth() + 1;
          let dateOfBirthDay = dateOfBirth.getDate();

          dateOfBirthMonth = dateOfBirthMonth < 10 ? `0${dateOfBirthMonth}` : dateOfBirthMonth;
          dateOfBirthDay = dateOfBirthDay < 10 ? `0${dateOfBirthDay}` : dateOfBirthDay;

          studentPopupInputs[inputIndex].value = `${dateOfBirthYear}-${dateOfBirthMonth}-${dateOfBirthDay}`;
        } else {
          studentPopupInputs[inputIndex].value = studentPopupData[key];
        }


        if (checkStudentPopupInputsValue(studentPopupInputs[inputIndex])) {
          studentPopupInputs[inputIndex].classList.remove('popup__item-input-wrong');
          studentPopupInputs[inputIndex].classList.add('popup__item-input-correct');
        } else {
          studentPopupInputs[inputIndex].classList.remove('popup__item-input-correct');
          studentPopupInputs[inputIndex].classList.add('popup__item-input-wrong');
        }
      }
    }

    activateStudentPopupCreateOrEditButton();
    showStudentPopupMistakes();
  }

  function checkStudentPopupInputsValue(input) {
    let inputValue = input.value.trim();

    if ((input.dataset.inputId === 'name' ||
      input.dataset.inputId === 'surname' ||
      input.dataset.inputId === 'middleName' ||
      input.dataset.inputId === 'faculty') &&
      inputValue.length > 0) {
      return true;
    } else if (input.dataset.inputId === 'studyYearStart' &&
      parseInt(inputValue) >= 2000 &&
      parseInt(inputValue) <= yearToday) {
      return true;
    } else if (input.dataset.inputId === 'dateOfBirth' &&
      inputValue) {
      return true;
    } else {
      return false;
    }
  }

  function activateStudentPopupCreateOrEditButton() {
    let correctInputsCounter = 0;

    studentPopupInputs.forEach(el => {
      if (el.classList.contains('popup__item-input-correct')) {
        correctInputsCounter++;
      }
    });

    if (correctInputsCounter === popupInputsNames.length) {
      studentPopupCreateButton.removeAttribute('disabled');
      studentPopupEditButton.removeAttribute('disabled');
    } else {
      studentPopupCreateButton.setAttribute('disabled', '');
      studentPopupEditButton.setAttribute('disabled', '');
    }
  }

  function createStudentObj({ name, surname, middleName, dateOfBirth, studyYearStart, faculty }) {
    const studentDataObj = {
      name,
      surname,
      middleName,
      dateOfBirth,
      studyYearStart,
      faculty
    };

    studentsData.push(studentDataObj);

    lsStudentsLabData.studentsData = JSON.stringify(studentsData);

    localStorage.setItem(lsKey, JSON.stringify(lsStudentsLabData));

    return studentDataObj;
  }

  function addStudentInPopup() {
    let correctInputsCounter = 0;

    studentPopupInputs.forEach(el => {
      if (el.classList.contains('popup__item-input-correct')) {
        correctInputsCounter++;
      }
    });

    if (correctInputsCounter === popupInputsNames.length) {
      studentsData.push(createStudentObj(JSON.parse(lsStudentsLabData.studentPopupData)));
    }

    location.reload();
  }

  function editStudentInPopup() {
    let correctInputsCounter = 0;

    studentPopupInputs.forEach(el => {
      if (el.classList.contains('popup__item-input-correct')) {
        correctInputsCounter++;
      }
    });

    if (correctInputsCounter === popupInputsNames.length) {
      studentsData[lsStudentsLabData.editedStudentIndex] = studentPopupData;

      lsStudentsLabData.studentsData = JSON.stringify(studentsData);
      lsStudentsLabData.editedStudentIndex = null;

      localStorage.setItem(lsKey, JSON.stringify(lsStudentsLabData));
    }

    location.reload();
  }

  function deleteStudentInPopup() {
    if (confirm('Are you sure?')) {
      studentsData = studentsData.filter((el, i) => {
        return i != lsStudentsLabData.editedStudentIndex;
      });

      lsStudentsLabData.studentsData = JSON.stringify(studentsData);
      lsStudentsLabData.editedStudentIndex = null;

      localStorage.setItem(lsKey, JSON.stringify(lsStudentsLabData));

      closeStudentPopupForm();

      location.reload();
    }
  }

  function closeStudentPopupForm() {
    studentPopupWrapper.classList.remove('flex');
    studentPopupWrapper.classList.add('hidden');

    studentPopupInputs.forEach(el => {
      el.value = null;
      el.classList.remove('popup__item-input-correct');
      el.classList.remove('popup__item-input-wrong');
    });

    studentPopupCreateButton.setAttribute('disabled', '');
    studentPopupCreateButton.classList.add('hidden');
    studentPopupEditButton.classList.add('hidden');
    studentPopupDeleteButton.classList.add('hidden');

    lsStudentsLabData.studentPopupCreateIs = false;
    lsStudentsLabData.studentPopupEditIs = false;
    studentPopupData = {};
    lsStudentsLabData.studentPopupData = JSON.stringify(studentPopupData);

    localStorage.setItem(lsKey, JSON.stringify(lsStudentsLabData));

    location.reload();
  }

  // for main page table
  function showStudentsData() {
    studentsListTableBody.innerHTML = null;

    if (studentsData.length > 0) {
      studentsData.forEach(el => {
        let tr = document.createElement('tr');
        let tdName = document.createElement('td');
        let tdFaculty = document.createElement('td');
        let tdAge = document.createElement('td');
        let tdStudyYears = document.createElement('td');
        let tdEditButton = document.createElement('td');
        let dateOfBirth = new Date(JSON.parse(el.dateOfBirth));
        let dateOfBirthYear = dateOfBirth.getFullYear();
        let dateOfBirthMonth = dateOfBirth.getMonth() + 1;
        dateOfBirthMonth = dateOfBirthMonth < 10 ? `0${dateOfBirthMonth}` : dateOfBirthMonth;
        let dateOfBirthDay = dateOfBirth.getDate();
        dateOfBirthDay = dateOfBirthDay < 10 ? `0${dateOfBirthDay}` : dateOfBirthDay;
        let age = 0;
        let course = 0;
        let lsStudentsData = JSON.parse(lsStudentsLabData.studentsData);

        lsStudentsData.forEach((lsEl, lsI) => {
          if (lsEl.name == el.name &&
            lsEl.surname == el.surname &&
            lsEl.middleName == el.middleName &&
            lsEl.dateOfBirth == el.dateOfBirth &&
            lsEl.studyYearStart == el.studyYearStart &&
            lsEl.faculty == el.faculty) {
            tr.dataset.rowIndex = `${lsI}`;
          }
        });

        tdName.innerHTML = `${el.surname} ${el.name} ${el.middleName}`;
        tdFaculty.textContent = el.faculty;

        if (dateOfBirthMonth > monthToday ||
          (dateOfBirthDay > dayToday &&
            dateOfBirthMonth == monthToday)) {
          age = parseInt(yearToday - dateOfBirthYear - 1);
        } else {
          age = parseInt(yearToday - dateOfBirthYear);
        }

        dateOfBirth = `${dateOfBirthDay}.${dateOfBirthMonth}.${dateOfBirthYear} (${age} y.o.)`
        tdAge.textContent = dateOfBirth;

        if ((el.studyYearStart + 4) < yearToday) {
          course = 'finished';
        } else if ((el.studyYearStart + 4) == yearToday &&
          monthToday < 8) {
          course = `${yearToday - el.studyYearStart} course`;
        } else if ((el.studyYearStart + 4) == yearToday &&
          monthToday > 8) {
          course = 'finished';
        } else if ((el.studyYearStart + 4) > yearToday &&
          monthToday < 8) {
          course = `${yearToday - el.studyYearStart} course`;
        } else if ((el.studyYearStart + 4) > yearToday &&
          monthToday > 8) {
          course = `${yearToday - el.studyYearStart + 1} course`;
        }

        tdStudyYears.textContent = `${el.studyYearStart}-${el.studyYearStart + 4} (${course})`;

        tdEditButton.classList.add('main__table-item-edit');
        tdEditButton.classList.add('btn');

        tdEditButton.addEventListener('click', editStudentData);

        tr.append(tdName);
        tr.append(tdFaculty);
        tr.append(tdAge);
        tr.append(tdStudyYears);
        tr.append(tdEditButton);

        studentsListTableBody.append(tr);
      });
    }
  }

  function editStudentData() {
    if (event.target.nodeName == 'TD') {
      let rowIndex = event.target.parentElement.dataset.rowIndex;

      studentsData = JSON.parse(lsStudentsLabData.studentsData);

      lsStudentsLabData.studentPopupEditIs = true;
      lsStudentsLabData.editedStudentIndex = rowIndex;

      studentPopupData = studentsData.find((el, i) => i == rowIndex);
      lsStudentsLabData.studentPopupData = JSON.stringify(studentPopupData);

      localStorage.setItem(lsKey, JSON.stringify(lsStudentsLabData));
    }

    showStudentPopupForm();
  }

  // for sort
  function setStudentsDataSortClasses() {
    for (let key in sortData) {
      if (sortData[key]) {
        for (let el of studentsListTableHead.children[0].children) {
          if (el.textContent == key) {
            el.classList.add('main__table-head-sort');
            el.classList.add(`main__table-head-sort-${sortData[key]}`);
          }
        }
      }
    }
  }

  function sortStudentsData(target) {
    target.classList.add('main__table-head-sort');

    studentsData = JSON.parse(lsStudentsLabData.studentsData);

    if (!sortData[target.textContent]) {
      sortData[target.textContent] = true;
    }

    if (target.classList.contains('main__table-head-sort') &&
      sortData[target.textContent] == true) {
      sortData[target.textContent] = 'up';
    } else if (target.classList.contains('main__table-head-sort') &&
      sortData[target.textContent] == 'up') {
      sortData[target.textContent] = 'down';
    } else if (target.classList.contains('main__table-head-sort') &&
      sortData[target.textContent] == 'down') {
      sortData[target.textContent] = 'up';
    }

    Object.keys(sortData).filter(el => el != target.textContent).forEach(key => {
      sortData[key] = false;
    });

    if (sortData[target.textContent] == 'up' &&
      target.textContent == 'Full name') {
      studentsData = studentsData.sort((a, b) => {
        let fullName1 = `${a.surname} ${a.name} ${a.middleName}`;
        let fullName2 = `${b.surname} ${b.name} ${b.middleName}`;

        if (fullName1 < fullName2) {
          return -1;
        } else if (fullName1 == fullName2) {
          return 0;
        } else {
          return 1;
        }
      });
    } else if (sortData[target.textContent] == 'down' &&
      target.textContent == 'Full name') {
      studentsData = studentsData.sort((a, b) => {
        let fullName1 = `${a.surname} ${a.name} ${a.middleName}`;
        let fullName2 = `${b.surname} ${b.name} ${b.middleName}`;

        if (fullName1 < fullName2) {
          return 1;
        } else if (fullName1 == fullName2) {
          return 0;
        } else {
          return -1;
        }
      });
    } else if (sortData[target.textContent] == 'up' &&
      target.textContent == 'Faculty') {
      studentsData = studentsData.sort((a, b) => {
        if (a.faculty < b.faculty) {
          return -1;
        } else if (a.faculty == b.faculty) {
          return 0;
        } else {
          return 1;
        }
      });
    } else if (sortData[target.textContent] == 'down' &&
      target.textContent == 'Faculty') {
      studentsData = studentsData.sort((a, b) => {
        if (a.faculty < b.faculty) {
          return 1;
        } else if (a.faculty == b.faculty) {
          return 0;
        } else {
          return -1;
        }
      });
    } else if (sortData[target.textContent] == 'up' &&
      (target.textContent == 'Age')) {
      studentsData = studentsData.sort((a, b) => {
        let dateOfBirth1 = new Date(JSON.parse(a.dateOfBirth));
        let dateOfBirth1Year = dateOfBirth1.getFullYear();
        let dateOfBirth1Month = dateOfBirth1.getMonth() + 1;
        let dateOfBirth1Day = dateOfBirth1.getDay();

        let dateOfBirth2 = new Date(JSON.parse(b.dateOfBirth));
        let dateOfBirth2Year = dateOfBirth2.getFullYear();
        let dateOfBirth2Month = dateOfBirth2.getMonth() + 1;
        let dateOfBirth2Day = dateOfBirth2.getDay();

        if (dateOfBirth1Year < dateOfBirth2Year) {
          return -1;
        } else if (dateOfBirth1Year > dateOfBirth2Year) {
          return 1
        } else if (dateOfBirth1Year == dateOfBirth2Year) {
          if (dateOfBirth1Month < dateOfBirth2Month) {
            return -1;
          } else if (dateOfBirth1Month > dateOfBirth2Month) {
            return 1
          } else if (dateOfBirth1Month == dateOfBirth2Month) {
            if (dateOfBirth1Day < dateOfBirth2Day) {
              return -1;
            } else if (dateOfBirth1Day > dateOfBirth2Day) {
              return 1
            } else if (dateOfBirth1Day == dateOfBirth2Day) {
              return 0;
            }
          }
        }
      });
    } else if (sortData[target.textContent] == 'down' &&
      (target.textContent == 'Age')) {
      studentsData = studentsData.sort((a, b) => {
        let dateOfBirth1 = new Date(JSON.parse(a.dateOfBirth));
        let dateOfBirth1Year = dateOfBirth1.getFullYear();
        let dateOfBirth1Month = dateOfBirth1.getMonth() + 1;
        let dateOfBirth1Day = dateOfBirth1.getDay();

        let dateOfBirth2 = new Date(JSON.parse(b.dateOfBirth));
        let dateOfBirth2Year = dateOfBirth2.getFullYear();
        let dateOfBirth2Month = dateOfBirth2.getMonth() + 1;
        let dateOfBirth2Day = dateOfBirth2.getDay();

        if (dateOfBirth1Year < dateOfBirth2Year) {
          return 1;
        } else if (dateOfBirth1Year > dateOfBirth2Year) {
          return -1
        } else if (dateOfBirth1Year == dateOfBirth2Year) {
          if (dateOfBirth1Month < dateOfBirth2Month) {
            return 1;
          } else if (dateOfBirth1Month > dateOfBirth2Month) {
            return -1
          } else if (dateOfBirth1Month == dateOfBirth2Month) {
            if (dateOfBirth1Day < dateOfBirth2Day) {
              return 1;
            } else if (dateOfBirth1Day > dateOfBirth2Day) {
              return -1
            } else if (dateOfBirth1Day == dateOfBirth2Day) {
              return 0;
            }
          }
        }
      });
    } else if (sortData[target.textContent] == 'up' &&
      (target.textContent == 'Study years')) {
      studentsData = studentsData.sort((a, b) => {
        if (a.studyYearStart < b.studyYearStart) {
          return -1;
        } else if (a.faculty == b.faculty) {
          return 0;
        } else {
          return 1;
        }
      });
    } else if (sortData[target.textContent] == 'down' &&
      (target.textContent == 'Study years')) {
      studentsData = studentsData.sort((a, b) => {
        if (a.studyYearStart < b.studyYearStart) {
          return 1;
        } else if (a.faculty == b.faculty) {
          return 0;
        } else {
          return -1;
        }
      });
    }

    lsStudentsLabData.studentsData = JSON.stringify(studentsData);
    lsStudentsLabData.sortData = JSON.stringify(sortData);

    localStorage.setItem(lsKey, JSON.stringify(lsStudentsLabData));

    location.reload();
  }
});