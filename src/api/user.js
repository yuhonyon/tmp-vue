import Fetch from './http';

export const fetchLogin=function(params){
  return Fetch.post('user/login',params)
}
