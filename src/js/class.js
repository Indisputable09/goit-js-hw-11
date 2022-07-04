import axios from 'axios';

const URL_KEY = '27903219-6f010dc630c8173d81668507d';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export default class PixabayImages {
    constructor() {
        this.inputValue = '';
        this.page = 1;
        this.per_page = 40;
        this.summaryHits = 0;
        this.loadMore = document.querySelector('.load-more');
    }
    
    async fetchImages() {
        try {
        this.loadMore.classList.add('is-hidden');
        const response = await axios.get('', {
        params: {
            key: URL_KEY,
            q: this.inputValue,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: this.per_page,
            page: this.page,
        }
        });
        this.incrementPage()
        return response.data;
    } catch (error) {
        console.log(error.message)
    }
    }

    smoothScroll() {
    
    const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
    return;
}

    incrementPage() {
        this.summaryHits = this.page * this.per_page;
        this.page += 1;
    }

    resetPage() {
        this.summaryHits = 0;
        this.page = 1;
    }

    get value() {
        return this.inputValue;
    }
    set value(newValue) {
        this.inputValue = newValue;
    }
    
}