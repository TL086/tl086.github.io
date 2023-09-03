import { about } from "./views/about.js";
import { joke } from "./views/joke.js";
import { cocktail } from "./views/cocktail.js";
import { song } from "./views/song.js";

const routes = [
  { url: "#/", page: home },
  { url: "#/joke", page: joke },
  { url: "#/cocktail", page: cocktail },
  { url: "#/song", page: song },
  { url: "#/about", page: about },
];

function getRoute(url) {
  return routes.find((element) => element.url === url);
}

function renderCurrentPage() {
  const currentHash = location.hash;
  const route = getRoute(currentHash);
  if (!route) {
    goTo("#/");
    return;
  }
  render(route.page);
}

function render(page) {
  const root = document.getElementById("page");
  root.innerHTML = "";
  page(root);
}

function goTo(url) {
  window.history.pushState({}, "", url);
  renderCurrentPage();
}

function home(root) {
  root.innerHTML = `
    <div class="header-container">
      <div class="header-text">
        <div class="header-title">Ava to the rescue</div>
        <div class="header-subtitle">Being socially awkward at a party?
          <br>Get help from Ava.</div>
      </div>
      <img id="header-img" src="/assets/imgs/ava.png" alt="Portrait of Ava from the movie Ex-Machina"/>
    </div>
    <div class="content-container">
      <div class="child-container">
        <button type="button" id="cocktail-button">Give me a cocktail recipe</button>
        <button type="button" id="joke-button">Give me a <br>funny joke</button>
        <button type="button" id="song-button">Give me a <br>cool song</button>
      </div>
    </div>
    <div class="about">
      <button type="button" id="about">About</button>
    </div>
    `;

  const about = document.getElementById("about");
  const joke = document.getElementById("joke-button");
  const cocktail = document.getElementById("cocktail-button");
  const song = document.getElementById("song-button");

  buttonClickEvent(about, "#/about");
  buttonClickEvent(joke, "#/joke");
  buttonClickEvent(cocktail, "#/cocktail");
  buttonClickEvent(song, "#/song");
}

function buttonClickEvent(input, str) {
  input.addEventListener("click", (event) => {
    goTo(str);
    event.preventDefault();
  });
}

renderCurrentPage();
window.addEventListener("hashchange", renderCurrentPage);
