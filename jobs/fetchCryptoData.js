const axios = require('axios');
const CoinData = require('../models/CoinData');
const cron = require('node-cron');

const fetchCryptoData = async () => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          ids: 'bitcoin,ethereum,matic-network',
        },
      }
    );

    const coins = response.data;

    for (const coin of coins) {
      await CoinData.create({
        coin: coin.id,
        price: coin.current_price,
        marketCap: coin.market_cap,
        '24hChange': coin.price_change_percentage_24h,
      });
    }

    console.log('Cryptocurrency data fetched and stored in DB');
  } catch (error) {
    console.error('Error fetching cryptocurrency data:', error);
  }
};

// Schedule the job to run every 2 hours
cron.schedule('0 */2 * * *', fetchCryptoData);

module.exports = fetchCryptoData;
