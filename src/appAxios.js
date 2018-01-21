import Axios from 'axios';

export default Axios.create({
  baseURL: process.env.MAIN_DOMAIN_URL,
  timeout: 1000,
});
