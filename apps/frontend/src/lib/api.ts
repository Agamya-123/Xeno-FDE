import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const ingestData = async (tenantId: string) => {
  const response = await axios.post(`${API_URL}/ingest`, { tenantId });
  return response.data;
};

export const getDashboardData = async (tenantId: string) => {
  const response = await axios.get(`${API_URL}/dashboard/${tenantId}`);
  return response.data;
};
