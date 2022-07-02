import { Notify } from "notiflix"
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';

const form = document.querySelector('.search__form');
const gallery = document.querySelector('.gallery');
const URL_KEY = '27903219-6f010dc630c8173d81668507d';
let page = 1;
const options = {
    threshold: 1.0,
    rootMargin: '100px',
};

form.addEventListener('submit', onFormSubmit);
// gallery.addEventListener('click', onGalleryClick);

// function onGalleryClick(e) {
//     console.log(e.target)
//     const imgTarget = e.target.classList.contains('image');
//     if (!imgTarget) {
//         return;
//     }
    
//     e.preventDefault();
// };

// const lightBox = new SimpleLightbox(`.gallery a`, { captionDelay: 250});

axios.defaults.baseURL = 'https://pixabay.com/api';
async function fetchImages(inputValue) {
    const response = await axios.get('', {
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
    } catch (error) {
        console.log(error.message)
        Notify.failure('Ooooops')
    }
}

function renderMarkup(data) {
    const image = data.hits;
    const markup = image.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card"><a class="image-link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="image"/>
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
  </a>
</div>`
    });
    // lightBox.refresh();
    gallery.insertAdjacentHTML("beforeend", markup);
}

// //////////////////////////////////////////////////////////////////////////////////
// import { Notify } from "notiflix"
// import SimpleLightbox from "simplelightbox";
// import "simplelightbox/dist/simple-lightbox.min.css";
// import debounce from 'lodash.debounce';
// const axios = require('axios').default;
// const lightBox = new SimpleLightbox(`.gallery div a`, { captionsData: `alt`, captionDelay: 250 });

// const url = `https://pixabay.com/api/`;
// const API_KEY = `27903219-6f010dc630c8173d81668507d`;
// const perPage = 40;
// let page = 1;
// let searchParameter = ``;

// const loadMoreButton = document.querySelector(`.load-more`);
// loadMoreButton.addEventListener(`click`, callImages);

// const searchForm = document.querySelector(`#search-form`);
// const gallery = document.querySelector(`.gallery`);
// const checkBox = document.querySelector(`#infiniteScroll`);

// searchForm.addEventListener(`submit`, callImages),
// window.addEventListener(`scroll`, debounce(infiniteScroll, 250));
// lightBox.on('show.simplelightbox');

// async function fetchImages(url) {

//         const response = await axios.get(url, {
//             params: {
//                 key: API_KEY,
//                 q: searchParameter,
//                 image_type: 'photo',
//                 orientation: 'horizontal',
//                 safesearch: `true`,
//                 per_page: perPage,
//                 page: page,
//             }
//         });
//         const images = await response.data;
//         page += 1;
//         return images;
// }

// async function callImages(event) {

//     try {

//         if (event.type == `submit`) {
//             event.preventDefault();
//             searchParameter = event.target.elements.searchQuery.value;
//             gallery.innerHTML = '';
//             page = 1;
//         }
        
//         const fetch = await fetchImages(url);
//         const imagesMarkup = await makeImages(fetch);
//         const totalHits = await imagesMarkup;

//         if (page > 2) {
//             smoothScroll();
//         }
  
//     if (gallery.children.length < 500 && totalHits > 0) {
//         Notify.success(`Hooray! We found ${totalHits} images.`);
//         }
//     }
    
//     catch {
//         Notify.warning("We're sorry, but you've reached the end of search results.");
//         loadMoreButton.classList.remove("show");
//         return;
//     }
// }

// async function makeImages(images) {

//         if (images) {
//             if (images.hits.length === 0) {
//                 loadMoreButton.classList.remove("show");
//                 Notify.warning("Sorry, there are no images matching your search query. Please try again.");
//                 return;
//             }

//     images.hits.map(hit => { 

//         const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = hit;
//         gallery.insertAdjacentHTML("beforeend", 
//             `<div class="photo-card">
//             <a href="${largeImageURL}">
//             <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
//             <div class="info">
//             <p class="info-item">
//             <b>Likes</b>${likes}</p>
//             <p class="info-item">
//             <b>Views</b>${views}</p>
//             <p class="info-item">
//             <b>Comments</b>${comments}</p>
//             <p class="info-item">
//             <b>Downloads</b>${downloads}</p>
//             </div>
//              </a>
//             </div>
//            `);
//     })
//             lightBox.refresh();

            
//          if (checkBox.checked === false) {
//             loadMoreButton.classList.add("show");
//         }
        
//         if (checkBox.checked === true) {
//             loadMoreButton.classList.remove("show");
//         }

//             return images.totalHits;
//         }
//         return
//     }

// async function smoothScroll() {
    
//     const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
//     window.scrollBy({
//         top: cardHeight * 2,
//         behavior: "smooth",
//     });
//     return;
// }

// async function infiniteScroll() {
//       if (checkBox.checked === true && ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) ) {
//             callImages(`scroll`);
//     }
// }