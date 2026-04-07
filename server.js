const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDb } = require('./db/connection');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Zeerostock Backend (SQLite) is running' });
});

// Initialize DB and Start Server
initDb()
    .then(() => {
        console.log('Database initialized successfully');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Frontend available at http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to initialize database:', err);
    });
