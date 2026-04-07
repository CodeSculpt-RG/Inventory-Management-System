const express = require('express');
const router = express.Router();
const { db } = require('../db/connection');

// POST /supplier
router.post('/suppliers', (req, res) => {
    const { name, city } = req.body;
    if (!name || !city) {
        return res.status(400).json({ message: 'Name and city are required' });
    }

    db.run(`INSERT INTO suppliers (name, city) VALUES (?, ?)`, [name, city], function(err) {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ id: this.lastID, name, city });
    });
});

// POST /inventory
router.post('/inventory', (req, res) => {
    const { supplier_id, product_name, category, quantity, price } = req.body;

    // Validation
    if (!supplier_id || !product_name || !category || quantity === undefined || price === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (quantity < 0) return res.status(400).json({ message: 'Quantity must be 0 or more' });
    if (price <= 0) return res.status(400).json({ message: 'Price must be greater than 0' });

    // Check if supplier exists
    db.get(`SELECT id FROM suppliers WHERE id = ?`, [supplier_id], (err, supplier) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!supplier) return res.status(400).json({ message: 'Invalid supplier_id' });

        db.run(
            `INSERT INTO inventory (supplier_id, product_name, category, quantity, price) VALUES (?, ?, ?, ?, ?)`,
            [supplier_id, product_name, category, quantity, price],
            function(err) {
                if (err) return res.status(500).json({ message: err.message });
                res.status(201).json({ id: this.lastID, supplier_id, product_name, category, quantity, price });
            }
        );
    });
});

// GET /inventory (All)
router.get('/inventory', (req, res) => {
    const query = `
        SELECT i.*, s.name as supplier_name 
        FROM inventory i 
        JOIN suppliers s ON i.supplier_id = s.id
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
});

// GET /search (Part A)
router.get('/search', (req, res) => {
    const { q, category, minPrice, maxPrice } = req.query;
    let query = `
        SELECT i.*, s.name as supplier_name 
        FROM inventory i 
        JOIN suppliers s ON i.supplier_id = s.id
    `;
    let conditions = [];
    let params = [];

    if (q) {
        conditions.push(`i.product_name LIKE ?`);
        params.push(`%${q}%`);
    }

    if (category) {
        conditions.push(`i.category = ?`);
        params.push(category);
    }

    if (minPrice) {
        conditions.push(`i.price >= ?`);
        params.push(Number(minPrice));
    }

    if (maxPrice) {
        conditions.push(`i.price <= ?`);
        params.push(Number(maxPrice));
    }

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    // Range validation
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
        return res.status(400).json({ message: 'Invalid price range: minPrice cannot be greater than maxPrice' });
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
});

// GET /insights (Part B - Grouped Query)
router.get('/insights', (req, res) => {
    const query = `
        SELECT 
            s.id as supplierId, 
            s.name as supplierName, 
            COUNT(i.id) as itemCount,
            SUM(i.quantity * i.price) as totalValue
        FROM suppliers s
        JOIN inventory i ON s.id = i.supplier_id
        GROUP BY s.id, s.name
        ORDER BY totalValue DESC
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
});

module.exports = router;
