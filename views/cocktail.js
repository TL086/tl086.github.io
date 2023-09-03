export function cocktail(root) {
  root.innerHTML = `<div class="header-container">
    <div class="header-text">
      <div class="header-title">Ava to the rescue</div>
    </div>
    <img id="ava-teeth" src="/assets/imgs/ava-teeth.png" alt="Ava with a weird smile"/>
  </div>
      <div class="content-container" id="content-container-dropdown">
        <label for="ingredient-selector">Ingredients:</label>
        <select id="ingredient-selector">
          <option value="any">Any</option>
          <option value="Tequila">Tequila</option>
          <option value="Gin">Gin</option>
          <option value="Vodka">Vodka</option>
          <option value="Rum">Rum</option>
        </select>
          <div class="child-container">
            <button type="button" id="submit-button">Submit</button>
          </div>
      </div>`;

  const container = document.getElementById("content-container-dropdown");
  const submitIngredient = document.getElementById("submit-button");
  const ingredient = document.getElementById("ingredient-selector");
  submitIngredient.addEventListener("click", () => {
    container.innerHTML = "";
    fetchAndRenderCocktail(container, ingredient.value);
  });
}

async function fetchAndRenderCocktail(cocktailpage, ingredient) {
  let url = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
  let id;

  if (ingredient !== "any") {
    fetch(
      "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + ingredient
    )
      .then((response) => response.json())
      .then((data) => {
        let list = data.drinks;

        let cocktail = list[Math.floor(Math.random() * list.length)];

        id = cocktail.idDrink;

        url = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + id;

        subfetch(url, cocktailpage, ingredient);
      })
      .catch((error) => console.error("Error cocktail ID:", error));
  } else {
    // If ingredient is "any", continue with the original URL

    subfetch(url, cocktailpage, ingredient);
  }
}

function subfetch(url, cocktailpage, ingredient) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const cocktail = data.drinks[0];
      // Rest of the code..

      // Update HTML elements with fetched data
      const cocktailName = document.createElement("cocktail-name");
      cocktailName.textContent = cocktail.strDrink;

      const cocktailImage = document.createDocumentFragment();
      const cocktailImage1 = cocktailImage
        .appendChild(document.createElement("cocktail-image"))
        .appendChild(document.createElement("img"));
      cocktailImage1.src = cocktail.strDrinkThumb;

      const cocktailIngredientsList = document.createElement(
        "cocktail-ingredients"
      );
      for (let i = 1; i <= 15; i++) {
        const ingredientKey = `strIngredient` + i;
        const measureKey = `strMeasure` + i;

        const ingredient = cocktail[ingredientKey];
        const measure = cocktail[measureKey];

        if (ingredient && measure) {
          const listItem = document.createElement("li");
          listItem.textContent = `${measure} ${ingredient}`;
          cocktailIngredientsList.appendChild(listItem);
        }
      }

      const cocktailInstructions = document.createElement(
        "cocktail-instructions"
      );
      cocktailInstructions.textContent = cocktail.strInstructions;

      cocktailpage.appendChild(cocktailName);
      cocktailpage.appendChild(cocktailImage);
      cocktailpage.appendChild(cocktailIngredientsList);
      cocktailpage.appendChild(cocktailInstructions);

      const buttonsContainer = document.createElement("div");
      buttonsContainer.classList.add("buttons-container");

      const backButton = document.createElement("button");
      backButton.id = "back-button-cocktail";
      backButton.textContent = "Back";

      const anotherCocktailButton = document.createElement("button");
      anotherCocktailButton.id = "another-cocktail-button";
      anotherCocktailButton.textContent = "Give me another cocktail";
      anotherCocktailButton.style.width = "220px";
      anotherCocktailButton.style.height = "60px";
      anotherCocktailButton.style.padding = "10px 15px";
      anotherCocktailButton.style.fontSize = "1rem";
      anotherCocktailButton.style.lineHeight = "1em";
      anotherCocktailButton.style.textAlign = "center";
      anotherCocktailButton.style.display = "flex";
      anotherCocktailButton.style.alignItems = "center";

      buttonsContainer.appendChild(backButton);
      buttonsContainer.appendChild(anotherCocktailButton);
      cocktailpage.appendChild(buttonsContainer);

      backButton.addEventListener("click", () => {
        window.location.hash = "#/";
      });

      anotherCocktailButton.addEventListener("click", () => {
        cocktailpage.innerHTML = "";
        fetchAndRenderCocktail(cocktailpage, ingredient);
      });
    })
    .catch((error) => console.error("Error fetching cocktail data:", error));
}
