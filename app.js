window.addEventListener("load", () => {
  cargarPeliculas();
});

let pagina = 1; //
let page = 1;

const btnAnterior = document.querySelector("#btnAnterior");
const btnSiguiente = document.querySelector("#btnSiguiente");
const btnAnteriorSearch = document.querySelector("#btnAnteriorSearch");
const btnSiguienteSearch = document.querySelector("#btnSiguienteSearch");
const contenedor = document.querySelector(".contenedor");
const paginacionBusqueda = document.querySelector(".popular-search");
const paginacionPopular = document.querySelector(".popular-paginacion");
const info = document.querySelector("#info");
const infoSearch = document.querySelector("#info-search");
const formBusqueda = document.querySelector(".search-form");
const input = document.querySelector(".search-form-input");

const apiKey = "b021b2b33671c83af544e4d1e443e3db";

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

const cargarPeliculas = async () => {
  try {
    if (pagina === 1) {
      btnAnterior.style.display = "none";
      paginacionBusqueda.style.display = "none";
    } else {
      btnAnterior.style.display = "block";
      paginacionBusqueda.style.display = "none";
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
      console.log(res.data);
      info.innerHTML = `<p>Pagina Nº ${pagina}</p>`;
      contenedor.innerHTML = peliculas;
    } else if (res.request.status === 404) {
      console.log("error 404 nos vemos en otro lugar");
    }
  } catch (error) {
    console.log(error);
  }
};

//Funcion para el BUSCADOR
let queBuscar = input.value.trim();
const clickAnterior = () => {
  if (page > 1) {
    page -= 1;
    obtenerDataBusqueda(queBuscar, page);
  }
};
const clickSiguiente = () => {
  if (page < 500) {
    page += 1;
    obtenerDataBusqueda(queBuscar, page);
    console.log(`el valor de page ahora es ${page}`);
  } else {
    obtenerDataBusqueda(queBuscar, page);
    btnSiguienteSearch.display.style = "none";
  }
};
btnAnteriorSearch.removeEventListener("click", clickAnterior);
btnSiguienteSearch.removeEventListener("click", clickSiguiente);

formBusqueda.addEventListener("submit", (e) => {
  e.preventDefault();
  page = 1;
  // const queBuscar = input.value.trim();
  queBuscar = input.value.trim();
  if (!queBuscar) return;
  obtenerDataBusqueda(queBuscar);
  input.value = "";

  btnAnteriorSearch.addEventListener("click", clickAnterior);
  btnSiguienteSearch.addEventListener("click", clickSiguiente);
});

const obtenerDataBusqueda = async (queBuscar, page = 1) => {
  try {
    if (page === 1) {
      btnAnteriorSearch.style.display = "none";
      paginacionPopular.style.display = "none";
      paginacionBusqueda.style.display = "flex";
    } else {
      btnAnteriorSearch.style.display = "block";
      paginacionPopular.style.display = "none";
      paginacionBusqueda.style.display = "flex";
    }
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=es-MX&query=${queBuscar}&page=${page}&include_adult=false`
    );

    if (response.status == 200) {
      const data = await response.data;
      mostrarDatosBusqueda(data);
      console.log(data);
    } else if (response.status === 404) {
      console.log("Error 404 nos vemos en otro lugar");
    }
  } catch (error) {
    console.error("Error", error);
  }
};

const mostrarDatosBusqueda = (data) => {
  let peliculas = "";
  totalPaginas = data.total_pages;
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
  paginacionPopular.style.display = "none";
  contenedor.innerHTML = peliculas;
  infoSearch.innerHTML = `<p>Pagina ${data.page} de ${totalPaginas}</p>`;
  if (data.page === totalPaginas) {
    btnSiguienteSearch.style.display = "none";
  } else {
    btnSiguienteSearch.style.display = "block";
  }
};
