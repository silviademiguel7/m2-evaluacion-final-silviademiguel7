'use strict';
const textElement = document.querySelector('.inputText');
const listResults = document.querySelector('.listResults');
const listFavorites = document.querySelector('.favorites');
const btn = document.querySelector('.btn');
const url = ' http://api.tvmaze.com/search/shows?q=';
const DEFUALT_IMAGE = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
function init(){
  const savedFavorites = JSON.parse(localStorage.getItem('favoritos'));
  if(savedFavorites){
    paintedFavorites(savedFavorites);
  }
}
function deleteListResults(){
  listResults.innerHTML = '';
}
function paintLi(tituloSerie,image){
  const favorites = JSON.parse(localStorage.getItem('favoritos'));
  if(favorites){
    if(favorites.includes(tituloSerie)){
      listResults.innerHTML += `<li class="liResults favorite" data-title="${tituloSerie}">
      <img src="${image}" alt="${tituloSerie}">
      <h2 class="liResultsTitle">${tituloSerie}</h2>
      </li>`;
    }else{
      listResults.innerHTML += `<li class="liResults" data-title="${tituloSerie}">
       <img src="${image}" alt="${tituloSerie}">
       <h2 class="liResultsTitle">${tituloSerie}</h2>
      </li>`;
    }
  }else{
    listResults.innerHTML += `<li class="liResults" data-title="${tituloSerie}">
       <img src="${image}" alt="${tituloSerie}">
       <h2 class="liResultsTitle">${tituloSerie}</h2>
      </li>`;
  }
  return listResults;
}
function addListener(listResults){
  const liSerie = listResults.querySelectorAll('.liResults');
  for(const li of liSerie){
    li.addEventListener('click',toogleFavorite);
  }
}
function deleteFav(event){
  const favorites = JSON.parse(localStorage.getItem('favoritos'));
  const favoritesName = event.currentTarget.getAttribute('data-title');
  const index = favorites.indexOf(favoritesName);
  favorites.splice(index,1);
  localStorage.setItem('favoritos',JSON.stringify(favorites));
  paintedFavorites(favorites);
  const liFav = document.querySelectorAll('.favorite');
  for(const item of liFav){
    if(item.getAttribute('data-title') === favoritesName){
      item.classList.remove('favorite');
    }
  }
}
function paintedFavorites(favorites){
  listFavorites.innerHTML = '';
  for(const fav of favorites){
    listFavorites.innerHTML += `
      <li class="liFavorites">
        <p class="liFavoriteTitle">${fav}</p>
        <button class="btnFav" data-title="${fav}"></button>
      </li>`;
  }
  const btnDeleteFav = document.querySelectorAll('.btnFav');
  for(const btnD of btnDeleteFav){
    btnD.addEventListener('click',deleteFav);
  }
}
function toogleFavorite(event){
  const item = event.currentTarget;
  let favoritesName = item.getAttribute('data-title');
  event.currentTarget.classList.toggle('favorite');
  const favs = JSON.parse(localStorage.getItem('favoritos')) || [];
  if(item.classList.contains('favorite')){
    if(favs.includes(favoritesName) === false){
      favs.push(favoritesName);
    }
  }else{
    const index = favs.indexOf(favoritesName);
    if(index > -1){
      favs.splice(index,1);
    }
  }
  localStorage.setItem('favoritos',JSON.stringify(favs));
  paintedFavorites(JSON.parse(localStorage.getItem('favoritos')));
}
function getShowsUrl(querySearch){
  return `http://api.tvmaze.com/search/shows?q=${querySearch}`;
}
function search(){
  const textInput = textElement.value;
  const searchShowUrl = getShowsUrl(textInput);
  fetch(searchShowUrl)
    .then(response => response.json())
    .then(data => {
      deleteListResults();
      let image = '';
      let tituloSerie = '';
      for(const serie of data){
        tituloSerie = serie.show.name;
        if(!serie.show.image){
          image = DEFUALT_IMAGE;
        }else{
          image = serie.show.image.medium;
        }
        paintLi(tituloSerie,image);
      }
      addListener(listResults);
    });
}
btn.addEventListener('click',search);
window.onload = init;
