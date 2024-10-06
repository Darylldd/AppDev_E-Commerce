// app.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2');
const path = require('path');
const cafeRoutes = require('./routes/cafeRoutes');

const app = express();



// Setup body-parser
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

// Setup EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Setup session
app.use(session({
    secret: 'mysecretkey', // Change this to a strong secret in production
    resave: false,
    saveUninitialized: false
}));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'cafe_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err.message);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});

// Make the database accessible to routers
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Use the routes from cafeRoutes.js
app.use('/', cafeRoutes);

// Handle 404 - Page Not Found
app.use((req, res, next) => {
    res.status(404).send('404 - Page Not Found');
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
