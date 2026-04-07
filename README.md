# Zeerostock Inventory Search & Management System

A professional-grade inventory search and supplier management system built for the Zeerostock developer assignment. This submission fulfills both **Part A (Search-Focused)** and **Part B (Database-Focused)** requirements.

## 🚀 Tech Stack
- **Frontend**: Vanilla HTML5, CSS3 (Glassmorphism), JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: SQLite (Zero-setup required)
- **Styling**: Modern dark mode with premium aesthetics and responsive design.

## ✨ Features
1. **Inventory Search (Part A)**:
   - Case-insensitive search by product name.
   - Category-based filtering.
   - Dynamic price range filtering (Min/Max).
   - "No results found" state handling.
2. **Database Management (Part B)**:
   - Relational schema with Suppliers and Inventory.
   - APIs for creating/fetching data.
   - Grouped insight query calculated on the fly.

## 🔍 Search Logic Explanation (Part A)
The search functionality is implemented as a dynamic SQL builder in the backend:
- **Product Name**: Uses `LIKE %query%` for partial, case-insensitive matches.
- **Category & Price**: Uses exact matches for categories and numerical comparisons (`>=`, `<=`) for prices.
- **Case-Insensitivity**: Handled natively by SQLite's `LIKE` operator (default behavior).

## 📊 Database Schema (Part B)
I chose **SQLite** for this project because it provides the structure and relational integrity required for the Supplier-Inventory relationship (Foreign Keys) while remaining serverless and portable.

### Schema:
- **Suppliers**: `id` (PK), `name`, `city`
- **Inventory**: `id` (PK), `supplier_id` (FK), `product_name`, `category`, `quantity`, `price`

## 📈 Performance Improvements for Large Datasets
1. **Indexing**: Adding an index on `product_name` and `supplier_id` columns would dramatically speed up search and join operations as the dataset grows.
2. **Pagination**: For datasets with thousands of records, I would implement `LIMIT` and `OFFSET` in the SQL queries to fetch data in small chunks rather than loading everything at once.
3. **Full-Text Search (FTS)**: Implementing SQLite's FTS5 extension or a tool like Elasticsearch would allow for even more complex search features (fuzzy matching, relevance scoring).

## 🛠️ How to Run Locally
1. Clone the repository.
2. Install dependencies: `npm install`
3. Seed the database: `node seed.js`
4. Start the server: `node server.js`
5. Open `http://localhost:5000` in your browser.
