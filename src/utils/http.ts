import axios from "axios";

export const httpSpring = axios.create({
  baseURL: 'https://sapi.naigos.cn/',
  timeout: 30000,
})
