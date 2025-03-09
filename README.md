# Students Hub Backend

This project is a backend application for managing student records using MongoDB. It is built with Node.js and Express, and it utilizes Mongoose for interacting with the MongoDB database.

## Project Structure

```
studentshub-backend
├── src
│   ├── controllers
│   │   └── studentController.js
│   ├── models
│   │   └── studentModel.js
│   ├── routes
│   │   └── studentRoutes.js
│   └── server.js
├── package.json
├── .env
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd studentshub-backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your MongoDB connection string:
   ```
   MONGODB_URI=<your_mongodb_connection_string>
   ```

## Usage

1. Start the server:
   ```
   npm start
   ```

2. The server will run on `http://localhost:5000`.

## API Endpoints

- **Create Student**: `POST /students`
- **Get All Students**: `GET /students`
- **Get Student by Admission Number**: `GET /students/:admission_no`
- **Update Student**: `PUT /students/:admission_no`
- **Delete Student**: `DELETE /students/:admission_no`

## Dependencies

- **Express**: Web framework for Node.js
- **Mongoose**: MongoDB object modeling tool
- **dotenv**: Module to load environment variables from a `.env` file

## License

This project is licensed under the MIT License.