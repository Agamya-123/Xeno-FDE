const axios = require('axios');

// Replace with user's backend URL if known, or use localhost for testing logic
const BACKEND_URL = 'https://xeno-fde-k4n7.onrender.com'; 

async function testBackend() {
  try {
    console.log('Testing root endpoint...');
    const root = await axios.get(BACKEND_URL + '/');
    console.log('Root status:', root.status, root.data);

    console.log('Testing auth endpoint (empty body)...');
    try {
      await axios.post(BACKEND_URL + '/api/auth/login', {});
    } catch (e) {
      console.log('Auth error as expected:', e.response ? e.response.status : e.message);
      if (e.response && e.response.data) {
        console.log('Auth error data:', e.response.data);
      }
    }

  } catch (error) {
    console.error('Backend seems down:', error.message);
  }
}

testBackend();
