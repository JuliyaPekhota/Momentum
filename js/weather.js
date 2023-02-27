const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const error = document.querySelector('.weather-error');
const cityTag = document.querySelector('.city');

export const getWeather = (lang = 'ru') => {
    cityTag.value = localStorage.getItem('city');
    const defaultCity = lang === 'ru' ? 'Минск' : 'Minsk';
    const city = cityTag.value === null || cityTag.value === "" ? defaultCity : cityTag.value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${lang}&appid=30cbfe3dd03c7592bc7826a143cdcf24&units=metric`;
    fetch(url)
      .then(res => res.json())
      .then(data => { 
        error.textContent = "";
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        wind.innerHTML = lang === 'ru' ? `Скорость ветра: ${Math.round(data.wind.speed)} <span>м/с</span>` : `Wind speed: ${Math.round(data.wind.speed)} <span>m/s</span>`;
        humidity.innerHTML = lang === 'ru' ? `Влажность: ${Math.round(data.main.humidity)}%` : `Humidity: ${Math.round(data.main.humidity)}%`;
        cityTag.value = city})
    .catch(msgError => {
        console.error('There has been a problem with fetch operation:', msgError);
        error.textContent = lang === 'ru' ? 'Город не найден!' : 'City not found!';
        temperature.textContent = "";
        wind.textContent = "";
        humidity.textContent = "";
        weatherDescription.textContent = "";
    });
}

const setCity = (e) => {
    if (e.code === 'Enter') {
        localStorage.setItem('city', cityTag.value || localStorage.getItem('city'));
        getWeather();
        cityTag.blur();
    }

    if (e.type === 'click') {
        cityTag.value = "";
    }

    if (e.type === 'blur') {
        cityTag.value = localStorage.getItem('city');
    } 
}

cityTag.addEventListener('keypress', setCity);
cityTag.addEventListener('blur', setCity);
cityTag.addEventListener('click', setCity);
