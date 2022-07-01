import { Notify } from "notiflix"
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
// import debounce from 'lodash.debounce';
import axios from 'axios';
const lightBox = new SimpleLightbox(`.gallery div a`, { captionsData: `alt`, captionDelay: 250 });

const form = document.querySelector('.search__form');
const inputValue = form.elements.searchQuery.value;
const gallery = document.querySelector('.gallery');
const URL_KEY = '27903219-6f010dc630c8173d81668507d';
let page = 1;
const options = {
    threshold: 1.0,
    rootMargin: '200px',
};

axios.defaults.baseURL = 'https://pixabay.com/api';

// const observer = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//         console.log(entry)
//         if (entry.isIntersecting) {
//             console.log('Good')
//         }
//     })
// }, options);

// const target = document.querySelector('.scroll-limit');

// observer.observe(target);


form.addEventListener('submit', onFormSubmit);

async function fetchImages(inputValue) {
    const response = await axios.get('', {
        params: {
            key: URL_KEY,
            q: inputValue,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: '3',
            page: page,
        }
    });
    return response.data;
}

async function onFormSubmit(e) {
    gallery.innerHTML = ''
    e.preventDefault();
    const inputValue = e.currentTarget.elements.searchQuery.value;
    if (inputValue === '') {
        gallery.innerHTML = '';
        return;
    }
    // if (gallery.innerHTML !== '') {
    //     page++;
    // }
    const fetch = await fetchImages(inputValue);
    const render = await renderMarkup(fetch);
    const totalHits = await render;
    // .then(renderMarkup).catch(console.log);
    e.target.reset();
}

function renderMarkup(data) {
    const test = data.hits;
    const markup = test.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `<div class="photo-card"><a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>: ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>: ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>: ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>: ${downloads}
    </p>
  </div>
</div>`
    }).join('')
    gallery.insertAdjacentHTML("beforeend", markup);
}