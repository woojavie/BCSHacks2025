const express = require('express');
const http = require('http');
const bcrypt = require('bcrypt'); // npm install bcrypt
const app = express();

const hostname = 'localhost';
const port = 8080;

app.use(express.json());

const users = [];

// for home page
app.get('/', (req, res) => {
        res.send(`
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            background-color: #f4f4f4;
                        }
                        .wrapper {
                            background: white;
                            padding: 2rem;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            text-align: center;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                        }
                        .button-row {
                            display: flex;
                            gap: 1rem;
                            margin-top: 1rem;
                        }
                        form {
                            margin: 0;
                        }
                        h1 {
                            margin-bottom: 1rem;
                        }
                        button {
                            padding: 0.5rem 1.5rem;
                            background-color: #4CAF50;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 1rem;
                        }
                        button:hover {
                            background-color: #45a049;
                        }
                    </style>
                </head>
                <body>
                    <div class="wrapper">
                        <h1>Vibeify</h1>
                        <div class="button-row">
                            <form method="POST" action="/signup">
                                <button type="submit">Sign Up</button>
                            </form>
                            <form method="POST" action="/login">
                                <button type="submit">Log In</button>
                            </form>
                        </div>
                    </div>
                </body>
            </html>
        `);
    });
    
    

    
    

// Signup route
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });
});


// Catch-all route
app.use((req, res) => {
    res.status(404).send('Not Found');
});

const sample_server = http.createServer(app);
sample_server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


