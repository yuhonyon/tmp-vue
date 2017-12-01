import axios from 'axios';
import Vue from "@/main"
import Config from '@/config'

const getToken=()=>{
  if (localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user')).token
    }
    return ''
}

const instance = axios.create({
  baseURL: Config.baseURL,
  timeout: 5000,
  headers: {'X-auth-token': getToken()},
});

instance.updateToken = (token) => {
    instance.defaults.headers['X-auth-token'] = token||getToken()
}



let loading;
let loadingNum=0;
instance.interceptors.request.use( (config) =>{
  if(!config.headers['X-auth-token']){
    instance.updateToken()
  }

    if(loadingNum<=0){
      loadingNum=0;
      loading=Vue.$Message.loading({
          content: 'Loading...',
          duration: 5
      });
    }
    loadingNum++;
    return config;
  }, function (error) {

    return Promise.reject(error);
  });


instance.interceptors.response.use( (response)=> {
    setTimeout(function(){
      loadingNum--;
      if(loading&&loadingNum<=0){
        loading()
      }
    },300)
    return response.data;
  }, function (error) {
    setTimeout(function(){
      loadingNum--;
      if(loading&&loadingNum<=0){
        loading()
      }
    },500)
    if (error.code === 'ECONNABORTED') {
        Vue.$Message.error('网络连接超时');
    } else if (error.message == 'Request failed with status code 403'){
        Vue.$Message.error("登录超时,请重新重登")
        setTimeout(() => {
            Vue.$router.replace('./login');
        }, 1000)
    }else if(error.response&&error.response.data&&error.response.data.message){
      setTimeout(function(){
        Vue.$Message.error(error.response.data.message)
      },300);
    }

    return Promise.reject(error);
  });

export default instance;
