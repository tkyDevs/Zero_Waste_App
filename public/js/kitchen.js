document.getElementById("ingredientForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const inputValue = document.getElementById("ingredientInput").value;

    if (inputValue) {
        // Send data via fetch to the server
        fetch('/addIngredient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ingredient: inputValue })  // Send the ingredient in JSON format
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const ingredientsList = data.ingredientsList;
                const ingredientsContainer = document.querySelector('.ingredients');
                ingredientsContainer.innerHTML = '';
                if (ingredientsList && ingredientsList.length > 0) {
                        ingredientsList.forEach(element => {
                        const newIngredient = document.createElement('p');
                        newIngredient.classList.add('ingredient');
                        newIngredient.textContent = element;
                        ingredientsContainer.appendChild(newIngredient);
                    });

                    document.getElementById("ingredientInput").value = '';  // Clear the input field
                }
            } else {
                alert("Error: " + data.message);  // Show alert if there's an error
            }
        })
        .catch(error => console.error('Error:', error));
    }
});

document.getElementById('btnFetch').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default form submission

    // Collect all ingredients from the div.ingredients
    const ingredients = Array.from(document.querySelectorAll('.ingredients .ingredient'))
                             .map(ingredient => ingredient.textContent.trim());

    // Prepare the URL with ingredients as query parameters
    const url = new URL('/fetchRecipes', window.location.origin);
    url.searchParams.append('ingredients', ingredients.join(',')); // Join the ingredients array into a comma-separated string

    // Use fetch to send the data to the server
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const locationDiv = document.getElementsByClassName('recipes')[0];
        locationDiv.innerHTML = '';
        console.log('Recipes: ', data.recipes);

        // Handle the response, update the UI with recipes
        data.recipes.forEach(recipe => {
            const mainDiv = document.createElement('div');
            mainDiv.classList.add('recipe');
    
            const image = document.createElement('img');
            image.src = recipe.image;
            image.alt = recipe.title;
    
            const nameDiv = document.createElement('div');
            nameDiv.classList.add('description');
            const name = document.createElement('p');
            name.classList.add('name');
            name.textContent = recipe.title;
            nameDiv.appendChild(name);
    
            const p1 = document.createElement('p')
            const p2 = document.createElement('p')
            const p3 = document.createElement('p')
            const p4 = document.createElement('p')
            const p5 = document.createElement('p')
            const p6 = document.createElement('p')
            const p7 = document.createElement('p')
            const p8 = document.createElement('p')
            const p9 = document.createElement('p')
            const p10 = document.createElement('p')
            p1.classList.add('extra');
            p2.classList.add('extra');
            p3.classList.add('extra');
            p4.classList.add('extra');
            p5.classList.add('extra');
            p6.classList.add('extra');
            p7.classList.add('extra');
            p8.classList.add('extra');
            p9.classList.add('extra');
            p10.classList.add('extra');
            p1.textContent = recipe.sourceName;
            p2.textContent = recipe.sourceUrl;
            p3.textContent = 'Missing ingredients - v2?';
            p4.textContent = recipe.readyInMinutes;
            p5.textContent = recipe.sourceUrl;
            p6.textContent = recipe.dairyFree;
            p7.textContent = recipe.glutenFree;
            p8.textContent = recipe.instructions;
            p9.textContent = recipe.vegan;
            p10.textContent = recipe.vegetarian;

    
            mainDiv.append(image, nameDiv, )
            locationDiv.appendChild(mainDiv);
        })
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
