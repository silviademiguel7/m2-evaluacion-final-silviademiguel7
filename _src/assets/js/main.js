'use strict';
//Recoger el elemento del input
const textElement = document.querySelector('.inputText');
//Recoger la Lista donde estaran los resultados
const listResults = document.querySelector('.listResults');
//Recoger el elemnto  lista de favorites
const listFavorites = document.querySelector('.favorites');
//Recoger el elemnto  boton
const btn = document.querySelector('.btn');

//guardar la url de la API
const url = ' http://api.tvmaze.com/search/shows?q=';
const DEFUALT_IMAGE = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';

//funcion de inicializacion
function init(){
  const savedFavorites = JSON.parse(localStorage.getItem('favorites'));
  if(savedFavorites){
    paintedFavorites(savedFavorites);
  }

}

//Funcion de resetear lista de resultados
function deleteListResults() {
  listResults.innerHTML = '';

}
//Funcion de pintar li a la lista de resultados
function paintLi(tituloSerie, image,idSerie) {
  //Consulto localSorage favorites
  const favorites = JSON.parse(localStorage.getItem('favoritos'));
  //recorro el array
  //console.log(favorites)
  if(favorites){
    if(favorites.includes(tituloSerie)){
      listResults.innerHTML += `<li class="liResults favorite" data-title="${tituloSerie}" data-id="${idSerie}" data-img="${image}">
      <img src="${image}" alt="${tituloSerie}">
      <h2 class="liResultsTitle">${tituloSerie}</h2>
      </li>`;
    }else{
      listResults.innerHTML += `<li class="liResults" data-title="${tituloSerie}" data-id="${idSerie}" data-img="${image}">
       <img src="${image}" alt="${tituloSerie}">
       <h2 class="liResultsTitle">${tituloSerie}</h2>
      </li>`;
    }
  }else{
    listResults.innerHTML += `<li class="liResults" data-title="${tituloSerie}" data-id="${idSerie}" data-img="${image}">
       <img src="${image}" alt="${tituloSerie}">
       <h2 class="liResultsTitle">${tituloSerie}</h2>
      </li>`;
  }
  return listResults;
}

//Funcion que pone listener a cada li de la lista listResults
function addListener(listResults) {
  const liSerie = listResults.querySelectorAll('.liResults');
  for (const li of liSerie) {
    li.addEventListener('click', toogleFavorite);
  }
}
function deleteFav(event){
  //eliminar de fav el titulo
  const favorites= getFavorites('favorites');
  //console.log(favorites);
  const favoritesId=event.currentTarget.getAttribute('data-id');
  console.log('boton',favoritesId);
  const index = favorites.findIndex(i => i.id === favoritesId);
  console.log(index);
  favorites.splice(index, 1);
  setFavorites('favorites',favorites);
  paintedFavorites(favorites);
  //Quitar la clase favorite al li de resultados
  const liFav=document.querySelectorAll('.favorite');
  //console.log(liFav);
  for(const item of liFav){
    if(item.getAttribute('data-id')===favoritesId){
      item.classList.remove('favorite');
    }
  }
}
//Funcion que pinta los favoritos y anade nueva clase favorita al elemento clickado
// recibe un array de favoritos Ejemplo ['glee', 'glue']
function paintedFavorites(favorites){
  //resetea la lista
  console.log('entro en la funcion');
  listFavorites.innerHTML='';
  //Recoger el titulo
  for(const fav of favorites){
    //add a lista de favorites
    listFavorites.innerHTML+=`
      <li class="liFavorites">
        <img src= "${fav.img}" alta="${fav.title}" class="imgListFav">
        <p class="liFavoriteTitle">${fav.title}</p>
        <button class="btnFav" data-title="${fav.title}" data-id="${fav.id}"></button>
      </li>`;
  }
  const btnDeleteFav=document.querySelectorAll('.btnFav');
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
  // item= que li he clickado, que serie
  const item = event.currentTarget;
  //el nombre de la serie favorita es favoritesName
  //let favoriteId = item.getAttribute('data-id');
  //let favoriteName=item.getAttribute('data-title');
  //let favoriteImg=item.getAttribute('data-img');
  let favoriteLiId= item.dataset.id;


  //console.log(favorites);
  //Si ese li ya era favorito le quito la clase favorita y si no se la pongo
  event.currentTarget.classList.toggle('favorite');
  //Compruebo que clase tiene, si es favorito o no
  //Favorites array de favoritos

  const favs = getFavorites('favorites') || [];
  //Si tiene la clse favorita lo guado en fa
  /*if (item.classList.contains('favorite')) {


    // lo guardo en el array solo si no existe
    if (favs.includes(favoritesName) === false) {
      //meto a favs el nombre de la serie
      favs.push(favoritesName);
    }
  } else {
    // si no tiene la clase favorita lo quito de fav
    const index = favs.indexOf(favoritesName);
    if (index > -1) {
      favs.splice(index, 1);
    }
  }*/
  if(item.classList.contains('favorite')){
    if(favs.length >0){
      const index = favs.findIndex(i => i.id === favoriteLiId);
      if(index=== -1){
        favs.push(item.dataset);
      }else{
        favs.splice(index, 1);
      }
    }else{
      favs.push(item.dataset);
    }
  }else{
    for(let i=0;i < favs.length; i++){
      if(favs[i].id === favoriteLiId){
        favs.splice(i, 1);
      }
    }
  }
  //Guardo en localStorage los favoritos

  setFavorites('favorites',favs);
  //Pinto los favoritos
  const favoritesSalved = getFavorites('favorites');
  paintedFavorites(favoritesSalved);
}
function getShowsUrl(querySearch) {
  return `http://api.tvmaze.com/search/shows?q=${querySearch}`;
}

function search() {
  //Recoger el valor del input
  const textInput = textElement.value;
  const searchShowUrl = getShowsUrl(textInput);
  //Hacer la peticion con el valor del input y la API
  fetch(searchShowUrl)
    .then(response => response.json())
    .then(data => {
      //recorrer el array de resultados y cada resultado hacer un li. Cada li tiene que tener el nombre y la imagen de cada reultado
      deleteListResults();
      let image = '';
      let tituloSerie = '';
      for (const serie of data) {
        tituloSerie = serie.show.name;
        const idSerie=serie.show.id;
        //Si no exite imagen la imagen tiene que ser por defecto
        if (!serie.show.image) {
          image = DEFUALT_IMAGE;
        } else {
          image = serie.show.image.medium;
        }
        paintLi(tituloSerie, image, idSerie);
      }
      //console.log(listResults);
      addListener(listResults);
      //A cada li tengo que hacerle un listerner cuando hago click
    });
}

//Recoger el valor del input al hacer click

btn.addEventListener('click', search);

window.onload = init;
