import * as actions from './actions'
import mutations from './mutations'
import * as getters from './getters'

const state={
  userInfo:JSON.parse(localStorage.getItem('user'))||{}
}

export default{
  state,
  mutations,
  actions,
  getters
}
