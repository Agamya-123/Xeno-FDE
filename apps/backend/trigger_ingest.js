const axios = require('axios');

async function ingest() {
  try {
    console.log('Triggering ingestion...');
    const response = await axios.post('http://localhost:4000/api/ingest', {
      tenantId: 'dc80542d-3084-42d4-9259-7279ea60a206'
    });
    console.log('Ingestion successful:', response.data);
  } catch (error) {
    console.error('Ingestion failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

ingest();
