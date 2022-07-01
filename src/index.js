import { Notify } from "notiflix"
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
// import debounce from 'lodash.debounce';
const axios = require('axios').default;
const lightBox = new SimpleLightbox(`.gallery div a`, { captionsData: `alt`, captionDelay: 250 });

const form = document.querySelector('.search__form');
const inputValue = form.elements.searchQuery.value;
const gallery = document.querySelector('.gallery');
const URL_KEY = '27903219-6f010dc630c8173d81668507d';
const url = 'https://pixabay.com/api/';
let page = 1;
const options = {
    key: URL_KEY,
    q: inputValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: '40',
    page: page,
};

form.addEventListener('submit', onFormSubmit);

function fetchImages(inputValue) {
    return fetch(`${url}?key=${URL_KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`).then(response => {
        if (!response.ok) {
            throw new Error(response.status)
        }
        return response.json();
    })
}

function onFormSubmit(e) {
    e.preventDefault();
    const inputValue = e.currentTarget.elements.searchQuery.value;
    // if (inputValue === '') {
    //     gallery.innerHTML = '';
    //     return;
    // }
    fetchImages(inputValue).then(renderMarkup).catch(console.log);
}

function renderMarkup(data) {
    const test = data.hits;
    const markup = data.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        `<div class="photo-card"><a href="${largeImageURL}">
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
    console.log(markup)

}