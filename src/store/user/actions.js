import * as types from '../mutation-types'
import * as fetchApi from "./api.js"
export const loginUser = ({commit},params) => {
  return fetchApi.fetchLogin(params).then(data=>{
    commit(types.LOGIN_USER,data);
    return data;
  })
};
