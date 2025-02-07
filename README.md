# Zero Waste App

Zero Waste App is a web-based application designed to help users minimize food waste by suggesting recipes based on available ingredients. Users can log in, manage their ingredient lists, and fetch recipe suggestions using the Spoonacular API.

## Features

- **User Authentication**: Secure user login and registration.
- **Ingredient Management**: Users can add and remove ingredients from their virtual fridge.
- **Recipe Fetching**: Fetches recipe suggestions based on the user's available ingredients.
- **Recipe Details**: Provides information such as preparation time, dietary considerations, and external links to full recipes.
- **Interactive UI**: Built with EJS templating and styled with CSS for a smooth user experience.
- **Flash Messaging**: Displays notifications using connect-flash.

## Tech Stack

### Frontend

- **HTML, CSS, JavaScript**: Used for structuring and styling the user interface.
- **EJS (Embedded JavaScript Templates)**: Handles dynamic HTML rendering.
- **Ionicons**: Provides UI icons.

### Backend

- **Node.js & Express.js**: Handles server-side logic and routing.
- **MongoDB & Mongoose**: Stores user data, including credentials and ingredient lists.
- **Axios**: Fetches recipe data from the Spoonacular API.
- **bcrypt**: Hashes and secures user passwords.
- **dotenv**: Manages environment variables securely.
- **connect-flash & express-session**: Implements session-based flash messages for user feedback.

## API Integration

The app uses the [Spoonacular API](https://spoonacular.com/food-api) to fetch recipe suggestions based on the user's ingredient list.

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js
- MongoDB

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/zero-waste-app.git
   cd zero-waste-app
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up the `.env` file:
   ```sh
   SPOONACULAR_API_KEY=your_api_key_here
   SESSION_SECRET=your_secret_key_here
   ```
4. Start MongoDB:
   ```sh
   mongod
   ```
5. Run the app:
   ```sh
   npm start
   ```
6. Open `http://localhost:3000` in your browser.

## Usage

1. Register or log in to access the app.
2. Add ingredients you have in your kitchen.
3. Click "Fetch Recipes" to receive meal suggestions.
4. Click on a recipe for more details and instructions.

## Future Enhancements

- Allow users to save favorite recipes.
- Implement ingredient removal functionality.
- Improve UI with animations and better design.
- Add nutrition facts to recipes.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add new feature"`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

## License

This project is licensed under the MIT License.

