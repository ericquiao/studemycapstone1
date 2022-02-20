let corsHeader = 'https://the-ultimate-api-challenge.herokuapp.com';
let apiUrl = 'https://xkcd.com';
let apiUrlFormat = 'info.0.json';

const random_result = document.getElementById('random_result');
const number_result = document.getElementById('number_result');
const page_Num = document.getElementById('page_Num');
const display = document.getElementById('display');
const first_display = document.getElementById('first_display');
const second_display = document.getElementById('second_display');
const third_display = document.getElementById('third_display');
const fourth_display = document.getElementById('fourth_display');
const fifth_display = document.getElementById('fifth_display');

const random_btn = document.getElementById('random_btn');
const prev_btn = document.getElementById('prev_btn');
const next_btn = document.getElementById('next_btn');
const go_btn = document.getElementById('go_btn');
const go_display = document.getElementById('go_display');

random_btn.addEventListener('click', getRandomComics);
prev_btn.addEventListener('click', getPrevComics);
next_btn.addEventListener('click', getNextComics);
go_display.addEventListener('click', goDisplay);
display.addEventListener('change', changeDisplay);

function goDisplay() {
  let displayCount = Number(document.getElementById('display').value);
  let pageNum = Number(document.getElementById('page_Num').value);
  let lastDisplayPage = pageNum + (displayCount - 1) / 2;
  let firstDisplayPage = pageNum - (displayCount - 1) / 2;

  const requestUrl = `${corsHeader}/${apiUrl}/${apiUrlFormat}`;
  fetch(requestUrl)
    .then((res) => res.json())
    .then((data) => {
      let lastComic = data.num;
      pageNumCheck(
        lastComic,
        pageNum,
        displayCount,
        lastDisplayPage,
        firstDisplayPage
      );
    });
}

function pageNumCheck(
  lastComic,
  pageNum,
  displayCount,
  lastDisplayPage,
  firstDisplayPage
) {
  if (pageNum > lastComic) {
    document.getElementById('page_Num').value = lastComic;
    document.getElementById('display').value = Number(1);
    alert(`latest comics is until ${lastComic}`);
    displaySet(lastComic, 1);
  } else if (pageNum < 1) {
    document.getElementById('page_Num').value = 1;
    document.getElementById('display').value = Number(1);
    alert(`first page is comic#1`);
    displaySet(1, 1);
  } else {
    if (lastDisplayPage > lastComic) {
      setupCycle(lastDisplayPage, displayCount, lastComic);
    } else if (firstDisplayPage < 1) {
      if (displayCount == 3) {
        document.getElementById('page_Num').value = 2;
        document.getElementById('display').value = Number(3);
        alert(
          'comics with 3 display pages can only be set to minimum at comic#2'
        );
        displaySet(2, 3);
      }
      if (displayCount == 5) {
        document.getElementById('page_Num').value = 3;
        document.getElementById('display').value = Number(5);
        alert(
          'comics with 5 display pages can only be set to minimum at comic#3'
        );
        displaySet(3, 5);
      }
    } else {
      displaySet(pageNum, displayCount);
    }
  }
}

function setupCycle(lastComic, displayCount, lastPage) {
  let excess = lastComic - lastPage;
  let covered = displayCount - excess;

  let counter = 0;
  let newCycle = 0;
  let pagetoPost = lastPage - covered;

  for (let i = 0; i < displayCount; i++) {
    pagetoPost++;
    counter++;
    if (pagetoPost <= lastPage) {
      displayComics2(pagetoPost, counter);
    } else {
      newCycle++;
      displayComics2(newCycle, counter);
    }
  }
}

window.addEventListener('load', function () {
  const loader = document.querySelector('.loader');
  loader.className += ' hidden'; // class "loader hidden"
});

(function () {
  const requestUrl = `${corsHeader}/${apiUrl}/${apiUrlFormat}`;
  fetch(requestUrl)
    .then((res) => res.json())
    .then((data) => {
      first_display.innerHTML = `<img src = "${data.img}"/>`;

      document.getElementById('page_Num').value = data.num;
      document.getElementById('display').value = Number(1);

      let comicId = `?comicId=${data.num}`;
      urlUpdate(comicId);
    });
})();

function checkLastPage() {
  const requestUrl = `${corsHeader}/${apiUrl}/${apiUrlFormat}`;
  return fetch(requestUrl)
    .then((res) => res.json())
    .then((data) => {
      return data.num;
    });
}

function validateCurrentCycle() {
  checkLastPage().then((result) => {
    let lastPage = result;
    let displayCount = Number(document.getElementById('display').value);
    let pageNum = Number(document.getElementById('page_Num').value);

    let lastComic = pageNum + (displayCount - 1) / 2;

    if (lastComic <= lastPage) {
      displaySet(pageNum, displayCount);
    } else {
      setupCycle(lastPage, pageNum, displayCount, lastComic);
    }
  });
}

function validateNextCycle() {
  checkLastPage().then((result) => {
    let lastPage = result;
    let displayCount = Number(document.getElementById('display').value);
    let pageNum =
      Number(document.getElementById('page_Num').value) + displayCount;

    let lastComic = pageNum + (displayCount - 1) / 2;

    if (lastComic <= lastPage) {
      document.getElementById('page_Num').value = pageNum;
      displaySet(pageNum, displayCount);
    } else {
      setupNextCycle(lastPage, pageNum, displayCount, lastComic);
    }
  });
}

function setupNextCycle(lastPage, pageNum, displayCount, lastComic) {
  let updatedPageNum = pageNum - lastPage;

  document.getElementById('page_Num').value = updatedPageNum;

  displaySet(updatedPageNum, displayCount);
}

function changeDisplay() {
  goDisplay();
}

function getNextComics() {
  validateNextCycle();
}

function getPrevComics() {
  let displayCount = Number(document.getElementById('display').value);
  let pageNum = Number(document.getElementById('page_Num').value);
  let firstDisplayPage = pageNum - (displayCount - 1) / 2;

  let nextMidPage = pageNum - displayCount;


  if (nextMidPage < 1 || firstDisplayPage < 1) {
    alert(`first page is comic#1`);
    nextMidPage = 1;
    displayCount = 1;
  }
  document.getElementById('page_Num').value = nextMidPage;
  document.getElementById('display').value = displayCount;

  displaySet(nextMidPage, displayCount);
}

function getRandomComics() {
  let displayCount = Number(document.getElementById('display').value);
  let randomNum = Math.ceil(Math.random() * 2583);
  let pageNum = randomNum;

  document.getElementById('page_Num').value = pageNum;
  displaySet(pageNum, displayCount);
}

function setNumberOfDisplays() {
  let displayCount = Number(document.getElementById('display').value);
  let pageNum = Number(document.getElementById('page_Num').value);

  displaySet(pageNum, displayCount);
}

function displaySet(currentPage, displayCount) {
  let plusMinus = (displayCount - 1) / 2;
  let firstDisplay = currentPage - plusMinus;
  let lastDisplay = currentPage + plusMinus;

  let comicId = `?comicId=${currentPage}`;
  urlUpdate(comicId);
  let counter = 0;

  for (let i = firstDisplay; i <= lastDisplay; i++) {
    counter++;

    displayComics2(i, counter);
  }
}

function displayComics2(comicNum, counter) {
  displayLoading();
  let numRef = Number(counter);

  first_display.innerHTML = '';
  second_display.innerHTML = '';
  third_display.innerHTML = '';
  fourth_display.innerHTML = '';
  fifth_display.innerHTML = '';

  first_comic_num.innerHTML = '';
  second_comic_num.innerHTML = '';
  third_comic_num.innerHTML = '';
  fourth_comic_num.innerHTML = '';
  fifth_comic_num.innerHTML = '';

  const requestUrl = `${corsHeader}/${apiUrl}/${comicNum}/${apiUrlFormat}`;
  fetch(requestUrl)
    .then((res) => res.json())
    .then((data) => {
      if (numRef == 1) {
        first_display.innerHTML = `<img src = "${data.img}"/>`;
        first_comic_num.innerHTML = comicNum;
      }
      if (numRef == 2) {
        second_display.innerHTML = `<img src = "${data.img}"/>`;
        second_comic_num.innerHTML = comicNum;
      }
      if (numRef == 3) {
        third_display.innerHTML = `<img src = "${data.img}"/>`;
        third_comic_num.innerHTML = comicNum;
      }
      if (numRef == 4) {
        fourth_display.innerHTML = `<img src = "${data.img}"/>`;
        fourth_comic_num.innerHTML = comicNum;
      }
      if (numRef == 5) {
        fifth_display.innerHTML = `<img src = "${data.img}"/>`;
        fifth_comic_num.innerHTML = comicNum;
      }
      hideLoading();
    });
}

function displayConditon() {}

// selecting loading div
const loader = document.querySelector('#loading');

// showing loading
function displayLoading() {
  loader.classList.add('display');
  // to stop loading after some time
  setTimeout(() => {
    loader.classList.remove('display');
  }, 1000);
}

// hiding loading
function hideLoading() {
  loader.classList.remove('display');
}

function urlUpdate(url) {
  window.history.pushState('new', 'title', url);
}
