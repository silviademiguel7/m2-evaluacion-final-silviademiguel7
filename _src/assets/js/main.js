'use strict';
//Recoger el elemento del input
const textElement= document.querySelector('.inputText');

//Recoger la Lista donde estaran los resultados
const listResults= document.querySelector('.listResults');
//guardar la url de la API
const url=' http://api.tvmaze.com/search/shows?q=';


//Funcion de pintar li a la lista
function paintLi(tituloSerie,image){
  listResults.innerHTML+=`<li class="liResults">
  <img src="${image}" alt="${tituloSerie}">
  <h2 class="liResultsTitle">${tituloSerie}</h2>
  </li>`;
}

function petition(){

  //Recoger el valor del input
  const textInput=textElement.value;
  //Hacer la peticion con el valor del input y la API
  fetch(url+textInput)
    .then(response=>response.json())
    .then(data=> {
      //recorrer el array de resultados y cada resultado hacer un li. Cada li tiene que tener el nombre y la imagen de cada reultado
      let image='';
      let tituloSerie='';

      for(const serie of data){
        const imageFull=null;

        //Si no exite imagen la imagen tiene que ser por defecto
        if(imageFull===serie.show.image){
          image='https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
          paintLi(tituloSerie,image);
        }else{
          image=serie.show.image.medium;
          tituloSerie=serie.show.name;
          paintLi(tituloSerie,image);
        }


      }

    })


  }











//Recoger el valor del input al hacer click
const btn= document.querySelector('.btn');
btn.addEventListener('click',petition);
