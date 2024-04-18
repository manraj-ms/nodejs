const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Secret key for JWT
const JWT_SECRET = 'randomkey';

//Token expiry
// const TOKEN_EXPIRATION_TIME = 60;

// making sql connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'class'
});

// connecting to mysql
connection.connect(err => {
    try {
        if (err) {
            throw new Error('Error connecting to MySQL database: ' + err);
        }
        console.log('Connected to MySQL database');
    } catch (err) {
        console.error(err.message);
    }
});

// validating email format using regex
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// checking password length and presence of special character
function validatePassword(password) {
    return password.length >= 7 && /[!@#$%^&*(),.?":{}|<>]/.test(password);
}

// verifying mobile number format
function validateMobileNumber(mobile_number) {
    const mobileRegex = /^[9]+\d{9}$/;
    return mobileRegex.test(mobile_number);
}

// variable to store the token value
let loggedInToken = null; 

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    // Query to check if the user exists in the database
    const selectQuery = 'SELECT * FROM login WHERE email = ? AND password = ?';
    const values = [email, password];

    try {
        const results = await queryDatabase(selectQuery, values);
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT token for authentication with expiration time of 5 seconds
        loggedInToken = jwt.sign({ email: results[0].email }, JWT_SECRET);
        res.json({ message: 'Login successful', token: loggedInToken });

        // Set new timeout to clear loggedInToken after expiration
        setTimeout(() => {
            loggedInToken = null;
        }, 5000);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout route
app.post('/logout', async (req, res) => {
    // Check if a token is logged in
    if (!loggedInToken) {
        console.log("No user logged in");
        return res.status(401).json({ error: "No user logged in" });
    }

    // Print the token value
    console.log("Token of the logged-in user:", loggedInToken);

    // Clear the token value (logout)
    loggedInToken = null;
    // Clear the expiration timeout
    res.json({ message: "Logout successful" });
});


// Registration route
app.post('/register', async (req, res) => {
    const { name, email, address, password, mobile_number } = req.body;

    // Validate input fields
    if (!name || !email || !address || !password || !mobile_number) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (name.length < 3) {
        return res.status(400).json({ error: "Name must be at least 3 characters long" });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    if (address.length < 10) {
        return res.status(400).json({ error: "Address must be at least 10 characters long" });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ error: "Password must be at least 7 characters long and contain at least one special character" });
    }

    if (!validateMobileNumber(mobile_number)) {
        return res.status(400).json({ error: "Invalid mobile number" });
    }

    // Check if the email already exists in the database
    const emailExistsQuery = 'SELECT * FROM login WHERE email = ?';
    const emailExistsValues = [email];

    try {
        const emailExistsResult = await queryDatabase(emailExistsQuery, emailExistsValues);
        if (emailExistsResult.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }

    // Insert user data into the database
    const insertQuery = 'INSERT INTO login (name, email, address, password, mobile_number) VALUES (?, ?, ?, ?, ?)';
    const values = [name, email, address, password, mobile_number];

    try {
        await queryDatabase(insertQuery, values);
        res.json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Function to execute SQL queries
function queryDatabase(query, values) {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

//in case of successful connection to postman
app.get('/test', (req, res) => {
    res.send('connected successfully');
});

//checking if we have specified a port in env file, in our case we haven't so 3000 is used 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});