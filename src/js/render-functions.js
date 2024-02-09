// ----library iziToast----
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import closeIcon from '../img/bi_x-octagon.png';

// ----library simpleLigthbox----
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { refs } from "./pixabay-api";

// ----Markup HTML----
 export function renderPhoto(hits) {
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
export function smoothScroll() {
    const { height: itemHeight } = document.querySelector('.gallery-item').getBoundingClientRect();
    window.scrollBy({
    top: itemHeight*2,
    behavior: 'smooth',
  });
}

// ----No request photos---- 
export function noPhotos(hits){
    if (hits.length === 0) {
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
export function addLoadButton(totalHits,perPage) {
   const totalPages = Math.ceil(totalHits / perPage);     
    if (totalPages>1) {
       refs.loadButton.classList.remove('hidden'); 
    };
     
}

// ---- The end of the collection----
export function endOfCollection(page, totalHits, perPage) {
    const totalPages = Math.ceil(totalHits / perPage);
    if (page>=totalPages) {
        observer.observe(refs.list.lastChild);
        refs.loadButton.classList.add('hidden'); 
    } else {
        observer.unobserve(refs.list.lastChild);
    } 
}

// ---- Add observer----
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
let gallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionsPosition: 'bottom',
    captionDelay: 250,
});
 export function simpleLightbox(){
    gallery.on('show.simpleLightbox');
    gallery.refresh();
}
