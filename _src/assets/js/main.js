'use strict';
//Recoger el elemento del input
const textElement = document.querySelector('.inputText');
//Recoger la Lista donde estaran los resultados
const listResults = document.querySelector('.listResults');
//Recoger el elemnto  lista de favorites
const listFavorites = document.querySelector('.favorites');

//guardar la url de la API
const url = ' http://api.tvmaze.com/search/shows?q=';

//Favorites array de favoritos
const favs = [];

//Funcion de resetear lista de resultados
function deleteListResults() {
  listResults.innerHTML = '';
}
//Funcion de pintar li a la lista
function paintLi(tituloSerie, image) {
  //Resetear la ul
  listResults.innerHTML += `<li class="liResults" data-title='${tituloSerie}'>
  <img src="${image}" alt="${tituloSerie}">
  <h2 class="liResultsTitle">${tituloSerie}</h2>
  </li>`;
  return listResults;

}

//Funcion que pone listener a cada li de la lista listResults
function addListener(listResults) {
  const liSerie = listResults.querySelectorAll('.liResults');
  for (const li of liSerie) {
    li.addEventListener('click', savedFavorites);
  }
}

//Funcion que pinta los favoritos y anade nueva clase favorita al elemento clickado
function paintedFavorites(favorites){
  //resetea la lista
  listFavorites.innerHTML='';
  //Recoger el titulo
  for(const fav of favorites){
    //add a lista de favorites
  listFavorites.innerHTML+=`<li class="liFavorites"><p class="liFavoriteTitle">${fav}</p>
  <button class="bntFav">Eliminar de favoritos</button>
  </li>`;
  }
}

function savedFavorites(event) {
  // item= que li he clickado, que serie
  const item = event.currentTarget;
  //el nombre de la serie favorita es favoritesName
  let favoritesName = item.getAttribute('data-title');
  //console.log(favorites);
  //Si ese li ya era favorito le quito la clase favorita y si no se la pongo
  event.currentTarget.classList.toggle('favorite');
  //Compruebo que clase tiene, si es favorito o no
  //Si tiene la clse favorita lo guado en fa
  if (item.classList.contains('favorite')) {
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
  }
  //Guardo en localStorage los favoritos
  localStorage.setItem('favoritos',JSON.stringify(favs));
  //Pinto los favoritos
  paintedFavorites(JSON.parse(localStorage.getItem('favoritos')))
}


function petition() {

  //Recoger el valor del input
  const textInput = textElement.value;
  //Hacer la peticion con el valor del input y la API
  fetch(url + textInput)
    .then(response => response.json())
    .then(data => {
      //recorrer el array de resultados y cada resultado hacer un li. Cada li tiene que tener el nombre y la imagen de cada reultado
      deleteListResults();
      let image = '';
      let tituloSerie = '';
      for (const serie of data) {
        const imageFull = null;
        tituloSerie = serie.show.name;
        //Si no exite imagen la imagen tiene que ser por defecto
        if (imageFull === serie.show.image) {
          image = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
          paintLi(tituloSerie, image);
        } else {
          image = serie.show.image.medium;
          tituloSerie = serie.show.name;
          paintLi(tituloSerie, image);
        }
      }
      //console.log(listResults);
      addListener(listResults);
      //A cada li tengo que hacerle un listerner cuando hago click
    })

}











//Recoger el valor del input al hacer click
const btn = document.querySelector('.btn');
btn.addEventListener('click', petition);
