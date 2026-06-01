import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL;
console.log('API base URL:', BASE);

export const publicApi = axios.create({ baseURL: BASE });

export const privateApi = () => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('ideavault_token')
      : '';
  return axios.create({
    baseURL: BASE,
    headers: { Authorization: `Bearer ${token}` },
  });
};