const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;
const SECRET_KEY = "your_secret_key"; // Change this to a strong secret key

app.use(cors());
app.use(bodyParser.json());

let users = []; // Temporary in-memory storage

// Register Endpoint
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = { name, email, password: hashedPassword };
    users.push(newUser);

    res.status(201).json({ message: "User registered successfully" });
});

// Login Endpoint
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
