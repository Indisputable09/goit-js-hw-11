import { Notify } from "notiflix"
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import PixabayImages from './js/class';

const pixabayImages = new PixabayImages();
const lightBox = new SimpleLightbox(`.gallery a`, { captionDelay: 250});

const form = document.querySelector('.search__form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

// lightBox.on('show.simplelightbox');

const options = {
    threshold: 1.0,
    rootMargin: '100px',
};

form.addEventListener('submit', onFormSubmit);
loadMore.addEventListener('click', onLoadMoreClick)

async function onFormSubmit(e) {
    try {
    // lightBox.refresh();
    e.preventDefault();
    // loadMore.classList.add('is-hidden');
    gallery.innerHTML = '';
    pixabayImages.value = e.currentTarget.elements.searchQuery.value;
    pixabayImages.resetPage();
        if (pixabayImages.value === '') {
        loadMore.classList.add('is-hidden');
        Notify.warning('If you want to search, than try to write something in the field.')
        gallery.innerHTML = '';
        return;
    }

    const fetch = await pixabayImages.fetchImages(pixabayImages.value);
    const render = await renderMarkup(fetch);
    loadMore.classList.remove('is-hidden');
    const totalHits = fetch.totalHits;
        
        if (gallery.children.length < 500 && totalHits > 0) {
        Notify.success(`Hooray! We found ${totalHits} images.`);
        }
        if (fetch.hits.length === 0) {
            loadMore.classList.add('is-hidden');
        Notify.warning("Sorry, there are no images matching your search query. Please try again.")
        }
        e.target.reset();
    } catch (error) {
        console.log(error.message)
        Notify.warning("We're sorry, but you've reached the end of search results.");
    }
}

function onLoadMoreClick() {
// lightBox.refresh();
pixabayImages.fetchImages(pixabayImages.value).then(renderMarkup)
}
;

async function renderMarkup(data) {
    const image = data.hits;
    const markup = image.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card"><a class="image-link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> <span class="number-of">${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b> <span class="number-of">${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b> <span class="number-of">${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b> <span class="number-of">${downloads}</span>
    </p>
  </div>
  </a>
</div>`
    }).join('');
    gallery.insertAdjacentHTML("beforeend", markup);
}

// /////////////////
gallery.addEventListener('click', onGalleryClick);

function onGalleryClick(e) {
    console.log(e.target !== e.currentTarget)
    console.log(e.currentTarget)

    if (e.target !== e.currentTarget) {
        lightBox.refresh();
        lightBox.on('show.simplelightbox');
        e.preventDefault();
    }
    
};



// function observation() {
//     const observer = new IntersectionObserver((entries) => {
//     entries.forEach(async (entry) => {
//         if (entry.isIntersecting && gallery.innerHTML !== '') {
//         page += 1;
//         const fetch = await fetchImages(inputValue);
//         const render = await renderMarkup(fetch);
//         }
//     })
//         }, options);
//             observer.observe(document.querySelector('.scroll-limit'));
// }