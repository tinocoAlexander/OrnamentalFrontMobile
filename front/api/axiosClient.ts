import axios from 'axios';
const api = axios.create({
  baseURL: 'https://ornamentalbackmobile-production.up.railway.app',
});
export default api;
