document.addEventListener("DOMContentLoaded", () => {
  const recipeContainer = document.getElementById("recipeContainer");
  const searchInput = document.querySelector(".form input");
  const searchIcon = document.querySelector(".search-icon-container i");
  const firstSection = document.querySelector(".first-section");

  async function fetchRecipes(query = "") {
    try {
      const url = query
        ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
        : "https://www.themealdb.com/api/json/v1/1/search.php?f=a";
      const response = await fetch(url);
      const data = await response.json();

      if (data.meals) {
        displayRecipes(data.meals);
        scrollToRecipes();
      } else {
        recipeContainer.innerHTML =
          "<p>No recipes found. Try a different search!</p>";
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      recipeContainer.innerHTML =
        "<p>Failed to load recipes. Please try again later.</p>";
    }
  }

  function displayRecipes(meals) {
    recipeContainer.innerHTML = "";
    meals.forEach((meal) => {
      const recipeCard = document.createElement("div");
      recipeCard.classList.add("recipe-card");
      recipeCard.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <h3>${meal.strMeal}</h3>
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Origin:</strong> ${meal.strArea}</p>
        <button class="view-recipe" data-id="${meal.idMeal}">View Recipe</button>
      `;
      recipeContainer.appendChild(recipeCard);
    });
  }

  function handleRecipeClick(event) {
    if (event.target.classList.contains("view-recipe")) {
      const mealId = event.target.getAttribute("data-id");
      window.open(`https://www.themealdb.com/meal/${mealId}`, "_blank");
    }
  }

  function scrollToRecipes() {
    firstSection.scrollIntoView({behavior: "smooth"});
  }

  searchIcon.addEventListener("click", () => {
    fetchRecipes(searchInput.value.trim());
  });

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      fetchRecipes(searchInput.value.trim());
    }
  });

  recipeContainer.addEventListener("click", handleRecipeClick);

  fetchRecipes();
});
