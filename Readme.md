
---

```markdown
Jobs API
A RESTful API for managing job postings, including user authentication and job operations.

Table of Contents
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Models](#models)
- [Error Handling](#error-handling)
- [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sajjad6ansari/Jobs-API.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Jobs-API
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_LIFETIME=token_lifetime
```

Replace `your_mongodb_connection_string`, `your_jwt_secret_key`, and `token_lifetime` with your actual MongoDB URI, desired JWT secret, and token lifetime (e.g., '30d').

## Usage

Start the server:

```bash
npm start
```

The API will be accessible at `http://localhost:3000`.

## API Endpoints

### Authentication

- **Register User**
  - **Endpoint:** `/api/v1/auth/register`
  - **Method:** `POST`
  - **Description:** Registers a new user.
  - **Request Body:**
    ```json
    {
      "name": "User Name",
      "email": "user@example.com",
      "password": "password123"
    }
    ```

- **Login User**
  - **Endpoint:** `/api/v1/auth/login`
  - **Method:** `POST`
  - **Description:** Logs in an existing user.
  - **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```

### Jobs

- **Get All Jobs**
  - **Endpoint:** `/api/v1/jobs`
  - **Method:** `GET`
  - **Description:** Retrieves all jobs for the authenticated user.

- **Create Job**
  - **Endpoint:** `/api/v1/jobs`
  - **Method:** `POST`
  - **Description:** Creates a new job.
  - **Request Body:**
    ```json
    {
      "company": "Company Name",
      "position": "Job Position",
      "status": "Job Status"
    }
    ```

- **Update Job**
  - **Endpoint:** `/api/v1/jobs/:id`
  - **Method:** `PATCH`
  - **Description:** Updates an existing job.
  - **Request Body:**
    ```json
    {
      "company": "Updated Company Name",
      "position": "Updated Job Position",
      "status": "Updated Job Status"
    }
    ```

- **Delete Job**
  - **Endpoint:** `/api/v1/jobs/:id`
  - **Method:** `DELETE`
  - **Description:** Deletes a job.

## Models

### User Model

- **Fields:**
  - `name`: String, required
  - `email`: String, required, unique, validated with regex
  - `password`: String, required, hashed using bcryptjs

### Job Model

- **Fields:**
  - `company`: String, required
  - `position`: String, required
  - `status`: String, default: 'pending'
  - `createdBy`: ObjectId, references User, required

## Error Handling

The application uses custom error classes to handle various errors:

- `BadRequestError`: Thrown when required fields are missing or invalid.
- `UnauthenticatedError`: Thrown when authentication fails.
- `NotFoundError`: Thrown when a resource is not found.

```
