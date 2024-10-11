// src/app.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cryptoRoutes = require('./routes/cryptoRoutes');
const fetchCryptoData = require('./jobs/fetchCryptoData');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Body parser middleware
app.use(express.json());

// Routes
app.use('/api/crypto', cryptoRoutes);

// Start background job to fetch cryptocurrency data
fetchCryptoData();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
