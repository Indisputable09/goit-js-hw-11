import axios from 'axios';

const URL_KEY = '27903219-6f010dc630c8173d81668507d';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export default class PixabayImages {
    constructor() {
        this.inputValue = '';
        this.page = 1;
    }
    
    async fetchImages() {
        try {
        console.log(this)
        const response = await axios.get('', {
        params: {
            key: URL_KEY,
            q: this.inputValue,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: 12,
            page: this.page,
        }
        });
        this.incrementPage()
        return response.data;
    } catch (error) {
        console.log(error.message)
    }
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get value() {
        return this.inputValue;
    }
    set value(newValue) {
        this.inputValue = newValue;
    }
    
}