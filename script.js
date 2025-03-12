document.addEventListener("DOMContentLoaded", () => {
  // Selecting necessary DOM elements
  const recipeContainer = document.getElementById("recipeContainer");
  const searchInput = document.querySelector(".form input");
  const searchIcon = document.querySelector(".search-icon-container i");
  const firstSection = document.querySelector(".first-section");

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const overlay = document.createElement("div");
  overlay.className = "menu-overlay";
  document.body.appendChild(overlay);

  // Handles menu toggle click (only for screens smaller than 1024px)
  menuToggle.addEventListener("click", () => {
    if (window.innerWidth < 1024) {
      navMenu.classList.add("active");
      overlay.classList.add("active");
      document.documentElement.classList.add("no-scroll");
      menuToggle.style.display = "none";
    }
  });

  // Function to close the menu
  const closeMenu = () => {
    navMenu.classList.remove("active");
    overlay.classList.remove("active");
    document.documentElement.classList.remove("no-scroll");

    if (window.innerWidth < 1024) {
      menuToggle.style.display = "block";
    }
  };

  // Closes menu when clicking outside or on overlay (only for small screens)
  document.addEventListener("click", (event) => {
    if (
      !navMenu.contains(event.target) &&
      !menuToggle.contains(event.target) &&
      window.innerWidth < 1024
    ) {
      closeMenu();
    }
  });

  // Ensures the menu toggle is visible only on small screens
  const handleMenuVisibility = () => {
    if (window.innerWidth >= 1024) {
      menuToggle.style.display = "none";
      navMenu.classList.remove("active");
      overlay.classList.remove("active");
      document.documentElement.classList.remove("no-scroll");
    } else {
      menuToggle.style.display = "block";
    }
  };

  window.addEventListener("resize", handleMenuVisibility);
  window.addEventListener("load", handleMenuVisibility);

  // Fetches recipes based on user query
  const fetchRecipes = async (query = "") => {
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
  };

  // Displays fetched recipes in the UI
  const displayRecipes = async (meals) => {
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
  };

  // Handles click event on recipe cards to open full recipe details
  const handleRecipeClick = (event) => {
    if (event.target.classList.contains("view-recipe")) {
      const mealId = event.target.getAttribute("data-id");
      window.open(`https://www.themealdb.com/meal/${mealId}`, "_blank");
    }
  };

  // Scrolls smoothly to the recipes section after search
  const scrollToRecipes = () => {
    firstSection.scrollIntoView({behavior: "smooth"});
  };

  // Handles search query input
  const handleSearch = () => {
    fetchRecipes(searchInput.value.trim());
  };

  searchIcon.addEventListener("click", handleSearch);

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  });

  recipeContainer.addEventListener("click", handleRecipeClick);

  // Initial fetch of recipes on page load
  fetchRecipes();
});
