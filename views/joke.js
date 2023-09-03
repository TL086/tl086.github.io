export async function joke(root) {
  renderjokepage(root);

  clearErrorMessage();

  const randomJokeCheckbox = document.getElementById("random-joke");
  const dependentCheckboxes = document.querySelectorAll(".dependent-checkbox");
  randomJokeCheckbox.checked = true;
  const blacklistCheckboxes = document.querySelectorAll(".black-checkbox");
  const resetB = document.getElementById("reset-button");
  const submitB = document.getElementById("submit-button");

  let apiUrl = "https://v2.jokeapi.dev/joke/Any";

  randomJokeCheckbox.addEventListener("change", function () {
    clearErrorMessage();

    updateApiUrlString(
      apiUrl,
      randomJokeCheckbox,
      dependentCheckboxes,
      blacklistCheckboxes
    );

    dependentCheckboxes.forEach((checkbox) => {
      checkbox.disabled = randomJokeCheckbox.checked;

      if (!randomJokeCheckbox.checked) {
        checkbox.checked = false;
        checkbox.removeAttribute("disabled");
      }
    });
  });

  dependentCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateApiUrlString);
  });

  blacklistCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateApiUrlString);
  });

  resetB.addEventListener("click", async () => {
    location.reload();
  });

  submitB.addEventListener("click", async () => {
    const selectedCheckboxes = Array.from(dependentCheckboxes).filter(
      (checkbox) => checkbox.checked
    );

    if (selectedCheckboxes.length === 0 && !randomJokeCheckbox.checked) {
      const errorMessageElement = document.getElementById("error-message");
      errorMessageElement.textContent = "Please select at least one category!";
      return; // Exit the function without making the API call
    }

    providejoke(root, apiUrl);
  });

  function updateApiUrlString() {
    clearErrorMessage();

    const selectedCatCheckboxes = Array.from(dependentCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    const selectedBlackCheckboxes = Array.from(blacklistCheckboxes)
      .filter((checkbox1) => checkbox1.checked)
      .map((checkbox1) => checkbox1.value);

    if (randomJokeCheckbox.checked) {
      apiUrl =
        "https://v2.jokeapi.dev/joke/Any" +
        "?blacklistFlags=" +
        selectedBlackCheckboxes.join(",");
    } else {
      apiUrl =
        "https://v2.jokeapi.dev/joke/" +
        selectedCatCheckboxes.join(",") +
        "?blacklistFlags=" +
        selectedBlackCheckboxes.join(",");
    }
  }
}

async function providejoke(root, apiUrl) {
  try {
    const response = await fetch(apiUrl); // Replace with the actual API URL
    const joke = await response.json();
    //const jokeContainer = document.getElementById("joke-container");
    const jokeElement = document.createElement("div");
    const jokePageContainer = document.getElementById("joke-page-container");
    const jokeButtonContainer = document.createElement("div");
    jokeButtonContainer.id = "joke-buttons-refresh";
    jokeButtonContainer.className = "child-container";
    const backJokeButton = document.createElement("button");
    backJokeButton.innerText = "Back";
    backJokeButton.id = "back-joke-button";
    const refreshJokeButton = document.createElement("button");
    refreshJokeButton.innerText = "Refresh Joke";
    refreshJokeButton.id = "refresh-joke-button";

    if (joke.type === "single") {
      jokeElement.innerText = joke.joke;
    } else if (joke.type === "twopart") {
      jokeElement.innerHTML = `<h2> ${joke.setup} </h2>
              <h2>${joke.delivery}</h2>`;
    }

    jokePageContainer.innerHTML = "";
    //jokeContainer.innerHTML = "";
    jokePageContainer.appendChild(jokeElement);
    jokePageContainer.appendChild(jokeButtonContainer);
    jokeButtonContainer.appendChild(backJokeButton);
    jokeButtonContainer.appendChild(refreshJokeButton);

    backJokeButton.addEventListener("click", async () => {
      location.reload();
    });

    refreshJokeButton.addEventListener("click", async () => {
      providejoke(root, apiUrl);
    });
  } catch (error) {
    console.error("Error fetching jokes:", error);
  }
}

function renderjokepage(root) {
  root.innerHTML = `
  <div class="header-container">
  <div class="header-text">
    <div class="header-title">Ava to the rescue</div>
    <div class="header-subtitle">
    </div>
  </div>
  <img id="header-img" src="/assets/imgs/ava.png" alt="Portrait of Ava from the movie Ex-Machina"/>
</div>
    
    <div class="content-container" id="joke-page-container">
      <div class="joke-form">
        <label id="label-title">Select category:</label>
        <span class="tick-box" id="cat-select-multi">
          <input type="checkbox" id="random-joke" value="Any">
          <label for="random-joke">Random</label>
          <input type="checkbox" id="cat-1" value="Programming" class="dependent-checkbox" disabled>
          <label for="cat-1">Programming</label>
          <input type="checkbox" id="cat-2" value="Miscellaneous" class="dependent-checkbox" disabled>
          <label for="cat-2">Misc</label>
          <input type="checkbox" id="cat-3" value="Dark" class="dependent-checkbox" disabled>
          <label for="cat-3">Dark</label>
          <input type="checkbox" id="cat-4" value="Pun" class="dependent-checkbox" disabled>
          <label for="cat-4">Pun</label>
          <input type="checkbox" id="cat-5" value="Spooky" class="dependent-checkbox" disabled>
          <label for="cat-5">Spooky</label>
          <input type="checkbox" id="cat-6" value="Christmas" class="dependent-checkbox" disabled>
          <label for="cat-6">Christmas</label>
          <div id="error-message" style="color: red;">
          </div>
        </span>

        <label for="blacklistJoke" id="label-title">Select blacklist:</label>
        <span class="tick-box" id="blacklist-select-multi">
          <input type="checkbox" id="black-1" class="black-checkbox" value="nsfw">
          <label for="black-1">NSFW</label>
          <input type="checkbox" id="black-2" class="black-checkbox" value="religious">
          <label for="black-2">Religious</label>
          <input type="checkbox" id="black-3" class="black-checkbox" value="political">
          <label for="black-3">Political</label>
          <input type="checkbox" id="black-4" class="black-checkbox" value="racist">
          <label for="cablackt-4">Racist</label>
          <input type="checkbox" id="black-5" class="black-checkbox" value="sexist">
          <label for="black-5">Sexist</label>
          <input type="checkbox" id="black-6" class="black-checkbox" value="explicit">
          <label for="black-6">Explicit</label>
        </span>
      </div>

      <div class="child-container" id="joke-buttons">
        <button type="button" id="reset-button">Reset</button>
        <button type="button" id="submit-button">Submit</button>
        <button type="button" id="back-joke-button">Back</button>
      </div>
      
    </div>
      `;
}

function clearErrorMessage() {
  const errorMessageElement = document.getElementById("error-message");
  errorMessageElement.textContent = "";

  document.addEventListener("click", (event) => {
    if (event.target.id === "back-joke-button") {
      window.location.hash = "#/";
    }
  });
}
