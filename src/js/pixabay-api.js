
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import closeIcon from '../img/bi_x-octagon.png';
import axios from "axios";
import { renderPhoto } from "./render-functions";
import { smoothScroll } from "./render-functions";
import { noPhotos } from "./render-functions";
import { addLoadButton } from "./render-functions";
import { endOfCollection } from "./render-functions";
import { simpleLightbox } from "./render-functions";


export const refs = {
    form: document.querySelector('form'),
    list: document.querySelector('.gallery'),
    spanLoader: document.querySelector('.loader'),
    loadButton: document.querySelector('.load-button'),
    input: document.querySelector('.form-input')
}

let page = 1;
let inputSearch = '';
let perPage = 15;

// ----Request function----
export async function getPhotos() {
    refs.spanLoader.classList.remove('hidden');
    const response = await axios.get( 'https://pixabay.com/api/',{
        params: {
            key: "42112521-3ff4dfc201bab0977369cd2bc",
            q: `${inputSearch}`,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: "true",
            per_page: perPage,
            page: page},
    });
    const {hits, totalHits } = response.data;
    refs.spanLoader.classList.add('hidden');
    return {hits, totalHits};
}

// ----Add an event handler for the "Load more" button----
refs.loadButton.addEventListener('click', onLoadMoreButton);

// ----Add an event handler for the "Search" button----
refs.form.addEventListener('submit', onSearchButton);

// ----Event Searching photos----
async function onSearchButton(e){
    e.preventDefault();
    inputSearch  = refs.input.value.trim();
    refs.list.innerHTML = '';
    refs.loadButton.classList.add('hidden');
    if (inputSearch === '') {
        return iziToast.error({
            messageColor: '#FFF',
            color: '#EF4040',
            iconUrl: closeIcon,
            position: 'topRight',
            message: 'Please,enter what do you want to find!',
        });
    };
    page = 1;
    try {
        const { hits, totalHits } = await getPhotos();
        noPhotos(hits);
        renderPhoto(hits);
        addLoadButton(totalHits,perPage);
    }
    catch (error) {
        iziToast.error({
            messageColor: '#FFF',
            color: '#EF4040',
            iconUrl: closeIcon,
            position: 'topRight',
            message: `${error}`,
        })
    } 
    simpleLightbox();
    refs.form.reset(); 
}

// ----Event Loading photos----
 async function onLoadMoreButton() {  
    page++;
    try {
        const {hits, totalHits} = await getPhotos();
        renderPhoto(hits);
        endOfCollection(page, totalHits, perPage);
    }
    catch (error) {
        console.log(error);
        iziToast.error({
                messageColor: '#FFF',
                color: '#EF4040',
                iconUrl: closeIcon,
                position: 'topRight',
                message: `${error}`,
            })
     };
    smoothScroll();
    simpleLightbox();
}
