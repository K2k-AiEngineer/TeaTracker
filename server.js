
// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors'); // Import the CORS package
const app = express();
const port = 3000;

// Middleware for CORS
app.use(cors());

// Connect to MongoDB
const uri = process.env.MONGO_DB_URL;

// Connect to MongoDB Atlas
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Entry Schema and Model
const entrySchema = new mongoose.Schema({
    date: String,
    time: String,
    snackType: String,
    numSnacks: Number,
    price:Number,
    cups: Number,
    cost: Number
});
const Entry = mongoose.model('Entry', entrySchema);

// Middleware for parsing JSON
app.use(bodyParser.json());

// Get all entries
app.get('/logs', async (req, res) => {
    try {
        const logs = await Entry.find();
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new entry
app.post('/logs', async (req, res) => {
    const newEntry = new Entry(req.body);
    try {
        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an entry
app.put('/logs/:id', async (req, res) => {
    try {
        const updatedEntry = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an entry
app.delete('/logs/:id', async (req, res) => {
    try {
        const deletedEntry = await Entry.findByIdAndDelete(req.params.id);
        res.json({ message: 'Entry deleted', data: deletedEntry });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
