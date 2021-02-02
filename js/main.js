// DOM Elemets
const time = document.getElementById('time'),
      greeting = document.getElementById('greeting'),
      name = document.getElementById('name'),
      focusp = document.getElementById('focusp'),
      week = document.getElementById('week');

// Show Time
function showTime() {
  let today = new Date(),
      hour = today.getHours(),
      min = today.getMinutes(),
      sec = today.getSeconds();

      if(min == 0 && sec == 0) setTimeout(setBgImage, 1000);

  let weekly = new Date(),
      weekDay = weekly.getDay(),
      day = weekly.getDate(),
      month = weekly.getMonth();
  var options = { weekday: 'long', day: 'numeric', month: 'long' };
  const weekDayNew = new Intl.DateTimeFormat('ru-RU', options).format(weekly)
  
  // Show in HTML
  week.innerHTML = `${weekDayNew}`;
  time.innerHTML = `${addZero(hour)}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;

  setTimeout(showTime, 1000);
}

// Add Zero

function addZero(n) {
  return (parseInt(n, 10) < 10 ? '0' : '') +n;
}

function pressName() {
  localStorage.setItem('name', name.innerText);
  name.textContent = '';
}

function pressFocus() {
  localStorage.setItem('focusp', focusp.innerText);
  focusp.textContent = '';
}

// Background Image

function setBgGreet() {
  let today = new Date(),
      hour = today.getHours();
  if (hour <= 11 && hour >= 6) {
    greeting.textContent = 'Доброе утро, ';
  } else if(hour <= 17 && hour >= 12) {
    greeting.textContent = 'Добрый день, ';
  } else if (hour <= 23 && hour >= 18) {
    greeting.textContent = 'Добрый вечер, ';
    document.body.style.color = '#fff';
  } else {
    greeting.textContent = 'Доброй ночи, ';
    document.body.style.color = '#fff';
  }
}

// Random Image
function getRandomImg() {
  let imgPath = Math.floor(Math.random() * Math.floor(6) + 1);
  return `${imgPath}.jpg`
}

// Array of Images
let imgArr = [];
async function createImgArr() {
  const base = "img/";
  for (let i = 0; i < 24; i++) {
    if (i < 6) imgArr[i] = base + "night/" + getRandomImg();
    else if (i < 12) imgArr[i] = base + "morning/" + getRandomImg();
    else if (i < 18) imgArr[i] = base + "day/" + getRandomImg();
    else imgArr[i] = base + "evening/" + getRandomImg();
  }
}
createImgArr();

// Show Image according to time
function setBgImage() {
  const body = document.querySelector('body');
  let today = new Date(),
    hour = today.getHours();
  let src = imgArr[hour];
  const img = document.createElement("img");
  img.src = src;
  img.onload = () => {
    body.style.backgroundImage = `url(${src})`;
  };
}


// Get Images for Button
let index = new Date();
let imgNum = index.getHours();
function getImage() {
  if (imgNum < imgArr.length - 1) {
    imgNum++;
    let src = imgArr[imgNum];
    const img = document.createElement("img");
    img.src = src;
    img.onload = () => {
      document.body.style.backgroundImage = `url(${src})`;
    };
  } else {
    imgNum = 0
    imgNum++
    let src = imgArr[imgNum];
    const img = document.createElement("img");
    img.src = src;
    img.onload = () => {
      document.body.style.backgroundImage = `url(${src})`;
    }
  }
  btn.disabled = true;
  setTimeout(function() { btn.disabled = false }, 1000);
}

// View Images
function viewBgImage(data) {
  const body = document.querySelector('body');
  const src = data;
  const img = document.createElement('img');
  img.src = src;
  img.onload = () => {      
    body.style.backgroundImage = `url(${src})`;
  }; 
}

const btn = document.querySelector('.btn');
btn.addEventListener('click', getImage);

// Get Name
function getName() {
  if (localStorage.getItem('name') === null) {
    name.textContent = '[Введите имя]';
  } else {
    name.textContent = localStorage.getItem('name');
  }
}

// Set Name
function setName(e) {
  if (e.type === 'keypress') {
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem('name', e.target.innerText);
      name.blur();
    }
  } else {
    if (e.target.textContent == '') {
      e.target.textContent = localStorage.getItem('name');
    }
  }
}

// Get Focus
function getFocus() {
  if (localStorage.getItem('focusp') === null) {
    focusp.textContent = '[Введите цель дня]';
  } else {
    focusp.textContent = localStorage.getItem('focusp');
  }
}

// Set Focus
function setFocus(e) {
  if (e.type === 'keypress') {
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem('focusp', e.target.innerText);
      focusp.blur();
    }
  } else {
    if (e.target.textContent == '') {
      e.target.textContent = localStorage.getItem('focusp');
    }
  }
}

// Quotes
const blockquote = document.querySelector("blockquote");
const btnQuote = document.querySelector("#quote-btn");

async function getQuote() {
  const url = `https://favqs.com/api/qotd`;
  const res = await fetch(url);
  const data = await res.json();
  blockquote.textContent = data.quote.quoteText;
}

// Weather
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-discription");
const city = document.querySelector(".city");
const windSpeed = document.querySelector(".windSpeed");
const humidity = document.querySelector(".humidity");

function getCity() {
  if (
    localStorage.getItem("city") === null ||
    localStorage.getItem("city") == "[Введите свое местоположение]"
  ) {
    city.textContent = "[Введите свое местоположение]";
  } else {
    city.textContent = localStorage.getItem("city");
    getWeather();
  }
}

let cityStorage = "";

function hiddenCity(e) {
  localStorage.setItem("city", e.target.innerText);
  cityStorage = localStorage.getItem("city");
  if (e.type === "click") {
    city.textContent = "";
  }
}

function setCity(e) {
  if (e.code === "Enter") {
    localStorage.setItem("city", e.target.innerText);
    city.blur();
    getWeather();
  }
}

city.onblur = function () {
  getWeather();
};

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=ru&appid=5c8d78e2b51b8bf6f8fed60c4b31605d&units=metric`;
  const res = await fetch(url);
  const data = await res.json();
  if (city.textContent == "") {
    localStorage.setItem("city", cityStorage);
    city.textContent = localStorage.getItem("city");
  } else if (data.cod != 200) {
    alert("Пожалуйста, введите свой город правильно!");
    city.textContent = "[Введите свой город]";
    weatherIcon.className = "weather-icon owf";
    temperature.textContent = ``;
    weatherDescription.textContent = "";
    humidity.textContent = ``;
    windSpeed.textContent = ``;
  } else {
    weatherIcon.className = "weather-icon owf";
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.trunc(data.main.temp)}°C`;
    city.textContent = data.name;
    weatherDescription.textContent = data.weather[0].description;
    humidity.textContent = `Влажность: ${data.main.humidity}%`;
    windSpeed.textContent = `Скорость ветра: ${data.wind.speed}m/s`;
  }
}

document.addEventListener("DOMContentLoaded", getQuote);
btnQuote.addEventListener("click", getQuote);

city.addEventListener("click", hiddenCity);
city.addEventListener("keypress", setCity);
city.addEventListener("blur", setCity);
name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);
name.addEventListener('click', pressName);
focusp.addEventListener('click', pressFocus);
focusp.addEventListener('keypress', setFocus);
focusp.addEventListener('blur', setFocus);


setBgImage();
showTime();
setBgGreet();
getName();
getFocus();
getCity();
