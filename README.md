# 🛍️ AiShopper — Premium AI E-Commerce Platform

Welcome to **AiShopper**! A modern, full-stack E-Commerce web application that leverages AI-inspired features like smart search and recommendations. It includes a beautiful vanilla HTML/CSS/JS frontend and a robust Node.js + MongoDB backend.

---

## ✨ Features

- **Smart Product Search:** NLP-inspired smart search that parses user intent (e.g., "laptops under ₹50000").
- **AI-Driven Recommendations:** Smart trending scores and personalized recommendations.
- **Complete Auth System:** JWT-based user authentication (Login, Register, Logout, Profile Management).
- **Cart & Checkout:** Fully managed Server-Side Cart and Order Processing.
- **Dynamic Product Data:** 100+ realistic products seeded seamlessly from an external JSON provider.
- **Reviews & Ratings:** User-submitted product reviews and automated helpfulness voting.
- **Premium UI/UX:** Built with beautiful aesthetics, smooth micro-animations, and a highly responsive design.

---

## 🏗️ Project Structure

The repository contains both the **Frontend (Static Web)** and the **Backend (Node.js API)** in the same directory:

```text
ai-ecommerce/
├── server/                 # 🟢 The Node.js / Express Backend
│   ├── app.js              # Entry point for the backend server
│   ├── models/             # MongoDB Schemas (Product, User, Order, Review, etc.)
│   ├── routes/             # Express routes mapped to controllers
│   ├── controllers/        # Business logic for auth, products, orders, cart
│   ├── middleware/         # Custom middlewares (auth protection, validators)
│   ├── seed/               # Seed scripts to populate initial product data
│   └── .env                # Server Environment Variables (MongoDB URI, JWT secret, etc.)
├── js/                     # 🟡 Frontend JS Logic
│   └── api.js              # Centralized API client connecting to the Node.js server
├── css/                    # 🔵 Frontend CSS Stylesheets
└── *.html                  # 🔴 Static UI pages (index, cart, checkout, login, etc.)
```

## 🚀 Installation & Running Guide

Follow these step-by-step instructions to get your local environment set up and the AiShopper platform running flawlessly!

### Step 1: Prerequisites
Before you begin, ensure you have the following installed on your machine:
- **[Node.js](https://nodejs.org/en/)** (v14 or higher recommended) - This is required to run the backend server.
- **[MongoDB](https://www.mongodb.com/try/download/community)** - You must have MongoDB running locally on the default port (`27017`), or have a free cloud database URI from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### Step 2: Install Dependencies
The Node.js backend requires several libraries (like Express and Mongoose) to function. Open your terminal, navigate into the `server` folder, and install them:

```bash
# Move into the backend directory
cd server

# Install all required dependencies
npm install
```
*Note: This single command reads the `package.json` file and downloads everything needed. You do not need to install items one by one!*

### Step 3: Configure Environment Variables
In the `server` directory, create a new file named `.env` (or edit the existing one) and add the following configuration. 

```env
MONGO_URI=mongodb://127.0.0.1:27017/aishopper
JWT_SECRET=your_super_secret_key_123
JWT_REFRESH_SECRET=your_super_secret_refresh_key_456
PORT=5001
CLIENT_URL=*
```
*Tip: If you are using MongoDB Atlas, replace the `MONGO_URI` value with your Atlas connection string.*

### Step 4: Populate the Database (First-time only)
Because your database is currently empty, you need to populate it with dummy products, categories, and coupons so the storefront isn't blank. We have provided an automated script for this!

Run the following command while inside the `server` folder:
```bash
npm run seed
```
*Expected Output: You should see messages indicating that it fetched 100 products from DummyJSON and successfully inserted them into MongoDB.*

### Step 5: Start the Server
With the database seeded, it's time to start the backend API server.

To run the server in **Development Mode** (auto-restarts when you edit code):
```bash
npm run dev
```

To run the server in **Production Mode**:
```bash
npm start
```
*You should see a message confirming the server is running on port 5001 and successfully connected to MongoDB.*

### Step 6: View the Website!
The backend is cleverly configured to serve the frontend UI files automatically. 

Open your favorite web browser and navigate to:
👉 **[http://localhost:5001](http://localhost:5001)**

*Congratulations! You should now see the beautiful AiShopper homepage loaded with realistic products!*

---

## 🛠️ Technology Stack & Libraries Used

### 🎨 Frontend
- **Vanilla HTML5, CSS3, JavaScript (ES6+):** Used to ensure lightning-fast load times, zero-dependency overhead, and full control over custom animations and DOM manipulation. No heavy frameworks (like React/Vue) means the app runs efficiently on any device natively.

### ⚙️ Backend (Node.js & Express)
- **[Express.js](https://expressjs.com/):** The core web server framework used for its simplicity, speed, and massive ecosystem of middlewares.
- **[Mongoose](https://mongoosejs.com/):** Object Data Modeling (ODM) library for MongoDB. Used to enforce schemas (e.g., ensuring products have titles/prices), manage relationships between models (Orders, Reviews, Users), and provide an easy querying API.
- **[JSON Web Tokens (JWT)](https://jwt.io/):** Used for stateless, secure user authentication. It allows the server to verify logged-in users without storing session states in memory.
- **[Bcrypt.js](https://www.npmjs.com/package/bcryptjs):** Used to safely hash and salt user passwords before saving them to the database, ensuring that even in a data breach, passwords remain secure.
- **[Dotenv](https://www.npmjs.com/package/dotenv):** Loads environment variables from a `.env` file, keeping sensitive data (like Database URIs and API keys) out of the codebase.

### 🛡️ Security & Performance Libraries
- **[Helmet](https://helmetjs.github.io/):** Secures the Express app by setting various HTTP headers (prevents clickjacking, XSS attacks, etc.).
- **[Express Rate Limit](https://www.npmjs.com/package/express-rate-limit):** Prevents brute-force and DDoS attacks by limiting how many requests a single IP can make to the API in a given timeframe.
- **[Express Mongo Sanitize](https://www.npmjs.com/package/express-mongo-sanitize):** Prevents NoSQL Injection attacks by stripping out forbidden characters (like `$`) from user inputs.
- **[Cors](https://www.npmjs.com/package/cors):** Enables Cross-Origin Resource Sharing, allowing our separate frontend to talk to the backend API securely.
- **[Compression](https://www.npmjs.com/package/compression):** Gzips API responses to significantly reduce payload sizes, leading to faster frontend rendering.

---

## 📦 Dependency Management (requirements.txt)

In the Node.js ecosystem, `package.json` serves the exact same purpose as Python's `requirements.txt`. It keeps track of all libraries and their exact versions. 

To download and install every required dependency at once, simply run:

```bash
npm install
```

*(Note: If you specifically need a `requirements.txt` file for a Python-based deployment or tooling, one has been generated in the root folder for reference, but `npm install` remains the native way to install the stack!)*

---

## 📜 License
This project is open-sourced under the MIT License. Feel free to fork, modify, and use it for your own E-Commerce projects.
