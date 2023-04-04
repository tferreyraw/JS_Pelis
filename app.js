// pasar a axios
// editar el css
// mostrar numero de pagina

// funcion para cargar las peliculas

window.addEventListener("load", () => {
  cargarPeliculas();
});

let pagina = 1; // variable para controla la paginacion

//capturar los botones

let btnAnterior = document.querySelector("#btnAnterior");
let btnSiguiente = document.querySelector("#btnSiguiente");
let info = document.querySelector("#info");
let header = document.querySelector("#header");

//funcion anterior

btnAnterior.addEventListener("click", () => {
  if (pagina > 1) {
    //pagina = pagina-1
    pagina -= 1;
    cargarPeliculas();
    // llamar a la funcion que cargue las paginas
  } else {
    pagina = 500;
    cargarPeliculas();
  }
});

btnSiguiente.addEventListener("click", () => {
  if (pagina < 500) {
    //pagina = pagina-1
    pagina += 1; // ++
    cargarPeliculas();
    // llamar a la funcion que cargue las paginas
  } else {
    pagina = 1;
    cargarPeliculas();
  }
});

// funcion que cargue las pelis

const apiKey = "b021b2b33671c83af544e4d1e443e3db";

//FUNCION USANDO FETCH!!!!!!
// const cargarPeliculas = async () => {
//   try {
//     header.innerHTML = `<p>Estas en la pagina numero: "${pagina}"</p>`;
//     let respuesta = await fetch(
//       `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-MX&page=${pagina}`
//     );
//     console.log(respuesta);
//     if (respuesta.status == 200) {
//       let datos = await respuesta.json();
//       console.log(datos);
//       let peliculas = "";

//       datos.results.forEach((pelicula) => {
//         peliculas += `<div class="pelicula">
// <img class = "poster" src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}" />
// <h3 class="titulo">${pelicula.title}</h3>
// </div>`;
//       });

//       document.querySelector(".contenedor").innerHTML = peliculas;
//     } else if (respuesta.status === 404) {
//       console.log("error 404 nos vemos en otro lugar");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

const cargarPeliculas = async () => {
  try {
    info.innerHTML = `<p>Pagina Nº ${pagina}</p>`;
    let res = await axios(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-MX&page=${pagina}`
    );
    if (res.request.status == 200) {
      let peliculas = "";

      res.data.results.forEach((pelicula) => {
        peliculas += `
        <div class="pelicula">
        
        <img class = "poster" src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}" />
        <h3 class="titulo">${pelicula.title}</h3>
        
        <div class="overlay">
          <p><b>Sinopsis:</b> ${pelicula.overview}</p>
          <p><b>Puntaje:</b> ${pelicula.vote_average}/10</p>
          
        </div>
        </div>`;
      });

      document.querySelector(".contenedor").innerHTML = peliculas;
    } else if (res.request.status === 404) {
      console.log("error 404 nos vemos en otro lugar");
    }
  } catch (error) {
    console.log(error);
  }
};
