import * as types from '../mutation-types';
import Fetch from '../http';

const mutations={
  [types.LOGIN_USER]:(state, data) => {
    state.userInfo = data;
    localStorage.setItem('user',JSON.stringify(data));
    Fetch.updateToken(data.token);
  }
}





export default mutations;
