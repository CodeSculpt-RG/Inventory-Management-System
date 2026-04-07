const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'inventory.db');
const db = new sqlite3.Database(dbPath);

function initDb() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Suppliers table
            db.run(`CREATE TABLE IF NOT EXISTS suppliers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                city TEXT NOT NULL
            )`);

            // Inventory table
            db.run(`CREATE TABLE IF NOT EXISTS inventory (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                supplier_id INTEGER NOT NULL,
                product_name TEXT NOT NULL,
                category TEXT NOT NULL,
                quantity INTEGER NOT NULL DEFAULT 0,
                price REAL NOT NULL,
                FOREIGN KEY (supplier_id) REFERENCES suppliers (id)
            )`, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
}

module.exports = { db, initDb };
