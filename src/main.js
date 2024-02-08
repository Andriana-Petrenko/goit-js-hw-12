// ----library Axios----
import axios from "axios";

// ----library iziToast----
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import closeIcon from './img/bi_x-octagon.png';

// ----library simpleLigthbox----
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('form');
const list = document.querySelector('.gallery');
const spanLoader = document.querySelector('.loader');
const loadButton = document.querySelector('.load-button');
form.addEventListener('submit', onSearchButton);


// Controls the group number
let page = 1;




// ----Event Searching photos----
async function onSearchButton(e){
    e.preventDefault();
    const inputSearch = form.elements.search.value.trim();
    list.innerHTML = '';
    loadButton.style.display = 'none';
    if (inputSearch === '') {
       return iziToast.error({
        messageColor: '#FFF',
        color: '#EF4040',
        iconUrl: closeIcon,
        position: 'topRight',
        message: 'Please,enter what do you want to find!',
        });
    }
    spanLoader.style.display = 'block';
    try {
        const { hits, totalHits} = await fetchPhotos(inputSearch, page);
        // const totalPages = Math.ceil(totalHits / perPage);
        
        // Check the end of the collection
//           if (page > totalPages) {
//     return iziToast.error({
//         position: "topRight",
//         messageColor: '#FFF',
//         color: '#EF4040',
//         iconUrl: closeIcon,
//         message: "We're sorry, but you've reached the end of search results"
//     });
//   }  
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

// ----Add an event handler for the "Load more" button----
loadButton.addEventListener('click', async () => {
    page += 1;
    await fetchPhotos(inputSearch, page);})  
    
    simpleLightbox();
    form.reset();
}

// ----Promise function----
async function fetchPhotos(inputSearch, page) {

    const response = await axios.get( 'https://pixabay.com/api/',{
      params: {
       key: "42112521-3ff4dfc201bab0977369cd2bc",
    q: `${inputSearch}`,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
    per_page: 15,
    page: page
      },
    });
    const { hits, totalHits } = response.data;
    spanLoader.style.display = 'none';
    renderPhoto(hits);
    if (hits.length === 0) {
        loadButton.style.display = 'none';
        iziToast.error({
            messageColor: '#FFF',
            color: '#EF4040',
            iconUrl: closeIcon,
            position: 'topRight',
            message: 'Sorry, there are no images matching your search query. Please try again!',
        });
    };
    
    return { hits, totalHits};
}

// ----Markup HTML----
function renderPhoto(photos) {
    loadButton.style.display = 'block';
    const markup = photos
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
    list.insertAdjacentHTML('beforeend', markup);
}


// ----library simpleLightbox----
function simpleLightbox(){
    let gallery = new SimpleLightbox('.gallery a',{
    captionsData: 'alt',
    captionsPosition: 'bottom',
    captionDelay: 250,
});
    gallery.on('show.simpleLightbox');
    gallery.refresh();
}
