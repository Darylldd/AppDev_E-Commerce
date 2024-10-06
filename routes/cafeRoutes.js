const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const router = express.Router();

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Rename file to avoid collisions
    }
});

const upload = multer({ storage: storage });

// 1. Root Route - Home Page
router.get('/', (req, res) => {
    const db = req.db;
    db.query('SELECT id, name, description, CAST(price AS DECIMAL(10,2)) AS price, image_path FROM products', (err, results) => {
        if (err) throw err;
        res.render('index', { products: results });
    });
});

// 2. Sign Up Routes
router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    const db = req.db;

    // Check if user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            return res.send('User with this email already exists. <a href="/signup">Try again</a>');
        } else {
            const hashedPassword = bcrypt.hashSync(password, 10);
            db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err) => {
                if (err) throw err;
                res.redirect('/login');
            });
        }
    });
});

// 3. Login Routes
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const db = req.db;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) throw err;
        if (results.length > 0 && bcrypt.compareSync(password, results[0].password)) {
            req.session.user = results[0];
            res.redirect('/menu');
        } else {
            res.send('Invalid email or password. <a href="/login">Try again</a>');
        }
    });
});

// 4. Menu Route
router.get('/menu', isAuthenticated, (req, res) => {
    const db = req.db;
    const searchQuery = req.query.search;

    let query = 'SELECT id, name, description, price, image_path FROM products';

    if (searchQuery) {
        query += ` WHERE name LIKE '%${searchQuery}%'`;
    }

    db.query(query, (err, results) => {
        if (err) throw err;
        res.render('menu', { products: results, searchQuery: searchQuery });
    });
});

router.get('/table', isAuthenticated, (req, res) => {
    const db = req.db;
    const searchQuery = req.query.search;

    let query = 'SELECT id, name, description, price, image_path FROM products';

    if (searchQuery) {
        query += ` WHERE name LIKE '%${searchQuery}%'`;
    }

    db.query(query, (err, results) => {
        if (err) throw err;
        res.render('table', { products: results, searchQuery: searchQuery });
    });
});
// 5. Add Product Routes
router.get('/add-product', (req, res) => {
    res.render('add-product'); // Render the add product form
});

router.post('/add-product', upload.single('image'), (req, res) => {
    const { name, description, price } = req.body;
    const db = req.db;

    // Check if the image was uploaded and get the path
    const imagePath = req.file ? req.file.path : null;

    if (!imagePath) {
        return res.status(400).send('Image upload failed. Please try again.');
    }

    // Insert the new product into the database along with the image path
    db.query('INSERT INTO products (name, description, price, image_path) VALUES (?, ?, ?, ?)',
        [name, description, price, imagePath],
        (err) => {
            if (err) throw err;
            res.redirect('/menu'); // Redirect back to the menu after adding the product
        }
    );
});

// 5. Edit Product Routes
router.get('/edit-product/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;
    const db = req.db;

    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.render('edit-product', { product: results[0] });
    });
});

router.post('/edit-product/:id', upload.single('image'), (req, res) => {
    const id = req.params.id;
    const { name, description, price } = req.body;
    const db = req.db;
    const imagePath = req.file ? req.file.path : null;

    // Update the product in the database
    const updateQuery = imagePath ?
        'UPDATE products SET name = ?, description = ?, price = ?, image_path = ? WHERE id = ?' :
        'UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?';

    const queryValues = imagePath ?
        [name, description, price, imagePath, id] :
        [name, description, price, id];

    db.query(updateQuery, queryValues, (err) => {
        if (err) throw err;
        res.redirect('/menu');
    });
});

// Route to handle product deletion
router.get('/delete-product/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;
    const db = req.db;

    db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/menu');
    });
});

// Route to handle adding items to the cart (POST /cart)
router.post('/cart', (req, res) => {
    const db = req.db;
    const productId = req.body.productId;
    const quantity = req.body.quantity;

    // Query to get the product from the database
    db.query('SELECT id, name, description, CAST(price AS DECIMAL(10,2)) AS price FROM products WHERE id = ?', [productId], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const product = results[0];
            // Ensure price is a number
            const price = Number(product.price);

            // Check for session cart
            if (!req.session.cart) {
                req.session.cart = [];
            }

            // Create cart item
            const cartItem = {
                product: {
                    id: product.id,
                    name: product.name,
                    price: price,  // Ensure price is stored as a number
                },
                quantity: parseInt(quantity),  // Ensure quantity is a number
            };

            req.session.cart.push(cartItem);
            res.redirect('/cart');  // Redirect to cart page
        } else {
            res.status(404).send('Product not found');
        }
    });
});

router.get('/cart', (req, res) => {
    const cartItems = req.session.cart || [];

    // Check if all cart items have a valid product object
    const hasValidItems = cartItems.every(item => item.product && typeof item.product.price === 'number');

    // Calculate total only if all items are valid
    const total = hasValidItems ? cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) : 0;

    res.render('cart', { items: cartItems, total: total });  // Pass total to the view
});

// 7. Checkout Route
router.post('/checkout', isAuthenticated, (req, res) => {
    const db = req.db;
    const userId = req.session.user.id;
    const cart = req.session.cart;

    if (!cart || cart.length === 0) return res.redirect('/menu');

    // Calculate total
    let total = 0;
    const productIds = cart.map(item => item.product.id);
    db.query('SELECT * FROM products WHERE id IN (?)', [productIds], (err, products) => {
        if (err) throw err;

        cart.forEach(item => {
            const product = products.find(p => p.id === item.product.id);
            if (product) {
                total += product.price * item.quantity;
            }
        });

        // Insert order
        db.query('INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)', [userId, total, 'pending'], (err, result) => {
            if (err) throw err;

            // Save last order ID in session
            req.session.lastOrderId = result.insertId;

            const orderId = result.insertId;

            // Insert order items
            const orderItems = cart.map(item => [orderId, item.product.id, item.quantity]);
            db.query('INSERT INTO order_items (order_id, product_id, quantity) VALUES ?', [orderItems], (err) => {
                if (err) throw err;

                // Clear cart and redirect to payment page
                req.session.cart = [];
                res.redirect(`/payment?total=${total}`); // Redirect to payment page with total
            });
        });
    });
});

// 8. Success Page Route
router.get('/success', isAuthenticated, (req, res) => {
    res.render('success');
});

router.get('/orders', isAuthenticated, (req, res) => {
    const db = req.db;
    const userId = req.session.user.id; // Use req.session.user.id to get the user ID

    db.query('SELECT id, total, status, created_at FROM orders WHERE user_id = ? ORDER BY id ASC', [userId], (err, results) => {
        if (err) throw err;

        // Ensure each order's total is treated as a number
        const orders = results.map(order => ({
            id: order.id,
            total: Number(order.total),  // Convert total to number
            status: order.status,
            created_at: order.created_at
        }));

        res.render('orders', { orders: orders }); // Render orders.ejs with the latest orders
    });
});


// 9. Payment Page Route
router.get('/payment', isAuthenticated, (req, res) => {
    const total = req.query.total; // Get the total amount from the query parameter
    const lastOrderId = req.session.lastOrderId; // Get last order ID from session

    if (!total || !lastOrderId) {
        return res.redirect('/orders'); // Redirect if no total or order ID
    }

    res.render('payment', { total: total, orderId: lastOrderId });
});

// 10. User Profile Route
router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.session.user });
});

// 11. Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error logging out.');
        }
        res.redirect('/login');
    });
});

// Placeholder for processing payment
// Placeholder for processing payment
router.post('/process-payment', isAuthenticated, (req, res) => {
    const { orderId } = req.body;

    // Implement payment processing logic here
    // For now, let's just redirect to a success page
    const db = req.db;

    // Update the order status to 'paid' after processing the payment
    db.query('UPDATE orders SET status = ? WHERE id = ?', ['paid', orderId], (err) => {
        if (err) throw err;

        // Redirect to the success page
        res.redirect('/success');
    });
});


module.exports = router;
