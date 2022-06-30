document.getElementById("btn").addEventListener("click", pozoviServer);

function pozoviServer(e) {
  e.preventDefault();
  let termin = e.target.previousElementSibling.value;
  fetch(`https://api.tvmaze.com/search/shows?q=${termin}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        document.getElementById(
          "results"
        ).innerHTML = `<div class="container"><div class="card"><h4 class="ne-postoji"><i class="fa-solid fa-triangle-exclamation"></i>  ${termin} ne postoji   <i class="fa-solid fa-triangle-exclamation"></i></h4></div></div>`;
      } else {
        ubaciRezultateUDom(data, document.getElementById("results"));
        console.log(data);
      }
    });
}

function ubaciRezultateUDom(data, element) {
  let rating = data[0].show.rating.average;
  if (rating == null) {
    rating = "Ovaj film nije još ocijenjen";
  }

  let rezultat = `<div class="container">`;
  data.forEach((film) => {
    if (film.show.image == null) {
      console.log(
        "ne znam zasto moram imati ovaj if da ovo radi s filmom 'tamara' npr"
      );
    } else {
      let image = film.show.image.medium;
      rezultat += ` 

<div class="card">
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
    }
  });
  rezultat += "</div>";
  element.innerHTML = rezultat;
  document.getElementById("search").value = "";
}
