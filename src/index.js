import { Notify } from "notiflix"
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import PixabayImages from './js/class';

const pixabayImages = new PixabayImages();
const lightBox = new SimpleLightbox('.gallery div a', { captionDelay: 250, captionClass: 'caption--bg', captionsData: 'alt'});

const form = document.querySelector('.search__form');
const gallery = document.querySelector('.gallery');
const observationTarget = document.querySelector('.scroll-limit');
const checkBoxScroll = document.querySelector('#infiniteScroll');

const options = {
    threshold: 1.0,
    rootMargin: '200px',
};

Notify.info('Please select whether you want to load images with infinite scroll.')

form.addEventListener('submit', onFormSubmit);
pixabayImages.loadMore.addEventListener('click', onLoadMoreClick);

async function onFormSubmit(e) {
    try {
    e.preventDefault();
    gallery.innerHTML = '';
    pixabayImages.value = e.currentTarget.elements.searchQuery.value;
    pixabayImages.resetPage();
        if (pixabayImages.value === '') {
        pixabayImages.loadMore.classList.add('is-hidden');
        Notify.warning('If you want to search, than try to write something in the field.')
        gallery.innerHTML = '';
        return;
    }

    const fetch = await pixabayImages.fetchImages(pixabayImages.value);
    await renderMarkup(fetch);
    pixabayImages.loadMore.classList.remove('is-hidden');

    const totalHits = fetch.totalHits;

        if (gallery.children.length < 500 && totalHits > 0) {
        Notify.success(`Hooray! We found ${totalHits} images.`);
        }
        if (fetch.hits.length === 0) {
        pixabayImages.loadMore.classList.add('is-hidden');
        Notify.warning("Sorry, there are no images matching your search query. Please try again.")
        }
        e.target.reset();
    } catch (error) {
        pixabayImages.loadMore.classList.add('is-hidden');
        console.log(error.message)
        Notify.warning("We're sorry, but you've reached the end of search results.");
    }
}

async function onLoadMoreClick() {
    if (!checkBoxScroll.checked) {
    getAndRender();
    pixabayImages.loadMore.classList.remove('is-hidden');
}
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
    lightBox.refresh();
}


    const observer = new IntersectionObserver((entries) => {
    entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
            if (pixabayImages.summaryHits < 500 && pixabayImages.page > 1 && checkBoxScroll.checked) {
                try {
                    getAndRender();
                    lightBox.refresh();
                    pixabayImages.incrementPage();
                    pixabayImages.smoothScroll();
                } catch (error) {
                    console.log(error);
                };
            } else if (pixabayImages.summaryHits > 500) {
                Notify.warning("We're sorry, but you've reached the end of search results.");
            }
        }    
    })
}, options);

observer.observe(observationTarget);

async function getAndRender() {
    const fetch = await pixabayImages.fetchImages(pixabayImages.value);
    await renderMarkup(fetch);
}