import axios from 'axios';
import Config from '@/config'


const instance = axios.create({
  baseURL: Config.baseURL,
  timeout: 5000
});

instance.interceptors.request.use( (config) =>{
    return config;
  }, function (error) {
    return Promise.reject(error);
  });


instance.interceptors.response.use( (response)=> {
    return response.data;
  }, function (error) {

    return Promise.reject(error);
  });

export default instance;
