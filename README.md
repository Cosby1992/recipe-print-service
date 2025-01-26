# Recipe Print Service

Recipe Print Service is an application that extracts and transforms recipe information from a provided URL into structured JSON data.

## Features

- **Recipe Extraction**: Parses recipe details, including ingredients, preparation steps, and metadata, from a given URL.
- **Scaling Support**: Dynamically adjusts recipes to target portion sizes.

## How to run

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Cosby1992/recipe-print-service
   ```

2. **Navigate to the Directory**:
   ```bash
   cd recipe-print-service
   ```

3. **Install Dependencies**:
   Ensure Node.js v22+ is installed, then run:
   ```bash
   npm install
   ```

4. **Set Up Environment Variables**:
   Create a `.env` file with the following:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

5. **Run in Development Mode**:
   ```bash
   npm run start:dev
   ```

6. **Build for Production**:
   ```bash
   npm run build
   ```

7. **Run in Production Mode**:
   ```bash
   npm run start:prod
   ```

### API Usage

#### Extract Recipe Data

**Endpoint**: `POST /recipe/extract-from-url`

- **Request Body**:
  ```json
  {
    "url": "https://example.com/recipe",
    "targetPortions": 4
  }
  ```

- **Response**:
  ```json
  {
    "recipes": [
      {
        "date": "Recipe date",
        "origin": {
          "website": "https://example.com/recipe",
          "domain": "example.com"
        },
        "title": "Recipe Title",
        "image": {
          "url": "https://example.com/images/recipe.jpg",
          "alt": "Alt text for the image"
        };
        "details": {
          "portion_count": 4,
          "cooking_time": "30 minutes",
          "preperation_time": "15 minutes",
          "calories_per_portion": 200
        },
        "preparation": {
          "steps": [
            { "index": 1, "text": "Mix all dry ingredients." },
            { "index": 2, "text": "Add wet ingredients and stir." }
          ]
        },
        "ingredients": [
          { "amount": 1, "unit": "cup", "name": "flour" },
          { "amount": 2, "unit": "tbsp", "name": "sugar" }
        ]
      }
    ]
  }
  ```
  
## License

This project is licensed under the MIT License. See the [LICENCE](LICENSE) file for details.