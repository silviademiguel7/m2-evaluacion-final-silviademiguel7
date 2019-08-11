'use strict';
const textElement = document.querySelector('.inputText');
const listResults = document.querySelector('.listResults');
const listFavorites = document.querySelector('.favorites');
const btn = document.querySelector('.btn');
const url = ' http://api.tvmaze.com/search/shows?q=';
const DEFUALT_IMAGE = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';

function init(){
  const savedFavorites = getFavorites('favorites');
  if(savedFavorites){
    paintedFavorites(savedFavorites);
  }
}
function deleteListResults() {
  listResults.innerHTML = '';
}
function paintLi(tituloSerie,image,idSerie) {
  const favorites = getFavorites('favorites');
  if(favorites){
    const index = favorites.findIndex(i => i.id == idSerie);
    if(index !== -1){
      listResults.innerHTML += `<li class = "liResults favorite" data-title = "${tituloSerie}" data-id = "${idSerie}" data-img = "${image}">
      <img src = "${image}" alt = "${tituloSerie}">
      <h2 class = "liResultsTitle">${tituloSerie}</h2>
      </li>`;
    }else{
      listResults.innerHTML += `<li class = "liResults" data-title = "${tituloSerie}" data-id = "${idSerie}" data-img = "${image}">
       <img src = "${image}" alt = "${tituloSerie}">
       <h2 class = "liResultsTitle">${tituloSerie}</h2>
      </li>`;
    }
  }else{
    listResults.innerHTML += `<li class = "liResults" data-title = "${tituloSerie}" data-id = "${idSerie}" data-img = "${image}">
       <img src = "${image}" alt = "${tituloSerie}">
       <h2 class = "liResultsTitle">${tituloSerie}</h2>
      </li>`;
  }
  return listResults;
}
function addListener(listResults) {
  const liSerie = listResults.querySelectorAll('.liResults');
  for (const li of liSerie) {
    li.addEventListener('click', toogleFavorite);
  }
}
function deleteFav(event){
  const favorites = getFavorites('favorites');
  const favoritesId = event.currentTarget.getAttribute('data-id');
  const index = favorites.findIndex(i => i.id == favoritesId);
  favorites.splice(index, 1);
  setFavorites('favorites',favorites);
  paintedFavorites(favorites);
  const liFav = document.querySelectorAll('.favorite');
  for(const item of liFav){
    if(item.getAttribute('data-id') === favoritesId){
      item.classList.remove('favorite');
    }
  }
}
function paintedFavorites(favorites){
  listFavorites.innerHTML = '';
  for(const fav of favorites){
    listFavorites.innerHTML+=`
      <li class = "liFavorites">
        <img src = "${fav.img}" alta = "${fav.title}" class = "imgListFav">
        <p class = "liFavoriteTitle">${fav.title}</p>
        <button class = "btnFav" data-title = "${fav.title}" data-id = "${fav.id}"></button>
      </li>`;
  }
  const btnDeleteFav = document.querySelectorAll('.btnFav');
  for(const btnD of btnDeleteFav){
    btnD.addEventListener('click',deleteFav);
  }

}
function getFavorites(favorites){
  return JSON.parse(localStorage.getItem(favorites));
}
function setFavorites(name,valor){
  return localStorage.setItem(name,JSON.stringify(valor));
}
function toogleFavorite(event) {
  const item = event.currentTarget;
  let favoriteLiId = item.dataset.id;
  event.currentTarget.classList.toggle('favorite');
  const favs = getFavorites('favorites') || [];
  if(item.classList.contains('favorite')){
    if(favs.length >0){
      const index = favs.findIndex(i => i.id == favoriteLiId);
      if(index === -1){
        favs.push(item.dataset);
      }else{
        favs.splice(index,1);
      }
    }else{
      favs.push(item.dataset);
    }
  }else{
    for(let i = 0;i < favs.length; i++){
      if(favs[i].id === favoriteLiId){
        favs.splice(i,1);
      }
    }
  }
  setFavorites('favorites',favs);
  const favoritesSalved = getFavorites('favorites');
  paintedFavorites(favoritesSalved);
}
function getShowsUrl(querySearch) {
  return `${url}${querySearch}`;
}

function search() {
  const textInput = textElement.value;
  const searchShowUrl = getShowsUrl(textInput);
  fetch(searchShowUrl)
    .then(response => response.json())
    .then(data => {
      deleteListResults();
      let image = '';
      let tituloSerie = '';
      for (const serie of data) {
        tituloSerie = serie.show.name;
        const idSerie = serie.show.id;
        if (!serie.show.image) {
          image = DEFUALT_IMAGE;
        } else {
          image = serie.show.image.medium;
        }
        paintLi(tituloSerie,image,idSerie);
      }
      addListener(listResults);
    });
}
btn.addEventListener('click',search);
window.onload = init;
