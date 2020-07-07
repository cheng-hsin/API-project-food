const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meal");

// Search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  // Clear single meal
  single_mealEl.innerHTML = "";

  // Get search term
  const term = search.value;

  // Check for empty
  if (term.trim()) {
    fetch(
      `https://edamam-food-and-grocery-database.p.rapidapi.com/parser?ingr=${term}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "edamam-food-and-grocery-database.p.rapidapi.com",
          "x-rapidapi-key":
            "c9e1c08594mshadea57faaf27465p1ef7d5jsn20c3296cfba6",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        console.log("foodId", data.hints[0].food.foodId);
        console.log("text", data.text);
        console.log("nutrient", data.hints[0].food.nutrients);
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!<p>`;
        } else {
          mealsEl.innerHTML = data.hints
            .map(
              (meal) => `
            <div class="meal">
              <img src="${meal.food.image}" alt="${data.text}" />
              <div class="meal-info" data-mealID="${data.text}">
                <h3>${data.text}</h3>
              </div>
            </div>
          `
            )
            .join("");
        }
      });
    // Clear search text
    search.value = "";
  } else {
    alert("Please enter a search term");
  }
}

// Fetch meal by ID
function getMealById(mealID) {
  fetch(
    `https://edamam-food-and-grocery-database.p.rapidapi.com/parser?ingr=${mealID}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "edamam-food-and-grocery-database.p.rapidapi.com",
        "x-rapidapi-key": "c9e1c08594mshadea57faaf27465p1ef7d5jsn20c3296cfba6",
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const meal = data;
      const nutrients = data.hints[0].food.nutrients;
      const measures = data.hints[0].measures;
      console.log("meal", meal);

      addMealToDOM(meal, nutrients);
    });
}

// Fetch random meal from API
// function getRandomMeal() {
//   // Clear meals and heading
//   mealsEl.innerHTML = "";
//   resultHeading.innerHTML = "";

//   fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
//     .then((res) => res.json())
//     .then((data) => {
//       const meal = data.meals[0];

//       addMealToDOM(meal);
//     });
// }

// Add meal to DOM
function addMealToDOM(meal, nutrients) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  meals.innerHTML = "";

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.text}</h1>
      <div class="single-meal-info">
      <p>碳水化合物 ${nutrients.CHOCDF}</p>
      <p>熱量 ${nutrients.ENERC_KCAL}</p>
      <p>脂肪 ${nutrients.FAT}</p>
      <p>膳食纖維 ${nutrients.FIBTG}</p>
      <p>蛋白質 ${nutrients.PROCNT}</p>
  `;
}

// Event listeners
submit.addEventListener("submit", searchMeal);
// random.addEventListener("click", getRandomMeal);

mealsEl.addEventListener("click", (e) => {
  console.log("e.path", e.path);
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});
