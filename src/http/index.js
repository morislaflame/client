import axios from 'axios';

const $host = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

// Add the ngrok header to $host
// $host.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

const $authHost = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

// Add the ngrok header to $authHost
// $authHost.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

const authInterceptor = config => {
  config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
};

$authHost.interceptors.request.use(authInterceptor);

export {
  $host,
  $authHost
};
