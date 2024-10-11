// src/controllers/cryptoController.js
const CoinData = require('../models/CoinData');
const calculateDeviation = require('../utils/calculateDeviation');

// Get latest stats for a specific coin
const getCryptoStats = async (req, res) => {
  const { coin } = req.query;

  try {
    const latestData = await CoinData.findOne({ coin }).sort({ timestamp: -1 });

    if (!latestData) {
      return res.status(404).json({ message: 'No data found for the requested coin' });
    }

    res.json({
      price: latestData.price,
      marketCap: latestData.marketCap,
      '24hChange': latestData['24hChange'],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get standard deviation of prices for the last 100 records of a specific coin
const getCryptoDeviation = async (req, res) => {
  const { coin } = req.query;

  try {
    const priceRecords = await CoinData.find({ coin }).sort({ timestamp: -1 }).limit(100).select('price');
    const prices = priceRecords.map(record => record.price);

    if (prices.length === 0) {
      return res.status(404).json({ message: 'Not enough data for deviation calculation' });
    }

    const deviation = calculateDeviation(prices);

    res.json({ deviation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getCryptoStats,
  getCryptoDeviation,
};
