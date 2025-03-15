const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const JSONBIN_ID = "67d5f2f68a456b79667684ef"; // Create a bin on jsonbin.io
const JSONBIN_API_KEY = "$2a$10$Wx4sw3HONenPzE4QUm/c6OU2vJK3XfsUN1bCbzsvNbJAFtRwXvC/m"; // Get from jsonbin.io

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Fetch posts from JSONBin
app.get('/posts', async (req, res) => {
    try {
        const response = await axios.get(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
            headers: { 'X-Master-Key': JSONBIN_API_KEY }
        });
        res.json(response.data.record);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

// Add a new post
app.post('/posts', async (req, res) => {
    try {
        // Fetch existing posts
        const response = await axios.get(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
            headers: { 'X-Master-Key': JSONBIN_API_KEY }
        });

        let posts = response.data.record || [];
        const newPost = { title: req.body.title, content: req.body.content, createdAt: new Date() };
        posts.push(newPost);

        // Save the updated posts
        await axios.put(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, posts, {
            headers: {
                'X-Master-Key': JSONBIN_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "Failed to save post" });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
