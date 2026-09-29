import axios from 'axios';
import { API_URL } from '../config/env';
import { tokenStorage } from '../storage/tokenStorage';

export const httpClient = axios.create({ baseURL: API_URL, timeout: 15000 });

httpClient.interceptors.request.use(async (config) => {
  const token = await tokenStorage.get();
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});
