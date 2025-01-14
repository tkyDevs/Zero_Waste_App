document.getElementById("ingredientForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const inputValue = document.getElementById("ingredientInput").value;

    if (inputValue) {
        fetch('/addIngredient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ingredient: inputValue })
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

                    document.getElementById("ingredientInput").value = '';
                }
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
});

document.getElementById('btnFetch').addEventListener('click', function (event) {
    event.preventDefault();

    const ingredients = Array.from(document.querySelectorAll('.ingredients .ingredient'))
                             .map(ingredient => ingredient.textContent.trim());

    const url = new URL('/fetchRecipes', window.location.origin);
    url.searchParams.append('ingredients', ingredients.join(','));

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

        data.recipes.forEach(recipe => {
            console.log('asdfbjlfhj;adslhk;asdf:',recipe);
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

            mainDiv.append(image, nameDiv);
    
            const extras = [
                'sourceName', 'sourceUrl', 'title', 'readyInMinutes', 'image',
                'dairyFree', 'glutenFree', 'instructions', 'vegan', 'vegetarian'
            ];
            extras.forEach(extra => {
                const p = document.createElement('p');
                p.classList.add('extra');
                p.textContent = recipe[extra];
                mainDiv.appendChild(p);
            });
    
            locationDiv.appendChild(mainDiv);

            mainDiv.addEventListener('click', function () {
                const location = document.getElementsByClassName('popup')[0];
                location.classList.toggle('invisible');
                location.innerHTML = ''; // Clear previous content

                const h2 = document.createElement('h2');
                h2.textContent = recipe.sourceName;

                const button = document.createElement('button');
                button.id = 'btnClosePopUp';
                button.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
                button.onclick = () => location.classList.toggle('invisible');

                const img = document.createElement('img');
                img.src = recipe.image;
                img.alt = recipe.title;

                const div = document.createElement('div');
                div.classList.add('details');

                const detailKeys = ['sourceName', 'dairyFree', 'glutenFree', 'vegan', 'vegetarian', 'readyInMinutes'];
                detailKeys.forEach(key => {
                    const p = document.createElement('p');
                    p.textContent = `${key.replace(/([A-Z])/g, ' $1')}: ${recipe[key]}`;
                    div.appendChild(p);
                });

                const instructionsLink = document.createElement('a');
                instructionsLink.href = recipe.sourceUrl;
                instructionsLink.textContent = 'Click here for instructions';
                div.appendChild(instructionsLink);

                location.append(h2, button, img, div);
            });
        });
    })
    .catch(error => console.error('Error:', error));
});
