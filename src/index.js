import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const API_PATH = "https://pixabay.com/api/"
const API_KEY = "37026170-4b9a19924d092957be3a6c20c";
const searchParameters = new URLSearchParams({
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: 1,
})
const searchInput = document.querySelector('[name="searchQuery"]')
const searchForm = document.querySelector('#search-form')
const gallery = document.querySelector('.gallery')
const loadButton = document.querySelector('.load-more')
let searchPhrase = '';
const noMatches = "Sorry, there are no images matching your search query. Please try again."
let page = 1;

async function imageSearch(searchPhrase, page=1) {
    try {
        const response = await axios.get(`${API_PATH}?${searchParameters}&q=${searchPhrase}&page=${page}`);
        const { data } = response;
        if (page === 1) {
        if (!searchPhrase) {
            return(data)
            }
        if (data.total === 0) {
            Notiflix.Notify.warning(`${noMatches}`);
            } else {
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
            }            
        }
        return (data)
    } catch (e) {
        Notiflix.Notify.failure(`Error status ${e.response.status}`)
    }
}
function createGallery(data) {
    const galleryData = data.hits.map(
        ({comments, downloads, largeImageURL, likes, tags, views, webformatURL})=>{return `<div class="photo-card">
        <a class="gallery__item" href="${largeImageURL}">
        <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
        <p class="info-item">
        <b>Likes</b>
        ${likes}
        </p>
        <p class="info-item">
        <b>Views</b>
        ${views}
        </p>
        <p class="info-item">
        <b>Comments</b>
        ${comments}
        </p>
        <p class="info-item">
        <b>Downloads</b>
        ${downloads}
        </p>
        </div>
        </div>`}
    ).join('')
    gallery.insertAdjacentHTML('beforeend', galleryData);
    const allGalleryLinks = document.querySelectorAll('.gallery__item')
    for (const link of allGalleryLinks) {
        link.addEventListener("click", function (event) {
            event.preventDefault()
        }) 
    }
    var lightbox = new SimpleLightbox('.gallery a');
}
async function showGallery(searchPhrase) {
    const result = await imageSearch(searchPhrase)
    createGallery(result)
    if (result.totalHits > result.hits.length) {
        loadButton.classList.remove('invisible')
    } else {
        loadButton.classList.add('invisible')
    }
}
async function loadMoreImages() {
    page += 1;
    const result = await imageSearch(searchPhrase, page)
    createGallery(result)
    if (page===Math.ceil(result.totalHits/40)){
        loadButton.classList.add('invisible');
        Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`)
    }
}
searchForm.addEventListener("submit", (e) => {
    e.preventDefault()
    gallery.innerHTML = '';
    page = 1;
    searchPhrase=searchInput.value
    showGallery(searchPhrase)
})
loadButton.addEventListener("click", () => {
    loadMoreImages()
})
