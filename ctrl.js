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
const set_display = document.getElementById('set_display');

random_btn.addEventListener('click', getRandomComics);
prev_btn.addEventListener('click', getPrevComics);
next_btn.addEventListener('click', getNextComics);
set_display.addEventListener('click', setNumberOfDisplays);

(function () {
  const requestUrl = `${corsHeader}/${apiUrl}/${apiUrlFormat}`;
  fetch(requestUrl)
    .then((res) => res.json())
    .then((data) => {
      first_display.innerHTML = `<img src = "${data.img}"/>`;

      document.getElementById('page_Num').value = data.num;
      document.getElementById('display').value = Number(3);
    });
})();

function checkLastPage() {
  const requestUrl = `${corsHeader}/${apiUrl}/${apiUrlFormat}`;
  return fetch(requestUrl)
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
}

function getNextComics() {
  checkLastPage().then((res) => {
    let lastPage = res.num;
    let pageNum = Number(document.getElementById('page_Num').value);
    let displayCount = Number(document.getElementById('display').value);
    let nextMidPage = pageNum + displayCount;
    let limitTest = pageNum + displayCount + (displayCount - 1) / 2;
    document.getElementById('display').value = displayCount;
    document.getElementById('page_Num').value = nextMidPage;

    if (limitTest > lastPage) {
      console.log(limitTest, lastPage);
      displayComics3(nextMidPage, displayCount, lastPage, limitTest);
    } else {
      displaySet(nextMidPage, displayCount);
    }
  });
}

function displayComics3(midPage, displayCount, lastPage, limitTest) {

  if(midPage>lastPage){
    let nextMidPage = midPage-lastPage;
    document.getElementById('page_Num').value = nextMidPage;

  }

  let afterlastPage = limitTest - lastPage;
  let beforeCycle = displayCount - afterlastPage;

  console.log(beforeCycle, afterlastPage);

  let firstPage = lastPage - (beforeCycle - 1);
  console.log(firstPage);

  let counter = 0;
  let newCycle = 0;
  let currentPage = firstPage - 1;

  for (let i = 1; i <= 5; i++) {
    currentPage++;
    counter++;

    if (currentPage <= lastPage) {
      displayComics2(currentPage, counter);
    } else {
      newCycle++;
      displayComics2(newCycle, counter);
      

   
    }
  }
}

function getPrevComics() {
  let displayCount = Number(document.getElementById('display').value);
  let pageNum = Number(document.getElementById('page_Num').value);

  let nextMidPage = pageNum - displayCount;

  document.getElementById('page_Num').value = nextMidPage;

  displaySet(nextMidPage, displayCount);
}

function getRandomComics() {
  let displayCount = Number(document.getElementById('display').value);
  let randomNum = Math.floor(Math.random() * 614);
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

  const requestUrl = `${corsHeader}/${apiUrl}/${comicNum}/${apiUrlFormat}`;
  fetch(requestUrl)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.img);
      console.log(comicNum);
      if (numRef == 1) {
        first_display.innerHTML = `<img src = "${data.img}"/>`;
      }
      if (numRef == 2) {
        second_display.innerHTML = `<img src = "${data.img}"/>`;
      }
      if (numRef == 3) {
        third_display.innerHTML = `<img src = "${data.img}"/>`;
      }
      if (numRef == 4) {
        fourth_display.innerHTML = `<img src = "${data.img}"/>`;
      }
      if (numRef == 5) {
        fifth_display.innerHTML = `<img src = "${data.img}"/>`;
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
  }, 5000);
}

// hiding loading
function hideLoading() {
  loader.classList.remove('display');
}
