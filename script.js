document.addEventListener("DOMContentLoaded", () => {
  const recipeContainer = document.getElementById("recipeContainer");
  const searchInput = document.querySelector(".form input");
  const searchIcon = document.querySelector(".search-icon-container i");
  const firstSection = document.querySelector(".first-section");

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const overlay = document.createElement("div"); // Create overlay dynamically

  overlay.className = "menu-overlay";
  document.body.appendChild(overlay); // Add overlay to the body

  menuToggle.addEventListener("click", () => {
    navMenu.classList.add("active");
    overlay.classList.add("active");
    document.documentElement.classList.add("no-scroll");
    menuToggle.style.display = "none"; // Hide menu icon when menu opens
  });

  // Function to close menu
  function closeMenu() {
    navMenu.classList.remove("active");
    overlay.classList.remove("active");
    document.documentElement.classList.remove("no-scroll");
    menuToggle.style.display = "block"; // Show menu icon again
  }

  // Close menu when clicking outside the menu or on the overlay
  document.addEventListener("click", (event) => {
    if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMenu();
    }
  });

  async function fetchRecipes(query = "") {
    try {
      let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
      let response = await fetch(url);
      let data = await response.json();

      if (!data.meals) {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`;
        response = await fetch(url);
        data = await response.json();
      }

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
    meals.forEach(async (meal) => {
      const recipeCard = document.createElement("div");
      recipeCard.classList.add("recipe-card");

      let mealDetails = meal;
      if (!meal.strMeal) {
        const mealResponse = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
        );
        const mealData = await mealResponse.json();
        mealDetails = mealData.meals[0];
      }

      recipeCard.innerHTML = `
        <img src="${mealDetails.strMealThumb}" alt="${mealDetails.strMeal}" />
        <h3 style="font-family: Manrope, sans-serif;">${
          mealDetails.strMeal
        }</h3>
        <p style="font-family: Inter, sans-serif;"><strong>Category:</strong> ${
          mealDetails.strCategory || "Unknown"
        }</p>
        <p style="font-family: Inter, sans-serif;"><strong>Origin:</strong> ${
          mealDetails.strArea || "Unknown"
        }</p>
        <button class="view-recipe" data-id="${
          mealDetails.idMeal
        }">View Recipe</button>
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

  function handleSearch() {
    fetchRecipes(searchInput.value.trim());
  }

  searchIcon.addEventListener("click", handleSearch);

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  });

  recipeContainer.addEventListener("click", handleRecipeClick);

  fetchRecipes();
});
