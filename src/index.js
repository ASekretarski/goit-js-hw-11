import axios from 'axios';
import Notiflix from 'notiflix';

const API_PATH = "https://pixabay.com/api/"
const API_KEY = "37026170-4b9a19924d092957be3a6c20c";
const searchParameters = new URLSearchParams({
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
})
let searchPhrase = '';
const noMatches = "Sorry, there are no images matching your search query. Please try again."

// const axiosResult = await axios.get(`${API_PATH}?${searchParameters}&q=${searchPhrase}`)

async function imageSearch(searchPhrase) {
    try {
        const response = await axios.get(`${API_PATH}?${searchParameters}&q=${searchPhrase}`);
        console.log(response)
        const { data } = response;
        console.log(data.total)
        if (data.total === 0) {
            Notiflix.Notify.warning(`${noMatches}`);
        } else {
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
        }
    } catch(e) {
        Notiflix.Notify.failure(e.response.data)
    }
}

imageSearch('cat with a dog')