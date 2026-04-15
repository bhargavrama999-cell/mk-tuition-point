# MK Tuition Point - API Testing Guide (Postman)

This guide provides the details for testing the backend API deployed on Vercel.

**Base URL:** `https://mk-tuition-point.vercel.app/api`

---

## 1. Authentication
Most routes require a Bearer Token. First, login to get the token.

### Login
- **URL:** `{{BASE_URL}}/auth/login`
- **Method:** `POST`
- **Body (JSON):**
  ```json
  {
    "email": "admin@example.com",
    "password": "yourpassword"
  }
  ```
- **Action:** Copy the `token` from the response. In Postman, go to the **Auth** tab of other requests, select **Bearer Token**, and paste it there.

### Register
- **URL:** `{{BASE_URL}}/auth/register`
- **Method:** `POST`
- **Body (JSON):**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

---

## 2. Assessments
### Get All Assessments
- **URL:** `{{BASE_URL}}/assessments`
- **Method:** `GET` (Protected)

### Create Assessment
- **URL:** `{{BASE_URL}}/assessments`
- **Method:** `POST` (Admin)
- **Body (JSON):**
  ```json
  {
    "title": "Math Quiz",
    "description": "Basic Algebra",
    "duration": 30,
    "category": "CATEGORY_ID",
    "active": true
  }
  ```

---

## 3. Students & Categories
### Create Category
- **URL:** `{{BASE_URL}}/students/categories`
- **Method:** `POST` (Admin)

### Upload Students via CSV
- **URL:** `{{BASE_URL}}/students/upload-csv`
- **Method:** `POST` (Admin)
- **Body (form-data):** 
  - Key: `file`, Type: `File`, Value: `(your_students.csv)`

---

## 4. Courses
### Add Course
- **URL:** `{{BASE_URL}}/courses`
- **Method:** `POST` (Admin)
- **Body (form-data):**
  - `title`: Intro to Science
  - `description`: Science basics
  - `category`: CATEGORY_ID
  - `pdf`: (Upload PDF file)

---

## 5. Carousel
### Get Carousels
- **URL:** `{{BASE_URL}}/carousel`
- **Method:** `GET` (Public)

### Add Carousel Item
- **URL:** `{{BASE_URL}}/carousel`
- **Method:** `POST` (Admin)
- **Body (form-data):**
  - `title`: Welcome Banner
  - `image`: (Upload Image file)

---

## 6. Queries & Results
### Submit Assessment Result
- **URL:** `{{BASE_URL}}/results`
- **Method:** `POST` (Protected)

### Submit Student Query
- **URL:** `{{BASE_URL}}/queries`
- **Method:** `POST` (Protected)

---

> [!NOTE]
> **Environment Variables Error:** If you see "injected env (0)", make sure your `.env` file is in the correct directory where you are running the command. For Vercel, manual `.env` files are ignored; you must add them in the **Vercel Dashboard > Settings > Environment Variables**.
