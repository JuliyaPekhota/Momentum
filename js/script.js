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
const btnLocal = document.querySelector(".btnLocal");
const body = document.querySelector('body');
const contentConfig = document.querySelector('.contentConfig');
const btnConfig = document.querySelector('.btnConfig');
const btnCross = document.querySelector('.cross');
const checkDefault = document.querySelector('#unsplash');
const checkUnsplash = document.querySelector('#unsplash');
const checkFlickr = document.querySelector('#flickr');

export let language = 'ru';
let randomNum;
const greetingTranslation = {en: "Good", ru: "Добр"};

const showTime = () => {
    const date = new Date();
    timeTag.textContent = date.toLocaleTimeString();

    setTimeout(showTime, 1000);
    showDate();
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

const getSlideNext = () => {
    const currentLoader = localStorage.getItem('imageUploaded');
    
    if (randomNum < 20) {
        randomNum++;

        if (currentLoader && currentLoader === 'unsplash') {
            getLinkFromUnsplash();
        } else if (currentLoader && currentLoader === 'flickr') {
            getLinkFromFlickr(randomNum);
        } else {
            setBg(randomNum);
        }

    } else {
        
        if (currentLoader && currentLoader === 'unsplash') {
            getLinkFromUnsplash();
        } else if (currentLoader && currentLoader === 'flickr') {
            getLinkFromFlickr(1);
        } else {
            setBg(1);
        }
    }
} 

const getSlidePrev = () => {
    const currentLoader = localStorage.getItem('imageUploaded');

    if (randomNum > 1) {
        randomNum--;
        
        if (currentLoader && currentLoader === 'unsplash') {
            getLinkFromUnsplash();
        } else if (currentLoader && currentLoader === 'flickr') {
            getLinkFromFlickr(randomNum);
        } else {
            setBg(randomNum);
        }

    } else {
        
        if (currentLoader && currentLoader === 'unsplash') {
            getLinkFromUnsplash();
        } else if (currentLoader && currentLoader === 'flickr') {
            getLinkFromFlickr(randomNum);
        } else {
            setBg(20);
        }

    }
}
slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

const getLinkFromFlickr = (num = 0) => {
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

const getLinkFromUnsplash = () => {
    const timeOfDay = getTimeOfDay();
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${timeOfDay}&client_id=MF082mgtp6Gqpvm3pgXSeWB5FoY-3A8pRzV3zVcePcM`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
            const img = new Image();
            const src = data.urls.regular;
            img.src = src;
            img.onload = () => {      
                body.style.backgroundImage = `url(${src})`;
            };
      });
}

const setBg = (num = 0) => {
    const timeOfDay = getTimeOfDay();
    const bgNum = num ? num.toString().padStart(2, "0") : getRandomNum().toString().padStart(2, "0");
    randomNum = bgNum;

    const img = new Image();
    const src = `./assets/images/${timeOfDay}/${bgNum}.jpg`;
    img.src = src;
    img.onload = () => {      
        body.style.backgroundImage = `url(${src})`;
    };
}

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
}

const getLocalStorage = (lang = 'ru') => {
    const currentLoader = localStorage.getItem('imageUploaded');

    if (localStorage.getItem('name') !== null) {
        name.value = localStorage.getItem('name');
    } else {
        name.value = lang === 'ru' ? '[Ваше имя]' : '[Enter Name]';
    }

    if (currentLoader && currentLoader === 'unsplash') {
        getLinkFromUnsplash();
        checkUnsplash.checked = true;
    } 
    
    if (currentLoader && currentLoader === 'flickr') {
        getLinkFromFlickr();
        checkFlickr.checked = true;
    }
}

name.addEventListener('keypress', setLocalStorage);
name.addEventListener('blur', setLocalStorage);
name.addEventListener('click', setLocalStorage);

const changeLang = () => {
    local.classList.toggle('ru');
    language = local.classList.contains('ru') ? 'ru' : 'en';
    btnLocal.textContent = language === 'ru' ? 'РУ' : 'EN';
    
    showGreeting(language);
    showDate(language);
    getWeather(language);
    getQuotes(language);
    getLocalStorage(language);
}

local.addEventListener('click', changeLang);

btnConfig.addEventListener('click', () => {
    contentConfig.classList.toggle('visible');
    }
);
btnCross.addEventListener('click', () => {
    contentConfig.classList.remove('visible');
    }
);

checkDefault.addEventListener('click', () => {
    setBg();
    localStorage.removeItem("imageUploaded");
});
checkUnsplash.addEventListener('click', () => {
    getLinkFromUnsplash();
    localStorage.setItem('imageUploaded', 'unsplash');
});
checkFlickr.addEventListener('click', () => {
    getLinkFromFlickr();
    localStorage.setItem('imageUploaded', 'flickr');
}); 

// Run
getLocalStorage();
showTime();
setBg();
addPlayList();
showGreeting();
getWeather();
getQuotes();

export { getRandomNum };