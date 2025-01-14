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
