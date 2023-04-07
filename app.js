window.addEventListener("load", () => {
  cargarPeliculas();
});

let pagina = 1; //

const btnAnterior = document.querySelector("#btnAnterior");
const btnSiguiente = document.querySelector("#btnSiguiente");
const contenedor = document.querySelector(".contenedor");
const info = document.querySelector("#info");
const form = document.querySelector(".search-form");
const input = document.querySelector(".search-form-input");
const btnSearch = document.querySelector(".search-button");

btnAnterior.addEventListener("click", () => {
  if (pagina > 1) {
    pagina -= 1;
    cargarPeliculas();
  }
});

btnSiguiente.addEventListener("click", () => {
  if (pagina < 500) {
    pagina += 1;
    cargarPeliculas();
  } else {
    pagina = 1;
    cargarPeliculas();
  }
});

const apiKey = "b021b2b33671c83af544e4d1e443e3db";

const cargarPeliculas = async () => {
  try {
    info.innerHTML = `<p>Pagina Nº ${pagina}</p>`;
    if (pagina === 1) {
      btnAnterior.style.display = "none";
    } else {
      btnAnterior.style.display = "block";
    }
    let res = await axios(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-MX&page=${pagina}`
    );
    if (res.request.status === 200) {
      let peliculas = "";

      res.data.results.forEach((pelicula) => {
        peliculas += `
        <div class="pelicula">
          <img class = "poster" src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}" />
          <div class="overlay">
            <div class="titulo">
              <h3>${pelicula.title}</h3>
            </div>
            <p class="sinopsis"><b>Sinopsis:</b> ${pelicula.overview}</p>
            <p class="puntaje"><b>Puntaje:</b> ${pelicula.vote_average}/10</p>
          </div>
        </div>`;
      });

      contenedor.innerHTML = peliculas;
    } else if (res.request.status === 404) {
      console.log("error 404 nos vemos en otro lugar");
    }
  } catch (error) {
    console.log(error);
  }
};

//Funcion para el BUSCADOR

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = input.value.trim();
  if (!username) return;
  obtenerData(username);
  input.value = "";
});

const obtenerData = async (username) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=es-MX&query=${username}&page=1&include_adult=false`
    );

    if (response.status == 200) {
      const data = await response.data;
      mostrarDatos(data);
      console.log(data);
    } else if (response.status === 404) {
      console.log("Error 404 nos vemos en otro lugar");
    }
  } catch (error) {
    console.error("Error", error);
  }
};

const mostrarDatos = (data) => {
  let peliculas = "";

  data.results.forEach((pelicula) => {
    peliculas += `
      <div class="pelicula">
        <img class = "poster" src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}" />
        <div class="overlay">
          <div class="titulo">
            <h3>${pelicula.title}</h3>
          </div>
          <p class="sinopsis"><b>Sinopsis:</b> ${pelicula.overview}</p>
          <p class="puntaje"><b>Puntaje:</b> ${pelicula.vote_average}/10</p>
        </div>
      </div>`;
  });

  if (Object.keys(data.results).length === 0) {
    return (contenedor.innerHTML = `<div class="contenedor-error">
    <h3>
      Whoops!! Pelicula no encontrada!!
    </h3>
    <img src="./img/NotFoundShrek.gif" alt="" />
  </div>`);
  }
  contenedor.innerHTML = peliculas;
};
