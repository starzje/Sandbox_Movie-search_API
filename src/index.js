const button = document.getElementById("btn");
const spinner = document.getElementById("spinner");
const inputField = document.getElementById("search");
const ispisRezultata = document.getElementById("results");

button.addEventListener("click", pozoviServer);

// debounce funkcija za ograničavanje poziva servera
const debounce = (fn, delay) => {
  let timeout = null;
  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

// na bilo kakav input pozivamo glavni search app uz debounce funkciju za ograničavanje poziva servera na 1.5sec
inputField.addEventListener("input", debounce(pozoviServer, 1500));

// pozivamo server asnyc funkcijom za pozivanje API-ja
async function pozoviServer(e) {
  // dodajemo spinner za loadanje dok se dohvacaju podaci
  spinner.classList.remove("deactivated");
  // zaustavlja defualt akciju forme
  e.preventDefault();
  let termin = inputField.value;
  let odgovor = await fetch(`https://api.tvmaze.com/search/shows?q=${termin}`);
  odgovor = await odgovor.json();
  spinner.classList.remove("active");
  spinner.classList.add("deactivated");
  // ako nema rezultata, ispisujemo ovaj tekst
  if (odgovor.length === 0) {
    ispisRezultata.innerHTML = `<div class="container"><h4 class="ne-postoji"><i class="fa-solid fa-triangle-exclamation"></i>  ${termin} ne postoji   <i class="fa-solid fa-triangle-exclamation"></i></h4></div>`;
  } else {
    ubaciRezultateUDom(odgovor);
  }
}

// funkcija za ubacivanje rezultata u DOM
function ubaciRezultateUDom(odgovor) {
  let rezultat = `<div class="container">`;
  odgovor.forEach((film) => {
    // ako nema ratinga, ispisujemo ovaj tekst
    let rating = film.show.rating.average;
    if (rating == null) {
      rating = "Ovaj film nije još ocijenjen";
    }
    // ako nema slike, stavljamo placeholder
    let image = film.show.image
      ? film.show.image.medium
      : "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
    rezultat += `<div class="card">
      <div class="card__image">
        <img
              src="${image}"
              class="img"
              alt="..."
            />
    </div>
    <div class="card__content">
      <h2>${film.show.name}</h2>
      <div>
      <p class="summary"><span class="about">About</span>: ${film.show.summary}</p>
      </div>
      <p><span class="rating">Rating</span>: ${rating}<br>
      <span class="rating">Language</span>: ${film.show.language}</p>
    </div>
    </div>
      `;
  });
  rezultat += "</div>";
  ispisRezultata.innerHTML = rezultat;
}
