import playList from '../js/playList.js';

const btnPlay = document.querySelector('.play');
const btnPlayNext = document.querySelector('.play-next');
const btnPlayPrev = document.querySelector('.play-prev');
const playListContainer = document.querySelector('.play-list');
const timeLine = document.querySelector(".player-timeline");
const timeCurrent = document.querySelector(".time-current");
const timeLength = document.querySelector(".time-length");
const songName = document.querySelector(".player-song");
const volumeSlider = document.querySelector(".volume-slider");
const volumePercentage = document.querySelector(".volume-percentage");
const volumeBtn = document.querySelector(".volume-button");
const progressBar = document.querySelector(".progress");

let refreshTime = null;
let isPlay = false;
let playNum = 0;
const audio = new Audio();
let currentTime = 0;

const playAudio = () => {
    audio.src = playList[playNum].src;
    audio.volume = .75;
    isPlay = !btnPlay.classList.contains("pause");
    timeLength.textContent = playList[playNum].duration;
    songName.textContent = playList[playNum].title;

    if (isPlay) {
        audio.pause();

        audio.currentTime = currentTime;
        clearInterval(refreshTime);
    } else {
        audio.play();
        audio.currentTime = currentTime;
        
        refreshTime = setInterval(() => {
            currentTime = audio.currentTime;    
            progressBar.style.width = currentTime / audio.duration * 100 + "%";
            timeCurrent.textContent = getTimeCodeFromNum(currentTime);

            if (audio.currentTime === audio.duration) {
                playNext();
            }
        }, 500);
    }

    const playListLi = Array.from(playListContainer.children);
    playListLi.forEach((li, i) => {
        li.classList.remove("item-active");
        if (i === playNum) {
            li.classList.add("play-item", "item-active");
        }
    });
};

export const addPlayList = () => {
    playList.forEach((el, i) => {
        const li = document.createElement("li");
        playListContainer.append(li);
        li.classList.add("play-item");
        li.textContent = el.title;

        li.addEventListener("click", () => {
            playNum = i;

            const playListLi = Array.from(playListContainer.children);
            playListLi.forEach(item => {
                item.classList.remove("item-active");
            });
            
            if (i === playNum) {
                li.classList.add("play-item", "item-active");
                btnPlay.classList.add("pause");
                playAudio();
            }

        });
    });
};

const playNext = () => { 
    playNum = playNum < 3 ? playNum + 1 : 0;
    resetСurrentTime();
    btnPlay.classList.add("pause");
    playAudio();
};

const playPrev = () => {
    playNum = playNum > 0 ? playNum - 1 : 3;
    resetСurrentTime();
    btnPlay.classList.add("pause");
    playAudio();
};

const toggleBtnPlay = () => {
    btnPlay.classList.toggle('pause');
    playAudio();
};

timeLine.addEventListener("click", e => {
    const timeLineWidth = window.getComputedStyle(timeLine).width;
    const timeToSeek = e.offsetX / parseInt(timeLineWidth) * audio.duration;
    audio.currentTime = timeToSeek || 0;
}, false);

//click volume slider to change volume
volumeSlider.addEventListener('click', e => {
  const sliderWidth = window.getComputedStyle(volumeSlider).width;
  const newVolume = e.offsetX / parseInt(sliderWidth);
  audio.volume = newVolume;
  volumePercentage.style.width = newVolume * 100 + '%';
}, false);

volumeBtn.addEventListener("click", () => {
    const volumeEl = document.querySelector(".player-volume .volume");
    audio.muted = !audio.muted;
    if (audio.muted) {
      volumeEl.classList.remove("icono-volumeMedium");
      volumeEl.classList.add("icono-volumeMute");
      volumeSlider.classList.add("hidden");
    } else {
      volumeEl.classList.add("icono-volumeMedium");
      volumeEl.classList.remove("icono-volumeMute");
      volumeSlider.classList.remove("hidden");
    }
});

const resetСurrentTime = () => {
    progressBar.style.width = 0;
    currentTime = 0;
    timeCurrent.textContent = getTimeCodeFromNum(currentTime);
};

const getTimeCodeFromNum = (num) => {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;
  
    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(
      seconds % 60
    ).padStart(2, 0)}`;
};

timeLength.textContent = playList[playNum].duration;
songName.textContent = playList[playNum].title;
btnPlay.addEventListener('click', toggleBtnPlay, false);
btnPlayNext.addEventListener('click', playNext);
btnPlayPrev.addEventListener('click', playPrev);