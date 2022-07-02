import { Notify } from "notiflix"
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';
const lightBox = new SimpleLightbox(`.gallery div a`, { });

const form = document.querySelector('.search__form');
// const inputValue = form.elements.searchQuery.value;
const gallery = document.querySelector('.gallery');
const URL_KEY = '27903219-6f010dc630c8173d81668507d';
let page = 1;
const options = {
    threshold: 1.0,
    rootMargin: '100px',
};

// axios.defaults.baseURL = 'https://pixabay.com/api';

form.addEventListener('submit', onFormSubmit);

async function fetchImages(inputValue) {
    const response = await axios.get('https://pixabay.com/api', {
        params: {
            key: URL_KEY,
            q: inputValue,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: '20',
            page: page,
        }
    });
    page++;
    return response.data;
}

async function onFormSubmit(e) {
    gallery.innerHTML = '';
    e.preventDefault();
    page = 1;
    const inputValue = e.currentTarget.elements.searchQuery.value;
    if (inputValue === '') {
        gallery.innerHTML = '';
        return;
        }
    try {
    const fetch = await fetchImages(inputValue);
    const render = await renderMarkup(fetch);
    const totalHits = fetch.totalHits;
    const observer = new IntersectionObserver((entries) => {
    entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
            // page++;
                console.log(page)
        }
    })
}, options);

        observer.observe(document.querySelector('.scroll-limit'));
        if (gallery.children.length < 500 && totalHits > 0) {
        Notify.success(`Hooray! We found ${totalHits} images.`);
        }
        if (fetch.hits.length === 0) {
            Notify.warning("Sorry, there are no images matching your search query. Please try again.")
        }
        e.target.reset();
    } catch {
        Notify.failure('Ooooops')
    }
}

function renderMarkup(data) {
    const image = data.hits;
    const markup = image.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
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