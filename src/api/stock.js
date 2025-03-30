// src/api/stock.js
import axios from './axios';

export const fetchStocks = () => {
  return axios.get('/stocks');
};

export const createStock = (stock) => {
  return axios.post('/stocks', stock);
};
