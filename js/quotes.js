import { getRandomNum, language } from "../js/script.js";

const btnQuote = document.querySelector('.change-quote');
const blockQuote = document.querySelector('.quote');
const author = document.querySelector('.author');

export const getQuotes = (local = 'ru') => { 
  const quotes = 'js/quotes.json';
    fetch(quotes)
      .then(res => res.json())
      .then(data => { 
        const numRandom = getRandomNum();
        blockQuote.textContent = data[local][numRandom - 1].text;
        author.textContent = data[local][numRandom - 1].author;
    });
}

btnQuote.addEventListener('click', () => getQuotes(language), false);