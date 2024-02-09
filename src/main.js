// ----library Axios----
import axios from "axios";

// ----library iziToast----
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import closeIcon from './img/bi_x-octagon.png';

// ----library simpleLigthbox----
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import {refs} from './refs';

// Controls the group number
let page = 1;
let inputSearch = '';
let perPage = 15;

// ----Add an event handler for the "Search" button----
refs.form.addEventListener('submit', onSearchButton);

// ----Add an event handler for the "Load more" button----
refs.loadButton.addEventListener('click', onLoadMoreButton)

// ----Request function----
async function getPhotos() {
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

// ----Event Searching photos----
async function onSearchButton(e){
    e.preventDefault();
    inputSearch = refs.input.value.trim();
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
        addLoadButton(totalHits);
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
        endOfCollection(page, totalHits);
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


// ----Markup HTML----
function renderPhoto(hits) {
    const markup = hits
        .map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) =>
            `<li class='gallery-item'>
             <a class='gallery-link' href='${largeImageURL}'>
               <img class='gallery-image' src='${webformatURL}' alt='${tags}'/>
             </a>
             <div class='container-app'>
              <p><span>Likes</span> ${likes}</p>
              <p><span>Views</span> ${views}</p>
              <p><span>Comments</span> ${comments}</p>
              <p><span>Downloads</span> ${downloads}</p>
             </div>
            </li>`)
        .join('');
    refs.list.insertAdjacentHTML('beforeend', markup);
}

// ----SmoothScroll----
function smoothScroll() {
    const { height: itemHeight } = document.querySelector('.gallery-item').getBoundingClientRect();
    window.scrollBy({
    top: itemHeight*2,
    behavior: 'smooth',
  });
}

// ----No request photos---- 
function noPhotos(hits){
    if (hits.length === 0) {
        console.log('hello');
        iziToast.error({
            messageColor: '#FFF',
            color: '#EF4040',
            iconUrl: closeIcon,
            position: 'topRight',
            message: 'Sorry, there are no images matching your search query. Please try again!',
        });
        }; 
}
// ---- Add 'Load more' button-----
function addLoadButton(totalHits) {
   const totalPages = Math.ceil(totalHits / perPage);     
    if (totalPages>1) {
       refs.loadButton.classList.remove('hidden'); 
    };
     
}

// ---- The end of the collection----
function endOfCollection(page, totalHits) {
    const totalPages = Math.ceil(totalHits / perPage);
    if (page>=totalPages) {
        observer.observe(refs.list.lastChild);
        refs.loadButton.classList.add('hidden'); 
    } else {
        observer.unobserve(refs.list.lastChild);
    } 
}

const observer = new IntersectionObserver(onLastPage);
function onLastPage(entries,observer) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            iziToast.error({
                position: "topRight",
                messageColor: '#FFF',
                color: '#EF4040',
                iconUrl: closeIcon,
                message: "We're sorry, but you've reached the end of search results"
        });
    }
      });
   
}



// ----Library SimpleLightbox----
function simpleLightbox(){
    let gallery = new SimpleLightbox('.gallery a',{
    captionsData: 'alt',
    captionsPosition: 'bottom',
    captionDelay: 250,
});
    gallery.on('show.simpleLightbox');
    gallery.refresh();
}

