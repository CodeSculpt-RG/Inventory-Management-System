# Zeerostock | Inventory Search & Management System

A professional-grade full-stack application for searching surplus inventory and managing supplier insights. Built with Node.js, Express, and SQLite with a premium glassmorphism theme.

## 🚀 Features
- **Advanced Search**: Case-insensitive partial matching, category filtering, and price ranges.
- **Supplier Insights**: Aggregated data analysis showing inventory value grouped by supplier.
- **Premium UI**: Dark-themed glassmorphism dashboard with smooth micro-interactions.
- **Relational DB**: Efficient SQLite integration with foreign key constraints.

## 🛠️ Tech Stack
- **Backend**: Node.js, Express
- **Database**: SQLite (Relational)
- **Frontend**: Vanilla JS, HTML5, CSS3 (Glassmorphism)

## 📦 Getting Started
1. `npm install`
2. `node seed.js` (to populate initial data)
3. `node server.js`
4. Open `http://localhost:5000`

## 📈 Performance Tip for Large Datasets
For scaling to millions of records, I would implement **Indexed Search** on `product_name` and `category` fields and use **Pagination** (LIMIT/OFFSET) to ensure the UI remains fast and responsive.

---
*Created as a production-ready assignment submission.*
