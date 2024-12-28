import axios from "axios";

export const httpSpring = axios.create({
  baseURL: 'https://sapi.naigos.cn/',
  // baseURL: 'http://localhost:52100/',
  timeout: 30000,
})
