# Blog API with Node.js and Express.js

This project implements a Blog Application RESTful API using Node.js and Express.js. It includes features for CRUD operations on blog posts and uses API keys for authentication. The application incorporates error handling and input validation.

## Getting Started

### Prerequisites

- Node.js version 18 or later
- npm or yarn package manager
- Setup config folder

`config/development.json`

```json
{
  "PORT": 3000,
  "NODE_ENV": "development",
  "API_KEY": "<SECRET_KEY>",
  "DEBUG": true
}
```

`config/production.json`

```json
{
  "PORT": 80,
  "NODE_ENV": "production",
  "API_KEY": "<SECRET_KEY>",
  "DEBUG": false
}
```

### Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/jayantc20/Blog-API.git
   cd Blog-API
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the server:**

   ```bash
   npm run start:dev
   ```

4. **Run the test cases:**

   ```bash
   npm run test
   ```

5. **Run load tests::**

To perform load testing on the API, use the loadtest.js script. Ensure the server is running before executing the load test.

    ```bash
    npm run loadtest
    ```

## API Endpoints

| Endpoint          | Method | Description                                   |
| ----------------- | ------ | --------------------------------------------- |
| /api/v1/posts     | GET    | List all blog posts with optional pagination. |
| /api/v1/posts     | POST   | Create a new blog post.                       |
| /api/v1/posts/:id | GET    | Retrieve a blog post by ID.                   |
| /api/v1/posts/:id | PUT    | Update a blog post by ID.                     |
| /api/v1/posts/:id | DELETE | Delete a blog post by ID.                     |

## Authentication

This API uses API keys for authentication. You need to include an x-api-key header with your API requests.

## Optional Extensions

- **Pagination Improvements:** Implement offset-based pagination for better performance with large datasets.

- **Search Query:** Future enhancement to support complex queries and filters, such as searching by multiple fields or applying fuzzy matching.

## Postman Collection

You can import and test the APIs using the [Postman Collection](https://github.com/jayantc20/Blog-API/blob/main/Blog-API.postman_collection.json).

### Importing the Collection in Postman

1. Download the Postman Collection File.
2. Open Postman.
3. Click on "Import" at the top-left corner.
4. Choose the downloaded collection file.
5. The collection should now be available in your Postman workspace.

## Contributing

If you would like to contribute to the project, please follow the [Contributing Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).
