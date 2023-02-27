import { getQuotes } from "../js/quotes.js";
import { getWeather } from "../js/weather.js";
import { addPlayList } from "../js/player.js";

const timeTag = document.querySelector(".time");
const dateTag = document.querySelector(".date");
const greeting = document.querySelector(".greeting");
const name = document.querySelector(".name");
const slideNext = document.querySelector(".slide-next");
const slidePrev = document.querySelector(".slide-prev");
const local = document.querySelector(".local");
const body = document.querySelector('body');

export let language = 'ru';
let randomNum;
const greetingTranslation = {en: "Good", ru: "Добр"};

const showTime = () => {
    const date = new Date();
    timeTag.textContent = date.toLocaleTimeString();

    setTimeout(showTime, 1000);
    showDate();
    //setBg();
}

const showDate = (locale = 'ru') => {
    const date = new Date();
    const options = {weekday: 'long', month: 'long', day: 'numeric'};
    locale = language;
    const dateStr = date.toLocaleDateString(locale, options);
    dateTag.textContent = dateStr[0].toUpperCase() + dateStr.slice(1);
}

const getHours = () => {
    const date = new Date();
    return date.getHours();
}

const getTimeOfDay = () => {
    const hour = getHours();

    if (hour >= 6 && hour < 12) {
        return 'morning';
    } else if (hour >= 12 && hour < 18) {
        return 'afternoon';
    } else if (hour >= 18 && hour < 24) {
        return 'evening';
    } else {
        return 'night';
    }
}

const showGreeting = (local = 'ru') => {
    const timeOfDay = getTimeOfDay();

    if (local === 'ru') {
        if (timeOfDay === 'morning') {
            greeting.textContent = `${greetingTranslation[local]}ое утро`;
        } else if (timeOfDay === 'afternoon') {
            greeting.textContent = `${greetingTranslation[local]}ый день`;
        } else if (timeOfDay === 'evening') {
            greeting.textContent = `${greetingTranslation[local]}ый вечер`;
        } else if (timeOfDay === 'night') {
            greeting.textContent = `${greetingTranslation[local]}ой ночи`;
        }
    } else {
        greeting.textContent = `${greetingTranslation[local]} ${timeOfDay}`;
    }
}

const getRandomNum = () => Math.floor(Math.random() * (20 - 1 + 1)) + 1;

const getSlideNext = () => getLinkToImage();
const getSlidePrev = () => getLinkToImage();

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

const getLinkToImage = (num = 0) => {
    const timeOfDay = getTimeOfDay();
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=780cd4d9a1e998a48f2973750dc08f1c&tags=${timeOfDay}&extras=url_l&format=json&nojsoncallback=1`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.stat === 'ok') {
            const img = new Image();
            const bgNum = num ? num : getRandomNum();
            randomNum = bgNum;

            const src = data.photos.photo[bgNum].url_l;
            img.src = src;
            img.onload = () => {      
                body.style.backgroundImage = `url(${src})`;
            };
        }
      });
}

/*const setBg = (num = 0) => {
    const timeOfDay = getTimeOfDay();
    const bgNum = num ? num.toString().padStart(2, "0") : getRandomNum().toString().padStart(2, "0");
    randomNum = bgNum;

    const img = new Image();
    const src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    img.src = src;
    img.onload = () => {      
        body.style.backgroundImage = `url(${src})`;
    };
}*/

const setLocalStorage = (e) => {
    if (e.type === "keypress") {
        if (e.which == 13 || e.keyCode == 13) {
            localStorage.setItem('name', (name.value === "" || (name.value).includes("&nbsp;")) ? localStorage.getItem('name') : name.value);
            name.blur();
        }
    } else {
        localStorage.setItem('name', (name.value === "" || (name.value).includes("&nbsp;")) ? localStorage.getItem('name') : name.value);
    }

    if (e.type === "click") {
        name.value = "";
    } 
    if (e.type === "blur") {
        name.value = localStorage.getItem('name');
    }
    // localStorage.setItem('name', name.value);
}

const changeLang = () => {
    local.classList.toggle('ru');
    language = local.classList.contains('ru') ? 'ru' : 'en';
    local.textContent = language === 'ru' ? 'Русский' : 'English';
    
    showGreeting(language);
    showDate(language);
    getWeather(language);
    getQuotes(language);
}


window.addEventListener('beforeunload', setLocalStorage);
name.addEventListener('keypress', setLocalStorage);
name.addEventListener('blur', setLocalStorage);
name.addEventListener('click', setLocalStorage);

const getLocalStorage = () => {
    if (localStorage.getItem('name')) {
        name.value = localStorage.getItem('name');
    } else {
        name.value = '[Enter Name]';
    }
}
window.addEventListener('load', getLocalStorage);

local.addEventListener('click', changeLang);

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('.header').style.display = 'none';
    document.querySelector('.main').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
    setTimeout(showPage, 1000);
});

const showPage = () => {
    document.querySelector('.loader').style.display = 'none';
    document.querySelector('.header').style.display = 'flex';
    document.querySelector('.main').style.display = 'flex';
    document.querySelector('.footer').style.display = 'flex';
}

// Run
getLinkToImage();
showTime();
addPlayList();
showGreeting();
getWeather();
getQuotes();

export { getRandomNum };